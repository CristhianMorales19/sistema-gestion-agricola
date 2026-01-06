/*
 * Interfaz del Repositorio de Asistencia
 * Define los contratos para operaciones de persistencia
 */

import { Attendance, IAttendanceRecord } from './Attendance';

export interface IAttendanceRepository {
  // Crear
  create(data: Omit<IAttendanceRecord, 'attendanceId'>): Promise<Attendance>;

  // Leer
  findById(id: number): Promise<Attendance | null>;
  findByIdIncludeDeleted(id: number): Promise<Attendance | null>;
  findByWorkerIdAndDate(workerId: number, date: Date): Promise<Attendance[]>;
  findActiveByWorkerId(workerId: number): Promise<Attendance | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]>;
  findByWorkerIdAndDateRange(workerId: number, startDate: Date, endDate: Date): Promise<Attendance[]>;
  findAllActiveWorkers(): Promise<Attendance[]>;
  getAllPaginated(page: number, limit: number): Promise<{ data: Attendance[]; total: number }>;

  // Actualizar
  update(id: number, data: Partial<IAttendanceRecord>): Promise<Attendance>;
  registerExit(id: number, exitTime: Date): Promise<Attendance>;

  // Eliminar (soft delete)
  delete(id: number): Promise<void>;

  // Estadísticas
  countByWorkerAndDateRange(workerId: number, startDate: Date, endDate: Date): Promise<number>;
  getTotalWorkedHoursByWorkerAndDateRange(workerId: number, startDate: Date, endDate: Date): Promise<number>;
}
