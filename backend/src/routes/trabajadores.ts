import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requirePermissions } from '../middleware/rbac.middleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/trabajadores
 * @desc Obtener todos los trabajadores
 * @access Requiere permiso 'trabajadores:read'
 */
router.get('/', 
  authenticateToken,
  requirePermissions(['trabajadores:read']),
  async (req, res) => {
    try {
      const trabajadores = await prisma.mom_trabajador.findMany({
        where: { is_activo: true },
        select: {
          trabajador_id: true,
          documento_identidad: true,
          nombre_completo: true,
          telefono: true,
          email: true,
          fecha_registro_at: true,
          is_activo: true
        }
      });

      res.json({
        success: true,
        data: trabajadores,
        message: 'Trabajadores obtenidos correctamente'
      });
    } catch (error) {
      console.error('Error al obtener trabajadores:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
);

/**
 * @route POST /api/trabajadores
 * @desc Crear nuevo trabajador
 * @access Requiere permiso 'trabajadores:create'
 */
router.post('/',
  authenticateToken,
  requirePermissions(['trabajadores:create']),
  async (req, res) => {
    try {
      const {
        documento_identidad,
        nombre_completo,
        fecha_nacimiento,
        telefono,
        email
      } = req.body;

      // Validación básica
      if (!documento_identidad || !nombre_completo || !fecha_nacimiento) {
        return res.status(400).json({
          success: false,
          message: 'Campos obligatorios: documento_identidad, nombre_completo, fecha_nacimiento'
        });
      }

      const nuevoTrabajador = await prisma.mom_trabajador.create({
        data: {
          documento_identidad,
          nombre_completo,
          fecha_nacimiento: new Date(fecha_nacimiento),
          telefono,
          email,
          is_activo: true,
          fecha_registro_at: new Date(),
          created_at: new Date(),
          created_by: 1, // TODO: Obtener del token de Auth0
          updated_at: null,
          updated_by: null,
          deleted_at: null
        }
      });

      res.status(201).json({
        success: true,
        data: nuevoTrabajador,
        message: 'Trabajador creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear trabajador:', error);
      const err = error as Error & { code?: string };
      
      if (err.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: 'El documento de identidad ya existe'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
);

/**
 * @route PUT /api/trabajadores/:id
 * @desc Actualizar trabajador
 * @access Requiere permiso 'trabajadores:update'
 */
router.put('/:id',
  authenticateToken,
  requirePermissions(['trabajadores:update']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre_completo,
        telefono,
        email,
        is_activo
      } = req.body;

      const trabajadorActualizado = await prisma.mom_trabajador.update({
        where: { trabajador_id: parseInt(id) },
        data: {
          nombre_completo,
          telefono,
          email,
          is_activo,
          updated_at: new Date(),
          updated_by: 1 // TODO: Obtener del token de Auth0
        }
      });

      res.json({
        success: true,
        data: trabajadorActualizado,
        message: 'Trabajador actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar trabajador:', error);
      const err = error as Error & { code?: string };
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
);

/**
 * @route DELETE /api/trabajadores/:id
 * @desc Eliminar trabajador (soft delete)
 * @access Requiere permiso 'trabajadores:delete'
 */
router.delete('/:id',
  authenticateToken,
  requirePermissions(['trabajadores:delete']),
  async (req, res) => {
    try {
      const { id } = req.params;

      const trabajadorEliminado = await prisma.mom_trabajador.update({
        where: { trabajador_id: parseInt(id) },
        data: {
          is_activo: false,
          deleted_at: new Date(),
          updated_by: 1 // TODO: Obtener del token de Auth0
        }
      });

      res.json({
        success: true,
        message: 'Trabajador eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar trabajador:', error);
      const err = error as Error & { code?: string };
      
      if (err.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Trabajador no encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
);

export default router;
