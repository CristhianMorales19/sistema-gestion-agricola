import React, { createContext, useContext, useState, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface ThemeToggleContextType {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeToggleContext = createContext<ThemeToggleContextType | undefined>(
  undefined,
);

export const useThemeToggle = () => {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error("useThemeToggle debe usarse dentro de ThemeToggleProvider");
  }
  return context;
};

interface ThemeToggleProviderProps {
  children: React.ReactNode;
}

export const ThemeToggleProvider = ({ children }: ThemeToggleProviderProps) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  // Definir temas claro y oscuro
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#00D4FF" : "#007BFF",
            dark: mode === "dark" ? "#0099CC" : "#0056B3",
            light: mode === "dark" ? "#66EBFF" : "#66B0FF",
          },
          secondary: {
            main: mode === "dark" ? "#01b24bff" : "#01b24bff",
            dark: mode === "dark" ? "#007e52ff" : "#00702fff",
          },
          // accent: {
          //   main: mode === "dark" ? "#00F5A0" : "#00C853",
          // },
          background: {
            default: mode === "dark" ? "#0A0F1C" : "rgb(255, 255, 255)",
            paper: mode === "dark" ? "#131A2D" : "#FFFFFF",
          },
          surface: {
            main: mode === "dark" ? "#131A2D" : "#ffffffff",
            light: mode === "dark" ? "#1E263C" : "#f5f0f0ff",
          },
          text: {
            primary: mode === "dark" ? "#FFFFFF" : "#1A202C",
            secondary: mode === "dark" ? "#94A3B8" : "#546275",
          },
        },
        spacing: 8,
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: `'Inter', 'Roboto', sans-serif`,
          button: {
            textTransform: "none",
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                color: mode === "dark" ? "#94A3B8" : "#64748B",
              },
              track: {
                backgroundColor: mode === "dark" ? "#1E263C" : "#CBD5E0",
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: ({ theme }) => ({
                marginTop: theme.spacing(1),
                background: theme.palette.background.default,
                borderRadius: theme.shape.borderRadius * 2,
                border: `1px solid ${theme.palette.primary.dark}`,
                boxShadow: `
                  0 20px 50px ${theme.palette.primary.dark}30,
                  inset 0 1px 0 ${theme.palette.surface.light}30
                `,
              }),
            },
          },

          MuiMenuItem: {
            styleOverrides: {
              root: ({ theme }) => ({
                fontSize: "0.875rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius,

                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}20`,
                },

                "&.Mui-selected": {
                  backgroundColor: `${theme.palette.primary.main}30`,
                  color: theme.palette.primary.light,

                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}40`,
                  },
                },
              }),
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              popper: {
                zIndex: 1300,
              },

              paper: ({ theme }) => ({
                marginTop: theme.spacing(1),
                background: theme.palette.background.default,
                borderRadius: theme.shape.borderRadius * 2,
                border: `1px solid ${theme.palette.primary.dark}`,
                boxShadow: `
        0 20px 50px ${theme.palette.primary.dark}30,
        inset 0 1px 0 ${theme.palette.surface.light}30
      `,
              }),

              listbox: {
                padding: 4,
              },

              option: ({ theme }) => ({
                fontSize: "0.875rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius,
                padding: "10px 12px",
                margin: "2px 0",

                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}20`,
                },

                '&[aria-selected="true"]': {
                  backgroundColor: `${theme.palette.primary.main}30`,
                  color: theme.palette.primary.light,
                },

                '&[aria-selected="true"]:hover': {
                  backgroundColor: `${theme.palette.primary.main}40`,
                },
              }),
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
