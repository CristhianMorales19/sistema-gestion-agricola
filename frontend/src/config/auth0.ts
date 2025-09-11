export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || '',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE || '',
  redirectUri: window.location.origin,
  scope: 'openid profile email'
};

export const apiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
};
