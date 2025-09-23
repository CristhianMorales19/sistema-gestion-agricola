// src/employee-management/presentation/components/EmployeeManagementView/EmployeeManagementView.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { EmployeeTable } from '../EmployeeTable/EmployeeTable';
import { NewEmployeeForm, NewEmployeeFormData } from '../EmployeeForm/NewEmployeeForm';
import { useEmployeeManagement } from '../../../application/hooks/useEmployeeManagement';
import { Employee } from '../../../domain/entities/Employee';

type EmployeeView = 'list' | 'new-employee' | 'labor-info';

export const EmployeeManagementView: React.FC = () => {
  const { employees, loading, error, deleteEmployee, searchEmployees, refreshEmployees, createEmployee } = useEmployeeManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentView, setCurrentView] = useState<EmployeeView>('list'); // Estado para controlar la vista

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      await searchEmployees(searchQuery.trim());
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setIsSearching(false);
    await refreshEmployees();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddLaborInfo = () => {
    setCurrentView('labor-info');
  };

  const handleAddEmployeeClick = () => {
    setCurrentView('new-employee');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    refreshEmployees(); // Recargar datos si es necesario
  };

  const handleCreateEmployee = async (data: NewEmployeeFormData) => {
    try {
      await createEmployee(data);
      await refreshEmployees();
    } catch (err) {
      console.error('Error al crear empleado:', err);
      throw err;
    }
  };

  const handleEdit = (employee: Employee) => {
    console.log('Editar empleado:', employee);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      try {
        await deleteEmployee(id);
        await refreshEmployees();
      } catch (err) {
        console.error('Error al eliminar empleado:', err);
      }
    }
  };

  const handleSaveLaborInfo = async (laborData: any) => {
    try {
      // Lógica para guardar info laboral
      console.log('Guardando info laboral:', laborData);
      await handleBackToList();
    } catch (err) {
      console.error('Error al guardar info laboral:', err);
      throw err;
    }
  };

  // Renderizar contenido basado en la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'new-employee':
        return (
          <NewEmployeeForm
            onSubmit={handleCreateEmployee}
            onCancel={handleBackToList}
          />
        );

      // case 'labor-info':
      //   return (
      //     <LaborInfoView
      //       onCancel={handleBackToList}
      //       onSave={handleSaveLaborInfo}
      //     />
      //   );

      case 'list':
      default:
        return (
          <>
            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Buscar por cédula, nombre o cargo..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    sx: { color: '#ffffff' }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#475569' },
                      '&:hover fieldset': { borderColor: '#64748b' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={searchQuery.trim().length === 0}
                  sx={{
                    minWidth: '100px',
                    backgroundColor: '#6366f1',
                    '&:hover': { backgroundColor: '#4f46e5' },
                    '&:disabled': { backgroundColor: '#475569' }
                  }}
                >
                  Buscar
                </Button>
                {isSearching && (
                  <Button
                    variant="outlined"
                    onClick={handleClearSearch}
                    sx={{
                      minWidth: '100px',
                      color: '#94a3b8',
                      borderColor: '#475569',
                      '&:hover': {
                        color: '#ffffff',
                        borderColor: '#64748b',
                        backgroundColor: '#334155'
                      }
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </Box>
              {isSearching && (
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                  Mostrando resultados para: "{searchQuery}"
                </Typography>
              )}
            </Paper>

            {/* Employee Table */}
            <EmployeeTable
              employees={employees}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        );
    }
  };

  if (loading && currentView === 'list') {
    return <Typography>Cargando empleados...</Typography>;
  }

  if (error && currentView === 'list') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header - Siempre visible */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Gestión de Personal
        </Typography>
        
        {/* Mostrar botones solo en la vista de lista */}
        {currentView === 'list' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<WorkIcon />}
              onClick={handleAddLaborInfo}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              Agregar Info Laboral
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddEmployeeClick}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Nuevo Trabajador
            </Button>
          </Box>
        )}
      </Box>

      {/* Contenido dinámico */}
      {renderContent()}
    </Box>
  );
};