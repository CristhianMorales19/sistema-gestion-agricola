import { ManagementClient } from 'auth0';
import { auth0Config } from '../../../../shared/infrastructure/config/auth0.config';

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
 */
export class Auth0ManagementService {
  private management: ManagementClient;
  private isInitialized: boolean = false;

  constructor() {
    try {
      // Validar configuración antes de crear el cliente
      this.validateConfig();
      
      this.management = new ManagementClient({
        domain: auth0Config.domain,
        clientId: auth0Config.clientId,
        clientSecret: auth0Config.clientSecret
      });

      this.isInitialized = true;
      console.log('✅ Auth0ManagementService inicializado correctamente');
    } catch (error: any) {
      console.error('❌ Error inicializando Auth0ManagementService:', error.message);
      throw error;
    }
  }

  /**
   * Validar configuración de Auth0
   */
  private validateConfig(): void {
    const errors: string[] = [];

    if (!auth0Config.domain) {
      errors.push('AUTH0_DOMAIN no está definido');
    }
    if (!auth0Config.clientId) {
      errors.push('AUTH0_CLIENT_ID no está definido');
    }
    if (!auth0Config.clientSecret) {
      errors.push('AUTH0_CLIENT_SECRET no está definido');
    }

    if (errors.length > 0) {
      throw new Error(`Error de configuración de Auth0:\n  - ${errors.join('\n  - ')}`);
    }
  }

  /**
   * Verificar si el servicio está inicializado correctamente
   */
  private checkInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Auth0ManagementService no está inicializado correctamente. Verifica las variables de entorno.');
    }
  }

  /**
   * Obtener todos los usuarios de Auth0
   */
  async getUsers(page = 0, perPage = 25): Promise<{
    users: Auth0User[];
    total: number;
    start: number;
    limit: number;
  }> {
    this.checkInitialized();
    
    try {
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
    } catch (error: any) {
      console.error('Error obteniendo usuarios de Auth0:', error);
      throw new Error(`Error al obtener usuarios de Auth0: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Obtener un usuario específico por ID
   */
  async getUserById(userId: string): Promise<Auth0User> {
    this.checkInitialized();
    
    try {
      const user = await this.management.users.get({ id: userId }) as any;
      return user.data || user;
    } catch (error: any) {
      console.error('Error obteniendo usuario por ID:', error);
      throw new Error(`Usuario no encontrado: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Obtener todos los roles disponibles en Auth0
   */
  async getRoles(): Promise<Auth0Role[]> {
    this.checkInitialized();
    
    try {
      const result = await this.management.roles.getAll() as any;
      return result.data || result || [];
    } catch (error: any) {
      console.error('Error obteniendo roles de Auth0:', error);
      throw new Error(`Error al obtener roles de Auth0: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Obtener roles asignados a un usuario específico
   */
  async getUserRoles(userId: string): Promise<Auth0Role[]> {
    this.checkInitialized();
    
    try {
      const result = await this.management.users.getRoles({ id: userId }) as any;
      return result.data || result || [];
    } catch (error: any) {
      console.error('Error obteniendo roles del usuario:', error);
      throw new Error(`Error al obtener roles del usuario: ${error.message || 'Unknown error'}`);
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
    } catch (error: any) {
      console.error('Error asignando roles al usuario:', error);
      throw new Error(`Error al asignar roles al usuario: ${error.message || 'Unknown error'}`);
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
        console.warn('Método removeRoles no disponible, usando implementación alternativa');
        throw new Error('Método removeRoles no disponible en esta versión de Auth0');
      }
    } catch (error: any) {
      console.error('Error removiendo roles del usuario:', error);
      throw new Error(`Error al remover roles del usuario: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Obtener usuarios de un rol específico
   */
  async getUsersInRole(roleId: string, page = 0, perPage = 25): Promise<{
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
    } catch (error: any) {
      console.error('Error obteniendo usuarios del rol:', error);
      throw new Error(`Error al obtener usuarios del rol: ${error.message || 'Unknown error'}`);
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
    } catch (error: any) {
      console.error('Error actualizando roles del usuario:', error);
      throw new Error(`Error al actualizar roles del usuario: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Buscar usuarios por query
   */
  async searchUsers(query: string, page = 0, perPage = 25): Promise<{
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
    } catch (error: any) {
      console.error('Error buscando usuarios:', error);
      throw new Error(`Error al buscar usuarios: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Crear un nuevo usuario en Auth0
   */
  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    connection: string;
  }): Promise<Auth0User> {
    try {
      const result = await this.management.users.create({
        email: userData.email,
        name: userData.name,
        password: userData.password,
        connection: userData.connection,
        email_verified: false
      }) as any;

      return result.data || result;
    } catch (error: any) {
      console.error('Error creando usuario en Auth0:', error);
      throw new Error(`Error al crear usuario en Auth0: ${error.message || 'Unknown error'}`);
    }
  }
}

// Singleton instance
export const auth0ManagementService = new Auth0ManagementService();