import { useAuth0 } from '@auth0/auth0-react';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { User, UserEntity } from '../../domain/entities/User';
import { RoleEntity, SYSTEM_ROLES, ROLE_CONFIG } from '../../domain/entities/Role';

// Implementación concreta del repositorio usando Auth0
export class Auth0Repository implements AuthRepository {
  constructor(
    private auth0: ReturnType<typeof useAuth0>,
    private apiBaseUrl: string
  ) {}

  async login(email?: string): Promise<User> {
    if (email) {
      // Login directo para usuarios demo
      return this.loginWithDemoEmail(email);
    }
    
    // Login normal con Auth0
    await this.auth0.loginWithRedirect();
    throw new Error('Redirigiendo a Auth0...');
  }

  async loginWithAuth0(): Promise<void> {
    await this.auth0.loginWithRedirect();
  }

  async logout(): Promise<void> {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.auth0.isAuthenticated || !this.auth0.user) {
      return null;
    }

    try {
      // Obtener permisos desde el backend
      console.log('🔑 Obteniendo token de Auth0...');
      const token = await this.auth0.getAccessTokenSilently();
      console.log('✅ Token obtenido:', token ? 'Sí' : 'No');
      console.log('🔍 Token (primeros 50 chars):', token?.substring(0, 50) + '...');
      
      // Probar primero con el endpoint público para debug
      console.log('🧪 Probando endpoint público primero...');
      const publicResponse = await fetch(`${this.apiBaseUrl}/auth/public`);
      console.log('📡 Endpoint público status:', publicResponse.status);
      
      const response = await fetch(`${this.apiBaseUrl}/auth/protected`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🌐 Respuesta del backend:', response.status);

      if (!response.ok) {
        throw new Error('Error al obtener perfil del usuario');
      }

      const backendResponse = await response.json();
      
      console.log('🔍 DEBUG - Respuesta completa del backend:', backendResponse);
      console.log('🔍 DEBUG - backendResponse.success:', backendResponse.success);
      console.log('🔍 DEBUG - backendResponse.user:', backendResponse.user);
      
      // El backend devuelve { success: true, user: {...} }
      if (backendResponse.success && backendResponse.user) {
        const mappedUser = this.mapToUserEntity(backendResponse.user);
        console.log('✅ DEBUG - Usuario mapeado:', mappedUser);
        return mappedUser;
      } else {
        console.log('❌ DEBUG - Respuesta inválida del backend:', backendResponse);
        throw new Error('Respuesta inválida del backend');
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  async refreshUserData(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    return user;
  }

  async getAuth0Token(): Promise<string> {
    return await this.auth0.getAccessTokenSilently();
  }

  async loginWithDemoRole(roleName: string): Promise<User> {
    // Simular login con rol específico
    const roleConfig = ROLE_CONFIG[roleName];
    if (!roleConfig) {
      throw new Error(`Rol no encontrado: ${roleName}`);
    }

    return this.loginWithDemoEmail(roleConfig.email);
  }

  private async loginWithDemoEmail(email: string): Promise<User> {
    // Determinar rol basado en el email
    const roleName = this.getRoleFromEmail(email);
    const roleConfig = ROLE_CONFIG[roleName];
    
    if (!roleConfig) {
      throw new Error(`No se puede determinar el rol para el email: ${email}`);
    }

    // Simular respuesta del backend con permisos
    const mockUser = {
      id: `demo-${email.split('@')[0]}`,
      email,
      name: this.getNameFromRole(roleName),
      picture: `https://ui-avatars.com/api/?name=${this.getNameFromRole(roleName)}&background=${roleConfig.color.substring(1)}&color=fff`,
      roles: [{
        id: roleName.toLowerCase().replace(/\s+/g, '_'),
        name: roleName,
        displayName: roleName,
        description: roleConfig.description,
        color: roleConfig.color,
        icon: roleConfig.icon,
        permissions: this.getPermissionsForRole(roleName),
        isActive: true
      }],
      permisos: this.getPermissionsMapForRole(roleName),
      isActive: true,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    return this.mapToUserEntity(mockUser);
  }

  private getRoleFromEmail(email: string): string {
    if (email.includes('admin')) return SYSTEM_ROLES.ADMIN;
    if (email.includes('manager')) return SYSTEM_ROLES.FARM_MANAGER;
    if (email.includes('supervisor')) return SYSTEM_ROLES.FIELD_SUPERVISOR;
    if (email.includes('worker')) return SYSTEM_ROLES.FIELD_WORKER;
    return SYSTEM_ROLES.FIELD_WORKER; // Default
  }

  private getNameFromRole(roleName: string): string {
    const names: Record<string, string> = {
      [SYSTEM_ROLES.ADMIN]: 'Juan Pérez (Admin)',
      [SYSTEM_ROLES.FARM_MANAGER]: 'María García (Gerente)',
      [SYSTEM_ROLES.FIELD_SUPERVISOR]: 'Carlos Rodríguez (Supervisor)',
      [SYSTEM_ROLES.FIELD_WORKER]: 'Ana López (Trabajadora)'
    };
    return names[roleName] || 'Usuario Demo';
  }

  private getPermissionsForRole(roleName: string) {
    // Mapeo de permisos según el rol (basado en la matriz RBAC del backend)
    const rolePermissions: Record<string, any[]> = {
      [SYSTEM_ROLES.ADMIN]: [
        { id: '1', name: 'gestionar_usuarios', description: 'Gestionar usuarios', module: 'usuarios' },
        { id: '2', name: 'consultar_usuarios', description: 'Consultar usuarios', module: 'usuarios' },
        { id: '3', name: 'gestionar_personal', description: 'Gestionar personal', module: 'personal' },
        { id: '4', name: 'consultar_personal', description: 'Consultar personal', module: 'personal' },
        { id: '5', name: 'gestionar_configuracion', description: 'Gestionar configuración', module: 'configuracion' }
      ],
      [SYSTEM_ROLES.FARM_MANAGER]: [
        { id: '3', name: 'gestionar_personal', description: 'Gestionar personal', module: 'personal' },
        { id: '4', name: 'consultar_personal', description: 'Consultar personal', module: 'personal' },
        { id: '7', name: 'gestionar_nomina', description: 'Gestionar nómina', module: 'nomina' },
        { id: '8', name: 'consultar_reportes', description: 'Consultar reportes', module: 'reportes' }
      ],
      [SYSTEM_ROLES.FIELD_SUPERVISOR]: [
        { id: '4', name: 'consultar_personal', description: 'Consultar personal', module: 'personal' },
        { id: '5', name: 'gestionar_asistencia', description: 'Gestionar asistencia', module: 'asistencia' },
        { id: '6', name: 'gestionar_productividad', description: 'Gestionar productividad', module: 'productividad' }
      ],
      [SYSTEM_ROLES.FIELD_WORKER]: [
        { id: '6', name: 'consultar_asistencia', description: 'Consultar asistencia', module: 'asistencia' },
        { id: '7', name: 'consultar_productividad', description: 'Consultar productividad', module: 'productividad' }
      ]
    };

    return rolePermissions[roleName] || [];
  }

  private getPermissionsMapForRole(roleName: string) {
    const permissions = this.getPermissionsForRole(roleName);
    const permissionsMap: Record<string, boolean> = {
      gestionar_usuarios: false,
      consultar_usuarios: false,
      gestionar_personal: false,
      consultar_personal: false,
      gestionar_asistencia: false,
      consultar_asistencia: false,
      gestionar_nomina: false,
      consultar_nomina: false,
      gestionar_productividad: false,
      consultar_productividad: false,
      gestionar_reportes: false,
      consultar_reportes: false,
      gestionar_configuracion: false,
      consultar_configuracion: false
    };

    permissions.forEach(permission => {
      permissionsMap[permission.name] = true;
    });

    return permissionsMap;
  }

  private mapToUserEntity(userData: any): User {
    // Por ahora, crear un rol de administrador por defecto basado en los permisos
    // TODO: Implementar consulta real a la base de datos para obtener roles
    const adminRole = new RoleEntity(
      '1',
      'admin',
      'Administrador del Sistema', 
      'Acceso completo al sistema',
      '#1976d2',
      'admin_panel_settings',
      userData.permissions || [],
      true
    );

    return new UserEntity(
      userData.sub || '1',
      userData.email || 'usuario@ejemplo.com',
      userData.email?.split('@')[0] || 'Usuario',
      [adminRole],
      true,
      new Date(),
      userData.picture,
      new Date()
    );
  }
}
