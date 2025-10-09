import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkJwt } from '../../../../shared/infrastructure/config/auth0-simple.config';
import { agroManoAuthMiddleware as hybridAuthMiddleware } from '../../../authentication/infrastructure/middleware/agromano-auth.middleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/cuadrillas
 * @desc Obtener lista de cuadrillas (todas, activas e inactivas)
 */
/**
 * @swagger
 * /api/cuadrillas:
 *   get:
 *     summary: Obtener lista de cuadrillas (todas)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cuadrillas
 *     responses:
 *       200:
 *         description: Lista de cuadrillas
 */
router.get('/',
    checkJwt,
    hybridAuthMiddleware,
    async (req, res) => {
        try {
        const cuadrillas = await prisma.mom_cuadrilla.findMany({
            include: {
            rel_mom_cuadrilla__mom_trabajador: {
                select: {
                mom_trabajador: {
                    select: {
                        trabajador_id: true,
                        nombre_completo: true,
                        documento_identidad: true,
                    },
                },
                },
            },
            },
            orderBy: { cuadrilla_id: 'asc' },
        });

        const response = cuadrillas.map(c => ({
            id: c.cuadrilla_id,
            code: c.codigo_identificador,
            description: c.descripcion,
            workArea: c.area_trabajo,
            active: c.is_activa,
            workers: c.rel_mom_cuadrilla__mom_trabajador.map(r => ({
                id: r.mom_trabajador.trabajador_id,
                name: r.mom_trabajador.nombre_completo,
                identification: r.mom_trabajador.documento_identidad,
            })),
        }));

        res.json({
            success: true,
            data: response,
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener cuadrillas',
        });
        }
    }
);

export default router;
