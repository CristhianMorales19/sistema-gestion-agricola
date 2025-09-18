"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUser = exports.checkJwt = void 0;
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
// Verificar variables de entorno antes de configurar Auth0
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;
console.log('🔍 DEBUG AUTH0 CONFIG:');
console.log('AUTH0_DOMAIN:', auth0Domain || 'UNDEFINED');
console.log('AUTH0_AUDIENCE:', auth0Audience || 'UNDEFINED');
console.log('JWKS URI:', `https://${auth0Domain}/.well-known/jwks.json`);
if (!auth0Domain || !auth0Audience) {
    throw new Error(`Variables de entorno Auth0 faltantes: DOMAIN=${auth0Domain}, AUDIENCE=${auth0Audience}`);
}
// Configuración del middleware JWT para Auth0
exports.checkJwt = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
    }),
    audience: auth0Audience,
    issuer: `https://${auth0Domain}/`,
    algorithms: ['RS256']
});
// Middleware para asignar datos del token JWT a req.user
const setUser = (req, res, next) => {
    // Intentar obtener permisos desde diferentes fuentes
    let permissions = [];
    if (req.auth?.permissions) {
        permissions = req.auth.permissions;
    }
    else if (req.auth0User?.permissions) {
        permissions = req.auth0User.permissions;
    }
    else if (req.userPermissions) {
        permissions = req.userPermissions;
    }
    // Asignar al objeto user
    req.user = {
        permissions: permissions
    };
    next();
};
exports.setUser = setUser;
exports.default = { checkJwt: exports.checkJwt };
