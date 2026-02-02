import { z } from "zod";
import { CreateEmployeeSchema } from "./create-employee.dto";

export const LaborInfoSchema = z.object({
  position: z.string().min(1, "El cargo es obligatorio"),
  contractType: z.string().min(1, "El tipo de contrato es obligatorio"),
  area: z.string().min(1, "El área es obligatoria"),
  payrollCode: z.string().min(1, "El código de nómina es obligatorio"),

  baseSalary: z.number().nonnegative("No puede ser negativo"),
  salaryGross: z.number().nonnegative("No puede ser negativo"),
  ccssDeduction: z.number().nonnegative("No puede ser negativo"),
  salaryPerHour: z.number().nonnegative("No puede ser negativo"),
  ordinaryHours: z.number().nonnegative("No puede ser negativo"),
  otherDeductions: z.number().nonnegative("No puede ser negativo"),
  extraHours: z.number().nonnegative("No puede ser negativo"),
  otherHours: z.number().nonnegative("No puede ser negativo"),
  vacationAmount: z.number().nonnegative("No puede ser negativo"),
  incapacityAmount: z.number().nonnegative("No puede ser negativo"),
  lactationAmount: z.number().nonnegative("No puede ser negativo"),
});

export const UpdateEmployeeSchema = z.object({
  employee: CreateEmployeeSchema,
  laborInfo: LaborInfoSchema,
});

export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;
