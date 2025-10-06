import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../../../../../auth/AuthContext';
import { RBACNavigation } from './RBACNavigation';

interface RBACLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const RBACLayout: React.FC<RBACLayoutProps> = ({ 
  children, 
  title = 'Sistema de Gestión Agrícola' 
}) => {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleNavigationToggle = () => {
    setNavigationOpen(!navigationOpen);
  };

  const handleNavigationItemClick = (path: string) => {
    // Aquí otros miembros pueden implementar su lógica de navegación
    // Por ejemplo, usando React Router
    console.log('Navegando a:', path);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          marginLeft: navigationOpen ? '240px' : 0,
          width: navigationOpen ? 'calc(100% - 240px)' : '100%',
          transition: 'margin 0.3s, width 0.3s'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle navigation"
            onClick={handleNavigationToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Menú de usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.name}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar 
                src={user?.picture} 
                alt={user?.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navegación lateral */}
      <RBACNavigation 
        open={navigationOpen}
        onItemClick={handleNavigationItemClick}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Altura del AppBar
          marginLeft: navigationOpen ? '240px' : 0,
          transition: 'margin 0.3s',
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
