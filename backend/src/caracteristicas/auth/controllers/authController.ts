import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { logger } from '../../../shared/utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email y contraseña son requeridos'
        });
      }

      const result = await authService.login({ email, password });
      
      res.status(200).json({
        message: 'Login exitoso',
        data: result
      });

    } catch (error: any) {
      if (error.message === 'Credenciales inválidas' || 
          error.message.includes('Su cuenta ha sido desactivada')) {
        return res.status(401).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          error: 'Token requerido para logout'
        });
      }

      await authService.logout(token);
      
      res.status(200).json({
        message: 'Logout exitoso'
      });

    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: 'Token requerido'
        });
      }

      const decoded = authService.verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({
          error: 'Token inválido o expirado'
        });
      }

      res.status(200).json({
        message: 'Token válido',
        user: decoded
      });

    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // El middleware de autenticación ya verificó el token y agregó el usuario
      res.status(200).json({
        message: 'Usuario autenticado',
        user: req.user
      });

    } catch (error) {
      next(error);
    }
  }
}