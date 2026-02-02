import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.errors,
      });
    }

    req.body = result.data;
    next();
  };
