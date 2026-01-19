import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Slide,
  styled,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Animación personalizada
export const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// Dialog con efecto glass
export const GlassDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: `${theme.palette.background.default}`,
    borderRadius: theme.shape.borderRadius * 4,
    border: `1px solid ${theme.palette.surface.light}80`,
    boxShadow: `
      0 20px 60px ${theme.palette.primary.main}10,
      0 8px 32px ${theme.palette.error.main}15,
      inset 0 1px 0 ${theme.palette.surface.light}40
    `,
    overflow: "hidden",
    position: "relative",
    maxWidth: "480px",

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
        ${theme.palette.error.main}60,
        transparent
      )`,
      zIndex: 1,
    },

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(
        circle at 20% 80%,
        ${theme.palette.error.main}20 1%,
        transparent 50%
      )`,
      pointerEvents: "none",
    },
  },
}));

// Título del dialog
export const GlassDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.surface.light}30`,
  backdropFilter: "blur(10px)",
  borderBottom: `1px solid ${theme.palette.surface.light}40`,

  "& .MuiTypography-root": {
    flex: 1,
    fontSize: "1.25rem",
    fontWeight: 700,
    background: `linear-gradient(
      135deg,
      ${theme.palette.text.primary} 0%,
      ${theme.palette.error.light} 100%
    )`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
}));

// Icono de eliminar
export const DeleteIcon = styled(DeleteOutlineIcon)(({ theme }) => ({
  fontSize: "1.75rem",
  color: theme.palette.error.light,
  filter: `drop-shadow(0 2px 8px ${theme.palette.error.main}50)`,
}));

// Contenido del dialog
export const GlassDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "transparent",

  "&.MuiDialogContent-dividers": {
    borderTop: `1px solid ${theme.palette.surface.light}30`,
    borderBottom: `1px solid ${theme.palette.surface.light}30`,
  },
}));

// Etiqueta del item
export const ItemLabel = styled(Box)(({ theme }) => ({
  backgroundColor: `${theme.palette.surface.light}20`,
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.surface.light}40`,
  marginTop: theme.spacing(2),
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "3px",
    background: `linear-gradient(
      180deg,
      ${theme.palette.error.main},
      ${theme.palette.error.light}
    )`,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
}));

// Texto del item
export const ItemLabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  fontWeight: 600,
  paddingLeft: theme.spacing(2),
}));

// Acciones del dialog
export const GlassDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: `${theme.palette.surface.light}20`,
  backdropFilter: "blur(10px)",
  borderTop: `1px solid ${theme.palette.surface.light}40`,
  gap: theme.spacing(1),
}));

// Botón de eliminar
export const DeleteButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "loading",
})<{ loading?: boolean }>(({ theme, loading }) => ({
  background: loading
    ? `${theme.palette.surface.light}`
    : `linear-gradient(
        135deg,
        ${theme.palette.error.main} 0%,
        ${theme.palette.error.dark} 100%
      )`,
  color: loading ? theme.palette.text.secondary : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.25, 3),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  border: loading
    ? `1px solid ${theme.palette.surface.light}`
    : `1px solid ${theme.palette.error.main}40`,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: `linear-gradient(
      90deg,
      transparent,
      ${theme.palette.error.light}40,
      transparent
    )`,
    transition: "left 0.6s ease",
    opacity: loading ? 0 : 1,
  },

  "&:hover": {
    background: loading
      ? `${theme.palette.surface.light}`
      : `linear-gradient(
          135deg,
          ${theme.palette.error.dark} 0%,
          ${theme.palette.error.main} 100%
        )`,
    transform: loading ? "none" : "translateY(-2px)",
    boxShadow: loading
      ? "none"
      : `
          0 12px 30px -10px ${theme.palette.error.main}50,
          0 4px 20px -5px ${theme.palette.error.dark}30,
          inset 0 1px 0 ${theme.palette.error.light}40
        `,

    "&::before": {
      left: loading ? "-100%" : "100%",
    },
  },

  "&:active": {
    transform: loading ? "none" : "translateY(0)",
  },

  "&:disabled": {
    background: theme.palette.surface.light,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.surface.light}`,
    transform: "none",
    boxShadow: "none",

    "&::before": {
      display: "none",
    },
  },
}));

// Texto del botón
export const ButtonText = styled("span")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
});

// Contenedor de advertencia
export const WarningContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  backgroundColor: `${theme.palette.error.main}10`,
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1),
  // marginTop: theme.spacing(3),
  border: `1px solid ${theme.palette.error.main}30`,

  "& .MuiSvgIcon-root": {
    color: theme.palette.error.light,
    fontSize: "1.25rem",
  },
}));

// Texto de advertencia
export const WarningText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.light,
  fontSize: "0.875rem",
  fontWeight: 500,
  flex: 1,
}));

// Icono de advertencia
export const WarningIcon = styled(Box)(({ theme }) => ({
  fontSize: "1.5rem",
  color: theme.palette.error.light,
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.4)",
      opacity: 0.9,
    },
  },
}));
