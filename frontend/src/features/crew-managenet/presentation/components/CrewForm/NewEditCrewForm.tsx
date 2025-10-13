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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export interface NewCrewFormData {
    code: string;
    description: string;
    workArea: string;
    workers: string[];
}

interface NewCrewFormProps {
    onSubmit: (data: CreateCrewData) => Promise<boolean>;
    onCancel: () => void;
    employees: Employee[];
    initialData?: NewCrewFormData;
}

export const NewEditCrewForm: React.FC<NewCrewFormProps> = ({
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

    const getChangedFields = (initial: NewCrewFormData, current: NewCrewFormData) => {
        const changes: Partial<NewCrewFormData> = {};

        (Object.keys(current) as Array<keyof NewCrewFormData>).forEach(key => {
            if (JSON.stringify(initial[key]) !== JSON.stringify(current[key]))
                changes[key] = current[key] as any;
        });

        return changes;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const changes = initialData ? getChangedFields(initialData, formData) : formData;

        if (await onSubmit(changes as CreateCrewData))
            if (!initialData)
                setFormData({
                    code: '',
                    description: '',
                    workArea: '',
                    workers: [],
                });
        setLoading(false);
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
                        required
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
                        required
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
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: '#94a3b8',
                                borderColor: '#475569',
                                '&:hover': {
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
                            {loading ? 'Guardando...' : (initialData ? 'Guardar' : 'Crear Cuadrilla')}
                        </Button>
                    </Box>
                </Box>
            </form>
        </Paper>
    );
};