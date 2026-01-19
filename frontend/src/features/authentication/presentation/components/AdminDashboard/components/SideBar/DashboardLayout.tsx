import React, { useState } from "react";
import { List, ListItem } from "@mui/material";
import {
  Dashboard,
  People,
  Assessment,
  Settings,
  Logout,
  EventBusy,
  Grass,
  Groups,
  Person,
} from "@mui/icons-material";

import { useAuth } from "../../../../../application/hooks/useAuth";
import { TopBar } from "../../../../../../../shared/presentation/components/ui/topBar/TopBar";

import {
  SidebarContainer,
  NavigationButton,
  StyledListItemIcon,
  UserProfileContainer,
  StyledAvatar,
  RoleButton,
  ActionButton,
  LogoutButton,
  BackgroundContainer,
  MainContent,
  ActiveIndicator,
  StyledListItemText,
  UserProfileSection,
  UserInfoContainer,
  UserName,
  UserRole,
  RoleButtonsContainer,
  StyledDivider,
  ActionButtonsContainer,
  NavigationListContainer,
} from "./DashboardLayout.styles";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: any;
  onNavigationChange: (view: string) => void;
  currentView: string;
}

export const DashboardLayout = ({
  children,
  user,
  onNavigationChange,
  currentView,
}: DashboardLayoutProps) => {
  const { logout, loginWithDemoRole } = useAuth();
  const [sideBarOpen, setOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setOpenSideBar((prev) => !prev);
  };

  const sidebarItems = React.useMemo(
    () => [
      {
        id: "dashboard",
        icon: <Dashboard />,
        text: "Dashboard",
        active: currentView === "dashboard",
      },
      {
        id: "employee-management",
        icon: <Person />,
        text: "Gestión de Personal",
        active: currentView === "employee-management",
      },
      {
        id: "absences",
        icon: <EventBusy />,
        text: "Ausencias",
        active: currentView === "absences",
      },
      {
        id: "asistencia",
        icon: <EventBusy />,
        text: "Asistencia",
        active: currentView === "asistencia",
      },
      {
        id: "productivity",
        icon: <Assessment />,
        text: "Productividad",
        active: currentView === "productivity",
      },
      {
        id: "farms",
        icon: <Grass />,
        text: "Granjas",
        active: currentView === "farms",
      },
      {
        id: "crews",
        icon: <Groups />,
        text: "Cuadrillas",
        active: currentView === "crews",
      },
      {
        id: "users",
        icon: <People />,
        text: "Usuarios",
        active: currentView === "users",
      },
      {
        id: "reports",
        icon: <Assessment />,
        text: "Reportes",
        active: currentView === "reports",
      },
    ],
    [currentView],
  );

  const handleViewAsRole = React.useCallback(
    async (roleName: string) => {
      try {
        await loginWithDemoRole(roleName);
      } catch (error) {
        console.error("Error changing view:", error);
      }
    },
    [loginWithDemoRole],
  );

  const NavigationItem = React.memo<{ item: (typeof sidebarItems)[0] }>(
    ({ item }) => {
      const handleClick = React.useCallback(() => {
        onNavigationChange(item.id);
      }, [item.id]);

      return (
        <ListItem sx={{ p: 0, mb: 1 }}>
          <NavigationButton onClick={handleClick} active={item.active}>
            <StyledListItemIcon active={item.active}>
              {item.icon}
            </StyledListItemIcon>
            <StyledListItemText primary={item.text} active={item.active} />
            {item.active && <ActiveIndicator />}
          </NavigationButton>
        </ListItem>
      );
    },
  );

  return (
    <BackgroundContainer>
      <TopBar onToggleSidebar={toggleSideBar} />
      {/* Sidebar */}
      <SidebarContainer open={sideBarOpen}>
        {/* Navigation Items */}
        <NavigationListContainer>
          <List sx={{ p: 0 }}>
            {sidebarItems.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </List>
        </NavigationListContainer>

        {/* User Profile Section */}
        <UserProfileSection>
          <UserProfileContainer>
            <StyledAvatar src={user?.picture} alt={user?.name} />
            <UserInfoContainer>
              <UserName variant="body1">
                {user?.name || "Alexander Vega"}
              </UserName>
              <UserRole variant="caption">
                Administrador de base de datos
              </UserRole>
            </UserInfoContainer>
          </UserProfileContainer>

          <RoleButtonsContainer>
            <RoleButton
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => handleViewAsRole("Gerente de Granja")}
            >
              Ver como Manager
            </RoleButton>
            <RoleButton
              variant="outlined"
              size="small"
              fullWidth
              isAccent
              onClick={() => handleViewAsRole("Trabajador de Campo")}
            >
              Ver como Worker
            </RoleButton>
          </RoleButtonsContainer>

          <StyledDivider />

          <ActionButtonsContainer>
            <ActionButton
              startIcon={<Settings />}
              variant="text"
              size="small"
              fullWidth
            >
              Configuración
            </ActionButton>
            <LogoutButton
              startIcon={<Logout />}
              variant="text"
              size="small"
              fullWidth
              onClick={logout}
            >
              Cerrar Sesión
            </LogoutButton>
          </ActionButtonsContainer>
        </UserProfileSection>
      </SidebarContainer>

      <MainContent open={sideBarOpen}>{children}</MainContent>
    </BackgroundContainer>
  );
};
