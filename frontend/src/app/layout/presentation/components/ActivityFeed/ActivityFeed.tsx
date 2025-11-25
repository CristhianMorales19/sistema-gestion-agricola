import React from 'react';
import { Card, CardContent, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Assessment } from '@mui/icons-material';
import { DashboardActivity } from '../../../domain/entities/Dashboard';

interface ActivityFeedProps {
  activities: DashboardActivity[];
}

// Mover la función fuera del componente para evitar recrearla en cada render
const getStatusColor = (status: DashboardActivity['status']) => {
  switch (status) {
    case 'success': return '#10b981';
    case 'info': return '#3b82f6';
    case 'warning': return '#f59e0b';
    case 'error': return '#ef4444';
    default: return '#6b7280';
  }
};

// Componente separado para cada actividad para optimizar el render
const ActivityItem = React.memo<{ activity: DashboardActivity }>(({ activity }) => (
  <ListItem
    sx={{
      borderRadius: 2,
      mb: 1.5,
      p: 2,
      backgroundColor: '#334155',
      border: '1px solid #475569'
    }}
  >
    <ListItemIcon sx={{ minWidth: 40 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: getStatusColor(activity.status),
          mr: 1
        }}
      />
    </ListItemIcon>
    <ListItemText
      primary={
        <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
          {activity.text}
        </Typography>
      }
      secondary={
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          {activity.time}
        </Typography>
      }
    />
  </ListItem>
));

ActivityItem.displayName = 'ActivityItem';

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
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
          <Assessment sx={{ color: '#22c55e', fontSize: 20 }} />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Actividad Reciente
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
