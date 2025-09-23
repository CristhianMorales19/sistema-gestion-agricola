import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { ROLE_PERMISSIONS, AGROMANO_ROLES } from './agromano-rbac.middleware';

// Crear cliente Prisma con logs detallados
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty'
});

/**
 * Middleware híbrido: Auth0 para autenticación + BD local para autorización
 * 1. Verifica token Auth0 (ya validado por express-oauth-server)
 * 2. Busca usuario en BD local por email
 * 3. Carga roles y permisos REALES desde BD
 */
export const hybridAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔄 ===== HYBRID AUTH MIDDLEWAREEEEEEE =====');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // 1. Verificar que existe token Auth0 validado
    console.log('🔍 Verificando req.auth:', !!req.auth);
    console.log('🔍 Verificando req.user:', !!req.user);
    
    if (!req.auth && !req.user) {
      console.log('❌ No hay token Auth0 validado');
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
        code: 'NO_AUTH_TOKEN'
      });
    }

    // 2. Obtener email del token Auth0 (probamos ambas fuentes)
    const authData = req.auth || req.user;
    const userSub = (authData as any)?.sub;

    let userEmail = (authData as any)?.email;
    
    console.log('📧 Email extraído:', userEmail);
    console.log('🆔 Sub extraído:', userSub);
    console.log('🔍 Auth data completo:', JSON.stringify(authData, null, 2));
    
    console.log('📧 Email REAL extraído:', userEmail);
    console.log('🆔 Sub extraído:', userSub);
    
    // if (!userEmail) {
    //   console.log('❌ No se pudo extraer email del token Auth0');
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Email no encontrado en token Auth0',
    //     code: 'NO_EMAIL_IN_TOKEN',
    //     token_data: authData
    //   });
    // }

    console.log(`🔍 Buscando usuario en BD por email: ${userEmail}`);
    console.log(`🔍 También buscando por sub: ${userSub}`);
    console.log('🔍 Criterios de búsqueda: userSub O userEmail + estado ACTIVO/activo');

    // 3. Buscar usuario en BD local por auth0_user_id (sub) o por email
    // Intentamos usar auth0_user_id primero (rama 'Sebastian'). Si la columna no existe
    // (Prisma P2022) usamos un fallback que busca por username usando SQL crudo.
    let user: any = null;
    try {
      user = await prisma.mot_usuario.findFirst({
        where: {
          OR: [
            {
              auth0_user_id: userSub,
              OR: [
                { estado: 'ACTIVO' },
                { estado: 'activo' }
              ]
            },
            {
              username: userEmail,
              OR: [
                { estado: 'ACTIVO' },
                { estado: 'activo' }
              ]
            }
          ]
        }
      });
    } catch (err: any) {
      // Manejar error conocido de Prisma cuando la columna no existe (P2022)
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2022') {
        console.warn('⚠️ Prisma P2022 detectado (columna ausente). Usando fallback SQL para búsqueda de usuario.');
        try {
          const rows: any = await prisma.$queryRawUnsafe(
            `SELECT usuario_id, trabajador_id, username, password_hash, rol_id, estado, fecha_ultimo_cambio_rol_at, created_at, updated_at, created_by, updated_by, deleted_at
             FROM mot_usuario
             WHERE (username = ? OR username = ?) AND (estado = 'ACTIVO' OR estado = 'activo')
             LIMIT 1`,
            userSub,
            userEmail
          );
          if (Array.isArray(rows) && rows.length > 0) {
            user = rows[0];
          } else {
            user = null;
          }
        } catch (sqlErr) {
          console.error('❌ Fallback SQL failed:', sqlErr);
          throw sqlErr; // Este será capturado por el catch exterior y devolverá 500
        }
      } else {
        throw err; // rethrow para que el catch exterior lo maneje
      }
    }

    // 4. Si usuario no existe en BD local → intentar fallback usando permisos del token
    if (!user) {
      console.warn('⚠️ Usuario NO encontrado en BD con los criterios de búsqueda (userSub/email)');
      console.log('🔍 Intentando fallback: usar permisos presentes en el token Auth0 si existen');

      // Si el token trae permisos (claims) podemos confiar en ellos en entornos híbridos
      const tokenPermissions = (req.auth as any)?.permissions || (req.user as any)?.permissions || [];
      if (Array.isArray(tokenPermissions) && tokenPermissions.length > 0) {
        console.log('🔁 Fallback aplicado: permisos obtenidos del token:', tokenPermissions);
        // Rellenar req.auth.permissions para que los middlewares RBAC funcionen
        (req as any).auth = {
          ...(req as any).auth,
          permissions: tokenPermissions
        };

        // Crear un objeto user mínimo para que el resto del flujo pueda usarlo
        (req as any).user = {
          id: null,
          username: userEmail || userSub,
          email: userEmail,
          role: null,
          role_name: null,
          permissions: tokenPermissions,
          trabajador_id: null,
          rol_id: null,
          auth0_sub: userSub,
          auth0_email: userEmail
        };

        // Continuar: el middleware RBAC comprobará ahora req.auth.permissions
      } else {
        // Debug: buscar cualquier usuario que contenga auth0 para ayudar a diagnosticar
        const debugUser = await prisma.mot_usuario.findFirst({
          where: {
            username: {
              contains: 'auth0'
            }
          }
        });

        console.log('🔍 Debug - Usuario con auth0:', debugUser ? {
          id: debugUser.usuario_id,
          username: debugUser.username,
          estado: debugUser.estado
        } : 'No encontrado');

        return res.status(403).json({
          success: false,
          message: 'Usuario no autorizado en el sistema',
          code: 'USER_NOT_AUTHORIZED',
          searchCriteria: {
            userEmail,
            userSub
          },
          debugUser: debugUser ? {
            id: debugUser.usuario_id,
            username: debugUser.username,
            estado: debugUser.estado
          } : null
        });
      }
    }

    console.log(`✅ Usuario encontrado: ID ${user.usuario_id}, username: ${user.username}, estado: ${user.estado}`);

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

  // También unir permisos que el token pueda traer para evitar inconsistencias
  const tokenPermissions = (req as any).auth?.permissions || (req as any).user?.permissions || [];
  console.log('🔁 Permisos desde DB:', permissions);
  console.log('🔁 Permisos desde token:', tokenPermissions);
  let mergedPermissions = Array.from(new Set([...(permissions || []), ...(tokenPermissions || [])]));

  console.log('🔀 Permisos iniciales (DB U Token):', mergedPermissions);

  console.log(`🔐 Permisos cargados (DB): ${permissions.length} permisos`);

  // Si después de unir no hay permisos, intentar consulta menos restrictiva (sin is_activo)
  if (mergedPermissions.length === 0) {
    try {
      const fallbackRows: any = await prisma.$queryRawUnsafe(
        `SELECT p.permiso_id, p.codigo as permiso_codigo, p.is_activo, rp.deleted_at
         FROM rel_mom_rol__mom_permiso rp
         INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
         WHERE rp.rol_id = ?
        `,
        user.rol_id
      );
      console.log('🔎 Fallback - rows sin filtro is_activo:', JSON.stringify(fallbackRows, null, 2));
      if (Array.isArray(fallbackRows) && fallbackRows.length > 0) {
        const fallbackPerms = fallbackRows.map((r: any) => r.permiso_codigo).filter(Boolean);
        mergedPermissions = Array.from(new Set([...fallbackPerms, ...mergedPermissions]));
        console.log('🔁 Permisos tras fallback menos restrictivo:', mergedPermissions);
      }
    } catch (fbErr) {
      console.warn('⚠️ Fallback menos restrictivo falló:', fbErr);
    }
  }

  // Fallback temporal: si rol es ADMIN y aún no hay permisos, usar ROLE_PERMISSIONS para admin
  if (mergedPermissions.length === 0 && rol && (rol.codigo === 'ADMIN' || rol.codigo === AGROMANO_ROLES.ADMIN_AGROMANO)) {
    console.warn('⚠️ Permisos resultaron vacíos para rol ADMIN; aplicando fallback ROLE_PERMISSIONS[ADMIN_AGROMANO]');
    mergedPermissions = ROLE_PERMISSIONS[AGROMANO_ROLES.ADMIN_AGROMANO] || [];
    console.log('🔁 Permisos aplicados desde ROLE_PERMISSIONS:', mergedPermissions.length);
  }

  // 7. Crear objeto user con datos REALES de BD
  (req as any).user = {
    id: user.usuario_id,
    username: user.username,
    email: userEmail, // Del token Auth0
    role: rol.codigo,
    role_name: rol.nombre,
    permissions: mergedPermissions, // PERMISOS FINALES (DB U TOKEN u otros fallbacks)
    trabajador_id: user.trabajador_id,
    rol_id: user.rol_id,
    // Datos adicionales de Auth0
    auth0_sub: (req.auth as any).sub,
    auth0_email: userEmail
  };

  // 8. También mantener permisos en formato que espera el middleware RBAC (merged)
  (req as any).auth = {
    ...req.auth,
    permissions: mergedPermissions // PERMISOS FINALES
  };

  console.log(`🎉 Usuario autenticado: ${user.username} | Rol: ${rol.codigo} | Permisos: ${mergedPermissions.length}`);

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
