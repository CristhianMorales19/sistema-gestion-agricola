import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders';
<<<<<<< HEAD
import { LoginPage, ProtectedRoute, AdminDashboard, CallbackPage } from './authentication';
=======
import { LoginPage, ProtectedRoute, AdminDashboard, CallbackPage } from './features/authentication';
>>>>>>> 5a7c7fa (Primer commit)

// Componente de Dashboard que usa el AdminDashboard profesional
const Dashboard: React.FC = () => {
  // Usar directamente AdminDashboard con la nueva arquitectura Clean
  return <AdminDashboard />;
};

// Componente principal de la aplicación
const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/callback"
        element={<CallbackPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      {/* Aquí otros miembros del equipo pueden agregar sus rutas */}
      {/*
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute requiredPermission="gestionar_usuarios">
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal"
        element={
          <ProtectedRoute requiredPermission="gestionar_personal">
            <PersonnelManagementPage />
          </ProtectedRoute>
        }
      />
      */}
    </Routes>
  );
};

// Aplicación principal con todos los providers
const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
