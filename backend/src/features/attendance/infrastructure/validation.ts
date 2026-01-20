/*
 * Validación de esquemas para Asistencia
 */

import { z } from 'zod';

export const registerEntrySchema = z.object({
  trabajador_id: z.number().optional(),
  fecha: z.string().optional(), // YYYY-MM-DD
  horaEntrada: z.string().optional(),
  hora_entrada: z.string().optional(),
  location: z.string().optional(),
  ubicacion: z.string().optional(),
  notes: z.string().optional()
});

export const registerExitSchema = z.object({
  asistencia_id: z.number().optional(),
  horaSalida: z.string().optional(),
  hora_salida: z.string().optional(),
  observacion: z.string().optional(),
  notes: z.string().optional()
});

export const updateAttendanceSchema = z.object({
  location: z.string().optional(),
  ubicacion: z.string().optional(),
  notes: z.string().optional(),
  observaciones_salida: z.string().optional(),
  hora_entrada_at: z.string().optional(),
  hora_salida_at: z.string().optional(),
  horaEntrada: z.string().optional(),
  horaSalida: z.string().optional(),
  deleted_at: z.null().optional(), // Para reactivaciones, se envía null explícitamente
});

export const getAttendanceFiltersSchema = z.object({
  workerId: z.number().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['incompleta', 'completa']).optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().default(10)
});

export type RegisterEntryInput = z.infer<typeof registerEntrySchema>;
export type RegisterExitInput = z.infer<typeof registerExitSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type GetAttendanceFiltersInput = z.infer<typeof getAttendanceFiltersSchema>;
