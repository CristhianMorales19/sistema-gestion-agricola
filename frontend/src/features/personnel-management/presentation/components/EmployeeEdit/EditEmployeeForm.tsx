import React, { useState, useCallback, useEffect } from "react";
import { MenuItem, Grid } from "@mui/material";
import {
  validateLaborInfo,
  LaborInfoErrors,
  hasErrors as hasErrorsLabor,
} from "../EmployeeLaborInfoForm/labor-info.validation";
import {
  FormContainer,
  GridItem,
  ButtonContainer,
  ErrorMessage,
  SectionLabel,
  StyledArrowBackIcon,
  InputSection,
} from "../../../../../shared/presentation/styles/Form.styles";
import { LaborInfoData } from "@features/personnel-management/domain/entities/labor-info-employee";
import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import {
  contractTypes,
  departments,
  INITIAL_LABOR_INFO,
  numericFields,
} from "../EmployeeLaborInfoForm/labor-info.constants";
import {
  Employee,
  EditEmployeeData,
} from "@features/personnel-management/domain/entities/employee";
import {
  CreateEmployeeErrors,
  validateCreateEmployee,
  hasErrors as hasErrorsBasic,
} from "./edit-employee.validation";
import { useEmployeeManagement } from "../../../application/hooks/use-employee-management";
import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../../shared/presentation/styles/LoadingSpinner.styles";

const INITIAL_BASIC_EMPLOYEE: Employee = {
  id: 0,
  identification: "",
  name: "",
  birthDate: "",
  hireDate: new Date().toISOString().split("T")[0],
  phone: "",
  email: "",
  status: false,
};

interface EditEmployeeProps {
  employeeId: number | undefined;
  onSave: (id: number, data: EditEmployeeData) => Promise<void>;
  onCancel: () => void;
}

export const EditEmployeeForm = ({
  employeeId,
  onSave,
  onCancel,
}: EditEmployeeProps) => {
  const { findById } = useEmployeeManagement();
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formBasicData, setFormBasiData] = useState<Employee>(
    INITIAL_BASIC_EMPLOYEE,
  );
  const [basicErrors, setBasicErrors] = useState<CreateEmployeeErrors>({});

  const [formLaborInfoData, setFormLaborInfoData] =
    useState<LaborInfoData>(INITIAL_LABOR_INFO);
  const [laborInfoErrors, setLaborInfoErrors] = useState<LaborInfoErrors>({});

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      const result = await findById(employeeId);
      if (result) {
        setFormBasiData(result.employee);
        if (result.laborInfo) setFormLaborInfoData(result.laborInfo);
      }
      setIsFetching(false);
    };

    fetchEmployee();
  }, [employeeId, findById]);

  const handleChangeBasic = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormBasiData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Limpiar error del campo al escribir
      setBasicErrors((prev) => {
        const copy = { ...prev };
        delete copy[name as keyof Employee];
        return copy;
      });
    },
    [],
  );

  const handleChangeLaborInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormLaborInfoData((prev) => {
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

      setLaborInfoErrors((prev) => {
        const copy = { ...prev };
        delete copy[name as keyof LaborInfoData];
        return copy;
      });
    },
    [],
  );

  const validateForm = useCallback((): Boolean => {
    const newErrorsBasic = validateCreateEmployee(formBasicData);
    const newErrorsLaborInfo = validateLaborInfo(formLaborInfoData);
    setLaborInfoErrors(newErrorsLaborInfo);
    setBasicErrors(newErrorsBasic);
    return (
      !hasErrorsLabor(newErrorsLaborInfo) && !hasErrorsBasic(newErrorsBasic)
    );
  }, [formLaborInfoData, formBasicData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!employeeId) return;
      if (!validateForm()) return;

      setIsSubmitting(true);
      await onSave(formBasicData.id, {
        employee: formBasicData,
        laborInfo: formLaborInfoData,
      });
      setIsSubmitting(false);
    },
    [employeeId, formLaborInfoData, formBasicData, onSave, validateForm],
  );

  const toNumber = (value: number | "" | undefined) =>
    typeof value === "number" && !isNaN(value) ? value : 0;

  const gross =
    toNumber(formLaborInfoData.salaryGross) ||
    toNumber(formLaborInfoData.baseSalary);

  const netSalary =
    gross -
    toNumber(formLaborInfoData.ccssDeduction) -
    toNumber(formLaborInfoData.otherDeductions);

  const hourlySalary =
    toNumber(formLaborInfoData.salaryPerHour) > 0
      ? toNumber(formLaborInfoData.salaryPerHour)
      : gross > 0
        ? gross / (30 * 8)
        : 0;

  if (!employeeId) {
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

  if (isFetching) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <FormContainer component="form" onSubmit={handleSubmit}>
      <TextGeneric variant="h6">Editar Empleado</TextGeneric>

      <InputSection>
        {/* Información básica laboral */}
        <SectionLabel variant="overline">Información Básica</SectionLabel>
        <Grid container spacing={3}>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Cédula"
              name="identification"
              value={formBasicData.identification}
              onChange={handleChangeBasic}
              error={Boolean(basicErrors.identification)}
              helperText={basicErrors.identification}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Nombre completo"
              name="name"
              value={formBasicData.name}
              onChange={handleChangeBasic}
              error={Boolean(basicErrors.name)}
              helperText={basicErrors.name}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Fecha de nacimiento"
              name="birthDate"
              type="date"
              value={formBasicData.birthDate}
              onChange={handleChangeBasic}
              error={Boolean(basicErrors.birthDate)}
              helperText={basicErrors.birthDate}
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
              value={formBasicData.hireDate}
              onChange={handleChangeBasic}
              error={Boolean(basicErrors.hireDate)}
              helperText={basicErrors.hireDate}
              required
              InputLabelProps={{ shrink: true }}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Teléfono"
              name="phone"
              value={formBasicData.phone}
              required
              onChange={handleChangeBasic}
              error={Boolean(basicErrors.phone)}
              helperText={basicErrors.phone}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              required
              value={formBasicData.email}
              onChange={handleChangeBasic}
              error={Boolean(basicErrors.email)}
              helperText={basicErrors.email}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Cargo"
              name="position"
              value={formLaborInfoData.position}
              onChange={handleChangeLaborInfo}
              required
              error={Boolean(laborInfoErrors.position)}
              helperText={laborInfoErrors.position}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="Código de Nómina"
              name="payrollCode"
              value={formLaborInfoData.payrollCode}
              onChange={handleChangeLaborInfo}
              required
              error={Boolean(laborInfoErrors.payrollCode)}
              helperText={laborInfoErrors.payrollCode}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Salario Base"
              name="baseSalary"
              type="number"
              value={formLaborInfoData.baseSalary}
              onChange={handleChangeLaborInfo}
              required
              error={Boolean(laborInfoErrors.baseSalary)}
              helperText={laborInfoErrors.baseSalary}
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              select
              label="Tipo de Contrato"
              name="contractType"
              value={formLaborInfoData.contractType}
              onChange={handleChangeLaborInfo}
              required
              error={Boolean(laborInfoErrors.contractType)}
              helperText={laborInfoErrors.contractType}
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
              value={formLaborInfoData.area}
              onChange={handleChangeLaborInfo}
              required
              error={Boolean(laborInfoErrors.area)}
              helperText={laborInfoErrors.area}
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
              value={formLaborInfoData.salaryGross}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.salaryGross)}
              helperText={laborInfoErrors.salaryGross}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Rebajas CCSS"
              name="ccssDeduction"
              type="number"
              value={formLaborInfoData.ccssDeduction}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.ccssDeduction)}
              helperText={laborInfoErrors.ccssDeduction}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Otras Rebajas"
              name="otherDeductions"
              type="number"
              value={formLaborInfoData.otherDeductions}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.otherDeductions)}
              helperText={laborInfoErrors.otherDeductions}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={6}>
            <TextFieldGeneric
              fullWidth
              label="$ Salario por Hora"
              name="salaryPerHour"
              type="number"
              value={formLaborInfoData.salaryPerHour}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.salaryPerHour)}
              helperText={laborInfoErrors.salaryPerHour}
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
              value={formLaborInfoData.ordinaryHours}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.ordinaryHours)}
              helperText={laborInfoErrors.ordinaryHours}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="Horas Extras"
              name="extraHours"
              type="number"
              value={formLaborInfoData.extraHours}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.extraHours)}
              helperText={laborInfoErrors.extraHours}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="Horas Otras"
              name="otherHours"
              type="number"
              value={formLaborInfoData.otherHours}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.otherHours)}
              helperText={laborInfoErrors.otherHours}
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
              value={formLaborInfoData.vacationAmount}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.vacationAmount)}
              helperText={laborInfoErrors.vacationAmount}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="$ Incapacidad"
              name="incapacityAmount"
              type="number"
              value={formLaborInfoData.incapacityAmount}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.incapacityAmount)}
              helperText={laborInfoErrors.incapacityAmount}
              required
            />
          </GridItem>
          <GridItem item xs={12} sm={4}>
            <TextFieldGeneric
              fullWidth
              label="$ Lactancia"
              name="lactationAmount"
              type="number"
              value={formLaborInfoData.lactationAmount}
              onChange={handleChangeLaborInfo}
              error={Boolean(laborInfoErrors.lactationAmount)}
              helperText={laborInfoErrors.lactationAmount}
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
          Cancelar
        </BackButtonGeneric>
        <ButtonGeneric type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </ButtonGeneric>
      </ButtonContainer>
    </FormContainer>
  );
};
