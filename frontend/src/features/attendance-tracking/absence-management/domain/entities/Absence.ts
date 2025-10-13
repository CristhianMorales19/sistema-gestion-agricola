// src/absence-management/domain/entities/Absence.ts

/**
 * Ausencia justificada de un trabajador
 */
export interface Absence {
  id: string;
  trabajador_id: number; // Cambiado a number para coincidir con la BD
  trabajador_nombre: string;
  trabajador_documento: string;
  fecha_ausencia: Date | string;
  motivo: string;
  motivo_personalizado?: string;
  documentacion_respaldo?: string; // URL o path del documento
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  supervisor_id?: number;
  supervisor_nombre?: string;
  fecha_registro: Date | string;
  fecha_aprobacion?: Date | string;
  comentarios?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/**
 * Datos para crear una nueva ausencia
 */
export interface CreateAbsenceData {
  trabajador_id: number; // Cambiado a number para coincidir con la BD
  fecha_ausencia: string; // formato: YYYY-MM-DD
  motivo: string;
  motivo_personalizado?: string;
  documentacion_respaldo?: string;
  supervisor_id?: number;
  comentarios?: string;
}

/**
 * Datos para actualizar una ausencia
 */
export interface UpdateAbsenceData {
  fecha_ausencia?: string;
  motivo?: string;
  motivo_personalizado?: string;
  documentacion_respaldo?: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
  comentarios?: string;
}

/**
 * Motivos predefinidos de ausencia
 */
export const ABSENCE_REASONS = [
  { value: 'enfermedad', label: 'Enfermedad' },
  { value: 'cita_medica', label: 'Cita médica' },
  { value: 'permiso_personal', label: 'Permiso personal' },
  { value: 'emergencia_familiar', label: 'Emergencia familiar' },
  { value: 'incapacidad', label: 'Incapacidad médica' },
  { value: 'duelo', label: 'Duelo' },
  { value: 'matrimonio', label: 'Matrimonio' },
  { value: 'paternidad_maternidad', label: 'Paternidad/Maternidad' },
  { value: 'otro', label: 'Otro (especificar)' }
] as const;

/**
 * Filtros para búsqueda de ausencias
 */
export interface AbsenceFilters {
  trabajador_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada';
  motivo?: string;
}

/**
 * Respuesta al crear/actualizar ausencia
 */
export interface AbsenceResponse {
  success: boolean;
  absence?: Absence;
  message?: string;
  data?: any;
}

/**
 * Estadísticas de ausencias
 */
export interface AbsenceStats {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  por_motivo: Record<string, number>;
}
