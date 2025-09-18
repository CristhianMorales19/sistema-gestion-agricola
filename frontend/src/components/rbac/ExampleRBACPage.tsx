import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Button,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { ProtectedComponent, usePermissions } from './ProtectedComponent';

// Ejemplo de página que se adapta según permisos
export const ExampleRBACPage: React.FC = () => {
  const { user, hasPermission } = usePermissions();

  return (
    <Box>
      {/* Header de la página */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Personal
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Página de ejemplo que muestra cómo implementar RBAC
        </Typography>
      </Box>

      {/* Información del usuario actual */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tu información
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Usuario:</strong> {user?.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Email:</strong> {user?.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Roles:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {user?.roles?.map((role) => (
                  <Chip 
                    key={role.id} 
                    label={role.nombre} 
                    color="primary" 
                    size="small" 
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Acciones disponibles según permisos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones disponibles para ti
          </Typography>
          <Grid container spacing={2}>
            {/* Botón para gestionar personal */}
            <ProtectedComponent requiredPermission="gestionar_personal">
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => alert('Gestionar personal')}
                >
                  Gestionar Personal
                </Button>
              </Grid>
            </ProtectedComponent>

            {/* Botón para consultar personal */}
            <ProtectedComponent requiredPermission="consultar_personal">
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => alert('Consultar personal')}
                >
                  Consultar Personal
                </Button>
              </Grid>
            </ProtectedComponent>

            {/* Botón para gestionar usuarios (solo admin) */}
            <ProtectedComponent requiredPermission="gestionar_usuarios">
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => alert('Gestionar usuarios')}
                >
                  Gestionar Usuarios
                </Button>
              </Grid>
            </ProtectedComponent>
          </Grid>

          {/* Mensaje si no tiene permisos */}
          {!hasPermission('gestionar_personal') && !hasPermission('consultar_personal') && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              No tienes permisos para realizar acciones en esta sección.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* FAB para agregar (solo si tiene permisos de gestión) */}
      <ProtectedComponent requiredPermission="gestionar_personal">
        <Fab
          color="primary"
          aria-label="agregar"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => alert('Agregar nuevo empleado')}
        >
          <AddIcon />
        </Fab>
      </ProtectedComponent>

      {/* Lista de permisos para debugging */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tus permisos (para desarrollo)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {user?.permisos && Object.entries(user.permisos).map(([permiso, tiene]) => (
              <Chip 
                key={permiso}
                label={permiso}
                color={tiene ? 'success' : 'default'}
                variant={tiene ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
