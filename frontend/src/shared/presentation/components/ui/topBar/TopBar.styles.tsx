import { Agriculture } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TOP_BAR_HEIGHT = 80;

// Logo
export const LogoContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: TOP_BAR_HEIGHT,
  zIndex: theme.zIndex.drawer + 2,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.surface.light}`,
  background: `linear-gradient(135deg, ${theme.palette.surface.main} 0%, ${theme.palette.background.default} 10%)`,
}));

export const LogoBox = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 4px 15px -3px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "rotate(10deg) scale(1.05)",
    boxShadow: `0 6px 20px -2px ${theme.palette.primary.main}60`,
  },
}));

export const LogoIcon = styled(Agriculture)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 24,
}));

// Logo Content Box
export const LogoContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateX(4px)",
  },
}));

export const LogoTextContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

// Brand Typography
export const BrandTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.light} 100%)`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1.25rem",
  lineHeight: 1.2,
}));

export const BrandSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  letterSpacing: "0.5px",
  fontSize: "0.75rem",
}));

export const ThemeToggleContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));
