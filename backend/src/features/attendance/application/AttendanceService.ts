/*
 * Servicio de Aplicación: Asistencia
 * Orquesta las operaciones de asistencia del dominio
 */

import { Attendance, IAttendanceRecord } from '../domain/Attendance';
import { IAttendanceRepository } from '../domain/AttendanceRepository';
import {
  WorkerNotFoundError,
  ActiveEntryExistsError,
  NoActiveEntryError,
  AttendanceNotFoundError
} from '../domain/AttendanceError';
import { PrismaClient } from '@prisma/client';
import {
  createLocalDateTime,
  createLocalDateTimeNow,
  getTodayString,
  isDateInFuture
} from './dateTimeUtils';

const prisma = new PrismaClient();

export class AttendanceService {
  constructor(private readonly attendanceRepository: IAttendanceRepository) {}

  /*
   * Registro de entrada
   */
  async registerEntry(
    workerId: number,
    location?: string,
    notes?: string,
    entryTime?: string,
    fecha?: string // YYYY-MM-DD
  ): Promise<Attendance> {
    // Validar que el trabajador existe
    const worker = await prisma.mom_trabajador.findFirst({
      where: {
        trabajador_id: workerId,
        deleted_at: null,
        is_activo: true
      }
    });

    if (!worker) {
      throw new WorkerNotFoundError();
    }

    // Obtener la fecha a usar (hoy si no se proporciona)
    const fechaToUse = fecha || getTodayString();
    
    // Validar que la fecha no sea futura
    if (isDateInFuture(fechaToUse)) {
      throw new Error('No se puede registrar asistencia para fechas futuras');
    }

    // Obtener la hora a usar (ahora si no se proporciona)
    const horaToUse = entryTime || new Date().toTimeString().slice(0, 5);
    
    // Crear fecha/hora usando utilidades que evitan conversión de zona horaria
    const finalEntryTime = createLocalDateTime(horaToUse, fechaToUse);

    // DEBUG: Log para verificar la conversión de fecha/hora
    console.log('🕐 DEBUG registerEntry:');
    console.log('  - entryTime recibido:', entryTime);
    console.log('  - horaToUse:', horaToUse);
    console.log('  - fechaToUse:', fechaToUse);
    console.log('  - finalEntryTime (Date):', finalEntryTime);
    console.log('  - finalEntryTime.toISOString():', finalEntryTime.toISOString());
    console.log('  - finalEntryTime.getUTCHours():', finalEntryTime.getUTCHours());
    console.log('  - finalEntryTime.getUTCMinutes():', finalEntryTime.getUTCMinutes());

    // Validar que no tenga entrada activa PARA ESTA FECHA
    const existingEntries = await this.attendanceRepository.findByWorkerIdAndDate(workerId, finalEntryTime);
    const hasEntryThisDay = existingEntries.length > 0;
    
    if (hasEntryThisDay) {
      throw new ActiveEntryExistsError();
    }

    // Crear nueva asistencia
    const newAttendance = await this.attendanceRepository.create({
      workerId,
      entryTime: finalEntryTime,
      location: location || null,
      workedHours: null,
      status: 'incompleta',
      notes: notes || null,
      createdAt: createLocalDateTimeNow(),
      updatedAt: createLocalDateTimeNow()
    });

    return newAttendance;
  }

  /*
   * Registro de salida
   */
  async registerExit(
    attendanceId: number,
    notes?: string,
    exitTime?: string
  ): Promise<Attendance> {
    // Verificar que existe la asistencia
    const attendance = await this.attendanceRepository.findById(attendanceId);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    // Validar que puede registrar salida
    if (!attendance.canRegisterExit()) {
      throw new NoActiveEntryError();
    }

    // Obtener la fecha de entrada para usarla en la salida
    const entryTime = attendance.getEntryTime();
    // Extraer la fecha en formato YYYY-MM-DD usando UTC (porque guardamos como fake UTC)
    const entryDateString = `${entryTime.getUTCFullYear()}-${String(entryTime.getUTCMonth() + 1).padStart(2, '0')}-${String(entryTime.getUTCDate()).padStart(2, '0')}`;
    
    // Obtener la hora a usar (ahora si no se proporciona)
    const horaToUse = exitTime || new Date().toTimeString().slice(0, 5);
    
    // Crear fecha/hora usando utilidades que evitan conversión de zona horaria
    const finalExitTime = createLocalDateTime(horaToUse, entryDateString);

    // Registrar salida (el repositorio recalculará horas_trabajadas automáticamente)
    const updatedAttendance = await this.attendanceRepository.registerExit(
      attendanceId,
      finalExitTime
    );

    // Actualizar notas si se proporcionan
    if (notes) {
      return await this.attendanceRepository.update(attendanceId, { notes });
    }

    return updatedAttendance;
  }

  /*
   * Obtener asistencia por ID
   */
  async getAttendanceById(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }
    return attendance;
  }

  /*
   * Obtener asistencia por ID incluyendo registros eliminados (para reactivación)
   */
  async getAttendanceByIdIncludeDeleted(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findByIdIncludeDeleted(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }
    return attendance;
  }

  /*
   * Obtener asistencias de un trabajador
   */
  async getWorkerAttendances(
    workerId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Attendance[]> {
    if (startDate && endDate) {
      return await this.attendanceRepository.findByWorkerIdAndDateRange(
        workerId,
        startDate,
        endDate
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.attendanceRepository.findByWorkerIdAndDateRange(workerId, today, tomorrow);
  }

  /*
   * Obtener trabajadores con entrada activa
   */
  async getActiveWorkers(): Promise<Attendance[]> {
    return await this.attendanceRepository.findAllActiveWorkers();
  }

  /*
   * Obtener entrada activa de un trabajador
   */
  async getActiveEntry(workerId: number): Promise<Attendance | null> {
    return await this.attendanceRepository.findActiveByWorkerId(workerId);
  }

  /*
   * Obtener asistencias paginadas
   */
  async getAttendancesPaginated(page: number, limit: number): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { data, total } = await this.attendanceRepository.getAllPaginated(page, limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /*
   * Obtener estadísticas de un trabajador
   */
  async getWorkerStatistics(
    workerId: number,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRecords: number;
    totalWorkedHours: number;
    averageHoursPerDay: number;
  }> {
    const totalRecords = await this.attendanceRepository.countByWorkerAndDateRange(
      workerId,
      startDate,
      endDate
    );

    const totalWorkedHours = await this.attendanceRepository.getTotalWorkedHoursByWorkerAndDateRange(
      workerId,
      startDate,
      endDate
    );

    const averageHoursPerDay = totalRecords > 0 ? totalWorkedHours / totalRecords : 0;

    return {
      totalRecords,
      totalWorkedHours,
      averageHoursPerDay: Math.round(averageHoursPerDay * 100) / 100
    };
  }

  /*
   * Actualizar notas de asistencia
   */
  async updateAttendanceNotes(id: number, notes: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    return await this.attendanceRepository.update(id, { notes });
  }

  /*
   * Actualizar ubicación de asistencia
   */
  async updateAttendanceLocation(id: number, location: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    return await this.attendanceRepository.update(id, { location });
  }

  /*
   * Actualizar hora de entrada
   */
  async updateEntryTime(id: number, entryTime: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    // Obtener la fecha del registro existente para mantenerla
    const existingEntryTime = attendance.getEntryTime();
    const existingDateString = `${existingEntryTime.getUTCFullYear()}-${String(existingEntryTime.getUTCMonth() + 1).padStart(2, '0')}-${String(existingEntryTime.getUTCDate()).padStart(2, '0')}`;
    
    // Crear nueva fecha/hora usando utilidades
    const newEntryTime = createLocalDateTime(entryTime, existingDateString);

    return await this.attendanceRepository.update(id, { entryTime: newEntryTime });
  }

  /*
   * Actualizar hora de salida
   */
  async updateExitTime(id: number, exitTime: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    // Obtener la fecha del registro existente para mantenerla
    const existingEntryTime = attendance.getEntryTime();
    const existingDateString = `${existingEntryTime.getUTCFullYear()}-${String(existingEntryTime.getUTCMonth() + 1).padStart(2, '0')}-${String(existingEntryTime.getUTCDate()).padStart(2, '0')}`;
    
    // Crear nueva fecha/hora usando utilidades
    const newExitTime = createLocalDateTime(exitTime, existingDateString);

    return await this.attendanceRepository.update(id, { exitTime: newExitTime });
  }

  /*
   * Actualizar asistencia con soporte para reactivación
   * Si se envía deleted_at: null en la actualización, se reactiva el registro
   */
  async updateAttendanceWithReactivation(
    id: number,
    data: {
      entryTime?: Date;
      location?: string;
      notes?: string;
      deletedAt?: null;
    }
  ): Promise<Attendance> {
    // Intentar obtener registro activo primero
    let attendance = await this.attendanceRepository.findById(id);
    
    // Si no existe activo pero se requiere reactivación, buscar eliminado
    if (!attendance && data.deletedAt === null) {
      attendance = await this.attendanceRepository.findByIdIncludeDeleted(id);
      if (!attendance) {
        throw new AttendanceNotFoundError();
      }
    }

    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    // Preparar datos para actualización
    const updateData: any = {};

    if (data.entryTime) {
      updateData.entryTime = data.entryTime;
    }

    if (data.location) {
      updateData.location = data.location;
    }

    if (data.notes) {
      updateData.notes = data.notes;
    }

    // Si se envía deleted_at: null, es una reactivación
    if (data.deletedAt === null) {
      updateData.deletedAt = null;
      // Limpiar datos de salida anterior al reactivar
      updateData.exitTime = null;
      updateData.exitNotes = null;
    }

    return await this.attendanceRepository.update(id, updateData);
  }

  /*
   * Eliminar registro de asistencia (soft delete)
   */
  async deleteAttendance(id: number): Promise<void> {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new AttendanceNotFoundError();
    }

    await this.attendanceRepository.delete(id);
  }

  /*
   * Marcar trabajador como ausente para una fecha específica
   * Si ya tiene registro, lo marca como eliminado
   * Si no tiene registro, crea uno marcado como eliminado
   */
  async markAsAbsent(workerId: number, fecha: string): Promise<void> {
    console.log(`🎯 AttendanceService.markAsAbsent - Trabajador ID: ${workerId}, Fecha: ${fecha}`);
    
    // Parsear la fecha como string local (no UTC) para ser consistente con registerEntry
    const [year, month, day] = fecha.split('-').map(Number);
    const fechaDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    
    // Validar que la fecha no sea futura
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth() + 1;
    const todayDay = now.getDate();
    const todayString = `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;
    
    if (fecha > todayString) {
      throw new Error('No se puede marcar como ausente para fechas futuras');
    }
    
    // Validar que el trabajador existe
    console.log('🔍 Validando que el trabajador existe...');
    const worker = await prisma.mom_trabajador.findFirst({
      where: {
        trabajador_id: workerId,
        deleted_at: null,
        is_activo: true
      }
    });

    if (!worker) {
      console.error(`❌ Trabajador ${workerId} no encontrado o inactivo`);
      throw new WorkerNotFoundError();
    }
    console.log(`✅ Trabajador encontrado: ${worker.nombre_completo}`);

    // Buscar si ya existe un registro para ese día
    console.log(`🔍 Buscando registros existentes para ${fecha}...`);
    const existingRecords = await this.attendanceRepository.findByWorkerIdAndDate(
      workerId,
      fechaDate
    );

    if (existingRecords && existingRecords.length > 0) {
      console.log(`📝 Registro existente encontrado (ID: ${existingRecords[0].getAttendanceId()}), marcándolo como eliminado...`);
      // Si ya existe, marcarlo como eliminado
      await this.attendanceRepository.delete(existingRecords[0].getAttendanceId());
      console.log('✅ Registro marcado como eliminado');
    } else {
      console.log('📝 No hay registro existente, creando nuevo registro marcado como ausente...');
      // Si no existe, crear uno y marcarlo como eliminado directamente en la BD
      const newRecord = await prisma.mot_asistencia.create({
        data: {
          trabajador_id: workerId,
          fecha_at: fechaDate,
          hora_entrada_at: fechaDate,  // Usar la misma fecha (hora 00:00:00)
          hora_salida_at: null,
          ubicacion_entrada: null,
          horas_trabajadas: null,
          estado: 'incompleta',
          observaciones_salida: 'Marcado como ausente',
          created_at: new Date(),
          updated_at: new Date(),
          created_by: 1,
          updated_by: null,
          deleted_at: new Date() // Marcado como eliminado desde el inicio
        }
      });
      console.log(`✅ Nuevo registro creado con ID: ${newRecord.asistencia_id}, fecha_at: ${newRecord.fecha_at}`);
    }
    console.log('🎉 markAsAbsent completado exitosamente');
  }
}
