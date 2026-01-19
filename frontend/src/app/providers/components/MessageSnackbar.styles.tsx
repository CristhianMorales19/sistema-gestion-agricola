import { Snackbar, Alert, styled, Slide, SlideProps } from "@mui/material";

// Animación personalizada para el snackbar
export const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="left" />;
};

// Contenedor del snackbar con efecto glass
export const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: `${theme.palette.surface.main}EE`,
    backdropFilter: "blur(20px)",
    borderRadius: theme.shape.borderRadius * 3,
    border: `1px solid ${theme.palette.surface.light}80`,
    boxShadow: `
      0 8px 32px ${theme.palette.primary.main}15,
      inset 0 1px 0 ${theme.palette.surface.light}40
    `,
    overflow: "hidden",
    position: "relative",

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
  },
}));

// Alert personalizado con efecto glass para cada tipo
export const StyledAlert = styled(Alert)<{
  severity?: "success" | "error" | "warning" | "info";
}>(({ theme, severity }) => {
  // Colores según el tipo de alerta y modo del tema
  const getColors = () => {
    const isDark = theme.palette.mode === "dark";

    switch (severity) {
      case "success":
        return {
          background: isDark
            ? `${theme.palette.success.main}20`
            : `${theme.palette.success.main}15`,
          borderColor: isDark
            ? `${theme.palette.success.main}40`
            : `${theme.palette.success.main}30`,
          iconColor: theme.palette.success.light,
          textColor: theme.palette.text.primary,
          gradient: `linear-gradient(135deg, ${theme.palette.success.main}20, transparent)`,
        };

      case "error":
        return {
          background: isDark
            ? `${theme.palette.error.main}20`
            : `${theme.palette.error.main}15`,
          borderColor: isDark
            ? `${theme.palette.error.main}40`
            : `${theme.palette.error.main}30`,
          iconColor: theme.palette.error.light,
          textColor: theme.palette.text.primary,
          gradient: `linear-gradient(135deg, ${theme.palette.error.main}20, transparent)`,
        };

      case "warning":
        return {
          background: isDark
            ? `${theme.palette.warning.main}20`
            : `${theme.palette.warning.main}15`,
          borderColor: isDark
            ? `${theme.palette.warning.main}40`
            : `${theme.palette.warning.main}30`,
          iconColor: theme.palette.warning.light,
          textColor: theme.palette.text.primary,
          gradient: `linear-gradient(135deg, ${theme.palette.warning.main}20, transparent)`,
        };

      case "info":
      default:
        return {
          background: isDark
            ? `${theme.palette.primary.main}20`
            : `${theme.palette.primary.main}15`,
          borderColor: isDark
            ? `${theme.palette.primary.main}40`
            : `${theme.palette.primary.main}30`,
          iconColor: theme.palette.primary.light,
          textColor: theme.palette.text.primary,
          gradient: `linear-gradient(135deg, ${theme.palette.primary.main}20, transparent)`,
        };
    }
  };

  const colors = getColors();

  return {
    backgroundColor: colors.background,
    backdropFilter: "blur(10px)",
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${colors.borderColor}`,
    padding: theme.spacing(1.5, 2),
    color: colors.textColor,
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: colors.gradient,
      opacity: 0.3,
      zIndex: 0,
    },

    "& .MuiAlert-icon": {
      color: colors.iconColor,
      marginRight: theme.spacing(1.5),
      zIndex: 1,
      position: "relative",
      filter: `drop-shadow(0 2px 4px ${colors.iconColor}40)`,
    },

    "& .MuiAlert-message": {
      zIndex: 1,
      position: "relative",
      padding: theme.spacing(0.5, 0),
      fontSize: "0.875rem",
      fontWeight: 500,
      flex: 1,
    },

    "& .MuiAlert-action": {
      zIndex: 1,
      fontSize: "1.10rem",
      position: "relative",
      padding: 0,
      marginLeft: theme.spacing(1),
      alignItems: "center",
    },

    "& .MuiIconButton-root": {
      color: colors.iconColor,
      padding: theme.spacing(0.5),
      backgroundColor: `${colors.iconColor}15`,
      borderRadius: theme.shape.borderRadius,
      transition: "all 0.3s ease",

      "&:hover": {
        backgroundColor: `${colors.iconColor}30`,
        transform: "scale(1.1)",
        boxShadow: `0 2px 8px ${colors.iconColor}20`,
      },
    },

    "&:hover": {
      transform: "translateX(-2px)",
      boxShadow: `
          0 12px 32px -8px ${colors.borderColor}30,
          inset 0 1px 0 ${colors.iconColor}20
        `,
      borderColor: `${colors.iconColor}60`,
    },
  };
});

// Contenedor para múltiples snackbars (si se necesita apilar)
export const SnackbarStack = styled("div")(({ theme }) => ({
  position: "fixed",
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  zIndex: theme.zIndex.snackbar,
  maxWidth: "400px",
}));

// Indicador de progreso para auto-hide
export const ProgressIndicator = styled("div", {
  shouldForwardProp: (prop) => prop !== "severity" && prop !== "duration",
})<{ severity?: "success" | "error" | "warning" | "info"; duration: number }>(
  ({ theme, severity, duration }) => {
    const getColor = () => {
      switch (severity) {
        case "success":
          return theme.palette.success.light;
        case "error":
          return theme.palette.error.light;
        case "warning":
          return theme.palette.warning.light;
        case "info":
        default:
          return theme.palette.primary.light;
      }
    };

    return {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "2px",
      background: `linear-gradient(90deg, ${getColor()}, transparent)`,
      animation: `shrink ${duration}ms linear forwards`,
      borderRadius: "0 0 0 4px",

      "@keyframes shrink": {
        "0%": {
          width: "100%",
          opacity: 1,
        },
        "100%": {
          width: "0%",
          opacity: 0,
        },
      },
    };
  }
);

// Contenedor con efecto de borde acentuado
export const AccentBorderContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "severity",
})<{ severity?: "success" | "error" | "warning" | "info" }>(
  ({ theme, severity }) => {
    const getColor = () => {
      switch (severity) {
        case "success":
          return theme.palette.success.main;
        case "error":
          return theme.palette.error.main;
        case "warning":
          return theme.palette.warning.main;
        case "info":
        default:
          return theme.palette.primary.main;
      }
    };

    return {
      position: "relative",
      borderRadius: theme.shape.borderRadius * 3,
      overflow: "hidden",

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: "2px",
        background: `linear-gradient(135deg, ${getColor()}, transparent 50%)`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        borderRadius: "inherit",
        animation: "borderGlow 2s infinite",
      },

      "@keyframes borderGlow": {
        "0%, 100%": {
          opacity: 0.7,
        },
        "50%": {
          opacity: 1,
        },
      },
    };
  }
);
