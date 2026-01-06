// src/employee-management/presentation/components/EmployeeTable/EmployeeTable.tsx
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
import { Employee } from '../../../domain/entities/Employee';

interface EmployeeTableProps {
  employees: Employee[];
  selectedEmployeeId?: string;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onSelect: (employee: Employee) => void;
}

// Funciones auxiliares fuera del componente
const getStatusColor = (status: boolean) => {
  switch (status) {
    case true: return 'success';
    case false: return 'error';
    default: return 'default';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-ES');
};

// Componente optimizado para cada fila
const EmployeeRow = React.memo<{
  employee: Employee;
  isSelected: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onSelect: (employee: Employee) => void;
}>(({ employee, isSelected, onEdit, onDelete, onSelect }) => {
  const handleRowClick = React.useCallback(() => {
    onSelect(employee);
  }, [employee, onSelect]);

  const handleEditClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(employee);
  }, [employee, onEdit]);

  const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(employee.id);
  }, [employee.id, onDelete]);

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
        {employee.name}
      </TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>{employee.identification}</TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>{employee.cargo}</TableCell>
      <TableCell sx={{ color: '#e2e8f0' }}>{formatDate(employee.hireDate)}</TableCell>
      <TableCell>
        <Chip 
          label={employee.status ? 'Activo' : 'Inactivo'} 

          color={getStatusColor(employee.status)}
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

EmployeeRow.displayName = 'EmployeeRow';

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  selectedEmployeeId,
  onEdit,
  onDelete,
  onSelect
}) => {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <Table sx={{ minWidth: 650 }} aria-label="employee table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Empleado</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Cédula</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Cargo</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Fecha Ingreso</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              isSelected={selectedEmployeeId === employee.id}
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