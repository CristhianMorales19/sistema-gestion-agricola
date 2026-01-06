import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../../application/hooks/useAuth';
import { DashboardData } from '../../../../../app/layout/domain/entities/Dashboard';
import { ApiDashboardRepository } from '../../../../../app/layout/infrastructure/ApiDashboardRepository';
import { GetDashboardDataUseCase, RefreshDashboardStatsUseCase } from '../../../../../app/layout/application/use-cases/DashboardUseCases';
import { DashboardService } from '../../../../../app/layout/application/services/DashboardService';
import { StatsCards } from '../../../../../app/layout/presentation/components/StatsCards/StatsCards';
import { ActivityFeed } from '../../../../../app/layout/presentation/components/ActivityFeed/ActivityFeed';
import { ConditionsPanel } from '../../../../../app/layout/presentation/components/ConditionsPanel/ConditionsPanel';
import { DashboardLayout, PermissionsPanel } from './components';
import { EmployeeManagementView } from '../../../../personnel-management/presentation/components/EmployeeManagementView';
import { UserManagementView } from '../../../../user-management/presentation/components/UserManagementView';
import { AbsenceManagementView } from '../../../../attendance-tracking';
import { CrewManagementView } from '../../../../crew-managenet/presentation/components/CrewManagementView';
import { ProductivityManagementView } from '../../../../productivity-management';
import { WorkConditionsPage } from '../../../../work-conditions/pages';
import AttendancePage from '../../../../attendance/pages/AttendancePage';
import { ParcelManagementPage } from '../../../../parcel-management';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getAccessTokenSilently } = useAuth0();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('dashboard'); // Estado para la vista actual

  const loadDashboardData = React.useCallback(async () => {
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
  }, [getAccessTokenSilently]);

  useEffect(() => {
    // Solo cargar datos del dashboard si estamos en esa vista
    if (currentView === 'dashboard') {
      loadDashboardData();
    }
  }, [currentView, loadDashboardData]); // Dependencia de currentView

  const handleNavigationChange = React.useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  // Sincroniza SOLO la vista asistencia con la ruta /asistencia
  // useSyncAsistenciaView(currentView, setCurrentView); // Comentado para evitar navegación automática

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
        <Box sx={{ mb: 2, fontSize: '1.2rem' }}>⚠ Error de Conexión</Box>
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
          <>
            {/* Stats Cards */}
            <Grid container spacing={3}>
            <Grid item xs={12}>
              <StatsCards stats={dashboardData?.stats || []} />
            </Grid>

            {/* Permissions Panel */}
            <Grid item xs={12}>
              <PermissionsPanel user={user} />
            </Grid>

            {/* Activity Feed */}
            <Grid container spacing={3} item xs={12}>
              <Grid item xs={12} md={6}>
                <ActivityFeed activities={dashboardData?.activities || []} />
              </Grid>
              {/* Conditions Panel */}
              <Grid item xs={12} md={6}>
                <ConditionsPanel conditions={dashboardData?.conditions || []} />
              </Grid>
            </Grid>
            </Grid>
          </>
        );

      case 'employee-management':
        return (
          <EmployeeManagementView/>
        );

      case 'users':
        return (
          <UserManagementView/>
        );

      case 'absences':
        return (
          <AbsenceManagementView />
        );

      case 'asistencia':
        return (
          <AttendancePage />
        );

      case 'productivity':
        return (
          <ProductivityManagementView />
        );

      case 'farms':
        return (
          <Box sx={{ p: 3, color: '#ffffff' }}>
            Vista no implementada
          </Box>
        );

      case 'crews':
        return (
          <CrewManagementView />
        );

      case 'work-conditions':
        return (
          <WorkConditionsPage />
        );

      case 'parcelas':
        return (
          <ParcelManagementPage />
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
        <Box sx={{ mb: 2, fontSize: '1.2rem' }}>⚠ Error de Conexión</Box>
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
      <Box sx={{ flex: 1, p: 5, backgroundColor: '#0f172a' }}>
        {renderContent()}
      </Box>
    </DashboardLayout>
  );
};