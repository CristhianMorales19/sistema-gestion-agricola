import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './caracteristicas/auth/routes';
import { errorHandler } from './shared/middleware/errorHandler';
import { logger } from './shared/utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana por IP
});
app.use(limiter);

// Middleware para parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en puerto ${PORT}`);
});

export default app;