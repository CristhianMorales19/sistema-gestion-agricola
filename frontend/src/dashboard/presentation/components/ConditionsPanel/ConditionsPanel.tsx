import React from 'react';
import { Card, CardContent, Box, Typography, Grid } from '@mui/material';
import { Cloud, Thermostat, WaterDrop, Air } from '@mui/icons-material';
import { DashboardCondition } from '../../../domain/entities/Dashboard';

interface ConditionsPanelProps {
  conditions: DashboardCondition[];
}

const getConditionIcon = (type: DashboardCondition['type']) => {
  switch (type) {
    case 'temperature': return <Thermostat sx={{ fontSize: 20, color: '#f59e0b' }} />;
    case 'humidity': return <WaterDrop sx={{ fontSize: 20, color: '#06b6d4' }} />;
    case 'rain': return <Cloud sx={{ fontSize: 20, color: '#6b7280' }} />;
    case 'wind': return <Air sx={{ fontSize: 20, color: '#8b5cf6' }} />;
    default: return <Cloud sx={{ fontSize: 20 }} />;
  }
};

export const ConditionsPanel: React.FC<ConditionsPanelProps> = ({ conditions }) => {
  return (
    <Card 
      sx={{ 
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 2,
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Cloud sx={{ color: '#fb923c', fontSize: 20 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Condiciones Actuales
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {conditions.map((condition) => (
            <Grid item xs={6} key={condition.id}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 1 }}>
                  {getConditionIcon(condition.type)}
                </Box>
                <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                  {condition.value}{condition.unit}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {condition.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
