import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  FormLabel,
  Alert,
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

// Alert personalizado
export const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: `${theme.palette.success.main}20`,
  color: theme.palette.success.light,
  border: `1px solid ${theme.palette.success.main}40`,
  borderRadius: theme.shape.borderRadius * 1.5,
}));

// Label del formulario
export const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  display: "block",
  marginBottom: theme.spacing(1),
}));

// Botones de condición
export const ConditionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "buttonColor",
})<{ isSelected?: boolean; buttonColor?: string }>(
  ({ theme, isSelected, buttonColor = theme.palette.primary.main }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `2px solid`,
    borderColor: isSelected ? buttonColor : theme.palette.surface.light,
    backgroundColor: isSelected
      ? `${buttonColor}20`
      : `${theme.palette.surface.light}20`,
    backdropFilter: "blur(5px)",
    color: theme.palette.text.primary,
    "&:hover": {
      borderColor: buttonColor,
      backgroundColor: `${buttonColor}20`,
    },
  }),
);

// Contenedor de botón de condición
export const ConditionButtonContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// Icono de condición
export const ConditionIcon = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
}));

// Texto de condición
export const ConditionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  textAlign: "center",
  fontWeight: 500,
}));

// Botones de dificultad
export const DifficultyButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "buttonColor",
})<{ isSelected?: boolean; buttonColor?: string }>(
  ({ theme, isSelected, buttonColor = theme.palette.primary.main }) => ({
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    border: `2px solid`,
    borderColor: isSelected ? buttonColor : theme.palette.surface.light,
    backgroundColor: isSelected
      ? `${buttonColor}20`
      : `${theme.palette.surface.light}20`,
    backdropFilter: "blur(5px)",
    color: theme.palette.text.primary,
    "&:hover": {
      borderColor: buttonColor,
      backgroundColor: `${buttonColor}20`,
    },
  }),
);

// Contenedor de botón de dificultad
export const DifficultyButtonContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  justifyContent: "center",
}));
