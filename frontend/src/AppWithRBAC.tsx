// src/AppWithRBAC.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders';
import { LoginPage, ProtectedRoute, AdminDashboard, CallbackPage } from './features/authentication';

const Dashboard: React.FC = () => <AdminDashboard />;

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Fallback explícito para detectar no-match */}
      <Route path="*" element={<div style={{ padding: 32, color: '#fff' }}>404 - Ruta no encontrada</div>} />
    </Routes>
  );
};

const App: React.FC = () => (
  <AppProviders>
    <AppContent />
  </AppProviders>
);

export default App;
