// Exportar todos los componentes RBAC para que otros miembros los puedan importar fácilmente

// Contexto y tipos
export { AuthProvider, useAuth } from '../../auth/AuthContext';
export type { AuthUser, UserPermissions, UserRole, AuthContextType } from '../../auth/types';

// Componentes RBAC
export { ProtectedComponent, usePermissions } from './ProtectedComponent';
export { RBACNavigation } from './RBACNavigation';
export { RBACLayout } from './RBACLayout';
export { ExampleRBACPage } from './ExampleRBACPage';

// Configuración
export { auth0Config, apiConfig } from '../../config/auth0';
