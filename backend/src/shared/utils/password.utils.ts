/**
 * 🔐 Utilidades de Seguridad para Contraseñas
 *
 * Módulo para gestión segura de contraseñas locales en el sistema de fallback.
 * Implementa hashing con bcrypt, validación de complejidad y generación segura.
 *
 * @module password-utils
 */

import bcrypt from "bcryptjs";
import * as crypto from "crypto";

// ========================================
// Constantes de Configuración
// ========================================

const BCRYPT_ROUNDS = 12; // Factor de costo para bcrypt (mayor = más seguro pero más lento)
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const TEMP_PASSWORD_LENGTH = 16;
const PASSWORD_EXPIRY_DAYS = 90;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// ========================================
// Interfaces
// ========================================

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong" | "very-strong";
}

export interface PasswordHashResult {
  hash: string;
  hashedAt: Date;
  expiresAt: Date;
}

// ========================================
// Funciones Principales
// ========================================

/**
 * Genera un hash seguro de una contraseña usando bcrypt
 * @param plainPassword - Contraseña en texto plano
 * @returns Promise con el hash, fecha de creación y expiración
 */
export async function hashPassword(
  plainPassword: string,
): Promise<PasswordHashResult> {
  if (!plainPassword || plainPassword.trim().length === 0) {
    throw new Error("La contraseña no puede estar vacía");
  }

  if (plainPassword.length > PASSWORD_MAX_LENGTH) {
    throw new Error(
      `La contraseña no puede exceder ${PASSWORD_MAX_LENGTH} caracteres`,
    );
  }

  try {
    const hash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
    const hashedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + PASSWORD_EXPIRY_DAYS);

    return {
      hash,
      hashedAt,
      expiresAt,
    };
  } catch (error) {
    console.error("❌ Error al generar hash de contraseña:", error);
    throw new Error("Error al procesar la contraseña");
  }
}

/**
 * Compara una contraseña en texto plano con un hash de forma segura
 * @param plainPassword - Contraseña en texto plano
 * @param passwordHash - Hash almacenado en la base de datos
 * @returns Promise<boolean> - true si coinciden
 */
export async function comparePassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  if (!plainPassword || !passwordHash) {
    return false;
  }

  try {
    return await bcrypt.compare(plainPassword, passwordHash);
  } catch (error) {
    console.error("❌ Error al comparar contraseñas:", error);
    return false;
  }
}

/**
 * Valida la complejidad de una contraseña según políticas de seguridad
 * @param password - Contraseña a validar
 * @returns Resultado de validación con errores y nivel de fortaleza
 */
export function validatePasswordComplexity(
  password: string,
): PasswordValidationResult {
  const errors: string[] = [];
  let strength: "weak" | "medium" | "strong" | "very-strong" = "weak";

  // Validación de longitud
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
    );
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push(
      `La contraseña no puede exceder ${PASSWORD_MAX_LENGTH} caracteres`,
    );
  }

  // Validación de complejidad
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    password,
  );

  if (!hasUpperCase) {
    errors.push("La contraseña debe contener al menos una letra mayúscula");
  }

  if (!hasLowerCase) {
    errors.push("La contraseña debe contener al menos una letra minúscula");
  }

  if (!hasNumbers) {
    errors.push("La contraseña debe contener al menos un número");
  }

  if (!hasSpecialChars) {
    errors.push(
      "La contraseña debe contener al menos un carácter especial (!@#$%^&*...)",
    );
  }

  // Detectar patrones comunes débiles
  const commonPatterns = [
    /^(123456|password|qwerty|abc123|letmein|admin)/i,
    /(.)\1{3,}/, // Caracteres repetidos
    /(012|123|234|345|456|567|678|789)/, // Secuencias numéricas
    /(abc|bcd|cde|def|efg|fgh)/i, // Secuencias alfabéticas
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push(
        "La contraseña contiene patrones comunes o repetitivos inseguros",
      );
      break;
    }
  }

  // Calcular fortaleza
  const criteriasMet = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChars,
  ].filter(Boolean).length;

  if (errors.length === 0) {
    if (password.length >= 16 && criteriasMet === 4) {
      strength = "very-strong";
    } else if (password.length >= 12 && criteriasMet >= 3) {
      strength = "strong";
    } else if (criteriasMet >= 3) {
      strength = "medium";
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Genera una contraseña temporal segura para resets o usuarios nuevos
 * @param length - Longitud de la contraseña (default: 16)
 * @returns Contraseña temporal aleatoria
 */
export function generateTemporaryPassword(
  length: number = TEMP_PASSWORD_LENGTH,
): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}";

  const allChars = uppercase + lowercase + numbers + special;

  // Asegurar que tiene al menos un carácter de cada tipo
  let password = "";
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += special[crypto.randomInt(0, special.length)];

  // Completar con caracteres aleatorios
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  // Mezclar los caracteres
  return password
    .split("")
    .sort(() => crypto.randomInt(-1, 2))
    .join("");
}

/**
 * Verifica si una contraseña ha expirado
 * @param passwordChangedAt - Fecha del último cambio de contraseña
 * @param passwordExpiresAt - Fecha de expiración (opcional, se calcula si no se proporciona)
 * @returns true si la contraseña ha expirado
 */
export function isPasswordExpired(
  passwordChangedAt: Date | null,
  passwordExpiresAt?: Date | null,
): boolean {
  if (!passwordChangedAt) {
    return false; // Si nunca se cambió, no está expirada
  }

  const expiryDate =
    passwordExpiresAt ||
    new Date(
      passwordChangedAt.getTime() + PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    );
  return new Date() > expiryDate;
}

/**
 * Verifica si una cuenta está bloqueada por intentos fallidos
 * @param accountLockedUntil - Fecha hasta la cual está bloqueada la cuenta
 * @returns true si la cuenta está actualmente bloqueada
 */
export function isAccountLocked(accountLockedUntil: Date | null): boolean {
  if (!accountLockedUntil) {
    return false;
  }

  return new Date() < accountLockedUntil;
}

/**
 * Calcula la fecha hasta la cual debe bloquearse una cuenta
 * @returns Fecha de desbloqueo (15 minutos en el futuro)
 */
export function calculateLockoutExpiry(): Date {
  const lockoutExpiry = new Date();
  lockoutExpiry.setMinutes(
    lockoutExpiry.getMinutes() + LOCKOUT_DURATION_MINUTES,
  );
  return lockoutExpiry;
}

/**
 * Determina si se debe bloquear la cuenta basado en intentos fallidos
 * @param failedAttempts - Número de intentos fallidos consecutivos
 * @returns true si se debe bloquear la cuenta
 */
export function shouldLockAccount(failedAttempts: number): boolean {
  return failedAttempts >= MAX_FAILED_ATTEMPTS;
}

/**
 * Genera un token seguro para reset de contraseña
 * @returns Token aleatorio de 32 bytes en formato hexadecimal
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Valida que la nueva contraseña sea diferente a la anterior
 * @param newPassword - Nueva contraseña en texto plano
 * @param oldPasswordHash - Hash de la contraseña anterior
 * @returns Promise<boolean> - false si son iguales (no permitir)
 */
export async function isPasswordDifferent(
  newPassword: string,
  oldPasswordHash: string | null,
): Promise<boolean> {
  if (!oldPasswordHash) {
    return true; // Si no hay contraseña anterior, permitir cualquiera
  }

  const isSame = await comparePassword(newPassword, oldPasswordHash);
  return !isSame;
}

// ========================================
// Exportar Constantes
// ========================================

export const PASSWORD_CONFIG = {
  MIN_LENGTH: PASSWORD_MIN_LENGTH,
  MAX_LENGTH: PASSWORD_MAX_LENGTH,
  EXPIRY_DAYS: PASSWORD_EXPIRY_DAYS,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MINUTES,
};
