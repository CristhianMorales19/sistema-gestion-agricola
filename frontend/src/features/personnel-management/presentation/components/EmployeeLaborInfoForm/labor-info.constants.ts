import { LaborInfoData } from "@features/personnel-management/domain/entities/laborInfoEmployee";

export const INITIAL_LABOR_INFO: LaborInfoData = {
  payrollCode: "",
  position: "",
  baseSalary: "",
  contractType: "",
  area: "",
  salaryGross: "",
  ccssDeduction: "",
  otherDeductions: "",
  salaryPerHour: "",
  ordinaryHours: "",
  extraHours: "",
  otherHours: "",
  vacationAmount: "",
  incapacityAmount: "",
  lactationAmount: "",
};

export const contractTypes = [
  { value: "full_time", label: "Tiempo Completo" },
  { value: "part_time", label: "Medio Tiempo" },
  { value: "temporary", label: "Temporal" },
  { value: "freelance", label: "Freelance" },
];

export const departments = [
  { value: "hr", label: "Recursos Humanos" },
  { value: "it", label: "Tecnología" },
  { value: "finance", label: "Finanzas" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operaciones" },
  { value: "sales", label: "Ventas" },
];

export const numericFields = [
  "baseSalary",
  "salaryGross",
  "ccssDeduction",
  "otherDeductions",
  "salaryPerHour",
  "ordinaryHours",
  "extraHours",
  "otherHours",
  "vacationAmount",
  "incapacityAmount",
  "lactationAmount",
];
