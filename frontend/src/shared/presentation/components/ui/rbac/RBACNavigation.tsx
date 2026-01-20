import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  People,
  PersonAdd,
  AccessTime,
  Payment,
  TrendingUp,
  Assessment,
  Settings,
  Cloud,
  Terrain,
} from "@mui/icons-material";
import { usePermissions } from "./ProtectedComponent";
import { ProtectedComponent } from "./ProtectedComponent";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  permission?: keyof import("../../../../../auth/types").UserPermissions;
  role?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    label: "Gestión de Usuarios",
    icon: <People />,
    path: "/usuarios",
    permission: "gestionar_usuarios",
  },
  {
    label: "Consultar Usuarios",
    icon: <People />,
    path: "/usuarios/consultar",
    permission: "consultar_usuarios",
  },
  {
    label: "Gestión de Personal",
    icon: <PersonAdd />,
    path: "/personal",
    permission: "gestionar_personal",
  },
  {
    label: "Consultar Personal",
    icon: <PersonAdd />,
    path: "/personal/consultar",
    permission: "consultar_personal",
  },
  {
    label: "Gestión de Asistencia",
    icon: <AccessTime />,
    path: "/asistencia",
    permission: "gestionar_asistencia",
  },
  {
    label: "Consultar Asistencia",
    icon: <AccessTime />,
    path: "/asistencia/consultar",
    permission: "consultar_asistencia",
  },
  {
    label: "Condiciones de Trabajo",
    icon: <Cloud />,
    path: "/condiciones-trabajo",
    permission: "gestionar_condiciones_trabajo",
  },
  {
    label: "Gestión de Parcelas",
    icon: <Terrain />,
    path: "/parcelas",
    permission: "parcelas:read",
  },
  {
    label: "Gestión de Nómina",
    icon: <Payment />,
    path: "/nomina",
    permission: "gestionar_nomina",
  },
  {
    label: "Consultar Nómina",
    icon: <Payment />,
    path: "/nomina/consultar",
    permission: "consultar_nomina",
  },
  {
    label: "Gestión de Productividad",
    icon: <TrendingUp />,
    path: "/productividad",
    permission: "gestionar_productividad",
  },
  {
    label: "Consultar Productividad",
    icon: <TrendingUp />,
    path: "/productividad/consultar",
    permission: "consultar_productividad",
  },
  {
    label: "Gestión de Reportes",
    icon: <Assessment />,
    path: "/reportes",
    permission: "gestionar_reportes",
  },
  {
    label: "Consultar Reportes",
    icon: <Assessment />,
    path: "/reportes/consultar",
    permission: "consultar_reportes",
  },
  {
    label: "Configuración",
    icon: <Settings />,
    path: "/configuracion",
    permission: "gestionar_configuracion",
  },
];

// Componente memoizado para items de navegación
const NavigationMenuItem = React.memo<{
  item: MenuItem;
  onItemClick: (path: string) => void;
}>(({ item, onItemClick }) => {
  const handleClick = React.useCallback(() => {
    onItemClick(item.path);
  }, [item.path, onItemClick]);

  return (
    <ProtectedComponent
      requiredPermission={item.permission}
      requiredRole={item.role}
    >
      <ListItem
        button
        onClick={handleClick}
        sx={{
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItem>
    </ProtectedComponent>
  );
});

NavigationMenuItem.displayName = "NavigationMenuItem";

interface RBACNavigationProps {
  open: boolean;
  onItemClick: (path: string) => void;
}

export const RBACNavigation: React.FC<RBACNavigationProps> = ({
  open,
  onItemClick,
}) => {
  const { user } = usePermissions();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      {/* Header con información del usuario */}
      <Box sx={{ p: 2, backgroundColor: "primary.main", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            src={user?.picture}
            alt={user?.name}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1" noWrap>
              {user?.name}
            </Typography>
            <Typography variant="caption" noWrap>
              {user?.roles?.[0]?.nombre || "Sin rol"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Lista de navegación */}
      <List>
        {menuItems.map((item) => (
          <NavigationMenuItem
            key={item.path}
            item={item}
            onItemClick={onItemClick}
          />
        ))}
      </List>
    </Drawer>
  );
};
