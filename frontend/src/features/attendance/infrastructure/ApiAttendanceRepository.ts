import { IAttendanceRepository } from '../../domain/repositories/IAttendanceRepository';
import { AttendanceRecord, RegisterEntryData, RegisterExitData, Worker, AttendanceStats } from '../../domain/entities/Attendance';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export class ApiAttendanceRepository implements IAttendanceRepository {
  private baseUrl = `${API_BASE_URL}/attendance`;

  constructor(private getAccessToken?: () => Promise<string>) {}

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.getAccessToken) {
      try {
        const token = await this.getAccessToken();
        (headers as any)['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.warn('Could not get access token:', error);
      }
    }

    return headers;
  }

  async getActiveWorkers(): Promise<Worker[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/trabajadores-activos`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch active workers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  async registerEntry(data: RegisterEntryData): Promise<AttendanceRecord> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/entry`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `Failed to register entry: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async registerExit(attendanceId: number, data: RegisterExitData): Promise<AttendanceRecord> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/${attendanceId}/exit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `Failed to register exit: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getAttendanceById(id: number): Promise<AttendanceRecord> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attendance: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getWorkerAttendances(workerId: number): Promise<AttendanceRecord[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/worker/${workerId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch worker attendances: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  }

  async getWorkerActiveEntry(workerId: number): Promise<AttendanceRecord | null> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/worker/${workerId}/active`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || null;
  }

  async getAllAttendances(page: number = 1, limit: number = 20): Promise<{ data: AttendanceRecord[], total: number }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attendances: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data: data.data || [],
      total: data.total || 0,
    };
  }

  async updateAttendance(id: number, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `Failed to update attendance: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers,
    });

    return response.ok;
  }

  async getWorkerStatistics(workerId: number, startDate?: string, endDate?: string): Promise<AttendanceStats> {
    let url = `${this.baseUrl}/worker/${workerId}/statistics`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const headers = await this.getHeaders();
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch worker statistics: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }
}
