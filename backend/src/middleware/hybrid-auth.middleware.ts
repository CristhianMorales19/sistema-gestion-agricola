import { Request, Response, NextFunction } from "express";
import { UserSyncService } from "../services/user-sync.service";

/**
 * Middleware híbrido que combina autenticación Auth0 con datos locales
 * Se ejecuta después de checkJwt de Auth0
 */
export const hybridAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Verificar que Auth0 haya validado el token
    const auth0User = (req as any).auth;

    if (!auth0User || !auth0User.sub) {
      return res.status(401).json({
        success: false,
        message: "Token Auth0 inválido",
      });
    }

    const auth0UserId = auth0User.sub;

    try {
      // Obtener o crear usuario local
      const localUser = await UserSyncService.getOrCreateLocalUser(
        auth0UserId,
        auth0User,
      );

      if (!localUser) {
        return res.status(500).json({
          success: false,
          message: "Error sincronizando usuario local",
        });
      }

      // Verificar que el usuario local esté activo
      if (localUser.estado !== "activo") {
        return res.status(403).json({
          success: false,
          message: "Usuario inactivo en el sistema",
        });
      }

      // Extraer permisos del usuario local
      const permisos =
        localUser.mom_rol?.rel_mom_rol__mom_permiso?.map(
          (rp) => rp.mom_permiso.codigo,
        ) || [];

      // Agregar datos del usuario local a la request
      (req as any).localUser = {
        usuario_id: localUser.usuario_id,
        username: localUser.username,
        rol_id: localUser.rol_id,
        trabajador_id: localUser.trabajador_id || undefined,
        permisos,
        auth0_user_id: localUser.auth0_user_id,
        rol_nombre: localUser.mom_rol?.nombre,
      };

      // Mantener también los datos de Auth0
      (req as any).auth0User = auth0User;

      next();
    } catch (syncError) {
      console.error("Error en sincronización de usuario:", syncError);

      // En caso de error de sincronización, permitir continuar solo con Auth0
      // pero con permisos limitados
      (req as any).localUser = {
        usuario_id: 0,
        username: auth0User.email || auth0User.nickname || "unknown",
        rol_id: 0,
        permisos: ["basic:access"], // Permisos básicos
        auth0_user_id: auth0UserId,
        sync_error: true,
      };

      (req as any).auth0User = auth0User;

      console.warn(
        `Usuario ${auth0UserId} continuando solo con Auth0 debido a error de sincronización`,
      );
      next();
    }
  } catch (error) {
    console.error("Error en middleware híbrido:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/**
 * Middleware para verificar permisos híbridos (Auth0 + Local)
 */
export const requireHybridPermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const localUser = (req as any).localUser;
    const auth0User = (req as any).auth0User;

    if (!localUser && !auth0User) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    // Verificar permisos locales primero
    if (localUser?.permisos) {
      const hasLocalPermission = permissions.some((permission) =>
        localUser.permisos.includes(permission),
      );

      if (hasLocalPermission) {
        return next();
      }
    }

    // Si no tiene permisos locales, verificar en Auth0 (implementar si es necesario)
    // Por ahora, denegar acceso si no tiene permisos locales
    return res.status(403).json({
      success: false,
      message: "Permisos insuficientes",
      required_permissions: permissions,
      user_permissions: localUser?.permisos || [],
    });
  };
};

/**
 * Middleware para verificar roles específicos
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const localUser = (req as any).localUser;

    if (!localUser) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    if (!localUser.rol_nombre) {
      return res.status(403).json({
        success: false,
        message: "Usuario sin rol asignado",
      });
    }

    const hasRole = roles.some((role) =>
      localUser.rol_nombre.toLowerCase().includes(role.toLowerCase()),
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Rol insuficiente",
        required_roles: roles,
        user_role: localUser.rol_nombre,
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const localUser = (req as any).localUser;

  if (!localUser) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }

  const adminPermissions = ["admin:full", "users:manage", "roles:assign"];
  const hasAdminPermission = localUser.permisos?.some((permiso: string) =>
    adminPermissions.includes(permiso),
  );

  const isAdminRole = localUser.rol_nombre?.toLowerCase().includes("admin");

  if (!hasAdminPermission && !isAdminRole) {
    return res.status(403).json({
      success: false,
      message: "Se requieren permisos de administrador",
    });
  }

  next();
};
