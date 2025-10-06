Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = exports.auth0Config = void 0;
// Configuración de Auth0 para el frontend
exports.auth0Config = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-agromano.us.auth0.com',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'YourAuth0ClientId',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://api.agromano.com',
    redirectUri: window.location.origin + '/callback',
    logoutUri: window.location.origin,
    scope: 'openid profile email'
};
// URL base del API backend
exports.apiConfig = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 10000
};
exports.default = {
    auth0: exports.auth0Config,
    api: exports.apiConfig
};
