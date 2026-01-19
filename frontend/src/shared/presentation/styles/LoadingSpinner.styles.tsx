import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "50vh",
  backgroundColor: theme.palette.background.default,
  background: `
    radial-gradient(circle at 30% 70%, ${theme.palette.primary.main}10 0%, transparent 40%),
    radial-gradient(circle at 70% 30%, ${theme.palette.surface.light}10 0%, transparent 40%),
    linear-gradient(135deg, ${theme.palette.background.default} 0%, transparent 100%)
  `,
  color: theme.palette.text.primary,
  gap: theme.spacing(3),
}));

export const LoadingSpinner = styled(Box)(({ theme }) => ({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: `conic-gradient(
    transparent,
    transparent,
    transparent,
    ${theme.palette.primary.main}
  )`,
  animation: "spin 1.2s linear infinite",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: "8px",
    borderRadius: "50%",
    background: theme.palette.background.default,
    backdropFilter: "blur(10px)",
  },

  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));
