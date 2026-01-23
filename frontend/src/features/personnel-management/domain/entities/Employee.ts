import { LaborInfoData } from "./labor-info-employee";

// src/employee-management/domain/entities/Employee.ts
export interface Employee {
  id: number;
  name: string;
  identification: string;
  hireDate: string;
  birthDate: string;
  status: boolean;
  email: string;
  phone: string;
  position?: string;
}

export interface CreateEmployeeData {
  identification: string;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  hireDate: string;
  [key: string]: unknown;
}

export interface EditEmployeeData {
  employee: Employee;
  laborInfo: LaborInfoData;
  [key: string]: unknown;
}
