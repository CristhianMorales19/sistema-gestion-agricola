import { Box, Grid, styled, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

// Contenedor del formulario
export const FormContainer = styled(Box)(({ theme }) => ({
  "& .MuiGrid-container": {
    marginBottom: theme.spacing(1),
  },
}));

export const InputSection = styled(Box)(() => ({
  maxWidth: 500, // ≈ 1/3 de pantalla desktop
  margin: "0 auto", // centra horizontalmente
}));

// Grid item con efecto de elevación al hover
export const GridItem = styled(Grid)(() => ({
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

// Contenedor de botones
export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "flex-end",
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.surface.light}40`,
}));

// Mensaje de error cuando no hay empleado
export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.light,
  fontWeight: 500,
  textAlign: "center",
  padding: theme.spacing(4),
  backgroundColor: `${theme.palette.error.main}10`,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.error.main}30`,
  backdropFilter: "blur(10px)",
}));

// Etiqueta de sección
export const SectionLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),

  "&::after": {
    content: '""',
    flex: 1,
    height: "1px",
    background: `linear-gradient(
      90deg,
      ${theme.palette.surface.light}40,
      transparent
    )`,
  },
}));

// Icono de flecha para el botón de cancelar
export const StyledArrowBackIcon = styled(ArrowBackIcon)(({ theme }) => ({
  fontSize: "1rem",
  transition: "transform 0.3s ease",
}));
