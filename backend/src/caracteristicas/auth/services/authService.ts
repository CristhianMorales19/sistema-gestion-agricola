import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../../../shared/utils/logger';

interface LoginCredentials {
  email: string;
  password: string;
}

interface JWTPayload {
  id: number;
  email: string;
  rol: string;
}

interface User {
  id: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'SUPERVISOR' | 'EMPLEADO';
  activo: boolean;
}

// Mock users for testing (in production this would come from the database)
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@gestionagricola.com',
    password: '$2a$12$b8l72NCxSns4SbyoLGdkbODGN24XcfloKhBkh1znlXSDPA3Yfmy2G', // admin123
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: 'ADMIN',
    activo: true
  },
  {
    id: 2,
    email: 'supervisor@gestionagricola.com',
    password: '$2a$12$b8l72NCxSns4SbyoLGdkbODGN24XcfloKhBkh1znlXSDPA3Yfmy2G', // supervisor123
    nombre: 'Juan Carlos',
    apellido: 'Supervisor',
    rol: 'SUPERVISOR',
    activo: true
  }
];

// Set para almacenar tokens invalidados (en producción usar Redis)
const invalidatedTokens = new Set<string>();

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

  async login(credentials: LoginCredentials) {
    try {
      const { email, password } = credentials;

      // Buscar usuario en mock data
      const usuario = mockUsers.find(u => u.email === email);

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

      logger.info(`Usuario ${email} ha iniciado sesión exitosamente`);

      return {
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          empleado: {
            cedula: '12345678',
            cargo: { nombre: usuario.rol === 'ADMIN' ? 'Gerente General' : 'Supervisor' },
            departamento: { nombre: 'Administración' },
            fechaIngreso: '2020-01-15'
          }
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