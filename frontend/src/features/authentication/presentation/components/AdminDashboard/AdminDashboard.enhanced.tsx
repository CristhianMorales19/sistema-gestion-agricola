import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Agriculture,
  People,
  Assessment,
  Settings,
  Logout,
  NotificationsNone,
  TrendingUp,
  TrendingDown,
  GroupAdd,
  BusinessCenter,
  FiberManualRecord,
  Security,
  Cloud,
  Thermostat,
  WaterDrop,
  Air
} from '@mui/icons-material';
import { useAuth } from '../../../application/hooks/useAuth';

// Datos mejorados para el dashboard
const dashboardData = {
  stats: [
    {
      title: 'Granjas Totales',
      value: '12',
      change: '+2 desde ayer',
      changeType: 'positive' as const,
      bgColor: '#3b82f6',
      icon: <Agriculture sx={{ fontSize: 24, color: '#3b82f6' }} />
    },
    {
      title: 'Usuarios Activos',
      value: '156',
      change: '+8 desde ayer',
      changeType: 'positive' as const,
      bgColor: '#10b981',
      icon: <People sx={{ fontSize: 24, color: '#10b981' }} />
    },
    {
      title: 'Cultivos Monitoreados',
      value: '1,245',
      change: '+156 desde ayer',
      changeType: 'positive' as const,
      bgColor: '#06b6d4',
      icon: <Assessment sx={{ fontSize: 24, color: '#06b6d4' }} />
    },
    {
      title: 'Alertas Pendientes',
      value: '23',
      change: '-5 desde ayer',
      changeType: 'negative' as const,
      bgColor: '#ef4444',
      icon: <NotificationsNone sx={{ fontSize: 24, color: '#ef4444' }} />
    }
  ],
  activities: [
    {
      type: 'farm',
      text: 'Nueva granja "La Esperanza" registrada',
      time: 'Hace 45 minutos',
      icon: <Agriculture sx={{ fontSize: 18, color: '#10b981' }} />,
      status: 'success'
    },
    {
      type: 'user',
      text: 'Usuario María González promovido a Manager',
      time: 'Hace 57 minutos',
      icon: <GroupAdd sx={{ fontSize: 18, color: '#3b82f6' }} />,
      status: 'info'
    },
    {
      type: 'system',
      text: 'Sistema de riego automático instalado en Granja Norte',
      time: 'Hace 37 minutos',
      icon: <BusinessCenter sx={{ fontSize: 18, color: '#06b6d4' }} />,
      status: 'success'
    },
    {
      type: 'alert',
      text: '23 alertas de plagas detectadas automáticamente',
      time: 'Hace 57 minutos',
      icon: <NotificationsNone sx={{ fontSize: 18, color: '#f59e0b' }} />,
      status: 'warning'
    }
  ],
  conditions: [
    {
      label: 'Temperatura',
      value: '24°C',
      icon: <Thermostat sx={{ fontSize: 20, color: '#f59e0b' }} />
    },
    {
      label: 'Humedad',
      value: '65%',
      icon: <WaterDrop sx={{ fontSize: 20, color: '#06b6d4' }} />
    },
    {
      label: 'Lluvia (24h)',
      value: '12mm',
      icon: <Cloud sx={{ fontSize: 20, color: '#6b7280' }} />
    },
    {
      label: 'Viento',
      value: '15km/h',
      icon: <Air sx={{ fontSize: 20, color: '#8b5cf6' }} />
    }
  ]
};

const sidebarItems = [
  { icon: <DashboardIcon />, text: 'Dashboard', active: true },
  { icon: <Agriculture />, text: 'Granjas', active: false },
  { icon: <People />, text: 'Usuarios', active: false },
  { icon: <Assessment />, text: 'Reportes', active: false },
  { icon: <Settings />, text: 'Configuración', active: false },
];

export const EnhancedAdminDashboard: React.FC = () => {
  const { user, logout, loginWithDemoRole } = useAuth();

  const handleViewAsRole = React.useCallback(async (roleName: string) => {
    try {
      await loginWithDemoRole(roleName);
    } catch (error) {
      console.error('Error changing view:', error);
    }
  }, [loginWithDemoRole]);

  const handleViewAsManager = React.useCallback(() => {
    handleViewAsRole('Gerente de Granja');
  }, [handleViewAsRole]);

  const handleViewAsWorker = React.useCallback(() => {
    handleViewAsRole('Trabajador de Campo');
  }, [handleViewAsRole]);

  const getStatusColor = React.useCallback((status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'info': return '#3b82f6';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar Mejorado */}
      <Box
        sx={{
          width: 280,
          backgroundColor: '#1e293b',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #334155'
        }}
      >
        {/* Logo/Brand */}
        <Box sx={{ p: 3, borderBottom: '1px solid #334155' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#3b82f6',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Agriculture sx={{ color: '#ffffff', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
              AgroManager
            </Typography>
          </Box>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ flex: 1, p: 2 }}>
          <List sx={{ p: 0 }}>
            {sidebarItems.map((item, index) => (
              <ListItem key={index} sx={{ p: 0, mb: 1 }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: item.active ? '#334155' : 'transparent',
                    border: item.active ? '1px solid #475569' : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: '#334155'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#ffffff', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* User Profile Section Mejorado */}
        <Box sx={{ p: 3, borderTop: '1px solid #334155' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              src={user?.picture}
              alt={user?.name}
              sx={{ 
                width: 48, 
                height: 48,
                border: '2px solid #475569'
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#ffffff' }}>
                {user?.name || 'Alexander Vega'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#f87171' }}>
                Administrador de base de datos
              </Typography>
            </Box>
          </Box>

          {/* Role Switch Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Button
              variant="text"
              size="small"
              fullWidth
              onClick={handleViewAsManager}
              sx={{
                color: '#cbd5e1',
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: '0.75rem'
              }}
            >
              Ver como Manager
            </Button>
            <Button
              variant="text"
              size="small"
              fullWidth
              onClick={handleViewAsWorker}
              sx={{
                color: '#cbd5e1',
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: '0.75rem'
              }}
            >
              Ver como Worker
            </Button>
          </Box>

          <Divider sx={{ my: 2, backgroundColor: '#334155' }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Settings />}
              variant="text"
              size="small"
              fullWidth
              sx={{
                color: '#cbd5e1',
                textTransform: 'none',
                justifyContent: 'flex-start'
              }}
            >
              Configuración
            </Button>
            <Button
              startIcon={<Logout />}
              variant="text"
              size="small"
              fullWidth
              onClick={logout}
              sx={{
                color: '#cbd5e1',
                textTransform: 'none',
                justifyContent: 'flex-start'
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Mejorado */}
        <Box
          sx={{
            backgroundColor: '#1e293b',
            borderBottom: '1px solid #334155',
            p: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.picture}
              alt={user?.name}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {user?.name || 'Alexander Vega'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#f87171' }}>
                Administrador de base de datos
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewAsManager}
              sx={{ 
                color: '#cbd5e1',
                borderColor: '#475569',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: 'rgba(203, 213, 225, 0.1)'
                }
              }}
            >
              Ver como Manager
            </Button>
            <Button
              variant="outlined"  
              size="small"
              onClick={handleViewAsWorker}
              sx={{ 
                color: '#cbd5e1',
                borderColor: '#475569',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  backgroundColor: 'rgba(203, 213, 225, 0.1)'
                }
              }}
            >
              Ver como Worker
            </Button>
            <Button
              startIcon={<Settings />}
              variant="text"
              sx={{ color: '#cbd5e1' }}
            >
              Configuración
            </Button>
            <Button
              startIcon={<Logout />}
              variant="text"
              onClick={logout}
              sx={{ color: '#cbd5e1' }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Box sx={{ flex: 1, p: 4, backgroundColor: '#0f172a' }}>
          <Grid container spacing={3}>
            {/* Stats Cards Mejoradas */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {dashboardData.stats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#475569',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                              {stat.title}
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#ffffff', mb: 2, fontWeight: 'bold' }}>
                              {stat.value}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: stat.changeType === 'positive' ? '#22c55e' : '#ef4444'
                              }}
                            >
                              {stat.changeType === 'positive' ? 
                                <TrendingUp sx={{ fontSize: 14 }} /> : 
                                <TrendingDown sx={{ fontSize: 14 }} />
                              }
                              <Typography variant="body2">
                                {stat.change}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              backgroundColor: `${stat.bgColor}20`,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {stat.icon}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Permisos Actuales */}
            <Grid item xs={12}>
              <Card 
                sx={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 2
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Security sx={{ color: '#22c55e', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                      Permisos Actuales (11)
                    </Typography>
                  </Box>
                  <Chip
                    icon={<FiberManualRecord sx={{ fontSize: 12, color: '#fb923c !important' }} />}
                    label="ACCESO TOTAL - Administrador"
                    sx={{
                      backgroundColor: 'rgba(153, 27, 27, 0.5)',
                      color: '#fca5a5',
                      border: '1px solid rgba(251, 146, 60, 0.3)'
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid container spacing={3} item xs={12}>
              {/* Recent Activity Mejorada */}
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Assessment sx={{ color: '#22c55e', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Actividad Reciente
                      </Typography>
                    </Box>
                    
                    <List sx={{ p: 0 }}>
                      {dashboardData.activities.map((activity, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderRadius: 2,
                            mb: 1.5,
                            p: 2,
                            backgroundColor: '#334155',
                            border: '1px solid #475569'
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: getStatusColor(activity.status),
                                mr: 1
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                                {activity.text}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                {activity.time}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Condiciones Actuales */}
              <Grid item xs={12} md={6}>
                <Card 
                  sx={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 2,
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Cloud sx={{ color: '#fb923c', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Condiciones Actuales
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      {dashboardData.conditions.map((condition, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ mb: 1 }}>
                              {condition.icon}
                            </Box>
                            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                              {condition.value}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              {condition.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
