"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuth0Config = exports.checkJwt = exports.auth0Config = void 0;
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configuración de Auth0
exports.auth0Config = {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: process.env.AUTH0_SCOPE || 'openid profile email'
};
// Middleware para verificar JWT de Auth0
exports.checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${exports.auth0Config.domain}/.well-known/jwks.json`
    }),
    audience: exports.auth0Config.audience,
    issuer: `https://${exports.auth0Config.domain}/`,
    algorithms: ['RS256']
});
// Validar configuración requerida
const validateAuth0Config = () => {
    const requiredVars = ['AUTH0_DOMAIN', 'AUTH0_AUDIENCE', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET'];
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
    console.log('✅ Auth0 configuration validated successfully');
};
exports.validateAuth0Config = validateAuth0Config;
