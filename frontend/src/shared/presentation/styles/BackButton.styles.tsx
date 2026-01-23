import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// Botón de cancelar con estilo glass
export const BackButtonGeneric = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.surface.light}80`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  background: `${theme.palette.surface.main}60`,
  backdropFilter: "blur(10px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  "&:hover": {
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.primary.main}90`,
    backgroundColor: `${theme.palette.primary.main}30`,
    transform: "translateY(-2px)",
    boxShadow: `
      0 8px 25px -8px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.primary.main}20
    `,
  },

  "& .MuiButton-startIcon": {
    transition: "transform 0.3s ease",
  },

  "&:hover .MuiButton-startIcon": {
    transform: "translateX(-2px)",
  },

  "& .MuiButton-startIcon svg": {
    fontSize: "1.25rem",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5, 1.5),
    fontSize: "0.60rem",
    minHeight: 32,
  },
}));
