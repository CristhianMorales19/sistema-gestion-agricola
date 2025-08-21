import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Person,
  Business,
  Work,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../caracteristicas/autenticacion/context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'ADMIN':
        return 'error';
      case 'SUPERVISOR':
        return 'warning';
      case 'EMPLEADO':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'SUPERVISOR':
        return 'Supervisor';
      case 'EMPLEADO':
        return 'Empleado';
      default:
        return rol;
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const stats = [
    {
      title: 'Empleados Activos',
      value: '24',
      icon: <Person />,
      color: 'primary',
    },
    {
      title: 'Departamentos',
      value: '4',
      icon: <Business />,
      color: 'secondary',
    },
    {
      title: 'Cargos Activos',
      value: '8',
      icon: <Work />,
      color: 'success',
    },
    {
      title: 'Asistencias Hoy',
      value: '18',
      icon: <Schedule />,
      color: 'info',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Bienvenida */}
      <Box mb={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                <Person sx={{ fontSize: 32 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h4" gutterBottom>
                  {getWelcomeMessage()}, {user?.nombre}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Chip
                  label={getRoleLabel(user?.rol || '')}
                  color={getRoleColor(user?.rol || '')}
                  variant="filled"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Información del empleado */}
      {user?.empleado && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Información del Empleado
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Cédula
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.empleado.cedula}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Cargo
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.empleado.cargo?.nombre || 'No asignado'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Departamento
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.empleado.departamento?.nombre || 'No asignado'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Fecha de Ingreso
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {user.empleado.fechaIngreso ? 
                      new Date(user.empleado.fechaIngreso).toLocaleDateString() : 
                      'No disponible'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Acciones rápidas según el rol */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Acciones Rápidas
        </Typography>
        <Grid container spacing={3}>
          {user?.rol === 'ADMIN' && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Gestionar Empleados
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Crear, editar y gestionar información de empleados
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Control de Asistencia
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver y gestionar registros de asistencia
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mi Perfil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ver y actualizar información personal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};