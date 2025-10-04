import React, {useState, useCallback} from 'react';
import { Box, Grid } from '@mui/material';
import { DashboardLayout, PermissionsPanel } from '../AdminDashboard/components';
import { StatsCards } from '../../../../dashboard/presentation/components/StatsCards/StatsCards';
import { ActivityFeed } from '../../../../dashboard/presentation/components/ActivityFeed/ActivityFeed';
import { ConditionsPanel } from '../../../../dashboard/presentation/components/ConditionsPanel/ConditionsPanel';

interface SoloLecturaDashboardProps {
  user: {
    permisos?: string[];
    [key: string]: unknown;
  };
  dashboardData: {
    stats?: unknown;
    activities?: unknown;
    conditions?: unknown;
    [key: string]: unknown;
  };
}



export const SoloLecturaDashboard: React.FC<SoloLecturaDashboardProps> = ({ user, dashboardData }) => {
  const [currentView, setCurrentView] = useState('dashboard'); // Estado para la vista actual

  const handleNavigationChange = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  const hasPermission = (permission: string) => {
    return user?.permisos?.includes(permission);
  };
  return (
      <DashboardLayout 
        user={user}
        onNavigationChange={handleNavigationChange}
        currentView={currentView}
      >
      <Box sx={{ flex: 1, p: 4, backgroundColor: '#0f172a' }}>
        <Grid container spacing={3}>
          {hasPermission('dashboard:view:advanced') && (
            <Grid item xs={12}>
              <StatsCards stats={dashboardData.stats} />
            </Grid>
          )}
          <Grid item xs={12}>
            <PermissionsPanel user={user} />
          </Grid>
          <Grid container spacing={3} item xs={12}>
            {hasPermission('reportes:read:advanced') && (
              <Grid item xs={12} md={6}>
                <ActivityFeed activities={dashboardData.activities} />
              </Grid>
            )}
            {hasPermission('dashboard:view:advanced') && (
              <Grid item xs={12} md={6}>
                <ConditionsPanel conditions={dashboardData.conditions} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
// Removed duplicate/erroneous code block after main component export
