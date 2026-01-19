import { CreateEmployeeData } from "@features/personnel-management/domain/entities/employee";

export type CreateEmployeeErrors = Partial<
  Record<keyof CreateEmployeeData, string>
>;

type TextField = {
  key: keyof CreateEmployeeData;
  label: string;
  required?: boolean;
  minLength?: number;
};

const textFields: TextField[] = [
  {
    key: "identification",
    label: "La cédula",
    required: true,
    minLength: 6,
  },
  {
    key: "name",
    label: "El nombre completo",
    required: true,
    minLength: 3,
  },
  {
    key: "phone",
    label: "El teléfono",
    required: true,
    minLength: 8,
  },
  {
    key: "email",
    label: "El correo electrónico",
    required: true,
  },
];

const validateTextField = (
  value: string | undefined,
  label: string,
  required = false,
  minLength?: number,
): string | undefined => {
  if (!value || !value.trim()) {
    return required ? `${label} es requerido` : undefined;
  }
  if (minLength && value.trim().length < minLength) {
    return `${label} debe de tener al menos ${minLength} caracteres`;
  }
  return undefined;
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) => /^[0-9]+$/.test(phone);

// Validación principal
export const validateCreateEmployee = (
  data: CreateEmployeeData,
): CreateEmployeeErrors => {
  const errors: CreateEmployeeErrors = {};

  textFields.forEach(({ key, label, required, minLength }) => {
    const error = validateTextField(
      data[key] as string | undefined,
      label,
      required,
      minLength,
    );

    if (error) {
      errors[key] = error;
    }
  });

  if (data.email && !isValidEmail(data.email.trim())) {
    errors.email = "El formato del correo electrónico no es válido";
  }
  if (data.phone && !isValidPhone(data.phone.trim())) {
    errors.phone = "El teléfono debe contener solo números";
  }
  if (!data.birthDate) {
    errors.birthDate = "La fecha de nacimiento es requerida";
  } else if (new Date(data.birthDate) > new Date()) {
    errors.birthDate = "La fecha de nacimiento no puede ser futura";
  }
  if (!data.hireDate) {
    errors.hireDate = "La fecha de ingreso es requerida";
  } else if (new Date(data.hireDate) > new Date()) {
    errors.hireDate = "La fecha de ingreso no puede ser futura";
  }
  return errors;
};

export const hasErrors = (errors: CreateEmployeeErrors) =>
  Object.keys(errors).length > 0;
