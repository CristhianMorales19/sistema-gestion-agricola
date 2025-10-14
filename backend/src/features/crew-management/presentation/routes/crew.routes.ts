import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkJwt } from '../../../../shared/infrastructure/config/auth0-simple.config';
import { agroManoAuthMiddleware as hybridAuthMiddleware } from '../../../authentication/infrastructure/middleware/agromano-auth.middleware';
import { 
    requirePermission, 
    requireAnyPermission, 
    requirePermissions,
    AgroManoPermission 
} from '../../../authentication/infrastructure/middleware/agromano-rbac.middleware';

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
router.get('/', checkJwt, hybridAuthMiddleware,
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

/**
 * @route GET /api/cuadrillas/:query
 * @desc Buscar cuadrillas por código o área de trabajo
 */
/**
 * @swagger
 * /api/cuadrillas/{query}:
 *   get:
 *     summary: Buscar cuadrillas por código o área de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cuadrillas
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (código o área de trabajo)
 *     responses:
 *       200:
 *         description: Lista de cuadrillas encontradas
 */
router.get('/:query', checkJwt, hybridAuthMiddleware,
    // requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']),
    async (req, res) => {
        try {
            const { query } = req.params;
            // const userPermissions = req.auth?.permissions || [];
            // const canReadAll = userPermissions.includes('trabajadores:read:all');

            if (!query || query.trim().length < 2) {
                return res.json({ success: true, data: [] });
            }

            // Buscar por código o área de trabajo
            const cuadrillas = await prisma.mom_cuadrilla.findMany({
                where: {
                    OR: [
                        { codigo_identificador: { contains: query.toLowerCase() } },
                        { area_trabajo: { contains: query.toLowerCase() } }
                    ]
                },
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
                take: 50 // Limitar resultados
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
            console.error('Error en búsqueda:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar trabajadores'
            });
        }
    }
);

/**
 * @route POST /api/cuadrillas
 * @desc Crear nueva cuadrilla
 */
router.post('/', checkJwt, hybridAuthMiddleware, async (req, res) => {
    try {
        const { code, description, workArea, workers } = req.body;
        const userId = (req as any).user.usuario_id;
        console.log('Datos recibidos para crear cuadrilla :', req.body);

        // Validar campos obligatorios
        if (!code || !description || !workArea) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios',
            });
        }

        // Validar que los trabajadores existan
        if (workers && workers.length > 0) {
            const trabajadoresExistentes = await prisma.mom_trabajador.findMany({
                where: { trabajador_id: { in: workers.map(Number) } },
                select: { trabajador_id: true },
            });

            const existentesIds = trabajadoresExistentes.map(t => t.trabajador_id);
            const noExistentes = workers.filter((w: string) => !existentesIds.includes(Number(w)));

            if (noExistentes.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Los siguientes trabajadores no existen: ${noExistentes.join(', ')}`,
                });
            }
        }

        // Crear la cuadrilla y asignar trabajadores si hay
        await prisma.mom_cuadrilla.create({
            data: {
                codigo_identificador: code,
                nombre: '',
                descripcion: description,
                area_trabajo: workArea,
                fecha_creacion_at: new Date(),
                created_at: new Date(),
                created_by: userId,
                // Conectar trabajadores
                ...(workers?.length > 0 && {
                    rel_mom_cuadrilla__mom_trabajador: {
                        create: workers.map((id: number) => ({
                            trabajador_id: Number(id),
                            fecha_asignacion_at: new Date(),
                            usuario_asignacion: userId,
                            created_at: new Date(),
                            created_by: userId,
                        })),
                    },
                }),
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Cuadrilla creada exitosamente',
        });
    } catch (error) {
        console.error('Error al crear cuadrilla:', error);
        const err = error as { code?: string; message?: string };

        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una cuadrilla con ese código',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
});

/**
 * @route PATCH /api/cuadrillas/:id
 * @desc Actualizar cuadrilla
 */
router.patch('/:id', checkJwt, hybridAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { code, description, workArea, workers } = req.body;
        const userId = (req as any).user.usuario_id;

        const data: any = {};
        if (code) data.codigo_identificador = code;
        if (description) data.descripcion = description;
        if (workArea) data.area_trabajo = workArea;

        await prisma.mom_cuadrilla.update({
        where: { cuadrilla_id: Number(id) },
        data: {
            ...data,
            updated_at: new Date(),
            updated_by: userId,
            ...(workers && {
            rel_mom_cuadrilla__mom_trabajador: {
                deleteMany: {}, // limpias anteriores
                create: workers.map((id: number) => ({
                    trabajador_id: Number(id),
                    fecha_asignacion_at: new Date(),
                    usuario_asignacion: userId,
                    created_at: new Date(),
                    created_by: userId,
                })),
            },
            }),
        },
        });

        res.json({ success: true, message: 'Cuadrilla actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar cuadrilla:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar cuadrilla' });
    }
});

/**
 * @route DELETE /api/cuadrillas/:id
 * @desc Eliminar una cuadrilla por ID
 */
/**
 * @swagger
 * /api/cuadrillas/{id}:
 *   delete:
 *     summary: Eliminar una cuadrilla por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cuadrillas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cuadrilla a eliminar
 *     responses:
 *       200:
 *         description: Cuadrilla eliminada correctamente
 *       404:
 *         description: Cuadrilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', checkJwt, hybridAuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.usuario_id;

        console.log(`Solicitud para eliminar cuadrilla ID: ${id} por usuario ${userId}`);

        // Verificar si la cuadrilla existe
        const crew = await prisma.mom_cuadrilla.findUnique({
            where: { cuadrilla_id: Number(id) },
            select: { cuadrilla_id: true },
        });

        if (!crew) {
            return res.status(404).json({
                success: false,
                message: 'La cuadrilla no existe o ya fue eliminada',
            });
        }

        // Eliminar las relaciones con trabajadores antes de eliminar la cuadrilla
        await prisma.rel_mom_cuadrilla__mom_trabajador.deleteMany({
            where: { cuadrilla_id: Number(id) },
        });

        // Eliminar la cuadrilla
        await prisma.mom_cuadrilla.delete({
            where: { cuadrilla_id: Number(id) },
        });

        res.json({
            success: true,
            message: 'Cuadrilla eliminada correctamente',
        });

    } catch (error) {
        console.error('Error al eliminar cuadrilla:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al eliminar cuadrilla',
        });
    }
});

export default router;