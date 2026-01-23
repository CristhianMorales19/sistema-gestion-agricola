import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

/**
 * Esquema de validación para crear ausencia
 */
const createAusenciaSchema = z.object({
  trabajador_id: z.number().int().positive(),
  fecha_ausencia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  motivo: z.string().min(1),
  motivo_personalizado: z.string().optional(),
  comentarios: z.string().optional(),
});

/**
 * Esquema de validación para actualizar ausencia
 */
const updateAusenciaSchema = z.object({
  fecha_ausencia: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  motivo: z.string().min(1).optional(),
  motivo_personalizado: z.string().optional(),
  comentarios: z.string().optional(),
  estado_aprobacion: z.enum(["pendiente", "aprobada", "rechazada"]).optional(),
});

/**
 * Controlador para gestión de ausencias justificadas
 */
export class AusenciasController {
  /**
   * Obtener todas las ausencias con filtros opcionales
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        trabajador_id,
        fecha_inicio,
        fecha_fin,
        estado,
        motivo,
        page = "1",
        limit = "10",
      } = req.query;

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;

      // Construir filtros dinámicos
      const where: any = {
        deleted_at: null,
      };

      if (trabajador_id) {
        where.trabajador_id = parseInt(trabajador_id as string);
      }

      if (fecha_inicio || fecha_fin) {
        where.fecha_at = {};
        if (fecha_inicio) {
          where.fecha_at.gte = new Date(fecha_inicio as string);
        }
        if (fecha_fin) {
          where.fecha_at.lte = new Date(fecha_fin as string);
        }
      }

      if (estado) {
        where.estado_aprobacion = estado;
      }

      if (motivo) {
        where.motivo = {
          contains: motivo as string,
        };
      }

      // Obtener ausencias con información del trabajador
      const [ausencias, total] = await Promise.all([
        prisma.mot_ausencia_justificada.findMany({
          where,
          skip,
          take: limitNumber,
          orderBy: {
            fecha_at: "desc",
          },
          include: {
            mom_trabajador: {
              select: {
                trabajador_id: true,
                documento_identidad: true,
                nombre_completo: true,
                email: true,
              },
            },
          },
        }),
        prisma.mot_ausencia_justificada.count({ where }),
      ]);

      // Mapear resultados al formato esperado
      const ausenciasFormateadas = ausencias.map((ausencia) => ({
        id: ausencia.ausencia_id,
        ausencia_id: ausencia.ausencia_id,
        trabajador_id: ausencia.trabajador_id,
        trabajador_nombre: ausencia.mom_trabajador.nombre_completo,
        trabajador_documento: ausencia.mom_trabajador.documento_identidad,
        fecha_ausencia: ausencia.fecha_at.toISOString().split("T")[0],
        motivo: ausencia.motivo,
        motivo_personalizado: ausencia.tipo_ausencia,
        documentacion_respaldo: ausencia.documento_respaldo_path,
        estado: ausencia.estado_aprobacion,
        comentarios: null,
        fecha_registro: ausencia.created_at,
        created_at: ausencia.created_at,
        updated_at: ausencia.updated_at,
      }));

      res.json({
        success: true,
        data: {
          ausencias: ausenciasFormateadas,
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      });
    } catch (error: any) {
      console.error("Error al obtener ausencias:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener las ausencias",
        error: error.message,
      });
    }
  }

  /**
   * Obtener una ausencia por ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const ausencia = await prisma.mot_ausencia_justificada.findFirst({
        where: {
          ausencia_id: parseInt(id),
          deleted_at: null,
        },
        include: {
          mom_trabajador: {
            select: {
              trabajador_id: true,
              documento_identidad: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
      });

      if (!ausencia) {
        res.status(404).json({
          success: false,
          message: "Ausencia no encontrada",
        });
        return;
      }

      const ausenciaFormateada = {
        id: ausencia.ausencia_id,
        ausencia_id: ausencia.ausencia_id,
        trabajador_id: ausencia.trabajador_id,
        trabajador_nombre: ausencia.mom_trabajador.nombre_completo,
        trabajador_documento: ausencia.mom_trabajador.documento_identidad,
        fecha_ausencia: ausencia.fecha_at.toISOString().split("T")[0],
        motivo: ausencia.motivo,
        motivo_personalizado: ausencia.tipo_ausencia,
        documentacion_respaldo: ausencia.documento_respaldo_path,
        estado: ausencia.estado_aprobacion,
        fecha_registro: ausencia.created_at,
        created_at: ausencia.created_at,
        updated_at: ausencia.updated_at,
      };

      res.json({
        success: true,
        data: {
          ausencia: ausenciaFormateada,
        },
      });
    } catch (error: any) {
      console.error("Error al obtener ausencia:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener la ausencia",
        error: error.message,
      });
    }
  }

  /**
   * Crear nueva ausencia justificada
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // Validar datos de entrada
      const validatedData = createAusenciaSchema.parse(req.body);

      // Verificar que el trabajador existe
      const trabajador = await prisma.mom_trabajador.findFirst({
        where: {
          trabajador_id: validatedData.trabajador_id,
          deleted_at: null,
          is_activo: true,
        },
      });

      if (!trabajador) {
        res.status(404).json({
          success: false,
          message: "Trabajador no encontrado o inactivo",
        });
        return;
      }

      // Verificar si ya existe una ausencia para esa fecha
      const ausenciaExistente = await prisma.mot_ausencia_justificada.findFirst(
        {
          where: {
            trabajador_id: validatedData.trabajador_id,
            fecha_at: new Date(validatedData.fecha_ausencia),
            deleted_at: null,
          },
        },
      );

      if (ausenciaExistente) {
        res.status(400).json({
          success: false,
          message: "Ya existe una ausencia registrada para esta fecha",
        });
        return;
      }

      // Obtener el ID del usuario desde el contexto (Auth0)
      const userId = (req as any).user?.usuario_id || 1; // Fallback a 1 si no hay usuario

      // Crear la ausencia
      const nuevaAusencia = await prisma.mot_ausencia_justificada.create({
        data: {
          trabajador_id: validatedData.trabajador_id,
          fecha_at: new Date(validatedData.fecha_ausencia),
          motivo: validatedData.motivo,
          tipo_ausencia: validatedData.motivo_personalizado || null,
          documento_respaldo_path: null,
          estado_aprobacion: "pendiente",
          usuario_registro: userId,
          created_at: new Date(),
          created_by: userId,
          updated_at: null,
          updated_by: null,
          deleted_at: null,
        },
        include: {
          mom_trabajador: {
            select: {
              trabajador_id: true,
              documento_identidad: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
      });

      const ausenciaFormateada = {
        id: nuevaAusencia.ausencia_id,
        ausencia_id: nuevaAusencia.ausencia_id,
        trabajador_id: nuevaAusencia.trabajador_id,
        trabajador_nombre: nuevaAusencia.mom_trabajador.nombre_completo,
        trabajador_documento: nuevaAusencia.mom_trabajador.documento_identidad,
        fecha_ausencia: nuevaAusencia.fecha_at.toISOString().split("T")[0],
        motivo: nuevaAusencia.motivo,
        motivo_personalizado: nuevaAusencia.tipo_ausencia,
        documentacion_respaldo: nuevaAusencia.documento_respaldo_path,
        estado: nuevaAusencia.estado_aprobacion,
        fecha_registro: nuevaAusencia.created_at,
        created_at: nuevaAusencia.created_at,
        updated_at: nuevaAusencia.updated_at,
      };

      res.status(201).json({
        success: true,
        message: "Ausencia registrada exitosamente",
        data: {
          ausencia: ausenciaFormateada,
        },
      });
    } catch (error: any) {
      console.error("Error al crear ausencia:", error);

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error al registrar la ausencia",
        error: error.message,
      });
    }
  }

  /**
   * Actualizar ausencia
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateAusenciaSchema.parse(req.body);

      // Verificar que la ausencia existe
      const ausenciaExistente = await prisma.mot_ausencia_justificada.findFirst(
        {
          where: {
            ausencia_id: parseInt(id),
            deleted_at: null,
          },
        },
      );

      if (!ausenciaExistente) {
        res.status(404).json({
          success: false,
          message: "Ausencia no encontrada",
        });
        return;
      }

      const userId = (req as any).user?.usuario_id || 1;

      // Construir objeto de actualización
      const dataToUpdate: any = {
        updated_at: new Date(),
        updated_by: userId,
      };

      if (validatedData.fecha_ausencia) {
        dataToUpdate.fecha_at = new Date(validatedData.fecha_ausencia);
      }

      if (validatedData.motivo) {
        dataToUpdate.motivo = validatedData.motivo;
      }

      if (validatedData.motivo_personalizado !== undefined) {
        dataToUpdate.tipo_ausencia = validatedData.motivo_personalizado;
      }

      if (validatedData.estado_aprobacion) {
        dataToUpdate.estado_aprobacion = validatedData.estado_aprobacion;
      }

      // Actualizar ausencia
      const ausenciaActualizada = await prisma.mot_ausencia_justificada.update({
        where: {
          ausencia_id: parseInt(id),
        },
        data: dataToUpdate,
        include: {
          mom_trabajador: {
            select: {
              trabajador_id: true,
              documento_identidad: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
      });

      const ausenciaFormateada = {
        id: ausenciaActualizada.ausencia_id,
        ausencia_id: ausenciaActualizada.ausencia_id,
        trabajador_id: ausenciaActualizada.trabajador_id,
        trabajador_nombre: ausenciaActualizada.mom_trabajador.nombre_completo,
        trabajador_documento:
          ausenciaActualizada.mom_trabajador.documento_identidad,
        fecha_ausencia: ausenciaActualizada.fecha_at
          .toISOString()
          .split("T")[0],
        motivo: ausenciaActualizada.motivo,
        motivo_personalizado: ausenciaActualizada.tipo_ausencia,
        documentacion_respaldo: ausenciaActualizada.documento_respaldo_path,
        estado: ausenciaActualizada.estado_aprobacion,
        fecha_registro: ausenciaActualizada.created_at,
        created_at: ausenciaActualizada.created_at,
        updated_at: ausenciaActualizada.updated_at,
      };

      res.json({
        success: true,
        message: "Ausencia actualizada exitosamente",
        data: {
          ausencia: ausenciaFormateada,
        },
      });
    } catch (error: any) {
      console.error("Error al actualizar ausencia:", error);

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error al actualizar la ausencia",
        error: error.message,
      });
    }
  }

  /**
   * Eliminar ausencia (soft delete)
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const ausenciaExistente = await prisma.mot_ausencia_justificada.findFirst(
        {
          where: {
            ausencia_id: parseInt(id),
            deleted_at: null,
          },
        },
      );

      if (!ausenciaExistente) {
        res.status(404).json({
          success: false,
          message: "Ausencia no encontrada",
        });
        return;
      }

      const userId = (req as any).user?.usuario_id || 1;

      await prisma.mot_ausencia_justificada.update({
        where: {
          ausencia_id: parseInt(id),
        },
        data: {
          deleted_at: new Date(),
          updated_by: userId,
          updated_at: new Date(),
        },
      });

      res.json({
        success: true,
        message: "Ausencia eliminada exitosamente",
      });
    } catch (error: any) {
      console.error("Error al eliminar ausencia:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar la ausencia",
        error: error.message,
      });
    }
  }

  /**
   * Aprobar ausencia
   */
  static async aprobar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { supervisor_id, comentarios } = req.body;

      const ausenciaExistente = await prisma.mot_ausencia_justificada.findFirst(
        {
          where: {
            ausencia_id: parseInt(id),
            deleted_at: null,
          },
        },
      );

      if (!ausenciaExistente) {
        res.status(404).json({
          success: false,
          message: "Ausencia no encontrada",
        });
        return;
      }

      const userId = (req as any).user?.usuario_id || supervisor_id || 1;

      const ausenciaActualizada = await prisma.mot_ausencia_justificada.update({
        where: {
          ausencia_id: parseInt(id),
        },
        data: {
          estado_aprobacion: "aprobada",
          updated_at: new Date(),
          updated_by: userId,
        },
        include: {
          mom_trabajador: {
            select: {
              trabajador_id: true,
              documento_identidad: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
      });

      const ausenciaFormateada = {
        id: ausenciaActualizada.ausencia_id,
        trabajador_id: ausenciaActualizada.trabajador_id,
        trabajador_nombre: ausenciaActualizada.mom_trabajador.nombre_completo,
        fecha_ausencia: ausenciaActualizada.fecha_at
          .toISOString()
          .split("T")[0],
        motivo: ausenciaActualizada.motivo,
        estado: ausenciaActualizada.estado_aprobacion,
      };

      res.json({
        success: true,
        message: "Ausencia aprobada exitosamente",
        data: {
          ausencia: ausenciaFormateada,
        },
      });
    } catch (error: any) {
      console.error("Error al aprobar ausencia:", error);
      res.status(500).json({
        success: false,
        message: "Error al aprobar la ausencia",
        error: error.message,
      });
    }
  }

  /**
   * Rechazar ausencia
   */
  static async rechazar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { supervisor_id, comentarios } = req.body;

      const ausenciaExistente = await prisma.mot_ausencia_justificada.findFirst(
        {
          where: {
            ausencia_id: parseInt(id),
            deleted_at: null,
          },
        },
      );

      if (!ausenciaExistente) {
        res.status(404).json({
          success: false,
          message: "Ausencia no encontrada",
        });
        return;
      }

      const userId = (req as any).user?.usuario_id || supervisor_id || 1;

      const ausenciaActualizada = await prisma.mot_ausencia_justificada.update({
        where: {
          ausencia_id: parseInt(id),
        },
        data: {
          estado_aprobacion: "rechazada",
          updated_at: new Date(),
          updated_by: userId,
        },
        include: {
          mom_trabajador: {
            select: {
              trabajador_id: true,
              documento_identidad: true,
              nombre_completo: true,
              email: true,
            },
          },
        },
      });

      const ausenciaFormateada = {
        id: ausenciaActualizada.ausencia_id,
        trabajador_id: ausenciaActualizada.trabajador_id,
        trabajador_nombre: ausenciaActualizada.mom_trabajador.nombre_completo,
        fecha_ausencia: ausenciaActualizada.fecha_at
          .toISOString()
          .split("T")[0],
        motivo: ausenciaActualizada.motivo,
        estado: ausenciaActualizada.estado_aprobacion,
      };

      res.json({
        success: true,
        message: "Ausencia rechazada",
        data: {
          ausencia: ausenciaFormateada,
        },
      });
    } catch (error: any) {
      console.error("Error al rechazar ausencia:", error);
      res.status(500).json({
        success: false,
        message: "Error al rechazar la ausencia",
        error: error.message,
      });
    }
  }

  /**
   * Obtener estadísticas de ausencias
   */
  static async getEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const { trabajador_id, fecha_inicio, fecha_fin } = req.query;

      const where: any = {
        deleted_at: null,
      };

      if (trabajador_id) {
        where.trabajador_id = parseInt(trabajador_id as string);
      }

      if (fecha_inicio || fecha_fin) {
        where.fecha_at = {};
        if (fecha_inicio) {
          where.fecha_at.gte = new Date(fecha_inicio as string);
        }
        if (fecha_fin) {
          where.fecha_at.lte = new Date(fecha_fin as string);
        }
      }

      const [total, pendientes, aprobadas, rechazadas] = await Promise.all([
        prisma.mot_ausencia_justificada.count({ where }),
        prisma.mot_ausencia_justificada.count({
          where: { ...where, estado_aprobacion: "pendiente" },
        }),
        prisma.mot_ausencia_justificada.count({
          where: { ...where, estado_aprobacion: "aprobada" },
        }),
        prisma.mot_ausencia_justificada.count({
          where: { ...where, estado_aprobacion: "rechazada" },
        }),
      ]);

      res.json({
        success: true,
        data: {
          stats: {
            total,
            pendientes,
            aprobadas,
            rechazadas,
          },
        },
      });
    } catch (error: any) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas",
        error: error.message,
      });
    }
  }

  /**
   * Subir documento de respaldo
   */
  static async subirDocumento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No se proporcionó ningún archivo",
        });
        return;
      }

      const ausenciaExistente = await prisma.mot_ausencia_justificada.findFirst(
        {
          where: {
            ausencia_id: parseInt(id),
            deleted_at: null,
          },
        },
      );

      if (!ausenciaExistente) {
        res.status(404).json({
          success: false,
          message: "Ausencia no encontrada",
        });
        return;
      }

      const userId = (req as any).user?.usuario_id || 1;
      const documentoPath = `/uploads/ausencias/${req.file.filename}`;

      await prisma.mot_ausencia_justificada.update({
        where: {
          ausencia_id: parseInt(id),
        },
        data: {
          documento_respaldo_path: documentoPath,
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      res.json({
        success: true,
        message: "Documento subido exitosamente",
        data: {
          url: documentoPath,
          documentacion_respaldo: documentoPath,
        },
      });
    } catch (error: any) {
      console.error("Error al subir documento:", error);
      res.status(500).json({
        success: false,
        message: "Error al subir el documento",
        error: error.message,
      });
    }
  }

  /**
   * DEBUG: Verificar documentos en base de datos
   */
  static async debugDocumentos(req: Request, res: Response): Promise<void> {
    try {
      const documentos = await prisma.mot_ausencia_justificada.findMany({
        where: {
          deleted_at: null,
          documento_respaldo_path: { not: null },
        },
        select: {
          ausencia_id: true,
          trabajador_id: true,
          documento_respaldo_path: true,
          fecha_at: true,
        },
        take: 10,
      });

      res.json({
        success: true,
        message: "Documentos encontrados",
        count: documentos.length,
        data: documentos,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error al verificar documentos",
        error: error.message,
      });
    }
  }

  /**
   * Descargar documento de ausencia
   */
  static async descargarDocumento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const ausencia = await prisma.mot_ausencia_justificada.findFirst({
        where: {
          ausencia_id: parseInt(id),
          deleted_at: null,
        },
      });

      if (!ausencia || !ausencia.documento_respaldo_path) {
        res.status(404).json({
          success: false,
          message: "Documento no encontrado",
        });
        return;
      }

      const path = require("path");
      const fs = require("fs");

      // El documento_respaldo_path contiene el nombre del archivo
      // Extraer solo el nombre del archivo
      const filename = ausencia.documento_respaldo_path.split("/").pop();
      const filePath = path.resolve(
        __dirname,
        "../../uploads/ausencias",
        filename || "",
      );

      console.log("📁 Buscando archivo en:", filePath);
      console.log(
        "📄 documento_respaldo_path:",
        ausencia.documento_respaldo_path,
      );

      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        console.error("❌ Archivo no encontrado:", filePath);
        res.status(404).json({
          success: false,
          message: "Archivo no encontrado en el servidor",
          debug: { filePath, filename },
        });
        return;
      }

      console.log("✅ Archivo encontrado, descargando...");

      // Descargar el archivo
      res.download(filePath);
    } catch (error: any) {
      console.error("Error al descargar documento:", error);
      res.status(500).json({
        success: false,
        message: "Error al descargar el documento",
        error: error.message,
      });
    }
  }
}
