import { IAttendanceRepository } from '../repositories/IAttendanceRepository';
import { AttendanceRecord, RegisterEntryData, RegisterExitData, Worker, AttendanceStats } from '../entities/Attendance';

export class AttendanceUseCases {
  constructor(private repository: IAttendanceRepository) {}

  async getActiveWorkers(): Promise<Worker[]> {
    return this.repository.getActiveWorkers();
  }

  async registerEntry(data: RegisterEntryData): Promise<AttendanceRecord> {
    return this.repository.registerEntry(data);
  }

  async registerExit(attendanceId: number, data: RegisterExitData): Promise<AttendanceRecord> {
    return this.repository.registerExit(attendanceId, data);
  }

  async getAttendanceById(id: number): Promise<AttendanceRecord> {
    return this.repository.getAttendanceById(id);
  }

  async getWorkerAttendances(workerId: number): Promise<AttendanceRecord[]> {
    return this.repository.getWorkerAttendances(workerId);
  }

  async getWorkerActiveEntry(workerId: number): Promise<AttendanceRecord | null> {
    return this.repository.getWorkerActiveEntry(workerId);
  }

  async getAllAttendances(page?: number, limit?: number): Promise<{ data: AttendanceRecord[], total: number }> {
    return this.repository.getAllAttendances(page, limit);
  }

  async updateAttendance(id: number, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    return this.repository.updateAttendance(id, data);
  }

  async deleteAttendance(id: number): Promise<boolean> {
    return this.repository.deleteAttendance(id);
  }

  async getWorkerStatistics(workerId: number, startDate?: string, endDate?: string): Promise<AttendanceStats> {
    return this.repository.getWorkerStatistics(workerId, startDate, endDate);
  }
}
