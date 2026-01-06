/* eslint-disable */
import { Auth0User, LocalUser } from './express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: any;
      auth0User?: Auth0User;
      localUser?: LocalUser;
      userPermissions?: string[];
      userRoles?: string[];
    }
  }
}

export {};