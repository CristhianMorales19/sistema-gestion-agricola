import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../../shared/utils/logger';

const prisma = new PrismaClient();

interface LoginCredentials {
  email: string;
  password: string;
}

interface JWTPayload {
  id: number;
  email: string;
  rol: string;
}

// Set para almacenar tokens invalidados (en producción usar Redis)
const invalidatedTokens = new Set<string>();

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

  async login(credentials: LoginCredentials) {
    try {
      const { email, password } = credentials;

      // Buscar usuario por email
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
          empleado: {
            include: {
              cargo: true,
              departamento: true
            }
          }
        }
      });

      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      if (!usuario.activo) {
        throw new Error('Su cuenta ha sido desactivada. Contacte al administrador');
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        throw new Error('Credenciales inválidas');
      }

      // Generar JWT
      const payload: JWTPayload = {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      };

      const token = jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN
      } as jwt.SignOptions);

      // Actualizar último acceso
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { ultimoAcceso: new Date() }
      });

      logger.info(`Usuario ${email} ha iniciado sesión exitosamente`);

      return {
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          empleado: usuario.empleado
        }
      };

    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }

  async logout(token: string) {
    try {
      // Invalidar el token agregándolo a la lista negra
      invalidatedTokens.add(token);
      
      logger.info('Usuario ha cerrado sesión exitosamente');
      
      return { message: 'Logout exitoso' };
    } catch (error) {
      logger.error('Error en logout:', error);
      throw error;
    }
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      // Verificar si el token está invalidado
      if (invalidatedTokens.has(token)) {
        return null;
      }

      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      logger.error('Error verificando token:', error);
      return null;
    }
  }

  isTokenInvalidated(token: string): boolean {
    return invalidatedTokens.has(token);
  }
}