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

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  selectedEmployeeId,
  onEdit,
  onDelete,
  onSelect
}) => {

  console.log('Employees in table:', employees);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'success';
      case 'inactivo': return 'error';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  const handleRowClick = (employee: Employee) => {
    onSelect(employee);
  };

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
            <TableRow 
              key={employee.id} 
              onClick={() => handleRowClick(employee)}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: selectedEmployeeId === employee.id ? '#334155' : 'transparent',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: selectedEmployeeId === employee.id ? '#334155' : '#2d3748'
                }
              }}
            >
              <TableCell component="th" scope="row" sx={{ color: '#e2e8f0' }}>
                {employee.name}
              </TableCell>
              <TableCell sx={{ color: '#e2e8f0' }}>{employee.identification}</TableCell>
              <TableCell sx={{ color: '#e2e8f0' }}>{employee.position}</TableCell>
              <TableCell sx={{ color: '#e2e8f0' }}>{formatDate(employee.hireDate)}</TableCell>
              <TableCell>
                <Chip 
                  label={employee.status === 'activo' ? 'Activo' : 
                          employee.status === 'inactivo' ? 'Inactivo' : 'Permiso'} 
                  color={getStatusColor(employee.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevenir que el click en el botón active la selección
                      onEdit(employee);
                    }}
                    sx={{ color: '#3b82f6' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevenir que el click en el botón active la selección
                      onDelete(employee.id);
                    }}
                    sx={{ color: '#ef4444' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};