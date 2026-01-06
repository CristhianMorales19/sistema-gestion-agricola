/**
 * 🔐 Servicio de Autenticación Local
 * 
 * Servicio para autenticación con credenciales locales como fallback cuando Auth0 no está disponible.
 * Implementa login local, gestión de contraseñas y bloqueo de cuentas por seguridad.
 * 
 * @module local-auth-service
 */

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import {
  hashPassword,
  comparePassword,
  validatePasswordComplexity,
  isPasswordExpired,
  isAccountLocked,
  calculateLockoutExpiry,
  shouldLockAccount,
  generateTemporaryPassword,
  isPasswordDifferent,
  PasswordValidationResult
} from '../../../../shared/utils/password.utils';

const prisma = new PrismaClient();

// ========================================
// Interfaces
// ========================================

export interface LocalLoginResult {
  success: boolean;
  token?: string;
  user?: any;
  requirePasswordChange?: boolean;
  message?: string;
  error?: string;
}

export interface SetPasswordResult {
  success: boolean;
  requirePasswordChange?: boolean;
  message?: string;
  error?: string;
}

export interface PasswordChangeResult {
  success: boolean;
  message?: string;
  error?: string;
}

// ========================================
// Servicio de Autenticación Local
// ========================================

export class LocalAuthService {
  
  /**
   * Intenta autenticar un usuario con credenciales locales
   * @param email - Email del usuario
   * @param password - Contraseña en texto plano
   * @returns Resultado del login con token JWT si es exitoso
   */
  static async tryLocalLogin(email: string, password: string): Promise<LocalLoginResult> {
    try {
      // 1. Buscar usuario por email
      const user = await prisma.mot_usuario.findFirst({
        where: {
          email,
          deleted_at: null,
          estado: 'activo'
        },
        include: {
          mom_rol: {
            include: {
              rel_mom_rol__mom_permiso: {
                include: {
                  mom_permiso: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // 2. Verificar que la autenticación local esté habilitada
      if (!user.local_auth_enabled) {
        return {
          success: false,
          error: 'La autenticación local no está habilitada para este usuario'
        };
      }

      // 3. Verificar si la cuenta está bloqueada
      if (isAccountLocked(user.account_locked_until)) {
        const unlockTime = user.account_locked_until?.toLocaleString();
        return {
          success: false,
          error: `Cuenta bloqueada temporalmente hasta ${unlockTime}. Intenta más tarde.`
        };
      }

      // 4. Verificar que tiene contraseña configurada
      if (!user.password_hash) {
        return {
          success: false,
          error: 'No hay contraseña local configurada para este usuario'
        };
      }

      // 5. Comparar contraseña
      const passwordMatches = await comparePassword(password, user.password_hash);

      if (!passwordMatches) {
        // Incrementar intentos fallidos
        await this.incrementFailedAttempts(user.usuario_id);
        
        // Registrar intento fallido en auditoría
        await this.logAuthAttempt(user.usuario_id, email, 'local', false, 'Contraseña incorrecta');

        return {
          success: false,
          error: 'Credenciales incorrectas'
        };
      }

      // 6. Login exitoso - Verificar si necesita cambiar contraseña
      const needsPasswordChange = user.require_password_change || 
                                  isPasswordExpired(user.password_changed_at, user.password_expires_at);

      // 7. Actualizar last_login y resetear intentos fallidos
      await prisma.mot_usuario.update({
        where: { usuario_id: user.usuario_id },
        data: {
          last_login_at: new Date(),
          last_auth_method: 'local',
          failed_login_attempts: 0,
          account_locked_until: null
        }
      });

      // 8. Registrar login exitoso en auditoría
      await this.logAuthAttempt(user.usuario_id, email, 'local', true);

      // 9. Generar token JWT
      const token = this.generateJwtToken(user);

      // 10. Construir objeto de usuario
      const userResponse = {
        usuario_id: user.usuario_id,
        email: user.email,
        username: user.username,
        rol: user.mom_rol.descripcion,
        rol_id: user.rol_id,
        permisos: user.mom_rol.rel_mom_rol__mom_permiso.map((rp: any) => rp.mom_permiso.nombre)
      };

      return {
        success: true,
        token,
        user: userResponse,
        requirePasswordChange: needsPasswordChange,
        message: needsPasswordChange 
          ? 'Login exitoso. Debes cambiar tu contraseña.' 
          : 'Login exitoso con credenciales locales'
      };

    } catch (error) {
      console.error('❌ Error en tryLocalLogin:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  /**
   * Establece una contraseña local para un usuario
   * @param userId - ID del usuario
   * @param newPassword - Nueva contraseña
   * @param requireChange - Si debe forzar cambio en próximo login
   * @returns Resultado de la operación
   */
  static async setLocalPassword(
    userId: number,
    newPassword: string,
    requireChange: boolean = false
  ): Promise<SetPasswordResult> {
    try {
      // 1. Validar complejidad de contraseña
      const validation = validatePasswordComplexity(newPassword);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // 2. Obtener usuario actual
      const user = await prisma.mot_usuario.findUnique({
        where: { usuario_id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // 3. Verificar que sea diferente a la anterior
      if (user.password_hash) {
        const isDifferent = await isPasswordDifferent(newPassword, user.password_hash);
        if (!isDifferent) {
          return {
            success: false,
            error: 'La nueva contraseña debe ser diferente a la anterior'
          };
        }
      }

      // 4. Generar hash
      const { hash, hashedAt, expiresAt } = await hashPassword(newPassword);

      // 5. Actualizar en base de datos
      await prisma.mot_usuario.update({
        where: { usuario_id: userId },
        data: {
          password_hash: hash,
          password_changed_at: hashedAt,
          password_expires_at: expiresAt,
          require_password_change: requireChange,
          local_auth_enabled: true,
          failed_login_attempts: 0,
          account_locked_until: null
        }
      });

      return {
        success: true,
        requirePasswordChange: requireChange,
        message: 'Contraseña local establecida correctamente'
      };

    } catch (error) {
      console.error('❌ Error en setLocalPassword:', error);
      return {
        success: false,
        error: 'Error al establecer contraseña'
      };
    }
  }

  /**
   * Cambia la contraseña de un usuario verificando la anterior
   * @param userId - ID del usuario
   * @param oldPassword - Contraseña actual
   * @param newPassword - Nueva contraseña
   * @returns Resultado del cambio
   */
  static async changeLocalPassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<PasswordChangeResult> {
    try {
      // 1. Obtener usuario
      const user = await prisma.mot_usuario.findUnique({
        where: { usuario_id: userId }
      });

      if (!user || !user.password_hash) {
        return {
          success: false,
          error: 'Usuario no encontrado o sin contraseña configurada'
        };
      }

      // 2. Verificar contraseña actual
      const oldPasswordMatches = await comparePassword(oldPassword, user.password_hash);
      
      if (!oldPasswordMatches) {
        return {
          success: false,
          error: 'La contraseña actual es incorrecta'
        };
      }

      // 3. Validar nueva contraseña
      const validation = validatePasswordComplexity(newPassword);
      
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // 4. Verificar que sea diferente
      const isDifferent = await isPasswordDifferent(newPassword, user.password_hash);
      if (!isDifferent) {
        return {
          success: false,
          error: 'La nueva contraseña debe ser diferente a la actual'
        };
      }

      // 5. Generar nuevo hash
      const { hash, hashedAt, expiresAt } = await hashPassword(newPassword);

      // 6. Actualizar
      await prisma.mot_usuario.update({
        where: { usuario_id: userId },
        data: {
          password_hash: hash,
          password_changed_at: hashedAt,
          password_expires_at: expiresAt,
          require_password_change: false
        }
      });

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };

    } catch (error) {
      console.error('❌ Error en changeLocalPassword:', error);
      return {
        success: false,
        error: 'Error al cambiar contraseña'
      };
    }
  }

  /**
   * Genera una contraseña temporal para reset
   * @param email - Email del usuario
   * @returns Contraseña temporal generada
   */
  static async resetLocalPassword(email: string): Promise<SetPasswordResult & { temporaryPassword?: string }> {
    try {
      // 1. Buscar usuario
      const user = await prisma.mot_usuario.findFirst({
        where: { email, deleted_at: null }
      });

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // 2. Generar contraseña temporal
      const tempPassword = generateTemporaryPassword();

      // 3. Establecer contraseña temporal con requireChange=true
      const result = await this.setLocalPassword(user.usuario_id, tempPassword, true);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        temporaryPassword: tempPassword,
        requirePasswordChange: true,
        message: 'Contraseña temporal generada. El usuario debe cambiarla en el próximo login.'
      };

    } catch (error) {
      console.error('❌ Error en resetLocalPassword:', error);
      return {
        success: false,
        error: 'Error al resetear contraseña'
      };
    }
  }

  /**
   * Incrementa el contador de intentos fallidos y bloquea si es necesario
   * @param userId - ID del usuario
   */
  private static async incrementFailedAttempts(userId: number): Promise<void> {
    try {
      const user = await prisma.mot_usuario.findUnique({
        where: { usuario_id: userId },
        select: { failed_login_attempts: true }
      });

      if (!user) return;

      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      const shouldLock = shouldLockAccount(newFailedAttempts);

      await prisma.mot_usuario.update({
        where: { usuario_id: userId },
        data: {
          failed_login_attempts: newFailedAttempts,
          account_locked_until: shouldLock ? calculateLockoutExpiry() : null
        }
      });

      if (shouldLock) {
        console.warn(`⚠️ Cuenta de usuario ${userId} bloqueada por múltiples intentos fallidos`);
      }

    } catch (error) {
      console.error('❌ Error al incrementar intentos fallidos:', error);
    }
  }

  /**
   * Registra un intento de autenticación en la tabla de auditoría
   */
  private static async logAuthAttempt(
    userId: number,
    email: string,
    method: string,
    success: boolean,
    failureReason?: string
  ): Promise<void> {
    try {
      await prisma.$executeRaw`
        INSERT INTO mol_auth_audit 
          (usuario_id, email, auth_method, success, failure_reason, created_at)
        VALUES 
          (${userId}, ${email}, ${method}, ${success}, ${failureReason || null}, NOW())
      `;
    } catch (error) {
      console.error('❌ Error al registrar auditoría de autenticación:', error);
    }
  }

  /**
   * Genera un token JWT para el usuario
   */
  private static generateJwtToken(user: any): string {
    const payload = {
      userId: user.usuario_id,
      email: user.email,
      rol: user.mom_rol.descripcion,
      authMethod: 'local'
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    const expiresIn: string = process.env.JWT_EXPIRES_IN || '24h';

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  /**
   * Valida la fortaleza de una contraseña sin guardarla
   */
  static validatePassword(password: string): PasswordValidationResult {
    return validatePasswordComplexity(password);
  }
}

export default LocalAuthService;
