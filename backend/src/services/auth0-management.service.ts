import { ManagementClient } from 'auth0';
import { auth0Config } from '../config/auth0.config';
import { mockUsers, mockRoles, mockUserRoles } from './mock-auth0.service';

// Interfaces para tipado
export interface Auth0User {
  user_id?: string;
  email?: string;
  name?: string;
  picture?: string;
  nickname?: string;
  given_name?: string;
  family_name?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  email_verified?: boolean;
  identities?: Array<{
    connection: string;
    user_id: string;
    provider: string;
    isSocial: boolean;
  }>;
}

export interface Auth0Role {
  id?: string;
  name?: string;
  description?: string;
}

/**
 * Servicio para gestionar usuarios y roles en Auth0
 * Con fallback a datos mock cuando Auth0 no está disponible
 */
export class Auth0ManagementService {
  private management: ManagementClient;
  private useMockData: boolean = false;

  constructor() {
    this.management = new ManagementClient({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      clientSecret: auth0Config.clientSecret
    });

    // Check if we should use mock data based on environment
    this.useMockData = process.env.NODE_ENV === 'development' && process.env.USE_MOCK_AUTH0 === 'true';
  }

  /**
   * Test Auth0 connection and fallback to mock if needed
   */
  private async testConnectionAndFallback(): Promise<boolean> {
    try {
      // Quick test to see if Auth0 is working
      await this.management.roles.getAll({ per_page: 1 });
      return false; // Auth0 is working, don't use mock
    } catch (error) {
      console.warn('⚠️  Auth0 no disponible, usando datos mock para desarrollo');
      return true; // Use mock data
    }
  }

  /**
   * Obtener todos los usuarios de Auth0
   */
  async getUsers(page: number = 0, perPage: number = 25): Promise<{
    users: Auth0User[];
    total: number;
    start: number;
    limit: number;
  }> {
    try {
      // Test connection first
      const shouldUseMock = await this.testConnectionAndFallback();
      
      if (shouldUseMock) {
        // Return mock data
        const startIndex = page * perPage;
        const endIndex = startIndex + perPage;
        const paginatedUsers = mockUsers.slice(startIndex, endIndex);
        
        return {
          users: paginatedUsers,
          total: mockUsers.length,
          start: startIndex,
          limit: perPage
        };
      }

      // Try real Auth0 connection
      const result = await this.management.users.getAll({
        page,
        per_page: perPage,
        include_totals: true,
        search_engine: 'v3'
      }) as any;

      return {
        users: result.data?.users || result.users || [],
        total: result.data?.total || result.total || 0,
        start: result.data?.start || result.start || 0,
        limit: result.data?.limit || result.limit || perPage
      };
    } catch (error) {
      console.error('Error obteniendo usuarios de Auth0:', error);
      
      // Fallback to mock data on error
      console.warn('🔄 Fallback a datos mock debido a error de Auth0');
      const startIndex = page * perPage;
      const endIndex = startIndex + perPage;
      const paginatedUsers = mockUsers.slice(startIndex, endIndex);
      
      return {
        users: paginatedUsers,
        total: mockUsers.length,
        start: startIndex,
        limit: perPage
      };
    }
  }

  /**
   * Obtener un usuario específico por ID
   */
  async getUserById(userId: string): Promise<Auth0User> {
    try {
      // Test connection first
      const shouldUseMock = await this.testConnectionAndFallback();
      
      if (shouldUseMock) {
        const user = mockUsers.find(u => u.user_id === userId);
        if (!user) {
          throw new Error('Usuario no encontrado en datos mock');
        }
        return user;
      }

      const user = await this.management.users.get({ id: userId }) as any;
      return user.data || user;
    } catch (error) {
      console.error('Error obteniendo usuario por ID:', error);
      
      // Try fallback to mock data
      const user = mockUsers.find(u => u.user_id === userId);
      if (user) {
        console.warn('🔄 Fallback a datos mock para usuario debido a error de Auth0');
        return user;
      }
      
      throw new Error('Usuario no encontrado');
    }
  }

  /**
   * Obtener todos los roles disponibles en Auth0
   */
  async getRoles(): Promise<Auth0Role[]> {
    try {
      // Test connection first
      const shouldUseMock = await this.testConnectionAndFallback();
      
      if (shouldUseMock) {
        return mockRoles;
      }

      const result = await this.management.roles.getAll() as any;
      return result.data || result || [];
    } catch (error) {
      console.error('Error obteniendo roles de Auth0:', error);
      
      // Fallback to mock data on error
      console.warn('🔄 Fallback a datos mock de roles debido a error de Auth0');
      return mockRoles;
    }
  }

  /**
   * Obtener roles asignados a un usuario específico
   */
  async getUserRoles(userId: string): Promise<Auth0Role[]> {
    try {
      // Test connection first
      const shouldUseMock = await this.testConnectionAndFallback();
      
      if (shouldUseMock) {
        const userRoleIds = mockUserRoles[userId] || [];
        return mockRoles.filter(role => userRoleIds.includes(role.id!));
      }

      const result = await this.management.users.getRoles({ id: userId }) as any;
      return result.data || result || [];
    } catch (error) {
      console.error('Error obteniendo roles del usuario:', error);
      
      // Fallback to mock data
      console.warn('🔄 Fallback a datos mock de roles de usuario debido a error de Auth0');
      const userRoleIds = mockUserRoles[userId] || [];
      return mockRoles.filter(role => userRoleIds.includes(role.id!));
    }
  }

  /**
   * Asignar roles a un usuario
   */
  async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
    try {
      await this.management.users.assignRoles(
        { id: userId },
        { roles: roleIds }
      );
    } catch (error) {
      console.error('Error asignando roles al usuario:', error);
      throw new Error('Error al asignar roles al usuario');
    }
  }

  /**
   * Remover roles de un usuario
   */
  async removeRolesFromUser(userId: string, roleIds: string[]): Promise<void> {
    try {
      // Intentar con diferentes métodos según la versión de la API
      if ((this.management.users as any).removeRoles) {
        await (this.management.users as any).removeRoles(
          { id: userId },
          { roles: roleIds }
        );
      } else {
        // Fallback: usar la API directa
        console.warn('Método removeRoles no disponible, usando implementación alternativa');
        throw new Error('Método removeRoles no disponible en esta versión de Auth0');
      }
    } catch (error) {
      console.error('Error removiendo roles del usuario:', error);
      throw new Error('Error al remover roles del usuario');
    }
  }

  /**
   * Obtener usuarios de un rol específico
   */
  async getUsersInRole(roleId: string, page: number = 0, perPage: number = 25): Promise<{
    users: Auth0User[];
    total: number;
  }> {
    try {
      const result = await this.management.roles.getUsers({
        id: roleId,
        page,
        per_page: perPage,
        include_totals: true
      }) as any;

      return {
        users: result.data?.users || result.users || [],
        total: result.data?.total || result.total || 0
      };
    } catch (error) {
      console.error('Error obteniendo usuarios del rol:', error);
      throw new Error('Error al obtener usuarios del rol');
    }
  }

  /**
   * Actualizar roles de un usuario (reemplaza todos los roles existentes)
   */
  async updateUserRoles(userId: string, newRoleIds: string[]): Promise<void> {
    try {
      // Primero obtenemos los roles actuales del usuario
      const currentRoles = await this.getUserRoles(userId);
      const currentRoleIds = currentRoles.map(role => role.id!).filter(Boolean);

      // Identificamos roles a remover y roles a agregar
      const rolesToRemove = currentRoleIds.filter(roleId => !newRoleIds.includes(roleId));
      const rolesToAdd = newRoleIds.filter(roleId => !currentRoleIds.includes(roleId));

      // Intentar remover roles (si está disponible)
      if (rolesToRemove.length > 0) {
        try {
          await this.removeRolesFromUser(userId, rolesToRemove);
        } catch (error) {
          console.warn('No se pudieron remover roles anteriores:', error);
        }
      }

      // Agregamos nuevos roles
      if (rolesToAdd.length > 0) {
        await this.assignRolesToUser(userId, rolesToAdd);
      }
    } catch (error) {
      console.error('Error actualizando roles del usuario:', error);
      throw new Error('Error al actualizar roles del usuario');
    }
  }

  /**
   * Buscar usuarios por query
   */
  async searchUsers(query: string, page: number = 0, perPage: number = 25): Promise<{
    users: Auth0User[];
    total: number;
  }> {
    try {
      const result = await this.management.users.getAll({
        search_engine: 'v3',
        q: query,
        page,
        per_page: perPage,
        include_totals: true
      }) as any;

      return {
        users: result.data?.users || result.users || [],
        total: result.data?.total || result.total || 0
      };
    } catch (error) {
      console.error('Error buscando usuarios:', error);
      throw new Error('Error al buscar usuarios');
    }
  }
}

// Singleton instance
export const auth0ManagementService = new Auth0ManagementService();