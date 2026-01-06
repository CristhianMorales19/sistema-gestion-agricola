/*
 * Controlador de Asistencia
 * Maneja las solicitudes HTTP para operaciones de asistencia
 */

import { Request, Response } from 'express';
import { AttendanceService } from '../../application/AttendanceService';
import { PrismaAttendanceRepository } from '../../infrastructure/PrismaAttendanceRepository';
import { createLocalDateTime, getTodayString } from '../../application/dateTimeUtils';
import {
  registerEntrySchema,
  registerExitSchema,
  updateAttendanceSchema,
  getAttendanceFiltersSchema,
  RegisterEntryInput,
  RegisterExitInput,
  UpdateAttendanceInput
} from '../../infrastructure/validation';
import {
  WorkerNotFoundError,
  ActiveEntryExistsError,
  NoActiveEntryError,
  AttendanceNotFoundError,
  AttendanceError
} from '../../domain/AttendanceError';
import { z } from 'zod';

export class AttendanceController {
  private readonly repository: PrismaAttendanceRepository;
  private readonly service: AttendanceService;

  constructor() {
    this.repository = new PrismaAttendanceRepository();
    this.service = new AttendanceService(this.repository);
  }

  /**
   * Transforma un objeto Attendance a formato esperado por frontend
   * Convierte campos de camelCase a snake_case y formatea tiempos
   */
  private formatAttendanceForResponse(attendance: any): any {
    const primitives = attendance.toPrimitives();
    
    // Usar getUTC* porque guardamos como "fake UTC" para preservar hora local
    const formatTimeString = (date: Date | null | undefined): string | null => {
      if (!date) return null;
      const d = new Date(date);
      const hours = String(d.getUTCHours()).padStart(2, '0');
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Obtener fecha_at desde el objeto preservado o extraer de entryTime
    const fecha_at = (attendance as any)._fecha_at 
      ? new Date((attendance as any)._fecha_at).toISOString().split('T')[0]
      : (primitives.entryTime ? new Date(primitives.entryTime).toISOString().split('T')[0] : null);

    return {
      asistencia_id: primitives.attendanceId,
      trabajador_id: primitives.workerId,
      fecha_at: fecha_at,
      hora_entrada_at: formatTimeString(primitives.entryTime),
      hora_salida_at: formatTimeString(primitives.exitTime),
      ubicacion_entrada: primitives.location,
      horas_trabajadas: primitives.workedHours,
      observaciones_salida: primitives.notes,
      estado: primitives.status,
      created_at: primitives.createdAt ? new Date(primitives.createdAt).toISOString() : null,
      updated_at: primitives.updatedAt ? new Date(primitives.updatedAt).toISOString() : null,
      deleted_at: primitives.deletedAt ? new Date(primitives.deletedAt).toISOString() : null
    };
  }

  /*
   * POST /api/attendance/entry
   * Registrar entrada de trabajador
   */
  async registerEntry(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerEntrySchema.parse(req.body);
      
      // Obtener ID del trabajador de múltiples fuentes
      let workerId = req.params.workerId 
        ? parseInt(req.params.workerId) 
        : (validatedData.trabajador_id || (req as any).user?.workerId);

      if (!workerId) {
        res.status(400).json({
          success: false,
          message: 'ID del trabajador es requerido'
        });
        return;
      }

      // Mapear los campos de entrada (soportar múltiples nombres)
      const location = validatedData.ubicacion || validatedData.location;
      const notes = validatedData.notes;
      const entryTime = validatedData.horaEntrada || validatedData.hora_entrada;
      const fecha = validatedData.fecha;

      const attendance = await this.service.registerEntry(
        workerId,
        location,
        notes,
        entryTime,
        fecha
      );

      res.status(201).json({
        success: true,
        message: 'Entrada registrada exitosamente',
        data: {
          attendance: attendance.toPrimitives()
        }
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * POST /api/attendance/:id/exit
   * Registrar salida de trabajador
   */
  async registerExit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = registerExitSchema.parse(req.body);

      // Obtener ID de asistencia de múltiples fuentes
      let attendanceId = parseInt(id) || validatedData.asistencia_id;

      if (!attendanceId || isNaN(attendanceId)) {
        res.status(400).json({
          success: false,
          message: 'ID de asistencia es requerido'
        });
        return;
      }

      // Mapear los campos de salida (soportar múltiples nombres)
      const notes = validatedData.observacion || validatedData.notes;
      const exitTime = validatedData.horaSalida || validatedData.hora_salida;

      const attendance = await this.service.registerExit(
        attendanceId,
        notes,
        exitTime
      );

      res.json({
        success: true,
        message: 'Salida registrada exitosamente',
        data: {
          attendance: attendance.toPrimitives()
        }
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * GET /api/attendance/:id
   * Obtener asistencia por ID
   */
  async getAttendanceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attendance = await this.service.getAttendanceById(parseInt(id));

      res.json({
        success: true,
        data: this.formatAttendanceForResponse(attendance)
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * GET /api/attendance/worker/:workerId
   * Obtener asistencias de un trabajador
   */
  async getWorkerAttendances(req: Request, res: Response): Promise<void> {
    try {
      const { workerId } = req.params;
      const { startDate, endDate } = req.query;

      let startDateObj: Date | undefined;
      let endDateObj: Date | undefined;

      if (startDate && typeof startDate === 'string') {
        startDateObj = new Date(startDate);
      }
      if (endDate && typeof endDate === 'string') {
        endDateObj = new Date(endDate);
      }

      const attendances = await this.service.getWorkerAttendances(
        parseInt(workerId),
        startDateObj,
        endDateObj
      );

      res.json({
        success: true,
        data: attendances.map(a => this.formatAttendanceForResponse(a))
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * GET /api/attendance/active/list
   * Obtener trabajadores con entrada activa
   */
  async getActiveWorkers(req: Request, res: Response): Promise<void> {
    try {
      const activeWorkers = await this.service.getActiveWorkers();

      res.json({
        success: true,
        data: activeWorkers.map(a => this.formatAttendanceForResponse(a)),
        count: activeWorkers.length
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * GET /api/attendance/worker/:workerId/active
   * Obtener entrada activa de un trabajador
   */
  async getWorkerActiveEntry(req: Request, res: Response): Promise<void> {
    try {
      const { workerId } = req.params;
      const activeEntry = await this.service.getActiveEntry(parseInt(workerId));

      res.json({
        success: true,
        data: activeEntry ? this.formatAttendanceForResponse(activeEntry) : null
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * GET /api/attendance
   * Obtener asistencias paginadas
   */
  async getAttendancesPaginated(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.service.getAttendancesPaginated(page, limit);

      const formattedData = result.data.map(a => this.formatAttendanceForResponse(a));

      res.json({
        success: true,
        data: formattedData,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        total: result.total
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * GET /api/attendance/worker/:workerId/statistics
   * Obtener estadísticas de un trabajador
   */
  async getWorkerStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { workerId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'startDate y endDate son requeridos'
        });
        return;
      }

      const stats = await this.service.getWorkerStatistics(
        parseInt(workerId),
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: {
          statistics: stats
        }
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * PUT /api/attendance/:id
   * Actualizar asistencia
   */
  async updateAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateAttendanceSchema.parse(req.body);

      // Verificar si es una reactivación (deleted_at viene en el body)
      const isReactivation = 'deleted_at' in req.body && req.body.deleted_at === null;

      let attendance;

      if (isReactivation) {
        // Para reactivación, usar el método especial que busca incluyendo eliminados
        const location = validatedData.location || validatedData.ubicacion;
        const horaEntrada = validatedData.hora_entrada_at || validatedData.horaEntrada;
        const notes = validatedData.notes || validatedData.observaciones_salida;

        // Parsear hora de entrada si existe, usando createLocalDateTime para evitar problemas de timezone
        let entryTime: Date | undefined;
        if (horaEntrada) {
          entryTime = createLocalDateTime(horaEntrada, getTodayString());
        }

        attendance = await this.service.updateAttendanceWithReactivation(parseInt(id), {
          entryTime,
          location,
          notes,
          deletedAt: null
        });
      } else {
        // Para actualización normal (registro activo)
        attendance = await this.service.getAttendanceById(parseInt(id));

        // Actualizar ubicación
        const location = validatedData.location || validatedData.ubicacion;
        if (location) {
          attendance = await this.service.updateAttendanceLocation(parseInt(id), location);
        }

        // Actualizar notas/observaciones
        const notes = validatedData.notes || validatedData.observaciones_salida;
        if (notes) {
          attendance = await this.service.updateAttendanceNotes(parseInt(id), notes);
        }

        // Actualizar hora de entrada
        const horaEntrada = validatedData.hora_entrada_at || validatedData.horaEntrada;
        if (horaEntrada) {
          attendance = await this.service.updateEntryTime(parseInt(id), horaEntrada);
        }

        // Actualizar hora de salida
        const horaSalida = validatedData.hora_salida_at || validatedData.horaSalida;
        if (horaSalida) {
          attendance = await this.service.updateExitTime(parseInt(id), horaSalida);
        }
      }

      res.json({
        success: true,
        message: 'Asistencia actualizada exitosamente',
        data: this.formatAttendanceForResponse(attendance)
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * DELETE /api/attendance/:id
   * Eliminar asistencia (soft delete)
   */
  async deleteAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.deleteAttendance(parseInt(id));

      res.json({
        success: true,
        message: 'Asistencia eliminada exitosamente'
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /*
   * Manejo de errores
   */
  private handleError(error: unknown, res: Response): void {
    console.error('Error en AttendanceController:', error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.errors
      });
      return;
    }

    if (error instanceof WorkerNotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (error instanceof AttendanceNotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (error instanceof ActiveEntryExistsError) {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (error instanceof NoActiveEntryError) {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (error instanceof AttendanceError) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : String(error)
    });
  }

  /*
   * Marcar trabajador como ausente
   */
  async markAsAbsent(req: Request, res: Response): Promise<void> {
    try {
      console.log('🎯 markAsAbsent - Inicio del controlador');
      console.log('📦 Body recibido:', req.body);
      
      const schema = z.object({
        trabajador_id: z.number(),
        fecha: z.string() // YYYY-MM-DD
      });

      const { trabajador_id, fecha } = schema.parse(req.body);
      console.log(`✅ Validación exitosa - Trabajador ID: ${trabajador_id}, Fecha: ${fecha}`);

      console.log('🔄 Llamando al servicio markAsAbsent...');
      await this.service.markAsAbsent(trabajador_id, fecha);
      console.log('✅ Servicio completado exitosamente');

      res.status(200).json({
        success: true,
        message: 'Trabajador marcado como ausente exitosamente'
      });
    } catch (error) {
      console.error('❌ Error en markAsAbsent:', error);
      this.handleError(error, res);
    }
  }
}
