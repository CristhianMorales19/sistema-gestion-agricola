import {
  Box,
  Button,
  ListItemButton,
  ListItemIcon,
  Avatar,
  styled,
  ListItemText,
  ListItem,
  Typography,
  Divider,
} from "@mui/material";

import { TOP_BAR_HEIGHT } from "../../../../../../../shared/presentation/components/ui/topBar/TopBar.styles";

// Sidebar
export const SidebarContainer = styled(Box)<{ open: boolean }>(
  ({ theme, open }) => ({
    position: "fixed",
    top: TOP_BAR_HEIGHT,
    left: 0,
    height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
    width: 280,
    overflow: "hidden",
    background: `linear-gradient(135deg, ${theme.palette.surface.main} 0%, ${theme.palette.background.default} 10%)`,
    borderRight: `1px solid ${theme.palette.surface.light}`,
    boxShadow: `4px 0 20px -5px ${theme.palette.primary.main}10`,
    zIndex: theme.zIndex.drawer,

    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",

    display: "flex",
    flexDirection: "column",

    overflowY: "auto",
    overflowX: "hidden",

    /* Scrollbar opcional */
    // scrollbarWidth: "thin",
    // scrollbarColor: `${theme.palette.primary.dark} transparent`,

    "&::-webkit-scrollbar": {
      width: 2.5,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2,
    },
  }),
);

// Navigation
export const NavigationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0),
  marginBottom: theme.spacing(1),
}));

export const NavigationButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: active
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : "transparent",
  border: active
    ? `1px solid ${theme.palette.primary.main}40`
    : "1px solid transparent",
  boxShadow: active
    ? `0 8px 25px -8px ${theme.palette.primary.main}40`
    : "none",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  ...(active && {
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    },
  }),
  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}30`,
    border: `1px solid ${theme.palette.primary.main}30`,
    transform: "translateX(4px)",
    boxShadow: `0 6px 20px -6px ${theme.palette.primary.main}30`,
  },
  "&:active": {
    transform: "translateX(2px) scale(0.98)",
  },
}));

export const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  minWidth: 40,
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.light,
    transform: "scale(1.1)",
  },
}));

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 400,
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    transition: "all 0.3s ease",
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
}));

// Active Indicator
export const ActiveIndicator = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 8,
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.light,
  boxShadow: `0 0 8px ${theme.palette.primary.light}`,
}));

// Navigation List Container
export const NavigationListContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
}));

// User Profile Section
export const UserProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.surface.light}`,
  background: `linear-gradient(135deg, ${theme.palette.surface.main} 0%, ${theme.palette.background.default} 100%)`,
}));

export const UserProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: `${theme.palette.surface.light}80`,
  border: `1px solid ${theme.palette.surface.light}`,
  transition: "all 0.3s ease",

  "&:hover": {
    background: theme.palette.surface.light,
    border: `1px solid ${theme.palette.primary.main}40`,
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px -6px ${theme.palette.primary.main}20`,
  },
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 52,
  height: 52,
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: `0 4px 12px -2px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",

  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `0 6px 16px -2px ${theme.palette.primary.main}60`,
  },
}));

export const UserInfoContainer = styled(Box)(() => ({
  flex: 1,
}));

export const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
}));

export const UserRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 500,
  background: `${theme.palette.secondary.main}15`,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: 2,
  paddingBottom: 2,
  borderRadius: theme.shape.borderRadius * 2,
  display: "inline-block",
  fontSize: "0.75rem",
}));

// Role Buttons Container
export const RoleButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const RoleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isAccent",
})<{ isAccent?: boolean }>(({ theme, isAccent }) => ({
  color: theme.palette.text.secondary,
  border: `1px solid ${
    isAccent
      ? theme.palette.accent?.main || theme.palette.secondary.main
      : theme.palette.primary.main
  }30`,
  textTransform: "none",
  justifyContent: "flex-start",
  fontSize: "0.75rem",
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(1),
  transition: "all 0.3s ease",

  "&:hover": {
    color: isAccent
      ? theme.palette.accent?.main || theme.palette.secondary.main
      : theme.palette.primary.light,
    border: `1px solid ${
      isAccent
        ? theme.palette.accent?.main || theme.palette.secondary.main
        : theme.palette.primary.main
    }`,
    backgroundColor: `${
      isAccent
        ? theme.palette.accent?.main || theme.palette.secondary.main
        : theme.palette.primary.main
    }10`,
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px -4px ${
      isAccent
        ? theme.palette.accent?.main || theme.palette.secondary.main
        : theme.palette.primary.main
    }30`,
  },
}));

// Action Buttons Container
export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textTransform: "none",
  justifyContent: "flex-start",
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: "all 0.3s ease",

  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}10`,
    transform: "translateX(4px)",
  },
}));

export const LogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textTransform: "none",
  justifyContent: "flex-start",
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: "all 0.3s ease",

  "&:hover": {
    color: theme.palette.text.secondary,
    backgroundColor: `${theme.palette.text.secondary}10`,
    transform: "translateX(4px)",
  },
}));

// Divider
export const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.surface.light,
}));

// Layout
export const BackgroundContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  backgroundImage: `
        radial-gradient(circle at 15% 50%, ${theme.palette.surface.light}40 0%, transparent 65%),
        radial-gradient(circle at 85% 30%, ${theme.palette.background.default} 0%, transparent 55%),
        linear-gradient(135deg, ${theme.palette.primary.main}05 0%, transparent 50%)
    `,
  position: "relative",
}));

export const MainContent = styled(Box)<{ open: boolean }>(({ open }) => ({
  marginTop: TOP_BAR_HEIGHT,
  marginLeft: open ? 280 : 0,
  transition: "margin-left 0.3s ease",
  minHeight: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));
