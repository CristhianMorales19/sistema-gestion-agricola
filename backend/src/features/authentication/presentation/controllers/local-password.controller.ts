/**
 * 🔐 Controlador de Gestión de Contraseñas Locales
 * 
 * Controlador para que usuarios puedan configurar, cambiar y resetear
 * sus contraseñas locales de respaldo.
 * 
 * @module local-password-controller
 */

import { Request, Response } from 'express';
import LocalAuthService from '../../application/services/local-auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// Interfaces
// ========================================

interface AuthenticatedRequest extends Request {
  localUser?: any;
}

// ========================================
// Controlador
// ========================================

export class LocalPasswordController {

  /**
   * Establece una contraseña local para el usuario autenticado
   * POST /api/auth/local-password/set
   * Body: { password: string }
   */
  static async setPassword(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'La contraseña es requerida'
        });
      }

      // Obtener userId del token (Auth0 o JWT local)
      const userId = req.auth?.userId || req.localUser?.usuario_id;
      const email = req.auth?.email || req.localUser?.email;

      if (!userId && !email) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      // Si no tenemos userId, buscar por email
      let userIdToUse = userId;
      if (!userIdToUse && email) {
        const user = await prisma.mot_usuario.findFirst({
          where: { email, deleted_at: null },
          select: { usuario_id: true }
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado'
          });
        }

        userIdToUse = user.usuario_id;
      }

      // Establecer contraseña
      const result = await LocalAuthService.setLocalPassword(userIdToUse, password, false);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        message: 'Contraseña local establecida correctamente. Ahora puedes usarla como respaldo si Auth0 no está disponible.'
      });

    } catch (error) {
      console.error('❌ Error en setPassword:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al establecer contraseña'
      });
    }
  }

  /**
   * Cambia la contraseña local del usuario
   * PUT /api/auth/local-password/change
   * Body: { oldPassword: string, newPassword: string }
   */
  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      // Obtener userId
      const userId = req.auth?.userId || req.localUser?.usuario_id;
      const email = req.auth?.email || req.localUser?.email;

      if (!userId && !email) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      // Si no tenemos userId, buscar por email
      let userIdToUse = userId;
      if (!userIdToUse && email) {
        const user = await prisma.mot_usuario.findFirst({
          where: { email, deleted_at: null },
          select: { usuario_id: true }
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'Usuario no encontrado'
          });
        }

        userIdToUse = user.usuario_id;
      }

      // Cambiar contraseña
      const result = await LocalAuthService.changeLocalPassword(userIdToUse, oldPassword, newPassword);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });

    } catch (error) {
      console.error('❌ Error en changePassword:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al cambiar contraseña'
      });
    }
  }

  /**
   * Valida la fortaleza de una contraseña sin guardarla
   * POST /api/auth/local-password/validate
   * Body: { password: string }
   */
  static async validatePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          error: 'La contraseña es requerida para validar'
        });
      }

      const validation = LocalAuthService.validatePassword(password);

      return res.status(200).json({
        success: true,
        validation
      });

    } catch (error) {
      console.error('❌ Error en validatePassword:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al validar contraseña'
      });
    }
  }

  /**
   * Resetea la contraseña de un usuario (admin only)
   * POST /api/auth/local-password/reset
   * Body: { email: string }
   */
  static async resetPassword(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'El email es requerido'
        });
      }

      // TODO: Verificar que el usuario que hace la petición es admin
      // const userRole = req.localUser?.mom_rol?.descripcion;
      // if (userRole !== 'Administrador' && userRole !== 'Gerente RRHH') {
      //   return res.status(403).json({
      //     success: false,
      //     error: 'No tienes permisos para resetear contraseñas'
      //   });
      // }

      // Resetear contraseña
      const result = await LocalAuthService.resetLocalPassword(email);

      if (!result.success) {
        return res.status(400).json({
          success: result.success,
          error: result.error
        });
      }

      return res.status(200).json({
        success: true,
        temporaryPassword: result.temporaryPassword,
        message: `Contraseña temporal generada: ${result.temporaryPassword}. El usuario debe cambiarla en su próximo login.`
      });

    } catch (error) {
      console.error('❌ Error en resetPassword:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al resetear contraseña'
      });
    }
  }
}

export default LocalPasswordController;
