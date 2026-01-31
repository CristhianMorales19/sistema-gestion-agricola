import { z } from "zod";

export const CreateEmployeeSchema = z.object({
  identification: z
    .string()
    .regex(/^[a-zA-Z0-9]{8,}$/, "La cédula debe tener al menos 8 caracteres")
    .min(1, "La cédula es obligatoria"),

  name: z.string().min(3, "El nombre es obligatorio"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  hireDate: z.string().min(1, "La fecha de ingreso es obligatoria"),
  email: z.string().email().optional(),

  phone: z
    .string()
    .regex(/^\d{8}$/, "El teléfono debe tener 8 dígitos numéricos")
    .optional(),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
