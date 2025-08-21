import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './caracteristicas/auth/routes';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Mock database - simple in-memory storage for testing
export const mockUsers = [
  {
    id: 1,
    email: 'admin@gestionagricola.com',
    password: '$2a$12$PKtEw1KROjuoENTPo7poJ.TUWrA12qX/Rg4vlXOYAOuOxFzy6KYna', // admin123
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: 'ADMIN' as const,
    activo: true
  },
  {
    id: 2,
    email: 'supervisor@gestionagricola.com',
    password: '$2a$12$9d8vkwGQ5c3P.NzsJClvg.H8i0eh4ULkCW68sjz/VHgKl2FwHGsuW', // supervisor123
    nombre: 'Juan Carlos',
    apellido: 'Supervisor',
    rol: 'SUPERVISOR' as const,
    activo: true
  }
];

// Mock prisma client for testing
export const prisma = {
  usuario: {
    findUnique: async ({ where }: any) => {
      const user = mockUsers.find(u => u.email === where.email);
      return user || null;
    },
    update: async ({ where, data }: any) => {
      const userIndex = mockUsers.findIndex(u => u.id === where.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        return mockUsers[userIndex];
      }
      return null;
    }
  }
};

// Middleware de seguridad
app.use(helmet());

// Configurar CORS
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:8000', // Para la demo
    'http://localhost:3001'  // Para pruebas locales
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // límite de 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en unos minutos.'
});
app.use(limiter);

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);

// Ruta de salud del sistema
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Sistema Gestión Agrícola API'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo global de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
  console.log(`👤 Usuario de prueba: admin@gestionagricola.com / admin123`);
});

export default app;