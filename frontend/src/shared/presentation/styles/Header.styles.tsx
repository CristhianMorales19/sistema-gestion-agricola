import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const HeaderGeneric = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 3,

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
  },

  // Pantallas pequeñas
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0.5),
  },
}));
