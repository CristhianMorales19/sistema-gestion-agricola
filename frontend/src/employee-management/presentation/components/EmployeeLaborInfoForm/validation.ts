export type LaborInfoErrors = Partial<Record<
  | 'position'
  | 'baseSalary'
  | 'contractType'
  | 'department'
  | 'payrollCode'
  , string>>;

export const validateLaborInfo = (data: any): LaborInfoErrors => {
  const errors: LaborInfoErrors = {};

  if (!data) return errors;

  if (!data.position || String(data.position).trim().length === 0) {
    errors.position = 'El cargo es requerido';
  }

  const baseSalary = Number(data.baseSalary ?? 0);
  if (isNaN(baseSalary) || baseSalary <= 0) {
    errors.baseSalary = 'El salario base debe ser mayor a 0';
  }

  if (!data.contractType || String(data.contractType).trim().length === 0) {
    errors.contractType = 'El tipo de contrato es requerido';
  }

  if (!data.department || String(data.department).trim().length === 0) {
    errors.department = 'El departamento es requerido';
  }

  // payrollCode optional but if present should be trimmed
  if (data.payrollCode && String(data.payrollCode).trim().length === 0) {
    errors.payrollCode = 'El código de nómina no puede ser vacío';
  }

  return errors;
};
