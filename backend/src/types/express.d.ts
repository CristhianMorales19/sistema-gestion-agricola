import { Auth0User, LocalUser, AgroManoUser } from "./auth.types";

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
        "https://agromano.com/roles"?: string[];
        "https://agromano.com/permissions"?: string[];
        "https://agromano.com/user_metadata"?: {
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
