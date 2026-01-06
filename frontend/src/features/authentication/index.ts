// Exportaciones principales del módulo de autenticación

// Domain
export type { User } from './domain/entities/User';
export type { Role, Permission } from './domain/entities/Role';
export { UserEntity } from './domain/entities/User';
export { RoleEntity, SYSTEM_ROLES, ROLE_CONFIG } from './domain/entities/Role';

// Application
export { useAuth } from './application/hooks/useAuth';
export { AuthService } from './application/services/AuthService';

// Infrastructure  
export { Auth0Repository } from './infrastructure/auth0/Auth0Repository';

// Presentation
export { LoginPage } from './presentation/components/LoginPage';
export { ProtectedRoute } from './presentation/components/ProtectedRoute';
export { AdminDashboard } from './presentation/components/AdminDashboard';
export { CallbackPage } from './presentation/components/CallbackPage';
