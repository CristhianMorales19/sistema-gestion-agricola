export interface Auth0User {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  permissions?: string[];
  scope?: string;
  [key: string]: unknown;
}

export interface TrabajadorInfo {
  trabajador_id: number;
  documento_identidad?: string | null;
  nombre_completo?: string | null;
  email?: string | null;
  telefono?: string | null;
}

export interface RolInfo {
  codigo?: string;
  nombre?: string;
  rel_mom_rol__mom_permiso?: Array<{
    mom_permiso?: {
      codigo?: string;
      nombre?: string;
      categoria?: string;
    };
  }>;
}

export interface LocalUser {
  usuario_id: number;
  username?: string;
  email?: string;
  rol_id?: number;
  estado: string;
  trabajador_id?: number | null;
  mom_rol?: RolInfo;
  mom_trabajador?: TrabajadorInfo | null;
  permisos?: string[];
  [key: string]: unknown;
}

export interface AgroManoUser {
  // Auth0 data
  auth0_id: string;
  auth0_email?: string;
  auth0_email_verified?: boolean;
  
  // Local database data
  usuario_id: number;
  username?: string;
  email?: string;
  rol_id?: number;
  rol_codigo?: string;
  rol_nombre?: string;
  estado: string;
  
  // Worker data
  trabajador_id?: number | null;
  trabajador?: TrabajadorInfo | null;
  
  // Permissions
  permisos: string[];
  permissions?: string[];
  
  // Helper methods
  hasPermiso: (codigo: string) => boolean;
  hasAnyPermiso: (...codigos: string[]) => boolean;
  hasAllPermisos: (...codigos: string[]) => boolean;
  isAdmin: () => boolean;
  isSupervisor: () => boolean;
  
  // Additional properties
  dbUser?: LocalUser;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      auth0User?: Auth0User;
      localUser?: LocalUser;
      userPermissions?: string[];
      userRoles?: string[];
      user?: AgroManoUser;
      auth?: {
        sub: string;
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
        permissions?: string[];
        scope?: string;
        'https://agromano.com/roles'?: string[];
        'https://agromano.com/permissions'?: string[];
        'https://agromano.com/user_metadata'?: {
          usuario_id?: number;
          rol_id?: number;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };
    }
  }
}

export {};
