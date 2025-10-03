import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, UserEntity } from '../../domain/entities/User';
import { AuthService } from '../services/AuthService';
import { Auth0Repository } from '../../infrastructure/auth0/Auth0Repository';

// Hook personalizado para autenticación
export const useAuth = () => {
  const auth0 = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configurar servicios con useMemo para evitar recreaciones
  const authService = useMemo(() => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    const authRepository = new Auth0Repository(auth0, apiBaseUrl);
    return new AuthService(authRepository);
  }, [auth0]);

  // Cargar usuario cuando cambie el estado de Auth0
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        if (auth0.isAuthenticated) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar usuario');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (!auth0.isLoading) {
      loadUser();
    }
  }, [auth0.isAuthenticated, auth0.isLoading, authService]);

  // Funciones de autenticación
  const login = useCallback(async (email?: string) => {
    try {
      setError(null);
      const loggedUser = await authService.login(email);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [authService]);

  const loginWithDemoRole = useCallback(async (roleName: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const loggedUser = await authService.loginWithDemoRole(roleName);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión con rol demo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
    }
  }, [authService]);

  const refreshUser = useCallback(async () => {
    try {
      setError(null);
      const refreshedUser = await authService.refreshUserData();
      setUser(refreshedUser);
      return refreshedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al refrescar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [authService]);

  // Funciones de conveniencia para permisos
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !(user instanceof UserEntity)) return false;
    return user.hasPermission(permission);
  }, [user]);

  const hasRole = useCallback((roleName: string): boolean => {
    if (!user || !(user instanceof UserEntity)) return false;
    return user.hasRole(roleName);
  }, [user]);

  const canAccessModule = useCallback((module: string): boolean => {
    if (!user || !(user instanceof UserEntity)) return false;
    return user.canAccessModule(module);
  }, [user]);

  return {
    // Estado
    user,
    isLoading: isLoading || auth0.isLoading,
    isAuthenticated: Boolean(user),
    error,

    // Acciones
    login,
    loginWithDemoRole,
    logout,
    refreshUser,

    // Permisos
    hasPermission,
    hasRole,
    canAccessModule,

    // Funciones de conveniencia para roles específicos
    isAdmin: () => hasRole('Administrador del Sistema'),
    isFarmManager: () => hasRole('Gerente de Granja'),
    isFieldSupervisor: () => hasRole('Supervisor de Campo'),
    isFieldWorker: () => hasRole('Trabajador de Campo'),

    // Funciones de conveniencia para permisos específicos
    canManageUsers: () => hasPermission('gestionar_usuarios'),
    canViewUsers: () => hasPermission('consultar_usuarios'),
    canManagePersonnel: () => hasPermission('gestionar_personal'),
    canViewPersonnel: () => hasPermission('consultar_personal'),
    canManageAttendance: () => hasPermission('gestionar_asistencia'),
    canViewAttendance: () => hasPermission('consultar_asistencia'),
    canManagePayroll: () => hasPermission('gestionar_nomina'),
    canViewPayroll: () => hasPermission('consultar_nomina'),
    canManageProductivity: () => hasPermission('gestionar_productividad'),
    canViewProductivity: () => hasPermission('consultar_productividad'),
    canManageReports: () => hasPermission('gestionar_reportes'),
    canViewReports: () => hasPermission('consultar_reportes'),
    canManageSettings: () => hasPermission('gestionar_configuracion'),
    canViewSettings: () => hasPermission('consultar_configuracion')
  };
};
