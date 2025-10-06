"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flexibleAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const util_1 = require("util");
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;
const serverSecret = process.env.SERVER_JWT_SECRET;
if (!auth0Domain || !auth0Audience) {
    console.warn('⚠️ AUTH0 variables not set, Auth0 verification will be skipped');
}
if (!serverSecret) {
    console.warn('⚠️ SERVER_JWT_SECRET not set — local DB login tokens will be disabled');
}
const client = auth0Domain ? (0, jwks_rsa_1.default)({ jwksUri: `https://${auth0Domain}/.well-known/jwks.json` }) : null;
async function verifyAuth0Token(token) {
    if (!client)
        throw new Error('Auth0 client not configured');
    const decodedHeader = jsonwebtoken_1.default.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header)
        throw new Error('Invalid token header');
    const kid = decodedHeader.header.kid;
    const getSigningKey = (0, util_1.promisify)(client.getSigningKey);
    const key = await getSigningKey(kid);
    const pub = key.getPublicKey ? key.getPublicKey() : (key.publicKey || key.rsaPublicKey);
    if (!pub)
        throw new Error('Unable to retrieve public key');
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, pub, { audience: auth0Audience, issuer: `https://${auth0Domain}/`, algorithms: ['RS256'] }, (err, decoded) => {
            if (err)
                return reject(err);
            resolve(decoded);
        });
    });
}
const flexibleAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No authorization token provided' });
        }
        const token = authHeader.replace('Bearer ', '').trim();
        // 1) Try server-signed token (HS256)
        if (serverSecret) {
            try {
                const payload = jsonwebtoken_1.default.verify(token, serverSecret, { algorithms: ['HS256'] });
                // Normalize to shape expected by downstream middleware
                req.auth = payload;
                return next();
            }
            catch (e) {
                // continue to try Auth0
            }
        }
        // 2) Try Auth0 token (RS256 via JWKS)
        if (auth0Domain && auth0Audience) {
            try {
                const payload = await verifyAuth0Token(token);
                req.auth = payload;
                return next();
            }
            catch (err) {
                const e = err;
                console.warn('Auth0 verification failed:', e?.message || e);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
        }
        return res.status(401).json({ success: false, message: 'No valid authentication method configured' });
    }
    catch (error) {
        const err = error;
        console.error('Error en flexibleAuth:', err);
        return res.status(500).json({ success: false, message: 'Internal auth error' });
    }
};
exports.flexibleAuth = flexibleAuth;
exports.default = { flexibleAuth: exports.flexibleAuth };
