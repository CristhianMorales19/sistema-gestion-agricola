import express from 'express';
import { hybridAuthMiddleware, checkPermission, checkPermissions, checkRole } from '../middleware/hybrid-auth-final.middleware';

const router = express.Router();

/**
 * ===================================================================
 * RUTAS DE EJEMPLO USANDO EL MIDDLEWARE HÍBRIDO
 * ===================================================================
 */

// Ruta pública - Sin autenticación
router.get('/public', (req, res) => {
  res.json({
    message: '📢 Esta es una ruta pública, no requiere autenticación'
  });
});

// Ruta protegida básica - Solo requiere estar autenticado
router.get('/protected', hybridAuthMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({
    success: true,
    message: '🔐 Ruta protegida - Usuario autenticado',
    user: {
      email: user.email,
      role: user.role,
      permissions_count: user.permissions.length
    }
  });
});

// Ruta que requiere permiso específico
router.get('/trabajadores', 
  hybridAuthMiddleware, 
  checkPermission('trabajadores:read:all'),
  (req, res) => {
    const user = (req as any).user;
    res.json({
      success: true,
      message: '👥 Lista de trabajadores (requiere permiso: trabajadores:read:all)',
      user_role: user.role,
      data: [
        { id: 1, nombre: 'Juan Pérez', cargo: 'Operario' },
        { id: 2, nombre: 'María García', cargo: 'Supervisora' }
      ]
    });
  }
);

// Ruta que requiere múltiples permisos
router.post('/nomina/procesar',
  hybridAuthMiddleware,
  checkPermissions(['nomina:process', 'nomina:calculate']),
  (req, res) => {
    const user = (req as any).user;
    res.json({
      success: true,
      message: '💰 Procesando nómina (requiere: nomina:process + nomina:calculate)',
      processed_by: user.email,
      status: 'Nómina procesada exitosamente'
    });
  }
);

// Ruta que requiere rol específico
router.get('/admin/sistema',
  hybridAuthMiddleware,
  checkRole('ADMIN_AGROMANO'),
  (req, res) => {
    const user = (req as any).user;
    res.json({
      success: true,
      message: '⚙️ Configuración del sistema (Solo ADMIN_AGROMANO)',
      accessed_by: user.email,
      system_config: {
        version: '1.0.0',
        database: 'agromano',
        auth_provider: 'Auth0'
      }
    });
  }
);

// Ruta para ver perfil de usuario actual
router.get('/me', hybridAuthMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      role_name: user.role_name,
      permissions: user.permissions,
      trabajador_id: user.trabajador_id,
      auth0_sub: user.auth0_sub
    }
  });
});

// Ruta para supervisores de campo
router.get('/campo/tareas',
  hybridAuthMiddleware,
  checkPermissions(['tareas:read:all', 'productividad:read:all']),
  (req, res) => {
    const user = (req as any).user;
    res.json({
      success: true,
      message: '🌱 Tareas de campo (para supervisores)',
      accessed_by: user.role,
      tareas: [
        { id: 1, descripcion: 'Siembra sector A', asignado: 'Cuadrilla 1' },
        { id: 2, descripcion: 'Cosecha sector B', asignado: 'Cuadrilla 2' }
      ]
    });
  }
);

// Ruta para gestores de RRHH
router.get('/rrhh/reportes',
  hybridAuthMiddleware,
  checkRole('GERENTE_RRHH'),
  (req, res) => {
    const user = (req as any).user;
    res.json({
      success: true,
      message: '📊 Reportes de RRHH (Solo gerentes RRHH)',
      generated_by: user.email,
      reportes: [
        { tipo: 'Asistencia mensual', trabajadores: 25 },
        { tipo: 'Nómina procesada', total: '$50,000' }
      ]
    });
  }
);

// Ruta de prueba de errores
router.get('/test-permission-error',
  hybridAuthMiddleware,
  checkPermission('permiso:inexistente'),
  (req, res) => {
    res.json({
      message: 'Esta ruta nunca debería ejecutarse'
    });
  }
);

export default router;
