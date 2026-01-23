import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const ButtonGeneric = styled(Button)<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    background: disabled
      ? theme.palette.surface.light
      : `linear-gradient(
        135deg,
        ${theme.palette.primary.main} 0%,
        ${theme.palette.primary.dark} 100%
      )`,
    color: disabled ? theme.palette.text.secondary : theme.palette.text.primary,

    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 3),
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: disabled ? "default" : "pointer",

    border: `1px solid ${
      disabled ? theme.palette.surface.light : `${theme.palette.primary.main}40`
    }`,

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
      ${theme.palette.primary.light}40,
      transparent
    )`,
      transition: "left 0.6s ease",
      opacity: disabled ? 0 : 1,
    },

    "&:hover": {
      transform: disabled ? "none" : "translateY(-2px)",
      boxShadow: disabled
        ? "none"
        : `
        0 12px 30px -10px ${theme.palette.primary.main}50,
        0 4px 20px -5px ${theme.palette.primary.dark}30,
        inset 0 1px 0 ${theme.palette.primary.light}40
      `,
      backgroundColor: disabled ? theme.palette.surface.light : undefined,
      "&::before": {
        left: disabled ? "-100%" : "100%",
      },
    },

    "&:active": {
      transform: disabled ? "none" : "translateY(0)",
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
  }),
);
