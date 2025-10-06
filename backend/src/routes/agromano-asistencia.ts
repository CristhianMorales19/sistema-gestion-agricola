import { Router } from 'express';
import { checkJwt } from '../config/auth0-simple.config';
import { 
    requirePermission, 
    requireAnyPermission 
} from '../middleware/agromano-rbac.middleware';

const router = Router();

/**
 * @route POST /api/asistencia/marcar
 * @desc Registrar entrada/salida de asistencia
 * @access Requiere permiso: asistencia:register
 */
/**
 * @swagger
 * /api/asistencia/marcar:
 *   post:
 *     summary: Registrar entrada/salida de asistencia
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Asistencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asistencia registrada exitosamente
 */
router.post('/marcar', 
    checkJwt,
    requirePermission('asistencia:register'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Asistencia registrada exitosamente',
            data: {
                action: 'register',
                timestamp: new Date().toISOString(),
                type: req.body.type || 'entrada',
                location: req.body.location,
                    userId: (req as any).user?.sub
            }
        });
    }
);

/**
 * @route GET /api/asistencia
 * @desc Obtener registros de asistencia
 * @access Requiere permisos: asistencia:read:all OR asistencia:read:own
 */
/**
 * @swagger
 * /api/asistencia:
 *   get:
 *     summary: Obtener registros de asistencia
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Asistencia
 *     responses:
 *       200:
 *         description: Registros de asistencia
 */
router.get('/', 
    checkJwt,
    requireAnyPermission(['asistencia:read:all', 'asistencia:read:own']),
    (req, res) => {
    const userPermissions = (req as any).user?.permissions || [];
        const canReadAll = userPermissions.includes('asistencia:read:all');
        
        res.json({
            success: true,
            message: 'Registros de asistencia obtenidos',
            data: {
                asistencias: canReadAll ? 
                    ['Registro 1 - Juan', 'Registro 2 - María', 'Registro 3 - Carlos'] : 
                    ['Tu registro de asistencia'],
                scope: canReadAll ? 'all' : 'own',
                permissions: userPermissions
            }
        });
    }
);

/**
 * @route PUT /api/asistencia/:id/aprobar
 * @desc Aprobar registro de asistencia
 * @access Requiere permiso: asistencia:approve
 */
router.put('/:id/aprobar', 
    checkJwt,
    requirePermission('asistencia:approve'),
    (req, res) => {
        const { id } = req.params;
        
        res.json({
            success: true,
            message: `Asistencia ${id} aprobada exitosamente`,
            data: {
                action: 'approve',
                asistenciaId: id,
                    approvedBy: (req as any).user?.sub,
                approvedAt: new Date().toISOString()
            }
        });
    }
);

/**
 * @route GET /api/asistencia/reportes
 * @desc Generar reportes de asistencia
 * @access Requiere permiso: asistencia:reports
 */
router.get('/reportes', 
    checkJwt,
    requirePermission('asistencia:reports'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Reporte de asistencia generado',
            data: {
                action: 'report',
                period: req.query.period || 'mensual',
                totalEmpleados: 150,
                asistenciaPromedio: '95%',
                tardanzas: 8,
                ausencias: 12
            }
        });
    }
);

/**
 * @route GET /api/asistencia/dashboard
 * @desc Obtener dashboard de asistencia
 * @access Requiere permiso: asistencia:dashboard
 */
/**
 * @swagger
 * /api/asistencia/dashboard:
 *   get:
 *     summary: Obtener dashboard de asistencia
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Asistencia
 *     responses:
 *       200:
 *         description: Dashboard de asistencia
 */
router.get('/dashboard', 
    checkJwt,
    requirePermission('asistencia:dashboard'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Dashboard de asistencia',
            data: {
                action: 'dashboard',
                presentesHoy: 142,
                ausentesHoy: 8,
                tardanzasHoy: 3,
                promedioSemanal: '96.2%',
                tendencia: 'positiva'
            }
        });
    }
);

/**
 * @route POST /api/asistencia/permisos
 * @desc Crear solicitud de permiso
 * @access Requiere permiso: permisos:create
 */
router.post('/permisos', 
    checkJwt,
    requirePermission('permisos:create'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Solicitud de permiso creada exitosamente',
            data: {
                action: 'create_permission_request',
                    solicitante: (req as any).user?.sub,
                tipo: req.body.tipo,
                fechaInicio: req.body.fechaInicio,
                fechaFin: req.body.fechaFin,
                motivo: req.body.motivo,
                estado: 'pendiente'
            }
        });
    }
);

/**
 * @route PUT /api/asistencia/permisos/:id/aprobar
 * @desc Aprobar solicitud de permiso
 * @access Requiere permiso: permisos:approve
 */
router.put('/permisos/:id/aprobar', 
    checkJwt,
    requirePermission('permisos:approve'),
    (req, res) => {
        const { id } = req.params;
        
        res.json({
            success: true,
            message: `Permiso ${id} aprobado exitosamente`,
            data: {
                action: 'approve_permission',
                permisoId: id,
                    aprobadoPor: (req as any).user?.sub,
                fechaAprobacion: new Date().toISOString(),
                comentarios: req.body.comentarios
            }
        });
    }
);

export default router;
