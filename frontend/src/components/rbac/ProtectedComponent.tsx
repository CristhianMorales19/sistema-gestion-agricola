import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { UserPermissions } from '../../auth/types';

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredPermission?: keyof UserPermissions;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

// Componente para proteger cualquier contenido por permiso
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback = null
}) => {
  const { hasPermission, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si se requiere un permiso específico
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Si se requiere un rol específico
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Hook personalizado para verificar permisos
export const usePermissions = () => {
  const { hasPermission, hasRole, user } = useAuth();

  return {
    hasPermission,
    hasRole,
    user,
    // Funciones de conveniencia para permisos comunes
    canManageUsers: () => hasPermission('gestionar_usuarios'),
    canViewUsers: () => hasPermission('consultar_usuarios'),
    canManagePersonal: () => hasPermission('gestionar_personal'),
    canViewPersonal: () => hasPermission('consultar_personal'),
    canManageAttendance: () => hasPermission('gestionar_asistencia'),
    canViewAttendance: () => hasPermission('consultar_asistencia'),
    canManagePayroll: () => hasPermission('gestionar_nomina'),
    canViewPayroll: () => hasPermission('consultar_nomina'),
    canManageProductivity: () => hasPermission('gestionar_productividad'),
    canViewProductivity: () => hasPermission('consultar_productividad'),
    canManageReports: () => hasPermission('gestionar_reportes'),
    canViewReports: () => hasPermission('consultar_reportes'),
    canManageSettings: () => hasPermission('gestionar_configuracion'),
    canViewSettings: () => hasPermission('consultar_configuracion'),
    // Verificación por roles
    isAdmin: () => hasRole('Administrador del Sistema'),
    isHRManager: () => hasRole('Gerente de RRHH'),
    isSupervisor: () => hasRole('Supervisor de Campo'),
    isEmployee: () => hasRole('Empleado')
  };
};
