import { Router } from 'express';
import { AuthController } from './controllers/authController';
import { authenticateToken } from './middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post('/login', authController.login.bind(authController));

// Rutas protegidas
router.post('/logout', authenticateToken, authController.logout.bind(authController));
router.get('/verify', authController.verifyToken.bind(authController));
router.get('/me', authenticateToken, authController.me.bind(authController));

export { router as authRoutes };