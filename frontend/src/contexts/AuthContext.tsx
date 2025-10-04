import React, { createContext, useContext } from 'react';
import { useAuth0, User } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from '../config/auth0.config';

// Tipos para permisos y roles
export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface UserProfile {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  roles: Role[];
  permissions: Permission[];
  activo: boolean;
}

interface AuthContextType {
  // Auth0 básico
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithRedirect: () => void;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;
  
  // Perfil de usuario desde la BD
  userProfile: UserProfile | undefined;
  isLoadingProfile: boolean;
  profileError: Error | null;
  
  // Funciones de utilidad
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
  refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: any;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    isAuthenticated,
    isLoading: auth0Loading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();

  // Función para obtener el perfil del usuario desde la BD
  const fetchUserProfile = React.useCallback(async (): Promise<UserProfile> => {
    if (!isAuthenticated || !user?.email) {
      throw new Error('Usuario no autenticado');
    }

    const token = await getAccessTokenSilently();
    
    const response = await axios.get(
      `${apiConfig.baseURL}/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }, [isAuthenticated, user?.email, getAccessTokenSilently]);

  // Query para obtener el perfil del usuario
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: fetchUserProfile,
    enabled: isAuthenticated && Boolean(user?.email),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Función para verificar permisos
  const hasPermission = React.useCallback((resource: string, action: string): boolean => {
    if (!userProfile || !userProfile.permissions) return false;
    
    return userProfile.permissions.some(
      (permission: Permission) => 
        permission.resource === resource && 
        permission.action === action
    );
  }, [userProfile]);

  // Función para verificar roles
  const hasRole = React.useCallback((roleName: string): boolean => {
    if (!userProfile || !userProfile.roles) return false;
    
    return userProfile.roles.some((role: Role) => role.name === roleName);
  }, [userProfile]);

  // Función de logout personalizada
  const logout = React.useCallback(() => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }, [auth0Logout]);

  const contextValue: AuthContextType = {
    // Auth0 básico
    user,
    isAuthenticated,
    isLoading: auth0Loading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    
    // Perfil de usuario
    userProfile,
    isLoadingProfile,
    profileError: profileError as Error | null,
    
    // Funciones de utilidad
    hasPermission,
    hasRole,
    refetchProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
