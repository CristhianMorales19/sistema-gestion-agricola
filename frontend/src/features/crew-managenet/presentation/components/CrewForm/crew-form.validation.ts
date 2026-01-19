import { CreateCrewData } from "@features/crew-managenet/domain/entities/crew";

export type CrewDataErrors = Partial<Record<keyof CreateCrewData, string>>;

export const validateCrewForm = (data: CreateCrewData) => {
  const errors: CrewDataErrors = {};

  if (!data.code.trim()) {
    errors.code = "El código es obligatorio";
  } else if (data.code.length < 3) {
    errors.code = "El código debe tener al menos 3 caracteres";
  }
  if (!data.description.trim()) {
    errors.description = "La descripción es obligatoria";
  } else if (data.description.length < 5) {
    errors.description = "La descripción debe tener al menos 5 caracteres";
  }
  if (!data.workArea.trim()) {
    errors.workArea = "El área de trabajo es obligatoria";
  }
  return errors;
};

export const hasErrors = (errors: CrewDataErrors) =>
  Object.keys(errors).length > 0;
