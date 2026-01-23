import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  styled,
} from "@mui/material";

// Grid de estadísticas
export const StatsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),

  maxWidth: "50vw", // 1/3 de la pantalla
  marginLeft: "auto",
  marginRight: "auto",
  justifyContent: "center",

  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
}));

// Stats Card con efecto glass
export const StatsCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.surface.light}60`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  height: "90%",
}));

// Contenido de la stats card
export const StatsCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

// Contenedor interno de stats
export const StatsContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

// Contenedor de texto de stats
export const StatsTextBox = styled(Box)(({ theme }) => ({
  flex: 1,
}));

// Valor de la stats card
export const StatsValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color = theme.palette.text.primary }) => ({
  color,
  fontSize: "1rem",
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  lineHeight: 1.2,
}));

// Etiqueta de la stats card
export const StatsLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.65rem",
  fontWeight: 500,
}));

// Icon Box para estadísticas
export const StatsIconBox = styled(Box)<{ bgcolor: string }>(
  ({ theme, bgcolor }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 33,
    height: 33,
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: bgcolor,
    marginRight: theme.spacing(1),
    color: "white",
    flexShrink: 0,

    "& svg": {
      fontSize: "1.1rem",
    },
  }),
);
