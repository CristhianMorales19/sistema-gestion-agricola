import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

// Verificar variables de entorno antes de configurar Auth0
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;

console.log('🔍 DEBUG AUTH0 CONFIG:');
console.log('AUTH0_DOMAIN:', auth0Domain || 'UNDEFINED');
console.log('AUTH0_AUDIENCE:', auth0Audience || 'UNDEFINED');
console.log('JWKS URI:', `https://${auth0Domain}/.well-known/jwks.json`);

if (!auth0Domain || !auth0Audience) {
  throw new Error(`Variables de entorno Auth0 faltantes: DOMAIN=${auth0Domain}, AUDIENCE=${auth0Audience}`);
}

// Configuración del middleware JWT para Auth0
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
  }) as any,
  audience: auth0Audience,
  issuer: `https://${auth0Domain}/`,
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
