/**
 * 🔐 Controlador de Autenticación con Fallback
 * 
 * Controlador que maneja login con Auth0 como método principal
 * y fallback automático a credenciales locales cuando Auth0 no está disponible.
 * 
 * @module fallback-auth-controller
 */

import { Request, Response } from 'express';
import axios from 'axios';
import LocalAuthService from '../../application/services/local-auth.service';

// ========================================
// Interfaces
// ========================================

interface LoginRequest {
  email: string;
  password: string;
}

// ========================================
// Controlador
// ========================================

export class FallbackAuthController {

  /**
   * Login con fallback automático: Auth0 → Credenciales Locales
   * 
   * Flujo:
   * 1. Intenta autenticar con Auth0
   * 2. Si Auth0 está caído o falla → Intenta credenciales locales
   * 3. Si ambos fallan → Error
   * 
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validación de entrada
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son requeridos'
        });
      }

      // ========================================
      // 1️⃣ INTENTO CON AUTH0
      // ========================================
      
      console.log(`🔐 Intentando login con Auth0 para: ${email}`);
      
      const auth0Result = await FallbackAuthController.tryAuth0Login(email, password);

      if (auth0Result.success) {
        console.log(`✅ Login exitoso con Auth0: ${email}`);
        
        return res.status(200).json({
          success: true,
          method: 'auth0',
          token: auth0Result.token,
          user: auth0Result.user,
          message: 'Autenticación exitosa con Auth0'
        });
      }

      // ========================================
      // 2️⃣ FALLBACK A CREDENCIALES LOCALES
      // ========================================
      
      console.warn(`⚠️ Auth0 no disponible o falló para ${email}. Intentando fallback local...`);

      const localResult = await LocalAuthService.tryLocalLogin(email, password);

      if (localResult.success) {
        console.log(`✅ Login exitoso con credenciales locales (fallback): ${email}`);
        
        return res.status(200).json({
          success: true,
          method: 'local-fallback',
          token: localResult.token,
          user: localResult.user,
          requirePasswordChange: localResult.requirePasswordChange,
          warning: 'Autenticado con credenciales locales. Auth0 no está disponible.',
          message: localResult.message
        });
      }

      // ========================================
      // 3️⃣ AMBOS MÉTODOS FALLARON
      // ========================================
      
      console.error(`❌ Login fallido para ${email}: Auth0 y credenciales locales fallaron`);

      return res.status(401).json({
        success: false,
        error: localResult.error || 'Credenciales incorrectas',
        auth0Available: auth0Result.auth0Available
      });

    } catch (error) {
      console.error('❌ Error crítico en login con fallback:', error);
      
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Intenta autenticar con Auth0
   * @param email - Email del usuario
   * @param password - Contraseña
   * @returns Resultado de autenticación Auth0
   */
  private static async tryAuth0Login(email: string, password: string): Promise<any> {
    try {
      const auth0Domain = process.env.AUTH0_DOMAIN;
      const auth0ClientId = process.env.AUTH0_CLIENT_ID;
      const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
      const auth0Audience = process.env.AUTH0_AUDIENCE;

      if (!auth0Domain || !auth0ClientId) {
        console.warn('⚠️ Configuración de Auth0 incompleta. Saltando Auth0...');
        return {
          success: false,
          auth0Available: false,
          error: 'Auth0 no configurado'
        };
      }

      // Llamada a Auth0 OAuth token endpoint
      const response = await axios.post(
        `https://${auth0Domain}/oauth/token`,
        {
          grant_type: 'password',
          username: email,
          password: password,
          client_id: auth0ClientId,
          client_secret: auth0ClientSecret,
          audience: auth0Audience || `https://${auth0Domain}/api/v2/`,
          scope: 'openid profile email'
        },
        {
          timeout: 5000, // Timeout de 5 segundos
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.access_token) {
        // Auth0 login exitoso
        return {
          success: true,
          auth0Available: true,
          token: response.data.access_token,
          user: {
            email,
            // Aquí deberías cargar datos del usuario desde tu BD usando el email
            // o hacer otra llamada a Auth0 para obtener el perfil
          }
        };
      }

      return {
        success: false,
        auth0Available: true,
        error: 'Respuesta inválida de Auth0'
      };

    } catch (error: any) {
      // Detectar tipo de error
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        // Auth0 no disponible (red, DNS, timeout)
        console.error('🚫 Auth0 no está disponible (error de red):', error.message);
        return {
          success: false,
          auth0Available: false,
          error: 'Auth0 no disponible'
        };
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        // Credenciales incorrectas en Auth0
        console.warn('⚠️ Credenciales incorrectas en Auth0');
        return {
          success: false,
          auth0Available: true,
          error: 'Credenciales incorrectas en Auth0'
        };
      }

      // Otro tipo de error - asumir Auth0 no disponible para usar fallback
      console.error('❌ Error desconocido con Auth0:', error.message);
      return {
        success: false,
        auth0Available: false,
        error: 'Error al conectar con Auth0'
      };
    }
  }

  /**
   * Verifica el estado de salud de Auth0
   * GET /api/auth/health/auth0
   */
  static async checkAuth0Health(req: Request, res: Response): Promise<Response> {
    try {
      const auth0Domain = process.env.AUTH0_DOMAIN;
      
      if (!auth0Domain) {
        return res.status(200).json({
          available: false,
          status: 'not-configured',
          message: 'Auth0 no está configurado'
        });
      }

      // Hacer un simple GET al endpoint de test de Auth0
      const response = await axios.get(`https://${auth0Domain}/test`, {
        timeout: 3000
      });

      return res.status(200).json({
        available: true,
        status: 'healthy',
        message: 'Auth0 está disponible',
        responseTime: response.headers['x-response-time'] || 'N/A'
      });

    } catch (error: any) {
      return res.status(200).json({
        available: false,
        status: 'unhealthy',
        message: 'Auth0 no está disponible',
        error: error.message
      });
    }
  }
}

export default FallbackAuthController;
