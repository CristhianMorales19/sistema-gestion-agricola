/*
 * Rutas de Asistencia
 * Endpoints para registro de entrada/salida y consultas
 */

import { Router, Request, Response } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { PrismaClient } from '@prisma/client';
import {
  checkJwt,
  agroManoAuthMiddleware
} from '../../../authentication/infrastructure/middleware/agromano-auth.middleware';
import {
  requirePermission,
  requireAnyPermission
} from '../../../authentication/infrastructure/middleware/agromano-rbac.middleware';

const router = Router();
const attendanceController = new AttendanceController();
const prisma = new PrismaClient();

// ============================================================================
// RUTAS PÚBLICAS (sin autenticación requerida)
// ============================================================================

/**
 * GET /api/attendance/health
 * Health check para el módulo de asistencia
 * @access Público (sin autenticación)
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Attendance module is healthy' });
});

/**
 * GET /api/attendance/trabajadores-activos
 * Obtener lista de trabajadores activos para asistencia
 * @access Público (sin autenticación)
 */
router.get(
  '/trabajadores-activos',
  async (req: Request, res: Response) => {
    try {
      const trabajadores = await prisma.mom_trabajador.findMany({
        where: {
          is_activo: true,
          deleted_at: null
        },
        select: {
          trabajador_id: true,
          documento_identidad: true,
          nombre_completo: true,
          email: true,
          telefono: true
        },
        orderBy: {
          nombre_completo: 'asc'
        }
      });

      const formattedData = trabajadores.map(t => ({
        value: t.trabajador_id,
        label: `${t.documento_identidad} - ${t.nombre_completo}`,
        trabajador_id: t.trabajador_id,
        documento_identidad: t.documento_identidad,
        nombre_completo: t.nombre_completo
      }));

      res.json({
        success: true,
        data: formattedData,
        total: formattedData.length
      });
    } catch (error: any) {
      console.error('Error al obtener trabajadores para asistencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener trabajadores',
        error: error.message
      });
    }
  }
);

/**
 * GET /api/attendance/workers
 * Obtener lista de trabajadores activos para asistencia (alias)
 * @access Público (sin autenticación)
 */
router.get(
  '/workers',
  async (req: Request, res: Response) => {
    try {
      const trabajadores = await prisma.mom_trabajador.findMany({
        where: {
          is_activo: true,
          deleted_at: null
        },
        select: {
          trabajador_id: true,
          documento_identidad: true,
          nombre_completo: true,
          email: true,
          telefono: true
        },
        orderBy: {
          nombre_completo: 'asc'
        }
      });

      res.json({
        success: true,
        data: trabajadores,
        total: trabajadores.length
      });
    } catch (error: any) {
      console.error('Error al obtener trabajadores para asistencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener trabajadores',
        error: error.message
      });
    }
  }
);

// ============================================================================
// MIDDLEWARE DE AUTENTICACIÓN PARA RUTAS PROTEGIDAS
// ============================================================================
router.use(checkJwt);
router.use(agroManoAuthMiddleware);

/**
 * POST /api/attendance/entry
 * Registrar entrada de trabajador
 * @access Requiere permiso: asistencia:register
 */
router.post(
  '/entry',
  requirePermission('asistencia:register'),
  (req: Request, res: Response) => attendanceController.registerEntry(req, res)
);

/**
 * POST /api/attendance/:id/exit
 * Registrar salida de trabajador
 * @access Requiere permiso: asistencia:register
 */
router.post(
  '/:id/exit',
  requirePermission('asistencia:register'),
  (req: Request, res: Response) => attendanceController.registerExit(req, res)
);

/**
 * GET /api/attendance/:id
 * Obtener asistencia por ID
 * @access Requiere permiso: asistencia:read:all o asistencia:read:own
 */
router.get(
  '/:id',
  requireAnyPermission(['asistencia:read:all', 'asistencia:read:own']),
  (req: Request, res: Response) => attendanceController.getAttendanceById(req, res)
);

/**
 * GET /api/attendance/worker/:workerId
 * Obtener asistencias de un trabajador
 * @access Requiere permiso: asistencia:read:all o asistencia:read:own
 */
router.get(
  '/worker/:workerId',
  requireAnyPermission(['asistencia:read:all', 'asistencia:read:own']),
  (req: Request, res: Response) => attendanceController.getWorkerAttendances(req, res)
);

/**
 * GET /api/attendance/worker/:workerId/active
 * Obtener entrada activa de un trabajador
 * @access Requiere permiso: asistencia:read:all o asistencia:read:own
 */
router.get(
  '/worker/:workerId/active',
  requireAnyPermission(['asistencia:read:all', 'asistencia:read:own']),
  (req: Request, res: Response) => attendanceController.getWorkerActiveEntry(req, res)
);

/**
 * GET /api/attendance/active/list
 * Obtener trabajadores con entrada activa
 * @access Requiere permiso: asistencia:read:all
 */
router.get(
  '/active/list',
  requirePermission('asistencia:read:all'),
  (req: Request, res: Response) => attendanceController.getActiveWorkers(req, res)
);

/**
 * GET /api/attendance/worker/:workerId/statistics
 * Obtener estadísticas de un trabajador
 * @access Requiere permiso: asistencia:read:all o asistencia:reports
 */
router.get(
  '/worker/:workerId/statistics',
  requireAnyPermission(['asistencia:read:all', 'asistencia:reports']),
  (req: Request, res: Response) => attendanceController.getWorkerStatistics(req, res)
);

/**
 * GET /api/attendance
 * Obtener asistencias paginadas
 * @access Requiere permiso: asistencia:read:all
 */
router.get(
  '/',
  requireAnyPermission(['asistencia:read:all', 'asistencia:register']),
  (req: Request, res: Response) => attendanceController.getAttendancesPaginated(req, res)
);

/**
 * PUT /api/attendance/:id
 * Actualizar asistencia
 * @access Requiere permiso: asistencia:update
 */
router.put(
  '/:id',
  requirePermission('asistencia:update'),
  (req: Request, res: Response) => attendanceController.updateAttendance(req, res)
);

/**
 * DELETE /api/attendance/:id
 * Eliminar asistencia (soft delete)
 * @access Requiere permiso: asistencia:register (eliminar registros propios)
 */
router.delete(
  '/:id',
  requirePermission('asistencia:register'),
  (req: Request, res: Response) => attendanceController.deleteAttendance(req, res)
);

/**
 * POST /api/attendance/mark-absent
 * Marcar trabajador como ausente para una fecha
 * @access Requiere permiso: asistencia:register
 */
router.post(
  '/mark-absent',
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission('asistencia:register'),
  (req: Request, res: Response) => attendanceController.markAsAbsent(req, res)
);

export default router;
