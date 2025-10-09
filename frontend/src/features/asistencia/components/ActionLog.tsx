import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { badgeSx, smallCardItemSx, cardSx } from '../theme/asistenciaStyles';

interface ActionLogItem { tipo: 'success'|'error'|'info'; mensaje: string; ts: number }
interface ActionLogProps { items: ActionLogItem[] }

const colorMap: Record<ActionLogItem['tipo'], 'success'|'default'|'error'| 'info'| 'warning'> = {
  success: 'success',
  error: 'error',
  info: 'info'
};

export const ActionLog: React.FC<ActionLogProps> = ({ items }) => {
  if (!items.length) return null;
  return (
    <Box mt={3}>
      <Typography variant="subtitle2" gutterBottom sx={{ color: cardSx.color }}>Actividad reciente</Typography>
      <Box display="flex" flexDirection="column" gap={0.75} maxHeight={160} overflow="auto" pr={1}>
        {items.map(item => (
          <Box key={item.ts} sx={smallCardItemSx} display="flex" alignItems="center" gap={1}>
            <Chip size="small" label={item.tipo.toUpperCase()} sx={badgeSx[item.tipo]} />
            <Typography variant="body2" sx={{ fontSize: 12, color: '#cbd5e1' }}>{item.mensaje}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ActionLog;