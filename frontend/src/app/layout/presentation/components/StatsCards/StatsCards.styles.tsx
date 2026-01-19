import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  styled,
} from "@mui/material";
import {
  Agriculture,
  People,
  Assessment,
  NotificationsNone,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

// Grid principal
export const StatsGrid = styled(Grid)(() => ({
  // gap: theme.spacing(1),
}));

// Grid item para cada tarjeta
export const StatItem = styled(Grid)(() => ({
  // Sin transiciones para mejor rendimiento
}));

// Tarjeta glass
export const GlassCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.surface.light}80`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  overflow: "hidden",
  position: "relative",
  width: "100%",
}));

// Contenido de la tarjeta
export const CardContentStyled = styled(CardContent)(({ theme }) => ({
  // padding: theme.spacing(2),
}));

// Contenedor principal
export const ContentBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
}));

// Contenedor de texto
export const TextBox = styled(Box)(({ theme }) => ({
  flex: 1,
}));

// Título de la estadística
export const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: theme.spacing(0.5),
  opacity: 0.8,
}));

// Valor de la estadística
export const ValueText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  lineHeight: 1.2,
}));

// Contenedor de cambio
export const ChangeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isPositive",
})<{ isPositive?: boolean }>(({ theme, isPositive }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
  fontSize: "0.75rem",
  fontWeight: 500,
}));

// Icono de tendencia
export const TrendIcon = styled(Box)({
  display: "flex",
  alignItems: "center",
});

// Contenedor de icono
export const IconBox = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `${theme.palette.surface.light}30`,
  border: `1px solid ${theme.palette.surface.light}40`,
}));

// Iconos estilizados
export const IconStyled = styled(Box)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.text.secondary,
}));

// Iconos específicos
export const FarmIcon = styled(Agriculture)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.primary.light,
}));

export const UserIcon = styled(People)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.secondary.light,
}));

export const CropIcon = styled(Assessment)(({ theme }) => ({
  fontSize: "1.25rem",
  color: "#06b6d4",
}));

export const AlertIcon = styled(NotificationsNone)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.error.light,
}));

// Iconos de tendencia simples
export const UpIcon = styled(TrendingUp)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.success.main,
}));

export const DownIcon = styled(TrendingDown)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.error.main,
}));
