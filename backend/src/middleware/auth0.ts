import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Función para obtener la llave de firma
function getKey(header: any, callback: any) {
  // Crear el cliente dinámicamente para asegurar que las variables de entorno estén cargadas
  const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  });
  
  console.log('🔑 Intentando obtener clave pública de:', `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`);
  
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.log('❌ Error obteniendo clave:', err.message);
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    console.log('✅ Clave pública obtenida exitosamente');
    callback(null, signingKey);
  });
}

// Middleware para verificar token de Auth0
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  console.log('🔍 verifyToken - Token recibido:', token ? 'Sí' : 'No');
  console.log('🔍 AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE);
  console.log('🔍 AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.log('❌ Token verification error:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: err.message
      });
    }

    console.log('✅ Token válido, usuario:', decoded?.sub);
    // Agregar información del usuario al request
    (req as any).user = decoded;
    next();
  });
};

// Middleware para verificar permisos específicos
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Verificar si el usuario tiene el permiso requerido
    const userPermissions = user.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permiso requerido: ${permission}`,
        userPermissions: userPermissions
      });
    }

    next();
  };
};
