/**
 * 🔐 Rutas de Autenticación con Fallback Local
 * 
 * Rutas para login dual (Auth0 + fallback local) y gestión de contraseñas locales
 * 
 * @module fallback-auth-routes
 */

import { Router } from 'express';
import FallbackAuthController from '../controllers/fallback-auth.controller';
import LocalPasswordController from '../controllers/local-password.controller';
import { checkJwt } from '../../infrastructure/middleware/agromano-auth.middleware';

const router = Router();

// ========================================
// Rutas Públicas (Sin Autenticación)
// ========================================

/**
 * Login con fallback automático
 * Intenta Auth0 primero, luego credenciales locales
 * POST /api/auth/login
 */
router.post('/login', FallbackAuthController.login);

/**
 * Verificar estado de Auth0
 * GET /api/auth/health/auth0
 */
router.get('/health/auth0', FallbackAuthController.checkAuth0Health);

// ========================================
// Rutas Protegidas (Requieren Autenticación)
// ========================================

/**
 * Obtener información del usuario autenticado
 * GET /api/auth/protected
 * Compatible con frontend existente
 */
router.get('/protected', checkJwt, async (req, res) => {
  const user = (req as any).auth || (req as any).user;
  
  try {
    // Obtener información adicional del usuario desde Auth0 /userinfo
    let userEmail = user?.email;
    let userName = user?.name;
    
    if (!userEmail && user?.sub) {
      // Obtener token del header
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        const userInfoResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          userEmail = userInfo.email;
          userName = userInfo.name || userInfo.nickname || userInfo.given_name;
        }
      }
    }
    
    res.json({
      success: true,
      message: '🔐 Acceso autorizado - Token válido',
      user: {
        sub: user?.sub || 'No disponible',
        email: userEmail || 'Email no disponible',
        name: userName || 'Usuario',
        permissions: user?.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en /protected:', error);
    res.json({
      success: true,
      message: '🔐 Acceso autorizado - Token válido',
      user: {
        sub: user?.sub || 'No disponible',
        email: 'Error obteniendo email',
        name: 'Usuario',
        permissions: user?.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Obtener perfil completo del usuario autenticado
 * GET /api/auth/profile
 * Devuelve la información del usuario en formato compatible con el frontend RBAC
 */
router.get('/profile', checkJwt, async (req, res) => {
  const user = (req as any).user;
  
  try {
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Convertir permisos de array a objeto boolean para el frontend
    const permisosArray = user.permisos || [];
    const permisosObject: Record<string, boolean> = {
      // Usuarios
      gestionar_usuarios: permisosArray.includes('gestionar_usuarios') || permisosArray.includes('usuarios:manage'),
      consultar_usuarios: permisosArray.includes('consultar_usuarios') || permisosArray.includes('usuarios:read'),
      // Personal
      gestionar_personal: permisosArray.includes('gestionar_personal') || permisosArray.includes('trabajadores:create') || permisosArray.includes('trabajadores:update:all'),
      consultar_personal: permisosArray.includes('consultar_personal') || permisosArray.includes('trabajadores:read:all') || permisosArray.includes('trabajadores:read:own'),
      // Asistencia
      gestionar_asistencia: permisosArray.includes('gestionar_asistencia') || permisosArray.includes('asistencia:manage'),
      consultar_asistencia: permisosArray.includes('consultar_asistencia') || permisosArray.includes('asistencia:read'),
      // Condiciones de trabajo
      gestionar_condiciones_trabajo: permisosArray.includes('gestionar_condiciones_trabajo') || permisosArray.includes('work_conditions:manage') || permisosArray.includes('condiciones_trabajo:write'),
      // Parcelas
      'parcelas:read': permisosArray.includes('parcelas:read') || permisosArray.includes('parcelas:read:all') || permisosArray.includes('parcelas:read:own'),
      'parcelas:update': permisosArray.includes('parcelas:update') || permisosArray.includes('parcelas:update:all'),
      'parcelas:create': permisosArray.includes('parcelas:create'),
      'parcelas:delete': permisosArray.includes('parcelas:delete'),
      // Nómina
      gestionar_nomina: permisosArray.includes('gestionar_nomina') || permisosArray.includes('nomina:manage'),
      consultar_nomina: permisosArray.includes('consultar_nomina') || permisosArray.includes('nomina:read'),
      // Productividad
      gestionar_productividad: permisosArray.includes('gestionar_productividad') || permisosArray.includes('productividad:manage'),
      consultar_productividad: permisosArray.includes('consultar_productividad') || permisosArray.includes('productividad:read'),
      // Reportes
      gestionar_reportes: permisosArray.includes('gestionar_reportes') || permisosArray.includes('reportes:manage'),
      consultar_reportes: permisosArray.includes('consultar_reportes') || permisosArray.includes('reportes:read'),
      // Configuración
      gestionar_configuracion: permisosArray.includes('gestionar_configuracion') || permisosArray.includes('configuracion:manage'),
      consultar_configuracion: permisosArray.includes('consultar_configuracion') || permisosArray.includes('configuracion:read')
    };

    // Formato compatible con AuthUser del frontend
    const authUserResponse = {
      id: user.usuario_id?.toString() || user.auth0_id,
      email: user.email || user.auth0_email,
      name: user.trabajador?.nombre_completo || user.username || 'Usuario',
      picture: null,
      roles: [{
        id: user.rol_id || 0,
        nombre: user.rol_nombre || 'Sin rol',
        descripcion: user.rol_nombre || ''
      }],
      permisos: permisosObject,
      // También incluir array de permisos para compatibilidad
      permisosArray: permisosArray
    };

    console.log(`📋 Perfil solicitado: ${authUserResponse.email} con ${permisosArray.length} permisos`);
    console.log(`🔑 Permisos del usuario:`, permisosArray);
    console.log(`🔑 Permisos de parcelas: parcelas:read=${permisosObject['parcelas:read']}`);
    
    res.json(authUserResponse);

  } catch (error) {
    console.error('❌ Error en /profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil del usuario'
    });
  }
});

/**
 * Endpoint público para testing
 * GET /api/auth/public
 */
router.get('/public', (req, res) => {
  res.json({
    success: true,
    message: '🔓 Endpoint público - Sin autenticación requerida',
    info: 'Este endpoint no requiere token de Auth0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Establecer contraseña local para el usuario autenticado
 * POST /api/auth/local-password/set
 */
router.post(
  '/local-password/set',
  checkJwt,
  LocalPasswordController.setPassword
);

/**
 * Cambiar contraseña local (requiere contraseña anterior)
 * PUT /api/auth/local-password/change
 */
router.put(
  '/local-password/change',
  checkJwt,
  LocalPasswordController.changePassword
);

/**
 * Validar fortaleza de contraseña sin guardarla
 * POST /api/auth/local-password/validate
 */
router.post(
  '/local-password/validate',
  checkJwt,
  LocalPasswordController.validatePassword
);

// ========================================
// Rutas Administrativas
// ========================================

/**
 * Resetear contraseña de un usuario (admin only)
 * POST /api/auth/local-password/reset
 */
router.post(
  '/local-password/reset',
  checkJwt,
  // Aquí deberías agregar middleware de verificación de rol admin
  LocalPasswordController.resetPassword
);

export default router;
