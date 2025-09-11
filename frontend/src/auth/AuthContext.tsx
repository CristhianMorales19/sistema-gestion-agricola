import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AuthContextType, AuthUser, UserPermissions } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user: auth0User, 
    isAuthenticated: auth0IsAuthenticated, 
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener permisos del backend
  const fetchUserPermissions = async (auth0User: any) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error al obtener permisos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth0IsAuthenticated && auth0User) {
      fetchUserPermissions(auth0User);
    } else {
      setUser(null);
      setIsLoading(auth0IsLoading);
    }
  }, [auth0IsAuthenticated, auth0User]);

  const hasPermission = (permiso: keyof UserPermissions) => {
    return user?.permisos?.[permiso] || false;
  };

  const hasRole = (roleName: string) => {
    return user?.roles?.some(role => role.nombre === roleName) || false;
  };

  const login = async () => {
    await loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: auth0IsAuthenticated,
      hasPermission,
      hasRole,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
