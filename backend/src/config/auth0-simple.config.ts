import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

// Configuración del middleware JWT para Auth0
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }) as any,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Middleware para asignar datos del token JWT a req.user
export const setUser = (req: Request, res: Response, next: NextFunction) => {
  // Intentar obtener permisos desde diferentes fuentes
  let permissions: string[] = [];
  
  if ((req as any).auth?.permissions) {
    permissions = (req as any).auth.permissions;
  } else if ((req as any).auth0User?.permissions) {
    permissions = (req as any).auth0User.permissions;
  } else if ((req as any).userPermissions) {
    permissions = (req as any).userPermissions;
  }
  
  // Asignar al objeto user
  (req as any).user = {
    permissions: permissions
  };
  
  next();
};

export default { checkJwt };
