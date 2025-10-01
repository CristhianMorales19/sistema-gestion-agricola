import { PrismaClient } from '@prisma/client';
import { Auth0ManagementService } from './auth0-management.service';

const prisma = new PrismaClient();

/**
 * Servicio híbrido que integra Auth0 con la base de datos local
 * Prioridad: Auth0 primero, fallback a BD local si Auth0 falla
 */
export class HybridUserManagementService {
  private auth0Service: Auth0ManagementService;
  private isAuth0Available: boolean = true;

  constructor() {
    this.auth0Service = new Auth0ManagementService();
  }

  /**
   * Verificar si Auth0 está disponible
   */
  private async checkAuth0Availability(): Promise<boolean> {
    try {
      await this.auth0Service.getRoles();
      this.isAuth0Available = true;
      return true;
    } catch (error) {
      console.warn('⚠️ Auth0 no disponible, usando base de datos local');
      this.isAuth0Available = false;
      return false;
    }
  }

  /**
   * Obtener usuarios - Híbrido
   */
  async getUsers(page: number = 0, perPage: number = 25) {
    const auth0Available = await this.checkAuth0Availability();

    if (auth0Available) {
      // Usar Auth0
      try {
        const auth0Result = await this.auth0Service.getUsers(page, perPage);
        
        // Enriquecer con datos locales
        const usersWithLocalData = await Promise.all(
          auth0Result.users.map(async (auth0User) => {
            const localUser = await this.findLocalUserByAuth0Id(auth0User.user_id);
            const roles = await this.auth0Service.getUserRoles(auth0User.user_id!);
            
            return {
              user: auth0User,
              roles: roles,
              localUserData: localUser
            };
          })
        );

        return {
          users: usersWithLocalData,
          total: auth0Result.total,
          source: 'auth0'
        };
      } catch (error) {
        console.error('Error obteniendo usuarios de Auth0, usando BD local:', error);
        return this.getUsersFromDatabase(page, perPage);
      }
    } else {
      // Usar BD local
      return this.getUsersFromDatabase(page, perPage);
    }
  }

  /**
   * Obtener usuarios desde la base de datos local
   */
  private async getUsersFromDatabase(page: number = 0, perPage: number = 25) {
    const skip = page * perPage;
    
    const [users, total] = await Promise.all([
      prisma.mot_usuario.findMany({
        skip,
        take: perPage,
        include: {
          mom_trabajador: true,
          mom_rol: {
            include: {
              rel_mom_rol__mom_permiso: {
                include: {
                  mom_permiso: true
                }
              }
            }
          }
        },
        where: {
          deleted_at: null
        }
      }),
      prisma.mot_usuario.count({
        where: {
          deleted_at: null
        }
      })
    ]);

    const usersFormatted = users.map(user => ({
      user: {
        user_id: user.username,
        email: user.mom_trabajador?.email || user.username,
        name: user.mom_trabajador?.nombre_completo || user.username,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at?.toISOString()
      },
      roles: [{
        id: user.mom_rol.rol_id.toString(),
        name: user.mom_rol.nombre,
        description: user.mom_rol.descripcion || ''
      }],
      localUserData: {
        usuario_id: user.usuario_id,
        username: user.username,
        trabajador_id: user.trabajador_id,
        estado: user.estado
      }
    }));

    return {
      users: usersFormatted,
      total,
      source: 'database'
    };
  }

  /**
   * Obtener roles - Híbrido
   */
  async getRoles() {
    const auth0Available = await this.checkAuth0Availability();

    if (auth0Available) {
      try {
        return await this.auth0Service.getRoles();
      } catch (error) {
        console.error('Error obteniendo roles de Auth0, usando BD local:', error);
        return this.getRolesFromDatabase();
      }
    } else {
      return this.getRolesFromDatabase();
    }
  }

  /**
   * Obtener roles desde la base de datos local
   */
  private async getRolesFromDatabase() {
    const roles = await prisma.mom_rol.findMany({
      where: {
        is_activo: true,
        deleted_at: null
      },
      include: {
        rel_mom_rol__mom_permiso: {
          include: {
            mom_permiso: true
          }
        }
      }
    });

    return roles.map(role => ({
      id: role.rol_id.toString(),
      name: role.nombre,
      description: role.descripcion || '',
      permissions: role.rel_mom_rol__mom_permiso.map(rel => ({
        id: rel.mom_permiso.permiso_id.toString(),
        code: rel.mom_permiso.codigo || '',
        name: rel.mom_permiso.nombre,
        category: rel.mom_permiso.categoria || ''
      }))
    }));
  }

  /**
   * Asignar roles a usuario - Híbrido
   */
  async assignRoles(userId: string, roleIds: string[]) {
    const auth0Available = await this.checkAuth0Availability();

    if (auth0Available) {
      try {
        // Asignar en Auth0
        await this.auth0Service.assignRolesToUser(userId, roleIds);
        
        // Sincronizar con BD local
        await this.syncUserRolesToDatabase(userId, roleIds);
        
        return { success: true, source: 'auth0' };
      } catch (error) {
        console.error('Error asignando roles en Auth0, usando BD local:', error);
        return this.assignRolesToDatabase(userId, roleIds);
      }
    } else {
      return this.assignRolesToDatabase(userId, roleIds);
    }
  }

  /**
   * Asignar roles en base de datos local
   */
  private async assignRolesToDatabase(userId: string, roleIds: string[]) {
    // Buscar usuario por username (que puede ser el auth0 user_id)
    const user = await prisma.mot_usuario.findUnique({
      where: { username: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado en base de datos local');
    }

    // Asignar primer rol (la tabla mot_usuario solo tiene un rol_id)
    if (roleIds.length > 0) {
      const rolId = parseInt(roleIds[0]);
      
      await prisma.mot_usuario.update({
        where: { usuario_id: user.usuario_id },
        data: {
          rol_id: rolId,
          fecha_ultimo_cambio_rol_at: new Date(),
          updated_at: new Date(),
          updated_by: 1 // Usuario del sistema
        }
      });
    }

    return { success: true, source: 'database' };
  }

  /**
   * Buscar usuario local por Auth0 ID
   */
  private async findLocalUserByAuth0Id(auth0UserId?: string) {
    if (!auth0UserId) return null;

    const user = await prisma.mot_usuario.findFirst({
      where: {
        username: auth0UserId,
        deleted_at: null
      },
      include: {
        mom_trabajador: true,
        mom_rol: true
      }
    });

    if (!user) return null;

    return {
      usuario_id: user.usuario_id,
      username: user.username,
      trabajador_id: user.trabajador_id,
      estado: user.estado,
      trabajador: user.mom_trabajador ? {
        nombre_completo: user.mom_trabajador.nombre_completo,
        email: user.mom_trabajador.email,
        documento_identidad: user.mom_trabajador.documento_identidad
      } : null,
      rol: {
        rol_id: user.mom_rol.rol_id,
        nombre: user.mom_rol.nombre,
        codigo: user.mom_rol.codigo
      }
    };
  }

  /**
   * Sincronizar roles de Auth0 a base de datos local
   */
  private async syncUserRolesToDatabase(auth0UserId: string, roleIds: string[]) {
    try {
      const user = await prisma.mot_usuario.findFirst({
        where: { username: auth0UserId }
      });

      if (user && roleIds.length > 0) {
        const rolId = parseInt(roleIds[0]);
        
        await prisma.mot_usuario.update({
          where: { usuario_id: user.usuario_id },
          data: {
            rol_id: rolId,
            fecha_ultimo_cambio_rol_at: new Date(),
            updated_at: new Date()
          }
        });
      }
    } catch (error) {
      console.warn('No se pudo sincronizar rol a BD local:', error);
    }
  }

  /**
   * Crear usuario - Híbrido
   */
  async createUser(userData: {
    email: string;
    name: string;
    password?: string;
    roleId?: string;
  }) {
    const auth0Available = await this.checkAuth0Availability();

    if (auth0Available) {
      try {
        // Crear en Auth0
        const auth0User = await this.auth0Service.createUser({
          email: userData.email,
          name: userData.name,
          password: userData.password || this.generateRandomPassword(),
          connection: 'Username-Password-Authentication'
        });

        // Crear en BD local
        await this.createUserInDatabase({
          auth0UserId: auth0User.user_id!,
          email: userData.email,
          name: userData.name,
          roleId: userData.roleId
        });

        return { success: true, user: auth0User, source: 'auth0' };
      } catch (error) {
        console.error('Error creando usuario en Auth0:', error);
        throw error;
      }
    } else {
      // Crear solo en BD local
      return this.createUserInDatabase({
        email: userData.email,
        name: userData.name,
        roleId: userData.roleId
      });
    }
  }

  /**
   * Crear usuario en base de datos local
   */
  private async createUserInDatabase(userData: {
    auth0UserId?: string;
    email: string;
    name: string;
    roleId?: string;
  }) {
    // Crear trabajador primero
    const trabajador = await prisma.mom_trabajador.create({
      data: {
        documento_identidad: `TEMP_${Date.now()}`,
        nombre_completo: userData.name,
        email: userData.email,
        fecha_nacimiento: new Date('2000-01-01'),
        fecha_registro_at: new Date(),
        created_at: new Date(),
        created_by: 1
      }
    });

    // Crear usuario
    const rolId = userData.roleId ? parseInt(userData.roleId) : 1;
    
    const user = await prisma.mot_usuario.create({
      data: {
        trabajador_id: trabajador.trabajador_id,
        username: userData.auth0UserId || userData.email,
        password_hash: 'auth0_managed',
        rol_id: rolId,
        estado: 'activo',
        created_at: new Date(),
        created_by: 1
      }
    });

    return {
      success: true,
      user: {
        user_id: user.username,
        email: userData.email,
        name: userData.name
      },
      source: 'database'
    };
  }

  /**
   * Generar contraseña aleatoria
   */
  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-12) + 
           Math.random().toString(36).slice(-12).toUpperCase() + 
           '!@#';
  }
}

export const hybridUserService = new HybridUserManagementService();
