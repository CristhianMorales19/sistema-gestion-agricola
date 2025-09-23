import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../../application/hooks/useAuth';
import { ApiDashboardRepository } from '../../../../dashboard/infrastructure/ApiDashboardRepository';
import { GetDashboardDataUseCase } from '../../../../dashboard/application/use-cases/DashboardUseCases';
import { StatsCards } from '../../../../dashboard/presentation/components/StatsCards/StatsCards';
import { ActivityFeed } from '../../../../dashboard/presentation/components/ActivityFeed/ActivityFeed';
import { DashboardLayout, PermissionsPanel } from '../AdminDashboard/components';

export const EmpleadoCampoDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getAccessTokenSilently } = useAuth0();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard'); // Estado para la vista actual

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError(null);
        const repository = new ApiDashboardRepository(getAccessTokenSilently);
        const getDashboardDataUseCase = new GetDashboardDataUseCase(repository);
        const data = await getDashboardDataUseCase.execute();
        setDashboardData(data);
      } catch (error) {
        setError('Error cargando datos del dashboard. Verifica la conexión o permisos.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [getAccessTokenSilently, currentView]);

  const handleNavigationChange = (view: string) => {
    setCurrentView(view);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (typeof (user as any).hasPermission === 'function') {
      return (user as any).hasPermission(permission);
    }
    // fallback: check permissions in roles
    return Array.isArray(user.roles)
      ? user.roles.some((role: any) => Array.isArray(role.permissions) && role.permissions.some((p: any) => p.name === permission))
      : false;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
        Cargando datos del dashboard...
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
        {error}
      </Box>
    );
  }

  return (
    <DashboardLayout 
      user={user} 
      onNavigationChange={handleNavigationChange}
      currentView={currentView}
      >
      <Box sx={{ flex: 1, p: 4, backgroundColor: '#0f172a' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PermissionsPanel user={user} />
          </Grid>
          {hasPermission('asistencia:register') && (
            <Grid item xs={12}>
              <StatsCards stats={dashboardData?.stats} />
            </Grid>
          )}
          {hasPermission('productividad:register') && (
            <Grid item xs={12} md={6}>
              <ActivityFeed activities={dashboardData?.activities} />
            </Grid>
          )}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
// Removed duplicate/erroneous code block after main component export
