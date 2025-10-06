import { Request } from 'express';

/**
 * Tipo extendido para Request con usuario autenticado
 * Usado en toda la aplicación cuando el middleware de autenticación agrega datos del usuario
 * 
 * NOTA: Los tipos de usuario ya están definidos globalmente en express.ts
 * Esta interfaz se mantiene para compatibilidad pero ahora usa los tipos globales
 */
export interface AuthenticatedRequest extends Request {
  // Los tipos user, localUser, auth0User están definidos en la extensión global de Express
  // en src/types/express.ts, por lo que no necesitamos redefinirlos aquí
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
