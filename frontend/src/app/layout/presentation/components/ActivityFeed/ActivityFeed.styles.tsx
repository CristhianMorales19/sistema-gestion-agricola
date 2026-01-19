import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  styled,
} from "@mui/material";
import { Assessment } from "@mui/icons-material";

// Tarjeta glass
export const GlassCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.surface.light}80`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}20,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  height: "100%",
}));

// Contenido de la tarjeta
export const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Encabezado
export const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

// Icono del título
export const TitleIcon = styled(Assessment)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "1.25rem",
}));

// Título
export const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 600,
}));

// Lista de actividades
export const ActivityList = styled(List)(({ theme }) => ({
  padding: 0,
}));

// Item de actividad
export const ActivityItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ theme, status = "default" }) => {
  return {
    backgroundColor: `${theme.palette.surface.light}20`,
    backdropFilter: "blur(5px)",
    borderRadius: theme.shape.borderRadius * 1.5,
    border: `1px solid ${theme.palette.surface.light}40`,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5),
  };
});

// Icono del item
export const ItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "32px",
}));

// Indicador de estado
export const StatusIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: string }>(({ theme, status = "default" }) => {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return theme.palette.success.main;
      case "info":
        return theme.palette.primary.main;
      case "warning":
        return theme.palette.warning.main;
      case "error":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: getStatusColor(),
    marginRight: theme.spacing(1),
  };
});

// Texto de la actividad
export const ActivityText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: 1.4,
}));

// Tiempo de la actividad
export const ActivityTime = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5),
}));
