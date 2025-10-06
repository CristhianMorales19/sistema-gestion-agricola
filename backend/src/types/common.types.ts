import { Request } from 'express';

/**
 * Tipo extendido para Request con usuario autenticado
 * Usado en toda la aplicación cuando el middleware de autenticación agrega datos del usuario
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    usuario_id?: number;
    sub?: string;
    email?: string;
    permissions?: string[];
    dbUser?: {
      usuario_id: number;
      username: string;
      email: string;
      rol_id: number;
      estado: string;
    };
  };
  localUser?: {
    usuario_id: number;
    username: string;
    email: string;
    rol_id: number;
    estado: string;
  };
}

/**
 * Tipo genérico para errores con propiedades adicionales
 */
export type ExtendedError = Error & {
  code?: string;
  statusCode?: number;
  response?: {
    data?: unknown;
  };
  data?: unknown;
};

/**
 * Tipo para resultados de consultas SQL crudas
 */
export type RawSQLResult = Record<string, unknown>;