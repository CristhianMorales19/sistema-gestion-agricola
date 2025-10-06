import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware híbrido: Auth0 + BD Local
 * 
 * Requisito previo: checkJwt debe ejecutarse primero
 * - checkJwt establece req.auth con datos de Auth0
 * - Este middleware busca el usuario en BD y carga permisos
 */
export const loadLocalUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar que checkJwt ya se ejecutó
    if (!req.auth || !req.auth.sub) {
      return res.status(401).json({
        success: false,
        message: 'Token Auth0 requerido - checkJwt debe ejecutarse primero'
      });
    }

    const auth0UserId = req.auth.sub; // ej: "auth0|123456"

    // Buscar usuario en BD local por auth0_id o auth0_user_id (por compatibilidad)
    const usuario = await prisma.mot_usuario.findFirst({
      where: {
        OR: [
          { auth0_id: auth0UserId },
          { auth0_user_id: auth0UserId }
        ],
        estado: { not: 'inactivo' } // Permitir 'activo' y 'ACTIVO'
      },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              where: {
                mom_permiso: {
                  is_activo: true
                }
              },
              include: {
                mom_permiso: true
              }
            }
          }
        },
        mom_trabajador: true
      }
    });

    if (!usuario) {
      // Usuario autenticado en Auth0 pero no existe en BD local
      // Esto puede ser normal para nuevos usuarios
      console.warn(`Usuario Auth0 ${auth0UserId} no encontrado en BD local`);
      
      // Continuar sin datos locales (para endpoints que no los requieren)
      req.localUser = undefined;
      return next();
    }

    // Extraer permisos del usuario
    const permisos = usuario.mom_rol?.rel_mom_rol__mom_permiso.map(
      rp => rp.mom_permiso.codigo!
    ) || [];

    // Establecer datos del usuario local en la request
    req.localUser = {
      usuario_id: usuario.usuario_id,
      username: usuario.username,
      email: usuario.email || req.auth.email || '',
      rol_id: usuario.rol_id,
      rol_nombre: usuario.mom_rol?.descripcion || 'Sin rol',
      estado: usuario.estado,
      trabajador_id: usuario.trabajador_id || undefined,
      trabajador: usuario.mom_trabajador || undefined,
      permisos,
      auth0_user_id: usuario.auth0_user_id || auth0UserId
    };

    next();
  } catch (error) {
    console.error('Error en loadLocalUserData:', error);
    
    // No fallar la petición, continuar sin datos locales
    req.localUser = undefined;
    next();
  }
};

/**
 * Middleware que REQUIERE que el usuario exista en BD local
 * Usar cuando el endpoint necesita obligatoriamente datos de la BD
 */
export const requireLocalUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.localUser) {
    return res.status(403).json({
      success: false,
      message: 'Usuario no registrado en el sistema local',
      hint: 'El usuario está autenticado en Auth0 pero no existe en la base de datos'
    });
  }
  next();
};

/**
 * Middleware para verificar permisos específicos
 * @param requiredPermissions - Array de permisos requeridos (OR logic)
 */
export const requirePermissions = (requiredPermissions: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.localUser) {
      return res.status(403).json({
        success: false,
        message: 'Usuario sin datos locales - permisos no disponibles'
      });
    }

    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    const hasPermission = permissions.some(
      permission => req.localUser?.permisos?.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
        required: permissions,
        current: req.localUser.permisos
      });
    }

    next();
  };
};

/**
 * Middleware para verificar rol específico
 */
export const requireRole = (allowedRoles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.localUser) {
      return res.status(403).json({
        success: false,
        message: 'Usuario sin datos locales - rol no disponible'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    const userRole = String(req.localUser.rol_nombre);
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Rol insuficiente',
        required: roles,
        current: userRole
      });
    }

    next();
  };
};
