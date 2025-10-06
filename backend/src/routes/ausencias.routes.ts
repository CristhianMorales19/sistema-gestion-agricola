import { Router } from 'express';
import { checkJwt } from '../shared/infrastructure/config/auth0.config';

const router = Router();

/**
 * Rutas de ausencias (alias para permisos/asistencia)
 * Estas rutas son un puente temporal hasta que se implemente el sistema completo de ausencias
 */

/**
 * @route GET /api/ausencias
 * @desc Obtener lista de ausencias
 * @access Requiere autenticación Auth0
 */
router.get('/', 
    checkJwt,
    (req, res) => {
        res.json({
            success: true,
            message: 'Endpoint de ausencias - En desarrollo',
            data: {
                ausencias: [],
                total: 0,
                page: 1,
                limit: 10
            }
        });
    }
);

/**
 * @route GET /api/ausencias/estadisticas
 * @desc Obtener estadísticas de ausencias
 * @access Requiere autenticación Auth0
 */
router.get('/estadisticas', 
    checkJwt,
    (req, res) => {
        res.json({
            success: true,
            message: 'Estadísticas de ausencias',
            data: {
                total: 0,
                pendientes: 0,
                aprobadas: 0,
                rechazadas: 0,
                porTipo: {
                    enfermedad: 0,
                    personal: 0,
                    vacaciones: 0,
                    otro: 0
                }
            }
        });
    }
);

/**
 * @route POST /api/ausencias
 * @desc Crear nueva ausencia
 * @access Requiere autenticación Auth0
 */
router.post('/', 
    checkJwt,
    (req, res) => {
        res.status(201).json({
            success: true,
            message: 'Ausencia creada exitosamente',
            data: {
                id: 1,
                ...req.body,
                estado: 'pendiente',
                fechaCreacion: new Date()
            }
        });
    }
);

/**
 * @route PUT /api/ausencias/:id
 * @desc Actualizar ausencia
 * @access Requiere autenticación Auth0
 */
router.put('/:id', 
    checkJwt,
    (req, res) => {
        res.json({
            success: true,
            message: 'Ausencia actualizada exitosamente',
            data: {
                id: req.params.id,
                ...req.body
            }
        });
    }
);

/**
 * @route DELETE /api/ausencias/:id
 * @desc Eliminar ausencia
 * @access Requiere autenticación Auth0
 */
router.delete('/:id', 
    checkJwt,
    (req, res) => {
        res.json({
            success: true,
            message: 'Ausencia eliminada exitosamente'
        });
    }
);

/**
 * @route PUT /api/ausencias/:id/aprobar
 * @desc Aprobar ausencia
 * @access Requiere autenticación Auth0
 */
router.put('/:id/aprobar', 
    checkJwt,
    (req, res) => {
        res.json({
            success: true,
            message: 'Ausencia aprobada exitosamente',
            data: {
                id: req.params.id,
                estado: 'aprobada',
                fechaAprobacion: new Date()
            }
        });
    }
);

/**
 * @route PUT /api/ausencias/:id/rechazar
 * @desc Rechazar ausencia
 * @access Requiere autenticación Auth0
 */
router.put('/:id/rechazar', 
    checkJwt,
    (req, res) => {
        res.json({
            success: true,
            message: 'Ausencia rechazada',
            data: {
                id: req.params.id,
                estado: 'rechazada',
                fechaRechazo: new Date(),
                motivoRechazo: req.body.motivo
            }
        });
    }
);

export default router;
