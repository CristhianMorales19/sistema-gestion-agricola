import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { promisify } from 'util';

const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;
const serverSecret = process.env.SERVER_JWT_SECRET;

if (!auth0Domain || !auth0Audience) {
  console.warn('⚠️ AUTH0 variables not set, Auth0 verification will be skipped');
}

if (!serverSecret) {
  console.warn('⚠️ SERVER_JWT_SECRET not set — local DB login tokens will be disabled');
}

const client = auth0Domain ? jwksClient({ jwksUri: `https://${auth0Domain}/.well-known/jwks.json` }) : null;

async function verifyAuth0Token(token: string): Promise<any> {
  if (!client) throw new Error('Auth0 client not configured');
  const decodedHeader: any = jwt.decode(token, { complete: true }) as any;
  if (!decodedHeader || !decodedHeader.header) throw new Error('Invalid token header');
  const kid = decodedHeader.header.kid;
  const getSigningKey = promisify(client.getSigningKey) as any;
  const key = await getSigningKey(kid);
  const pub = key.getPublicKey ? key.getPublicKey() : key.publicKey;
  return new Promise((resolve, reject) => {
    jwt.verify(token, pub, { audience: auth0Audience, issuer: `https://${auth0Domain}/`, algorithms: ['RS256'] }, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

export const flexibleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // 1) Try server-signed token (HS256)
    if (serverSecret) {
      try {
        const payload = jwt.verify(token, serverSecret, { algorithms: ['HS256'] }) as any;
        // Normalize to shape expected by downstream middleware
        (req as any).auth = payload;
        return next();
      } catch (e) {
        // continue to try Auth0
      }
    }

    // 2) Try Auth0 token (RS256 via JWKS)
    if (auth0Domain && auth0Audience) {
      try {
        const payload = await verifyAuth0Token(token);
        (req as any).auth = payload;
        return next();
      } catch (err: unknown) {
        const e: any = err;
        console.warn('Auth0 verification failed:', e?.message || e);
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
    }

    return res.status(401).json({ success: false, message: 'No valid authentication method configured' });
  } catch (error: any) {
    console.error('Error en flexibleAuth:', error);
    return res.status(500).json({ success: false, message: 'Internal auth error' });
  }
};

export default { flexibleAuth };
