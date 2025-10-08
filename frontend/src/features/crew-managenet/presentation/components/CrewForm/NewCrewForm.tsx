import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import { CreateCrewData } from '../../../domain/entities/Crew';
import { Employee } from '@features/personnel-management';
import { CrewMembersTable } from './CrewMembersTable';

export interface NewCrewFormData {
    code: string;
    description: string;
    workArea: string;
    workers: string[];
}

interface NewCrewFormProps {
    onSubmit: (data: CreateCrewData) => Promise<void>;
    onCancel: () => void;
    employees: Employee[];
    initialData?: NewCrewFormData;
}

export const NewCrewForm: React.FC<NewCrewFormProps> = ({
    onSubmit,
    onCancel,
    employees,
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

    const addWorker = (workerId: string) => {
        if (!formData.workers.includes(workerId)) {
            setFormData(prev => ({
                ...prev,
                workers: [...prev.workers, workerId]
            }));
        }
    };

    const removeWorker = (workerId: string) => {
        setFormData(prev => ({
            ...prev,
            workers: prev.workers.filter(id => id !== workerId)
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
                        label="Código"
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

                    {/* Componente de gestión de trabajadores */}
                    <CrewMembersTable
                        employees={employees}
                        selectedWorkers={formData.workers}
                        onAddWorker={addWorker}
                        onRemoveWorker={removeWorker}
                    />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outlined"
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