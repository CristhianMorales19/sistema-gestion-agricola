-- ========================================
-- Migración: Agregar Sistema de Fallback de Autenticación Local
-- Fecha: 2024-10-04
-- Descripción: Agrega columnas para permitir autenticación local de respaldo
--              cuando Auth0 no está disponible
-- ========================================

USE agromano;

-- 1. Modificar password_hash para permitir NULL (usuarios que solo usan Auth0)
ALTER TABLE mot_usuario 
  MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- 2. Agregar columnas para sistema de fallback
ALTER TABLE mot_usuario
  ADD COLUMN auth0_enabled BOOLEAN DEFAULT TRUE COMMENT 'Si el usuario puede autenticarse con Auth0',
  ADD COLUMN local_auth_enabled BOOLEAN DEFAULT TRUE COMMENT 'Si el usuario puede usar autenticación local como fallback',
  ADD COLUMN last_auth_method VARCHAR(20) NULL COMMENT 'Último método de autenticación usado: auth0, local',
  ADD COLUMN failed_login_attempts INT DEFAULT 0 COMMENT 'Contador de intentos fallidos de login',
  ADD COLUMN account_locked_until DATETIME NULL COMMENT 'Fecha hasta la cual la cuenta está bloqueada',
  ADD COLUMN password_changed_at DATETIME NULL COMMENT 'Fecha del último cambio de contraseña',
  ADD COLUMN password_expires_at DATETIME NULL COMMENT 'Fecha de expiración de la contraseña (90 días)',
  ADD COLUMN require_password_change BOOLEAN DEFAULT FALSE COMMENT 'Si el usuario debe cambiar su contraseña en el próximo login';

-- 3. Agregar índices para optimizar consultas
CREATE INDEX idx_mot_usuario_email ON mot_usuario(email);
CREATE INDEX idx_mot_usuario_auth_method ON mot_usuario(last_auth_method);
CREATE INDEX idx_mot_usuario_locked ON mot_usuario(account_locked_until);

-- 4. Actualizar usuarios existentes
-- Establecer valores por defecto para usuarios que ya existen
UPDATE mot_usuario 
SET 
  auth0_enabled = TRUE,
  local_auth_enabled = TRUE,
  failed_login_attempts = 0,
  require_password_change = FALSE
WHERE auth0_enabled IS NULL;

-- 5. Establecer password_changed_at para usuarios con contraseña
UPDATE mot_usuario 
SET password_changed_at = created_at
WHERE password_hash IS NOT NULL AND password_changed_at IS NULL;

-- 6. Calcular password_expires_at (90 días desde el último cambio)
UPDATE mot_usuario 
SET password_expires_at = DATE_ADD(password_changed_at, INTERVAL 90 DAY)
WHERE password_hash IS NOT NULL AND password_changed_at IS NOT NULL;

-- 7. Comentarios de columnas
ALTER TABLE mot_usuario 
  MODIFY COLUMN auth0_enabled BOOLEAN DEFAULT TRUE 
    COMMENT 'Permite autenticación con Auth0. Desactivar solo para cuentas de emergencia',
  MODIFY COLUMN local_auth_enabled BOOLEAN DEFAULT TRUE 
    COMMENT 'Permite autenticación local como fallback. Útil para continuidad del negocio',
  MODIFY COLUMN last_auth_method VARCHAR(20) NULL 
    COMMENT 'Último método usado: auth0 (normal) o local (fallback)',
  MODIFY COLUMN failed_login_attempts INT DEFAULT 0 
    COMMENT 'Contador de intentos fallidos. Se resetea en login exitoso',
  MODIFY COLUMN account_locked_until DATETIME NULL 
    COMMENT 'Bloqueo temporal tras 5 intentos fallidos. Se desbloquea automáticamente',
  MODIFY COLUMN password_changed_at DATETIME NULL 
    COMMENT 'Última fecha de cambio de contraseña. Para auditoría',
  MODIFY COLUMN password_expires_at DATETIME NULL 
    COMMENT 'Expiración de contraseña (90 días). Usuario debe cambiarla al expirar',
  MODIFY COLUMN require_password_change BOOLEAN DEFAULT FALSE 
    COMMENT 'Forzar cambio de contraseña en próximo login. Útil para resets';

-- 8. Crear tabla de auditoría de autenticación
CREATE TABLE IF NOT EXISTS mol_auth_audit (
  audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  email VARCHAR(255) NULL,
  auth_method VARCHAR(20) NOT NULL COMMENT 'auth0, local, failed',
  success BOOLEAN NOT NULL,
  ip_address VARCHAR(100) NULL,
  user_agent VARCHAR(500) NULL,
  failure_reason VARCHAR(255) NULL,
  auth0_available BOOLEAN NULL COMMENT 'Si Auth0 estaba disponible al momento del login',
  created_at DATETIME NOT NULL,
  
  INDEX idx_mol_auth_audit_usuario (usuario_id),
  INDEX idx_mol_auth_audit_email (email),
  INDEX idx_mol_auth_audit_method (auth_method),
  INDEX idx_mol_auth_audit_created (created_at),
  
  CONSTRAINT fk_mol_auth_audit_usuario 
    FOREIGN KEY (usuario_id) 
    REFERENCES mot_usuario(usuario_id) 
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Auditoría de intentos de autenticación. Registro completo de logins exitosos y fallidos';

-- 9. Trigger para resetear intentos fallidos en login exitoso
DELIMITER $$

CREATE TRIGGER trg_mot_usuario_reset_failed_attempts
BEFORE UPDATE ON mot_usuario
FOR EACH ROW
BEGIN
  -- Si last_login_at se actualiza (login exitoso), resetear intentos fallidos
  IF NEW.last_login_at != OLD.last_login_at OR (OLD.last_login_at IS NULL AND NEW.last_login_at IS NOT NULL) THEN
    SET NEW.failed_login_attempts = 0;
    SET NEW.account_locked_until = NULL;
  END IF;
END$$

DELIMITER ;

-- 10. Verificación de la migración
SELECT 
  'Migración completada exitosamente' AS estado,
  COUNT(*) AS total_usuarios,
  SUM(CASE WHEN auth0_enabled = TRUE THEN 1 ELSE 0 END) AS usuarios_auth0,
  SUM(CASE WHEN local_auth_enabled = TRUE THEN 1 ELSE 0 END) AS usuarios_local,
  SUM(CASE WHEN password_hash IS NOT NULL THEN 1 ELSE 0 END) AS usuarios_con_password
FROM mot_usuario
WHERE deleted_at IS NULL;

-- Mostrar estructura de la tabla actualizada
DESCRIBE mot_usuario;

-- Mostrar nueva tabla de auditoría
DESCRIBE mol_auth_audit;

-- ========================================
-- FIN DE MIGRACIÓN
-- ========================================
