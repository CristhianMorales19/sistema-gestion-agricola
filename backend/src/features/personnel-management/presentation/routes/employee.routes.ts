import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { checkJwt } from "../../../../shared/infrastructure/config/auth0-simple.config";
import { agroManoAuthMiddleware as hybridAuthMiddleware } from "../../../authentication/infrastructure/middleware/agromano-auth.middleware";
import {
  requirePermission,
  requireAnyPermission,
  requirePermissions,
  AgroManoPermission,
} from "../../../authentication/infrastructure/middleware/agromano-rbac.middleware";
import { Decimal } from "@prisma/client/runtime/library";

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
router.get(
  "/",
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  async (req, res) => {
    try {
      const employees = await prisma.mom_trabajador.findMany({
        include: {
          mot_info_laboral: {
            select: {
              cargo: true,
              tipo_contrato: true,
              salario_base: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      console.log("📊 Trabajadores encontrados:", employees.length);

      const mappedEmployees = employees.map((t) => ({
        id: t.trabajador_id,
        name: t.nombre_completo,
        identification: t.documento_identidad,
        position: t.mot_info_laboral[0]?.cargo ?? "Sin definir",
        hireDate: t.fecha_registro_at,
        status: Boolean(t.is_activo),
        email: t.email,
        phone: t.telefono,
      }));

      res.json({
        success: true,
        data: mappedEmployees,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener empleados",
      });
    }
  },
);

/**
 * @route GET /api/trabajadores/sin-cuadrilla
 * @desc Obtener lista de trabajadores sin cuadrilla
 * @access Requiere permisos: trabajadores:read:all OR trabajadores:read:own
 */
/**
 * @swagger
 * /api/trabajadores:
 *   get:
 *     summary: Obtener lista de trabajadores sin cuadrilla
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajadores
 *     responses:
 *       200:
 *         description: Lista de trabajadores sin cuadrilla
 */
router.get(
  "/sin-cuadrilla",
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  async (req, res) => {
    try {
      const employees = await prisma.mom_trabajador.findMany({
        where: {
          rel_mom_cuadrilla__mom_trabajador: {
            none: {},
          },
        },
        include: {
          mot_info_laboral: {
            select: {
              cargo: true,
              tipo_contrato: true,
              salario_base: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      console.log(
        "📊 Trabajadores encontrados sin cuadrilla:",
        employees.length,
      );

      const mappedEmployees = employees.map((t) => ({
        id: t.trabajador_id,
        name: t.nombre_completo,
        identification: t.documento_identidad,
        position: t.mot_info_laboral[0]?.cargo ?? "Sin definir",
        hireDate: t.fecha_registro_at,
        status: Boolean(t.is_activo),
        email: t.email,
        phone: t.telefono,
      }));

      res.json({
        success: true,
        data: mappedEmployees,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener empleados",
      });
    }
  },
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
router.post(
  "/",
  checkJwt,
  hybridAuthMiddleware,
  requirePermission("trabajadores:create"),
  async (req, res) => {
    const userId = (req as any).user?.usuario_id;
    try {
      const { identification, name, birthDate, hireDate, phone, email } =
        req.body;

      await prisma.mom_trabajador.create({
        data: {
          documento_identidad: identification.trim(),
          nombre_completo: name.trim(),
          fecha_nacimiento: new Date(birthDate),
          fecha_registro_at: new Date(hireDate),
          telefono: phone.trim(),
          email: email.trim(),
          created_at: new Date(),
          created_by: userId,
          is_activo: true,
        },
      });

      res.status(201).json({
        success: true,
        message: "Empleado creado",
      });
    } catch (error: unknown) {
      console.error("Error al crear trabajador:", error);

      // Type guard para verificar si es un error de Prisma
      if (typeof error === "object" && error !== null && "code" in error) {
        const prismaError = error as { code: string };
        if (prismaError.code === "P2002") {
          return res.status(409).json({
            success: false,
            message: "Ya existe un empleado con esta cédula",
          });
        }
      }

      // Manejar otros tipos de errores
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al crear empleado",
      });
    }
  },
);

/**
 * @route DELETE /api/trabajadores/:id
 * @desc Eliminar trabajador
 * @access Requiere permiso: trabajadores:delete
 */
router.delete(
  "/:id",
  checkJwt,
  hybridAuthMiddleware,
  requirePermission("trabajadores:delete"),
  async (req, res) => {
    const employeeId = Number(req.params.id);

    try {
      // Buscar el trabajador
      const trabajador = await prisma.mom_trabajador.findUnique({
        where: { trabajador_id: employeeId },
      });

      if (!trabajador) {
        return res.status(404).json({
          success: false,
          message: `Empleado no encontrado`,
        });
      }

      // Usar transacción para asegurar atomicidad
      await prisma.$transaction(async (prisma) => {
        // Eliminar TODAS las relaciones en orden
        await prisma.moh_trabajador_historial.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_asignacion_cuadrilla.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_asignacion_tarea.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_asistencia.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_ausencia_justificada.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_deduccion_especial.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_info_laboral.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_liquidacion.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_registro_productividad.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.mot_usuario.deleteMany({
          where: { trabajador_id: employeeId },
        });

        await prisma.rel_mom_cuadrilla__mom_trabajador.deleteMany({
          where: { trabajador_id: employeeId },
        });

        // Finalmente eliminar al trabajador
        await prisma.mom_trabajador.delete({
          where: { trabajador_id: employeeId },
        });
      });

      return res.json({
        success: true,
        message: `Empleado eliminado`,
      });
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar empleado",
        error: (error as any).message,
      });
    }
  },
);

/**
 * @route GET /api/trabajadores/export
 * @desc Exportar datos de trabajadores
 * @access Requiere permiso: trabajadores:export
 */
router.get(
  "/export",
  checkJwt,
  hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
  requirePermission("trabajadores:export"),
  (req, res) => {
    res.json({
      success: true,
      message: "Exportación de trabajadores generada",
      data: {
        action: "export",
        format: req.query.format || "excel",
        filename: `trabajadores_${new Date().toISOString().split("T")[0]}.xlsx`,
        permissions: (req as any).user?.permissions,
      },
    });
  },
);

/**
 * @route POST /api/trabajadores/import
 * @desc Importar datos de trabajadores
 * @access Requiere permisos: trabajadores:import AND trabajadores:create
 */
router.post(
  "/import",
  checkJwt,
  hybridAuthMiddleware, // Verificar usuario en BD y cargar permisos
  requirePermissions(["trabajadores:import", "trabajadores:create"]),
  (req, res) => {
    res.json({
      success: true,
      message: "Importación de empleados procesada",
      data: {
        action: "import",
        recordsProcessed: 25,
        recordsCreated: 20,
        recordsSkipped: 5,
        permissions: (req as any).user?.permissions,
      },
    });
  },
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
router.get(
  "/search/:query",
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  async (req, res) => {
    try {
      const { query } = req.params;
      const userPermissions = req.auth?.permissions || [];
      const canReadAll = userPermissions.includes("trabajadores:read:all");
      const employees = await prisma.mom_trabajador.findMany({
        where: {
          AND: [
            { is_activo: true },
            {
              OR: [
                {
                  nombre_completo: {
                    contains: query,
                  },
                },
                {
                  documento_identidad: {
                    contains: query,
                  },
                },
                {
                  mot_info_laboral: {
                    some: {
                      cargo: {
                        contains: query,
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          mot_info_laboral: {
            take: 1,
            orderBy: { info_laboral_id: "desc" },
          },
        },
        orderBy: { created_at: "desc" },
        take: 50, // Limitar resultados
      });

      const mappedEmployees = employees.map((t) => ({
        id: t.trabajador_id,
        name: t.nombre_completo,
        identification: t.documento_identidad,
        position: t.mot_info_laboral[0]?.cargo,
        hireDate: t.mot_info_laboral[0]?.fecha_ingreso_at,
        status: t.is_activo,
        email: t.email,
        phone: t.telefono,
      }));

      res.json({
        success: true,
        data: mappedEmployees,
      });
    } catch (error) {
      console.error("Error en búsqueda:", error);
      res.status(500).json({
        success: false,
        message: "Error al buscar empleado",
      });
    }
  },
);

/**
 * @route POST /api/trabajadores/:id/info-laboral
 * @desc Crear información laboral del trabajador
 * @access Requiere permisos: trabajadores:update:all OR trabajadores:update:own
 */
router.post(
  "/:id/info-laboral",
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(["trabajadores:update:all", "trabajadores:update:own"]),
  async (req, res) => {
    try {
      const employeeId = Number(req.params.id);
      const userId = (req as any).user?.usuario_id;
      const {
        position,
        baseSalary,
        contractType,
        area,
        payrollCode,
        salaryGross,
        ccssDeduction,
        otherDeductions,
        salaryPerHour,
        ordinaryHours,
        extraHours,
        otherHours,
        vacationAmount,
        incapacityAmount,
        lactationAmount,
      } = req.body;

      // Crear información laboral en la base de datos
      await prisma.mot_info_laboral.create({
        data: {
          trabajador_id: employeeId,
          cargo: position,
          fecha_ingreso_at: new Date(),
          tipo_contrato: contractType,
          area: area,
          salario_base: baseSalary,
          codigo_nomina: payrollCode,
          salario_bruto: salaryGross,
          rebajas_ccss: ccssDeduction,
          otras_rebajas: otherDeductions,
          salario_por_hora: salaryPerHour,
          horas_ordinarias: ordinaryHours,
          horas_extras: extraHours,
          horas_otras: otherHours,
          vacaciones_monto: vacationAmount,
          incapacidad_monto: incapacityAmount,
          lactancia_monto: lactationAmount,
          fecha_ultima_actualizacion_at: new Date(),
          usuario_ultima_actualizacion: userId,
          created_at: new Date(),
          created_by: userId,
        },
      });

      res.status(201).json({
        success: true,
        message: "Información laboral guardada",
      });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error("Error al crear información laboral:", err);

      // Manejar errores específicos de Prisma
      if (err.code === "P2003") {
        return res.status(404).json({
          success: false,
          message: "Empleado no encontrado",
        });
      }
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al crear la información laboral",
      });
    }
  },
);

/**
 * @route GET /api/trabajadores
 * @desc Obtener trabajador
 * @access Requiere permisos: trabajadores:read:all OR trabajadores:read:own
 */
/**
 * @swagger
 * /api/trabajadores:
 *   get:
 *     summary: Obtener trabajador
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajador
 *     responses:
 *       200:
 *         description: Trabajador
 */
router.get(
  "/:id",
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  async (req, res) => {
    try {
      const employeeId = Number(req.params.id);

      const employee = await prisma.mom_trabajador.findUnique({
        where: {
          trabajador_id: employeeId,
        },
        include: {
          mot_info_laboral: true,
        },
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Empleado no encontrado",
        });
      }

      const mappedEmployee = {
        id: employee.trabajador_id,
        identification: employee.documento_identidad,
        name: employee.nombre_completo,
        birthDate: employee.fecha_nacimiento,
        phone: employee.telefono,
        email: employee.email,
        hireDate: employee.fecha_registro_at,
        status: employee.is_activo,
      };

      const labor = employee.mot_info_laboral[0];
      let mappedLaborInfo = null;

      if (labor) {
        mappedLaborInfo = {
          position: labor.cargo,
          baseSalary: toNumber(labor.salario_base),
          contractType: labor.tipo_contrato,
          area: labor.area,
          payrollCode: labor.codigo_nomina,
          salaryGross: toNumber(labor.salario_bruto),
          ccssDeduction: toNumber(labor.rebajas_ccss),
          salaryPerHour: toNumber(labor.salario_por_hora),
          ordinaryHours: toNumber(labor.horas_ordinarias),
          otherDeductions: toNumber(labor.otras_rebajas),
          extraHours: toNumber(labor.horas_extras),
          otherHours: toNumber(labor.horas_otras),
          vacationAmount: toNumber(labor.vacaciones_monto),
          incapacityAmount: toNumber(labor.incapacidad_monto),
          lactationAmount: toNumber(labor.lactancia_monto),
        };
      }

      res.json({
        success: true,
        data: {
          employee: mappedEmployee,
          laborInfo: mappedLaborInfo,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener empleadooo",
      });
    }
  },
);

/**
 * @route PUT /api/trabajadores
 * @desc Actualizar trabajador
 * @access Requiere permisos: trabajadores:read:all OR trabajadores:read:own
 */
/**
 * @swagger
 * /api/trabajadores:
 *   get:
 *     summary: Actualizar trabajador
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajador
 *     responses:
 *       200:
 *         description: Trabajador
 */
router.put(
  "/:id",
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  async (req, res) => {
    try {
      const { employee, laborInfo } = req.body;
      const userId = (req as any).user?.usuario_id;
      const employeeId = Number(req.params.id);

      const {
        position,
        baseSalary,
        contractType,
        area,
        payrollCode,
        salaryGross,
        ccssDeduction,
        otherDeductions,
        salaryPerHour,
        ordinaryHours,
        extraHours,
        otherHours,
        vacationAmount,
        incapacityAmount,
        lactationAmount,
      } = laborInfo;

      const {
        identification,
        name,
        birthDate,
        hireDate,
        phone,
        email,
        status,
      } = employee;

      const basicInfoData = {
        documento_identidad: identification.trim(),
        nombre_completo: name.trim(),
        fecha_nacimiento: new Date(birthDate),
        fecha_registro_at: new Date(hireDate),
        telefono: phone.trim(),
        email: email.trim(),
        created_at: new Date(),
        is_activo: status,
      };

      const laborInfoData = {
        trabajador_id: employeeId,
        cargo: position,
        fecha_ingreso_at: new Date(),
        tipo_contrato: contractType,
        area: area,
        salario_base: toDecimal(baseSalary),
        codigo_nomina: payrollCode,
        salario_bruto: toDecimal(salaryGross),
        rebajas_ccss: toDecimal(ccssDeduction),
        otras_rebajas: toDecimal(otherDeductions),
        salario_por_hora: toDecimal(salaryPerHour),
        horas_ordinarias: toDecimal(ordinaryHours),
        horas_extras: toDecimal(extraHours),
        horas_otras: toDecimal(otherHours),
        vacaciones_monto: toDecimal(vacationAmount),
        incapacidad_monto: toDecimal(incapacityAmount),
        lactancia_monto: toDecimal(lactationAmount),
        fecha_ultima_actualizacion_at: new Date(),
        usuario_ultima_actualizacion: userId,
      };

      const findEmployee = await prisma.mom_trabajador.findUnique({
        where: {
          trabajador_id: employeeId,
        },
        include: {
          mot_info_laboral: true,
        },
      });

      if (!findEmployee) {
        return res.status(404).json({
          success: false,
          message: "Empleado no encontrado",
        });
      } else {
        await prisma.mom_trabajador.update({
          where: {
            trabajador_id: employeeId,
          },
          data: basicInfoData,
        });
      }

      const labor = findEmployee.mot_info_laboral[0];

      if (!labor) {
        const laborInfoCreateData = {
          ...laborInfoData,
          created_at: new Date(),
          created_by: userId,
        };
        await prisma.mot_info_laboral.create({
          data: laborInfoCreateData,
        });
      } else {
        const laborInfoUpdateData = {
          ...laborInfoData,
          updated_at: new Date(),
          updated_by: userId,
        };
        await prisma.mot_info_laboral.update({
          where: {
            info_laboral_id: labor.info_laboral_id,
          },
          data: laborInfoUpdateData,
        });
      }

      res.json({
        success: true,
        message: "Empleado actualizado",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error en el sistema",
      });
    }
  },
);

const toNumber = (value: any) =>
  value != null && value != undefined ? Number(value) : "";

const toDecimal = (value: number) =>
  value != null && value != undefined ? new Decimal(value) : 0.0;

export default router;
