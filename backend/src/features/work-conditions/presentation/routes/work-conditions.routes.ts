/*
 * Rutas: Condiciones de Trabajo
 * Define los endpoints de la API para condiciones de trabajo
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { WorkConditionService } from '../../application/WorkConditionService';
import { PrismaWorkConditionRepository } from '../../infrastructure/PrismaWorkConditionRepository';
import { WorkConditionController } from '../controllers/WorkConditionController';
import {
  checkJwt,
  agroManoAuthMiddleware
} from '../../../authentication/infrastructure/middleware/agromano-auth.middleware';
import {
  requirePermission,
  requireAnyPermission
} from '../../../authentication/infrastructure/middleware/agromano-rbac.middleware';

const router = Router();
const prisma = new PrismaClient();

// Inicializar repositorio, servicio y controlador
const workConditionRepository = new PrismaWorkConditionRepository(prisma);
const workConditionService = new WorkConditionService(workConditionRepository);
const workConditionController = new WorkConditionController(workConditionService);

/*
 * Health check (sin autenticación)
 */
router.get('/health', (req: Request, res: Response) => {
  workConditionController.healthCheck(req, res, (error) => {
    if (error) throw error;
  });
});

/*
 * Rutas públicas (solo lectura, sin autenticación requerida)
 */
router.get(
  '/date/:fecha',
  (req: Request, res: Response, next) => {
    workConditionController.getWorkConditionByDate(req, res, next);
  }
);

router.get(
  '/month/:year/:month',
  (req: Request, res: Response, next) => {
    workConditionController.getWorkConditionsByMonth(req, res, next);
  }
);

router.get(
  '/:workConditionId',
  (req: Request, res: Response, next) => {
    workConditionController.getWorkConditionById(req, res, next);
  }
);

router.get(
  '/',
  (req: Request, res: Response, next) => {
    workConditionController.getAllWorkConditions(req, res, next);
  }
);

/*
 * MIDDLEWARE DE AUTENTICACIÓN PARA RUTAS PROTEGIDAS
 */
router.use(checkJwt);
router.use(agroManoAuthMiddleware);

/*
 * Rutas protegidas (requieren autenticación y permiso)
 */
router.post(
  '/',
  requirePermission('clima:create'),
  (req: Request, res: Response, next) => {
    workConditionController.createWorkCondition(req, res, next);
  }
);

router.put(
  '/:workConditionId',
  requirePermission('clima:update'),
  (req: Request, res: Response, next) => {
    workConditionController.updateWorkCondition(req, res, next);
  }
);

router.delete(
  '/:workConditionId',
  requirePermission('clima:delete'),
  (req: Request, res: Response, next) => {
    workConditionController.deleteWorkCondition(req, res, next);
  }
);

export default router;