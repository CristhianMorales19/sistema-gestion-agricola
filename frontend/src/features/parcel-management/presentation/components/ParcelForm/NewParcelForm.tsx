// src/features/parcel-management/presentation/components/ParcelForm/NewParcelForm.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Terrain as TerrainIcon,
  LocationOn as LocationIcon,
  SquareFoot as AreaIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { CreateParcelDTO, Parcel, TIPOS_TERRENO_CATALOGO } from '../../../domain/entities/Parcel';

interface NewParcelFormProps {
  onSubmit: (data: CreateParcelDTO) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Parcel;
  isEditing?: boolean;
}

export const NewParcelForm: React.FC<NewParcelFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CreateParcelDTO>({
    nombre: initialData?.nombre || '',
    ubicacionDescripcion: initialData?.ubicacionDescripcion || '',
    areaHectareas: initialData?.areaHectareas || 0,
    tipoTerreno: (initialData?.tipoTerreno as any) || null,
    tipoTerrenoOtro: initialData?.tipoTerrenoOtro || null,
    descripcion: initialData?.descripcion || null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateParcelDTO, string>>>({}); 
  // Inicializar showOtroField basado en datos iniciales
  const [showOtroField, setShowOtroField] = useState(
    initialData?.tipoTerreno === 'otro'
  );

  // Manejar cambio de tipo de terreno
  useEffect(() => {
    setShowOtroField(formData.tipoTerreno === 'otro');
  }, [formData.tipoTerreno]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let cleanedValue: any = value;
    
    // Limpiar valor según campo
    if (name === 'nombre') {
      cleanedValue = value.replace(/\s+/g, ' ').trimStart();
    } else if (name === 'areaHectareas') {
      cleanedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue,
    }));

    // Limpiar error del campo al escribir
    setErrors(prev => {
      if (prev[name as keyof CreateParcelDTO]) {
        return {
          ...prev,
          [name]: '',
        };
      }
      return prev;
    });
  }, []);

  const handleSelectChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || null,
    }));

    setErrors(prev => {
      if (prev[name as keyof CreateParcelDTO]) {
        return { ...prev, [name]: '' };
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof CreateParcelDTO, string>> = {};

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
      newErrors.tipoTerrenoOtro = 'Debe especificar el tipo de terreno';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Limpiar datos antes de enviar
    const cleanedData: any = {
      nombre: formData.nombre.trim(),
      ubicacionDescripcion: formData.ubicacionDescripcion.trim(),
      areaHectareas: formData.areaHectareas,
      tipoTerreno: formData.tipoTerreno || null,
      tipoTerrenoOtro: formData.tipoTerreno === 'otro' ? formData.tipoTerrenoOtro?.trim() || null : null,
      descripcion: formData.descripcion?.trim() || null,
    };

    const result = await onSubmit(cleanedData);
    if (result) {
      setFormData({
        nombre: '',
        ubicacionDescripcion: '',
        areaHectareas: 0,
        tipoTerreno: null,
        tipoTerrenoOtro: null,
        descripcion: null,
      });
    }
  }, [validateForm, formData, onSubmit]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '2rem' }}>
            {isEditing ? 'Editar Parcela' : 'Nueva Parcela'}
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la parcela"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TerrainIcon sx={{ color: '#cbd5e1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#e2e8f0', fontSize: '1rem' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#0f172a',
                    '& fieldset': { borderColor: '#64748b' },
                    '&:hover fieldset': { borderColor: '#94a3b8' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                    fontSize: '1.05rem',
                  },
                  '& .MuiFormHelperText-root': { color: '#cbd5e1', fontSize: '0.875rem' },
                }}
              />
            </Grid>

            {/* Área en hectáreas */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Área (hectáreas)"
                name="areaHectareas"
                type="number"
                value={formData.areaHectareas || ''}
                onChange={handleChange}
                error={Boolean(errors.areaHectareas)}
                helperText={errors.areaHectareas}
                required
                inputProps={{ step: '0.01', min: '0.01' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AreaIcon sx={{ color: '#cbd5e1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#e2e8f0', fontSize: '1rem' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#0f172a',
                    '& fieldset': { borderColor: '#64748b' },
                    '&:hover fieldset': { borderColor: '#94a3b8' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                      opacity: 1,
                      filter: 'invert(1)',
                      cursor: 'pointer',
                    },
                  },
                  '& .MuiFormHelperText-root': { color: '#cbd5e1', fontSize: '0.875rem' },
                }}
              />
            </Grid>

            {/* Ubicación descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ubicación aproximada"
                name="ubicacionDescripcion"
                value={formData.ubicacionDescripcion}
                onChange={handleChange}
                error={Boolean(errors.ubicacionDescripcion)}
                helperText={errors.ubicacionDescripcion || 'Descripción textual de la ubicación'}
                required
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: '#cbd5e1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#e2e8f0', fontSize: '1rem' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#0f172a',
                    '& fieldset': { borderColor: '#64748b' },
                    '&:hover fieldset': { borderColor: '#94a3b8' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                    fontSize: '1.05rem',
                  },
                  '& .MuiFormHelperText-root': { color: '#94a3b8', fontSize: '0.9rem' },
                }}
              />
            </Grid>

            {/* Tipo de terreno */}
            <Grid item xs={12} md={showOtroField ? 6 : 12}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#e2e8f0', fontSize: '1rem' }}>Tipo de terreno</InputLabel>
                <Select
                  name="tipoTerreno"
                  value={formData.tipoTerreno || ''}
                  onChange={handleSelectChange}
                  label="Tipo de terreno"
                  sx={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#64748b' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '& .MuiSvgIcon-root': { color: '#e2e8f0' },
                  }}
                >
                  <MenuItem value="">
                    <em>Sin especificar</em>
                  </MenuItem>
                  {TIPOS_TERRENO_CATALOGO.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Tipo de terreno personalizado (solo si es "Otro") */}
            {showOtroField && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Especifique el tipo de terreno"
                  name="tipoTerrenoOtro"
                  value={formData.tipoTerrenoOtro || ''}
                  onChange={handleChange}
                  error={Boolean(errors.tipoTerrenoOtro)}
                  helperText={errors.tipoTerrenoOtro}
                  required
                  placeholder="Ej: Rocoso, Arenoso, etc."
                  sx={{
                    '& .MuiInputLabel-root': { color: '#e2e8f0', fontSize: '1rem' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#0f172a',
                      '& fieldset': { borderColor: '#64748b' },
                      '&:hover fieldset': { borderColor: '#94a3b8' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                      color: '#ffffff',
                      fontSize: '1.05rem',
                    },
                    '& .MuiFormHelperText-root': { color: '#cbd5e1', fontSize: '0.875rem' },
                  }}
                />
              </Grid>
            )}

            {/* Descripción adicional */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción adicional"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Características relevantes de la parcela..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ color: '#cbd5e1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#e2e8f0', fontSize: '1rem' },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#0f172a',
                    '& fieldset': { borderColor: '#64748b' },
                    '&:hover fieldset': { borderColor: '#94a3b8' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                    fontSize: '1.05rem',
                  },
                  '& .MuiFormHelperText-root': { color: '#cbd5e1', fontSize: '0.875rem' },
                }}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: '#94a3b8',
                borderColor: '#475569',
                '&:hover': {
                  color: '#ffffff',
                  borderColor: '#64748b',
                  backgroundColor: '#334155'
                }
              }}
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Parcela'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
