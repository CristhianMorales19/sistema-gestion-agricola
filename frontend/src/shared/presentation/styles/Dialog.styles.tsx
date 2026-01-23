import React from "react";
import { Dialog, Slide, styled } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

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
    padding: theme.spacing(4),
    background: `${theme.palette.background.default}`,
    borderRadius: theme.shape.borderRadius * 4,
    border: `1px solid ${theme.palette.surface.light}80`,
    boxShadow: `
      0 20px 60px ${theme.palette.primary.dark}10,
      0 8px 32px ${theme.palette.primary.dark}15,
      inset 0 1px 0 ${theme.palette.surface.light}40
    `,
    overflow: "hidden",
    position: "relative",
    maxWidth: "480px",

    "& .MuiDialogContent-root": {
      overflowY: "auto",
      maxHeight: "calc(80vh - 140px)",

      "&::-webkit-scrollbar": {
        width: 4,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
    },

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
        ${theme.palette.primary.dark}60,
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
        circle at 10% 120%,
        ${theme.palette.primary.dark}65 1%,
        transparent 50%
      )`,
      pointerEvents: "none",
    },
  },
}));
