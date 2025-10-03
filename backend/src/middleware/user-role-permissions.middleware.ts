import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth0ManagementService } from '../services/auth0-management.service';

const prisma = new PrismaClient();

/**
 * Middleware para verificar permisos de administración de usuarios
 */
export const requireUserManagementPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar si hay un usuario autenticado localmente
    const localUser = (req as any).localUser;
    
    if (!localUser) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Verificar permisos locales para gestión de usuarios
    const userManagementPermissions = [
      'users:manage',
      'roles:assign',
      'admin:full',
      'usuarios:update'
    ];

    const hasLocalPermission = localUser.permisos?.some((permiso: string) => 
      userManagementPermissions.includes(permiso)
    );

    if (hasLocalPermission) {
      return next();
    }

    // Si no tiene permisos locales, verificar en Auth0
    const auth0User = (req as any).auth?.sub;
    
    if (auth0User) {
      try {
        const auth0Roles = await auth0ManagementService.getUserRoles(auth0User);
        
        // Verificar si tiene roles administrativos en Auth0
        const adminRoles = ['Admin', 'SuperAdmin', 'UserManager', 'RoleManager'];
        const hasAuth0AdminRole = auth0Roles.some(role => 
          adminRoles.some(adminRole => 
            role.name?.toLowerCase().includes(adminRole.toLowerCase())
          )
        );

        if (hasAuth0AdminRole) {
          return next();
        }
      } catch (auth0Error) {
        console.error('Error verificando roles Auth0:', auth0Error);
      }
    }

    // Si no tiene permisos, denegar acceso
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para gestionar usuarios y roles',
      required_permissions: userManagementPermissions
    });

  } catch (error) {
    console.error('Error en middleware de permisos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para verificar permisos específicos de roles
 */
export const requireRolePermission = (action: 'create' | 'read' | 'update' | 'delete') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const localUser = (req as any).localUser;
      
      if (!localUser) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Definir permisos por acción
      const permissionsByAction = {
        create: ['roles:create', 'admin:full'],
        read: ['roles:read', 'roles:assign', 'admin:full', 'usuarios:read'],
        update: ['roles:assign', 'roles:update', 'admin:full'],
        delete: ['roles:delete', 'admin:full']
      };

      const requiredPermissions = permissionsByAction[action];
      
      const hasPermission = localUser.permisos?.some((permiso: string) => 
        requiredPermissions.includes(permiso)
      );

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `No tienes permisos para ${action} roles`,
        required_permissions: requiredPermissions
      });

    } catch (error) {
      console.error('Error en middleware de permisos de rol:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario puede modificar roles de otros usuarios
 */
export const requireUserRoleManagementPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const localUser = (req as any).localUser;
    const { userId } = req.params;
    
    if (!localUser) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Verificar si es el mismo usuario (auto-gestión)
    const targetUser = await prisma.mot_usuario.findUnique({
      where: { auth0_user_id: userId }
    });

    // Los usuarios no pueden modificar sus propios roles (solo admins)
    if (targetUser && targetUser.usuario_id === localUser.usuario_id) {
      return res.status(403).json({
        success: false,
        message: 'No puedes modificar tus propios roles'
      });
    }

    // Verificar permisos de administración
    const adminPermissions = [
      'roles:assign',
      'users:manage',
      'admin:full'
    ];

    const hasAdminPermission = localUser.permisos?.some((permiso: string) => 
      adminPermissions.includes(permiso)
    );

    if (!hasAdminPermission) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar roles de otros usuarios',
        required_permissions: adminPermissions
      });
    }

    next();

  } catch (error) {
    console.error('Error en middleware de gestión de roles de usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para auditar acciones de gestión de roles
 */
export const auditRoleManagement = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const localUser = (req as Request & { localUser?: { usuario_id: number } }).localUser;
      const originalJson = res.json;

      // Interceptar la respuesta para auditoría
      res.json = function(body: { success?: boolean; [key: string]: unknown }) {
        // Solo auditar si la operación fue exitosa
        if (body.success) {
          prisma.mol_audit_log.create({
            data: {
              entidad: 'user_role_management',
              entidad_id: localUser?.usuario_id || 0,
              accion: action,
              datos_antes: JSON.stringify(req.body),
              datos_despues: JSON.stringify(body),
              usuario_id: localUser?.usuario_id,
              fecha_at: new Date(),
              ip_origen: req.ip || 'unknown'
            }
          }).catch(error => {
            console.error('Error en auditoría:', error);
          });
        }

        return originalJson.call(this, body);
      };

      next();

    } catch (error) {
      console.error('Error en middleware de auditoría:', error);
      next();
    }
  };
};