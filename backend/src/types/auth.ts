import { Request } from 'express';

// Extender el tipo Request de Express para incluir usuario de Auth0
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string; // ID del usuario en Auth0
        email?: string;
        name?: string;
        permissions?: string[]; // Permisos de Auth0
        roles?: string[]; // Roles de Auth0
        
        // Campos personalizados del sistema
        usuario_id?: number;
        username?: string;
        rol_id?: number;
        trabajador_id?: number;
        permisos?: string[];
      };
    }
  }
}

// Tipos específicos para Auth0
export interface Auth0User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  permissions?: string[];
}

// Tipos para RBAC del sistema
export interface UsuarioSistema {
  usuario_id: number;
  username: string;
  rol_id: number;
  trabajador_id?: number;
  permisos: string[];
}

export {};
