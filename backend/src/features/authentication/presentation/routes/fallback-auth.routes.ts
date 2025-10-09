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
