import { Router } from 'express';
import { checkJwt } from '../config/auth0-simple.config';
import { hybridAuthMiddleware } from '../middleware/hybrid-auth-final.middleware';
import { 
    requirePermission, 
    requireAnyPermission, 
    requirePermissions,
    AgroManoPermission 
} from '../middleware/agromano-rbac.middleware';

const router = Router();

/**
 * @route GET /api/trabajadores
 * @desc Obtener lista de trabajadores
 * @access Requiere permisos: trabajadores:read:all OR trabajadores:read:own
 */
router.get('/', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']),
    (req, res) => {
        const userPermissions = req.auth?.permissions || [];
        const canReadAll = userPermissions.includes('trabajadores:read:all');
        
        res.json({
            success: true,
            message: canReadAll ? 'Lista de todos los trabajadores' : 'Lista de trabajadores propios',
            data: {
                trabajadores: canReadAll ? 
                    ['Trabajador 1', 'Trabajador 2', 'Trabajador 3'] : 
                    ['Tu perfil de trabajador'],
                permissions: userPermissions,
                scope: canReadAll ? 'all' : 'own'
            }
        });
    }
);

/**
 * @route POST /api/trabajadores
 * @desc Crear nuevo trabajador
 * @access Requiere permiso: trabajadores:create
 */
router.post('/', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requirePermission('trabajadores:create'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Trabajador creado exitosamente',
            data: {
                action: 'create',
                trabajador: req.body,
                permissions: (req.user as any)?.permissions
            }
        });
    }
);

/**
 * @route PUT /api/trabajadores/:id
 * @desc Actualizar trabajador
 * @access Requiere permisos: trabajadores:update:all OR trabajadores:update:own
 */
router.put('/:id', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requireAnyPermission(['trabajadores:update:all', 'trabajadores:update:own']),
    (req, res) => {
        const { id } = req.params;
        const userPermissions = (req.user as any)?.permissions || [];
        const canUpdateAll = userPermissions.includes('trabajadores:update:all');
        
        res.json({
            success: true,
            message: `Trabajador ${id} actualizado exitosamente`,
            data: {
                action: 'update',
                trabajadorId: id,
                scope: canUpdateAll ? 'all' : 'own',
                data: req.body,
                permissions: userPermissions
            }
        });
    }
);

/**
 * @route DELETE /api/trabajadores/:id
 * @desc Eliminar trabajador
 * @access Requiere permiso: trabajadores:delete
 */
router.delete('/:id', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requirePermission('trabajadores:delete'),
    (req, res) => {
        const { id } = req.params;
        
        res.json({
            success: true,
            message: `Trabajador ${id} eliminado exitosamente`,
            data: {
                action: 'delete',
                trabajadorId: id,
                permissions: (req.user as any)?.permissions
            }
        });
    }
);

/**
 * @route GET /api/trabajadores/export
 * @desc Exportar datos de trabajadores
 * @access Requiere permiso: trabajadores:export
 */
router.get('/export', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requirePermission('trabajadores:export'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Exportación de trabajadores generada',
            data: {
                action: 'export',
                format: req.query.format || 'excel',
                filename: `trabajadores_${new Date().toISOString().split('T')[0]}.xlsx`,
                permissions: (req.user as any)?.permissions
            }
        });
    }
);

/**
 * @route POST /api/trabajadores/import
 * @desc Importar datos de trabajadores
 * @access Requiere permisos: trabajadores:import AND trabajadores:create
 */
router.post('/import', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requirePermissions(['trabajadores:import', 'trabajadores:create']),
    (req, res) => {
        res.json({
            success: true,
            message: 'Importación de trabajadores procesada',
            data: {
                action: 'import',
                recordsProcessed: 25,
                recordsCreated: 20,
                recordsSkipped: 5,
                permissions: (req.user as any)?.permissions
            }
        });
    }
);

export default router;
