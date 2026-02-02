// cuadrillas/application/create-crew.schema.ts
import { z } from "zod";

export const CreateCrewSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  description: z.string().optional(),
  workArea: z.string().optional(),
  workers: z.array(z.number().int().positive()).optional(),
});

export type CreateCrewDTO = z.infer<typeof CreateCrewSchema>;
