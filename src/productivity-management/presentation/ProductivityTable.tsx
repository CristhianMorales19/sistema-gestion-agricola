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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ProductivityRecord } from '../../../domain/entities/Productivity';

interface ProductivityTableProps {
  records: ProductivityRecord[];
  onEdit: (record: ProductivityRecord) => void;
  // onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ProductivityRow = React.memo<{
  record: ProductivityRecord;
  onEdit: (record: ProductivityRecord) => void;
  // onDelete: (id: string) => void;
}>(({ record, onEdit }) => {
  const handleEditClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(record);
    },
    [record, onEdit]
  );

  // const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onDelete(record.id);
  // }, [record.id, onDelete]);

  return (
    <TableRow
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#2d3748' },
      }}
    >
      <TableCell sx={{ color: '#e2e8f0' }}>{record.worker.name}</TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>{record.task.name}</TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>{record.producedQuantity}</TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>{record.unit}</TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>
        {formatDate(record.date)}
      </TableCell>
      <TableCell>
        <Chip
          label={`${record.calculatedPerformance?.toFixed(2) ?? 0}`}
          color={record.calculatedPerformance > 0 ? 'success' : 'default'}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
  size="small"
  onClick={handleEditClick}
  sx={{ color: '#3b82f6' }}
  aria-label="edit"
>
  <EditIcon />
</IconButton>

<IconButton
  size="small"
  sx={{ color: '#ef4444' }}
  aria-label="delete"
>
  <DeleteIcon />
</IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
});

ProductivityRow.displayName = 'ProductivityRow';

export const ProductivityTable: React.FC<ProductivityTableProps> = ({
  records,
  onEdit,
}) => {
	 console.log("Datos recibidos por ProductivityTable:", records);
  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
    >
      <Table sx={{ minWidth: 800 }} aria-label="productivity table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Trabajador
            </TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Tarea
            </TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Cantidad
            </TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Unidad
            </TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Fecha
            </TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Rendimiento
            </TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <ProductivityRow
              key={record.id}
              record={record}
              onEdit={onEdit}
              // onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};