// src/features/parcel-management/presentation/components/ParcelForm/EditParcelDialog.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Parcel, UpdateParcelDTO, TIPOS_TERRENO_CATALOGO } from '../../../domain/entities/Parcel';

interface EditParcelDialogProps {
  open: boolean;
  parcel: Parcel | null;
  onClose: () => void;
  onSave: (id: number, data: UpdateParcelDTO) => Promise<boolean>;
}

// Colores del tema
const colors = {
  background: '#1e293b',
  surface: '#0f172a',
  border: '#334155',
  primary: '#10b981',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  error: '#ef4444'
};

// Estados disponibles para parcelas
const ESTADOS_PARCELA = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupada', label: 'Ocupada' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'inactiva', label: 'Inactiva' },
];

export const EditParcelDialog: React.FC<EditParcelDialogProps> = ({
  open,
  parcel,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdateParcelDTO>({
    nombre: '',
    ubicacionDescripcion: '',
    areaHectareas: 0,
    tipoTerreno: null,
    tipoTerrenoOtro: null,
    descripcion: null,
    estado: 'disponible',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showOtroField, setShowOtroField] = useState(false);

  // Cargar datos cuando se abre el dialog
  useEffect(() => {
    if (parcel && open) {
      const tipoTerreno = parcel.tipoTerreno || null;
      setFormData({
        nombre: parcel.nombre || '',
        ubicacionDescripcion: parcel.ubicacionDescripcion || '',
        areaHectareas: parcel.areaHectareas || 0,
        tipoTerreno: tipoTerreno,
        tipoTerrenoOtro: parcel.tipoTerrenoOtro || null,
        descripcion: parcel.descripcion || null,
        estado: parcel.estado || 'disponible',
      });
      setShowOtroField(tipoTerreno === 'otro');
      setErrors({});
    }
  }, [parcel, open]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'areaHectareas' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSelectChange = useCallback((name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value || null }));
    
    // Mostrar/ocultar campo "otro" cuando cambia tipo de terreno
    if (name === 'tipoTerreno') {
      setShowOtroField(value === 'otro');
      if (value !== 'otro') {
        setFormData(prev => ({ ...prev, tipoTerrenoOtro: null }));
      }
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.ubicacionDescripcion?.trim()) {
      newErrors.ubicacionDescripcion = 'La ubicación es obligatoria';
    }
    if (!formData.areaHectareas || formData.areaHectareas <= 0) {
      newErrors.areaHectareas = 'El área debe ser mayor a 0';
    }
    if (formData.tipoTerreno === 'otro' && !formData.tipoTerrenoOtro?.trim()) {
      newErrors.tipoTerrenoOtro = 'Especifique el tipo de terreno';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !parcel?.id) return;

    setLoading(true);
    try {
      const success = await onSave(parcel.id, formData);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiInputLabel-root': { color: colors.textSecondary },
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.surface,
      '& fieldset': { borderColor: colors.border },
      '&:hover fieldset': { borderColor: colors.textSecondary },
      '&.Mui-focused fieldset': { borderColor: colors.primary },
    },
    '& .MuiInputBase-input': { color: colors.textPrimary },
    '& .MuiFormHelperText-root': { color: colors.textSecondary },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background,
          borderRadius: 2,
          border: `1px solid ${colors.border}`,
          maxHeight: '90vh',
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        p: 3,
        pb: 2,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <Box>
          <Typography variant="h5" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
            Editar Parcela
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
            Modifica los datos de la parcela de trabajo
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.textSecondary }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Nombre */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
            Nombre de la parcela <span style={{ color: colors.error }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            placeholder="Ej: Parcela Norte A"
            size="small"
            sx={inputStyles}
          />
        </Box>

        {/* Ubicación */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
            Ubicación <span style={{ color: colors.error }}>*</span>
          </Typography>
          <TextField
            fullWidth
            name="ubicacionDescripcion"
            value={formData.ubicacionDescripcion}
            onChange={handleChange}
            error={!!errors.ubicacionDescripcion}
            helperText={errors.ubicacionDescripcion || 'Describe la ubicación de forma que el personal pueda identificarla fácilmente'}
            placeholder="Ej: Lote 3, zona norte, cerca del canal de riego principal"
            multiline
            rows={2}
            size="small"
            sx={inputStyles}
          />
        </Box>

        {/* Área y Tipo de terreno en una fila */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
              Área (hectáreas) <span style={{ color: colors.error }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="areaHectareas"
              type="number"
              value={formData.areaHectareas || ''}
              onChange={handleChange}
              error={!!errors.areaHectareas}
              helperText={errors.areaHectareas}
              inputProps={{ min: 0, step: 0.01 }}
              size="small"
              sx={inputStyles}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
              Tipo de terreno (opcional)
            </Typography>
            <FormControl fullWidth size="small" sx={inputStyles}>
              <Select
                value={formData.tipoTerreno || ''}
                onChange={(e) => handleSelectChange('tipoTerreno', e.target.value)}
                displayEmpty
                sx={{ color: colors.textPrimary }}
              >
                <MenuItem value="">
                  <em>Seleccionar...</em>
                </MenuItem>
                {TIPOS_TERRENO_CATALOGO.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Campo para especificar "Otro" tipo de terreno */}
        {showOtroField && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
              Especifique el tipo de terreno <span style={{ color: colors.error }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="tipoTerrenoOtro"
              value={formData.tipoTerrenoOtro || ''}
              onChange={handleChange}
              error={!!errors.tipoTerrenoOtro}
              helperText={errors.tipoTerrenoOtro}
              placeholder="Ej: Terreno pantanoso, rocoso, etc."
              size="small"
              sx={inputStyles}
            />
          </Box>
        )}

        {/* Descripción adicional */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
            Descripción adicional
          </Typography>
          <TextField
            fullWidth
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            placeholder="Incluye características relevantes como tipo de suelo, drenaje, sistemas instalados, etc."
            multiline
            rows={3}
            size="small"
            sx={inputStyles}
          />
          <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 0.5, display: 'block' }}>
            Incluye características relevantes como tipo de suelo, drenaje, sistemas instalados, etc.
          </Typography>
        </Box>

        {/* Estado */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
            Estado
          </Typography>
          <FormControl fullWidth size="small" sx={inputStyles}>
            <Select
              value={formData.estado || 'disponible'}
              onChange={(e) => handleSelectChange('estado', e.target.value)}
              sx={{ color: colors.textPrimary }}
            >
              {ESTADOS_PARCELA.map((estado) => (
                <MenuItem key={estado.value} value={estado.value}>
                  {estado.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Botones */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: `1px solid ${colors.border}` }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              color: colors.textSecondary,
              borderColor: colors.border,
              '&:hover': {
                borderColor: colors.textSecondary,
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: colors.primary,
              '&:hover': { backgroundColor: '#059669' },
              '&:disabled': { backgroundColor: colors.border }
            }}
          >
            {loading ? 'Guardando...' : 'Actualizar Parcela'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
