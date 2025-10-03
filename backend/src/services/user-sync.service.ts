import { PrismaClient, mot_usuario, mom_rol, mom_permiso } from '@prisma/client';
import { auth0ManagementService, Auth0User } from './auth0-management.service';

const prisma = new PrismaClient();

/**
 * Tipos para el servicio de sincronización
 */
type LocalUser = mot_usuario;

type LocalUserWithRole = mot_usuario & {
  mom_rol: mom_rol & {
    rel_mom_rol__mom_permiso: Array<{
      mom_permiso: mom_permiso;
    }>;
  };
};

type OrphanedLocalUser = {
  usuario_id: number;
  auth0_user_id: string | null;
  username: string;
  estado: string;
};

/**
 * Servicio para sincronizar usuarios entre Auth0 y base de datos local
 */
export class UserSyncService {

  /**
   * Sincronizar un usuario de Auth0 con la base de datos local
   */
  static async syncUserFromAuth0(auth0UserId: string): Promise<{
    success: boolean;
    user?: LocalUser;
    message: string;
  }> {
    try {
      // Obtener usuario de Auth0
      const auth0User = await auth0ManagementService.getUserById(auth0UserId);

      if (!auth0User) {
        return {
          success: false,
          message: 'Usuario no encontrado en Auth0'
        };
      }

      // Verificar si ya existe en base de datos local
      let localUser = await prisma.mot_usuario.findUnique({
        where: { auth0_user_id: auth0UserId }
      });

      if (!localUser) {
        // Crear usuario local si no existe
        // Obtener rol por defecto
        const defaultRole = await prisma.mom_rol.findFirst({
          where: { 
            codigo: 'USUARIO',
            is_activo: true
          }
        });

        if (!defaultRole) {
          return {
            success: false,
            message: 'No se encontró un rol por defecto para asignar'
          };
        }

        localUser = await prisma.mot_usuario.create({
          data: {
            auth0_user_id: auth0UserId,
            username: auth0User.email || auth0User.nickname || `user_${auth0UserId.slice(-8)}`,
            password_hash: 'AUTH0_MANAGED', // Password manejado por Auth0
            rol_id: defaultRole.rol_id,
            estado: 'activo',
            created_at: new Date(),
            created_by: 1 // Sistema
          }
        });

        console.log(`Usuario local creado para Auth0 ID: ${auth0UserId}`);
      }

      return {
        success: true,
        user: localUser,
        message: 'Usuario sincronizado exitosamente'
      };

    } catch (error) {
      console.error('Error sincronizando usuario:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Obtener o crear usuario local basado en usuario Auth0
   */
  static async getOrCreateLocalUser(auth0UserId: string, auth0UserData?: Auth0User): Promise<LocalUserWithRole | null> {
    try {
      // Buscar usuario local existente
      let localUser = await prisma.mot_usuario.findUnique({
        where: { auth0_user_id: auth0UserId },
        include: {
          mom_rol: {
            include: {
              rel_mom_rol__mom_permiso: {
                include: {
                  mom_permiso: true
                }
              }
            }
          }
        }
      });

      if (localUser) {
        return localUser;
      }

      // Si no existe, crear usuario local
      const syncResult = await this.syncUserFromAuth0(auth0UserId);
      
      if (syncResult.success) {
        // Volver a buscar con relaciones incluidas
        localUser = await prisma.mot_usuario.findUnique({
          where: { auth0_user_id: auth0UserId },
          include: {
            mom_rol: {
              include: {
                rel_mom_rol__mom_permiso: {
                  include: {
                    mom_permiso: true
                  }
                }
              }
            }
          }
        });
      }

      return localUser;

    } catch (error) {
      console.error('Error obteniendo/creando usuario local:', error);
      throw error;
    }
  }

  /**
   * Sincronizar todos los usuarios de Auth0 con la base de datos local
   */
  static async syncAllUsersFromAuth0(): Promise<{
    success: boolean;
    syncedUsers: number;
    errors: string[];
  }> {
    try {
      const result = {
        success: true,
        syncedUsers: 0,
        errors: [] as string[]
      };

      let page = 0;
      const perPage = 50;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        // Obtener usuarios de Auth0 por páginas
        const auth0Result = await auth0ManagementService.getUsers(page, perPage);
        
        if (auth0Result.users.length === 0) {
          hasMoreUsers = false;
          break;
        }

        // Sincronizar cada usuario
        for (const auth0User of auth0Result.users) {
          try {
            const syncResult = await this.syncUserFromAuth0(auth0User.user_id!);
            
            if (syncResult.success) {
              result.syncedUsers++;
            } else {
              result.errors.push(`${auth0User.email || auth0User.user_id}: ${syncResult.message}`);
            }
          } catch (error) {
            result.errors.push(`${auth0User.email || auth0User.user_id}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          }
        }

        page++;
        
        // Si obtuvimos menos usuarios que el límite, no hay más páginas
        if (auth0Result.users.length < perPage) {
          hasMoreUsers = false;
        }
      }

      return result;

    } catch (error) {
      console.error('Error sincronizando todos los usuarios:', error);
      return {
        success: false,
        syncedUsers: 0,
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }

  /**
   * Verificar integridad entre usuarios Auth0 y locales
   */
  static async verifyUserIntegrity(): Promise<{
    auth0UsersCount: number;
    localUsersCount: number;
    orphanedLocalUsers: OrphanedLocalUser[];
    missingLocalUsers: Auth0User[];
  }> {
    try {
      // Obtener todos los usuarios de Auth0
      const auth0Result = await auth0ManagementService.getUsers(0, 1000); // Asumiendo max 1000 usuarios
      
      // Obtener todos los usuarios locales con auth0_user_id
      const localUsers = await prisma.mot_usuario.findMany({
        where: {
          auth0_user_id: { not: null }
        },
        select: {
          usuario_id: true,
          auth0_user_id: true,
          username: true,
          estado: true
        }
      });

      // Identificar usuarios locales huérfanos (auth0_user_id no existe en Auth0)
      const auth0UserIds = auth0Result.users.map(user => user.user_id);
      const orphanedLocalUsers = localUsers.filter(localUser => 
        localUser.auth0_user_id && !auth0UserIds.includes(localUser.auth0_user_id)
      );

      // Identificar usuarios Auth0 sin representación local
      const localAuth0Ids = localUsers.map(user => user.auth0_user_id);
      const missingLocalUsers = auth0Result.users.filter(auth0User => 
        auth0User.user_id && !localAuth0Ids.includes(auth0User.user_id)
      );

      return {
        auth0UsersCount: auth0Result.users.length,
        localUsersCount: localUsers.length,
        orphanedLocalUsers,
        missingLocalUsers
      };

    } catch (error) {
      console.error('Error verificando integridad de usuarios:', error);
      throw error;
    }
  }

  /**
   * Limpiar usuarios locales huérfanos
   */
  static async cleanupOrphanedUsers(dryRun = true): Promise<{
    success: boolean;
    orphanedUsers: OrphanedLocalUser[];
    deletedCount: number;
  }> {
    try {
      const integrity = await this.verifyUserIntegrity();
      
      if (!dryRun && integrity.orphanedLocalUsers.length > 0) {
        // Marcar usuarios huérfanos como inactivos en lugar de eliminarlos
        const orphanedIds = integrity.orphanedLocalUsers.map(user => user.usuario_id);
        
        await prisma.mot_usuario.updateMany({
          where: {
            usuario_id: { in: orphanedIds }
          },
          data: {
            estado: 'inactivo',
            updated_at: new Date(),
            updated_by: 1 // Sistema
          }
        });
      }

      return {
        success: true,
        orphanedUsers: integrity.orphanedLocalUsers,
        deletedCount: dryRun ? 0 : integrity.orphanedLocalUsers.length
      };

    } catch (error) {
      console.error('Error limpiando usuarios huérfanos:', error);
      return {
        success: false,
        orphanedUsers: [],
        deletedCount: 0
      };
    }
  }
}

export const userSyncService = new UserSyncService();