import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  styled,
} from "@mui/material";
import { Security, FiberManualRecord } from "@mui/icons-material";

// Tarjeta glass
export const GlassCard = styled(Card)(({ theme }) => ({
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.surface.light}80`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
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

// Icono de seguridad
export const SecurityIcon = styled(Security)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "1.25rem",
}));

// Título
export const TitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1rem",
  fontWeight: 600,
}));

// Chip de permiso
export const PermissionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: `${theme.palette.success.main}15`,
  color: theme.palette.success.light,
  border: `1px solid ${theme.palette.success.main}40`,
  backdropFilter: "blur(5px)",
  borderRadius: theme.shape.borderRadius * 1.5,
  fontWeight: 600,
  fontSize: "0.875rem",
  padding: theme.spacing(0.5, 1),

  "& .MuiChip-icon": {
    color: `${theme.palette.warning.main} !important`,
    fontSize: "0.75rem",
    marginLeft: theme.spacing(0.5),
  },
}));

// Icono del punto
export const DotIcon = styled(FiberManualRecord)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.warning.main,
}));

// Contenedor de permisos
export const PermissionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));
