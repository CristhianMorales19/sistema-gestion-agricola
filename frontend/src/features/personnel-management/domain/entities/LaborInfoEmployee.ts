/**
 * Entidad para la información laboral detallada de un empleado
 * Incluye datos de nómina, contratos y beneficios
 */
export interface LaborInfoEmployee {
  trabajador_id: number;
  codigo_nomina?: string;
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  salario_bruto?: number;
  salario_neto?: number;
  salario_por_hora?: number;
  tipo_contrato?: string;
  fecha_ingreso?: Date | string;
  
  // Deducciones
  rebajas_ccss?: number;
  rebajas?: number;
  otras_deducciones?: number;
  
  // Horas
  horas_ordinarias?: number;
  horas_extras?: number;
  horas_otras?: number;
  
  // Beneficios
  vacaciones_monto?: number;
  incapacidad_monto?: number;
  lactancia_monto?: number;
  
  // Promedios
  salario_promedio?: number;
  meses_trabajados?: number;
  
  // Metadatos
  estado?: 'activo' | 'inactivo';
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Datos para crear información laboral
 */
export interface CreateLaborInfoData {
  trabajador_id: number;
  codigo_nomina?: string;
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  salario_bruto?: number;
  tipo_contrato?: string;
  fecha_ingreso?: string | Date;
}

/**
 * Datos para actualizar información laboral
 */
export interface UpdateLaborInfoData {
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  salario_bruto?: number;
  salario_por_hora?: number;
  tipo_contrato?: string;
  horas_ordinarias?: number;
  horas_extras?: number;
  horas_otras?: number;
  vacaciones_monto?: number;
  incapacidad_monto?: number;
  lactancia_monto?: number;
  estado?: 'activo' | 'inactivo';
}
