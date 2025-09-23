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