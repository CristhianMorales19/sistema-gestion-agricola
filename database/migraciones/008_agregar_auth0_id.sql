-- ============================================
-- Migración 008: Agregar campo auth0_id para sistema híbrido Auth0
-- Base de datos: agromano (174.138.186.187:3306)
-- Descripción: Permite enlazar usuarios de Auth0 con datos locales
-- Autor: Sistema - Fecha: 2025-10-02
-- ============================================

-- IMPORTANTE: Esta migración adapta la tabla mot_usuario existente
-- para trabajar con Auth0 manteniendo la estructura actual

-- ============================================
-- PASO 1: Agregar campo auth0_id a mot_usuario
-- ============================================
ALTER TABLE `mot_usuario` 
ADD COLUMN `auth0_id` VARCHAR(100) NULL UNIQUE 
COMMENT 'ID único de Auth0 (ej: auth0|abc123 o google-oauth2|123456)' AFTER `usuario_id`,
ADD INDEX `idx_auth0_id` (`auth0_id`);

-- ============================================
-- PASO 2: Agregar campos para sincronización con Auth0
-- ============================================
ALTER TABLE `mot_usuario` 
ADD COLUMN `email` VARCHAR(150) NULL 
COMMENT 'Email del usuario (sincronizado con Auth0)' AFTER `username`,
ADD COLUMN `auth_provider` VARCHAR(50) DEFAULT 'auth0' 
COMMENT 'Proveedor de autenticación (auth0, local, google, etc.)' AFTER `estado`,
ADD COLUMN `email_verified` TINYINT(1) DEFAULT 0 
COMMENT 'Si el email fue verificado en Auth0' AFTER `auth_provider`,
ADD COLUMN `last_login_at` DATETIME NULL 
COMMENT 'Fecha y hora del último inicio de sesión' AFTER `email_verified`,
ADD COLUMN `auth0_metadata` TEXT NULL 
COMMENT 'Metadatos adicionales de Auth0 en formato JSON (picture, name, etc.)' AFTER `last_login_at`;

-- ============================================
-- PASO 3: Hacer password_hash opcional (Auth0 maneja contraseñas)
-- ============================================
ALTER TABLE `mot_usuario` 
MODIFY COLUMN `password_hash` VARCHAR(255) NULL 
COMMENT 'Hash de contraseña (NULL si usa Auth0)';

-- ============================================
-- PASO 4: Agregar índices para optimización
-- ============================================
ALTER TABLE `mot_usuario` 
ADD INDEX `idx_email` (`email`),
ADD INDEX `idx_auth_provider` (`auth_provider`),
ADD INDEX `idx_last_login` (`last_login_at`);

-- ============================================
-- PASO 5: Actualizar usuario existente de Auth0 (si existe)
-- ============================================
UPDATE `mot_usuario` 
SET 
  `auth0_id` = `username`,
  `email` = (SELECT `email` FROM `mom_trabajador` WHERE `trabajador_id` = `mot_usuario`.`trabajador_id` LIMIT 1),
  `auth_provider` = 'auth0',
  `email_verified` = 1
WHERE `username` LIKE 'auth0|%' OR `username` LIKE 'google-oauth2|%';

-- ============================================
-- VERIFICACIÓN DE LA MIGRACIÓN
-- ============================================
SELECT 
  '✅ MIGRACIÓN 008 COMPLETADA' AS Estado,
  COUNT(*) AS 'Total Usuarios',
  SUM(CASE WHEN auth0_id IS NOT NULL THEN 1 ELSE 0 END) AS 'Usuarios con Auth0'
FROM `mot_usuario`;

-- Mostrar estructura actualizada
DESCRIBE `mot_usuario`;
