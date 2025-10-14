import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Box
    } from '@mui/material';
    import {
    Edit as EditIcon,
    Delete as DeleteIcon
    } from '@mui/icons-material';
    import { Crew } from '../../../domain/entities/Crew';

    interface CrewTableProps {
        crews: Crew[];
        onEdit: (crew: Crew) => void;
        onDelete: (id: string, label?: string) => void;
    }

    const getMemberCountText = (count: number) => {
        return `${count}`;
    };

    // Optimized row component
    const CrewRow = React.memo<{
        crew: Crew;
        onEdit: (crew: Crew) => void;
        onDelete: (id: string, label?: string) => void;
        }>(({ crew, onEdit, onDelete }) => {
        const handleEditClick = React.useCallback((e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit(crew);
    }, [crew, onEdit]);

    const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(crew.id, `${crew.code} — ${crew.description}`);
    }, [crew.id, crew.code, crew.description, onDelete]);

    return (
        <TableRow 
        sx={{ 
            '&:last-child td, &:last-child th': { border: 0 },
            cursor: 'pointer',
            '&:hover': {
            backgroundColor: '#2d3748'
            }
        }}
        >
        <TableCell component="th" scope="row" sx={{ color: '#e2e8f0' }}>
            {crew.code}
        </TableCell>
        <TableCell sx={{ color: '#e2e8f0' }}>{crew.description}</TableCell>
        <TableCell sx={{ color: '#e2e8f0' }}>{getMemberCountText(crew.workers.length)}</TableCell>
        <TableCell sx={{ color: '#e2e8f0' }}>{crew.workArea}</TableCell>
        <TableCell>
            <Chip 
            label={crew.active ? 'Activa' : 'Inactiva'} 
            color={crew.active ? 'success' : 'default'}
            size="small"
            />
        </TableCell>
        <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
                size="small" 
                onClick={handleEditClick}
                sx={{ color: '#3b82f6' }}
            >
                <EditIcon />
            </IconButton>
            <IconButton 
                size="small" 
                onClick={handleDeleteClick}
                sx={{ color: '#ef4444' }}
            >
                <DeleteIcon />
            </IconButton>
            </Box>
        </TableCell>
        </TableRow>
    );
    });

    CrewRow.displayName = 'CrewRow';

    export const CrewTable: React.FC<CrewTableProps> = ({
        crews,
        onEdit,
        onDelete
    }) => {
    return (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
        <Table sx={{ minWidth: 650 }} aria-label="crew table">
            <TableHead>
            <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Codigo</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Miembros</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Área</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {crews.map((crew) => (
                <CrewRow
                key={crew.id}
                crew={crew}
                onEdit={onEdit}
                onDelete={onDelete}
                />
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
};