import { User } from '../entities/User';
import { AuthRepository } from '../repositories/AuthRepository';

// Caso de uso: Iniciar sesión con Auth0
export class LoginUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email?: string): Promise<User> {
    try {
      // Si se proporciona email, intentar login directo
      if (email) {
        return await this.authRepository.login(email);
      }
      
      // Si no, usar Auth0
      await this.authRepository.loginWithAuth0();
      return await this.authRepository.getCurrentUser() as User;
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error}`);
    }
  }
}

// Caso de uso: Iniciar sesión con rol de demostración
export class LoginWithDemoRoleUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(roleName: string): Promise<User> {
    try {
      return await this.authRepository.loginWithDemoRole(roleName);
    } catch (error) {
      throw new Error(`Error al iniciar sesión con rol demo: ${error}`);
    }
  }
}

// Caso de uso: Cerrar sesión
export class LogoutUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    try {
      await this.authRepository.logout();
    } catch (error) {
      throw new Error(`Error al cerrar sesión: ${error}`);
    }
  }
}

// Caso de uso: Obtener usuario actual
export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    try {
      return await this.authRepository.getCurrentUser();
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }
}

// Caso de uso: Refrescar datos del usuario
export class RefreshUserDataUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User> {
    try {
      return await this.authRepository.refreshUserData();
    } catch (error) {
      throw new Error(`Error al refrescar datos del usuario: ${error}`);
    }
  }
}
