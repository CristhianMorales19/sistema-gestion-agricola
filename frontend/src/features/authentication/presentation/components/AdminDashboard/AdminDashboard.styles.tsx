import { Box, Grid, styled, Typography } from "@mui/material";

// Contenedor principal con efecto glass
export const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: "90vh",
  background: `
    radial-gradient(circle at 15% 50%, ${theme.palette.primary.main}01 90%, transparent 100%),
    radial-gradient(circle at 150% 0%, ${theme.palette.primary.dark} 1%, transparent 50%),
    linear-gradient(135deg, ${theme.palette.primary.dark}01 0%, transparent 100%)
  `,
}));

// Contenedor de vista actual
export const ContentContainer = styled(Box)(({ theme }) => ({
  backdropFilter: "blur(20px)",
  borderRadius: theme.shape.borderRadius * 3,
  border: `1px solid ${theme.palette.surface.light}80`,
  boxShadow: `
    0 8px 32px ${theme.palette.primary.main}08,
    inset 0 1px 0 ${theme.palette.surface.light}40
  `,
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  minHeight: "80vh",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: `linear-gradient(
      90deg,
      transparent,
      ${theme.palette.primary.main}40,
      transparent
    )`,
    zIndex: 1,
  },
}));

// Contenedor de error con efecto glass
export const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  background: `
    radial-gradient(circle at 30% 70%, ${theme.palette.error.main}05 0%, transparent 40%),
    radial-gradient(circle at 70% 30%, ${theme.palette.surface.light}10 0%, transparent 40%),
    linear-gradient(135deg, ${theme.palette.background.default} 0%, transparent 100%)
  `,
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  textAlign: "center",
}));

// Detalles del error
export const ErrorDetails = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.surface.light}20`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.surface.light}40`,
  backdropFilter: "blur(10px)",
}));

// Contenedor sin datos
export const NoDataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  background: `
    radial-gradient(circle at 30% 70%, ${theme.palette.primary.main}05 0%, transparent 40%),
    radial-gradient(circle at 70% 30%, ${theme.palette.surface.light}10 0%, transparent 40%),
    linear-gradient(135deg, ${theme.palette.background.default} 0%, transparent 100%)
  `,
  color: theme.palette.text.secondary,
  textAlign: "center",
  padding: theme.spacing(4),
}));

// Grid container para dashboard
export const DashboardGrid = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(3),
}));

// Grid item para dashboard
export const DashboardGridItem = styled(Grid)(({ theme }) => ({
  transition: "transform 0.3s ease",

  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

export const NoDataMessage = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  lineHeight: 1.6,
}));
