import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

/**
 * @route POST /api/auth/test-token
 * @desc Obtener token de prueba usando Client Credentials
 * @access Público (solo para testing)
 */
router.post('/test-token', async (req: Request, res: Response) => {
  try {
    console.log('🔑 Probando obtener token de Auth0...');
    
    const tokenResponse = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: 'client_credentials'
    });

    console.log('✅ Token obtenido exitosamente');
    
    res.json({
      success: true,
      message: 'Token obtenido exitosamente',
      token: tokenResponse.data.access_token,
      type: tokenResponse.data.token_type,
      expires_in: tokenResponse.data.expires_in,
      instructions: {
        use: 'Copia el token y úsalo en el header Authorization: Bearer <token>',
        test_endpoint: 'GET /api/test/protected-real'
      }
    });

  } catch (error) {
    const err = error as Error & { response?: { data?: unknown } };
    console.error('❌ Error obteniendo token:', err.response?.data || err.message);
    
    res.status(500).json({
      success: false,
      message: 'Error obteniendo token de Auth0',
      error: err.response?.data || err.message,
      debug: {
        domain: process.env.AUTH0_DOMAIN,
        audience: process.env.AUTH0_AUDIENCE,
        client_id: process.env.AUTH0_CLIENT_ID?.substring(0, 8) + '...'
      }
    });
  }
});

/**
 * @route GET /api/auth/config
 * @desc Verificar configuración de Auth0
 * @access Público (solo para testing)
 */
router.get('/config', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Configuración Auth0',
    config: {
      domain: process.env.AUTH0_DOMAIN,
      audience: process.env.AUTH0_AUDIENCE,
      client_id: process.env.AUTH0_CLIENT_ID?.substring(0, 8) + '...',
      has_secret: !!process.env.AUTH0_CLIENT_SECRET,
      issuer_base_url: process.env.AUTH0_ISSUER_BASE_URL
    }
  });
});

export default router;
