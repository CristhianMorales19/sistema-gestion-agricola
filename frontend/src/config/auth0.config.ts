// Configuración de Auth0 para el frontend
export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-agromano.us.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'YourAuth0ClientId',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://api.agromano.com',
  redirectUri: window.location.origin + '/callback',
  logoutUri: window.location.origin,
  scope: 'openid profile email'
};

// URL base del API backend
export const apiConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000
};

export default {
  auth0: auth0Config,
  api: apiConfig
};
