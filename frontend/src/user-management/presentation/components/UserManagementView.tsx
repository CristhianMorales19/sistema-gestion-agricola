import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Refresh,
  PersonAdd,
  Edit,
  Search
} from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import { UserManagementService } from '../../services/UserManagementService';
import { UsuariosSistemaService } from '../../../services/usuarios-sistema.service';
import { UserWithRoles, Role, UserFilters } from '../../types';
import { UserRow } from './UserRow';

export const UserManagementView: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [databaseRoles, setDatabaseRoles] = useState<any[]>([]); // Roles de BD para crear usuarios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    limit: 10
  });
  
  // Estados para diálogos
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  // Estados para modal crear usuario
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    nombre: '',
    password: '',
    rol_id: ''
  });

  // Inicializar servicio
  const userService = useMemo(() => new UserManagementService(getAccessTokenSilently), [getAccessTokenSilently]);
  const usuariosService = useMemo(() => new UsuariosSistemaService(getAccessTokenSilently), [getAccessTokenSilently]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersResponse, rolesData, dbRolesResponse] = await Promise.all([
        userService.getUsers(filters),
        userService.getRoles(),
        usuariosService.getRolesDisponibles() // Cargar roles de BD
      ]);
      
      setUsers(usersResponse.users);
      setRoles(rolesData);
      setDatabaseRoles(dbRolesResponse.data || []); // Guardar roles de BD
    } catch (err) {
      setError('Error cargando datos de usuarios');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, userService, usuariosService]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const handleSyncUsers = useCallback(async () => {
    try {
      setLoading(true);
      await userService.syncUsers();
      setSuccess('Usuarios sincronizados con Auth0 exitosamente');
      await loadData();
    } catch (err) {
      setError('Error sincronizando usuarios');
      console.error('Error syncing users:', err);
    } finally {
      setLoading(false);
    }
  }, [userService, loadData]);

  const handleCrearUsuario = useCallback(() => {
    setNewUserData({
      email: '',
      nombre: '',
      password: '',
      rol_id: ''
    });
    setCreateUserModalOpen(true);
  }, []);

  const handleCloseCreateUserModal = useCallback(() => {
    setCreateUserModalOpen(false);
    setNewUserData({
      email: '',
      nombre: '',
      password: '',
      rol_id: ''
    });
  }, []);

  const handleSubmitCreateUser = useCallback(async () => {
    try {
      if (!newUserData.email || !newUserData.nombre || !newUserData.password || !newUserData.rol_id) {
        setError('Todos los campos son requeridos');
        return;
      }

      if (newUserData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      // Sugerir dominio @agromano.com si no lo tiene
      if (!newUserData.email.includes('@agromano.com')) {
        const confirmDomain = window.confirm(
          `¿Estás seguro de usar "${newUserData.email}"?\n\n` +
          `Se recomienda usar el dominio @agromano.com para consistencia con otros usuarios del sistema.\n\n` +
          `¿Continuar con este email?`
        );
        if (!confirmDomain) return;
      }

      setLoading(true);
      await usuariosService.crearUsuarioHibrido({
        email: newUserData.email,
        nombre: newUserData.nombre,
        password: newUserData.password,
        rol_id: Number(newUserData.rol_id)
      });

      setSuccess('Usuario híbrido creado exitosamente');
      handleCloseCreateUserModal();
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Error creando usuario');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  }, [newUserData, usuariosService, handleCloseCreateUserModal, loadData]);

  const handleOpenRoleDialog = useCallback((user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map((role: Role) => role.id).filter((id: string | undefined): id is string => id !== undefined));
    setRoleDialogOpen(true);
  }, []);

  const handleCloseRoleDialog = useCallback(() => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  }, []);

  const handleAssignRoles = useCallback(async () => {
    if (!selectedUser || !selectedUser.user.user_id) return;
    
    try {
      await userService.assignRoles(selectedUser.user.user_id, selectedRoles);
      setSuccess('Roles asignados exitosamente');
      handleCloseRoleDialog();
      await loadData();
    } catch (err) {
      setError('Error asignando roles');
      console.error('Error assigning roles:', err);
    }
  }, [selectedUser, selectedRoles, userService, handleCloseRoleDialog, loadData]);

  const handleRemoveRole = useCallback(async (userId: string, roleId: string) => {
    try {
      await userService.removeRole(userId, roleId);
      setSuccess('Rol removido exitosamente');
      await loadData();
    } catch (err) {
      setError('Error removiendo rol');
      console.error('Error removing role:', err);
    }
  }, [userService, loadData]);

  const handleRoleToggle = useCallback((roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  }, []);

  const createRoleToggleHandler = useCallback((roleId: string) => {
    return () => handleRoleToggle(roleId);
  }, [handleRoleToggle]);

  const getRoleColor = useCallback((roleName: string | undefined): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    if (!roleName) return 'default';
    
    const colors: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'error' } = {
      'admin': 'error',
      'administrador': 'error',
      'admin_agromano': 'error',
      'supervisor_campo': 'warning',
      'gerente_rrhh': 'warning',
      'supervisor_rrhh': 'secondary',
      'empleado_campo': 'success',
      'visual_solo_lectura': 'primary',
      'manager': 'warning',
      'gerente': 'warning',
      'worker': 'success',
      'trabajador': 'success',
      'viewer': 'primary',
      'visualizador': 'primary'
    };
    return colors[roleName.toLowerCase()] || 'primary';
  }, []);

  const handleNameFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: UserFilters) => ({ ...prev, name: e.target.value, page: 0 }));
  }, []);

  const handleRoleFilterChange = useCallback((e: any) => {
    setFilters((prev: UserFilters) => ({ ...prev, role: e.target.value, page: 0 }));
  }, []);

  const handleHasRoleFilterChange = useCallback((e: any) => {
    setFilters((prev: UserFilters) => ({ 
      ...prev, 
      hasRole: e.target.value === '' ? undefined : e.target.value === 'true',
      page: 0 
    }));
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserData(prev => ({ ...prev, email: e.target.value }));
  }, []);

  const handleNombreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserData(prev => ({ ...prev, nombre: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserData(prev => ({ ...prev, password: e.target.value }));
  }, []);

  const handleRolIdChange = useCallback((e: any) => {
    setNewUserData(prev => ({ ...prev, rol_id: e.target.value }));
  }, []);

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
        <Typography sx={{ ml: 2, color: '#ffffff' }}>Cargando usuarios...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Gestión de Usuarios
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            sx={{ 
              color: '#3b82f6', 
              borderColor: '#3b82f6',
              '&:hover': { borderColor: '#2563eb', backgroundColor: 'rgba(59, 130, 246, 0.1)' }
            }}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleCrearUsuario}
            sx={{ 
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' }
            }}
          >
            Crear Usuario
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleSyncUsers}
            sx={{ 
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            Sincronizar Auth0
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o email..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ color: '#64748b', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                }}
                value={filters.name || ''}
                onChange={handleNameFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94a3b8' }}>Filtrar por rol</InputLabel>
                <Select
                  value={filters.role || ''}
                  label="Filtrar por rol"
                  onChange={handleRoleFilterChange}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64748b' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                  }}
                >
                  <MenuItem value="">Todos los roles</MenuItem>
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94a3b8' }}>Estado de roles</InputLabel>
                <Select
                  value={filters.hasRole === undefined ? '' : filters.hasRole.toString()}
                  label="Estado de roles"
                  onChange={handleHasRoleFilterChange}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64748b' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Con roles</MenuItem>
                  <MenuItem value="false">Sin roles</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#334155' }}>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Roles</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userWithRoles) => (
                  <UserRow
                    key={userWithRoles.user.user_id}
                    userWithRoles={userWithRoles}
                    getRoleColor={getRoleColor}
                    onRemoveRole={handleRemoveRole}
                    onOpenRoleDialog={handleOpenRoleDialog}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para asignar roles */}
      <Dialog 
        open={roleDialogOpen} 
        onClose={handleCloseRoleDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: '#1e293b', color: '#ffffff' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #334155' }}>
          Gestionar Roles - {selectedUser?.user.name || selectedUser?.localUserData?.username || 'Usuario'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Selecciona los roles que deseas asignar a este usuario:
          </Typography>
          {roles.map((role) => (
            role.id && (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={createRoleToggleHandler(role.id)}
                    sx={{
                      color: '#64748b',
                      '&.Mui-checked': { color: '#3b82f6' }
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ color: '#ffffff' }}>{role.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {role.description}
                    </Typography>
                  </Box>
                }
                sx={{ display: 'block', mb: 1 }}
              />
            )
          ))}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #334155', pt: 2 }}>
          <Button 
            onClick={handleCloseRoleDialog}
            sx={{ color: '#64748b' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAssignRoles}
            variant="contained"
            sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para crear usuario */}
      <Dialog 
        open={createUserModalOpen} 
        onClose={handleCloseCreateUserModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: '#1e293b', color: '#ffffff' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #334155' }}>
          Crear Nuevo Usuario Híbrido
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            El usuario se creará en Auth0 y en la base de datos local
          </Typography>
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUserData.email}
            onChange={handleEmailChange}
            placeholder="usuario@agromano.com"
            helperText="Usar dominio @agromano.com para consistencia"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#64748b' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiFormHelperText-root': { color: '#64748b' }
            }}
          />

          <TextField
            fullWidth
            label="Nombre Completo"
            value={newUserData.nombre}
            onChange={handleNombreChange}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#64748b' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' }
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={newUserData.password}
            onChange={handlePasswordChange}
            helperText="Mínimo 8 caracteres"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#64748b' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' },
              '& .MuiFormHelperText-root': { color: '#64748b' }
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Rol</InputLabel>
            <Select
              value={newUserData.rol_id}
              label="Rol"
              onChange={handleRolIdChange}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64748b' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              }}
            >
              {databaseRoles.map((role) => (
                <MenuItem key={role.rol_id} value={role.rol_id}>
                  <Box>
                    <Typography>{role.nombre}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {role.descripcion || role.codigo}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #334155', pt: 2 }}>
          <Button 
            onClick={handleCloseCreateUserModal}
            sx={{ color: '#64748b' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitCreateUser}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
          >
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars para mensajes */}
      <Snackbar 
        open={Boolean(error)} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={Boolean(success)} 
        autoHideDuration={4000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};