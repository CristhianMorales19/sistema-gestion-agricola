import { AttendanceRecord, RegisterEntryData, RegisterExitData, Worker, AttendanceStats } from '../entities/Attendance';
import { SafeResult } from '@shared/utils/safeCall';

export interface IAttendanceRepository {
  getActiveWorkers(): Promise<Worker[]>;
  registerEntry(data: RegisterEntryData): Promise<AttendanceRecord>;
  registerExit(attendanceId: number, data: RegisterExitData): Promise<AttendanceRecord>;
  getAttendanceById(id: number): Promise<AttendanceRecord>;
  getWorkerAttendances(workerId: number): Promise<AttendanceRecord[]>;
  getWorkerActiveEntry(workerId: number): Promise<AttendanceRecord | null>;
  getAllAttendances(page?: number, limit?: number): Promise<{ data: AttendanceRecord[], total: number }>;
  updateAttendance(id: number, data: Partial<AttendanceRecord>): Promise<AttendanceRecord>;
  deleteAttendance(id: number): Promise<boolean>;
  getWorkerStatistics(workerId: number, startDate?: string, endDate?: string): Promise<AttendanceStats>;
}
