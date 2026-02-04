import { Switch, FormControlLabel, Box, styled } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeToggle } from "../ThemeToggleProvider";

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  "& .MuiFormControlLabel-label": {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.65rem",
    },
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.25),
  },
}));

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: "small" | "medium";
}

export const ThemeToggle = ({
  showLabel = true,
  size = "medium",
}: ThemeToggleProps) => {
  const { mode, toggleTheme } = useThemeToggle();
  const isDark = mode === "dark";

  return (
    <IconContainer>
      <LightMode
        sx={(theme) => ({
          fontSize: size === "small" ? 18 : 24,
          color: "text.primary",
          transition: "color 0.3s",

          [theme.breakpoints.down("sm")]: {
            fontSize: size === "small" ? 14 : 18,
          },
        })}
      />

      <StyledFormControlLabel
        control={
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            size={size}
            sx={(theme) => ({
              transform: "scale(1)",

              [theme.breakpoints.down("sm")]: {
                transform: "scale(0.8)",
              },

              "& .MuiSwitch-switchBase": {
                "&.Mui-checked": {
                  color: "primary.main",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "primary.light",
                  },
                },
              },
            })}
          />
        }
        label={showLabel ? (isDark ? "Modo Oscuro" : "Modo Claro") : ""}
        labelPlacement="start"
      />

      <DarkMode
        sx={{
          fontSize: size === "small" ? 18 : 24,
          color: "text.primary",
          transition: "color 0.3s",
        }}
      />
    </IconContainer>
  );
};
