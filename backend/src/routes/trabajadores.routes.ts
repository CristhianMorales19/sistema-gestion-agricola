import { Router, Request, Response } from "express";
import {
  checkJwt,
  agroManoAuthMiddleware,
  requireAdmin,
} from "../middleware/agromano-auth.middleware";
import { PrismaClient } from "@prisma/client";
import { AgroManoUserSyncService } from "../services/agromano-user-sync.service";

const router = Router();
const prisma = new PrismaClient();

// Autenticación requerida para todas las rutas
router.use(checkJwt);
router.use(agroManoAuthMiddleware);

/**
 * POST /api/trabajadores
 * Crear nuevo trabajador (sin usuario del sistema)
 * Solo guarda en mom_trabajador
 */
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const {
      documento_identidad,
      nombre_completo,
      fecha_nacimiento,
      telefono,
      email,
    } = req.body;

    // Validaciones
    if (!documento_identidad || !nombre_completo || !fecha_nacimiento) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message:
          "Campos requeridos: documento_identidad, nombre_completo, fecha_nacimiento",
      });
    }

    // Verificar que no exista
    const existente = await prisma.mom_trabajador.findUnique({
      where: { documento_identidad },
    });

    if (existente) {
      return res.status(409).json({
        success: false,
        error: "DUPLICATE",
        message: "Ya existe un trabajador con ese documento de identidad",
      });
    }

    // Crear trabajador (SIN USUARIO aún)
    const trabajador = await prisma.mom_trabajador.create({
      data: {
        documento_identidad,
        nombre_completo,
        fecha_nacimiento: new Date(fecha_nacimiento),
        telefono: telefono || null,
        email: email || null,
        is_activo: true,
        fecha_registro_at: new Date(),
        created_at: new Date(),
        created_by: user.usuario_id,
      },
    });

    // Registrar en historial
    await prisma.moh_trabajador_historial.create({
      data: {
        trabajador_id: trabajador.trabajador_id,
        cambio_tipo: "CREACION",
        datos_nuevos: JSON.stringify({
          documento_identidad,
          nombre_completo,
          email,
        }),
        usuario_accion: user.usuario_id,
        fecha_accion_at: new Date(),
        created_at: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Trabajador creado exitosamente (sin acceso al sistema)",
      data: {
        trabajador_id: trabajador.trabajador_id,
        documento_identidad: trabajador.documento_identidad,
        nombre_completo: trabajador.nombre_completo,
        email: trabajador.email,
        tiene_usuario: false,
        nota: "El trabajador puede registrarse en Auth0 cuando necesite acceso al sistema",
      },
    });
  } catch (error) {
    console.error("Error creando trabajador:", error);
    res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Error creando trabajador",
    });
  }
});

/**
 * POST /api/trabajadores/:id/crear-usuario-auth0
 * Invitar trabajador a crear cuenta en Auth0
 *
 * FLUJO:
 * 1. Verificas que el trabajador NO tenga usuario
 * 2. Invitas al trabajador (email) a registrarse en Auth0
 * 3. Trabajador crea cuenta en Auth0
 * 4. Trabajador hace login por primera vez
 * 5. agroManoAuthMiddleware crea usuario en mot_usuario automáticamente
 * 6. Tú vinculas ese usuario con el trabajador
 */
router.post(
  "/:id/invitar-auth0",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { rol_id } = req.body;

      // Obtener trabajador
      const trabajador = await prisma.mom_trabajador.findUnique({
        where: { trabajador_id: Number(id) },
        include: {
          mot_usuario: true,
        },
      });

      if (!trabajador) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Trabajador no encontrado",
        });
      }

      // Verificar si ya tiene usuario
      if (trabajador.mot_usuario && trabajador.mot_usuario.length > 0) {
        return res.status(409).json({
          success: false,
          error: "ALREADY_HAS_USER",
          message: "El trabajador ya tiene un usuario del sistema",
        });
      }

      if (!trabajador.email) {
        return res.status(400).json({
          success: false,
          error: "NO_EMAIL",
          message: "El trabajador no tiene email registrado",
        });
      }

      // Aquí puedes usar la API de Auth0 para enviar invitación
      // Por ahora, solo devolvemos instrucciones

      res.json({
        success: true,
        message: "Invitación lista para enviar",
        data: {
          trabajador_id: trabajador.trabajador_id,
          nombre: trabajador.nombre_completo,
          email: trabajador.email,
          instrucciones: [
            "1. Envía al trabajador el link de tu aplicación",
            '2. El trabajador hace clic en "Registrarse"',
            "3. Auth0 le permite crear su cuenta",
            "4. Al hacer login por primera vez, se crea automáticamente en mot_usuario",
            "5. Luego vinculas ese usuario con este trabajador usando: PUT /api/trabajadores/:id/vincular-usuario",
          ],
          link_registro: `${process.env.FRONTEND_URL}/register`,
          rol_sugerido: rol_id || "EMPLEADO_CAMPO",
        },
      });
    } catch (error) {
      console.error("Error invitando trabajador:", error);
      res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Error procesando invitación",
      });
    }
  },
);

/**
 * PUT /api/trabajadores/:id/vincular-usuario
 * Vincular un trabajador con un usuario existente de mot_usuario
 *
 * Usar cuando:
 * - El trabajador YA se registró en Auth0
 * - YA existe en mot_usuario (se creó automáticamente en primer login)
 * - Quieres vincularlo con el trabajador en mom_trabajador
 */
router.put(
  "/:id/vincular-usuario",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { usuario_id, auth0_email } = req.body;

      // Obtener trabajador
      const trabajador = await prisma.mom_trabajador.findUnique({
        where: { trabajador_id: Number(id) },
      });

      if (!trabajador) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Trabajador no encontrado",
        });
      }

      // Buscar usuario (por ID o por email de Auth0)
      let usuarioAVincular;
      if (usuario_id) {
        usuarioAVincular = await prisma.mot_usuario.findUnique({
          where: { usuario_id: Number(usuario_id) },
        });
      } else if (auth0_email) {
        usuarioAVincular = await prisma.mot_usuario.findFirst({
          where: { email: auth0_email },
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Proporciona usuario_id o auth0_email",
        });
      }

      if (!usuarioAVincular) {
        return res.status(404).json({
          success: false,
          error: "USER_NOT_FOUND",
          message:
            "Usuario no encontrado. Asegúrate de que el trabajador ya se registró en Auth0 e hizo login al menos una vez.",
        });
      }

      // Verificar que el usuario no esté vinculado a otro trabajador
      if (
        usuarioAVincular.trabajador_id &&
        usuarioAVincular.trabajador_id !== Number(id)
      ) {
        return res.status(409).json({
          success: false,
          error: "USER_ALREADY_LINKED",
          message: "Este usuario ya está vinculado a otro trabajador",
        });
      }

      // Vincular
      await prisma.mot_usuario.update({
        where: { usuario_id: usuarioAVincular.usuario_id },
        data: {
          trabajador_id: Number(id),
          updated_at: new Date(),
          updated_by: user.usuario_id,
        },
      });

      // Registrar en historial
      await prisma.moh_trabajador_historial.create({
        data: {
          trabajador_id: Number(id),
          cambio_tipo: "VINCULACION_USUARIO",
          datos_nuevos: JSON.stringify({
            usuario_id: usuarioAVincular.usuario_id,
            auth0_id: usuarioAVincular.auth0_id,
            email: usuarioAVincular.email,
          }),
          usuario_accion: user.usuario_id,
          fecha_accion_at: new Date(),
          created_at: new Date(),
        },
      });

      res.json({
        success: true,
        message: "Trabajador vinculado exitosamente con usuario",
        data: {
          trabajador_id: Number(id),
          usuario_id: usuarioAVincular.usuario_id,
          username: usuarioAVincular.username,
          email: usuarioAVincular.email,
        },
      });
    } catch (error) {
      console.error("Error vinculando usuario:", error);
      res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Error vinculando usuario",
      });
    }
  },
);

/**
 * GET /api/trabajadores
 * Listar trabajadores con información de usuario
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, tiene_usuario } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: {
      is_activo: boolean;
      mot_usuario?: { some?: object; none?: object };
    } = { is_activo: true };

    // Filtrar por si tiene usuario o no
    if (tiene_usuario === "true") {
      where.mot_usuario = { some: {} };
    } else if (tiene_usuario === "false") {
      where.mot_usuario = { none: {} };
    }

    const [trabajadores, total] = await Promise.all([
      prisma.mom_trabajador.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          mot_usuario: {
            include: {
              mom_rol: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.mom_trabajador.count({ where }),
    ]);

    res.json({
      success: true,
      data: trabajadores.map((t) => ({
        trabajador_id: t.trabajador_id,
        documento_identidad: t.documento_identidad,
        nombre_completo: t.nombre_completo,
        email: t.email,
        telefono: t.telefono,
        tiene_usuario: t.mot_usuario && t.mot_usuario.length > 0,
        usuario:
          t.mot_usuario && t.mot_usuario.length > 0
            ? {
                usuario_id: t.mot_usuario[0].usuario_id,
                username: t.mot_usuario[0].username,
                rol: t.mot_usuario[0].mom_rol?.nombre,
                estado: t.mot_usuario[0].estado,
              }
            : null,
      })),
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error listando trabajadores:", error);
    res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Error listando trabajadores",
    });
  }
});

export default router;
