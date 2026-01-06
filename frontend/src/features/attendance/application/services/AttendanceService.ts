import { AttendanceUseCases } from '../../domain/use-cases/AttendanceUseCases';
import { ApiAttendanceRepository } from '../../infrastructure/ApiAttendanceRepository';
import { AttendanceRecord, RegisterEntryData, RegisterExitData, Worker, AttendanceStats } from '../../domain/entities/Attendance';
import { SafeResult } from '@shared/utils/safeCall';

export class AttendanceService {
  private attendanceUseCases: AttendanceUseCases;

  constructor(getAccessToken?: () => Promise<string>) {
    const repository = new ApiAttendanceRepository(getAccessToken);
    this.attendanceUseCases = new AttendanceUseCases(repository);
  }

  async getActiveWorkers(): Promise<SafeResult<Worker[]>> {
    try {
      const data = await this.attendanceUseCases.getActiveWorkers();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
        data: [],
      };
    }
  }

  async registerEntry(data: RegisterEntryData): Promise<SafeResult<AttendanceRecord>> {
    try {
      const record = await this.attendanceUseCases.registerEntry(data);
      return { success: true, data: record };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to register entry' },
        data: {} as AttendanceRecord,
      };
    }
  }

  async registerExit(attendanceId: number, data: RegisterExitData): Promise<SafeResult<AttendanceRecord>> {
    try {
      const record = await this.attendanceUseCases.registerExit(attendanceId, data);
      return { success: true, data: record };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to register exit' },
        data: {} as AttendanceRecord,
      };
    }
  }

  async getWorkerActiveEntry(workerId: number): Promise<SafeResult<AttendanceRecord | null>> {
    try {
      const record = await this.attendanceUseCases.getWorkerActiveEntry(workerId);
      return { success: true, data: record };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch active entry' },
        data: null,
      };
    }
  }

  async getWorkerAttendances(workerId: number): Promise<SafeResult<AttendanceRecord[]>> {
    try {
      const data = await this.attendanceUseCases.getWorkerAttendances(workerId);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch attendances' },
        data: [],
      };
    }
  }

  async getAllAttendances(page?: number, limit?: number): Promise<SafeResult<{ data: AttendanceRecord[], total: number }>> {
    try {
      const result = await this.attendanceUseCases.getAllAttendances(page, limit);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch attendances' },
        data: { data: [], total: 0 },
      };
    }
  }

  async updateAttendance(id: number, data: Partial<AttendanceRecord>): Promise<SafeResult<AttendanceRecord>> {
    try {
      const record = await this.attendanceUseCases.updateAttendance(id, data);
      return { success: true, data: record };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to update attendance' },
        data: {} as AttendanceRecord,
      };
    }
  }

  async deleteAttendance(id: number): Promise<SafeResult<boolean>> {
    try {
      const result = await this.attendanceUseCases.deleteAttendance(id);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to delete attendance' },
        data: false,
      };
    }
  }

  async getWorkerStatistics(workerId: number, startDate?: string, endDate?: string): Promise<SafeResult<AttendanceStats>> {
    try {
      const data = await this.attendanceUseCases.getWorkerStatistics(workerId, startDate, endDate);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch statistics' },
        data: {} as AttendanceStats,
      };
    }
  }
}

export default AttendanceService;
