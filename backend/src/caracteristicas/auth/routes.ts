import express from 'express';
import { login, logout } from './controller';

const router = express.Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/logout', logout);

export default router;