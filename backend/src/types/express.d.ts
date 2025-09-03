// Extensión de tipos para Express
export {};

declare global {
  namespace Express {
    interface User {
      permissions?: string[];
      sub?: string;
      email?: string;
    }

    interface Request {
      user?: User;
      auth?: any;
      auth0User?: {
        sub: string;
        email: string;
        permissions: string[];
      };
      localUser?: any;
      userPermissions?: string[];
      userRoles?: string[];
    }
  }
}
