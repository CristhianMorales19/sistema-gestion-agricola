// src/features/parcel-management/presentation/components/ParcelTable/ParcelTable.tsx
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
  Box,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Parcel } from '../../../domain/entities/Parcel';
import { ParcelService } from '../../../application/ParcelService';

interface ParcelTableProps {
  parcels: Parcel[];
  selectedParcelId?: number;
  onEdit: (parcel: Parcel) => void;
  onDelete: (id: number) => void;
  onSelect: (parcel: Parcel) => void;
}

// Componente optimizado para cada fila
const ParcelRow = React.memo<{
  parcel: Parcel;
  isSelected: boolean;
  onEdit: (parcel: Parcel) => void;
  onDelete: (id: number) => void;
  onSelect: (parcel: Parcel) => void;
}>(({ parcel, isSelected, onEdit, onDelete, onSelect }) => {
  const handleRowClick = React.useCallback(() => {
    onSelect(parcel);
  }, [parcel, onSelect]);

  const handleEditClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(parcel);
  }, [parcel, onEdit]);

  const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (parcel.id) {
      onDelete(parcel.id);
    }
  }, [parcel.id, onDelete]);

  return (
    <TableRow 
      onClick={handleRowClick}
      sx={{ 
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor: isSelected ? '#334155' : 'transparent',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: isSelected ? '#334155' : '#2d3748'
        }
      }}
    >
      <TableCell component="th" scope="row" sx={{ color: '#e2e8f0' }}>
        {parcel.nombre}
      </TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>
        {parcel.ubicacionDescripcion}
      </TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>
        {ParcelService.formatArea(parcel.areaHectareas)}
      </TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>
        {ParcelService.getTipoTerrenoLabel(parcel.tipoTerreno, parcel.tipoTerrenoOtro)}
      </TableCell>
      <TableCell>
        <Chip 
          label={ParcelService.getEstadoLabel(parcel.estado)} 
          size="small"
          sx={{
            backgroundColor: ParcelService.getEstadoColor(parcel.estado),
            color: '#ffffff'
          }}
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

ParcelRow.displayName = 'ParcelRow';

export const ParcelTable: React.FC<ParcelTableProps> = ({
  parcels,
  selectedParcelId,
  onEdit,
  onDelete,
  onSelect
}) => {
  if (parcels.length === 0) {
    return (
      <Paper sx={{ p: 4, backgroundColor: '#1e293b', border: '1px solid #334155', textAlign: 'center' }}>
        <Typography sx={{ color: '#94a3b8' }}>
          No hay parcelas registradas
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <Table sx={{ minWidth: 650 }} aria-label="parcel table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Ubicación</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Área</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Tipo Terreno</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parcels.map((parcel) => (
            <ParcelRow
              key={parcel.id}
              parcel={parcel}
              isSelected={selectedParcelId === parcel.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
