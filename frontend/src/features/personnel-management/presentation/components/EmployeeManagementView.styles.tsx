import { Box, Typography } from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Botón contenedor en header
export const HeaderButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

// Mensaje de empleado seleccionado
export const SelectedEmployeeMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.light,
  fontSize: "0.875rem",
  fontWeight: 600,
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: `${theme.palette.success.main}10`,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.success.main}30`,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),

  "&::before": {
    fontSize: "0.75rem",
  },
}));

// Mensaje de búsqueda
export const SearchMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  fontStyle: "italic",
  marginTop: theme.spacing(1),
  padding: theme.spacing(1, 2),
  backgroundColor: `${theme.palette.surface.light}20`,
  borderRadius: theme.shape.borderRadius,
  borderLeft: `3px solid ${theme.palette.primary.main}80`,
}));

// Iconos
export const StyledWorkIcon = styled(WorkIcon)(() => ({
  fontSize: "1.25rem",
}));

export const StyledPersonAddIcon = styled(PersonAddIcon)(({ theme }) => ({
  fontSize: "1.25rem",
}));
