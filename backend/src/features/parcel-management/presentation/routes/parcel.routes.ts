/*
 * Rutas: Parcelas
 * Define los endpoints de la API para gestión de parcelas
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ParcelService } from '../../application/ParcelService';
import { PrismaParcelRepository } from '../../infrastructure/PrismaParcelRepository';
import { ParcelController } from '../controllers/ParcelController';
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
const parcelRepository = new PrismaParcelRepository(prisma);
const parcelService = new ParcelService(parcelRepository);
const parcelController = new ParcelController(parcelService);

/*
 * Health check (sin autenticación)
 */
router.get('/health', (req: Request, res: Response) => {
  parcelController.healthCheck(req, res, (error) => {
    if (error) throw error;
  });
});

/*
 * MIDDLEWARE DE AUTENTICACIÓN PARA TODAS LAS RUTAS
 */
router.use(checkJwt);
router.use(agroManoAuthMiddleware);

/*
 * Rutas de lectura (requieren permiso de lectura)
 */
router.get(
  '/search/:query',
  requireAnyPermission(['parcelas:read:all', 'parcelas:read:own', 'parcelas:read']),
  (req: Request, res: Response, next) => {
    parcelController.searchParcels(req, res, next);
  }
);

router.get(
  '/:parcelId',
  requireAnyPermission(['parcelas:read:all', 'parcelas:read:own', 'parcelas:read']),
  (req: Request, res: Response, next) => {
    parcelController.getParcelById(req, res, next);
  }
);

router.get(
  '/',
  requireAnyPermission(['parcelas:read:all', 'parcelas:read:own', 'parcelas:read']),
  (req: Request, res: Response, next) => {
    parcelController.getAllParcels(req, res, next);
  }
);

/*
 * Rutas protegidas (requieren permisos específicos)
 */
router.post(
  '/',
  requireAnyPermission(['parcelas:create', 'parcelas:update']),
  (req: Request, res: Response, next) => {
    parcelController.createParcel(req, res, next);
  }
);

router.put(
  '/:parcelId',
  requireAnyPermission(['parcelas:update']),
  (req: Request, res: Response, next) => {
    parcelController.updateParcel(req, res, next);
  }
);

router.delete(
  '/:parcelId',
  requireAnyPermission(['parcelas:delete', 'parcelas:update']),
  (req: Request, res: Response, next) => {
    parcelController.deleteParcel(req, res, next);
  }
);

/*
 * Manejador de errores del módulo
 */
router.use((error: Error, req: Request, res: Response, next: any) => {
  parcelController.handleError(error, req, res, next);
});

export default router;
