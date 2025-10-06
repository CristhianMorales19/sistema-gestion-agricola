import { User } from '../entities/User';

// Repositorio abstracto (puerto) - Define el contrato
export interface AuthRepository {
  // Métodos de autenticación
  login(email?: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshUserData(): Promise<User>;
  
  // Métodos de Auth0
  loginWithAuth0(): Promise<void>;
  getAuth0Token(): Promise<string>;
  
  // Métodos de demostración
  loginWithDemoRole(roleName: string): Promise<User>;
}

// Repositorio para obtener permisos desde el backend
export interface PermissionsRepository {
  getUserPermissions(userId: string): Promise<User>;
  validateToken(token: string): Promise<boolean>;
}
