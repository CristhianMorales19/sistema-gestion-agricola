// src/employee-management/presentation/components/EmployeeManagementView/EmployeeManagementView.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { EmployeeTable } from '../EmployeeTable/EmployeeTable';
import { NewEmployeeForm } from '../EmployeeForm/NewEmployeeForm';
import { LaborInfoView } from '../EmployeeLaborInfoForm/LaborInfoView'; // Nueva importación
import { useEmployeeManagement } from '../../../application/hooks/useEmployeeManagement';
import { CreateEmployeeData, Employee } from '../../../domain/entities/Employee';

type EmployeeView = 'list' | 'new-employee' | 'labor-info';

interface SelectedEmployee {
  id: string;
  name: string;
}

export const EmployeeManagementView: React.FC = () => {
  const { employees, loading, deleteEmployee, searchEmployees, refreshEmployees, createEmployee, updateEmployeeLaborInfo } = useEmployeeManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<EmployeeView>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  // Búsqueda dinámica (debounce) mientras se escribe.
  useEffect(() => {
    if (currentView !== 'list') return;
    const handle = window.setTimeout(() => {
      searchEmployees(searchQuery);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchQuery, searchEmployees, currentView]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    await searchEmployees(searchQuery);
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setSelectedEmployee(null); // Limpiar selección al limpiar búsqueda
    await searchEmployees('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddLaborInfo = useCallback(() => {
    if (selectedEmployee) {
      setCurrentView('labor-info');
    }
  }, [selectedEmployee]);

  const handleAddEmployeeClick = useCallback(() => {
    setCurrentView('new-employee');
    setSelectedEmployee(null); // Limpiar selección al agregar nuevo empleado
  }, []);

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedEmployee(null); // Limpiar selección al volver a la lista
    refreshEmployees();
  };

  const handleCreateEmployee = async (data: CreateEmployeeData) => {
    return await createEmployee(data);
  };

  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee({ id: employee.id, name: employee.name });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete);
      if (selectedEmployee && selectedEmployee.id === employeeToDelete)
        setSelectedEmployee(null);
      await refreshEmployees();
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  }, [employeeToDelete, deleteEmployee, selectedEmployee, refreshEmployees]);

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleEmployeeSelect = useCallback((employee: Employee) => {
    setSelectedEmployee({ id: employee.id, name: employee.name });
  }, []);

  const handleSaveLaborInfo = async (laborData: any) => {
    if (!selectedEmployee) throw new Error('No hay empleado seleccionado');
    await updateEmployeeLaborInfo(selectedEmployee.id, laborData);
    await refreshEmployees();
    handleBackToList();
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

      case 'labor-info':
        return (
          <LaborInfoView
            employee={selectedEmployee}
            onCancel={handleBackToList}
            onSave={handleSaveLaborInfo}
          />
        );

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
              {selectedEmployee && (
                <Typography variant="body2" sx={{ color: '#10b981', mt: 1, fontWeight: 'bold' }}>
                  Empleado seleccionado: {selectedEmployee.name}
                </Typography>
              )}
            </Paper>

            {/* Employee Table */}
            <EmployeeTable
              employees={employees}
              selectedEmployeeId={selectedEmployee?.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={handleEmployeeSelect}
            />
          </>
        );
    }
  };

  if (loading && currentView === 'list') {
    return <Typography>Cargando empleados...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header - Sticky (pegado) mientras haces scroll */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#0f172a',
        p: 3,
        borderBottom: '1px solid #334155',
        flexShrink: 0
      }}>
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
              disabled={!selectedEmployee}
              sx={{
                backgroundColor: selectedEmployee ? '#3b82f6' : '#475569',
                '&:hover': selectedEmployee ? { backgroundColor: '#2563eb' } : { backgroundColor: '#475569' },
                '&:disabled': { backgroundColor: '#475569', color: '#94a3b8' }
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

      {/* Contenido principal scrollable */}
      <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
        {/* Contenido dinámico */}
        {renderContent()}
      </Box>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            borderRadius: 2,
            border: '1px solid #334155',
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent sx={{ color: '#e2e8f0' }}>
          <Typography sx={{ mt: 2 }}>
            ¿Está seguro de que desea eliminar este empleado? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: '#94a3b8',
              borderColor: '#475569',
              '&:hover': { backgroundColor: '#334155' }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};