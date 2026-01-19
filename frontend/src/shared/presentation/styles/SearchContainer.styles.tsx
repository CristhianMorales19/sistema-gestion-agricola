import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Search } from "@mui/icons-material";

// Barra de búsqueda con efecto glass
export const SearchContainerGeneric = styled(Box)(({ theme }) => ({
  maxWidth: 500, // ≈ 1/3 de pantalla desktop
  margin: "0 auto", // centra horizontalmente
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  background: `${theme.palette.background.default}`,
  borderRadius: theme.shape.borderRadius * 4,
  border: `1px solid ${theme.palette.surface.light}80`,
}));

// Icono de búsqueda
export const StyledSearchIcon = styled(Search)(({ theme }) => ({
  color: theme.palette.primary.light,
}));

// Contenedor de búsqueda
export const SearchInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
  // marginBottom: theme.spacing(2),
}));
