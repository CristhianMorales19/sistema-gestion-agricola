import { Router } from 'express';
<<<<<<< HEAD:backend/src/routes/auth.ts
import { checkJwt } from '../config/auth0-simple.config';
import { requirePermission } from '../middleware/auth0';
=======
import { checkJwt } from '../../../../shared/infrastructure/config/auth0-simple.config';
import { requirePermission } from '../../infrastructure/middleware/auth0.middleware';
>>>>>>> origin/main:backend/src/features/authentication/presentation/routes/auth.routes.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = Router();

/**
 * @route GET /api/auth/public
 * @desc Endpoint público para probar
 * @access Público
 */
router.get('/public', (req, res) => {
  res.json({
    success: true,
    message: '🔓 Endpoint público - Sin autenticación requerida',
    info: 'Este endpoint no requiere token de Auth0',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /api/auth/protected  
 * @desc Endpoint que requiere autenticación
 * @access Requiere token válido de Auth0
 */
router.get('/protected', checkJwt, async (req, res) => {
  const user = (req as any).auth || (req as any).user;
  
  console.log('🔍 DEBUG /protected - req.auth:', Boolean((req as any).auth));
  console.log('🔍 DEBUG /protected - req.user:', Boolean((req as any).user));
  
  try {
    // Obtener información adicional del usuario desde Auth0 /userinfo
    let userEmail = user?.email;
    let userName = user?.name;
    
    if (!userEmail && user?.sub) {
      console.log('� Email no encontrado en token, obteniendo desde Auth0 /userinfo...');
      
      // Obtener token del header
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        const userInfoResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          console.log('✅ Información obtenida de Auth0:', userInfo);
          
          userEmail = userInfo.email;
          userName = userInfo.name || userInfo.nickname || userInfo.given_name;
        } else {
          console.log('⚠️ No se pudo obtener userinfo de Auth0:', userInfoResponse.status);
        }
      }
    }
    
    res.json({
      success: true,
      message: '🔐 Acceso autorizado - Token válido',
      user: {
        sub: user?.sub || 'No disponible',
        email: userEmail || 'Email no disponible',
        name: userName || 'Usuario',
        permissions: user?.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en /protected:', error);
    res.json({
      success: true,
      message: '🔐 Acceso autorizado - Token válido (sin email)',
      user: {
        sub: user?.sub || 'No disponible',
        email: 'Error obteniendo email',
        name: 'Usuario',
        permissions: user?.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/auth/admin
 * @desc Endpoint que requiere permisos de administrador
 * @access Requiere token + permiso 'admin:access'
 */
router.get('/admin', 
  checkJwt,
  requirePermission('admin:access'),
  (req, res) => {
    const user = (req as any).auth || (req as any).user;
    
    res.json({
      success: true,
      message: '👑 Acceso de administrador autorizado',
      user: {
        sub: user?.sub || 'No disponible',
        email: user?.email || 'No disponible',
        permissions: user?.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * @route GET /api/auth/trabajadores
 * @desc Endpoint que requiere permisos específicos de trabajadores
 * @access Requiere token + permiso 'trabajadores:read'
 */
router.get('/trabajadores',
  checkJwt,
  requirePermission('trabajadores:read'),
  (req, res) => {
    const user = (req as any).auth || (req as any).user;
    
    res.json({
      success: true,
      message: '👥 Acceso a trabajadores autorizado',
      data: {
        message: 'Aquí irían los datos de trabajadores',
        note: 'Este endpoint está protegido con RBAC'
      },
      user: {
        sub: user?.sub || 'No disponible',
        email: user?.email || 'No disponible',
        permissions: user?.permissions || []
      },
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * @route GET /api/auth/test-permissions
 * @desc Endpoint para probar diferentes permisos
 * @access Requiere token válido
 */
router.get('/test-permissions', checkJwt, (req, res) => {
  const user = (req as any).auth || (req as any).user;
  const userPermissions = user?.permissions || [];
  
  res.json({
    success: true,
    message: '🔍 Análisis de permisos del usuario',
    user: {
      sub: user?.sub || 'No disponible',
      email: user?.email || 'No disponible',
      permissions: userPermissions
    },
    permissionChecks: {
      'admin:access': userPermissions.includes('admin:access'),
      'trabajadores:read': userPermissions.includes('trabajadores:read'),
      'trabajadores:create': userPermissions.includes('trabajadores:create'),
      'asistencia:register': userPermissions.includes('asistencia:register'),
      'nomina:process': userPermissions.includes('nomina:process')
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/auth/login
 * Body: { usernameOrEmail, password }
 * Returns: { success, token }
 */
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'usernameOrEmail and password required' });
    }

    // Buscar usuario por username o email
    const usuario = await prisma.mot_usuario.findFirst({
      where: {
        username: usernameOrEmail,
        OR: [
          { estado: 'ACTIVO' },
          { estado: 'activo' }
        ]
      }
    });

    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

<<<<<<< HEAD:backend/src/routes/auth.ts
=======
    // Validar que el usuario tenga contraseña configurada
    if (!usuario.password_hash) {
      return res.status(401).json({ 
        success: false, 
        message: 'User has no local password configured. Please use Auth0 login or contact administrator.' 
      });
    }

>>>>>>> origin/main:backend/src/features/authentication/presentation/routes/auth.routes.ts
    const passwordMatches = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Firmar token con la clave del servidor (HS256)
    const serverSecret = process.env.SERVER_JWT_SECRET;
    if (!serverSecret) {
      return res.status(500).json({ success: false, message: 'Server JWT secret not configured' });
    }

    const payload = {
      sub: usuario.username,
      usuario_id: usuario.usuario_id,
      permissions: [] // opcional: cargar permisos desde BD si quieres
    };

    const token = jwt.sign(payload, serverSecret, { algorithm: 'HS256', expiresIn: '8h' });

    res.json({ success: true, token });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
