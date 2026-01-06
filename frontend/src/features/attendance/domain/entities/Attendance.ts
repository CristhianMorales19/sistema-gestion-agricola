export interface Worker {
  trabajador_id: number;
  nombre_completo: string;
  documento_identidad: string;
  email?: string;
  telefono?: string;
}

export interface AttendanceRecord {
  asistencia_id: number;
  trabajador_id: number;
  worker?: Worker;
  fecha_at: string;
  hora_entrada_at: string | null;
  hora_salida_at: string | null;
  horas_trabajadas: number | null;
  estado: 'incompleta' | 'completa';
  ubicacion_entrada?: string | null;
  observaciones_salida?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface RegisterEntryData {
  trabajador_id: number;
  fecha?: string;
  horaEntrada?: string;
  ubicacion?: string | null;
}

export interface RegisterExitData {
  trabajador_id: number;
  horaSalida?: string;
  observacion?: string;
}

export interface BulkAttendanceAction {
  hora: string;
  fecha?: string;
  tipo: 'entrada' | 'salida';
  observaciones?: string;
}

export interface AttendanceStats {
  trabajador_id: number;
  worker?: Worker;
  total_dias: number;
  dias_completos: number;
  dias_incompletos: number;
  promedio_horas: number;
}
