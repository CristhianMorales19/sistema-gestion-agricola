import { User, UserEntity } from '../../domain/entities/User';
import { 
  LoginUserUseCase, 
  LoginWithDemoRoleUseCase,
  LogoutUserUseCase, 
  GetCurrentUserUseCase,
  RefreshUserDataUseCase 
} from '../../domain/use-cases/AuthUseCases';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

// Servicio de aplicación que orquesta los casos de uso
export class AuthService {
  private loginUserUseCase: LoginUserUseCase;
  private loginWithDemoRoleUseCase: LoginWithDemoRoleUseCase;
  private logoutUserUseCase: LogoutUserUseCase;
  private getCurrentUserUseCase: GetCurrentUserUseCase;
  private refreshUserDataUseCase: RefreshUserDataUseCase;

  constructor(authRepository: AuthRepository) {
    this.loginUserUseCase = new LoginUserUseCase(authRepository);
    this.loginWithDemoRoleUseCase = new LoginWithDemoRoleUseCase(authRepository);
    this.logoutUserUseCase = new LogoutUserUseCase(authRepository);
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
    this.refreshUserDataUseCase = new RefreshUserDataUseCase(authRepository);
  }

  // Métodos públicos que expone el servicio
  async login(email?: string): Promise<User> {
    return this.loginUserUseCase.execute(email);
  }

  async loginWithDemoRole(roleName: string): Promise<User> {
    return this.loginWithDemoRoleUseCase.execute(roleName);
  }

  async logout(): Promise<void> {
    return this.logoutUserUseCase.execute();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.getCurrentUserUseCase.execute();
  }

  async refreshUserData(): Promise<User> {
    return this.refreshUserDataUseCase.execute();
  }

  // Métodos de conveniencia para la UI
  async hasPermission(user: User | null, permission: string): Promise<boolean> {
    if (!user || !(user instanceof UserEntity)) return false;
    return user.hasPermission(permission);
  }

  async hasRole(user: User | null, roleName: string): Promise<boolean> {
    if (!user || !(user instanceof UserEntity)) return false;
    return user.hasRole(roleName);
  }

  async canAccessModule(user: User | null, module: string): Promise<boolean> {
    if (!user || !(user instanceof UserEntity)) return false;
    return user.canAccessModule(module);
  }
}
