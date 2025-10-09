import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { ProductivityRecord } from '../../../domain/entities/Productivity';

export interface NewProductivityFormData {
  workerId: string;
  taskId: string;
  producedQuantity: number;
  date: string;
}

interface ProductivityFormProps {
  records: ProductivityRecord[];
  onSubmit: (data: NewProductivityFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: NewProductivityFormData;
}

interface TaskOption {
  id: string;
  name: string;
  unit: string;
  standardPerformance: number;
}

export const ProductivityForm: React.FC<ProductivityFormProps> = ({
  records,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<NewProductivityFormData>(
    initialData || { workerId: '', taskId: '', producedQuantity: 0, date: '' }
  );
  const [tasks, setTasks] = useState<TaskOption[]>([]);
  const [loading, setLoading] = useState(false);

  const workers = Array.from(new Map(records.map(r => [r.worker.id, r.worker])).values());
  useEffect(() => {
    const uniqueTasks: TaskOption[] = Array.from(
      new Map(records.map(r => [r.task.id, r.task])).values()
    ).map(t => ({
      id: t.id,
      name: t.name,
      unit: t.unit,
      standardPerformance: t.standardPerformance,
    }));
    setTasks(uniqueTasks);
  }, [records]);

  const handleChange = (field: keyof NewProductivityFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'producedQuantity' ? Number(e.target.value) : e.target.value,
    }));
  };

  const getTaskUnit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.unit || '';
  };

  const getTaskLimit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.standardPerformance === undefined) return Infinity;
    return task.standardPerformance * 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = getTaskLimit(formData.taskId);
    if (formData.producedQuantity < 0 || formData.producedQuantity > limit) {
      alert(`Cantidad inválida. Debe ser entre 0 y ${limit}`);
      return;
    }
    if (new Date(formData.date) > new Date()) {
      alert('La fecha no puede ser futura');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <Typography variant="h5" sx={{ color: '#ffffff', mb: 3 }}>
        {initialData ? 'Editar Registro de Productividad' : 'Nuevo Registro de Productividad'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Worker */}
          <TextField
            select
            label="Trabajador"
            value={formData.workerId}
            onChange={handleChange('workerId')}
            fullWidth
            required
            InputLabelProps={{ sx: { color: '#94a3b8' } }}
            InputProps={{ sx: { color: '#ffffff' } }}
          >
            {workers.map(worker => (
              <MenuItem key={worker.id} value={worker.id}>
                {worker.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Task */}
          <TextField
            select
            label="Tarea / Producto"
            value={formData.taskId}
            onChange={handleChange('taskId')}
            fullWidth
            required
            InputLabelProps={{ sx: { color: '#94a3b8' } }}
            InputProps={{ sx: { color: '#ffffff' } }}
          >
            {tasks.map(task => (
              <MenuItem key={task.id} value={task.id}>
                {task.name} ({task.unit})
              </MenuItem>
            ))}
          </TextField>

          {/* Produced Quantity */}
          <TextField
            type="number"
            label={`Cantidad Producida (${getTaskUnit(formData.taskId)})`}
            value={formData.producedQuantity}
            onChange={handleChange('producedQuantity')}
            fullWidth
            required
            InputLabelProps={{ sx: { color: '#94a3b8' } }}
            InputProps={{ sx: { color: '#ffffff' } }}
          />

          {/* Date */}
          <TextField
            type="date"
            label="Fecha"
            value={formData.date}
            onChange={handleChange('date')}
            fullWidth
            required
            InputLabelProps={{ shrink: true, sx: { color: '#94a3b8' } }}
            InputProps={{ sx: { color: '#ffffff' } }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              type="button"
              onClick={onCancel}
              variant="outlined"
              sx={{
                color: '#94a3b8',
                borderColor: '#475569',
                '&:hover': { borderColor: '#64748b', backgroundColor: '#334155' },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' },
                '&:disabled': { backgroundColor: '#475569' },
              }}
            >
              {loading ? 'Guardando...' : initialData ? 'Guardar' : 'Registrar'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};
