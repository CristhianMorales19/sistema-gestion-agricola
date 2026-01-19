import React, { useState, useCallback } from "react";
import { MenuItem, Grid } from "@mui/material";
import {
  validateLaborInfo,
  LaborInfoErrors,
  hasErrors,
} from "./labor-info.validation";
import {
  FormContainer,
  GridItem,
  ButtonContainer,
  ErrorMessage,
  SectionLabel,
  StyledArrowBackIcon,
  InputSection,
} from "../../../../../shared/presentation/styles/Form.styles";
import { LaborInfoData } from "@features/personnel-management/domain/entities/laborInfoEmployee";
import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import {
  contractTypes,
  departments,
  INITIAL_LABOR_INFO,
  numericFields,
} from "./labor-info.constants";

interface LaborInfoViewProps {
  employee: { identification: string; name: string } | null;
  onCancel: () => void;
  onSave: (data: LaborInfoData) => Promise<void>;
}

export const LaborInfoView = ({
  employee,
  onCancel,
  onSave,
}: LaborInfoViewProps) => {
  const [formData, setFormData] = useState<LaborInfoData>(INITIAL_LABOR_INFO);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LaborInfoErrors>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (numericFields.includes(name)) {
        if (value === "" || value === "-") {
          return { ...prev, [name]: "" };
        }

        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
          return { ...prev, [name]: numberValue };
        }
        return prev;
      }
      return { ...prev, [name]: value };
    });

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name as keyof LaborInfoData];
      return copy;
    });
  }, []);

  const validateForm = useCallback((): Boolean => {
    const newErrors = validateLaborInfo(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!employee) return;

      if (!validateForm()) return;

      setLoading(true);
      onSave(formData);
      setLoading(false);
    },
    [employee, formData, onSave, validateForm],
  );

  const toNumber = (value: number | "" | undefined) =>
    typeof value === "number" && !isNaN(value) ? value : 0;

  const gross = toNumber(formData.salaryGross) || toNumber(formData.baseSalary);

  const netSalary =
    gross -
    toNumber(formData.ccssDeduction) -
    toNumber(formData.otherDeductions);

  const hourlySalary =
    toNumber(formData.salaryPerHour) > 0
      ? toNumber(formData.salaryPerHour)
      : gross > 0
        ? gross / (30 * 8)
        : 0;

  if (!employee) {
    return (
      <>
        <ErrorMessage>No se ha seleccionado ningún empleado</ErrorMessage>
        <ButtonContainer>
          <BackButtonGeneric
            onClick={onCancel}
            startIcon={<StyledArrowBackIcon />}
          >
            Volver a la lista
          </BackButtonGeneric>
        </ButtonContainer>
      </>
    );
  }

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <TextGeneric variant="h6">Información Laboral</TextGeneric>

      <InputSection>
        {/* Información básica laboral */}
        <SectionLabel variant="overline">Información Básica</SectionLabel>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Cédula"
              value={employee.identification}
              InputProps={{ readOnly: true }}
              readonly
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Nombre completo"
              value={employee.name}
              InputProps={{ readOnly: true }}
              readonly
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Cargo"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              error={Boolean(errors.position)}
              helperText={errors.position}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Código de Nómina"
              name="payrollCode"
              value={formData.payrollCode}
              onChange={handleChange}
              required
              error={Boolean(errors.payrollCode)}
              helperText={errors.payrollCode}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Salario Base"
              name="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={handleChange}
              required
              error={Boolean(errors.baseSalary)}
              helperText={errors.baseSalary}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              select
              label="Tipo de Contrato"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              required
              error={Boolean(errors.contractType)}
              helperText={errors.contractType}
            >
              {contractTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextFieldGeneric>
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              select
              label="Departamento"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              error={Boolean(errors.area)}
              helperText={errors.area}
            >
              {departments.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextFieldGeneric>
          </GridItem>
        </Grid>
        {/* Información de nómina */}
        <SectionLabel variant="overline" sx={{ mt: 4 }}>
          Información de Nómina
        </SectionLabel>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Salario Bruto"
              name="salaryGross"
              type="number"
              value={formData.salaryGross}
              onChange={handleChange}
              error={Boolean(errors.salaryGross)}
              helperText={errors.salaryGross}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Rebajas CCSS"
              name="ccssDeduction"
              type="number"
              value={formData.ccssDeduction}
              onChange={handleChange}
              error={Boolean(errors.ccssDeduction)}
              helperText={errors.ccssDeduction}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Otras Rebajas"
              name="otherDeductions"
              type="number"
              value={formData.otherDeductions}
              onChange={handleChange}
              error={Boolean(errors.otherDeductions)}
              helperText={errors.otherDeductions}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Salario por Hora"
              name="salaryPerHour"
              type="number"
              value={formData.salaryPerHour}
              onChange={handleChange}
              error={Boolean(errors.salaryPerHour)}
              helperText={errors.salaryPerHour}
              required
            />
          </GridItem>
        </Grid>
        {/* Horas */}
        <SectionLabel variant="overline" sx={{ mt: 4 }}>
          Horas
        </SectionLabel>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="Horas Ordinarias"
              name="ordinaryHours"
              type="number"
              value={formData.ordinaryHours}
              onChange={handleChange}
              error={Boolean(errors.ordinaryHours)}
              helperText={errors.ordinaryHours}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="Horas Extras"
              name="extraHours"
              type="number"
              value={formData.extraHours}
              onChange={handleChange}
              error={Boolean(errors.extraHours)}
              helperText={errors.extraHours}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="Horas Otras"
              name="otherHours"
              type="number"
              value={formData.otherHours}
              onChange={handleChange}
              error={Boolean(errors.otherHours)}
              helperText={errors.otherHours}
              required
            />
          </GridItem>
        </Grid>
        {/* Beneficios */}
        <SectionLabel variant="overline" sx={{ mt: 4 }}>
          Beneficios
        </SectionLabel>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="$ Vacaciones"
              name="vacationAmount"
              type="number"
              value={formData.vacationAmount}
              onChange={handleChange}
              error={Boolean(errors.vacationAmount)}
              helperText={errors.vacationAmount}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="$ Incapacidad"
              name="incapacityAmount"
              type="number"
              value={formData.incapacityAmount}
              onChange={handleChange}
              error={Boolean(errors.incapacityAmount)}
              helperText={errors.incapacityAmount}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="$ Lactancia"
              name="lactationAmount"
              type="number"
              value={formData.lactationAmount}
              onChange={handleChange}
              error={Boolean(errors.lactationAmount)}
              helperText={errors.lactationAmount}
              required
            />
          </GridItem>
        </Grid>
        {/* Cálculos */}
        <SectionLabel variant="overline" sx={{ mt: 4 }}>
          Cálculos
        </SectionLabel>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Salario Neto (estimado)"
              value={`${netSalary.toFixed(2)}`}
              InputProps={{ readOnly: true }}
              readonly
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Salario por Hora (estimado)"
              value={`${hourlySalary.toFixed(2)}`}
              InputProps={{ readOnly: true }}
              readonly
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
          {loading ? "Guardando..." : "Guardar"}
        </ButtonGeneric>
      </ButtonContainer>
    </FormContainer>
  );
};
