import React, { useCallback, useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Alert, CircularProgress, MenuItem, Chip } from '@mui/material';
import { AsistenciaService } from '../services/AsistenciaService';
import { useRegistroSalida } from '../hooks/useRegistroSalida';
import { cardSx, inputSx, primaryButtonSx, badgeSx, smallCardItemSx } from '../theme/asistenciaStyles';

interface RegistrarSalidaFormProps {
  service: AsistenciaService;
  onSalidaRegistrada?: (payload: { trabajadorId: number; horaSalida: string; horasTrabajadas: number | null }) => void;
}

export const RegistrarSalidaForm: React.FC<RegistrarSalidaFormProps> = ({ service, onSalidaRegistrada }) => {
  const { pendientes, registrarSalida, loading, error, mensaje } = useRegistroSalida(service);
  // Se restringe a tipos soportados por badgeSx; 'warning' se normaliza a 'error' o 'info'
  type HistTipo = 'success' | 'error' | 'info';
  const [historial, setHistorial] = useState<Array<{ tipo: HistTipo; msg: string; ts: number }>>([]);
  const [trabajadorId, setTrabajadorId] = useState<number | ''>('');
  const [horaSalida, setHoraSalida] = useState('');
  const [observacion, setObservacion] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trabajadorId) return;
    try {
      const resultado = await registrarSalida({ trabajadorId: Number(trabajadorId), horaSalida: horaSalida || undefined, observacion: observacion || undefined });
  setHistorial(h => [{ tipo:'success' as HistTipo, msg:`Salida registrada (${resultado.horaSalida})`, ts: Date.now() }, ...h].slice(0,30));
    if (resultado && onSalidaRegistrada) {
      onSalidaRegistrada({ trabajadorId: resultado.trabajadorId, horaSalida: resultado.horaSalida, horasTrabajadas: resultado.horasTrabajadas });
    }
    setTrabajadorId('');
    setHoraSalida('');
    setObservacion('');
    } catch (e:any) {
  setHistorial(h => [{ tipo:'error' as HistTipo, msg: e.message || 'Error', ts: Date.now() }, ...h].slice(0,30));
    }
  }, [trabajadorId, horaSalida, observacion, registrarSalida, onSalidaRegistrada]);

  return (
    <>
    <Paper sx={{ p:3, maxWidth: 480, ...cardSx }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'inherit' }}>Registro de Salida</Typography>
      {mensaje && <Alert severity="success" sx={{ mb:2 }}>{mensaje}</Alert>}
      {error && <Alert severity={error.startsWith('⚠️') ? 'warning':'error'} sx={{ mb:2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            label="Trabajador (con entrada)"
            size="small"
            value={trabajadorId}
            onChange={e => setTrabajadorId(e.target.value === '' ? '' : Number(e.target.value))}
            sx={inputSx}
          >
            <MenuItem value=""><em>Seleccione</em></MenuItem>
            {pendientes.map(p => (
              <MenuItem key={p.trabajadorId} value={p.trabajadorId}>{p.documento_identidad} - {p.nombre_completo} (In: {p.horaEntrada})</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Hora Salida (opcional)"
            type="time"
            size="small"
            value={horaSalida}
            onChange={e => setHoraSalida(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />
          <TextField
            label="Observación (opcional)"
            value={observacion}
            onChange={e => setObservacion(e.target.value)}
            size="small"
            multiline
            minRows={2}
            sx={inputSx}
          />
          <Button type="submit" variant="contained" disabled={loading || !trabajadorId} sx={primaryButtonSx}>
            {loading ? <CircularProgress size={20}/> : 'Registrar Salida'}
          </Button>
        </Box>
      </form>
    </Paper>
    <Box mt={2}>
      {historial.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: cardSx.color }}>Actividad Salidas</Typography>
          <Box display="flex" flexDirection="column" gap={0.75} maxHeight={160} overflow="auto" pr={1}>
            {historial.map(item => (
              <Box key={item.ts} sx={smallCardItemSx} display="flex" alignItems="center" gap={1}>
                <Chip size="small" label={item.tipo.toUpperCase()} sx={badgeSx[item.tipo]} />
                <Typography variant="caption" sx={{ color: '#cbd5e1' }}>{item.msg}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
    </>
  );
};

export default RegistrarSalidaForm;
