// Mock data for development when Auth0 is not properly configured
export const mockUsers = [
  {
    user_id: 'auth0|mock-user-1',
    email: 'admin@agromano.com',
    name: 'Administrador AgroMano',
    picture: 'https://via.placeholder.com/150',
    nickname: 'admin',
    given_name: 'Administrador',
    family_name: 'AgroMano',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-09-30T00:00:00.000Z',
    last_login: '2025-09-30T00:00:00.000Z',
    email_verified: true,
    identities: [{
      connection: 'Username-Password-Authentication',
      user_id: 'mock-user-1',
      provider: 'auth0',
      isSocial: false
    }]
  },
  {
    user_id: 'auth0|mock-user-2',
    email: 'trabajador@agromano.com',
    name: 'Trabajador de Campo',
    picture: 'https://via.placeholder.com/150',
    nickname: 'trabajador',
    given_name: 'Trabajador',
    family_name: 'Campo',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-09-30T00:00:00.000Z',
    last_login: '2025-09-30T00:00:00.000Z',
    email_verified: true,
    identities: [{
      connection: 'Username-Password-Authentication',
      user_id: 'mock-user-2',
      provider: 'auth0',
      isSocial: false
    }]
  },
  {
    user_id: 'auth0|mock-user-3',
    email: 'supervisor@agromano.com',
    name: 'Supervisor de Área',
    picture: 'https://via.placeholder.com/150',
    nickname: 'supervisor',
    given_name: 'Supervisor',
    family_name: 'Área',
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-09-30T00:00:00.000Z',
    last_login: '2025-09-30T00:00:00.000Z',
    email_verified: true,
    identities: [{
      connection: 'Username-Password-Authentication',
      user_id: 'mock-user-3',
      provider: 'auth0',
      isSocial: false
    }]
  }
];

export const mockRoles = [
  {
    id: 'rol_mock_admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema - puede gestionar usuarios, configuraciones y datos'
  },
  {
    id: 'rol_mock_supervisor',
    name: 'Supervisor',
    description: 'Supervisión de operaciones - puede ver reportes y gestionar trabajadores'
  },
  {
    id: 'rol_mock_trabajador',
    name: 'Trabajador',
    description: 'Acceso básico - puede registrar asistencia y actividades laborales'
  },
  {
    id: 'rol_mock_contador',
    name: 'Contador',
    description: 'Gestión financiera - puede ver reportes de costos y nóminas'
  }
];

export const mockUserRoles: Record<string, string[]> = {
  'auth0|mock-user-1': ['rol_mock_admin'],
  'auth0|mock-user-2': ['rol_mock_trabajador'],
  'auth0|mock-user-3': ['rol_mock_supervisor']
};