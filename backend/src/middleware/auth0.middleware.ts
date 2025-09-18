import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkJwt } from '../config/auth0.config';
import { Auth0User, LocalUser } from '../types/express'; // Importar desde el archivo único

const prisma = new PrismaClient();

// // Interfaz para el usuario de Auth0
// interface Auth0User {
//   sub: string;
//   email?: string;
//   nickname?: string;
//   permissions?: string[];
// }

// // Interfaz para el usuario local de la base de datos
// interface LocalUser {
//   usuario_id: number;
//   username: string;
//   rol_id: number;
//   trabajador_id?: number;
//   permisos: string[];
// }

// Extender el tipo Request de Express
// declare global {
//   namespace Express {
//     interface Request {
//       auth0User?: Auth0User;
//       userPermissions?: string[];
//       userRoles?: string[];
//       localUser?: LocalUser;
//     }
//   }
// }


/**
 * Middleware combinado: Auth0 JWT + Permisos de base de datos local
 */
export const authenticateAuth0 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Verificar JWT de Auth0
    checkJwt(req, res, async (jwtError: any) => {
      if (jwtError) {
        return res.status(401).json({
          success: false,
          message: 'Token de Auth0 inválido',
          error: jwtError.message
        });
      }

      try {
        // 2. Obtener información del usuario de Auth0
        const auth0User = req.user as unknown as Auth0User;
        const auth0UserId = auth0User?.sub;
        const userEmail = auth0User?.email;

        if (!auth0UserId) {
          return res.status(401).json({
            success: false,
            message: 'ID de usuario de Auth0 no encontrado'
          });
        }

        // 3. Buscar usuario en la base de datos local usando email o Auth0 ID
        const usuario = await prisma.mot_usuario.findFirst({
          where: {
            OR: [
              { username: userEmail },
              // Puedes agregar un campo auth0_id en el futuro
              { username: auth0UserId }
            ],
            estado: 'activo'
          },
          include: {
            mom_rol: {
              include: {
                rel_mom_rol__mom_permiso: {
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
          return res.status(403).json({
            success: false,
            message: 'Usuario no encontrado en el sistema local. Contacte al administrador.'
          });
        }

        // 4. Extraer permisos del usuario
        const permisos = usuario.mom_rol.rel_mom_rol__mom_permiso
          .map(rel => rel.mom_permiso.codigo)
          .filter((codigo): codigo is string => codigo !== null);


        // 5. Agregar información al request
        req.auth0User = {
          sub: auth0UserId,
          email: userEmail,
          permissions: auth0User?.permissions || []
        };

        req.localUser = {
          usuario_id: usuario.usuario_id,
          username: usuario.username,
          rol_id: usuario.rol_id,
          trabajador_id: usuario.trabajador_id || undefined,
          permisos: permisos
        };

        req.userPermissions = permisos;
        req.userRoles = [usuario.mom_rol.codigo];

        console.log(`✅ Usuario autenticado: ${userEmail} (${usuario.mom_rol.nombre})`);
        next();

      } catch (dbError) {
        console.error('Error consultando base de datos:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
    });

  } catch (error) {
    console.error('Error en autenticación Auth0:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el proceso de autenticación'
    });
  }
};

/**
 * Middleware para verificar permisos específicos
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Permisos no cargados'
      });
    }

    if (!req.userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere permiso: ${permission}`,
        required_permission: permission,
        user_permissions: req.userPermissions
      });
    }

    console.log(`✅ Permiso verificado: ${permission} para usuario ${req.localUser?.username}`);
    next();
  };
};

/**
 * Middleware para verificar múltiples permisos (ANY)
 */
export const requireAnyPermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Permisos no cargados'
      });
    }

    const hasPermission = permissions.some(permission => 
      req.userPermissions!.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        required_permissions: permissions,
        user_permissions: req.userPermissions
      });
    }

    next();
  };
};

/**
 * Middleware para verificar múltiples permisos (ALL)
 */
export const requireAllPermissions = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Permisos no cargados'
      });
    }

    const hasAllPermissions = permissions.every(permission => 
      req.userPermissions!.includes(permission)
    );

    if (!hasAllPermissions) {
      const missingPermissions = permissions.filter(permission => 
        !req.userPermissions!.includes(permission)
      );

      return res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        missing_permissions: missingPermissions,
        user_permissions: req.userPermissions
      });
    }

    next();
  };
};

/**
 * Middleware para verificar rol específico
 */
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRoles || !req.userRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${role}`,
        required_role: role,
        user_roles: req.userRoles
      });
    }

    next();
  };
};

/**
 * Middleware solo para administradores
 */
export const requireAdmin = requireRole('ADMIN');

/**
 * Middleware solo para supervisores o admin
 */
export const requireSupervisorOrAdmin = requireAnyPermission(['supervisor:all', 'admin:all']);
