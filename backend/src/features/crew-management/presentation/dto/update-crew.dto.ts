// cuadrillas/application/update-crew.schema.ts
import { z } from "zod";

export const UpdateCrewSchema = z.object({
  code: z.string().min(1).optional(),
  description: z.string().optional(),
  workArea: z.string().optional(),
  workers: z.array(z.number().int().positive()).optional(),
});

export type UpdateCrewDTO = z.infer<typeof UpdateCrewSchema>;
