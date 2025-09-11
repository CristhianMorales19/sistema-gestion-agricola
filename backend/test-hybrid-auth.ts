import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware para simular Auth0 token
const simulateAuth0Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Simular diferentes usuarios de Auth0
  const testUsers = {
    'admin': {
      sub: 'auth0|admin123',
      email: 'admin@agromano.com',
      permissions: ['read:users'] // Permisos de Auth0 (no los usaremos)
    },
    'supervisor': {
      sub: 'auth0|supervisor123', 
      email: 'supervisor.campo@agromano.com',
      permissions: ['read:users']
    },
    'gerente': {
      sub: 'auth0|gerente123',
      email: 'gerente.rrhh@agromano.com', 
      permissions: ['read:users']
    }
  };

  // Obtener usuario de query param (?user=admin)
  const userType = (req.query.user as string) || 'admin';
  const userData = testUsers[userType as keyof typeof testUsers];

  if (!userData) {
    return res.status(400).json({ error: 'Usuario de prueba no válido. Usa: ?user=admin|supervisor|gerente' });
  }

  // Simular token decodificado de Auth0
  (req as any).auth = userData;
  
  console.log(`🎭 Simulando token Auth0 para: ${userData.email}`);
  next();
};

// Middleware híbrido (versión simplificada para pruebas)
const hybridAuthMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const userEmail = (req as any).auth.email;
    console.log(`🔍 Buscando usuario en BD: ${userEmail}`);

    // 1. Buscar usuario en BD local
    const user = await prisma.mot_usuario.findFirst({
      where: {
        username: userEmail,
        estado: 'activo'
      }
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Usuario no autorizado en el sistema',
        email: userEmail
      });
    }

    console.log(`✅ Usuario encontrado: ID ${user.usuario_id}`);

    // 2. Obtener rol
    const rol = await prisma.mom_rol.findUnique({
      where: {
        rol_id: user.rol_id
      }
    });

    if (!rol) {
      return res.status(403).json({
        success: false,
        message: 'Rol de usuario no encontrado'
      });
    }

    console.log(`👑 Rol asignado: ${rol.codigo} - ${rol.nombre}`);

    // 3. Obtener permisos REALES desde la base de datos
    const rolPermisosQuery = await prisma.$queryRaw`
      SELECT p.codigo as permiso_codigo, p.nombre as permiso_nombre
      FROM rel_mom_rol__mom_permiso rp
      INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
      WHERE rp.rol_id = ${user.rol_id}
      AND rp.deleted_at IS NULL
      AND p.is_activo = 1
      LIMIT 10
    `;

    const permissions = (rolPermisosQuery as any[]).map(item => item.permiso_codigo);

    console.log(`🔐 Permisos cargados: ${permissions.length} permisos`);
    console.log(`📋 Algunos permisos: ${permissions.slice(0, 5).join(', ')}`);

    // 4. Crear objeto user con datos REALES de BD
    (req as any).user = {
      id: user.usuario_id,
      username: user.username,
      email: userEmail,
      role: rol.codigo,
      permissions: permissions,
      trabajador_id: user.trabajador_id,
      rol_id: user.rol_id,
      // Datos de Auth0
      auth0_sub: (req as any).auth.sub,
      auth0_email: userEmail
    };

    console.log(`🎉 Usuario autenticado exitosamente: ${user.username} | Rol: ${rol.codigo}`);
    next();

  } catch (error) {
    console.error('❌ Error en middleware híbrido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Ruta de prueba protegida
app.get('/api/test-auth', simulateAuth0Middleware, hybridAuthMiddleware, (req, res) => {
  const user = (req as any).user;
  
  res.json({
    success: true,
    message: '🎉 Autenticación híbrida exitosa',
    user: {
      email: user.email,
      role: user.role,
      permissions_count: user.permissions.length,
      first_5_permissions: user.permissions.slice(0, 5),
      auth0_sub: user.auth0_sub,
      trabajador_id: user.trabajador_id
    }
  });
});

// Ruta de información
app.get('/api/info', (req, res) => {
  res.json({
    message: '🧪 Servidor de prueba - Middleware híbrido Auth0 + MySQL',
    endpoints: {
      '/api/test-auth?user=admin': 'Probar admin@agromano.com',
      '/api/test-auth?user=supervisor': 'Probar supervisor.campo@agromano.com', 
      '/api/test-auth?user=gerente': 'Probar gerente.rrhh@agromano.com'
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba Auth0 híbrido iniciado en puerto ${PORT}`);
  console.log(`📝 Prueba los endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/info`);
  console.log(`   GET http://localhost:${PORT}/api/test-auth?user=admin`);
  console.log(`   GET http://localhost:${PORT}/api/test-auth?user=supervisor`);
  console.log(`   GET http://localhost:${PORT}/api/test-auth?user=gerente`);
});

// Manejar cierre limpio
process.on('SIGINT', async () => {
  console.log('🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});
