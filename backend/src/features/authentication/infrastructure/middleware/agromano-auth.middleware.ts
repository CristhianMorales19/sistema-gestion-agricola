import { Request, Response, NextFunction } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { AgroManoUserSyncService } from '../../application/services/agromano-user-sync.service';

/**
 * Middleware de validación de JWT de Auth0
 * Valida el token contra Auth0 usando JWKS
 */
export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }) as GetVerificationKey,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

/**
 * Middleware híbrido para sistema Agromano
 * 1. Valida token de Auth0 (ya validado por checkJwt)
 * 2. Sincroniza usuario con mot_usuario
 * 3. Carga permisos desde mom_rol
 * 4. Agrega datos a la request
 */
export const agroManoAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // El token ya fue validado por checkJwt
    // Extraer datos del token Auth0
    const auth0User = req.auth;

    if (!auth0User || !auth0User.sub) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Token Auth0 inválido o no proporcionado'
      });
    }

    const auth0UserId = auth0User.sub; // Ej: "auth0|68b8a6d1bf1669b349577af6"
    const auth0Email = auth0User.email;
    const auth0EmailVerified = auth0User.email_verified;

    console.log(`🔐 Autenticando usuario Auth0: ${auth0UserId}`);

    // Sincronizar/obtener usuario local
    let localUser: {
      usuario_id: number;
      username?: string;
      email?: string;
      rol_id?: number;
      estado: string;
      trabajador_id?: number | null;
      mom_rol?: {
        codigo?: string;
        nombre?: string;
        rel_mom_rol__mom_permiso?: Array<{
          mom_permiso?: {
            codigo?: string;
            nombre?: string;
            categoria?: string;
          };
        }>;
      };
      mom_trabajador?: {
        trabajador_id: number;
        documento_identidad?: string | null;
        nombre_completo?: string | null;
        email?: string | null;
        telefono?: string | null;
      } | null;
      [key: string]: unknown;
    };
    try {
      localUser = await AgroManoUserSyncService.getOrCreateUser(auth0UserId, {
        email: auth0Email,
        email_verified: auth0EmailVerified,
        name: auth0User.name,
        picture: auth0User.picture,
        ...auth0User
      });
    } catch (syncError) {
      console.error('❌ Error sincronizando usuario:', syncError);
      return res.status(500).json({
        success: false,
        error: 'SYNC_ERROR',
        message: 'Error sincronizando usuario con base de datos local'
      });
    }

    if (!localUser) {
      return res.status(500).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'No se pudo crear o encontrar el usuario local'
      });
    }

    // Verificar que el usuario esté activo
    if (localUser.estado !== 'activo' && localUser.estado !== 'ACTIVO') {
      return res.status(403).json({
        success: false,
        error: 'USER_INACTIVE',
        message: 'Usuario inactivo en el sistema'
      });
    }

    // Extraer permisos del rol (ya incluidos en localUser por getOrCreateUser)
    const permisos = localUser.mom_rol?.rel_mom_rol__mom_permiso?.map((rp) => 
      rp.mom_permiso?.codigo
    ).filter((codigo): codigo is string => codigo !== undefined) || [];

    // Agregar datos a la request para usar en los controladores
    req.user = {
      // Datos de Auth0
      auth0_id: auth0UserId,
      auth0_email: auth0Email,
      auth0_email_verified: auth0EmailVerified,

      // Datos locales (mot_usuario)
      usuario_id: localUser.usuario_id,
      username: localUser.username,
      email: localUser.email,
      rol_id: localUser.rol_id,
      rol_codigo: localUser.mom_rol?.codigo,
      rol_nombre: localUser.mom_rol?.nombre,
      estado: localUser.estado,

      // Datos del trabajador (si existe)
      trabajador_id: localUser.trabajador_id,
      trabajador: localUser.mom_trabajador ? {
        trabajador_id: localUser.mom_trabajador.trabajador_id,
        documento_identidad: localUser.mom_trabajador.documento_identidad,
        nombre_completo: localUser.mom_trabajador.nombre_completo,
        email: localUser.mom_trabajador.email,
        telefono: localUser.mom_trabajador.telefono
      } : null,

      // Permisos
      permisos: permisos,

      // Métodos auxiliares
      hasPermiso: (codigo: string) => permisos.includes(codigo),
      hasAnyPermiso: (...codigos: string[]) => 
        codigos.some(codigo => permisos.includes(codigo)),
      hasAllPermisos: (...codigos: string[]) => 
        codigos.every(codigo => permisos.includes(codigo)),
      isAdmin: () => [
        'ADMIN',
        'ADMIN_AGROMANO',
        'GERENTE_RRHH'
      ].includes(localUser.mom_rol?.codigo || ''),
      isSupervisor: () => [
        'SUPERVISOR_CAMPO',
        'SUPERVISOR_RRHH'
      ].includes(localUser.mom_rol?.codigo || '')
    };

    console.log(`✅ Usuario autenticado: ${localUser.username} (Rol: ${localUser.mom_rol?.nombre})`);

    next();

  } catch (error) {
    console.error('❌ Error en agroManoAuthMiddleware:', error);

    // Si es un error de JWT, devolver 401
    if (error && typeof error === 'object' && 'name' in error && error.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Token inválido o expirado'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error en el proceso de autenticación'
    });
  }
};

/**
 * Middleware para verificar permisos específicos
 * Uso: requirePermiso('trabajadores:update:all')
 */
export const requirePermiso = (...permisos: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Usuario no autenticado'
      });
    }

    const tienePermiso = permisos.some(p => user.hasPermiso(p));

    if (!tienePermiso) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Permiso requerido: ${permisos.join(' o ')}`,
        permisos_requeridos: permisos,
        permisos_usuario: user.permisos
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el usuario tenga rol de administrador
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Usuario no autenticado'
    });
  }

  if (!user.isAdmin()) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Acceso restringido a administradores',
      rol_actual: user.rol_nombre
    });
  }

  next();
};

/**
 * Middleware para verificar que el usuario tenga rol de supervisor o admin
 */
export const requireSupervisorOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Usuario no autenticado'
    });
  }

  if (!user.isAdmin() && !user.isSupervisor()) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'Acceso restringido a supervisores y administradores',
      rol_actual: user.rol_nombre
    });
  }

  next();
};
