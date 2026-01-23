import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  IconButton,
  styled,
} from "@mui/material";

// Card con efecto glass
export const GlassCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.surface.light}60`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  height: "100%",
}));

// Contenido de la card
export const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Header del calendario
export const CalendarHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

// Título del calendario
export const CalendarTitle = styled(Typography)(() => ({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
}));

// Contenedor de botones de navegación
export const NavigationButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

// Botón de navegación
export const NavButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.surface.light}`,
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: `${theme.palette.surface.light}20`,
  },
}));

// Iconos de navegación
export const NavIcon = styled(Box)({
  // Para iconos Lucide
});

// Título del mes y año
export const MonthYearTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 700,
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

// Grid de nombres de días
export const DaysGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

// Grid de días del calendario
export const CalendarGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

// Item de día
export const DayItem = styled(Grid)(({ theme }) => ({
  // Estilo base para cada celda de día
}));

// Caja del día
export const DayBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isCurrentMonth" &&
    prop !== "isSelected" &&
    prop !== "hasCondition" &&
    prop !== "conditionColor",
})<{
  isCurrentMonth?: boolean;
  isSelected?: boolean;
  hasCondition?: boolean;
  conditionColor?: string;
}>(({ theme, isCurrentMonth, isSelected, hasCondition, conditionColor }) => ({
  width: "100%",
  maxWidth: 40,
  margin: "0 auto",

  aspectRatio: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isSelected
    ? `${theme.palette.success.main}20`
    : isCurrentMonth
      ? `${theme.palette.surface.light}`
      : "transparent",
  border: isSelected
    ? `2px solid ${theme.palette.success.main}`
    : isCurrentMonth
      ? `1px solid ${theme.palette.surface.light}40`
      : "1px solid transparent",
  cursor: isCurrentMonth ? "pointer" : "default",
  position: "relative",
  overflow: "hidden",
  backdropFilter: "blur(5px)",

  "&:hover":
    isCurrentMonth && !isSelected
      ? {
          backgroundColor: `${theme.palette.primary.light}90`,
          borderColor: theme.palette.surface.light,
        }
      : {},

  // Fondo de condición
  ...(hasCondition && conditionColor
    ? {
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: conditionColor,
          opacity: 0.15,
        },
      }
    : {}),
}));

// Contenido del día
export const DayContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
}));

// Número del día
export const DayNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isCurrentMonth",
})<{ isCurrentMonth?: boolean }>(({ theme, isCurrentMonth }) => ({
  color: isCurrentMonth
    ? theme.palette.text.primary
    : theme.palette.text.secondary,
  fontWeight: 700,
  fontSize: "0.75rem",
}));

// Icono de condición
export const ConditionIcon = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  lineHeight: 1,
}));

// Indicador de dificultad
export const DifficultyIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color = theme.palette.primary.main }) => ({
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  backgroundColor: color,
  marginTop: theme.spacing(0.5),
}));

// Leyenda
export const LegendContainer = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.surface.light}40`,
  paddingTop: theme.spacing(2),
}));

// Título de leyenda
export const LegendTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

// Contenedor de items de leyenda
export const LegendItems = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

// Item de leyenda
export const LegendItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// Punto de leyenda
export const LegendDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color = theme.palette.primary.main }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: color,
}));

// Texto de leyenda
export const LegendText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
}));
