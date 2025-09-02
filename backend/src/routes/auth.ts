import { Router } from 'express';
import { verifyToken, requirePermission } from '../middleware/auth0';

const router = Router();

/**
 * @route GET /api/auth/public
 * @desc Endpoint público para probar
 * @access Público
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
 * @route GET /api/auth/protected  
 * @desc Endpoint que requiere autenticación
 * @access Requiere token válido de Auth0
 */
router.get('/protected', verifyToken, (req, res) => {
  const user = (req as any).user;
  
  res.json({
    success: true,
    message: '🔐 Acceso autorizado - Token válido',
    user: {
      sub: user.sub,
      email: user.email,
      permissions: user.permissions || []
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /api/auth/admin
 * @desc Endpoint que requiere permisos de administrador
 * @access Requiere token + permiso 'admin:access'
 */
router.get('/admin', 
  verifyToken,
  requirePermission('admin:access'),
  (req, res) => {
    const user = (req as any).user;
    
    res.json({
      success: true,
      message: '👑 Acceso de administrador autorizado',
      user: {
        sub: user.sub,
        email: user.email,
        permissions: user.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * @route GET /api/auth/trabajadores
 * @desc Endpoint que requiere permisos específicos de trabajadores
 * @access Requiere token + permiso 'trabajadores:read'
 */
router.get('/trabajadores',
  verifyToken,
  requirePermission('trabajadores:read'),
  (req, res) => {
    const user = (req as any).user;
    
    res.json({
      success: true,
      message: '👥 Acceso a trabajadores autorizado',
      data: {
        message: 'Aquí irían los datos de trabajadores',
        note: 'Este endpoint está protegido con RBAC'
      },
      user: {
        sub: user.sub,
        email: user.email,
        permissions: user.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * @route GET /api/auth/test-permissions
 * @desc Endpoint para probar diferentes permisos
 * @access Requiere token válido
 */
router.get('/test-permissions', verifyToken, (req, res) => {
  const user = (req as any).user;
  const userPermissions = user.permissions || [];
  
  res.json({
    success: true,
    message: '🔍 Análisis de permisos del usuario',
    user: {
      sub: user.sub,
      email: user.email,
      permissions: userPermissions
    },
    permissionChecks: {
      'admin:access': userPermissions.includes('admin:access'),
      'trabajadores:read': userPermissions.includes('trabajadores:read'),
      'trabajadores:create': userPermissions.includes('trabajadores:create'),
      'asistencia:register': userPermissions.includes('asistencia:register'),
      'nomina:process': userPermissions.includes('nomina:process')
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
