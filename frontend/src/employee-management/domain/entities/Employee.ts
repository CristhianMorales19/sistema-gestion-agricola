// src/employee-management/domain/entities/Employee.ts
export interface Employee {
  id: string;
  name: string;
  identification: string;
  department: string;
  birthDate: Date;
  entryDate: Date;
  status: 'activo' | 'inactivo';
  email?: string;
  phone?: string;
  role: string;
  contractType: string;
  baseSalary: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeData {
  identification: string;
  name: string;
  birthDate: string;
  phone?: string;
  email?: string;
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
  employeeId: number;
  role: string;
  department: String,
  baseSalary: number;
  contractType: string;
  entryDate: string;
}

export interface Response {
  success: boolean;
  message: string;
  data?: any;
}