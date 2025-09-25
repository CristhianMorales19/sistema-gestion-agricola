// src/employee-management/domain/entities/Employee.ts
export interface Employee {
  id: string;
  name: string;
  identification: string;
  position: string;
  hireDate: Date;
  status: 'activo' | 'inactivo';
  email?: string;
  phone?: string;
  salary?: number;
  cargo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeData {
  documento_identidad: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  telefono?: string;
  email?: string;
  fecha_registro_at: string;
  created_by: number;
  cargo?: string;
}

export interface UpdateEmployeeData {
  name?: string;
  position?: string;
  department?: string;
  status?: 'activo' | 'inactivo';
  email?: string;
  phone?: string;
  salary?: number;
}

// Nueva interfaz para información laboral
export interface LaborInfoData {
  trabajador_id: number;
  cargo: string;
  departamento: String,
  salario_base: number;
  tipo_contrato: string;
  fecha_ingreso: string;
  usuario_ultima_actualizacion: number;
}

export interface CreateLaborInfoResponse {
  success: boolean;
  message: string;
  data?: {
    info_laboral_id: number;
    trabajador_id: number;
    cargo: string;
    salario_base: number;
    departamento: string
    tipo_contrato: string;
    fecha_ingreso: string;
  };
}