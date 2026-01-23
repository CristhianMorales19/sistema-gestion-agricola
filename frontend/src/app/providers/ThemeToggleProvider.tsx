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
