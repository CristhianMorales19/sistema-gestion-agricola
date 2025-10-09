import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    MenuItem
    } from '@mui/material';
    import { CreateCrewData } from '../../../domain/entities/Crew';

    export interface NewCrewFormData {
        code: string;
        description: string;
        workArea: string;
        workers: string[];
    }

    interface NewCrewFormProps {
        onSubmit: (data: CreateCrewData) => Promise<void>;
        onCancel: () => void;
        initialData?: NewCrewFormData;
    }

    // Mock data for employees - in a real app, this would come from props or context
    const availableEmployees = [
        { id: '1', name: 'John Doe', identification: '123456789' },
        { id: '2', name: 'Jane Smith', identification: '987654321' },
        { id: '3', name: 'Bob Johnson', identification: '456123789' },
    ];

    export const NewCrewForm: React.FC<NewCrewFormProps> = ({
    onSubmit,
    onCancel,
    initialData
    }) => {
    const [formData, setFormData] = useState<NewCrewFormData>(
        initialData || {
            code: '',
            description: '',
            workArea: '',
            workers: [],
        }
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
        await onSubmit(formData);
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (field: keyof NewCrewFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
        ...prev,
        [field]: e.target.value
        }));
    };

    const handleWorkersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
        ...prev,
        members: typeof value === 'string' ? value.split(',') : value
        }));
    };

    return (
        <Paper sx={{ p: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Typography variant="h5" sx={{ color: '#ffffff', mb: 3 }}>
            {initialData ? 'Editar Cuadrilla' : 'Crear Nueva Cuadrilla'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
                label="Codigo"
                value={formData.code}
                onChange={handleChange('code')}
                required
                fullWidth
                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                InputProps={{ sx: { color: '#ffffff' } }}
                sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
                }}
            />

            <TextField
                label="Descripción"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={3}
                fullWidth
                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                InputProps={{ sx: { color: '#ffffff' } }}
                sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
                }}
            />

            <TextField
                label="Área de Trabajo"
                value={formData.workArea}
                onChange={handleChange('workArea')}
                multiline
                rows={3}
                fullWidth
                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                InputProps={{ sx: { color: '#ffffff' } }}
                sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
                }}
            />

            <TextField
                select
                label="Miembros"
                value={formData.workers}
                onChange={handleWorkersChange}
                SelectProps={{
                multiple: true,
                sx: { color: '#ffffff' }
                }}
                fullWidth
                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#64748b' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                }
                }}
            >
                {availableEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.identification})
                </MenuItem>
                ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                type="button"
                onClick={onCancel}
                sx={{
                    color: '#94a3b8',
                    borderColor: '#475569',
                    '&:hover': {
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
                {loading ? 'Guardando...' : (initialData ? 'Guardar' : 'Crear Cuadrilla')}
                </Button>
            </Box>
            </Box>
        </form>
        </Paper>
    );
};