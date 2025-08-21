import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { CustomError } from '../../../shared/middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

const authService = new AuthService();

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const error: CustomError = new Error('Token de acceso requerido');
      error.status = 401;
      return next(error);
    }

    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      const error: CustomError = new Error('Token inválido o expirado');
      error.status = 401;
      return next(error);
    }

    req.user = decoded;
    next();
  } catch (error) {
    const customError: CustomError = new Error('Error de autenticación');
    customError.status = 401;
    next(customError);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error: CustomError = new Error('No autorizado');
      error.status = 401;
      return next(error);
    }

    if (!roles.includes(req.user.rol)) {
      const error: CustomError = new Error('Acceso denegado - Rol insuficiente');
      error.status = 403;
      return next(error);
    }

    next();
  };
};