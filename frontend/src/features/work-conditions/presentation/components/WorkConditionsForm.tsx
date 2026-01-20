import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Grid,
  FormLabel,
  Alert,
} from '@mui/material';
import { Cloud, AlertTriangle, AlertCircle } from 'lucide-react';

interface WorkCondition {
  fecha: string;
  condicionGeneral: 'despejado' | 'lluvioso' | 'muy_caluroso' | 'nublado';
  nivelDificultad: 'normal' | 'dificil' | 'muy_dificil';
  observaciones?: string;
}

interface WorkConditionsFormProps {
  onSubmit?: (data: WorkCondition) => Promise<boolean> | boolean;
  selectedCondition?: WorkCondition | null;
  selectedDate?: string | null;
  onDateSelected?: (fecha: string) => void;
}

const CONDICIONES_GENERALES = [
  { value: 'despejado', label: 'Despejado', icon: '☀️', color: '#fbbf24' },
  { value: 'lluvioso', label: 'Lluvioso', icon: '🌧️', color: '#3b82f6' },
  { value: 'muy_caluroso', label: 'Muy Caluroso', icon: '🔥', color: '#ef4444' },
  { value: 'nublado', label: 'Nublado', icon: '☁️', color: '#6b7280' },
];

const NIVELES_DIFICULTAD = [
  { value: 'normal', label: 'Normal', color: '#10b981' },
  { value: 'dificil', label: 'Difícil', color: '#f97316' },
  { value: 'muy_dificil', label: 'Muy Difícil', color: '#ef4444' },
];

export const WorkConditionsForm: React.FC<WorkConditionsFormProps> = ({ 
  onSubmit,
  selectedCondition,
  selectedDate,
  onDateSelected
}) => {
  const [formData, setFormData] = useState<WorkCondition>({
    fecha: new Date().toISOString().split('T')[0],
    condicionGeneral: 'despejado',
    nivelDificultad: 'normal',
    observaciones: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');

  // Obtener fecha máxima permitida (hoy)
  const maxDate = new Date().toISOString().split('T')[0];

  // Cuando se selecciona un día del calendario con registro existente
  useEffect(() => {
    if (selectedDate) {
      console.log('📅 Día seleccionado:', selectedDate);
      console.log('🔍 Condición seleccionada:', selectedCondition);
      
      // Limpiar mensaje anterior
      setSubmitted(false);
      setSubmissionMessage('');
      
      setFormData(prev => ({ ...prev, fecha: selectedDate }));
      
      if (selectedCondition) {
        // Cargar datos del registro existente
        console.log('✏️ Cargando datos existentes:', selectedCondition);
        setFormData({
          fecha: selectedCondition.fecha,
          condicionGeneral: selectedCondition.condicionGeneral,
          nivelDificultad: selectedCondition.nivelDificultad,
          observaciones: selectedCondition.observaciones || '',
        });
        setIsEditingExisting(true);
      } else {
        // Nuevo día, limpiar observación
        console.log('🆕 Nuevo día, sin registro anterior');
        setFormData(prev => ({
          ...prev,
          fecha: selectedDate,
          observaciones: '',
        }));
        setIsEditingExisting(false);
      }
    }
  }, [selectedDate, selectedCondition]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFormData({ ...formData, fecha: newDate });
    
    // Validar que no sea fecha futura
    if (newDate > maxDate) {
      setDateError('❌ No se pueden registrar días futuros');
    } else {
      setDateError('');
    }
    
    onDateSelected?.(newDate);
  };

  const handleCondicionChange = (value: string) => {
    setFormData({ ...formData, condicionGeneral: value as any });
  };

  const handleNivelChange = (value: string) => {
    setFormData({ ...formData, nivelDificultad: value as any });
  };

  const handleObservacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, observaciones: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que no sea fecha futura
    if (formData.fecha > maxDate) {
      setDateError('❌ No se pueden registrar días futuros');
      return;
    }
    
    console.log('📝 Enviando formulario:', formData);
    const result = await onSubmit?.(formData);
    console.log('✅ Resultado de onSubmit:', result);
    
    if (result) {
      // Mostrar mensaje diferente si es actualización o creación
      if (isEditingExisting) {
        setSubmissionMessage('✔️ Condición actualizada exitosamente');
      } else {
        setSubmissionMessage('✔️ Registro guardado exitosamente');
      }
      
      console.log('📢 Mostrando mensaje:', isEditingExisting ? 'actualización' : 'creación');
      
      // Reset form on successful submission
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        condicionGeneral: 'despejado',
        nivelDificultad: 'normal',
        observaciones: '',
      });
      setIsEditingExisting(false);
      setSubmitted(true);
      
      // Auto-hide después de 5 segundos
      setTimeout(() => {
        console.log('🔇 Ocultando mensaje');
        setSubmitted(false);
      }, 5000);
    } else {
      console.log('❌ Error al guardar');
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}
          >
            Registrar Condiciones del Día
          </Typography>
        </Box>

        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submissionMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Fecha */}
            <Grid item xs={12}>
              <FormLabel sx={{ color: '#e2e8f0', fontWeight: 500, display: 'block', mb: 1 }}>
                Fecha <span style={{ color: '#ef4444' }}>*</span>
              </FormLabel>
              <TextField
                type="date"
                value={formData.fecha}
                onChange={handleDateChange}
                inputProps={{ max: maxDate }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={dateError !== ''}
                helperText={dateError}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderRadius: 1,
                    borderColor: dateError ? '#ef4444' : '#334155',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: dateError ? '#ef4444' : '#334155',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ef4444',
                  },
                }}
              />
            </Grid>

            {/* Condición General */}
            <Grid item xs={12}>
              <FormLabel sx={{ color: '#e2e8f0', fontWeight: 500, display: 'block', mb: 2 }}>
                Condición General <span style={{ color: '#ef4444' }}>*</span>
              </FormLabel>
              <Grid container spacing={2}>
                {CONDICIONES_GENERALES.map((condicion) => (
                  <Grid item xs={6} sm={3} key={condicion.value}>
                    <Button
                      fullWidth
                      onClick={() => handleCondicionChange(condicion.value)}
                      sx={{
                        py: 2,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor:
                          formData.condicionGeneral === condicion.value
                            ? condicion.color
                            : '#334155',
                        backgroundColor:
                          formData.condicionGeneral === condicion.value
                            ? `${condicion.color}20`
                            : '#1e293b',
                        color: '#ffffff',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: condicion.color,
                          backgroundColor: `${condicion.color}20`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 24 }}>{condicion.icon}</Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontSize: 11, textAlign: 'center' }}
                        >
                          {condicion.label}
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Nivel de Dificultad */}
            <Grid item xs={12}>
              <FormLabel sx={{ color: '#e2e8f0', fontWeight: 500, display: 'block', mb: 2 }}>
                Nivel de Dificultad <span style={{ color: '#ef4444' }}>*</span>
              </FormLabel>
              <Grid container spacing={2}>
                {NIVELES_DIFICULTAD.map((nivel) => (
                  <Grid item xs={12} sm={4} key={nivel.value}>
                    <Button
                      fullWidth
                      onClick={() => handleNivelChange(nivel.value)}
                      sx={{
                        py: 1.5,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor:
                          formData.nivelDificultad === nivel.value ? nivel.color : '#334155',
                        backgroundColor:
                          formData.nivelDificultad === nivel.value
                            ? `${nivel.color}20`
                            : '#1e293b',
                        color: '#ffffff',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: nivel.color,
                          backgroundColor: `${nivel.color}20`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        {nivel.value === 'dificil' && (
                          <AlertTriangle size={18} style={{ color: nivel.color }} />
                        )}
                        {nivel.value === 'muy_dificil' && (
                          <AlertCircle size={18} style={{ color: nivel.color }} />
                        )}
                        <Typography variant="body2">{nivel.label}</Typography>
                      </Box>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Observación */}
            <Grid item xs={12}>
              <FormLabel sx={{ color: '#e2e8f0', fontWeight: 500, display: 'block', mb: 1 }}>
                Observación Breve <span style={{ color: '#94a3b8' }}>(Opcional)</span>
              </FormLabel>
              <TextField
                multiline
                rows={3}
                placeholder="Añade cualquier comentario relevante..."
                value={formData.observaciones}
                onChange={handleObservacionChange}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#334155',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                {formData.observaciones?.length || 0}/200 caracteres
              </Typography>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                    }}
                  >
                    Guardar Registro
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: '#475569',
                      color: '#e2e8f0',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: '#1e293b',
                        borderColor: '#64748b',
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};
