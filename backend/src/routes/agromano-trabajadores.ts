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
// Backend - Modifica tu ruta para devolver datos reales
router.get('/', 
    checkJwt,
    hybridAuthMiddleware,
    requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']),
    async (req, res) => {
        try {
            const userPermissions = req.auth?.permissions || [];
            const canReadAll = userPermissions.includes('trabajadores:read:all');
            
            // Aquí debes hacer la consulta real a tu base de datos
            const trabajadores = await prisma.mom_trabajador.findMany({
                where: { is_activo: true },

                include: {
                    mot_info_laboral: {
                        select: {
                            cargo: true,
                        }
                    }
                }
                // select: {
                //     trabajador_id: true,
                //     documento_identidad: true,
                //     nombre_completo: true,
                //     fecha_nacimiento: true,
                //     telefono: true,
                //     email: true,
                //     is_activo: true,
                //     fecha_registro_at: true,
                //     created_at: true,
                //     updated_at: true
                // }
            });

            res.json({
                success: true,
                data: {
                    trabajadores: trabajadores.map(t => ({
                        id: t.trabajador_id.toString(),
                        name: t.nombre_completo,
                        identification: t.documento_identidad,
                        cargo:  t.mot_info_laboral[0]?.cargo || 'Sin asignar', // Necesitas join con otra tabla
                        hireDate: t.fecha_registro_at,
                        status: t.is_activo ? 'activo' : 'inactivo',
                        email: t.email,
                        phone: t.telefono,
                        createdAt: t.created_at,
                        updatedAt: t.updated_at
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
router.post('/', 
        (req, res, next) => {
        console.log('1. Request recibida - Headers:', req.headers);
        console.log('1. Request recibida - Body:', req.body);
        next();
    },
    checkJwt,
    (req, res, next) => {
        console.log('2. Después de checkJwt - User:', (req as any).user);
        next();
    },
    hybridAuthMiddleware,
    (req, res, next) => {
        console.log('3. Después de hybridAuthMiddleware - User:', (req as any).user);
        next();
    },
    requirePermission('trabajadores:create'),
    (req, res, next) => {
        console.log('4. Después de requirePermission');
        next();
    },
    async (req, res) => {
        try {
            console.log('5. Datos recibidos en controller:', req.body);
            
            const {
                documento_identidad,
                nombre_completo,
                fecha_nacimiento,
                fecha_registro_at,
                telefono,
                email,
                cargo,
                // Campos laborales opcionales
                codigo_nomina,
                salario_bruto,
                rebajas_ccss,
                otras_rebajas,
                salario_por_hora,
                horas_ordinarias,
                horas_extras,
                horas_otras,
                vacaciones_monto,
                incapacidad_monto,
                lactancia_monto,
                created_by
            } = req.body;

            // Validar campos requeridos
            if (!documento_identidad || !nombre_completo || !fecha_nacimiento || !fecha_registro_at || !created_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos'
                });
            }

            // Verificar si la cédula ya existe
            const existingEmployee = await prisma.mom_trabajador.findUnique({
                where: {
                    documento_identidad: documento_identidad.trim()
                }
            });

            if (existingEmployee) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un trabajador con esta cédula'
                });
            }
            
            // Verificar si el correo ya existe
            const existingEmployeeByEmail = await prisma.mom_trabajador.findFirst({
                where: {
                    email: email.trim()
                }
            });

            if (existingEmployeeByEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un trabajador con este correo electrónico'
                });
            }

            // Verificar si el correo ya existe en la tabla de usuarios
            const existingUserByEmail = await prisma.mot_usuario.findFirst({
                where: {
                    username: email.trim()
                }
            });

            if (existingUserByEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un usuario con este correo electrónico'
                });
            }

            // Crear el trabajador en la base de datos
            const newEmployee = await prisma.mom_trabajador.create({
                data: {
                    documento_identidad: documento_identidad.trim(),
                    nombre_completo: nombre_completo.trim(),
                    fecha_nacimiento: new Date(fecha_nacimiento),
                    fecha_registro_at: new Date(fecha_registro_at),
                    telefono: telefono ? telefono.trim() : null,
                    email: email ? email.trim() : null,
                    // El campo cargo se guardaría en otra tabla relacionada (mot_info_laboral)
                    // Por ahora lo dejamos como campo adicional si es necesario
                    created_at: new Date(),
                    created_by: created_by,
                    is_activo: true
                }
            });

            // Si se proporcionó un cargo, crear registro en la tabla de información laboral
            if (cargo || salario_bruto || codigo_nomina) {
                await prisma.mot_info_laboral.create({
                    data: {
                        trabajador_id: newEmployee.trabajador_id,
                        cargo: cargo ? cargo.trim() : 'Sin definir',
                        fecha_ingreso_at: new Date(fecha_registro_at),
                        tipo_contrato: req.body.tipo_contrato || 'no_definido',
                        salario_base: salario_bruto ? parseFloat(String(salario_bruto)) : 0,
                        codigo_nomina: codigo_nomina ? String(codigo_nomina) : null,
                        salario_bruto: salario_bruto ? parseFloat(String(salario_bruto)) : null,
                        rebajas_ccss: rebajas_ccss ? parseFloat(String(rebajas_ccss)) : null,
                        otras_rebajas: otras_rebajas ? parseFloat(String(otras_rebajas)) : null,
                        salario_por_hora: salario_por_hora ? parseFloat(String(salario_por_hora)) : null,
                        horas_ordinarias: horas_ordinarias ? parseFloat(String(horas_ordinarias)) : null,
                        horas_extras: horas_extras ? parseFloat(String(horas_extras)) : null,
                        horas_otras: horas_otras ? parseFloat(String(horas_otras)) : null,
                        vacaciones_monto: vacaciones_monto ? parseFloat(String(vacaciones_monto)) : null,
                        incapacidad_monto: incapacidad_monto ? parseFloat(String(incapacidad_monto)) : null,
                        lactancia_monto: lactancia_monto ? parseFloat(String(lactancia_monto)) : null,
                        fecha_ultima_actualizacion_at: new Date(),
                        usuario_ultima_actualizacion: created_by,
                        created_at: new Date(),
                        created_by: created_by,
                    }
                });
            }

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
router.put('/:id', 
    checkJwt,
    hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
    requireAnyPermission(['trabajadores:update:all', 'trabajadores:update:own']),
    async (req, res) => {
        try {
            const { id } = req.params;
            const userPermissions = (req as any).user?.permissions || [];
            const canUpdateAll = userPermissions.includes('trabajadores:update:all');
            
            // Validar datos requeridos
            const { cargo, salario_base, tipo_contrato } = req.body;
            // Campos adicionales que pueden llegar por el formulario laboral
            const {
                codigo_nomina,
                salario_bruto,
                rebajas_ccss,
                otras_rebajas,
                salario_por_hora,
                horas_ordinarias,
                horas_extras,
                horas_otras,
                vacaciones_monto,
                incapacidad_monto,
                lactancia_monto
            } = req.body;
            
            if (!cargo || !salario_base || !tipo_contrato) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos: cargo, salario_base, tipo_contrato'
                });
            }
            
            // Validar que el salario sea un número positivo
            if (isNaN(salario_base) || salario_base < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El salario base debe ser un número positivo'
                });
            }
            
            // Actualizar o crear registro en mot_info_laboral
            const trabajadorId = parseInt(id, 10);
            // Buscar info laboral más reciente
            const existingInfo = await prisma.mot_info_laboral.findFirst({
                where: { trabajador_id: trabajadorId },
                orderBy: { info_laboral_id: 'desc' }
            });

            const laboralData = {
                trabajador_id: trabajadorId,
                cargo: cargo ? String(cargo) : (existingInfo ? existingInfo.cargo : 'Sin definir'),
                fecha_ingreso_at: req.body.fecha_ingreso_at ? new Date(req.body.fecha_ingreso_at) : (existingInfo ? existingInfo.fecha_ingreso_at : new Date()),
                tipo_contrato: tipo_contrato ? String(tipo_contrato) : (existingInfo ? existingInfo.tipo_contrato : 'no_definido'),
                salario_base: salario_base ? parseFloat(String(salario_base)) : (existingInfo ? parseFloat(String(existingInfo.salario_base)) : 0),
                codigo_nomina: req.body.codigo_nomina ? String(req.body.codigo_nomina) : (existingInfo ? existingInfo.codigo_nomina : null),
                salario_bruto: req.body.salario_bruto ? parseFloat(String(req.body.salario_bruto)) : (existingInfo ? existingInfo.salario_bruto : null),
                rebajas_ccss: req.body.rebajas_ccss ? parseFloat(String(req.body.rebajas_ccss)) : (existingInfo ? existingInfo.rebajas_ccss : null),
                otras_rebajas: req.body.otras_rebajas ? parseFloat(String(req.body.otras_rebajas)) : (existingInfo ? existingInfo.otras_rebajas : null),
                salario_por_hora: req.body.salario_por_hora ? parseFloat(String(req.body.salario_por_hora)) : (existingInfo ? existingInfo.salario_por_hora : null),
                horas_ordinarias: req.body.horas_ordinarias ? parseFloat(String(req.body.horas_ordinarias)) : (existingInfo ? existingInfo.horas_ordinarias : null),
                horas_extras: req.body.horas_extras ? parseFloat(String(req.body.horas_extras)) : (existingInfo ? existingInfo.horas_extras : null),
                horas_otras: req.body.horas_otras ? parseFloat(String(req.body.horas_otras)) : (existingInfo ? existingInfo.horas_otras : null),
                vacaciones_monto: req.body.vacaciones_monto ? parseFloat(String(req.body.vacaciones_monto)) : (existingInfo ? existingInfo.vacaciones_monto : null),
                incapacidad_monto: req.body.incapacidad_monto ? parseFloat(String(req.body.incapacidad_monto)) : (existingInfo ? existingInfo.incapacidad_monto : null),
                lactancia_monto: req.body.lactancia_monto ? parseFloat(String(req.body.lactancia_monto)) : (existingInfo ? existingInfo.lactancia_monto : null),
                fecha_ultima_actualizacion_at: new Date(),
                usuario_ultima_actualizacion: (req as any).user?.sub || 1,
                updated_at: new Date()
            };

            if (existingInfo) {
                await prisma.mot_info_laboral.update({
                    where: { info_laboral_id: existingInfo.info_laboral_id },
                    data: laboralData
                });
            } else {
                await prisma.mot_info_laboral.create({ data: laboralData });
            }

            res.json({
                success: true,
                message: `Información laboral del trabajador ${id} actualizada exitosamente`,
                data: {
                    action: 'update',
                    trabajadorId: id,
                    scope: canUpdateAll ? 'all' : 'own',
                    data: laboralData,
                    permissions: userPermissions
                }
            });
            
        } catch (error) {
            console.error('Error al actualizar trabajador:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al actualizar la información laboral'
            });
        }
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
                permissions: (req as any).user?.permissions
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
                permissions: (req as any).user?.permissions
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
                permissions: (req as any).user?.permissions
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
                        position: t.mot_info_laboral[0]?.cargo || 'Sin definir',
                        hireDate: t.fecha_registro_at,
                        status: t.is_activo ? 'activo' : 'inactivo',
                        email: t.email,
                        phone: t.telefono,
                        createdAt: t.created_at,
                        updatedAt: t.updated_at
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

// En tu archivo agromano-trabajadores.ts - Agregar endpoint POST
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
            const userId = (req as any).user?.id;            
            const { cargo, salario_base, tipo_contrato, fecha_ingreso, departamento } = req.body;

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
            const nuevaInfoLaboral = await prisma.mot_info_laboral.create({
                data: {
                    trabajador_id: parseInt(id),
                    cargo,
                    salario_base: parseFloat(salario_base),
                    tipo_contrato,
                    fecha_ingreso_at: new Date(fecha_ingreso),
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
                message: 'Información laboral guardada',
                data: {
                    info_laboral_id: nuevaInfoLaboral.info_laboral_id,
                    trabajador_id: nuevaInfoLaboral.trabajador_id,
                    cargo: nuevaInfoLaboral.cargo,
                    departamento: '',
                    salario_base: nuevaInfoLaboral.salario_base,
                    tipo_contrato: nuevaInfoLaboral.tipo_contrato,
                    fecha_ingreso: nuevaInfoLaboral.fecha_ingreso_at
                }
            });
            
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            console.error('Error al crear información laboral:', err);
            
            // Manejar errores específicos de Prisma
            if (err.code === 'P2003') {
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
