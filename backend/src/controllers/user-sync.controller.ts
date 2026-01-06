import { Request, Response } from 'express';
import { UserSyncService } from '../services/user-sync.service';

/**
 * Controlador para operaciones de sincronización de usuarios
 */
export class UserSyncController {

  /**
   * Sincronizar un usuario específico desde Auth0
   */
  static async syncUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
        return;
      }

      const result = await UserSyncService.syncUserFromAuth0(userId);

      res.json({
        success: result.success,
        data: result.user,
        message: result.message
      });

    } catch (error) {
      console.error('Error sincronizando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Sincronizar todos los usuarios desde Auth0
   */
  static async syncAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await UserSyncService.syncAllUsersFromAuth0();

      res.json({
        success: result.success,
        data: {
          syncedUsers: result.syncedUsers,
          errors: result.errors,
          errorsCount: result.errors.length
        },
        message: `Sincronización completada. ${result.syncedUsers} usuarios sincronizados, ${result.errors.length} errores`
      });

    } catch (error) {
      console.error('Error sincronizando todos los usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Verificar integridad entre usuarios Auth0 y locales
   */
  static async verifyIntegrity(req: Request, res: Response): Promise<void> {
    try {
      const integrity = await UserSyncService.verifyUserIntegrity();

      res.json({
        success: true,
        data: integrity,
        message: 'Verificación de integridad completada'
      });

    } catch (error) {
      console.error('Error verificando integridad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Limpiar usuarios locales huérfanos
   */
  static async cleanupOrphanedUsers(req: Request, res: Response): Promise<void> {
    try {
      const { dryRun = 'true' } = req.query;
      const isDryRun = dryRun === 'true';

      const result = await UserSyncService.cleanupOrphanedUsers(isDryRun);

      res.json({
        success: result.success,
        data: {
          orphanedUsers: result.orphanedUsers,
          deletedCount: result.deletedCount,
          dryRun: isDryRun
        },
        message: isDryRun 
          ? `Se encontraron ${result.orphanedUsers.length} usuarios huérfanos (simulación)`
          : `${result.deletedCount} usuarios huérfanos marcados como inactivos`
      });

    } catch (error) {
      console.error('Error limpiando usuarios huérfanos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener estadísticas de sincronización
   */
  static async getSyncStats(req: Request, res: Response): Promise<void> {
    try {
      const integrity = await UserSyncService.verifyUserIntegrity();

      const stats = {
        auth0Users: integrity.auth0UsersCount,
        localUsers: integrity.localUsersCount,
        orphanedUsers: integrity.orphanedLocalUsers.length,
        missingLocalUsers: integrity.missingLocalUsers.length,
        syncPercentage: Math.round((integrity.localUsersCount / integrity.auth0UsersCount) * 100),
        integrityStatus: integrity.orphanedLocalUsers.length === 0 && integrity.missingLocalUsers.length === 0 ? 'healthy' : 'needs_attention'
      };

      res.json({
        success: true,
        data: stats,
        message: 'Estadísticas de sincronización obtenidas'
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}