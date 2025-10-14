import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { validateLaborInfo, LaborInfoErrors } from './validation';

export interface LaborInfoData {
  position: string;
  baseSalary: number;
  contractType: string;
  area?: string; // Área o unidad organizativa (reemplaza a department)
  // Campos añadidos para reportes / comprobantes
  payrollCode?: string;
  salaryGross?: number;
  ccssDeduction?: number;
  otherDeductions?: number;
  salaryPerHour?: number;
  ordinaryHours?: number;
  extraHours?: number;
  otherHours?: number;
  vacationAmount?: number;
  incapacityAmount?: number;
  lactationAmount?: number;
  salaryAverage?: number; // Salario promedio
  monthsWorked?: number; // Meses trabajados
  hoursReported?: number; // Horas reportadas
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
    area: ''
  });
  // Inicializar campos adicionales al montar para evitar inputs uncontrolled
  useEffect(() => {
    setFormData(prev => ({
      payrollCode: prev.payrollCode ?? '',
      position: prev.position ?? '',
      baseSalary: prev.baseSalary ?? 0,
      contractType: prev.contractType ?? '',
      area: prev.area ?? '',
      salaryGross: prev.salaryGross ?? 0,
      ccssDeduction: prev.ccssDeduction ?? 0,
      otherDeductions: prev.otherDeductions ?? 0,
      salaryPerHour: prev.salaryPerHour ?? 0,
      ordinaryHours: prev.ordinaryHours ?? 0,
      extraHours: prev.extraHours ?? 0,
      otherHours: prev.otherHours ?? 0,
      vacationAmount: prev.vacationAmount ?? 0,
      incapacityAmount: prev.incapacityAmount ?? 0,
      lactationAmount: prev.lactationAmount ?? 0,
      salaryAverage: prev.salaryAverage ?? 0,
      monthsWorked: prev.monthsWorked ?? 0,
      hoursReported: prev.hoursReported ?? 0,
    } as LaborInfoData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LaborInfoErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const contractTypes = [
    { value: 'full_time', label: 'Tiempo Completo' },
    { value: 'part_time', label: 'Medio Tiempo' },
    { value: 'temporary', label: 'Temporal' },
    { value: 'freelance', label: 'Freelance' }
  ];

  // Estilo atenuado (igual al campo ID) para campos de información laboral
  const mutedFieldSx = {
    '& .MuiInputBase-input': { color: '#94a3b8' },
    '& .MuiInputLabel-root': { color: '#94a3b8' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#475569' }
    }
  } as const;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['baseSalary','salaryGross','ccssDeduction','otherDeductions','salaryPerHour','ordinaryHours','extraHours','otherHours','vacationAmount','incapacityAmount','lactationAmount','salaryAverage','monthsWorked','hoursReported'].includes(name)
        ? (parseFloat(value) || 0)
        : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    // Limpiar mensajes previos
    setServerError(null);
    setSuccessMessage(null);

    // Validar antes de abrir confirmación
    const validation = validateLaborInfo(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setServerError('Por favor corrija los errores en el formulario');
      return;
    }

    // Abrir diálogo de confirmación
    setConfirmOpen(true);
  }, [employee, formData]);

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      await onSave(formData);
      setSuccessMessage('Información laboral guardada exitosamente');
      setServerError(null);
    } catch (error: any) {
      console.error('Error al guardar información laboral:', error);
      let errorMessage = 'Error al guardar la información laboral. Intente nuevamente.';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      setServerError(errorMessage);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => setConfirmOpen(false);

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

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

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
              error={Boolean(errors.position)}
              helperText={errors.position}
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
              label="Código de Nómina (Cod)"
              name="payrollCode"
              value={formData.payrollCode}
              onChange={handleChange}
              sx={mutedFieldSx}
              error={Boolean(errors.payrollCode)}
              helperText={errors.payrollCode}
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
              error={Boolean(errors.baseSalary)}
              helperText={errors.baseSalary}
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
              error={Boolean(errors.contractType)}
              helperText={errors.contractType}
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
              label="Área / Departamento"
              name="area"
              value={formData.area}
              onChange={handleChange}
              error={Boolean(errors.area)}
              helperText={errors.area || 'Área o unidad organizativa del trabajador'}
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

          {/* Campos de nómina / comprobantes */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salario Bruto"
              name="salaryGross"
              type="number"
              value={formData.salaryGross}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rebajas CCSS"
              name="ccssDeduction"
              type="number"
              value={formData.ccssDeduction}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Otras Rebajas"
              name="otherDeductions"
              type="number"
              value={formData.otherDeductions}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salario por Hora"
              name="salaryPerHour"
              type="number"
              value={formData.salaryPerHour}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Horas Ordinarias (HN)"
              name="ordinaryHours"
              type="number"
              value={formData.ordinaryHours}
              onChange={handleChange}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Horas Extras (HE)"
              name="extraHours"
              type="number"
              value={formData.extraHours}
              onChange={handleChange}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Horas Otras"
              name="otherHours"
              type="number"
              value={formData.otherHours}
              onChange={handleChange}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Vacaciones (monto)"
              name="vacationAmount"
              type="number"
              value={formData.vacationAmount}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Incapacidad (monto)"
              name="incapacityAmount"
              type="number"
              value={formData.incapacityAmount}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Lactancia (monto)"
              name="lactationAmount"
              type="number"
              value={formData.lactationAmount}
              onChange={handleChange}
              InputProps={{ startAdornment: '$' }}
              sx={mutedFieldSx}
            />
          </Grid>

          {/* Mostrar cálculos rápidos */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salario Neto (estimado)"
              value={
                ((formData.salaryGross || formData.baseSalary) - (formData.ccssDeduction || 0) - (formData.otherDeductions || 0)).toFixed(2)
              }
              InputProps={{ readOnly: true }}
              sx={mutedFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salario por Hora (estimado)"
              value={
                ((formData.salaryPerHour && formData.salaryPerHour > 0)
                  ? formData.salaryPerHour
                  : (formData.salaryGross || formData.baseSalary) && (formData.salaryGross || formData.baseSalary) / (30 * 8)
                )
              }
              InputProps={{ readOnly: true }}
              sx={mutedFieldSx}
            />
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
        {/* Dialogo de confirmación antes de enviar */}
        <Dialog
          open={confirmOpen}
          onClose={handleCancelConfirm}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">Confirmar cambios</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              ¿Deseas guardar los cambios en la información laboral? Se actualizarán los campos seleccionados.
            </DialogContentText>
            {/* Pequeño resumen de los cambios */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2"><strong>Cargo:</strong> {formData.position || '—'}</Typography>
              <Typography variant="body2"><strong>Tipo de contrato:</strong> {formData.contractType || '—'}</Typography>
              <Typography variant="body2"><strong>Salario Base:</strong> {formData.baseSalary ?? '—'}</Typography>
              <Typography variant="body2"><strong>Área:</strong> {formData.area || '—'}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelConfirm}>Cancelar</Button>
            <Button onClick={handleConfirm} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  );
};