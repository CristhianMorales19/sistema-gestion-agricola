// src/employee-management/presentation/components/NewEmployeeForm/NewEmployeeForm.tsx
import React, { useState, useCallback } from "react";
import { Grid } from "@mui/material";
import { CreateEmployeeData } from "@features/personnel-management/domain/entities/employee";
import {
  hasErrors,
  validateCreateEmployee,
  CreateEmployeeErrors,
} from "./new-emploplee.validation";
import {
  ButtonContainer,
  FormContainer,
  GridItem,
  InputSection,
  StyledArrowBackIcon,
} from "../../../../../shared/presentation/styles/Form.styles";
import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import { INITIAL_CREATE_EMPLOYEE } from "./employee.constants";

interface NewEmployeeFormProps {
  onSubmit: (data: CreateEmployeeData) => Promise<boolean>;
  onCancel: () => void;
}

export const NewEmployeeForm = ({
  onSubmit,
  onCancel,
}: NewEmployeeFormProps) => {
  const [formData, setFormData] = useState<CreateEmployeeData>(
    INITIAL_CREATE_EMPLOYEE,
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<CreateEmployeeErrors>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name as keyof CreateEmployeeData];
      return copy;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors = validateCreateEmployee(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;
      setLoading(true);
      const result = await onSubmit(formData);
      if (result) {
        setFormData(INITIAL_CREATE_EMPLOYEE);
      }
      setLoading(false);
    },
    [validateForm, formData, onSubmit],
  );

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <TextGeneric variant="h6">Crear Empleado</TextGeneric>

      <InputSection>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Cédula"
              name="identification"
              value={formData.identification}
              onChange={handleChange}
              error={Boolean(errors.identification)}
              helperText={errors.identification}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Nombre completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Fecha de nacimiento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              error={Boolean(errors.birthDate)}
              helperText={errors.birthDate}
              required
              InputLabelProps={{ shrink: true }}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Fecha de ingreso"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
              error={Boolean(errors.hireDate)}
              helperText={errors.hireDate}
              required
              InputLabelProps={{ shrink: true }}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              required
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </GridItem>
        </Grid>
      </InputSection>

      {/* Botones */}
      <ButtonContainer>
        <BackButtonGeneric
          onClick={onCancel}
          startIcon={<StyledArrowBackIcon />}
        >
          Volver
        </BackButtonGeneric>
        <ButtonGeneric type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear"}
        </ButtonGeneric>
      </ButtonContainer>
    </FormContainer>
  );
};
