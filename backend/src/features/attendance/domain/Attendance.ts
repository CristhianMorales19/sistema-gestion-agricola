/*
 * Entidad de Dominio: Asistencia
 * Representa el registro de entrada y salida de un trabajador
 */

export interface IAttendanceRecord {
  attendanceId: number;
  workerId: number;
  entryTime: Date;
  exitTime?: Date | null;
  location?: string | null;
  workedHours?: number | null;
  status: 'incompleta' | 'completa';
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Attendance {
  private _attendanceId: number;
  private _workerId: number;
  private _entryTime: Date;
  private _exitTime: Date | null;
  private _location: string | null;
  private _workedHours: number | null;
  private _status: 'incompleta' | 'completa';
  private _notes: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(data: IAttendanceRecord) {
    this._attendanceId = data.attendanceId;
    this._workerId = data.workerId;
    this._entryTime = data.entryTime;
    this._exitTime = data.exitTime || null;
    this._location = data.location || null;
    this._workedHours = data.workedHours || null;
    this._status = data.status;
    this._notes = data.notes || null;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._deletedAt = data.deletedAt || null;
  }

  // Getters
  getAttendanceId(): number {
    return this._attendanceId;
  }

  getWorkerId(): number {
    return this._workerId;
  }

  getEntryTime(): Date {
    return this._entryTime;
  }

  getExitTime(): Date | null {
    return this._exitTime;
  }

  getLocation(): string | null {
    return this._location;
  }

  getWorkedHours(): number | null {
    return this._workedHours;
  }

  getStatus(): 'incompleta' | 'completa' {
    return this._status;
  }

  getNotes(): string | null {
    return this._notes;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }

  getDeletedAt(): Date | null {
    return this._deletedAt;
  }

  // Business logic methods
  isActive(): boolean {
    return this._status === 'incompleta' && !this._deletedAt;
  }

  canRegisterExit(): boolean {
    // Permite registrar salida si:
    // 1. Tiene entrada activa (status === 'incompleta') 
    // 2. O ya tiene entrada registrada incluso si ya está completa (para actualizar la salida)
    return !this._deletedAt && this._entryTime !== null;
  }

  registerExit(exitTime: Date, workedHours?: number): void {
    if (!this.canRegisterExit()) {
      throw new Error('No se puede registrar salida para una asistencia sin entrada activa');
    }
    this._exitTime = exitTime;
    if (workedHours !== undefined) {
      this._workedHours = workedHours;
    }
    this._status = 'completa';
    this._updatedAt = new Date();
  }

  calculateWorkedHours(): number {
    if (!this._exitTime) {
      return 0;
    }
    const differenceMs = this._exitTime.getTime() - this._entryTime.getTime();
    return Math.round((differenceMs / (1000 * 60 * 60)) * 100) / 100; // Redondear a 2 decimales
  }

  updateNotes(notes: string): void {
    this._notes = notes;
    this._updatedAt = new Date();
  }

  updateLocation(location: string): void {
    this._location = location;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  toPrimitives(): IAttendanceRecord {
    return {
      attendanceId: this._attendanceId,
      workerId: this._workerId,
      entryTime: this._entryTime,
      exitTime: this._exitTime,
      location: this._location,
      workedHours: this._workedHours,
      status: this._status,
      notes: this._notes,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt
    };
  }
}
