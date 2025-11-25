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
  onNavigationChange: (view: string) => void;
  currentView: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  user, 
  onNavigationChange, 
  currentView 
}) => {
  const { logout, loginWithDemoRole } = useAuth();

  // Paleta de colores moderna - Azul Cian
  const colors = {
    primary: '#00D4FF',
    primaryDark: '#0099CC',
    primaryLight: '#66EBFF',
    secondary: '#FF6B9D',
    background: '#0A0F1C',
    surface: '#131A2D',
    surfaceLight: '#1E263C',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    accent: '#00F5A0'
  };

  const sidebarItems = React.useMemo(() => [
    { id: 'dashboard', icon: <DashboardIcon />, text: 'Dashboard', active: currentView === 'dashboard' },
    { id: 'employee-management', icon: <People />, text: 'Gestión de Personal', active: currentView === 'employee-management' },
    { id: 'absences', icon: <EventBusy />, text: 'Ausencias', active: currentView === 'absences' },
    { id: 'asistencia', icon: <EventBusy />, text: 'Asistencia', active: currentView === 'asistencia' },
    { id: 'productivity', icon: <Assessment />, text: 'Productividad', active: currentView === 'productivity' },
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

  const NavigationItem = React.memo<{ item: typeof sidebarItems[0] }>(({ item }) => {
    const handleClick = React.useCallback(() => {
      onNavigationChange(item.id);
    }, [item.id]);

    return (
      <ListItem sx={{ p: 0, mb: 1 }}>
        <ListItemButton
          onClick={handleClick}
          sx={{
            borderRadius: 3,
            backgroundColor: item.active 
              ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)` 
              : 'transparent',
            border: item.active 
              ? `1px solid ${colors.primary}40` 
              : '1px solid transparent',
            boxShadow: item.active 
              ? `0 8px 25px -8px ${colors.primary}40` 
              : 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::before': item.active ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${colors.primaryLight}, ${colors.primary})`,
            } : {},
            '&:hover': {
              backgroundColor: `${colors.primary}15`,
              border: `1px solid ${colors.primary}30`,
              transform: 'translateX(4px)',
              boxShadow: `0 6px 20px -6px ${colors.primary}30`,
            },
            '&:active': {
              transform: 'translateX(2px) scale(0.98)',
            }
          }}
        >
          <ListItemIcon 
            sx={{ 
              color: item.active ? colors.textPrimary : colors.textSecondary,
              minWidth: 40,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: colors.primaryLight,
                transform: 'scale(1.1)'
              }
            }}
          >
            {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{ 
                '& .MuiTypography-root': { 
                  fontSize: '0.875rem',
                  fontWeight: item.active ? 600 : 400,
                  color: item.active ? colors.textPrimary : colors.textSecondary,
                  transition: 'all 0.3s ease'
                }
              }}
            />
            {item.active && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 8,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: colors.primaryLight,
                  boxShadow: `0 0 8px ${colors.primaryLight}`
                }}
              />
            )}
          </ListItemButton>
      </ListItem>
    );
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: colors.background,
      backgroundImage: `
        radial-gradient(circle at 15% 50%, ${colors.surfaceLight}40 0%, transparent 65%),
        radial-gradient(circle at 85% 30%, ${colors.background} 0%, transparent 55%),
        linear-gradient(135deg, ${colors.primary}05 0%, transparent 50%)
      `,
      position: 'relative',
    }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 300,
          backgroundColor: `${colors.surface}EE`,
          backdropFilter: 'blur(20px)',
          color: colors.textPrimary,
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${colors.surfaceLight}`,
          boxShadow: `4px 0 20px -5px ${colors.primary}10`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo/Brand */}
        <Box sx={{ 
          p: 3, 
          borderBottom: `1px solid ${colors.surfaceLight}`,
          background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.background} 100%)`
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateX(4px)'
            }
          }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 15px -3px ${colors.primary}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(10deg) scale(1.05)',
                  boxShadow: `0 6px 20px -2px ${colors.primary}60`
                }
              }}
            >
              <Agriculture sx={{ color: colors.textPrimary, fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 800, 
                background: `linear-gradient(135deg, ${colors.textPrimary} 0%, ${colors.primaryLight} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AgroManager
              </Typography>
              <Typography variant="caption" sx={{ 
                color: colors.textSecondary,
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>
                Management Suite
              </Typography>
            </Box>
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
        <Box sx={{ 
          p: 3, 
          borderTop: `1px solid ${colors.surfaceLight}`,
          background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.background} 100%)`
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            p: 2,
            borderRadius: 3,
            background: `${colors.surfaceLight}80`,
            border: `1px solid ${colors.surfaceLight}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: `${colors.surfaceLight}`,
              border: `1px solid ${colors.primary}40`,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 20px -6px ${colors.primary}20`
            }
          }}>
            <Avatar
              src={user?.picture}
              alt={user?.name}
              sx={{ 
                width: 52, 
                height: 52,
                border: `2px solid ${colors.primary}`,
                boxShadow: `0 4px 12px -2px ${colors.primary}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 6px 16px -2px ${colors.primary}60`
                }
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ 
                fontWeight: 700, 
                color: colors.textPrimary,
                fontSize: '0.95rem'
              }}>
                {user?.name || 'Alexander Vega'}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: colors.secondary,
                fontWeight: 500,
                background: `${colors.secondary}15`,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                display: 'inline-block'
              }}>
                Administrador de base de datos
              </Typography>
            </Box>
          </Box>

          {/* Role Switch Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleViewAsRole('Gerente de Granja')}
              sx={{
                color: colors.textSecondary,
                border: `1px solid ${colors.primary}30`,
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: '0.75rem',
                borderRadius: 2,
                py: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: colors.primaryLight,
                  border: `1px solid ${colors.primary}`,
                  backgroundColor: `${colors.primary}10`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px -4px ${colors.primary}30`
                }
              }}
            >
              Ver como Manager
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleViewAsRole('Trabajador de Campo')}
              sx={{
                color: colors.textSecondary,
                border: `1px solid ${colors.accent}30`,
                textTransform: 'none',
                justifyContent: 'flex-start',
                fontSize: '0.75rem',
                borderRadius: 2,
                py: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: colors.accent,
                  border: `1px solid ${colors.accent}`,
                  backgroundColor: `${colors.accent}10`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px -4px ${colors.accent}30`
                }
              }}
            >
              Ver como Worker
            </Button>
          </Box>

          <Divider sx={{ 
            my: 2, 
            backgroundColor: colors.surfaceLight,
          }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Settings />}
              variant="text"
              size="small"
              fullWidth
              sx={{
                color: colors.textSecondary,
                textTransform: 'none',
                justifyContent: 'flex-start',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: colors.primary,
                  backgroundColor: `${colors.primary}10`,
                  transform: 'translateX(4px)'
                }
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
                color: colors.textSecondary,
                textTransform: 'none',
                justifyContent: 'flex-start',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: colors.secondary,
                  backgroundColor: `${colors.secondary}10`,
                  transform: 'translateX(4px)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {children}
      </Box>
    </Box>
  );
};