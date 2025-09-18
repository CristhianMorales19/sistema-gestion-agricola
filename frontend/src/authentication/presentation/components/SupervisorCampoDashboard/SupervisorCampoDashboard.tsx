import React from 'react';
import { Box, Grid } from '@mui/material';
import { DashboardLayout, PermissionsPanel } from '../AdminDashboard/components';
import { StatsCards } from '../../../../dashboard/presentation/components/StatsCards/StatsCards';
import { ActivityFeed } from '../../../../dashboard/presentation/components/ActivityFeed/ActivityFeed';
import { ConditionsPanel } from '../../../../dashboard/presentation/components/ConditionsPanel/ConditionsPanel';

// Permisos relevantes para Supervisor Campo según la matriz
const PERMISOS_SUPERVISOR_CAMPO = [
  'trabajadores:read:all',
  'trabajadores:update:all',
  'trabajadores:export',
  'asistencia:read:all',
  'asistencia:update',
  'asistencia:approve',
  'asistencia:reports',
  'asistencia:dashboard',
  'permisos:approve',
  'productividad:read:all',
  'productividad:register:others',
  'productividad:reports',
  'tareas:create',
  'tareas:assign',
  'metas:set',
  'metas:track',
  'parcelas:read',
  'parcelas:update',
  'cultivos:read',
  'cultivos:update',
  'cultivos:track',
  'cosechas:register',
  'cosechas:read',
  'reportes:read:advanced',
  'reportes:export',
  'dashboard:view:advanced',
  'kpis:view'
];


interface SupervisorCampoDashboardProps {
  user: {
    permisos?: string[];
    [key: string]: any;
  };
  dashboardData: {
    stats?: any;
    activities?: any;
    conditions?: any;
    [key: string]: any;
  };
}

export const SupervisorCampoDashboard: React.FC<SupervisorCampoDashboardProps> = ({ user, dashboardData }) => {
  const hasPermission = (permission: string) => {
    return user?.permisos?.includes(permission);
  };
  return (
    <DashboardLayout user={user}>
      <Box sx={{ flex: 1, p: 4, backgroundColor: '#0f172a' }}>
        <Grid container spacing={3}>
          {/* Stats Cards solo si tiene permiso de ver KPIs */}
          {hasPermission('kpis:view') && (
            <Grid item xs={12}>
              <StatsCards stats={dashboardData.stats} />
            </Grid>
          )}
          {/* Panel de permisos siempre visible */}
          <Grid item xs={12}>
            <PermissionsPanel user={user} />
          </Grid>
          <Grid container spacing={3} item xs={12}>
            {/* Activity Feed solo si tiene permiso de ver reportes avanzados */}
            {hasPermission('reportes:read:advanced') && (
              <Grid item xs={12} md={6}>
                <ActivityFeed activities={dashboardData.activities} />
              </Grid>
            )}
            {/* Panel de condiciones solo si tiene permiso de ver dashboard avanzado */}
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
};
