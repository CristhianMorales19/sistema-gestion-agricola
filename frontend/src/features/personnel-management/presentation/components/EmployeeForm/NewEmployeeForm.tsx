// src/employee-management/presentation/components/NewEmployeeForm/NewEmployeeForm.tsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

export interface NewEmployeeFormData {
  documento_identidad: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  fecha_registro_at: string;
  telefono?: string;
  email?: string;
  created_by: number;
}

interface NewEmployeeFormProps {
  onSubmit: (data: NewEmployeeFormData) => void;
  onCancel: () => void;
}

export const NewEmployeeForm: React.FC<NewEmployeeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<NewEmployeeFormData>({
    documento_identidad: '',
    nombre_completo: '',
    fecha_nacimiento: '',
    fecha_registro_at: new Date().toISOString().split('T')[0],
    telefono: '',
    email: '',
    created_by: 1
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewEmployeeFormData, string>>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limpiar espacios en blanco al escribir
    let cleanedValue = value;
    if (name === 'documento_identidad' || name === 'telefono') {
      cleanedValue = value.replace(/\s/g, '');
    } else if (name === 'nombre_completo') {
      // Permitir solo un espacio entre palabras
      cleanedValue = value.replace(/\s+/g, ' ').trimStart();
    } else if (name === 'email') {
      cleanedValue = value.trim();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue,
    }));

    // Limpiar error del campo al escribir
    setErrors(prev => {
      if (prev[name as keyof NewEmployeeFormData]) {
        return {
          ...prev,
          [name]: '',
        };
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof NewEmployeeFormData, string>> = {};

    if (!formData.documento_identidad.trim()) {
      newErrors.documento_identidad = 'La cédula es requerida';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (formData.telefono && !/^[0-9]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener solo números';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.documento_identidad, formData.email, formData.telefono]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Limpiar espacios finales antes de enviar
    const cleanedData: NewEmployeeFormData = {
      ...formData,
      documento_identidad: formData.documento_identidad.trim(),
      nombre_completo: formData.nombre_completo.trim(),
      telefono: formData.telefono?.trim(),
      email: formData.email?.trim(),
      created_by: 1
    };

    try {
      await onSubmit(cleanedData);
    } catch (error: any) {
      if (error.message.includes('cédula')) {
        setErrors(prev => ({
          ...prev,
          documento_identidad: error.message,
          submit: undefined
        }));
      } else if (error.message.includes('electrónico')) {
        setErrors(prev => ({
          ...prev,
          email: error.message,
          submit: undefined
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Error al crear el empleado'
        }));
      }
    }
  }, [validateForm, formData, onSubmit]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Nuevo Empleado
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Cédula */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cédula"
                name="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleChange}
                error={Boolean(errors.documento_identidad)}
                helperText={errors.documento_identidad}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            {/* Nombre completo */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                error={Boolean(errors.nombre_completo)}
                helperText={errors.nombre_completo}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            {/* Fecha de nacimiento */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                error={Boolean(errors.fecha_nacimiento)}
                helperText={errors.fecha_nacimiento}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            {/* Fecha de ingreso */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de ingreso"
                name="fecha_registro_at"
                type="date"
                value={formData.fecha_registro_at}
                onChange={handleChange}
                error={Boolean(errors.fecha_registro_at)}
                helperText={errors.fecha_registro_at}
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                required
                onChange={handleChange}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                  },
                }}
              />
            </Grid>

            {/* Correo electrónico */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    color: '#ffffff',
                  },
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
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Crear
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};