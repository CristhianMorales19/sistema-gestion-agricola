import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Security,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { UsuarioSistema, RolDisponible } from '../../../services/usuarios-sistema.service';

interface RoleAssignmentModalProps {
  open: boolean;
  usuario: UsuarioSistema;
  rolesDisponibles: RolDisponible[];
  onClose: () => void;
  onAsignarRol: (rolId: number) => Promise<void>;
}

export const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  open,
  usuario,
  rolesDisponibles,
  onClose,
  onAsignarRol,
}) => {
  const [selectedRolId, setSelectedRolId] = useState<number>(usuario.rol.rol_id);
  const [loading, setLoading] = useState(false);

  const selectedRol = rolesDisponibles.find(r => r.rol_id === selectedRolId);

  // Memoizar el handler de cambio de rol
  const handleRoleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRolId(Number(e.target.value));
  }, []);

  const handleAsignar = async () => {
    if (selectedRolId === usuario.rol.rol_id) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onAsignarRol(selectedRolId);
      onClose();
    } catch (err) {
      console.error('Error asignando rol:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1e293b',
          color: '#ffffff',
          border: '1px solid #334155',
        }
      }}
    >
      <DialogTitle sx={{ color: '#ffffff', borderBottom: '1px solid #334155', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security />
          <Typography variant="h6" component="span">
            Gestionar Roles - {usuario.username}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 1 }}>
          {usuario.email}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Información actual */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            '& .MuiAlert-icon': { color: '#60a5fa' }
          }}
        >
          <Typography variant="body2">
            Rol actual: <strong>{usuario.rol.nombre}</strong>
          </Typography>
          {usuario.rol.descripcion && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#cbd5e1' }}>
              {usuario.rol.descripcion}
            </Typography>
          )}
        </Alert>

        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
          Selecciona los roles que deseas asignar a este usuario:
        </Typography>

        {/* Lista de roles */}
        <RadioGroup
          value={selectedRolId}
          onChange={handleRoleChange}
        >
          {rolesDisponibles.map((rol) => (
            <Box
              key={rol.rol_id}
              sx={{
                border: '1px solid #334155',
                borderRadius: 1,
                p: 2,
                mb: 2,
                backgroundColor: selectedRolId === rol.rol_id ? '#334155' : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: '#334155',
                  borderColor: '#475569',
                }
              }}
            >
              <FormControlLabel
                value={rol.rol_id}
                control={<Radio sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }} />}
                label={
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {rol.nombre}
                      </Typography>
                      {rol.is_critico && (
                        <Chip
                          icon={<Warning />}
                          label="Crítico"
                          size="small"
                          sx={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            height: 20,
                            '& .MuiChip-icon': { fontSize: 14 }
                          }}
                        />
                      )}
                      {rol.usuarios_asignados !== undefined && (
                        <Chip
                          label={`${rol.usuarios_asignados} usuarios`}
                          size="small"
                          sx={{
                            backgroundColor: '#475569',
                            color: '#cbd5e1',
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                    
                    {rol.descripcion && (
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                        {rol.descripcion}
                      </Typography>
                    )}

                    {rol.permisos && rol.permisos.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          PERMISOS ({rol.permisos.length}):
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {rol.permisos.slice(0, 8).map((permiso) => (
                            <Chip
                              key={permiso.codigo}
                              label={permiso.nombre}
                              size="small"
                              sx={{
                                backgroundColor: '#0f172a',
                                color: '#cbd5e1',
                                fontSize: '0.7rem',
                                height: 22,
                              }}
                            />
                          ))}
                          {rol.permisos.length > 8 && (
                            <Chip
                              label={`+${rol.permisos.length - 8} más`}
                              size="small"
                              sx={{
                                backgroundColor: '#334155',
                                color: '#94a3b8',
                                fontSize: '0.7rem',
                                height: 22,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Box>
          ))}
        </RadioGroup>

        {/* Detalles del rol seleccionado */}
        {selectedRol && selectedRol.permisos && selectedRol.permisos.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ borderColor: '#334155', mb: 2 }} />
            <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
              Permisos del rol seleccionado ({selectedRol.nombre}):
            </Typography>
            
            <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
              {selectedRol.permisos.map((permiso) => (
                <ListItem
                  key={permiso.permiso_id}
                  sx={{
                    backgroundColor: '#0f172a',
                    mb: 0.5,
                    borderRadius: 1,
                    border: '1px solid #1e293b',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 16, color: '#10b981', mr: 1 }} />
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>
                        {permiso.nombre}
                      </Typography>
                    }
                    secondary={
                      permiso.categoria && (
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {permiso.categoria}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Advertencia para roles críticos */}
        {selectedRol?.is_critico && (
          <Alert 
            severity="warning"
            sx={{
              mt: 2,
              backgroundColor: '#78350f',
              color: '#ffffff',
              '& .MuiAlert-icon': { color: '#fbbf24' }
            }}
          >
            <Typography variant="body2">
              <strong>⚠️ Advertencia:</strong> Este es un rol crítico con acceso completo al sistema. 
              Asegúrese de que el usuario debe tener estos permisos.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #334155' }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ color: '#94a3b8' }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleAsignar}
          variant="contained"
          disabled={loading || selectedRolId === usuario.rol.rol_id}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' },
            '&:disabled': { backgroundColor: '#475569', color: '#94a3b8' }
          }}
          startIcon={loading ? <CircularProgress size={16} /> : <Security />}
        >
          {loading ? 'Guardando...' : selectedRolId === usuario.rol.rol_id ? 'Sin cambios' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
