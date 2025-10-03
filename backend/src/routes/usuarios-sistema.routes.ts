import { Router, Request, Response } from "express";
import {
  checkJwt,
  agroManoAuthMiddleware,
  requireAdmin,
} from "../middleware/agromano-auth.middleware";
import { PrismaClient } from "@prisma/client";
import { Auth0ManagementService } from "../services/auth0-management.service";

const router = Router();
const prisma = new PrismaClient();

// Tipos extendidos para Request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: {
    usuario_id?: number;
    sub?: string;
    email?: string;
    permissions?: string[];
    dbUser?: unknown;
  };
}

// Tipos para resultados de consultas SQL
type RawSQLResult = Record<string, unknown>;

type UsuarioConRol = {
  usuario_id: number;
  auth0_id: string | null;
  auth0_user_id: string | null;
  username: string;
  email: string | null;
  estado: string;
  auth_provider: string | null;
  email_verified: boolean | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
  rol_id: number;
  rol_codigo: string;
  rol_nombre: string;
  rol_descripcion: string | null;
  trabajador_id: number | null;
  nombre_completo: string | null;
  documento_identidad: string | null;
  telefono: string | null;
  trabajador_email: string | null;
};

type PermisoData = {
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
};

// Helper para consultas SQL directas (para MySQL 5.5 compatibility)
async function executeRawSQL(
  query: string,
  params: unknown[] = [],
): Promise<RawSQLResult[]> {
  try {
    const result = await prisma.$queryRawUnsafe(query, ...params);
    return result as RawSQLResult[];
  } catch (error) {
    console.error("❌ [SQL] Error ejecutando consulta:", error);
    throw error;
  }
}

// Autenticación requerida
router.use(checkJwt);
router.use(agroManoAuthMiddleware);

/**
 * GET /api/usuarios-sistema
 * Listar todos los usuarios del sistema con sus roles locales
 */
router.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    console.log("📋 [USUARIOS-SISTEMA] Obteniendo lista de usuarios...");

    // Usar SQL directo para obtener usuarios con los campos migrados
    const usuarios = await executeRawSQL(`
      SELECT 
        u.usuario_id,
        u.auth0_id,
        u.auth0_user_id,
        u.username,
        u.email,
        u.estado,
        u.auth_provider,
        u.email_verified,
        u.last_login_at,
        u.created_at,
        u.updated_at,
        r.rol_id,
        r.codigo as rol_codigo,
        r.nombre as rol_nombre,
        r.descripcion as rol_descripcion,
        t.trabajador_id,
        t.nombre_completo,
        t.documento_identidad,
        t.telefono,
        t.email as trabajador_email
      FROM mot_usuario u
      LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
      LEFT JOIN mom_trabajador t ON u.trabajador_id = t.trabajador_id
      WHERE u.deleted_at IS NULL
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      data: (usuarios as UsuarioConRol[]).map((u) => ({
        usuario_id: u.usuario_id,
        auth0_id: u.auth0_id,
        auth0_user_id: u.auth0_user_id,
        username: u.username,
        email: u.email,
        estado: u.estado,
        auth_provider: u.auth_provider,
        email_verified: u.email_verified,
        last_login_at: u.last_login_at,

        // ROL DEL SISTEMA (tu BD remota)
        rol: {
          rol_id: u.rol_id,
          codigo: u.rol_codigo,
          nombre: u.rol_nombre,
          descripcion: u.rol_descripcion,
        },

        // DATOS DEL TRABAJADOR (si está asociado)
        trabajador: u.trabajador_id
          ? {
              trabajador_id: u.trabajador_id,
              nombre_completo: u.nombre_completo,
              documento_identidad: u.documento_identidad,
              telefono: u.telefono,
              email: u.trabajador_email,
            }
          : null,

        // FECHAS DEL SISTEMA
        created_at: u.created_at,
        updated_at: u.updated_at,
      })),
    });
  } catch (error) {
    console.error("❌ [USUARIOS-SISTEMA] Error al obtener usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

/**
 * GET /api/usuarios-sistema/roles-disponibles
 * Obtener lista de roles disponibles en el sistema
 * (de la tabla mom_rol, NO de Auth0)
 */
router.get(
  "/roles-disponibles",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const roles = await prisma.mom_rol.findMany({
        where: {
          is_activo: true,
        },
        include: {
          rel_mom_rol__mom_permiso: {
            include: {
              mom_permiso: {
                select: {
                  permiso_id: true,
                  codigo: true,
                  nombre: true,
                  categoria: true,
                },
              },
            },
          },
          _count: {
            select: {
              mot_usuario: true, // Contar usuarios con este rol
            },
          },
        },
        orderBy: {
          nombre: "asc",
        },
      });

      res.json({
        success: true,
        data: roles.map((r) => ({
          rol_id: r.rol_id,
          codigo: r.codigo,
          nombre: r.nombre,
          descripcion: r.descripcion,
          is_critico: r.is_critico,
          usuarios_asignados: r._count.mot_usuario,
          permisos: r.rel_mom_rol__mom_permiso.map((rp) => ({
            codigo: rp.mom_permiso.codigo,
            nombre: rp.mom_permiso.nombre,
            categoria: rp.mom_permiso.categoria,
          })),
        })),
      });
    } catch (error) {
      console.error("Error obteniendo roles:", error);
      res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Error obteniendo roles disponibles",
      });
    }
  },
);

/**
 * PUT /api/usuarios-sistema/:id/asignar-rol
 * Asignar rol a un usuario
 * (Actualiza mot_usuario.rol_id en BD remota)
 */
router.put(
  "/:id/asignar-rol",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const userAdmin = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      const { rol_id } = req.body;

      if (!userAdmin?.usuario_id) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      if (!rol_id) {
        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "El campo rol_id es requerido",
        });
      }

      // Verificar que el usuario existe
      const usuario = await prisma.mot_usuario.findUnique({
        where: { usuario_id: Number(id) },
        include: {
          mom_rol: true,
        },
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Usuario no encontrado",
        });
      }

      // Verificar que el rol existe
      const rol = await prisma.mom_rol.findUnique({
        where: { rol_id: Number(rol_id) },
      });

      if (!rol) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Rol no encontrado",
        });
      }

      // Actualizar rol del usuario
      await prisma.mot_usuario.update({
        where: { usuario_id: Number(id) },
        data: {
          rol_id: Number(rol_id),
          fecha_ultimo_cambio_rol_at: new Date(),
          updated_at: new Date(),
          updated_by: userAdmin.usuario_id,
        },
      });

      // Registrar en auditoría
      await prisma.mol_audit_log.create({
        data: {
          entidad: "mot_usuario",
          entidad_id: Number(id),
          accion: "CAMBIO_ROL",
          datos_antes: JSON.stringify({
            rol_id: usuario.rol_id,
            rol_nombre: usuario.mom_rol.nombre,
          }),
          datos_despues: JSON.stringify({
            rol_id: Number(rol_id),
            rol_nombre: rol.nombre,
          }),
          usuario_id: userAdmin.usuario_id,
          fecha_at: new Date(),
          ip_origen: req.ip || null,
        },
      });

      res.json({
        success: true,
        message: `Rol actualizado a: ${rol.nombre}`,
        data: {
          usuario_id: Number(id),
          username: usuario.username,
          rol_anterior: usuario.mom_rol.nombre,
          rol_nuevo: rol.nombre,
        },
      });
    } catch (error) {
      console.error("Error asignando rol:", error);
      res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Error asignando rol al usuario",
      });
    }
  },
);

/**
 * PUT /api/usuarios-sistema/:id/cambiar-estado
 * Activar/desactivar un usuario
 */
router.put(
  "/:id/cambiar-estado",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const userAdmin = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      const { estado } = req.body;

      if (!userAdmin?.usuario_id) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
      }

      if (!["activo", "inactivo", "ACTIVO", "INACTIVO"].includes(estado)) {
        return res.status(400).json({
          success: false,
          error: "VALIDATION_ERROR",
          message: "Estado inválido. Valores permitidos: activo, inactivo",
        });
      }

      const usuario = await prisma.mot_usuario.findUnique({
        where: { usuario_id: Number(id) },
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Usuario no encontrado",
        });
      }

      await prisma.mot_usuario.update({
        where: { usuario_id: Number(id) },
        data: {
          estado,
          updated_at: new Date(),
          updated_by: userAdmin.usuario_id,
        },
      });

      // Registrar en auditoría
      await prisma.mol_audit_log.create({
        data: {
          entidad: "mot_usuario",
          entidad_id: Number(id),
          accion: "CAMBIO_ESTADO",
          datos_antes: JSON.stringify({ estado: usuario.estado }),
          datos_despues: JSON.stringify({ estado }),
          usuario_id: userAdmin.usuario_id,
          fecha_at: new Date(),
          ip_origen: req.ip || null,
        },
      });

      res.json({
        success: true,
        message: `Usuario ${estado === "activo" || estado === "ACTIVO" ? "activado" : "desactivado"} correctamente`,
      });
    } catch (error) {
      console.error("Error cambiando estado:", error);
      res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Error cambiando estado del usuario",
      });
    }
  },
);

/**
 * POST /api/usuarios-sistema/sincronizar-auth0
 * Sincronizar todos los usuarios de Auth0 con la BD local
 * (Ejecutar manualmente cuando sea necesario)
 */
router.post(
  "/sincronizar-auth0",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      // Este endpoint sería útil si necesitas sincronizar masivamente
      // Por ahora, la sincronización es automática en cada login

      res.json({
        success: true,
        message:
          "La sincronización ocurre automáticamente cuando cada usuario hace login",
        nota: "No es necesario sincronizar manualmente",
      });
    } catch (error) {
      console.error("Error en sincronización:", error);
      res.status(500).json({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Error en sincronización",
      });
    }
  },
);

/**
 * GET /api/usuarios-sistema/:id
 * Obtener detalles completos de un usuario
 */
router.get("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Usar SQL directo para obtener usuario completo
    const [usuario] = await executeRawSQL(
      `
      SELECT 
        u.usuario_id,
        u.auth0_id,
        u.auth0_user_id,
        u.username,
        u.email,
        u.estado,
        u.auth_provider,
        u.email_verified,
        u.last_login_at,
        u.created_at,
        u.updated_at,
        r.rol_id,
        r.codigo as rol_codigo,
        r.nombre as rol_nombre,
        r.descripcion as rol_descripcion,
        r.is_critico,
        t.trabajador_id,
        t.nombre_completo,
        t.documento_identidad,
        t.telefono,
        t.email as trabajador_email
      FROM mot_usuario u
      LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
      LEFT JOIN mom_trabajador t ON u.trabajador_id = t.trabajador_id
      WHERE u.usuario_id = ? AND u.deleted_at IS NULL
      LIMIT 1
    `,
      [Number(id)],
    );

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    // Obtener permisos del rol
    const permisos = await executeRawSQL(
      `
      SELECT 
        p.codigo,
        p.nombre,
        p.categoria,
        p.descripcion
      FROM rel_mom_rol__mom_permiso rp
      INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
      WHERE rp.rol_id = ? AND rp.deleted_at IS NULL
    `,
      [usuario.rol_id],
    );

    res.json({
      success: true,
      data: {
        usuario_id: usuario.usuario_id,
        auth0_id: usuario.auth0_id,
        username: usuario.username,
        email: usuario.email,
        estado: usuario.estado,
        auth_provider: usuario.auth_provider,
        email_verified: usuario.email_verified,
        last_login_at: usuario.last_login_at,

        rol: {
          rol_id: usuario.rol_id,
          codigo: usuario.rol_codigo,
          nombre: usuario.rol_nombre,
          descripcion: usuario.rol_descripcion,
          is_critico: usuario.is_critico,
        },

        permisos: (permisos as PermisoData[]).map((p) => ({
          codigo: p.codigo,
          nombre: p.nombre,
          categoria: p.categoria,
          descripcion: p.descripcion,
        })),

        trabajador: usuario.trabajador_id
          ? {
              trabajador_id: usuario.trabajador_id,
              nombre_completo: usuario.nombre_completo,
              documento_identidad: usuario.documento_identidad,
              telefono: usuario.telefono,
              email: usuario.trabajador_email,
            }
          : null,

        created_at: usuario.created_at,
        updated_at: usuario.updated_at,
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Error obteniendo detalles del usuario",
    });
  }
});

/**
 * POST /api/usuarios-sistema/crear-hibrido
 * Crear usuario híbrido: en Auth0 + BD remota simultáneamente
 */
router.post(
  "/crear-hibrido",
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { email, nombre, password, rol_id } = req.body;

      console.log("🔵 [CREAR-HIBRIDO] Iniciando creación de usuario híbrido:", {
        email,
        nombre,
        rol_id,
      });

      if (!email || !nombre || !password || !rol_id) {
        return res.status(400).json({
          success: false,
          message: "Email, nombre, password y rol_id son requeridos",
        });
      }

      // Verificar que el email no existe (usando SQL directo)
      const existing = await executeRawSQL(
        "SELECT usuario_id FROM mot_usuario WHERE (email = ? OR username = ?) AND deleted_at IS NULL LIMIT 1",
        [email, email],
      );

      if (existing.length > 0) {
        console.log("⚠️ [CREAR-HIBRIDO] Usuario ya existe en BD:", email);
        return res.status(400).json({
          success: false,
          message: "Ya existe un usuario con este email",
        });
      }

      // Crear en Auth0
      console.log("📤 [CREAR-HIBRIDO] Creando usuario en Auth0...");
      const auth0Service = new Auth0ManagementService();
      const auth0User = await auth0Service.createUser({
        email,
        name: nombre,
        password,
        connection: "Username-Password-Authentication",
      });
      console.log(
        "✅ [CREAR-HIBRIDO] Usuario creado en Auth0:",
        auth0User.user_id,
      );

      console.log(
        "✅ [CREAR-HIBRIDO] Usuario creado en Auth0:",
        auth0User.user_id,
      );

      // Crear en BD remota usando SQL directo
      console.log("📤 [CREAR-HIBRIDO] Creando usuario en BD remota...");
      const adminUserId = (req as AuthenticatedRequest).user?.usuario_id || 1;
      const username = email.split("@")[0];

      await executeRawSQL(
        `
      INSERT INTO mot_usuario (
        username, 
        email, 
        password_hash, 
        rol_id, 
        estado,
        auth0_id,
        auth0_user_id,
        auth_provider,
        email_verified,
        created_at,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `,
        [
          username,
          email,
          "AUTH0_MANAGED",
          Number(rol_id),
          "activo",
          auth0User.user_id,
          auth0User.user_id,
          "auth0",
          auth0User.email_verified ? 1 : 0,
          adminUserId,
        ],
      );

      console.log("✅ [CREAR-HIBRIDO] Usuario creado en BD remota");

      // Obtener el usuario recién creado con su rol
      const [newUser] = await executeRawSQL(
        `
      SELECT 
        u.usuario_id,
        u.auth0_id,
        u.email,
        u.username,
        u.estado,
        r.codigo as rol_codigo,
        r.nombre as rol_nombre
      FROM mot_usuario u
      LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
      WHERE u.email = ?
      LIMIT 1
    `,
        [email],
      );

      console.log("✅ [CREAR-HIBRIDO] Usuario creado exitosamente:", newUser);

      res.status(201).json({
        success: true,
        message: "Usuario híbrido creado exitosamente",
        data: {
          usuario_id: newUser.usuario_id,
          auth0_id: newUser.auth0_id,
          email: newUser.email,
          username: newUser.username,
          estado: newUser.estado,
          rol: {
            codigo: newUser.rol_codigo,
            nombre: newUser.rol_nombre,
          },
        },
      });
    } catch (error) {
      console.error("❌ [CREAR-HIBRIDO] Error al crear usuario:", error);
      const err = error as Error & { statusCode?: number; data?: unknown };
      console.error("❌ [CREAR-HIBRIDO] Stack:", err.stack);
      console.error("❌ [CREAR-HIBRIDO] Detalles:", {
        message: err.message,
        statusCode: err.statusCode,
        data: err.data,
      });

      res.status(500).json({
        success: false,
        error: "CREATION_FAILED",
        message: err.message || "Error al crear usuario híbrido",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
);

export default router;
