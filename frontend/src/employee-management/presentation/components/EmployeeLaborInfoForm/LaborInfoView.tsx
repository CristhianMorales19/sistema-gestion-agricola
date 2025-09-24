// src/employee-management/presentation/components/LaborInfoView/LaborInfoView.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export interface LaborInfoData {
  position: string;
  baseSalary: number;
  contractType: string;
  department: string;
}

interface LaborInfoViewProps {
  employee: { id: string; name: string } | null;
  onCancel: () => void;
  onSave: (data: LaborInfoData) => Promise<void>;
}

export const LaborInfoView: React.FC<LaborInfoViewProps> = ({
  employee,
  onCancel,
  onSave
}) => {
  const [formData, setFormData] = useState<LaborInfoData>({
    position: '',
    baseSalary: 0,
    contractType: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const contractTypes = [
    { value: 'full_time', label: 'Tiempo Completo' },
    { value: 'part_time', label: 'Medio Tiempo' },
    { value: 'temporary', label: 'Temporal' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const departments = [
    { value: 'hr', label: 'Recursos Humanos' },
    { value: 'it', label: 'Tecnología' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operaciones' },
    { value: 'sales', label: 'Ventas' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'baseSalary' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error al guardar información laboral:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!employee) {
    return (
      <Paper sx={{ p: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Typography color="error">No se ha seleccionado ningún empleado</Typography>
        <Button onClick={onCancel} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Volver a la lista
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ color: '#ffffff', mb: 3 }}>
          Información Laboral
        </Typography>

        {/* Información del empleado (no editable) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ID del Empleado"
              value={employee.id}
              InputProps={{ readOnly: true }}
              sx={{
                '& .MuiInputBase-input': { color: '#94a3b8' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Empleado"
              value={employee.name}
              InputProps={{ readOnly: true }}
              sx={{
                '& .MuiInputBase-input': { color: '#94a3b8' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Campos editables */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cargo"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salario Base"
              name="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={handleChange}
              required
              InputProps={{ startAdornment: '$' }}
              sx={{
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Tipo de Contrato"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            >
              {contractTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Departamento"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              sx={{
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#64748b' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
              }}
            >
              {departments.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Button
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
            disabled={loading}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' },
              '&:disabled': { backgroundColor: '#475569' }
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Información Laboral'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};