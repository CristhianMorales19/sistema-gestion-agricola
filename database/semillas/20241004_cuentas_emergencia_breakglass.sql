-- ========================================
-- Seed: Cuentas de Emergencia (Break-Glass Accounts)
-- Fecha: 2024-10-04
-- Descripción: Crea 2 usuarios administrativos que SOLO usan autenticación local
--              Estas cuentas no dependen de Auth0 y sirven para acceso de emergencia
-- ========================================

USE agromano;

-- ========================================
-- PASO 1: Verificar que existe el rol de administrador
-- ========================================

SELECT 
  rol_id, 
  descripcion 
FROM mom_rol 
WHERE descripcion = 'Administrador' OR descripcion = 'Admin';

-- Si no existe, crear el rol (ajustar según tu esquema)
-- INSERT INTO mom_rol (descripcion, estado, created_at, created_by) 
-- VALUES ('Administrador', 'activo', NOW(), 1);

-- ========================================
-- PASO 2: Crear cuentas de emergencia
-- ========================================

-- 🚨 IMPORTANTE: Las contraseñas son temporales y DEBEN ser cambiadas inmediatamente
-- Password temporal: EmergencyAdmin2024!
-- Hash bcrypt (rounds=12): $2b$12$LKGnZqxE1oX9.hMYJvxQJeXxYvHrEqLJFvMJt3T1RZHvJJ3QJOzH6

-- 👤 Cuenta de Emergencia #1: Admin Principal
INSERT INTO mot_usuario (
  username,
  email,
  password_hash,
  rol_id,
  estado,
  auth0_enabled,                -- ❌ NO usa Auth0
  local_auth_enabled,           -- ✅ SOLO autenticación local
  require_password_change,      -- ⚠️ Debe cambiar password en primer login
  password_changed_at,
  password_expires_at,
  created_at,
  created_by
) VALUES (
  'emergency_admin_1',
  'emergency.admin1@agromano.local',
  '$2b$12$LKGnZqxE1oX9.hMYJvxQJeXxYvHrEqLJFvMJt3T1RZHvJJ3QJOzH6',  -- EmergencyAdmin2024!
  (SELECT rol_id FROM mom_rol WHERE descripcion = 'Administrador' LIMIT 1),
  'activo',
  FALSE,                        -- ❌ Auth0 deshabilitado
  TRUE,                         -- ✅ Autenticación local habilitada
  TRUE,                         -- ⚠️ Requiere cambio de contraseña
  NOW(),
  DATE_ADD(NOW(), INTERVAL 7 DAY),  -- Expira en 7 días
  NOW(),
  1
);

-- 👤 Cuenta de Emergencia #2: Admin Respaldo
INSERT INTO mot_usuario (
  username,
  email,
  password_hash,
  rol_id,
  estado,
  auth0_enabled,
  local_auth_enabled,
  require_password_change,
  password_changed_at,
  password_expires_at,
  created_at,
  created_by
) VALUES (
  'emergency_admin_2',
  'emergency.admin2@agromano.local',
  '$2b$12$LKGnZqxE1oX9.hMYJvxQJeXxYvHrEqLJFvMJt3T1RZHvJJ3QJOzH6',  -- EmergencyAdmin2024!
  (SELECT rol_id FROM mom_rol WHERE descripcion = 'Administrador' LIMIT 1),
  'activo',
  FALSE,                        -- ❌ Auth0 deshabilitado
  TRUE,                         -- ✅ Autenticación local habilitada
  TRUE,                         -- ⚠️ Requiere cambio de contraseña
  NOW(),
  DATE_ADD(NOW(), INTERVAL 7 DAY),  -- Expira en 7 días
  NOW(),
  1
);

-- ========================================
-- PASO 3: Verificar creación de cuentas
-- ========================================

SELECT 
  usuario_id,
  username,
  email,
  auth0_enabled,
  local_auth_enabled,
  require_password_change,
  password_expires_at,
  estado,
  created_at
FROM mot_usuario
WHERE username IN ('emergency_admin_1', 'emergency_admin_2');

-- ========================================
-- PASO 4: Registro en auditoría
-- ========================================

INSERT INTO mol_audit_log (
  entidad,
  entidad_id,
  accion,
  datos_despues,
  usuario_id,
  fecha_at,
  ip_origen
) VALUES (
  'mot_usuario',
  (SELECT usuario_id FROM mot_usuario WHERE username = 'emergency_admin_1' LIMIT 1),
  'CREATE_EMERGENCY_ACCOUNT',
  'Cuenta de emergencia #1 creada. Solo usa autenticación local. Password temporal debe ser cambiado.',
  1,
  NOW(),
  'SYSTEM'
);

INSERT INTO mol_audit_log (
  entidad,
  entidad_id,
  accion,
  datos_despues,
  usuario_id,
  fecha_at,
  ip_origen
) VALUES (
  'mot_usuario',
  (SELECT usuario_id FROM mot_usuario WHERE username = 'emergency_admin_2' LIMIT 1),
  'CREATE_EMERGENCY_ACCOUNT',
  'Cuenta de emergencia #2 creada. Solo usa autenticación local. Password temporal debe ser cambiado.',
  1,
  NOW(),
  'SYSTEM'
);

-- ========================================
-- IMPORTANTE: GUARDAR CREDENCIALES DE FORMA SEGURA
-- ========================================

/*
┌─────────────────────────────────────────────────────────────────────────┐
│  🚨 CREDENCIALES DE CUENTAS DE EMERGENCIA                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  👤 Cuenta 1:                                                            │
│     Email:    emergency.admin1@agromano.local                           │
│     Password: EmergencyAdmin2024!                                        │
│     Uso:      Acceso de emergencia cuando Auth0 está caído              │
│                                                                           │
│  👤 Cuenta 2:                                                            │
│     Email:    emergency.admin2@agromano.local                           │
│     Password: EmergencyAdmin2024!                                        │
│     Uso:      Respaldo adicional                                         │
│                                                                           │
│  ⚠️ IMPORTANTE:                                                          │
│     - Estas contraseñas son TEMPORALES                                   │
│     - DEBEN ser cambiadas inmediatamente en el primer login              │
│     - Guardar nuevas contraseñas en gestor de contraseñas seguro        │
│     - Estas cuentas NO usan Auth0 (solo autenticación local)            │
│     - Solo usar en EMERGENCIAS cuando Auth0 no está disponible          │
│                                                                           │
│  📋 Procedimiento de uso:                                                │
│     1. Solo usar si Auth0 está completamente caído                       │
│     2. Login en /api/auth/login con email y password                    │
│     3. Cambiar password inmediatamente en /api/auth/local-password/change│
│     4. Documentar uso en bitácora de incidentes                         │
│     5. Notificar a equipo de seguridad                                   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

GUARDAR ESTE DOCUMENTO EN:
- 🔐 Gestor de contraseñas del equipo (1Password, LastPass, etc.)
- 📧 Email encriptado al equipo de DevOps/SysAdmin
- 🗄️ Bóveda segura física (impreso y sellado)
- 📱 Sistema de gestión de secretos (HashiCorp Vault, AWS Secrets Manager)

NO GUARDAR EN:
- ❌ Repositorio de código (Git)
- ❌ Documentación pública
- ❌ Slack/Teams sin encriptar
- ❌ Post-its o papel sin protección

*/

-- ========================================
-- FIN DE SEED
-- ========================================
