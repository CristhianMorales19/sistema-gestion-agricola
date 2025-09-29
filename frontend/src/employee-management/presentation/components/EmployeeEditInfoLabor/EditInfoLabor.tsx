// src/employee-management/presentation/components/EmployeeLaborInfoForm/EditInfoLabor.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
} from '@mui/icons-material';
import { Employee } from '../../../domain/entities/Employee';

interface EditInfoLaborProps {
  employee: Employee | null;
  onCancel: () => void;
  onSave: (data: Partial<Employee>) => Promise<void>;
  loading?: boolean;
}

type EmployeeFormData = Omit<Employee, "birthDate" | "entryDate"> & {
  birthDate: string;
  entryDate: string;
};

export const EditInfoLabor: React.FC<EditInfoLaborProps> = ({
  employee,
  onCancel,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<EmployeeFormData>>({});
  const [originalData, setOriginalData] = useState<EmployeeFormData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

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

  useEffect(() => {
    if (employee) {
      console.log("📌 Datos recibidos en employee:", employee);
      const initialData: EmployeeFormData = {
        ...employee,
        birthDate: employee.birthDate
          ? new Date(employee.birthDate).toISOString().split("T")[0]
          : "",
        entryDate: employee.entryDate
          ? new Date(employee.entryDate).toISOString().split("T")[0]
          : "",
        phone: employee.phone || ""
      };

      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Employee, string>> = {};

    if (!formData.baseSalary || formData.baseSalary <= 0) {
      newErrors.baseSalary = 'El salario debe ser mayor a 0';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (formData.phone && !/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe contener solo números';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'baseSalary' ? parseFloat(value) || 0 : value
    }));
  };

  // Detectar campos modificados
  const getChangedFields = (): Partial<Employee> => {
    if (!originalData || !formData) return {};
    
    const changes: Partial<Employee> = {};
    const fields: (keyof EmployeeFormData)[] = [
      'name', 'role', 'birthDate', 'entryDate', 'phone', 
      'email', 'baseSalary', 'contractType', 'department'
    ];

    fields.forEach(field => {
      const originalValue = originalData[field];
      const currentValue = formData[field];
      
      if (currentValue !== originalValue) {
        // Convertir strings de fecha de vuelta a Date si es necesario
        if ((field === 'birthDate' || field === 'entryDate') && currentValue) {
          changes[field] = new Date(currentValue);
        } else {
          changes[field as keyof Employee] = currentValue as any;
        }
      }
    });

    return changes;
  };

  const hasChanges = (): boolean => {
    return Object.keys(getChangedFields()).length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    if (!validateForm()) return;
    if (!hasChanges()) {
      alert('No se detectaron cambios para guardar');
      onCancel();
      return;
    }
    const changes = getChangedFields();
    console.log('📝 Campos modificados:', changes);
    
    // Crear objeto con solo los datos modificados
    const updateData = {
      ...changes,
      id: employee.id // Siempre incluir el ID
    };

    await onSave(updateData as Employee);
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
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 3 }}>
            Editar Información Laboral
          </Typography>

          <Grid container spacing={3}>
            {/* Cedula / ID (no editable) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identificación"
                value={employee.identification || ''}
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiInputBase-input': { color: '#94a3b8' },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#475569' } }
                }}
              />
            </Grid>

            {/* Nombre (editable si quieres) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name || ''}
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

            {/* Cargo */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cargo"
                name="role"
                value={formData.role || ''}
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

            {/* Fecha de nacimiento */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                name="birthDate"
                type="date"
                value={formData.birthDate || ''}
                onChange={handleChange}
                error={!!errors.birthDate}
                helperText={errors.birthDate}
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
                name="entryDate"
                type="date"
                value={formData.entryDate || ''}
                onChange={handleChange}
                error={!!errors.entryDate}
                helperText={errors.entryDate}
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
                name="phone"
                value={formData.phone || ''}
                required
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
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
                value={formData.email || ''}
                onChange={handleChange}
                error={!!errors.email}
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

            {/* Salario */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salario Base"
                name="baseSalary"
                type="number"
                value={formData.baseSalary || ''}   // si es undefined → ""
                onChange={handleChange}
                error={!!errors.baseSalary}
                helperText={errors.baseSalary}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
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

            {/* Tipo de contrato */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Contrato"
                name="contractType"
                value={formData.contractType || ''}
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

            {/* Departamento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Departamento"
                name="department"
                value={formData.department || ''}
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
              Volver
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
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};