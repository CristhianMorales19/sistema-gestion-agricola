import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  styled,
} from "@mui/material";
import { Cloud, Thermostat, WaterDrop, Air } from "@mui/icons-material";

// Tarjeta glass
export const GlassCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.surface.light}80`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  height: "100%",
}));

// Contenido de la tarjeta
export const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),

    "&:last-child": {
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

// Encabezado
export const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

// Icono de nube
export const CloudIcon = styled(Cloud)(({ theme }) => ({
  color: theme.palette.warning.main,
  fontSize: "1.25rem",
}));

// Título
export const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 600,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
  },
}));

// Grid container
export const ConditionsGrid = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1),
  },
}));

// Grid item
export const ConditionItemGrid = styled(Grid)(({ theme }) => ({
  textAlign: "center",
}));

// Contenedor de item
export const ConditionItemBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
  },
}));

// Contenedor de icono
export const IconBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

// Iconos de condiciones
export const TempIcon = styled(Thermostat)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.warning.main,
}));

export const HumidityIcon = styled(WaterDrop)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.primary.main,
}));

export const RainIcon = styled(Cloud)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.text.secondary,
}));

export const WindIcon = styled(Air)(({ theme }) => ({
  fontSize: "1.25rem",
  color: theme.palette.secondary.main,
}));

// Valor de condición
export const ConditionValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  lineHeight: 1.2,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
}));

// Etiqueta de condición
export const ConditionLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",

  [theme.breakpoints.down("sm")]: {
    fontSize: "0.7rem",
  },
}));
