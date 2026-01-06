import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../../application/hooks/useAuth';
import { LoginPage } from '../LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback
}) => {
  const { user, isLoading, isAuthenticated, hasPermission, hasRole } = useAuth();

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="textSecondary">
          Cargando...
        </Typography>
      </Box>
    );
  }

  // Si no está autenticado, mostrar página de login
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Verificar permiso específico si se requiere
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <>
        {fallback || (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              gap: 2,
              p: 3
            }}
          >
            <Typography variant="h5" color="error">
              Acceso Denegado
            </Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center">
              No tienes permisos para acceder a esta sección.
              <br />
              Permiso requerido: <strong>{requiredPermission}</strong>
            </Typography>
          </Box>
        )}
      </>
    );
  }

  // Verificar rol específico si se requiere
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <>
        {fallback || (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              gap: 2,
              p: 3
            }}
          >
            <Typography variant="h5" color="error">
              Acceso Denegado
            </Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center">
              No tienes el rol necesario para acceder a esta sección.
              <br />
              Rol requerido: <strong>{requiredRole}</strong>
            </Typography>
          </Box>
        )}
      </>
    );
  }

  // Si tiene los permisos/roles necesarios, mostrar el contenido
  return <>{children}</>;
};
