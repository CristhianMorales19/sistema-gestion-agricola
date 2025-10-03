import { Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * @route POST /api/auth/test-token
 * @desc Obtener token de Auth0 para pruebas (Machine to Machine)
 * @access Público (solo para testing)
 */
router.post('/test-token', async (req, res) => {
  try {
    const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } = process.env;

    if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET || !AUTH0_AUDIENCE) {
      return res.status(500).json({
        success: false,
        message: 'Configuración Auth0 incompleta',
        missing: {
          domain: !AUTH0_DOMAIN,
          clientId: !AUTH0_CLIENT_ID, 
          clientSecret: !AUTH0_CLIENT_SECRET,
          audience: !AUTH0_AUDIENCE
        }
      });
    }

    // Obtener token M2M de Auth0
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
      grant_type: 'client_credentials'
    });

    const { access_token, expires_in, token_type } = response.data;

    res.json({
      success: true,
      message: 'Token obtenido exitosamente',
      data: {
        access_token,
        token_type,
        expires_in,
        expires_at: new Date(Date.now() + expires_in * 1000).toISOString()
      },
      instructions: {
        usage: `curl -H "Authorization: Bearer ${access_token}" http://localhost:3000/api/auth/protected`,
        note: 'Este token expira automáticamente'
      }
    });

  } catch (error) {
    const err = error as Error & { response?: { data?: unknown } };
    console.error('Error obteniendo token Auth0:', err.response?.data || err.message);
    
    res.status(500).json({
      success: false,
      message: 'Error obteniendo token de Auth0',
      error: err.response?.data || err.message,
      troubleshooting: [
        'Verificar credenciales Auth0 en .env',
        'Verificar que la API esté creada en Auth0',
        'Verificar que la aplicación tenga permisos'
      ]
    });
  }
});

/**
 * @route GET /api/auth/verify-setup
 * @desc Verificar configuración de Auth0
 * @access Público
 */
router.get('/verify-setup', (req, res) => {
  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } = process.env;

  res.json({
    success: true,
    message: 'Estado de configuración Auth0',
    config: {
      domain: AUTH0_DOMAIN ? `✅ ${AUTH0_DOMAIN}` : '❌ No configurado',
      clientId: AUTH0_CLIENT_ID ? `✅ ${AUTH0_CLIENT_ID.substring(0, 8)}...` : '❌ No configurado',
      clientSecret: AUTH0_CLIENT_SECRET ? '✅ Configurado' : '❌ No configurado',
      audience: AUTH0_AUDIENCE ? `✅ ${AUTH0_AUDIENCE}` : '❌ No configurado'
    },
    ready: !!(AUTH0_DOMAIN && AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_AUDIENCE),
    nextSteps: [
      'POST /api/auth/test-token - Obtener token de prueba',
      'Usar token para probar endpoints protegidos'
    ]
  });
});

export default router;
