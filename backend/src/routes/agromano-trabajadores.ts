import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkJwt } from '../config/auth0-simple.config';
import { hybridAuthMiddleware } from '../middleware/hybrid-auth-final.middleware';
import { 
    requirePermission, 
    requireAnyPermission, 
    requirePermissions,
    AgroManoPermission 
} from '../middleware/agromano-rbac.middleware';
import { validateEmployeeInputSingleError } from '../utils/employee-validation';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/trabajadores
 * @desc Obtener lista de trabajadores
 * @access Requiere permisos: trabajadores:read:all OR trabajadores:read:own
 */
/**
 * @swagger
 * /api/trabajadores:
 *   get:
 *     summary: Obtener lista de trabajadores
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajadores
 *     responses:
 *       200:
 *         description: Lista de trabajadores
 */
router.get('/', 
    checkJwt,
    hybridAuthMiddleware,
    requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']),
    async (req, res) => {
        try {
            const userPermissions = req.auth?.permissions || [];
            const canReadAll = userPermissions.includes('trabajadores:read:all');
            
            const trabajadores = await prisma.mom_trabajador.findMany({
                where: { is_activo: true },

                include: {
                    mot_info_laboral: {
                        select: {
                            cargo: true,
                            tipo_contrato: true,
                            salario_base: true,
                            fecha_ingreso_at: true,
                            departamento: true
                        }
                    }
                }
            });

            res.json({
                success: true,
                data: {
                    trabajadores: trabajadores.map(t => ({
                        id: t.trabajador_id.toString(),
                        name: t.nombre_completo,
                        identification: t.documento_identidad,
                        role: t.mot_info_laboral[0]?.cargo,
                        department: t.mot_info_laboral[0]?.departamento,
                        entryDate: t.mot_info_laboral[0]?.fecha_ingreso_at,
                        status: t.is_activo,
                        email: t.email,
                        phone: t.telefono,
                        contractType: t.mot_info_laboral[0]?.tipo_contrato,
                        baseSalary: t.mot_info_laboral[0]?.salario_base,
                        birthDate: t.fecha_nacimiento,
                    })),
                    permissions: userPermissions,
                    scope: canReadAll ? 'all' : 'own'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener trabajadores'
            });
        }
    }
);

/**
 * @route POST /api/trabajadores
 * @desc Crear nuevo trabajador
 * @access Requiere permiso: trabajadores:create
 */
/**
 * @swagger
 * /api/trabajadores:
 *   post:
 *     summary: Crear un trabajador
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajadores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento_identidad:
 *                 type: string
 *                 description: Número de cédula del trabajador
 *               nombre_completo:
 *                 type: string
 *                 description: Nombre completo del trabajador
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento (YYYY-MM-DD)
 *               fecha_registro_at:
 *                 type: string
 *                 format: date
 *                 description: Fecha de ingreso (YYYY-MM-DD)
 *               telefono:
 *                 type: string
 *                 description: Número de teléfono
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               cargo:
 *                 type: string
 *                 description: Cargo del trabajador
 *               created_by:
 *                 type: integer
 *                 description: ID del usuario que crea el registro
 *             required:
 *               - documento_identidad
 *               - nombre_completo
 *               - fecha_nacimiento
 *               - fecha_registro_at
 *               - created_by
 *     responses:
 *       201:
 *         description: Trabajador creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: La cédula ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/', checkJwt, hybridAuthMiddleware, requirePermission('trabajadores:create'),
    async (req, res) => {
        try {
            const userId = (req.user as any)?.id;  
            const { identification, name, birthDate, phone, email } = req.body;

            const error = await validateEmployeeInputSingleError(req.body);
            if (error) {
                return res.status(409).json({ success: false, message: error });
            }
            const newEmployee = await prisma.mom_trabajador.create({
                data: {
                    documento_identidad: identification.trim(),
                    nombre_completo: name.trim(),
                    fecha_nacimiento: new Date(birthDate),
                    fecha_registro_at: new Date(),
                    telefono: phone ? phone.trim() : null,
                    email: email ? email.trim() : null,
                    created_at: new Date(),
                    created_by: parseInt(userId),
                    is_activo: true
                }
            });

            res.status(201).json({
                success: true,
                message: 'Trabajador creado exitosamente',
                data: {
                    trabajador: newEmployee
                }
            });

        } catch (error: unknown) {
            console.error('Error al crear trabajador:', error);
            
            // Type guard para verificar si es un error de Prisma
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const prismaError = error as { code: string };
                if (prismaError.code === 'P2002') {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe un trabajador con esta cédula'
                    });
                }
            }
            
            // Manejar otros tipos de errores
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al crear trabajador'
            });
        }
    }
);

/**
 * @route PUT /api/trabajadores/:id
 * @desc Actualizar trabajador
 * @access Requiere permisos: trabajadores:update:all OR trabajadores:update:own
 */
router.put('/:id', checkJwt, hybridAuthMiddleware, requireAnyPermission(['trabajadores:update:all','trabajadores:update:own']), async (req,res)=>{
    try {
        const { id } = req.params;
        const userPermissions = (req.user as any)?.permissions || [];
        const canUpdateAll = userPermissions.includes('trabajadores:update:all');
        const userId = (req.user as any)?.id;

        const error = await validateEmployeeInputSingleError(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        if (!canUpdateAll && userId !== id) {
            return res.status(403).json({ success:false, message: "No tiene permisos para actualizar este trabajador" });
        }

        const trabajadorPayload: any = {};
        const infoLaboralPayload: any = {};

        // Separar campos por tabla
        if (req.body.name) trabajadorPayload.nombre_completo = req.body.name;
        if (req.body.phone) trabajadorPayload.telefono = req.body.phone;
        if (req.body.email) trabajadorPayload.email = req.body.email;
        if (req.body.birthDate) trabajadorPayload.fecha_nacimiento = new Date(req.body.birthDate);
        trabajadorPayload.updated_at = new Date();
        trabajadorPayload.updated_by = userId;

        if (req.body.role) infoLaboralPayload.cargo = req.body.role;
        if (req.body.contractType) infoLaboralPayload.tipo_contrato = req.body.contractType;
        if (req.body.baseSalary !== undefined) infoLaboralPayload.salario_base = parseFloat(req.body.baseSalary);
        if (req.body.entryDate) infoLaboralPayload.fecha_ingreso_at = new Date(req.body.entryDate);
        if (req.body.department) infoLaboralPayload.departamento = req.body.department;
        // if (req.body.status) infoLaboralPayload.status = req.body.status;
        infoLaboralPayload.updated_at = new Date();
        infoLaboralPayload.updated_by = userId;

        if (Object.keys(trabajadorPayload).length===0 && Object.keys(infoLaboralPayload).length===0) {
            return res.status(400).json({success:false, message:"No hay datos para actualizar"});
        }

        const actions = [];

        if (Object.keys(trabajadorPayload).length > 0) {
            actions.push(prisma.mom_trabajador.update({
                where: { trabajador_id: parseInt(id) },
                data: trabajadorPayload
            }));
        }

        if (Object.keys(infoLaboralPayload).length > 0) {
            actions.push(prisma.mot_info_laboral.updateMany({
                where: { trabajador_id: parseInt(id) },
                data: infoLaboralPayload
            }));
        }

        // Si no hay nada que actualizar, ya retornamos antes
        const results = await prisma.$transaction(actions);

        res.json({
            success: true,
            message:"Trabajador actualizado correctamente",
            data: results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message:"Error interno al actualizar trabajador"});
    }
});

/**
 * @route DELETE /api/trabajadores/:id
 * @desc Eliminar trabajador
 * @access Requiere permiso: trabajadores:delete
 */
router.delete('/:id', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requirePermission('trabajadores:delete'),
    async (req, res) => {
        const { id } = req.params;

        try {
            await prisma.$transaction(async (tx) => {
                // 1. Eliminar información laboral asociada
                await tx.mot_info_laboral.deleteMany({
                where: {
                    trabajador_id: parseInt(id),
                },
                });

                // 2. Eliminar trabajador
                await tx.mom_trabajador.delete({
                where: {
                    trabajador_id: parseInt(id),
                },
                });
            });
            return res.status(204).send();
        } catch(error: any) {
            console.error('Error al eliminar trabajador:', error);

            // Error: trabajador no existe
            if (error.code === 'P2025') {
                return res.status(404).json({
                success: false,
                message: 'El trabajador no existe'
                });
            }

            // Error: integridad referencial (FK)
            if (error.code === 'P2003') {
                return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el trabajador porque tiene información relacionada'
                });
            }

            // Error genérico
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al eliminar el trabajador'
            });
        }
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

/**
 * @route GET /api/trabajadores/search/:query
 * @desc Buscar trabajadores por cédula o cargo
 * @access Requiere permisos: trabajadores:read:all OR trabajadores:read:own
 */
/**
 * @swagger
 * /api/trabajadores/search/{query}:
 *   get:
 *     summary: Buscar trabajadores por cédula o cargo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajadores
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (cédula o cargo)
 *     responses:
 *       200:
 *         description: Lista de trabajadores encontrados
 */
router.get('/search/:query', 
    checkJwt,
    hybridAuthMiddleware,
    requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']),
    async (req, res) => {
        try {
            const { query } = req.params;
            const userPermissions = req.auth?.permissions || [];
            const canReadAll = userPermissions.includes('trabajadores:read:all');
            
            // Buscar por cédula o cargo (necesitarías join con la tabla de info laboral)
            const trabajadores = await prisma.mom_trabajador.findMany({
                where: {
                    AND: [
                        { is_activo: true },
                        {
                            OR: [
                                { documento_identidad: { contains: query } },
                                { 
                                    mot_info_laboral: {
                                        some: {
                                            cargo: { contains: query }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                include: {
                    mot_info_laboral: {
                        take: 1,
                        orderBy: { info_laboral_id: 'desc' }
                    }
                },
                take: 50 // Limitar resultados
            });

            res.json({
                success: true,
                data: {
                    trabajadores: trabajadores.map(t => ({
                        id: t.trabajador_id.toString(),
                        name: t.nombre_completo,
                        identification: t.documento_identidad,
                        role: t.mot_info_laboral[0]?.cargo || 'Sin definir',
                        birthDate: t.fecha_nacimiento,
                        entryDate: t.mot_info_laboral[0]?.fecha_ingreso_at,
                        baseSalary: t.mot_info_laboral[0]?.salario_base,
                        department: t.mot_info_laboral[0]?.departamento,
                        status: t.is_activo ? 'activo' : 'inactivo',
                        email: t.email,
                        contractType: t.mot_info_laboral[0]?.tipo_contrato,
                        phone: t.telefono
                    })),
                    permissions: userPermissions,
                    scope: canReadAll ? 'all' : 'own'
                }
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
 * @route POST /api/trabajadores/:id/info-laboral
 * @desc Crear información laboral del trabajador
 * @access Requiere permisos: trabajadores:update:all OR trabajadores:update:own
 */
router.post('/:id/info-laboral', 
    checkJwt,
    hybridAuthMiddleware,
    requireAnyPermission(['trabajadores:update:all', 'trabajadores:update:own']),
    async (req, res) => {
        try {
            const { id } = req.params;
            const userId = (req.user as any)?.id;            
            const { role, baseSalary, contractType, entryDate, department } = req.body;

            const existingInfo = await prisma.mot_info_laboral.findFirst({
                where: { trabajador_id: parseInt(id) }
            });

            if (existingInfo) {
                return res.status(400).json({
                    success: false,
                    message: 'Este trabajador ya tiene información laboral registrada'
                });
            }
            
            // Crear información laboral en la base de datos
            await prisma.mot_info_laboral.create({
                data: {
                    trabajador_id: parseInt(id),
                    cargo: role,
                    departamento: department,
                    salario_base: parseFloat(baseSalary),
                    tipo_contrato: contractType,
                    fecha_ingreso_at: new Date(entryDate),
                    fecha_ultima_actualizacion_at: new Date(),
                    usuario_ultima_actualizacion: parseInt(userId),
                    created_at: new Date(),
                    created_by: parseInt(userId),
                    updated_at: new Date(),
                    updated_by: parseInt(userId)
                }
            });
            
            res.status(201).json({
                success: true,
                message: 'Información laboral guardada'
            });
            
        } catch (error: any) {
            console.error('Error al crear información laboral:', error);
            
            // Manejar errores específicos de Prisma
            if (error.code === 'P2003') {
                return res.status(404).json({
                    success: false,
                    message: 'Trabajador no encontrado'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al crear la información laboral'
            });
        }
    }
);

export default router;
