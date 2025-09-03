import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth';
import authTestingRoutes from './routes/auth-testing';
import authTestRoutes from './routes/auth-test';
import agroManoTrabajadoresRoutes from './routes/agromano-trabajadores';
import agroManoAsistenciaRoutes from './routes/agromano-asistencia';

// Cargar variables de entorno PRIMERO
dotenv.config();

// Debug de variables de entorno
console.log('🔍 Variables de entorno cargadas:');
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);
console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
app.use('/api/agromano/trabajadores', agroManoTrabajadoresRoutes);
app.use('/api/agromano/asistencia', agroManoAsistenciaRoutes);

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

🔗 Documentación: http://localhost:${PORT}/health
`);
});

export default app;
