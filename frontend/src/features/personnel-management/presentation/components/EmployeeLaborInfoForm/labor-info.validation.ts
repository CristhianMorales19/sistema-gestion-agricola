import { LaborInfoData } from "@features/personnel-management/domain/entities/labor-info-employee";

export type LaborInfoErrors = Partial<Record<keyof LaborInfoData, string>>;

type NumericField = {
  key: keyof LaborInfoData;
  label: string;
  required?: boolean;
};

const numericFields: NumericField[] = [
  { key: "baseSalary", label: "Salario base", required: true },
  { key: "salaryGross", label: "Salario bruto", required: true },
  { key: "ccssDeduction", label: "Rebajas CCSS", required: true },
  { key: "otherDeductions", label: "Otras rebajas", required: true },
  { key: "salaryPerHour", label: "Salario por hora", required: true },

  { key: "ordinaryHours", label: "Horas ordinarias", required: true },
  { key: "extraHours", label: "Horas extra", required: true },
  { key: "otherHours", label: "Otras horas", required: true },

  { key: "vacationAmount", label: "Vacaciones", required: true },
  { key: "incapacityAmount", label: "Incapacidad", required: true },
  { key: "lactationAmount", label: "Lactancia", required: true },
];

const validateNumberField = (
  value: number | "",
  label: string,
  required = false,
): string | undefined => {
  if (value === "") {
    return required ? `${label} es requerido` : undefined;
  }
  if (typeof value !== "number" || isNaN(value)) {
    return `${label} debe de ser un número válido`;
  }
  if (value < 0) {
    return `${label} no puede ser negativo`;
  }
  return undefined;
};

export const validateLaborInfo = (data: LaborInfoData): LaborInfoErrors => {
  const errors: LaborInfoErrors = {};

  if (!data.position?.trim()) {
    errors.position = "El cargo es requerido";
  }
  if (!data.contractType?.trim()) {
    errors.contractType = "El tipo de contrato es requerido";
  }
  if (!data.area?.trim()) {
    errors.area = "El departamento es requerido";
  }
  if (!data.payrollCode?.trim()) {
    errors.payrollCode = "El código de nómina no puede ser vacío";
  }

  numericFields.forEach(({ key, label, required }) => {
    const error = validateNumberField(
      data[key] as number | "",
      label,
      required,
    );

    if (error) {
      errors[key] = error;
    }
  });

  return errors;
};

export const hasErrors = (errors: LaborInfoErrors) =>
  Object.keys(errors).length > 0;
