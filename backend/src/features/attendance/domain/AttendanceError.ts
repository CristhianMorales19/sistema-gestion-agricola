/*
 * Excepciones de Dominio para Asistencia
 */

export class AttendanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AttendanceError';
  }
}

export class AttendanceNotFoundError extends AttendanceError {
  constructor() {
    super('Registro de asistencia no encontrado');
    this.name = 'AttendanceNotFoundError';
  }
}

export class WorkerNotFoundError extends AttendanceError {
  constructor() {
    super('Trabajador no encontrado o inactivo');
    this.name = 'WorkerNotFoundError';
  }
}

export class ActiveEntryExistsError extends AttendanceError {
  constructor() {
    super('Este trabajador ya tiene una hora de entrada registrada hoy. Use actualizar para cambiar la hora');
    this.name = 'ActiveEntryExistsError';
  }
}

export class NoActiveEntryError extends AttendanceError {
  constructor() {
    super('No se puede registrar la hora de salida sin antes registrar la hora de entrada');
    this.name = 'NoActiveEntryError';
  }
}

export class InvalidAttendanceStateError extends AttendanceError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAttendanceStateError';
  }
}
