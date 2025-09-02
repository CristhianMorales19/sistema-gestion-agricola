import { Router } from 'express';

const router = Router();

/**
 * @route GET /api/test/public
 * @desc Ruta pública de prueba
 * @access Público
 */
router.get('/public', (req, res) => {
  res.json({
    success: true,
    message: '🎉 AgroMano API funcionando correctamente',
    timestamp: new Date().toISOString(),
    auth0_domain: process.env.AUTH0_DOMAIN,
    server_status: 'OK'
  });
});

/**
 * @route GET /api/test/config
 * @desc Verificar configuración Auth0 (sin datos sensibles)
 * @access Público
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    message: 'Configuración Auth0 verificada',
    config: {
      domain: process.env.AUTH0_DOMAIN ? '✅ Configurado' : '❌ Falta configurar',
      audience: process.env.AUTH0_AUDIENCE ? '✅ Configurado' : '❌ Falta configurar',
      client_id: process.env.AUTH0_CLIENT_ID ? '✅ Configurado' : '❌ Falta configurar',
      client_secret: process.env.AUTH0_CLIENT_SECRET ? '✅ Configurado' : '❌ Falta configurar'
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /api/test/database
 * @desc Probar conexión a base de datos
 * @access Público
 */
router.get('/database', async (req, res) => {
  try {
    // Importar Prisma solo cuando se necesite
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Probar conexión simple
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    await prisma.$disconnect();
    
    res.json({
      success: true,
      message: '✅ Conexión a base de datos exitosa',
      database: process.env.DB_NAME,
      test_result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: '❌ Error de conexión a base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /api/test/env
 * @desc Verificar variables de entorno (sin mostrar valores sensibles)
 * @access Público
 */
router.get('/env', (req, res) => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'AUTH0_DOMAIN', 
    'AUTH0_AUDIENCE',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'PORT'
  ];

  const envStatus = requiredEnvVars.reduce((acc: any, envVar) => {
    acc[envVar] = process.env[envVar] ? '✅ Configurado' : '❌ Falta';
    return acc;
  }, {});

  const allConfigured = Object.values(envStatus).every(status => String(status).includes('✅'));

  res.json({
    success: allConfigured,
    message: allConfigured ? 
      '🎉 Todas las variables de entorno configuradas' : 
      '⚠️ Algunas variables de entorno faltan',
    environment_variables: envStatus,
    timestamp: new Date().toISOString()
  });
});

export default router;
