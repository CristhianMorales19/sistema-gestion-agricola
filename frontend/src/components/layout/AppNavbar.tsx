import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Person,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../../caracteristicas/autenticacion/context/AuthContext';
import toast from 'react-hot-toast';

export const AppNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    } finally {
      setLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

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

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión Agrícola
          </Typography>

          {user && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box textAlign="right">
                <Typography variant="body2" color="inherit">
                  {user.nombre} {user.apellido}
                </Typography>
                <Chip
                  label={getRoleLabel(user.rol)}
                  size="small"
                  color={getRoleColor(user.rol)}
                  variant="filled"
                />
              </Box>

              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
              >
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText
            primary={`${user?.nombre} ${user?.apellido}`}
            secondary={user?.email}
          />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </MenuItem>
      </Menu>

      {/* Diálogo de confirmación de logout */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          <Box display="flex" alignItems="center" gap={1}>
            <ExitToApp color="warning" />
            Cerrar sesión
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            ¿Estás seguro de que deseas cerrar tu sesión? 
            Tendrás que volver a iniciar sesión para acceder al sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleLogoutCancel} 
            disabled={loggingOut}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="warning"
            disabled={loggingOut}
            startIcon={loggingOut ? null : <ExitToApp />}
          >
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};