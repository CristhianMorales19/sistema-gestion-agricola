export interface Employee {
  id: number;
  name: string;
  identification: string;
  position?: string;
  hireDate: Date;
  birthDate: Date;
  status?: boolean;
  email?: string;
  phone?: string;
}

export interface LaborInfo {
  position: string;
  baseSalary: number;
  contractType: string;
  area?: string;
  payrollCode?: string;
  salaryGross?: number;
  ccssDeduction?: number;
  salaryPerHour?: number;
  ordinaryHours?: number;
  otherDeductions?: number;
  extraHours?: number;
  otherHours?: number;
  vacationAmount?: number;
  incapacityAmount?: number;
  lactationAmount?: number;
}

export interface EmployeeWithLabor {
  employee: Employee;
  laborInfo: LaborInfo | null;
}

export interface UpdateEmployee {
  employee: Omit<Employee, "id">;
  laborInfo: LaborInfo;
}

export type CreateEmployee = Omit<Employee, "id" | "position">;
