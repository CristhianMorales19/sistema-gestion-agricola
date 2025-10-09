// src/employee-management/domain/entities/Employee.ts
export interface Employee {
  id: string;
  name: string;
  identification: string;
  position: string;
  cargo?: string;
  hireDate: Date;
  status: boolean;
  email?: string;
  phone?: string;
  salary?: number;
  // Campos adicionales para reportes / comprobantes
  payrollCode?: string; // Cod (código interno de nómina)
  salaryGross?: number; // Salario bruto
  ccssDeduction?: number; // Rebajas CCSS
  otherDeductions?: number; // Otras rebajas
  salaryNet?: number; // Salario neto
  salaryPerHour?: number; // Salario por hora
  ordinaryHours?: number; // HN
  extraHours?: number; // HE
  otherHours?: number; // Horas otras
  vacationAmount?: number; // Vacaciones
  incapacityAmount?: number; // Incapacidad
  lactationAmount?: number; // Lactancia
  area?: string;
  salaryAverage?: number; // Salario promedio (para cálculo de vacaciones/aguinaldo)
  monthsWorked?: number;
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
  // Campos opcionales que pueden llegara al crear desde el formulario laboral
  codigo_nomina?: string;
  salario_bruto?: number;
  rebajas_ccss?: number;
  rebajas?: number;
  salario_por_hora?: number;
  horas_ordinarias?: number;
  horas_extras?: number;
  horas_otras?: number;
  vacaciones_monto?: number;
  incapacidad_monto?: number;
  lactancia_monto?: number;
}

export interface UpdateEmployeeData {
  name?: string;
  position?: string;
  department?: string;
  status?: boolean;
  email?: string;
  phone?: string;
  salary?: number;
  // Actualizaciones relacionadas con nómina
  payrollCode?: string;
  salaryGross?: number;
  ccssDeduction?: number;
  otherDeductions?: number;
  salaryNet?: number;
  salaryPerHour?: number;
  ordinaryHours?: number;
  extraHours?: number;
  otherHours?: number;
  vacationAmount?: number;
  incapacityAmount?: number;
}

export interface LaborInfoData {
  // Campos usados por el formulario de información laboral
  trabajador_id?: string | number;
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  tipo_contrato?: string;
  fecha_ingreso?: string | Date;

  codigo_nomina?: string;
  salario_bruto?: number;
  rebajas_ccss?: number;
  rebajas?: number;
  salario_por_hora?: number;
  horas_ordinarias?: number;
  horas_extras?: number;
  horas_otras?: number;
  vacaciones_monto?: number;
  incapacidad_monto?: number;
  lactancia_monto?: number;
}

export interface CreateLaborInfoResponse {
  success: boolean;
  laborInfo?: LaborInfoData;
  message?: string;
  data?: any;
}