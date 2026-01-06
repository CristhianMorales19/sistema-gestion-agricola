import React, { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip
} from '@mui/material';
import { Add, Delete, Search } from '@mui/icons-material';
import { Employee } from '@features/personnel-management';

interface CrewMembersTableProps {
    employees: Employee[];
    selectedWorkers: string[];
    onAddWorker: (workerId: string) => void;
    onRemoveWorker: (workerId: string) => void;
}

export const CrewMembersTable = ({employees, selectedWorkers, onAddWorker, onRemoveWorker}: CrewMembersTableProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filtrar empleados basado en la búsqueda
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        
        const term = searchTerm.toLowerCase();
        return employees.filter(employee => 
            employee.identification.toLowerCase().includes(term) ||
            (employee.position && employee.position.toLowerCase().includes(term)) ||
            employee.name.toLowerCase().includes(term)
        );
    }, [employees, searchTerm]);

    // Obtener empleados que están en la cuadrilla
    const crewMembers = useMemo(() => {
        return employees.filter(employee => selectedWorkers.includes(employee.id));
    }, [employees, selectedWorkers]);

    // Obtener empleados disponibles (no en la cuadrilla)
    const availableEmployees = useMemo(() => {
        return filteredEmployees.filter(employee => !selectedWorkers.includes(employee.id));
    }, [filteredEmployees, selectedWorkers]);

    return (
        <Box>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Gestión de Trabajadores
            </Typography>
            
            {/* Buscador */}
            <TextField
                label="Buscar por cédula o cargo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                InputProps={{
                    startAdornment: <Search sx={{ color: '#94a3b8', mr: 1 }} />,
                    sx: { color: '#ffffff' }
                }}
                InputLabelProps={{ sx: { color: '#94a3b8' } }}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#475569' },
                        '&:hover fieldset': { borderColor: '#64748b' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Tabla de trabajadores disponibles */}
                <Paper sx={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid #334155' }}>
                        <Typography variant="h6" sx={{ color: '#ffffff' }}>
                            Trabajadores Disponibles
                            <Chip 
                                label={availableEmployees.length} 
                                size="small" 
                                sx={{ ml: 1, backgroundColor: '#3b82f6', color: 'white' }} 
                            />
                        </Typography>
                    </Box>
                    <TableContainer sx={{ maxHeight: 300 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Nombre
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Cédula
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Cargo
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Acción
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {availableEmployees.map((employee) => (
                                    <TableRow key={employee.id} sx={{ '&:hover': { backgroundColor: '#1e293b' } }}>
                                        <TableCell sx={{ color: '#e2e8f0', borderColor: '#334155' }}>
                                            {employee.name}
                                        </TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', borderColor: '#334155' }}>
                                            {employee.identification}
                                        </TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', borderColor: '#334155' }}>
                                            {employee.position || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ borderColor: '#334155' }}>
                                            <IconButton
                                                onClick={() => onAddWorker(employee.id)}
                                                sx={{ 
                                                    color: '#10b981',
                                                    '&:hover': { 
                                                        backgroundColor: 'rgba(16, 185, 129, 0.1)' 
                                                    }
                                                }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {availableEmployees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ 
                                            textAlign: 'center', 
                                            color: '#94a3b8', 
                                            borderColor: '#334155',
                                            py: 3
                                        }}>
                                            {searchTerm ? 'No se encontraron trabajadores' : 'No hay trabajadores disponibles'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Tabla de trabajadores en la cuadrilla */}
                <Paper sx={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid #334155' }}>
                        <Typography variant="h6" sx={{ color: '#ffffff' }}>
                            Miembros de la Cuadrilla
                            <Chip 
                                label={crewMembers.length} 
                                size="small" 
                                sx={{ ml: 1, backgroundColor: '#10b981', color: 'white' }} 
                            />
                        </Typography>
                    </Box>
                    <TableContainer sx={{ maxHeight: 300 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Nombre
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Cédula
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Cargo
                                    </TableCell>
                                    <TableCell sx={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                        Acción
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {crewMembers.map((employee) => (
                                    <TableRow key={employee.id} sx={{ '&:hover': { backgroundColor: '#1e293b' } }}>
                                        <TableCell sx={{ color: '#e2e8f0', borderColor: '#334155' }}>
                                            {employee.name}
                                        </TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', borderColor: '#334155' }}>
                                            {employee.identification}
                                        </TableCell>
                                        <TableCell sx={{ color: '#e2e8f0', borderColor: '#334155' }}>
                                            {employee.position || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{ borderColor: '#334155' }}>
                                            <IconButton
                                                onClick={() => onRemoveWorker(employee.id)}
                                                sx={{ 
                                                    color: '#ef4444',
                                                    '&:hover': { 
                                                        backgroundColor: 'rgba(239, 68, 68, 0.1)' 
                                                    }
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {crewMembers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ 
                                            textAlign: 'center', 
                                            color: '#94a3b8', 
                                            borderColor: '#334155',
                                            py: 3
                                        }}>
                                            No hay miembros en la cuadrilla
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Box>
    );
};