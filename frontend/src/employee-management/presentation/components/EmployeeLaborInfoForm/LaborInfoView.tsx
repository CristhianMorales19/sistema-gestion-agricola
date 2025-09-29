// src/employee-management/presentation/components/LaborInfoView/LaborInfoView.tsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    MenuItem,
    Grid,
    InputAdornment
} from '@mui/material';
import { ArrowBack as ArrowBackIcon,  Event as EventIcon } from '@mui/icons-material';
import { LaborInfoData } from '../../../domain/entities/Employee';

interface LaborInfoViewProps {
    employee: { id: string; name: string } | null;
    loading: boolean;
    onCancel: () => void;
    onSave: (data: LaborInfoData) => Promise<boolean>;
}

export const LaborInfoView: React.FC<LaborInfoViewProps> = ({
    employee,
    loading,
    onCancel,
    onSave
}) => {
    const [formData, setFormData] = useState<LaborInfoData>({
        employeeId: 0,
        role: '',
        department: '',
        baseSalary: 0,
        contractType: '',
        entryDate: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LaborInfoData, string>>>({});

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
            setFormData(prev => ({
                ...prev,
                employeeId: parseInt(employee.id)
            }));
        }
    }, [employee]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof LaborInfoData, string>> = {};
        if (formData.baseSalary <= 0) {
            newErrors.baseSalary = 'El salario debe ser mayor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true si no hay errores
    };

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
        if (!validateForm()) return;
        // Solo enviar los datos, el manejo de loading y mensajes lo hace el padre

        const result = await onSave(formData);
        if (result) {
            setFormData({
                employeeId: parseInt(employee.id),
                role: '',
                department: '',
                baseSalary: 0,
                contractType: '',
                entryDate: new Date().toISOString().split('T')[0],
            });
            setErrors({});
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
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Paper sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                <Box component="form" onSubmit={handleSubmit}>
                     {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Información Laboral
                        </Typography>
                    </Box>

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
                            name="role"
                            value={formData.role}
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
                        {/* Salario base */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                            fullWidth
                            label="Salario Base"
                            name="baseSalary"
                            type="number"
                            value={formData.baseSalary}
                            onChange={handleChange}
                            required
                            error={!!errors.baseSalary}
                            helperText={errors.baseSalary}
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>}}
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
                        {/* Departamento */}
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
                        {/* Fecha de ingreso */}
                        <Grid item xs={12} md={6}>
                            <TextField
                            fullWidth
                            label="Fecha de ingreso"
                            name="entryDate"
                            type="date"
                            value={formData.entryDate}
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