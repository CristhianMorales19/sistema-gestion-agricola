/*
 * Repositorio Prisma: Asistencia
 * Implementación de persistencia para asistencia
 */

import { PrismaClient } from '@prisma/client';
import { Attendance, IAttendanceRecord } from '../domain/Attendance';
import { IAttendanceRepository } from '../domain/AttendanceRepository';
import { createLocalDateTimeNow } from '../application/dateTimeUtils';

const prisma = new PrismaClient();

export class PrismaAttendanceRepository implements IAttendanceRepository {
  async create(data: Omit<IAttendanceRecord, 'attendanceId'>): Promise<Attendance> {
    // La fecha de entrada ya viene con la hora correcta (fake UTC)
    // Extraer solo la fecha para fecha_at
    const entryDateOnly = new Date(Date.UTC(
      data.entryTime.getUTCFullYear(),
      data.entryTime.getUTCMonth(),
      data.entryTime.getUTCDate(),
      0, 0, 0, 0
    ));

    const created = await prisma.mot_asistencia.create({
      data: {
        trabajador_id: data.workerId,
        fecha_at: entryDateOnly,
        hora_entrada_at: data.entryTime,
        hora_salida_at: data.exitTime,
        ubicacion_entrada: data.location,
        horas_trabajadas: data.workedHours ? parseFloat(data.workedHours.toString()) : null,
        estado: 'incompleta',
        observaciones_salida: data.notes,
        created_at: createLocalDateTimeNow(),
        created_by: 1,
        deleted_at: null
      }
    });

    return this.mapToDomain(created);
  }

  async findById(id: number): Promise<Attendance | null> {
    const record = await prisma.mot_asistencia.findFirst({
      where: {
        asistencia_id: id,
        deleted_at: null
      }
    });

    return record ? this.mapToDomain(record) : null;
  }

  // Método para buscar registros incluyendo eliminados (necesario para reactivaciones)
  async findByIdIncludeDeleted(id: number): Promise<Attendance | null> {
    const record = await prisma.mot_asistencia.findFirst({
      where: {
        asistencia_id: id
      }
    });

    return record ? this.mapToDomain(record) : null;
  }

  async findByWorkerIdAndDate(workerId: number, date: Date): Promise<Attendance[]> {
    // Usar getUTC* porque las fechas se guardan como "fake UTC"
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD
    
    const records = await prisma.$queryRaw<any[]>`
      SELECT * FROM mot_asistencia
      WHERE trabajador_id = ${workerId}
      AND DATE(fecha_at) = ${dateString}
      AND deleted_at IS NULL
      ORDER BY hora_entrada_at DESC
    `;

    return records.map(r => this.mapToDomain(r));
  }

  async findActiveByWorkerId(workerId: number): Promise<Attendance | null> {
    // Obtener el inicio del día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await prisma.mot_asistencia.findFirst({
      where: {
        trabajador_id: workerId,
        estado: 'incompleta',
        hora_salida_at: null,
        hora_entrada_at: {
          gte: today,
          lt: tomorrow
        },
        deleted_at: null
      },
      orderBy: {
        hora_entrada_at: 'desc'
      }
    });

    return record ? this.mapToDomain(record) : null;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]> {
    const records = await prisma.mot_asistencia.findMany({
      where: {
        hora_entrada_at: {
          gte: startDate,
          lte: endDate
        },
        deleted_at: null
      },
      orderBy: {
        hora_entrada_at: 'desc'
      }
    });

    return records.map(r => this.mapToDomain(r));
  }

  async findByWorkerIdAndDateRange(
    workerId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Attendance[]> {
    const records = await prisma.mot_asistencia.findMany({
      where: {
        trabajador_id: workerId,
        hora_entrada_at: {
          gte: startDate,
          lte: endDate
        },
        deleted_at: null
      },
      orderBy: {
        hora_entrada_at: 'desc'
      }
    });

    return records.map(r => this.mapToDomain(r));
  }

  async findAllActiveWorkers(): Promise<Attendance[]> {
    // Obtener el inicio del día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const records = await prisma.mot_asistencia.findMany({
      where: {
        estado: 'incompleta',
        hora_salida_at: null,
        hora_entrada_at: {
          gte: today,
          lt: tomorrow
        },
        deleted_at: null
      },
      include: {
        mom_trabajador: {
          select: {
            nombre_completo: true,
            documento_identidad: true
          }
        }
      },
      orderBy: {
        hora_entrada_at: 'desc'
      }
    });

    return records.map(r => this.mapToDomain(r));
  }

  async getAllPaginated(page: number, limit: number): Promise<{ data: Attendance[]; total: number }> {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.mot_asistencia.findMany({
        skip,
        take: limit,
        orderBy: {
          hora_entrada_at: 'desc'
        }
      }),
      prisma.mot_asistencia.count()
    ]);

    return {
      data: records.map(r => this.mapToDomain(r)),
      total
    };
  }

  async update(id: number, data: Partial<IAttendanceRecord>): Promise<Attendance> {
    const updateData: any = {
      updated_at: createLocalDateTimeNow()
    };

    if (data.location !== undefined) updateData.ubicacion_entrada = data.location;
    if (data.notes !== undefined) updateData.observaciones_salida = data.notes;
    if (data.entryTime !== undefined) updateData.hora_entrada_at = data.entryTime;
    if (data.exitTime !== undefined) updateData.hora_salida_at = data.exitTime;
    if (data.workedHours !== undefined && data.workedHours !== null) {
      updateData.horas_trabajadas = parseFloat(data.workedHours.toString());
    }
    // Permitir actualizar deleted_at (reactivación cuando se envía null)
    if (data.deletedAt !== undefined) updateData.deleted_at = data.deletedAt;

    const updated = await prisma.mot_asistencia.update({
      where: { asistencia_id: id },
      data: updateData
    });

    return this.mapToDomain(updated);
  }

  async registerExit(id: number, exitTime: Date): Promise<Attendance> {
    const attendance = await prisma.mot_asistencia.findUnique({
      where: { asistencia_id: id }
    });

    if (!attendance) {
      throw new Error('Asistencia no encontrada');
    }

    const workedHours = this.calculateHours(attendance.hora_entrada_at, exitTime);

    const updated = await prisma.mot_asistencia.update({
      where: { asistencia_id: id },
      data: {
        hora_salida_at: exitTime,
        horas_trabajadas: parseFloat(workedHours.toString()),
        estado: 'completa',
        updated_at: createLocalDateTimeNow()
      }
    });

    return this.mapToDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await prisma.mot_asistencia.update({
      where: { asistencia_id: id },
      data: {
        deleted_at: createLocalDateTimeNow(),
        updated_at: createLocalDateTimeNow()
      }
    });
  }

  async countByWorkerAndDateRange(
    workerId: number,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return await prisma.mot_asistencia.count({
      where: {
        trabajador_id: workerId,
        hora_entrada_at: {
          gte: startDate,
          lte: endDate
        },
        deleted_at: null
      }
    });
  }

  async getTotalWorkedHoursByWorkerAndDateRange(
    workerId: number,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const records = await prisma.mot_asistencia.findMany({
      where: {
        trabajador_id: workerId,
        hora_entrada_at: {
          gte: startDate,
          lte: endDate
        },
        deleted_at: null
      },
      select: {
        horas_trabajadas: true,
        hora_entrada_at: true,
        hora_salida_at: true
      }
    });

    let totalHours = 0;

    records.forEach(record => {
      if (record.horas_trabajadas) {
        totalHours += Number(record.horas_trabajadas);
      } else if (record.hora_entrada_at && record.hora_salida_at) {
        totalHours += this.calculateHours(record.hora_entrada_at, record.hora_salida_at);
      }
    });

    return Math.round(totalHours * 100) / 100;
  }

  /*
   * Métodos privados
   */
  private mapToDomain(dbRecord: any): Attendance {
    const attendance = new Attendance({
      attendanceId: dbRecord.asistencia_id,
      workerId: dbRecord.trabajador_id,
      entryTime: dbRecord.hora_entrada_at,
      exitTime: dbRecord.hora_salida_at,
      location: dbRecord.ubicacion_entrada,
      workedHours: dbRecord.horas_trabajadas ? Number(dbRecord.horas_trabajadas) : null,
      status: dbRecord.estado as 'incompleta' | 'completa',
      notes: dbRecord.observaciones_salida,
      createdAt: dbRecord.created_at,
      updatedAt: dbRecord.updated_at,
      deletedAt: dbRecord.deleted_at
    });
    
    // Preservar fecha_at del registro de base de datos
    (attendance as any)._fecha_at = dbRecord.fecha_at;
    
    return attendance;
  }

  private calculateHours(entryTime: Date, exitTime: Date): number {
    const differenceMs = exitTime.getTime() - entryTime.getTime();
    return Math.round((differenceMs / (1000 * 60 * 60)) * 100) / 100;
  }
}
