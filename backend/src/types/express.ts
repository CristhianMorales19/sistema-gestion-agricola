export interface Auth0User {
  sub: string;
  email?: string;
  nickname?: string;
  permissions?: string[];
}

export interface LocalUser {
  usuario_id: number;
  username: string;
  rol_id: number;
  trabajador_id?: number;
  permisos?: string[];
}

declare global {
  namespace Express {
    interface Request {
      auth0User?: Auth0User;
      localUser?: LocalUser;
      userPermissions?: string[];
      userRoles?: string[];
      dbUser?: any;
    }
  }
}

export {};
