// Configuración de Auth0
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-agromano.us.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://agromano-api.com',
  redirectUri: `${window.location.origin}/callback`,
  scope: 'openid profile email'
};

// Configuración de API
export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000
};

// Configuración de la aplicación
export const appConfig = {
  name: 'AgroMano',
  version: '1.0.0',
  description: 'Sistema de Gestión Agrícola con RBAC',
  theme: {
    primary: '#16d36c',
    secondary: '#1e202b',
    background: '#ffffff'
  }
};
