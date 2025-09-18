import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de prueba simples (sin Auth0 por ahora)
app.get('/api/test/public', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta pública funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test/protected', (req, res) => {
  res.json({
    success: true,
    message: 'Esta ruta estará protegida con Auth0 pronto',
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
   - GET  /health
   - GET  /api/test/public
   - GET  /api/test/protected
`);
});

export default app;
