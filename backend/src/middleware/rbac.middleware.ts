import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { LocalUser } from '../types/express'; // Importar desde el archivo único

const prisma = new PrismaClient();

// Extender el tipo Request para incluir usuario autenticado
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         usuario_id: number;
//         username: string;
//         rol_id: number;
//         trabajador_id?: number;
//         permisos?: string[];
//       };
//     }
//   }
// }

/**
 * Middleware para verificar JWT y cargar permisos del usuario
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Buscar el usuario y sus permisos en la base de datos
    const usuario = await prisma.mot_usuario.findUnique({
      where: {
        usuario_id: decoded.usuario_id,
        estado: 'activo'
      },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              where: {  // where va aquí, no dentro de mom_permiso
                mom_permiso: {
                  is_activo: true
                }
              },
              include: {
                mom_permiso: true
              }
            }
          }
        }
      }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Extraer permisos del usuario
    const permisos = usuario.mom_rol.rel_mom_rol__mom_permiso.map(
      rp => rp.mom_permiso.codigo!
    );

    // Agregar usuario a la request
    req.localUser = {
      usuario_id: usuario.usuario_id,
      username: usuario.username,
      rol_id: usuario.rol_id,
      estado: usuario.estado,
      trabajador_id: usuario.trabajador_id || undefined,
      permisos
    };

    next();
  } catch (error) {
    console.error('Error en authenticateToken:', error);
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar permisos específicos
 * @param requiredPermissions - Array de permisos requeridos (OR logic)
 */
export const requirePermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { localUser } = req;

      if (!localUser || !localUser.permisos) {
        return res.status(403).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Verificar si el usuario tiene al menos uno de los permisos requeridos
      const hasPermission = requiredPermissions.some(permission => 
        localUser.permisos!.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para realizar esta acción',
          permisosRequeridos: requiredPermissions,
          permisosUsuario: localUser.permisos
        });
      }

      next();
    } catch (error) {
      console.error('Error en requirePermissions:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar que se requieren TODOS los permisos (AND logic)
 * @param requiredPermissions - Array de permisos requeridos (AND logic)
 */
export const requireAllPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { localUser } = req;

      if (!localUser || !localUser.permisos) {
        return res.status(403).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Verificar si el usuario tiene TODOS los permisos requeridos
      const hasAllPermissions = requiredPermissions.every(permission => 
        localUser.permisos!.includes(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: 'No tienes todos los permisos necesarios para esta acción',
          permisosRequeridos: requiredPermissions,
          permisosUsuario: localUser.permisos
        });
      }

      next();
    } catch (error) {
      console.error('Error en requireAllPermissions:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar roles específicos
 * @param allowedRoles - Array de códigos de roles permitidos
 */
export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { localUser } = req;

      if (!localUser) {
        return res.status(403).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Obtener el rol del usuario
      const rol = await prisma.mom_rol.findUnique({
        where: { rol_id: localUser.rol_id }
      });

      if (!rol || !allowedRoles.includes(rol.codigo)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes el rol necesario para esta acción',
          rolRequerido: allowedRoles,
          rolUsuario: rol?.codigo
        });
      }

      next();
    } catch (error) {
      console.error('Error en requireRole:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Función helper para verificar permisos programáticamente
 * @param user - Usuario autenticado
 * @param permission - Permiso a verificar
 */
export const userHasPermission = (user: LocalUser, permission: string): boolean => {
  return user?.permisos?.includes(permission) || false;
};

/**
 * Función helper para obtener permisos del usuario por categoría
 * @param user - Usuario autenticado
 * @param category - Categoría de permisos
 */
export const getUserPermissionsByCategory = async (user: LocalUser, category?: string) => {
  if (!user || !user.rol_id) return [];

  const whereClause: {
    rel_mom_rol__mom_permiso: {
      some: {
        rol_id: number;
      };
    };
    is_activo: boolean;
    categoria?: string;
  } = {
    rel_mom_rol__mom_permiso: {
      some: {
        rol_id: user.rol_id
      }
    },
    is_activo: true
  };

  if (category) {
    whereClause.categoria = category;
  }

  const permisos = await prisma.mom_permiso.findMany({
    where: whereClause,
    select: {
      codigo: true,
      nombre: true,
      categoria: true,
      descripcion: true
    }
  });

  return permisos;
};
