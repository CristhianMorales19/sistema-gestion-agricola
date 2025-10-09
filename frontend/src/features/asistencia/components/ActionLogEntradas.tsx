import React from 'react';
import { Box, Typography, Chip, Divider, Tooltip } from '@mui/material';
import { colors, badgeSx, smallCardItemSx, cardSx } from '../theme/asistenciaStyles';
import { EntradaHoyItem } from '../hooks/useEntradasHoy';

function formatFecha(fecha: string) {
  const [y,m,d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}
function formatHora(hhmmss: string) {
  if (!hhmmss) return '';
  const [h,m] = hhmmss.split(':');
  let hour = parseInt(h,10);
  const ampm = hour >= 12 ? 'p.m.' : 'a.m.';
  hour = hour % 12 || 12;
  return `${hour.toString().padStart(2,'0')}:${m} ${ampm}`;
}

interface Props { items: EntradaHoyItem[]; }

export const ActionLogEntradas: React.FC<Props> = ({ items }) => {
  return (
    <Box mt={4}>
      <Typography variant="subtitle2" gutterBottom sx={{ color: cardSx.color }}>Actividad reciente (entradas de hoy)</Typography>
      <Box display="flex" flexDirection="column" gap={0.75} maxHeight={320} overflow="auto" pr={1}>
        {items.map(i => (
          <Box key={i.id} sx={smallCardItemSx} bgcolor={colors.bgCard}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {i.offline && <Chip size="small" label="OFFLINE" sx={{ backgroundColor: '#92400e', color: '#fde68a', fontWeight:600 }} />}
              <Chip size="small" label={i.documento_identidad} sx={badgeSx.info} />
              <Typography variant="body2" fontWeight={600} sx={{ color: colors.textPrimary }}>{i.nombre_completo}</Typography>
              <Divider orientation="vertical" flexItem sx={{ borderColor: colors.border, opacity: 0.4 }} />
              <Typography variant="caption" style={{ color: colors.textSecondary }}>{formatFecha(i.fecha)} {formatHora(i.horaEntrada)}</Typography>
              {i.horaSalida && (
                <Chip size="small" label={`Salida ${formatHora(i.horaSalida)}`} sx={badgeSx.success} />
              )}
              {i.horasTrabajadas != null && (
                <Chip size="small" variant="outlined" label={`${i.horasTrabajadas} h`} sx={{ borderColor: colors.border, color: colors.textSecondary, fontWeight:600, height:22 }} />
              )}
              {i.ubicacion && (
                <Tooltip title={i.ubicacion}>
                  <Chip size="small" label={i.ubicacion} sx={{ backgroundColor: '#334155', color: '#e2e8f0', maxWidth: 160 }} />
                </Tooltip>
              )}
            </Box>
          </Box>
        ))}
        {!items.length && <Typography variant="caption" color="text.secondary">Sin registros hoy</Typography>}
      </Box>
    </Box>
  );
};

export default ActionLogEntradas;
