import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress, Box } from '@mui/material';
import { inputSx } from '../theme/asistenciaStyles';
import { AsistenciaService } from '../services/AsistenciaService';

interface WorkerStaticOption { value: number; label: string; trabajador_id: number; documento_identidad: string; nombre_completo: string }

interface WorkerSelectStaticProps {
  service: AsistenciaService;
  value: number | null;
  onChange: (id: number | null, meta?: WorkerStaticOption | null) => void;
  label?: string;
  helperText?: string;
}

export const WorkerSelectStatic: React.FC<WorkerSelectStaticProps> = ({ service, value, onChange, label='Trabajador', helperText }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<WorkerStaticOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    console.log('🔄 WorkerSelectStatic: Iniciando carga de trabajadores...');
    setLoading(true);
    service.listarTrabajadoresActivos()
      .then(data => { 
        console.log('✅ WorkerSelectStatic: Datos recibidos:', data);
        console.log('📊 WorkerSelectStatic: Total trabajadores:', data.length);
        if (active) setOptions(data); 
      })
      .catch(e => { 
        console.error('❌ WorkerSelectStatic: Error:', e);
        if (active) setError(e.message || 'Error cargando trabajadores'); 
      })
      .finally(() => { 
        console.log('🏁 WorkerSelectStatic: Carga finalizada');
        if (active) setLoading(false); 
      });
    return () => { active = false; };
  }, [service]);

  return (
    <FormControl size="small" fullWidth disabled={loading} error={!!error} sx={inputSx}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value === null ? '' : value}
        label={label}
        onChange={(e) => {
          const val = e.target.value === '' ? null : Number(e.target.value);
          const meta = options.find(o => o.value === val) || null;
          onChange(val, meta);
        }}
        renderValue={(val: any) => {
          if (val === '' || val === null || typeof val === 'undefined') return 'Seleccione';
          const numericVal = Number(val);
          const meta = options.find(o => o.value === numericVal);
          return meta ? meta.label : String(val);
        }}
      >
        <MenuItem value=""><em>Seleccione un trabajador</em></MenuItem>
        {loading && (
          <MenuItem disabled value="loading">
            <Box display="flex" alignItems="center" gap={1}><CircularProgress size={16}/> Cargando...</Box>
          </MenuItem>
        )}
        {!loading && !error && options.length === 0 && (
          <MenuItem disabled value="no-data">No hay trabajadores activos</MenuItem>
        )}
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {error ? 'No se pudieron cargar los trabajadores' : helperText || 'Lista de trabajadores activos'}
      </FormHelperText>
    </FormControl>
  );
};

export default WorkerSelectStatic;
