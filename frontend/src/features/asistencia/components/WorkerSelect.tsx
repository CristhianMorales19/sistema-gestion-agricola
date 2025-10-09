import React, { useEffect, useState, useMemo } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { inputSx } from '../theme/asistenciaStyles';
import { WorkerSearchService, Trabajador } from '../core/WorkerSearchService';

interface WorkerSelectProps {
  value: number | null;
  onChange: (id: number | null, trabajador?: Trabajador | null) => void;
  label?: string;
  service: WorkerSearchService;
}

// Autocomplete de trabajadores activos delegando búsqueda en un servicio abstracto.
export const WorkerSelect: React.FC<WorkerSelectProps> = ({ value, onChange, label = 'Trabajador', service }) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Trabajador[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let activo = true;
    setLoading(true);
    service.search(inputValue)
      .then(result => {
        if (!Array.isArray(result)) {
          console.warn('[WorkerSelect] Resultado inesperado, se esperaba array', result);
          result = [] as Trabajador[];
        }
        if (activo) setOptions(result);
      })
      .catch(err => console.warn('[WorkerSelect] Error cargando trabajadores', err))
      .finally(() => { if (activo) setLoading(false); });
    return () => { activo = false; };
  }, [service, inputValue]);

  const current = useMemo(() => {
    if (!Array.isArray(options)) return null;
    return options.find(t => t.trabajador_id === value) || null;
  }, [options, value]);

  return (
    <Autocomplete
      value={current}
      onChange={(_e, nuevo) => onChange(nuevo ? nuevo.trabajador_id : null, nuevo || null)}
      inputValue={inputValue}
      onInputChange={(_e, nuevo) => setInputValue(nuevo)}
      options={options}
  getOptionLabel={o => `${o.documento_identidad || o.trabajador_id} - ${o.nombre_completo}`}
      loading={loading}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          const exact = options.find(o => o.documento_identidad === inputValue || String(o.trabajador_id) === inputValue);
          if (exact) {
            e.preventDefault();
            onChange(exact.trabajador_id, exact);
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          sx={inputSx}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      noOptionsText={loading ? 'Cargando...' : 'Sin resultados'}
    />
  );
};

export default WorkerSelect;