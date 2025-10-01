import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth0ManagementService } from '../services/auth0-management.service';
import {
  UserWithRoles,
  UsersListResponse,
  RolesListResponse,
  RoleAssignmentRequest,
  UserSearchFilters,
  Auth0Role
} from '../types/auth0-roles.types';

const prisma = new PrismaClient();

/**
 * Controlador para gestión de usuarios y roles con Auth0
 */
export class UserRoleController {

  /**
   * Obtener lista de usuarios con sus roles
   */
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 0,
        perPage = 25,
        email,
        name,
        role,
        hasRole
      } = req.query as UserSearchFilters;

      let searchQuery = '';
      if (email) searchQuery += `email:*${email}*`;
      if (name) searchQuery += searchQuery ? ` AND name:*${name}*` : `name:*${name}*`;

      // Obtener usuarios de Auth0
      const auth0Result = searchQuery 
        ? await auth0ManagementService.searchUsers(searchQuery, Number(page), Number(perPage))
        : await auth0ManagementService.getUsers(Number(page), Number(perPage));

      // Enriquecer con datos locales y roles
      const usersWithRoles: UserWithRoles[] = await Promise.all(
        auth0Result.users.map(async (user) => {
          // Obtener roles del usuario en Auth0
          const roles = await auth0ManagementService.getUserRoles(user.user_id!);

          // Buscar datos locales del usuario
          let localUserData = undefined;
          if (user.user_id && user.email) {
            try {
              // Intentar buscar por auth0_user_id si la columna existe
              let localUser = await prisma.mot_usuario.findUnique({
                where: { auth0_user_id: user.user_id },
                include: {
                  mom_rol: true,
                  mom_trabajador: true
                }
              }).catch(() => null);

              // Si falla, intentar buscar por username usando el email
              if (!localUser && user.email) {
                localUser = await prisma.mot_usuario.findFirst({
                  where: { 
                    username: user.email.split('@')[0] // Usar parte del email como username
                  },
                  include: {
                    mom_rol: true,
                    mom_trabajador: true
                  }
                }).catch(() => null);
              }

              if (localUser) {
                localUserData = {
                  usuario_id: localUser.usuario_id,
                  username: localUser.username,
                  trabajador_id: localUser.trabajador_id || undefined,
                  estado: localUser.estado
                };
              }
            } catch (error) {
              console.warn(`No se pudo obtener datos locales para usuario ${user.email}:`, error);
            }
          }

          return {
            user: user as any,
            roles: roles as any,
            localUserData
          };
        })
      );

      // Filtrar por rol si es necesario
      let filteredUsers = usersWithRoles;
      if (role) {
        filteredUsers = usersWithRoles.filter(userWithRoles => 
          userWithRoles.roles.some((r: Auth0Role) => r.name && r.name.toLowerCase().includes(role.toLowerCase()))
        );
      }

      if (hasRole !== undefined) {
        const hasRoleBool = typeof hasRole === 'string' ? hasRole === 'true' : Boolean(hasRole);
        filteredUsers = usersWithRoles.filter(userWithRoles => 
          hasRoleBool ? userWithRoles.roles.length > 0 : userWithRoles.roles.length === 0
        );
      }

      const totalPages = Math.ceil(auth0Result.total / Number(perPage));

      const response: UsersListResponse = {
        users: filteredUsers,
        total: auth0Result.total,
        page: Number(page),
        perPage: Number(perPage),
        totalPages
      };

      res.json({
        success: true,
        data: response,
        message: 'Usuarios obtenidos exitosamente'
      });

    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener lista de roles disponibles
   */
  static async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await auth0ManagementService.getRoles();

      const response: RolesListResponse = {
        roles: roles as any,
        total: roles.length
      };

      res.json({
        success: true,
        data: response,
        message: 'Roles obtenidos exitosamente'
      });

    } catch (error) {
      console.error('Error obteniendo roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener un usuario específico con sus roles
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
        return;
      }

      // Obtener usuario de Auth0
      const user = await auth0ManagementService.getUserById(userId);
      
      // Obtener roles del usuario
      const roles = await auth0ManagementService.getUserRoles(userId);

      // Obtener datos locales
      let localUserData = undefined;
      try {
        let localUser = await prisma.mot_usuario.findUnique({
          where: { auth0_user_id: userId },
          include: {
            mom_rol: true,
            mom_trabajador: true
          }
        }).catch(() => null);

        // Si falla, intentar buscar por username usando el email
        if (!localUser && user.email) {
          localUser = await prisma.mot_usuario.findFirst({
            where: { 
              username: user.email.split('@')[0] // Usar parte del email como username
            },
            include: {
              mom_rol: true,
              mom_trabajador: true
            }
          }).catch(() => null);
        }

        if (localUser) {
          localUserData = {
            usuario_id: localUser.usuario_id,
            username: localUser.username,
            trabajador_id: localUser.trabajador_id || undefined,
            estado: localUser.estado
          };
        }
      } catch (error) {
        console.warn(`No se pudo obtener datos locales para usuario ${userId}:`, error);
      }

      const userWithRoles: UserWithRoles = {
        user: user as any,
        roles: roles as any,
        localUserData
      };

      res.json({
        success: true,
        data: userWithRoles,
        message: 'Usuario obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Asignar roles a un usuario
   */
  static async assignRoles(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { roleIds, reason }: RoleAssignmentRequest = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
        return;
      }

      if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Lista de roles requerida'
        });
        return;
      }

      // Verificar que el usuario existe en Auth0
      await auth0ManagementService.getUserById(userId);

      // Obtener roles actuales para auditoría
      const currentRoles = await auth0ManagementService.getUserRoles(userId);
      const currentRoleIds = currentRoles.map(role => role.id!);

      // Actualizar roles en Auth0
      await auth0ManagementService.updateUserRoles(userId, roleIds);

      // Registrar auditoría en base de datos local
      const adminUser = (req as any).localUser;
      await prisma.mol_audit_log.create({
        data: {
          entidad: 'auth0_user_roles',
          entidad_id: parseInt(userId.replace('auth0|', '')),
          accion: 'update_roles',
          datos_antes: JSON.stringify({
            roles: currentRoleIds,
            timestamp: new Date()
          }),
          datos_despues: JSON.stringify({
            roles: roleIds,
            reason: reason || 'Sin razón especificada',
            timestamp: new Date()
          }),
          usuario_id: adminUser?.usuario_id,
          fecha_at: new Date(),
          ip_origen: req.ip
        }
      });

      // Obtener los roles actualizados para la respuesta
      const updatedRoles = await auth0ManagementService.getUserRoles(userId);

      res.json({
        success: true,
        data: {
          userId,
          roles: updatedRoles,
          assignedBy: adminUser?.username || 'Sistema'
        },
        message: 'Roles asignados exitosamente'
      });

    } catch (error) {
      console.error('Error asignando roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Remover roles de un usuario
   */
  static async removeRoles(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { roleIds, reason } = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
        return;
      }

      if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Lista de roles a remover requerida'
        });
        return;
      }

      // Obtener roles actuales para auditoría
      const currentRoles = await auth0ManagementService.getUserRoles(userId);
      const currentRoleIds = currentRoles.map(role => role.id!);

      // Remover roles en Auth0
      await auth0ManagementService.removeRolesFromUser(userId, roleIds);

      // Registrar auditoría
      const adminUser = (req as any).localUser;
      await prisma.mol_audit_log.create({
        data: {
          entidad: 'auth0_user_roles',
          entidad_id: parseInt(userId.replace('auth0|', '')),
          accion: 'remove_roles',
          datos_antes: JSON.stringify({
            roles: currentRoleIds,
            timestamp: new Date()
          }),
          datos_despues: JSON.stringify({
            roles: currentRoleIds.filter(id => !roleIds.includes(id)),
            removedRoles: roleIds,
            reason: reason || 'Sin razón especificada',
            timestamp: new Date()
          }),
          usuario_id: adminUser?.usuario_id,
          fecha_at: new Date(),
          ip_origen: req.ip
        }
      });

      // Obtener roles actualizados
      const updatedRoles = await auth0ManagementService.getUserRoles(userId);

      res.json({
        success: true,
        data: {
          userId,
          roles: updatedRoles,
          removedBy: adminUser?.username || 'Sistema'
        },
        message: 'Roles removidos exitosamente'
      });

    } catch (error) {
      console.error('Error removiendo roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener historial de asignaciones de roles
   */
  static async getRoleAssignmentHistory(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { page = 0, limit = 20 } = req.query;

      const whereClause: any = {
        entidad: 'auth0_user_roles'
      };

      if (userId) {
        whereClause.entidad_id = parseInt(userId.replace('auth0|', ''));
      }

      const history = await prisma.mol_audit_log.findMany({
        where: whereClause,
        orderBy: {
          fecha_at: 'desc'
        },
        take: Number(limit),
        skip: Number(page) * Number(limit)
      });

      const total = await prisma.mol_audit_log.count({
        where: whereClause
      });

      res.json({
        success: true,
        data: {
          history,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        },
        message: 'Historial obtenido exitosamente'
      });

    } catch (error) {
      console.error('Error obteniendo historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtener usuarios sin roles asignados
   */
  static async getUsersWithoutRoles(req: Request, res: Response): Promise<void> {
    try {
      const { page = 0, perPage = 25 } = req.query;

      // Obtener todos los usuarios
      const auth0Result = await auth0ManagementService.getUsers(Number(page), Number(perPage));

      // Filtrar usuarios sin roles
      const usersWithoutRoles: UserWithRoles[] = [];

      for (const user of auth0Result.users) {
        const roles = await auth0ManagementService.getUserRoles(user.user_id!);
        
        if (roles.length === 0) {
          // Buscar datos locales
          let localUserData = undefined;
          const localUser = await prisma.mot_usuario.findUnique({
            where: { auth0_user_id: user.user_id! },
            include: {
              mom_rol: true,
              mom_trabajador: true
            }
          });

          if (localUser) {
            localUserData = {
              usuario_id: localUser.usuario_id,
              username: localUser.username,
              trabajador_id: localUser.trabajador_id || undefined,
              estado: localUser.estado
            };
          }

          usersWithoutRoles.push({
            user: user as any,
            roles: [],
            localUserData
          });
        }
      }

      res.json({
        success: true,
        data: {
          users: usersWithoutRoles,
          total: usersWithoutRoles.length,
          page: Number(page),
          perPage: Number(perPage)
        },
        message: 'Usuarios sin roles obtenidos exitosamente'
      });

    } catch (error) {
      console.error('Error obteniendo usuarios sin roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}