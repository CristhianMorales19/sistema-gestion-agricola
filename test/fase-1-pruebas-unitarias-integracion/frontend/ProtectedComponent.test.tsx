// @ts-nocheck
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedComponent } from '../../../frontend/src/components/rbac/ProtectedComponent';
import { AuthContext } from '../../../frontend/src/auth/AuthContext';

const mockAuthContextValue = {
  hasPermission: jest.fn(() => true),
  hasRole: jest.fn((role) => role === 'admin'),
  isLoading: false,
  isAuthenticated: true,
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    permisos: {
      gestionar_usuarios: true,
      consultar_usuarios: true,
      gestionar_personal: true,
      consultar_personal: true,
      gestionar_asistencia: true,
      consultar_asistencia: true,
      gestionar_nomina: true,
      consultar_nomina: true,
      gestionar_productividad: true,
      consultar_productividad: true,
      gestionar_reportes: true,
      consultar_reportes: true,
      gestionar_configuracion: true,
      consultar_configuracion: true,
    },
    roles: [],
  },
  login: jest.fn(),
  logout: jest.fn(),
};

describe('ProtectedComponent', () => {
  test('muestra contenido solo para roles permitidos', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ProtectedComponent requiredRole="admin">
          Contenido permitido
        </ProtectedComponent>
      </AuthContext.Provider>
    );
    expect(screen.getByText('Contenido permitido')).toBeInTheDocument();
  });

  test('no muestra contenido para roles no permitidos', () => {
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <ProtectedComponent requiredRole="user">
          Contenido restringido
        </ProtectedComponent>
      </AuthContext.Provider>
    );
    expect(screen.queryByText('Contenido restringido')).toBeNull();
  });
});
