// src/absence-management/presentation/components/RegistrarAusencia/RegistrarAusencia.tsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { CreateAbsenceData, ABSENCE_REASONS } from '../../../domain/entities/Absence';

export interface RegistrarAusenciaFormData {
  trabajador_id: string;
  fecha_ausencia: string;
  motivo: string;
  motivo_personalizado?: string;
  comentarios?: string;
  documento?: File;
}

interface RegistrarAusenciaProps {
  trabajadorId?: string;
  trabajadorNombre?: string;
  onSubmit: (data: CreateAbsenceData, documento?: File) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const RegistrarAusencia: React.FC<RegistrarAusenciaProps> = ({
  trabajadorId: propTrabajadorId,
  trabajadorNombre,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<RegistrarAusenciaFormData>({
    trabajador_id: propTrabajadorId || '',
    fecha_ausencia: new Date().toISOString().split('T')[0],
    motivo: '',
    motivo_personalizado: '',
    comentarios: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrarAusenciaFormData, string>>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name as keyof RegistrarAusenciaFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Limpiar motivo personalizado si no es "otro"
    if (name === 'motivo' && value !== 'otro') {
      setFormData(prev => ({
        ...prev,
        motivo_personalizado: ''
      }));
    }
  }, [errors]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          documento: 'Solo se permiten archivos PDF, JPG y PNG'
        }));
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          documento: 'El archivo no debe superar los 5MB'
        }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({
        ...prev,
        documento: undefined
      }));
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof RegistrarAusenciaFormData, string>> = {};

    if (!formData.trabajador_id) {
      newErrors.trabajador_id = 'Debe seleccionar un trabajador';
    }

    if (!formData.fecha_ausencia) {
      newErrors.fecha_ausencia = 'La fecha es requerida';
    }

    if (!formData.motivo) {
      newErrors.motivo = 'Debe seleccionar un motivo';
    }

    if (formData.motivo === 'otro' && !formData.motivo_personalizado?.trim()) {
      newErrors.motivo_personalizado = 'Debe especificar el motivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: CreateAbsenceData = {
        trabajador_id: formData.trabajador_id,
        fecha_ausencia: formData.fecha_ausencia,
        motivo: formData.motivo,
        motivo_personalizado: formData.motivo_personalizado,
        comentarios: formData.comentarios
      };

      await onSubmit(submitData, selectedFile || undefined);
      
      // Limpiar formulario en caso de éxito
      setFormData({
        trabajador_id: propTrabajadorId || '',
        fecha_ausencia: new Date().toISOString().split('T')[0],
        motivo: '',
        motivo_personalizado: '',
        comentarios: ''
      });
      setSelectedFile(null);
    } catch (error: any) {
      setSubmitError(error.message || 'Error al registrar la ausencia');
    }
  }, [validateForm, formData, selectedFile, onSubmit, propTrabajadorId]);

  const showMotivopersonalizado = formData.motivo === 'otro';

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Registrar Ausencia Justificada
          </Typography>
        </Box>

        {trabajadorNombre && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Registrando ausencia para: <strong>{trabajadorNombre}</strong>
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Fecha de Ausencia */}
            <TextField
              fullWidth
              required
              type="date"
              name="fecha_ausencia"
              label="Fecha de Ausencia"
              value={formData.fecha_ausencia}
              onChange={handleChange}
              error={!!errors.fecha_ausencia}
              helperText={errors.fecha_ausencia}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' }
              }}
            />

            {/* Motivo */}
            <FormControl fullWidth required error={!!errors.motivo}>
              <InputLabel sx={{ color: '#94a3b8' }}>Motivo de la Ausencia</InputLabel>
              <Select
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                label="Motivo de la Ausencia"
                sx={{
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#64748b' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }
                }}
              >
                <MenuItem value="">
                  <em>Seleccione un motivo</em>
                </MenuItem>
                {ABSENCE_REASONS.map(reason => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.motivo && (
                <Typography variant="caption" color="error">
                  {errors.motivo}
                </Typography>
              )}
            </FormControl>

            {/* Motivo Personalizado (solo si selecciona "otro") */}
            {showMotivopersonalizado && (
              <TextField
                fullWidth
                required
                name="motivo_personalizado"
                label="Especifique el Motivo"
                value={formData.motivo_personalizado}
                onChange={handleChange}
                error={!!errors.motivo_personalizado}
                helperText={errors.motivo_personalizado || 'Por favor, especifique el motivo de la ausencia'}
                multiline
                rows={2}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#334155',
                    color: '#ffffff',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />
            )}

            {/* Comentarios Adicionales */}
            <TextField
              fullWidth
              name="comentarios"
              label="Comentarios Adicionales (opcional)"
              value={formData.comentarios}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Agregue cualquier información adicional relevante..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' }
              }}
            />

            {/* Documento de Respaldo */}
            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Documentación de Respaldo (opcional)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadIcon />}
                sx={{
                  color: '#3b82f6',
                  borderColor: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                  }
                }}
              >
                {selectedFile ? selectedFile.name : 'Seleccionar Archivo'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </Button>
              {errors.documento && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                  {errors.documento}
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
              </Typography>
            </Box>

            {/* Botones de Acción */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              {onCancel && (
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={onCancel}
                  disabled={loading}
                  sx={{
                    color: '#94a3b8',
                    borderColor: '#475569',
                    '&:hover': {
                      borderColor: '#64748b',
                      backgroundColor: 'rgba(148, 163, 184, 0.1)'
                    }
                  }}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  '&:disabled': { backgroundColor: '#475569' }
                }}
              >
                {loading ? 'Guardando...' : 'Registrar Ausencia'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
