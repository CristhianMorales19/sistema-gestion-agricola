import { Router, Request, Response } from 'express';
import {
  checkJwt,
  agroManoAuthMiddleware,
  requirePermiso,
  requireAdmin
} from '../features/authentication/infrastructure/middleware/agromano-auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

/**
 * GET /api/usuarios/health
 * Endpoint de salud - no requiere autenticación
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de usuarios funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================
// Todas las rutas después de este punto requieren autenticación
router.use(checkJwt);
router.use(agroManoAuthMiddleware);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

/**
 * GET /api/usuarios/perfil
 * Obtener perfil del usuario autenticado
 */
router.get('/perfil', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    res.json({
      success: true,
      data: {
        // Datos de Auth0
        auth0_id: user.auth0_id,
        auth0_email: user.auth0_email,
        email_verified: user.auth0_email_verified,

        // Datos del sistema
        usuario_id: user.usuario_id,
        username: user.username,
        email: user.email,
        
        // Rol y permisos
        rol: {
          id: user.rol_id,
          codigo: user.rol_codigo,
          nombre: user.rol_nombre
        },
        permisos: user.permisos,

        // Datos del trabajador (si existe)
        trabajador: user.trabajador,

        // Estado
        estado: user.estado,
        last_login: new Date()
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error obteniendo perfil de usuario'
    });
  }
});

/**
 * GET /api/usuarios/mis-permisos
 * Listar permisos del usuario autenticado
 */
router.get('/mis-permisos', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Obtener detalles completos de los permisos
    const permisosDetallados = await prisma.mom_permiso.findMany({
      where: {
        codigo: {
          in: user.permisos
        }
      },
      select: {
        permiso_id: true,
        codigo: true,
        nombre: true,
        categoria: true,
        descripcion: true
      }
    });

    res.json({
      success: true,
      data: {
        usuario: {
          usuario_id: user.usuario_id,
          username: user.username,
          rol: user.rol_nombre
        },
        permisos: permisosDetallados,
        total: permisosDetallados.length
      }
    });
  } catch (error) {
    console.error('Error obteniendo permisos:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error obteniendo permisos'
    });
  }
});

/**
 * PUT /api/usuarios/perfil
 * Actualizar datos del perfil propio
 */
router.put('/perfil', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { telefono, nombre_completo } = req.body;

    // Si el usuario tiene un trabajador vinculado, actualizar sus datos
    if (user.trabajador_id) {
      await prisma.mom_trabajador.update({
        where: { trabajador_id: user.trabajador_id },
        data: {
          telefono,
          nombre_completo,
          updated_at: new Date(),
          updated_by: user.usuario_id
        }
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error actualizando perfil'
    });
  }
});

// ============================================
// RUTAS ADMINISTRATIVAS (requieren permisos específicos)
// ============================================

/**
 * GET /api/usuarios
 * Listar todos los usuarios (solo administradores)
 */
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, estado, rol_id } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: {
      estado?: string;
      rol_id?: number;
    } = {};
    if (estado) where.estado = String(estado);
    if (rol_id) where.rol_id = Number(rol_id);

    const [usuarios, total] = await Promise.all([
      prisma.mot_usuario.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          mom_rol: {
            select: {
              rol_id: true,
              codigo: true,
              nombre: true
            }
          },
          mom_trabajador: {
            select: {
              trabajador_id: true,
              documento_identidad: true,
              nombre_completo: true,
              email: true,
              telefono: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      }),
      prisma.mot_usuario.count({ where })
    ]);

    res.json({
      success: true,
      data: usuarios,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error listando usuarios'
    });
  }
});

/**
 * GET /api/usuarios/:id
 * Obtener detalles de un usuario específico (solo administradores)
 */
router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.mot_usuario.findUnique({
      where: { usuario_id: Number(id) },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              include: {
                mom_permiso: true
              }
            }
          }
        },
        mom_trabajador: true
      }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error obteniendo usuario'
    });
  }
});

/**
 * PUT /api/usuarios/:id/rol
 * Cambiar rol de un usuario (solo administradores)
 */
router.put('/:id/rol', requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { rol_id } = req.body;

    if (!rol_id) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'El campo rol_id es requerido'
      });
    }

    // Verificar que el rol existe
    const rol = await prisma.mom_rol.findUnique({
      where: { rol_id: Number(rol_id) }
    });

    if (!rol) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Rol no encontrado'
      });
    }

    const usuarioAntes = await prisma.mot_usuario.findUnique({
      where: { usuario_id: Number(id) }
    });

    // Actualizar rol
    await prisma.mot_usuario.update({
      where: { usuario_id: Number(id) },
      data: {
        rol_id: Number(rol_id),
        fecha_ultimo_cambio_rol_at: new Date(),
        updated_at: new Date(),
        updated_by: user.usuario_id
      }
    });

    // Registrar en auditoría
    await prisma.mol_audit_log.create({
      data: {
        entidad: 'mot_usuario',
        entidad_id: Number(id),
        accion: 'CAMBIO_ROL',
        datos_antes: JSON.stringify({
          rol_id: usuarioAntes?.rol_id
        }),
        datos_despues: JSON.stringify({
          rol_id: Number(rol_id)
        }),
        usuario_id: user.usuario_id,
        fecha_at: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Rol actualizado correctamente',
      data: {
        usuario_id: Number(id),
        nuevo_rol: rol.nombre
      }
    });
  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error actualizando rol'
    });
  }
});

/**
 * PUT /api/usuarios/:id/estado
 * Activar/desactivar un usuario (solo administradores)
 */
router.put('/:id/estado', requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { estado } = req.body;

    if (!['activo', 'inactivo', 'ACTIVO', 'INACTIVO'].includes(estado)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Estado inválido. Debe ser: activo o inactivo'
      });
    }

    await prisma.mot_usuario.update({
      where: { usuario_id: Number(id) },
      data: {
        estado,
        updated_at: new Date(),
        updated_by: user.usuario_id
      }
    });

    // Registrar en auditoría
    await prisma.mol_audit_log.create({
      data: {
        entidad: 'mot_usuario',
        entidad_id: Number(id),
        accion: 'CAMBIO_ESTADO',
        datos_despues: JSON.stringify({ estado }),
        usuario_id: user.usuario_id,
        fecha_at: new Date()
      }
    });

    res.json({
      success: true,
      message: `Usuario ${estado} correctamente`
    });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error actualizando estado'
    });
  }
});

/**
 * GET /api/usuarios/estadisticas/resumen
 * Estadísticas generales de usuarios (solo administradores)
 */
router.get('/estadisticas/resumen', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [
      totalUsuarios,
      usuariosActivos,
      usuariosInactivos,
      porRol
    ] = await Promise.all([
      prisma.mot_usuario.count(),
      prisma.mot_usuario.count({
        where: { estado: { in: ['activo', 'ACTIVO'] } }
      }),
      prisma.mot_usuario.count({
        where: { estado: { in: ['inactivo', 'INACTIVO'] } }
      }),
      prisma.mom_rol.findMany({
        include: {
          _count: {
            select: { mot_usuario: true }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        total: totalUsuarios,
        activos: usuariosActivos,
        inactivos: usuariosInactivos,
        por_rol: porRol.map(rol => ({
          rol_id: rol.rol_id,
          nombre: rol.nombre,
          codigo: rol.codigo,
          cantidad: rol._count.mot_usuario
        }))
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error obteniendo estadísticas'
    });
  }
});

export default router;
