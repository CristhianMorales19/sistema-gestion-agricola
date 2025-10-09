import React, { useCallback, useState } from 'react';
import { TextField, Button, Box, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { useAsistencia } from '../hooks/useAsistencia';
import { AsistenciaService } from '../services/AsistenciaService';
import { WorkerSelect } from './WorkerSelect';
import { WorkerSelectStatic } from './WorkerSelectStatic';
import GeolocationButton from './GeolocationButton';
import ActionLog from './ActionLog';
import { WorkerSearchService, Trabajador } from '../core/WorkerSearchService';
import { cardSx, inputSx, primaryButtonSx } from '../theme/asistenciaStyles';

interface RegistrarEntradaFormProps {
  service: AsistenciaService; // inyectar para cumplir Demeter
  workerService: WorkerSearchService; // principio de inversión de dependencias (legacy autocomplete)
  useStaticWorkerList?: boolean; // nuevo modo lista estática desde módulo asistencia
  onAddEntradaLocal?: (ctx: { trabajador: Trabajador; dto: any; offline: boolean; resultado?: any }) => void; // para log persistente
}

export const RegistrarEntradaForm: React.FC<RegistrarEntradaFormProps> = ({ service, workerService, useStaticWorkerList = true, onAddEntradaLocal }) => {
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<Trabajador | null>(null);
  const { registrarEntrada, loading, error, mensaje, historial } = useAsistencia({
    service,
    onAfterRegistro: ({ data }) => {
      if (trabajadorSeleccionado) {
        // Integración con log persistente
        if (onAddEntradaLocal) {
          onAddEntradaLocal({ trabajador: trabajadorSeleccionado, dto: data, offline: false });
        }
        const etiqueta = `${trabajadorSeleccionado.documento_identidad || trabajadorSeleccionado.trabajador_id} - ${trabajadorSeleccionado.nombre_completo}`;
        return [
          { tipo: 'info' as const, mensaje: `Trabajador: ${etiqueta}` }
        ];
      }
    }
  });
  const [trabajadorId, setTrabajadorId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [horaEntrada, setHoraEntrada] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [geoPreview, setGeoPreview] = useState<string>('');
  const [geoLoading, setGeoLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trabajadorId) return;
    await registrarEntrada({
      trabajadorId: Number(trabajadorId),
      fecha: fecha || undefined,
      horaEntrada: horaEntrada || undefined,
      ubicacion: ubicacion || undefined,
    });
    // Si se guardó offline no lo sabemos aquí porque hook maneja; idealmente hook pase flag.
    // Como mejora futura: extender callback para incluir offline flag real.
  }, [trabajadorId, fecha, horaEntrada, ubicacion, registrarEntrada]);

  return (
    <Paper sx={{ p: 3, maxWidth: 480, ...cardSx }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'inherit' }}>Registro de Entrada</Typography>
  {mensaje && <Alert severity={mensaje.startsWith('✔️') ? 'success':'info'} sx={{ mb:2 }}>{mensaje}</Alert>}
  {error && <Alert severity={error.startsWith('⚠️') ? 'warning':'error'} sx={{ mb:2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          {useStaticWorkerList ? (
            <WorkerSelectStatic
              service={service}
              value={trabajadorId}
              onChange={(id, meta) => {
                setTrabajadorId(id);
                setTrabajadorSeleccionado(meta ? {
                  trabajador_id: meta.trabajador_id,
                  documento_identidad: meta.documento_identidad,
                  nombre_completo: meta.nombre_completo,
                  // campos dummy para compatibilidad mínima
                  fecha_nacimiento: '', estado: 'activo', created_at: new Date()
                } as any : null);
              }}
            />
          ) : (
            <WorkerSelect
              value={trabajadorId}
              onChange={(id, trabajador) => {
                setTrabajadorId(id);
                setTrabajadorSeleccionado(trabajador || null);
              }}
              label="Trabajador"
              service={workerService}
            />
          )}
          <TextField
            label="Fecha"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />
          <TextField
            label="Hora Entrada (opcional)"
            type="time"
            value={horaEntrada}
            onChange={e => setHoraEntrada(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
          />
          <Box display="flex" gap={1}>
            <TextField
              label="Ubicación / Parcela (opcional)"
              value={ubicacion}
              onChange={e => setUbicacion(e.target.value)}
              size="small"
              fullWidth
              sx={inputSx}
            />
            <GeolocationButton onLocation={(_lat, _lng, formatted) => {
              setGeoPreview(formatted);
              setUbicacion(prev => prev ? `${prev} | ${formatted}` : formatted);
            }} />
          </Box>
          {geoPreview && <Typography variant="caption" color="text.secondary">{geoPreview}</Typography>}
          <Button type="submit" variant="contained" disabled={loading || !trabajadorId} sx={primaryButtonSx}>
            {loading ? <CircularProgress size={20} /> : 'Registrar Entrada'}
          </Button>
        </Box>
      </form>
      <ActionLog items={historial} />
    </Paper>
  );
};
