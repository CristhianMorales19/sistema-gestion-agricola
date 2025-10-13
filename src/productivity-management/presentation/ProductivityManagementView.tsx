import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

import { ProductivityTable } from './ProductivityTable';
import { ProductivityForm } from './NewProductivityForm';
import { UseProductivityManagement } from '../hooks/UseProductivityManagement';
import { ProductivityRecord } from '../domain/entities/Productivity';
import { SelectChangeEvent } from '@mui/material';

type ProductivityView = 'list' | 'new-record' | 'edit-record';

export const ProductivityManagementView: React.FC = () => {
  const { productivityRecords, loading, error, fetchProductivity } = UseProductivityManagement();

  const [currentView, setCurrentView] = useState<ProductivityView>('list');
  const [selectedRecord, setSelectedRecord] = useState<ProductivityRecord | null>(null);
  const [taskFilter, setTaskFilter] = useState<string>('');

  useEffect(() => {
    fetchProductivity();
  }, [fetchProductivity]);

  const handleTaskFilterChange = useCallback((e: SelectChangeEvent<string>) => {
    setTaskFilter(e.target.value);
  }, []);

  const handleAddRecordClick = () => {
    setCurrentView('new-record');
    setSelectedRecord(null);
  };

  const handleEditRecord = (record: ProductivityRecord) => {
    setSelectedRecord(record);
    setCurrentView('edit-record');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedRecord(null);
    fetchProductivity();
  };

  const handleCreateRecord = async (data: any) => {
    await fetchProductivity();
    setCurrentView('list');
  };

  const handleUpdateRecord = async (data: any) => {
    if (!selectedRecord) return;
    await fetchProductivity();
    setCurrentView('list');
    setSelectedRecord(null);
  };

  const filteredRecords = taskFilter
    ? productivityRecords.filter(r => r.task.id === taskFilter)
    : productivityRecords;

  const renderContent = () => {
    switch (currentView) {
      case 'new-record':
        return (
          <ProductivityForm
            records={productivityRecords}
            onSubmit={handleCreateRecord}
            onCancel={handleBackToList}
          />
        );

      case 'edit-record':
        return (
          <ProductivityForm
            records={productivityRecords}
            onSubmit={handleUpdateRecord}
            onCancel={handleBackToList}
            initialData={selectedRecord ? {
              workerId: selectedRecord.worker.id,
              taskId: selectedRecord.task.id,
              producedQuantity: selectedRecord.producedQuantity,
              date: selectedRecord.date,
            } : undefined}
          />
        );

      case 'list':
      default:
        return (
          <>
            {/* Filtros */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94a3b8' }}>Filtrar por tareas</InputLabel>
                <Select
                  value={taskFilter}
                  onChange={handleTaskFilterChange}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '& .MuiSvgIcon-root': { color: '#ffffff' }
                  }}
                >
                  <MenuItem value="">Todas las tareas</MenuItem>
                  {Array.from(new Map(productivityRecords.map(r => [r.task.id, r.task])).values()).map(task => (
                    <MenuItem key={task.id} value={task.id}>{task.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {/* Tabla de Productividad */}
            <ProductivityTable
              records={filteredRecords}
              onEdit={handleEditRecord}
            />
          </>
        );
    }
  };

  if (loading && currentView === 'list') {
    return <Typography sx={{ color: '#ffffff' }}>Cargando registros de productividad...</Typography>;
  }

  if (error && currentView === 'list') {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Gestión de Productividad
        </Typography>

        {currentView === 'list' && (
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={handleAddRecordClick}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' },
            }}
          >
            Nuevo Registro
          </Button>
        )}
      </Box>

      {renderContent()}
    </Box>
  );
};
