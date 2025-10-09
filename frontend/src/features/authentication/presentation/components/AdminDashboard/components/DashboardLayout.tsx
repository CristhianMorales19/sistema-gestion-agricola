import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Agriculture,
  People,
  Assessment,
  Settings,
  Logout,
  EventBusy
} from '@mui/icons-material';
import { useAuth } from '../../../../application/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  onNavigationChange: (view: string) => void; // Nueva prop
  currentView: string; // Nueva prop
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, onNavigationChange, currentView }) => {
  const { logout, loginWithDemoRole } = useAuth();

  const sidebarItems = React.useMemo(() => [
    { id: 'dashboard', icon: <DashboardIcon />, text: 'Dashboard', active: currentView === 'dashboard' },
    { id: 'employee-management', icon: <People />, text: 'Gestión de Personal', active: currentView === 'employee-management' },
    { id: 'absences', icon: <EventBusy />, text: 'Ausencias', active: currentView === 'absences' },
    // Item específico de asistencia con intención de navegación externa o futura ruta
    { id: 'asistencia', icon: <EventBusy />, text: 'Asistencia', active: currentView === 'asistencia' },
    { id: 'farms', icon: <Agriculture />, text: 'Granjas', active: currentView === '-farms' },
    { id: 'crews', icon: <Agriculture />, text: 'Cuadrillas', active: currentView === '-crews' },
    { id: 'users', icon: <People />, text: 'Usuarios', active: currentView === 'users' },
    { id: 'reports', icon: <Assessment />, text: 'Reportes', active: currentView === 'reports' },
    { id: 'settings', icon: <Settings />, text: 'Configuración', active: currentView === 'settings' },
  ], [currentView]);

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

  // Crear un componente optimizado para los items de navegación
  const NavigationItem = React.memo<{ item: typeof sidebarItems[0] }>(({ item }) => {
    const handleClick = React.useCallback(() => {
      onNavigationChange(item.id);
    }, [item.id]);

    return (
      <ListItem sx={{ p: 0, mb: 1 }}>
        <ListItemButton
          onClick={handleClick}
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
    );
  });

  NavigationItem.displayName = 'NavigationItem';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
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
            {sidebarItems.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </List>
        </Box>

        {/* User Profile Section */}
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
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* #f8fbffff */}
        {/* <Box
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
        </Box> */}

        {/* Main Content */}
        {children}
      </Box>
    </Box>
  );
};
