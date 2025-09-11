import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { Security, FiberManualRecord } from '@mui/icons-material';

interface PermissionsPanelProps {
  user: any;
}

export const PermissionsPanel: React.FC<PermissionsPanelProps> = ({ user }) => {
  return (
    <Card 
      sx={{ 
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Security sx={{ color: '#22c55e', fontSize: 20 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Permisos Actuales ({user?.roles?.[0]?.permissions?.length || 11})
          </Typography>
        </Box>
        <Chip
          icon={<FiberManualRecord sx={{ fontSize: 12, color: '#fb923c !important' }} />}
          label="ACCESO TOTAL - Administrador"
          sx={{
            backgroundColor: 'rgba(153, 27, 27, 0.5)',
            color: '#fca5a5',
            border: '1px solid rgba(251, 146, 60, 0.3)'
          }}
        />
      </CardContent>
    </Card>
  );
};
