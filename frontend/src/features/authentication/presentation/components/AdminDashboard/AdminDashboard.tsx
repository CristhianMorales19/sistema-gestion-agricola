import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../../../application/hooks/useAuth";
import { DashboardData } from "../../../../../app/layout/domain/entities/Dashboard";
import { ApiDashboardRepository } from "../../../../../app/layout/infrastructure/ApiDashboardRepository";
import {
  GetDashboardDataUseCase,
  RefreshDashboardStatsUseCase,
} from "../../../../../app/layout/application/use-cases/DashboardUseCases";
import { DashboardService } from "../../../../../app/layout/application/services/DashboardService";
import { StatsCards } from "../../../../../app/layout/presentation/components/StatsCards/StatsCards";
import { ActivityFeed } from "../../../../../app/layout/presentation/components/ActivityFeed/ActivityFeed";
import { ConditionsPanel } from "../../../../../app/layout/presentation/components/ConditionsPanel/ConditionsPanel";
import { PermissionsPanel } from "./components/PermissionsPanel/PermissionsPanel";
import { DashboardLayout } from "./components/SideBar/DashboardLayout";
import { EmployeeManagementView } from "../../../../personnel-management/presentation/components/EmployeeManagementView";

import { UserManagementView } from "../../../../user-management/presentation/components/UserManagementView";
import { AbsenceManagementView } from "../../../../attendance-tracking";
import { CrewManagementView } from "../../../../crew-managenet/presentation/components/CrewManagementView";
import { ProductivityManagementView } from "../../../../productivity-management";
import AsistenciaPage from "../../../../asistencia/AsistenciaPage";
import AttendancePage from "../../../../attendance/pages/AttendancePage";
import {
  StyledContainer,
  ContentContainer,
  ErrorContainer,
  ErrorDetails,
  NoDataContainer,
  DashboardGrid,
  NoDataMessage,
  DashboardGridItem,
} from "./AdminDashboard.styles";
import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../../shared/presentation/styles/LoadingSpinner.styles";
import { WorkConditionsPage } from "../../../../work-conditions";
import { ParcelManagementPage } from "../../../../parcel-management";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { getAccessTokenSilently } = useAuth0();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");

  const loadDashboardData = React.useCallback(async () => {
    try {
      setError(null);
      const repository = new ApiDashboardRepository(getAccessTokenSilently);
      const getDashboardDataUseCase = new GetDashboardDataUseCase(repository);
      const refreshStatsUseCase = new RefreshDashboardStatsUseCase(repository);
      const service = new DashboardService(
        getDashboardDataUseCase,
        refreshStatsUseCase,
      );

      const data = await service.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(
        "Error cargando datos del dashboard. Verifica la conexión con el servidor.",
      );
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (currentView === "dashboard") {
      loadDashboardData();
    } else {
      // Si no estamos en dashboard, no mostrar loading
      setLoading(false);
    }
  }, [currentView, loadDashboardData]);

  const handleNavigationChange = React.useCallback((view: string) => {
    setCurrentView(view);
    // Reiniciar estados cuando cambiamos de vista
    if (view !== "dashboard") {
      setLoading(false);
      setError(null);
      setDashboardData(null);
    } else {
      setLoading(true);
    }
  }, []);

  if (error && currentView === "dashboard") {
    return (
      <ErrorContainer>
        <ErrorDetails>
          Verifica que el servidor backend esté ejecutándose en
          http://localhost:3000
        </ErrorDetails>
      </ErrorContainer>
    );
  }

  if (!loading && !error && !dashboardData && currentView === "dashboard") {
    return (
      <NoDataContainer>
        <NoDataMessage>
          Sin datos disponibles para el dashboard
          <br />
          <small style={{ opacity: 0.7 }}>
            Esto puede ser temporal o indicar un problema con el servicio
          </small>
        </NoDataMessage>
      </NoDataContainer>
    );
  }

  // Renderizar contenido basado en la vista actual
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <ContentContainer>
            {/* Stats Cards */}
            <DashboardGrid container spacing={3}>
              <DashboardGridItem item xs={12}>
                <StatsCards stats={dashboardData?.stats || []} />
              </DashboardGridItem>

              {/* Permissions Panel */}
              <DashboardGridItem item xs={12}>
                <PermissionsPanel user={user} />
              </DashboardGridItem>

              {/* Activity Feed */}
              <DashboardGrid container spacing={3} item xs={12}>
                <DashboardGridItem item xs={12} md={6}>
                  <ActivityFeed activities={dashboardData?.activities || []} />
                </DashboardGridItem>
                {/* Conditions Panel */}
                <DashboardGridItem item xs={12} md={6}>
                  <ConditionsPanel
                    conditions={dashboardData?.conditions || []}
                  />
                </DashboardGridItem>
              </DashboardGrid>
            </DashboardGrid>
          </ContentContainer>
        );

      case "employee-management":
        return (
          <ContentContainer>
            <EmployeeManagementView />
          </ContentContainer>
        );

      case "users":
        return (
          <ContentContainer>
            <UserManagementView />
          </ContentContainer>
        );

      case "absences":
        return (
          <ContentContainer>
            <AbsenceManagementView />
          </ContentContainer>
        );

      case "asistencia":
        return (
          <ContentContainer>
            <AttendancePage />
          </ContentContainer>
        );

      case "productivity":
        return (
          <ContentContainer>
            <ProductivityManagementView />
          </ContentContainer>
        );

      case "crews":
        return (
          <ContentContainer>
            <CrewManagementView />
          </ContentContainer>
        );

      case "work-conditions":
        return (
          <ContentContainer>
            <WorkConditionsPage />
          </ContentContainer>
        );

      case "parcelas":
        return (
          <ContentContainer>
            <ParcelManagementPage />
          </ContentContainer>
        );

      default:
        return (
          <ContentContainer>
            La vista "{currentView}" aún no está disponible en esta versión
          </ContentContainer>
        );
    }
  };

  return (
    <DashboardLayout
      user={user}
      onNavigationChange={handleNavigationChange}
      currentView={currentView}
    >
      <StyledContainer>
        {loading && currentView === "dashboard" ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          renderContent()
        )}
      </StyledContainer>
    </DashboardLayout>
  );
};
