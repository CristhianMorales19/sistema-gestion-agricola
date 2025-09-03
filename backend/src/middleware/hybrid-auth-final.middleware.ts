import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware híbrido: Auth0 para autenticación + BD local para autorización
 * 1. Verifica token Auth0 (ya validado por express-oauth-server)
 * 2. Busca usuario en BD local por email
 * 3. Carga roles y permisos REALES desde BD
 */
export const hybridAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Verificar que existe token Auth0 validado
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
        code: 'NO_AUTH_TOKEN'
      });
    }

    // 2. Obtener email del token Auth0
    const userEmail = (req.auth as any).email || (req.auth as any).sub;
    if (!userEmail || !userEmail.includes('@')) {
      return res.status(401).json({
        success: false,
        message: 'Email no encontrado en token Auth0',
        code: 'NO_EMAIL_IN_TOKEN',
        token_data: req.auth
      });
    }

    console.log(`🔍 Buscando usuario en BD: ${userEmail}`);

    // 3. Buscar usuario en BD local por username (asumiendo que username = email)
    const user = await prisma.mot_usuario.findFirst({
      where: {
        username: userEmail,
        estado: 'activo'
      }
    });

    // 4. Si usuario no existe en BD local → RECHAZAR
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no autorizado en el sistema',
        code: 'USER_NOT_AUTHORIZED',
        email: userEmail
      });
    }

    console.log(`✅ Usuario encontrado: ID ${user.usuario_id}`);

    // 5. Obtener rol del usuario
    const rol = await prisma.mom_rol.findUnique({
      where: {
        rol_id: user.rol_id
      }
    });

    if (!rol) {
      return res.status(403).json({
        success: false,
        message: 'Rol de usuario no encontrado',
        code: 'ROLE_NOT_FOUND'
      });
    }

    console.log(`👑 Rol asignado: ${rol.codigo} - ${rol.nombre}`);

    // 6. Obtener permisos REALES desde la base de datos
    const rolPermisosQuery = await prisma.$queryRaw`
      SELECT p.codigo as permiso_codigo
      FROM rel_mom_rol__mom_permiso rp
      INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
      WHERE rp.rol_id = ${user.rol_id}
      AND rp.deleted_at IS NULL
      AND p.is_activo = 1
    `;

    const permissions = (rolPermisosQuery as any[]).map(item => item.permiso_codigo);

    console.log(`🔐 Permisos cargados: ${permissions.length} permisos`);

    // 7. Crear objeto user con datos REALES de BD
    (req as any).user = {
      id: user.usuario_id,
      username: user.username,
      email: userEmail, // Del token Auth0
      role: rol.codigo,
      role_name: rol.nombre,
      permissions: permissions, // PERMISOS REALES DE LA BD
      trabajador_id: user.trabajador_id,
      rol_id: user.rol_id,
      // Datos adicionales de Auth0
      auth0_sub: (req.auth as any).sub,
      auth0_email: userEmail
    };

    // 8. También mantener permisos en formato que espera el middleware RBAC
    (req as any).auth = {
      ...req.auth,
      permissions: permissions // PERMISOS REALES
    };

    console.log(`🎉 Usuario autenticado: ${user.username} | Rol: ${rol.codigo} | Permisos: ${permissions.length}`);

    next();

  } catch (error) {
    console.error('❌ Error en middleware híbrido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Middleware para verificar permisos específicos
 */
export const checkPermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (!user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
        required: requiredPermission,
        user_permissions: user.permissions
      });
    }

    next();
  };
};

/**
 * Middleware para verificar múltiples permisos (AND)
 */
export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const missingPermissions = requiredPermissions.filter(
      permission => !user.permissions.includes(permission)
    );

    if (missingPermissions.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes',
        required: requiredPermissions,
        missing: missingPermissions,
        user_permissions: user.permissions
      });
    }

    next();
  };
};

/**
 * Middleware para verificar rol específico
 */
export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Rol insuficiente',
        required: requiredRole,
        user_role: user.role
      });
    }

    next();
  };
};
