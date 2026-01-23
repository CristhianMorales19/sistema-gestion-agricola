import React, { useCallback, useState } from "react";
import { Grid } from "@mui/material";
import { CreateCrewData } from "../../../domain/entities/crew";
import { Employee } from "@features/personnel-management";
import { CrewMembersTable } from "./CrewMembersTable";
import {
  ButtonContainer,
  FormContainer,
  GridItem,
  StyledArrowBackIcon,
  InputSection,
} from "../../../../../shared/presentation/styles/Form.styles";
import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import {
  CrewDataErrors,
  hasErrors,
  validateCrewForm,
} from "./crew-form.validation";

const INITIAL_FORM_DATA: CreateCrewData = {
  id: 0,
  active: false,
  code: "",
  description: "",
  workArea: "",
  workers: [],
};

interface NewCrewFormProps {
  onSubmit: (data: CreateCrewData) => Promise<boolean>;
  onCancel: () => void;
  employees: Employee[];
  initialData?: CreateCrewData;
}

export const NewEditCrewForm = ({
  onSubmit,
  onCancel,
  employees,
  initialData,
}: NewCrewFormProps) => {
  const [formData, setFormData] = useState<CreateCrewData>(
    initialData || INITIAL_FORM_DATA,
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<CrewDataErrors>({});

  const getChangedFields = (
    initial: CreateCrewData,
    current: CreateCrewData,
  ) => {
    const changes: Partial<CreateCrewData> = {};

    (Object.keys(current) as Array<keyof CreateCrewData>).forEach((key) => {
      if (JSON.stringify(initial[key]) !== JSON.stringify(current[key]))
        changes[key] = current[key] as any;
    });

    return changes;
  };

  const validateForm = useCallback(() => {
    const newErrors = validateCrewForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const changes = initialData
      ? getChangedFields(initialData, formData)
      : formData;

    if (await onSubmit(changes as CreateCrewData))
      if (!initialData) setFormData(INITIAL_FORM_DATA);
    setLoading(false);
  };

  const handleChange =
    (field: keyof CreateCrewData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    };

  const addWorker = (worker: Employee) => {
    if (!formData.workers.includes(worker)) {
      setFormData((prev) => ({
        ...prev,
        workers: [...prev.workers, worker],
      }));
    }
  };

  const removeWorker = (worker: Employee) => {
    setFormData((prev) => ({
      ...prev,
      workers: prev.workers.filter((w) => w.id !== worker.id),
    }));
  };

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <TextGeneric variant="h6">
        {initialData ? "Editar Cuadrilla" : "Crear Cuadrilla"}
      </TextGeneric>

      <InputSection>
        <Grid container spacing={3}>
          <GridItem item xs={12}>
            <TextFieldGeneric
              label="Código"
              value={formData.code}
              onChange={handleChange("code")}
              error={Boolean(errors.code)}
              helperText={errors.code}
              required
              fullWidth
            />
          </GridItem>
          <GridItem item xs={12}>
            <TextFieldGeneric
              label="Descripción"
              value={formData.description}
              onChange={handleChange("description")}
              error={Boolean(errors.description)}
              helperText={errors.description}
              required
              fullWidth
            />
          </GridItem>
          <GridItem item xs={12}>
            <TextFieldGeneric
              label="Área de Trabajo"
              value={formData.workArea}
              onChange={handleChange("workArea")}
              error={Boolean(errors.workArea)}
              helperText={errors.workArea}
              required
              fullWidth
            />
          </GridItem>
        </Grid>
      </InputSection>

      {/* Componente de gestión de trabajadores */}
      <CrewMembersTable
        employees={employees}
        selectedWorkers={formData.workers}
        onAddWorker={addWorker}
        onRemoveWorker={removeWorker}
      />

      <ButtonContainer>
        <BackButtonGeneric
          onClick={onCancel}
          startIcon={<StyledArrowBackIcon />}
        >
          Cancelar
        </BackButtonGeneric>

        <ButtonGeneric type="submit">
          {loading ? "Guardando..." : initialData ? "Guardar" : "Crear"}
        </ButtonGeneric>
      </ButtonContainer>
    </FormContainer>
  );
};
