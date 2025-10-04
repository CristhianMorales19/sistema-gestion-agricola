import React, { useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { LockOutlined, ErrorOutline } from '@mui/icons-material';

interface ProtectedRouteProps {
  children: any;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  requiredRole?: string;
  fallback?: React.ComponentType;
}

// Componente de carga
const LoadingComponent = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    gap={2}
  >
    <CircularProgress size={40} />
    <Typography variant="body1" color="textSecondary">
      Cargando permisos de usuario...
    </Typography>
  </Box>
);

// Handler para volver atrás en el historial
const handleGoBack = () => {
  window.history.back();
};

// Componente de acceso denegado
const AccessDeniedComponent = ({ reason }: { reason: string }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    gap={2}
    p={3}
  >
    <LockOutlined sx={{ fontSize: 48, color: 'error.main' }} />
    <Typography variant="h6" color="error">
      Acceso Denegado
    </Typography>
    <Typography variant="body1" color="textSecondary" textAlign="center">
      {reason}
    </Typography>
    <Button
      variant="outlined"
      onClick={handleGoBack}
      sx={{ mt: 2 }}
    >
      Volver
    </Button>
  </Box>
);

// Componente de error
const ErrorComponent = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    gap={2}
    p={3}
  >
    <ErrorOutline sx={{ fontSize: 48, color: 'warning.main' }} />
    <Typography variant="h6" color="warning.main">
      Error al cargar permisos
    </Typography>
    <Typography variant="body1" color="textSecondary" textAlign="center">
      {error}
    </Typography>
    <Button
      variant="contained"
      onClick={onRetry}
      sx={{ mt: 2 }}
    >
      Reintentar
    </Button>
  </Box>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback: FallbackComponent
}) => {
  const {
    isAuthenticated,
    isLoading,
    userProfile,
    isLoadingProfile,
    profileError,
    hasPermission,
    hasRole,
    refetchProfile,
    loginWithRedirect
  } = useAuthContext();

  // Memoizar el handler de reintento
  const handleRetry = useCallback(() => {
    refetchProfile();
  }, [refetchProfile]);

  // Si Auth0 está cargando
  if (isLoading) {
    return <LoadingComponent />;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    loginWithRedirect();
    return <LoadingComponent />;
  }

  // Si el perfil está cargando
  if (isLoadingProfile) {
    return <LoadingComponent />;
  }

  // Si hay error en el perfil
  if (profileError) {
    return (
      <ErrorComponent
        error={profileError.message}
        onRetry={handleRetry}
      />
    );
  }

  // Si no hay perfil de usuario
  if (!userProfile) {
    return (
      <AccessDeniedComponent
        reason="No se encontró el perfil de usuario en el sistema. Contacte al administrador."
      />
    );
  }

  // Si el usuario no está activo
  if (!userProfile.activo) {
    return (
      <AccessDeniedComponent
        reason="Su cuenta está desactivada. Contacte al administrador."
      />
    );
  }

  // Verificar permiso específico
  if (requiredPermission) {
    const hasRequiredPermission = hasPermission(
      requiredPermission.resource,
      requiredPermission.action
    );

    if (!hasRequiredPermission) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <AccessDeniedComponent
          reason={`No tiene permisos para realizar la acción "${requiredPermission.action}" en "${requiredPermission.resource}".`}
        />
      );
    }
  }

  // Verificar rol específico
  if (requiredRole) {
    const hasRequiredRole = hasRole(requiredRole);

    if (!hasRequiredRole) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <AccessDeniedComponent
          reason={`No tiene el rol "${requiredRole}" requerido para acceder a esta sección.`}
        />
      );
    }
  }

  // Si pasa todas las validaciones, mostrar el contenido
  return <>{children}</>;
};

// Hook para verificar permisos sin renderizado condicional
export const usePermissionCheck = () => {
  const { hasPermission, hasRole, userProfile } = useAuthContext();

  const checkPermission = (resource: string, action: string): boolean => {
    return hasPermission(resource, action);
  };

  const checkRole = (roleName: string): boolean => {
    return hasRole(roleName);
  };

  const checkMultiplePermissions = (permissions: Array<{ resource: string; action: string }>): boolean => {
    return permissions.every(permission => 
      hasPermission(permission.resource, permission.action)
    );
  };

  const checkAnyPermission = (permissions: Array<{ resource: string; action: string }>): boolean => {
    return permissions.some(permission => 
      hasPermission(permission.resource, permission.action)
    );
  };

  return {
    checkPermission,
    checkRole,
    checkMultiplePermissions,
    checkAnyPermission,
    userProfile,
    isActive: userProfile?.activo || false
  };
};

export default ProtectedRoute;
