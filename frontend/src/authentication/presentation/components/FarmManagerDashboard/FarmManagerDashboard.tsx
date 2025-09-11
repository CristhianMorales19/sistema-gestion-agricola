import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Logout,
  Agriculture,
  People,
  TrendingUp,
  Assessment,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../../application/hooks/useAuth';

const mockData = {
  farmStats: [
    {
      title: 'Empleados Activos',
      value: '45',
      change: '+3 esta semana',
      progress: 75,
      color: '#22c55e'
    },
    {
      title: 'Cultivos en Progreso',
      value: '12',
      change: '2 próximos a cosechar',
      progress: 60,
      color: '#3b82f6'
    },
    {
      title: 'Productividad Semanal',
      value: '92%',
      change: '+5% vs semana anterior',
      progress: 92,
      color: '#f59e0b'
    },
    {
      title: 'Tareas Completadas',
      value: '87/100',
      change: '13 tareas pendientes',
      progress: 87,
      color: '#ef4444'
    }
  ],
  recentTasks: [
    'Supervisión de riego automático completada',
    'Asignación de tareas de cosecha a 12 trabajadores',
    'Revisión de calidad del cultivo de maíz',
    'Planificación de siembra para próxima temporada'
  ]
};

export const FarmManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        p: 3
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            p: 3,
            boxShadow: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.picture}
              alt={user?.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user?.name || 'María García'}
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="medium">
                🌾 Gerente de Granja Norte
              </Typography>
            </Box>
          </Box>

          <Button
            startIcon={<Logout />}
            variant="contained"
            color="error"
            onClick={logout}
          >
            Cerrar Sesión
          </Button>
        </Box>

        {/* Dashboard Title */}
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
          Dashboard - Gestión de Granja
        </Typography>

        {/* Estadísticas de la Granja */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {mockData.farmStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {stat.change}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stat.color,
                        borderRadius: 4
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Panel de Control */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 Acciones Rápidas de Gestión
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<People />}
                      sx={{ py: 2, backgroundColor: '#16a34a' }}
                    >
                      Gestionar Personal
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Agriculture />}
                      sx={{ py: 2, backgroundColor: '#2563eb' }}
                    >
                      Supervisar Cultivos
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Schedule />}
                      sx={{ py: 2, backgroundColor: '#dc2626' }}
                    >
                      Asignar Tareas
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Assessment />}
                      sx={{ py: 2, backgroundColor: '#7c3aed' }}
                    >
                      Ver Reportes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Actividades Recientes
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {mockData.recentTasks.map((task, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: index % 2 === 0 ? '#f8fafc' : 'transparent',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          mr: 2
                        }}
                      />
                      <Typography variant="body2">{task}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel Lateral */}
          <Grid item xs={12} md={4}>
            {/* Permisos */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔐 Permisos Activos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {user?.roles?.[0]?.permissions?.slice(0, 5).map((permission) => (
                    <Chip
                      key={permission.id}
                      label={permission.name.replace('_', ' ').toUpperCase()}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                  {(user?.roles?.[0]?.permissions?.length || 0) > 5 && (
                    <Chip
                      label={`+${(user?.roles?.[0]?.permissions?.length || 0) - 5} más`}
                      variant="filled"
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Información del Rol */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  👤 Información del Rol
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Como Gerente de Granja, tienes acceso a la gestión completa del personal, 
                  supervisión de cultivos, asignación de tareas y generación de reportes.
                </Typography>
                <Chip
                  label="GERENTE DE GRANJA"
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: 'bold' }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
