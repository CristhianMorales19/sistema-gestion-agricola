import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './caracteristicas/autenticacion/hooks/useAuth';
import Login from './caracteristicas/autenticacion/componentes/Login';
import Dashboard from './caracteristicas/autenticacion/componentes/Dashboard';

// Crear tema de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Verde para tema agrícola
    },
    secondary: {
      main: '#ff8f00', // Naranja
    },
  },
});

// Componente para rutas protegidas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Componente para rutas públicas (solo accesibles si no está autenticado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;