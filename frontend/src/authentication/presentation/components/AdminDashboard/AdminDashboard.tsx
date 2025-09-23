import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../../application/hooks/useAuth';
import { DashboardData } from '../../../../dashboard/domain/entities/Dashboard';
import { ApiDashboardRepository } from '../../../../dashboard/infrastructure/ApiDashboardRepository';
import { GetDashboardDataUseCase, RefreshDashboardStatsUseCase } from '../../../../dashboard/application/use-cases/DashboardUseCases';
import { DashboardService } from '../../../../dashboard/application/services/DashboardService';
import { StatsCards } from '../../../../dashboard/presentation/components/StatsCards/StatsCards';
import { ActivityFeed } from '../../../../dashboard/presentation/components/ActivityFeed/ActivityFeed';
import { ConditionsPanel } from '../../../../dashboard/presentation/components/ConditionsPanel/ConditionsPanel';
import { DashboardLayout, PermissionsPanel } from './components';
import { EmployeeManagementView } from '../../../../employee-management/presentation/components/EmployeeManagementView';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getAccessTokenSilently } = useAuth0();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard'); // Estado para la vista actual

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError(null);
        // Dependency injection siguiendo Clean Architecture con datos reales
        const repository = new ApiDashboardRepository(getAccessTokenSilently);
        const getDashboardDataUseCase = new GetDashboardDataUseCase(repository);
        const refreshStatsUseCase = new RefreshDashboardStatsUseCase(repository);
        const service = new DashboardService(getDashboardDataUseCase, refreshStatsUseCase);
        
        // Obtener datos reales de la API
        const data = await service.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Error cargando datos del dashboard. Verifica la conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar datos del dashboard si estamos en esa vista
    if (currentView === 'dashboard') {
      loadDashboardData();
    }
  }, [getAccessTokenSilently, currentView]); // Dependencia de currentView

  const handleNavigationChange = (view: string) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
        Cargando datos reales del servidor...
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#ef4444' }}>
        <Box sx={{ mb: 2, fontSize: '1.2rem' }}>⚠️ Error de Conexión</Box>
        <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>{error}</Box>
        <Box sx={{ mt: 2, color: '#64748b', fontSize: '0.9rem' }}>
          Verifica que el servidor backend esté ejecutándose en http://localhost:3000
        </Box>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#94a3b8' }}>
        Sin datos disponibles
      </Box>
    );
  }

  // Renderizar contenido basado en la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          /* Stats Cards */
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StatsCards stats={dashboardData?.stats || []} />
            </Grid>

            /* Permissions Panel */
            <Grid item xs={12}>
              <PermissionsPanel user={user} />
            </Grid>

            /* Activity Feed */
            <Grid container spacing={3} item xs={12}>
              <Grid item xs={12} md={6}>
                <ActivityFeed activities={dashboardData?.activities || []} />
              </Grid>

              /* Conditions Panel */
              <Grid item xs={12} md={6}>
                <ConditionsPanel conditions={dashboardData?.conditions || []} />
              </Grid>
            </Grid>
          </Grid>
        );

      case 'employee-management':
        return (
          <EmployeeManagementView/>
        );

      case 'farms':
        return (
          <Box sx={{ p: 3, color: '#ffffff' }}>
            Vista no implementada
          </Box>
        );

      // Agrega más casos para otras vistas...

      default:
        return (
          <Box sx={{ p: 3, color: '#ffffff' }}>
            Vista no implementada
          </Box>
        );
    }
  };

  if (loading && currentView === 'dashboard') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#fff' }}>
        Cargando datos reales del servidor...
      </Box>
    );
  }

  if (error && currentView === 'dashboard') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#ef4444' }}>
        <Box sx={{ mb: 2, fontSize: '1.2rem' }}>⚠️ Error de Conexión</Box>
        <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>{error}</Box>
        <Box sx={{ mt: 2, color: '#64748b', fontSize: '0.9rem' }}>
          Verifica que el servidor backend esté ejecutándose en http://localhost:3000
        </Box>
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
        {renderContent()}
      </Box>
    </DashboardLayout>
  );
};
