import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  styled,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Grass as GrassIcon,
  Landscape as LandscapeIcon,
} from "@mui/icons-material";

// Stats Card con efecto glass
export const StatsCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.surface.light}60`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  height: "100%",
}));

// Contenido de la stats card
export const StatsCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Contenedor interno de stats
export const StatsContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
}));

// Contenedor de texto de stats
export const StatsTextBox = styled(Box)(({ theme }) => ({
  flex: 1,
}));

// Título de la stats card
export const StatsTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

// Valor de la stats card
export const StatsValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  lineHeight: 1.2,
}));

// Subtítulo de la stats card
export const StatsSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
}));

// Contenedor de icono de stats
export const StatsIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color = theme.palette.primary.main }) => ({
  backgroundColor: `${color}20`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Iconos de stats
export const CheckCircleIconStyled = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: "1.75rem",
  color: theme.palette.success.main,
}));

export const GrassIconStyled = styled(GrassIcon)(({ theme }) => ({
  fontSize: "1.75rem",
  color: theme.palette.warning.main,
}));

export const LandscapeIconStyled = styled(LandscapeIcon)(({ theme }) => ({
  fontSize: "1.75rem",
  color: theme.palette.secondary.main,
}));

// Componente de distribución de terreno
export const TerrainDistributionCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.surface.light}60`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  height: "100%",
}));

// Contenido de distribución de terreno
export const TerrainCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Título de distribución de terreno
export const TerrainTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

// Contenedor de distribución
export const DistributionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

// Item de distribución
export const DistributionItem = styled(Box)(({ theme }) => ({
  // Estilo base para cada item
}));

// Encabezado del item de distribución
export const DistributionItemHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(0.5),
}));

// Contenedor izquierdo del item (color + nombre)
export const DistributionItemLeft = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// Círculo de color del tipo de terreno
export const TerrainColorDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color = theme.palette.primary.main }) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: color,
}));

// Nombre del tipo de terreno
export const TerrainName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
  fontWeight: 500,
}));

// Estadísticas del tipo de terreno
export const TerrainStats = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
}));

// Barra de progreso de distribución
// Barra de progreso de distribución
export const TerrainProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "colorhex",
})<{ colorhex?: string }>(({ theme, colorhex }) => {
  const barColor = colorhex || theme.palette.primary.main;

  return {
    height: 8,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${barColor}20`,

    "& .MuiLinearProgress-bar": {
      backgroundColor: barColor,
      borderRadius: theme.shape.borderRadius,
    },
  };
});
