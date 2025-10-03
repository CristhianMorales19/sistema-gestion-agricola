// ⚠️ CRÍTICO: Cargar variables de entorno ANTES de cualquier importación
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Importar rutas DESPUÉS de cargar .env
import authRoutes from './routes/auth';
import authTestingRoutes from './routes/auth-testing';
import authTestRoutes from './routes/auth-test';
import agroManoTrabajadoresRoutes from './routes/agromano-trabajadores';
import agroManoAsistenciaRoutes from './routes/agromano-asistencia';
import agroManoDashboardRoutes from './routes/agromano-dashboard';
import dashboardSimpleRoutes from './routes/dashboard-simple';
import debugRoutes from './routes/debug-routes';
import debugPrismaRoutes from './routes/debug-prisma';
import userRoleManagementRoutes from './routes/user-role-management';
import testUserManagementRoutes from './routes/test-user-management';
import usuariosSistemaRoutes from './routes/usuarios-sistema.routes';

// Función de verificación de conexión a BD
async function verificarConexionBD() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    console.log('🔄 Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // Verificar que existe la tabla de usuarios (si la tabla no existe esto lanzará)
    try {
      const usuarios = await prisma.mot_usuario.count();
      console.log(`✅ Tabla usuarios encontrada: ${usuarios} registros`);
    } catch (err: any) {
      // Manejo suave si la tabla/columna no existe (p. ej. entorno con esquema distinto)
      if (err && (err.code === 'P2022' || err.code === 'P2025')) {
        console.warn('⚠️ Advertencia: tabla o columna ausente al verificar mot_usuario. Omitiendo verificación.');
      } else {
        console.warn('⚠️ Advertencia al verificar tabla mot_usuario:', err instanceof Error ? err.message : String(err));
      }
    }

    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.log('❌ Error conectando a la base de datos:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Debug de variables de entorno
console.log('🚀 ===== INICIO DEL SERVIDOR AGROMANO =====');
console.log('🔍 Variables de entorno cargadas:');
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);
console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE);
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? '✅ Configurado' : '❌ Faltante');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL || 'UNDEFINED!');
console.log('PORT:', process.env.PORT || 3000);

// Verificar conexión a BD al inicio
verificarConexionBD();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
// Configurar CORS permitiendo múltiples orígenes desde la variable de entorno
// FRONTEND_URLS (coma-separados) o FRONTEND_URL.
const rawFrontendUrls = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawFrontendUrls.split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS: origin not allowed -> ${origin}. Allowed: ${allowedOrigins.join(',')}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AgroMano API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    auth0Domain: process.env.AUTH0_DOMAIN
  });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/auth', authTestRoutes);
app.use('/api/testing', authTestingRoutes);

// Rutas AgroMano con RBAC granular
app.use('/api/trabajadores', agroManoTrabajadoresRoutes);
app.use('/api/agromano/asistencia', agroManoAsistenciaRoutes);
app.use('/api/agromano/dashboard', agroManoDashboardRoutes);
app.use('/api/dashboard-simple', dashboardSimpleRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/debug-prisma', debugPrismaRoutes);

// Rutas de administración de usuarios y roles
app.use('/api/admin', userRoleManagementRoutes);

// Rutas de usuarios del sistema (híbrido Auth0/BD)
app.use('/api/usuarios-sistema', usuariosSistemaRoutes);

// Rutas de test para gestión de usuarios (SIN AUTENTICACIÓN - SOLO PARA DEVELOPMENT)
app.use('/api/test', testUserManagementRoutes);

// Rutas de prueba simples
app.get('/api/test/public', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta pública funcionando - Test básico',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Manejo global de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error Global:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
🚀 AgroMano API Server iniciado
📡 Puerto: ${PORT}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}
⏰ Timestamp: ${new Date().toISOString()}
🔐 Auth0 Domain: ${process.env.AUTH0_DOMAIN || 'No configurado'}

📋 Endpoints disponibles:
   🟢 GET  /health                                    - Estado del servidor
   🟢 GET  /api/test/public                           - Endpoint público (sin auth)
   🟢 GET  /api/auth/public                           - Endpoint público Auth0
   🔐 GET  /api/auth/protected                        - Requiere token Auth0
   👑 GET  /api/auth/admin                            - Requiere permiso admin:access
   
🎭 Endpoints AgroMano RBAC:
   👥 GET  /api/agromano/trabajadores                 - trabajadores:read:all|own
   👥 POST /api/agromano/trabajadores                 - trabajadores:create
   👥 PUT  /api/agromano/trabajadores/:id             - trabajadores:update:all|own
   👥 DEL  /api/agromano/trabajadores/:id             - trabajadores:delete
   � GET  /api/agromano/trabajadores/export          - trabajadores:export
   📥 POST /api/agromano/trabajadores/import          - trabajadores:import
   
   ⏰ POST /api/agromano/asistencia/marcar            - asistencia:register
   ⏰ GET  /api/agromano/asistencia                   - asistencia:read:all|own
   ✅ PUT  /api/agromano/asistencia/:id/aprobar       - asistencia:approve
   📊 GET  /api/agromano/asistencia/reportes          - asistencia:reports
   📈 GET  /api/agromano/asistencia/dashboard         - asistencia:dashboard
   🙏 POST /api/agromano/asistencia/permisos          - permisos:create
   ✅ PUT  /api/agromano/asistencia/permisos/:id/aprobar - permisos:approve

   📊 GET  /api/agromano/dashboard/general            - dashboard:view:basic|advanced
   📈 GET  /api/agromano/dashboard/stats/tiempo-real  - dashboard:view:basic
   🌤️ GET  /api/agromano/dashboard/clima             - dashboard:view:basic
   
   🧪 GET  /api/dashboard-simple/test                - Solo token Auth0 (debug)
   🔍 GET  /api/debug-prisma/prisma-connection       - Debug conexión Prisma
   👤 GET  /api/debug-prisma/auth0-user-search       - Debug búsqueda usuario Auth0

🔗 Documentación: http://localhost:${PORT}/health
`);
});

export default app;
