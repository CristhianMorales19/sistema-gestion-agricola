/*
 * Módulo de Asistencia
 * Exporta las capas principales del módulo
 */

export { Attendance, IAttendanceRecord } from './domain/Attendance';
export { IAttendanceRepository } from './domain/AttendanceRepository';
export {
  AttendanceError,
  AttendanceNotFoundError,
  WorkerNotFoundError,
  ActiveEntryExistsError,
  NoActiveEntryError,
  InvalidAttendanceStateError
} from './domain/AttendanceError';

export { AttendanceService } from './application/AttendanceService';

export { PrismaAttendanceRepository } from './infrastructure/PrismaAttendanceRepository';
export {
  registerEntrySchema,
  registerExitSchema,
  updateAttendanceSchema,
  getAttendanceFiltersSchema,
  RegisterEntryInput,
  RegisterExitInput,
  UpdateAttendanceInput,
  GetAttendanceFiltersInput
} from './infrastructure/validation';

export { AttendanceController } from './presentation/controllers/AttendanceController';
export { default as attendanceRoutes } from './presentation/routes/attendance.routes';
