// ⚠️ CRÍTICO: Cargar variables de entorno ANTES de cualquier importación
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// ==========================================
// ✅ IMPORTAR RUTAS - SCREAMING ARCHITECTURE
// ==========================================
// Las rutas están organizadas por features (dominios de negocio)

// 🔐 FEATURE: Authentication
import authRoutes from './features/authentication/presentation/routes/auth.routes';
import usuariosSistemaRoutes from './features/authentication/presentation/routes/user-system.routes';
import fallbackAuthRoutes from './features/authentication/presentation/routes/fallback-auth.routes';

// 👥 FEATURE: Personnel Management
import agroManoTrabajadoresRoutes from './features/personnel-management/presentation/routes/employee.routes';

// ⏰ FEATURE: Attendance Tracking
import agroManoAsistenciaRoutes from './features/attendance-tracking/presentation/routes/attendance.routes';

// 📊 SHARED: Dashboard & Config
import agroManoDashboardRoutes from './shared/presentation/routes/dashboard.routes';

// 👑 ADMIN: User & Role Management
import userRoleManagementRoutes from './routes/user-role-management';

// 🏖️ ABSENCES: Ausencias/Permisos
import ausenciasRoutes from './routes/ausencias.routes';

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
    } catch (err) {
      const error = err as Error & { code?: string };
      // Manejo suave si la tabla/columna no existe (p. ej. entorno con esquema distinto)
      if (error && (error.code === 'P2022' || error.code === 'P2025')) {
        console.warn('⚠️ Advertencia: tabla o columna ausente al verificar mot_usuario. Omitiendo verificación.');
      } else {
        console.warn('⚠️ Advertencia al verificar tabla mot_usuario:', error instanceof Error ? error.message : String(error));
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
console.log('DATABASE_URL exists:', Boolean(process.env.DATABASE_URL));
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

// ==========================================
// CONFIGURACIÓN DE RUTAS
// ==========================================

// 🔐 Rutas de autenticación con fallback (Auth0 + Local)
app.use('/api/auth', fallbackAuthRoutes);

// Rutas principales de autenticación (legacy - mantener por compatibilidad)
app.use('/api/auth/legacy', authRoutes);

// Rutas AgroMano con RBAC granular
app.use('/api/trabajadores', agroManoTrabajadoresRoutes);
app.use('/api/agromano/asistencia', agroManoAsistenciaRoutes);
app.use('/api/agromano/dashboard', agroManoDashboardRoutes);

// Rutas de usuarios del sistema (híbrido Auth0/BD)
app.use('/api/usuarios-sistema', usuariosSistemaRoutes);

// Rutas de administración de usuarios y roles
app.use('/api/admin', userRoleManagementRoutes);

// Rutas de ausencias/permisos
app.use('/api/ausencias', ausenciasRoutes);

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
app.use((error: Error & { status?: number; stack?: string }, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
