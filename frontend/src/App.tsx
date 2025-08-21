import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './caracteristicas/autenticacion/context/AuthContext';
import { LoginPage } from './caracteristicas/autenticacion/components/LoginPage';
import { ProtectedRoute } from './caracteristicas/autenticacion/components/ProtectedRoute';
import { AppNavbar } from './components/layout/AppNavbar';
import { Dashboard } from './components/Dashboard';
import { UnauthorizedPage } from './components/UnauthorizedPage';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isAuthenticated && <AppNavbar />}
      
      <Routes>
        {/* Ruta pública - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage />
          } 
        />
        
        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Página de acceso no autorizado */}
        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute>
              <UnauthorizedPage />
            </ProtectedRoute>
          }
        />
        
        {/* Redirección por defecto */}
        <Route
          path="*"
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Box>
  );
};

export default App;