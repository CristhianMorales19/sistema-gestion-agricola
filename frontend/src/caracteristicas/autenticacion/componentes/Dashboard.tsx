import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Logout,
  Agriculture,
  Person,
  AdminPanelSettings,
  SupervisorAccount,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const getRoleIcon = () => {
    switch (user?.rol) {
      case 'ADMIN':
        return <AdminPanelSettings />;
      case 'SUPERVISOR':
        return <SupervisorAccount />;
      default:
        return <Person />;
    }
  };

  const getRoleLabel = () => {
    switch (user?.rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'SUPERVISOR':
        return 'Supervisor';
      default:
        return 'Empleado';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Barra de navegación */}
      <AppBar position="static">
        <Toolbar>
          <Agriculture sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema Gestión Agrícola
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.nombre} {user?.apellido}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<Logout />}
          >
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Información del usuario */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {getRoleIcon()}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user?.nombre} {user?.apellido}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="bold">
                  {getRoleLabel()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Mensaje de bienvenida */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom color="primary">
                  ¡Bienvenido al Sistema!
                </Typography>
                <Typography variant="body1" paragraph>
                  Has iniciado sesión exitosamente en el Sistema de Gestión Agrícola.
                </Typography>
                <Typography variant="body1" paragraph>
                  Como <strong>{getRoleLabel()}</strong>, tienes acceso a las siguientes funcionalidades:
                </Typography>
                
                <Box component="ul" sx={{ pl: 2 }}>
                  {user?.rol === 'ADMIN' && (
                    <>
                      <Typography component="li" variant="body2">
                        Gestión completa de empleados
                      </Typography>
                      <Typography component="li" variant="body2">
                        Administración de usuarios y roles
                      </Typography>
                      <Typography component="li" variant="body2">
                        Reportes ejecutivos
                      </Typography>
                      <Typography component="li" variant="body2">
                        Configuración del sistema
                      </Typography>
                    </>
                  )}
                  
                  {user?.rol === 'SUPERVISOR' && (
                    <>
                      <Typography component="li" variant="body2">
                        Supervisión de asistencia
                      </Typography>
                      <Typography component="li" variant="body2">
                        Gestión de productividad
                      </Typography>
                      <Typography component="li" variant="body2">
                        Reportes departamentales
                      </Typography>
                    </>
                  )}

                  {user?.rol === 'EMPLEADO' && (
                    <>
                      <Typography component="li" variant="body2">
                        Ver información personal
                      </Typography>
                      <Typography component="li" variant="body2">
                        Registro de asistencia
                      </Typography>
                      <Typography component="li" variant="body2">
                        Consulta de nómina
                      </Typography>
                    </>
                  )}
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.contrastText">
                    <strong>✅ HU-0: Login de usuario - COMPLETADO</strong>
                  </Typography>
                  <Typography variant="caption" color="success.contrastText">
                    Sistema de autenticación implementado correctamente con JWT y roles.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;