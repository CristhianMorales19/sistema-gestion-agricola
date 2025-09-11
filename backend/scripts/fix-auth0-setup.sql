-- ================================================================
-- SCRIPT PARA COMPLETAR LA CONFIGURACIÓN AUTH0
-- Solo inserta lo que falta, respeta lo que ya existe
-- ================================================================

USE agromano;

-- ================================================================
-- 1. INSERTAR ROLES SI NO EXISTEN
-- ================================================================

INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN', 'Administrador', 'Rol de administrador del sistema', NOW(), 1, 1, NOW(), 1),
('SUPER', 'Supervisor', 'Rol de supervisor de campo', NOW(), 0, 1, NOW(), 1),
('OPER', 'Operario', 'Rol de operario de campo', NOW(), 0, 1, NOW(), 1);

-- ================================================================
-- 2. OBTENER IDS DE LOS TRABAJADORES EXISTENTES
-- ================================================================

-- Ver qué trabajadores ya existen
SELECT 'TRABAJADORES EXISTENTES:' as info;
SELECT trabajador_id, documento_identidad, nombre_completo, email 
FROM mom_trabajador 
WHERE documento_identidad IN ('ADM001', 'SUP001', 'GER001');

-- ================================================================
-- 3. CREAR USUARIOS PARA AUTH0 CON IDS ESPECÍFICOS
-- ================================================================

-- Obtener IDs específicos de trabajadores
SET @admin_trabajador_id = (SELECT trabajador_id FROM mom_trabajador WHERE documento_identidad = 'ADM001' LIMIT 1);
SET @super_trabajador_id = (SELECT trabajador_id FROM mom_trabajador WHERE documento_identidad = 'SUP001' LIMIT 1);
SET @ger_trabajador_id = (SELECT trabajador_id FROM mom_trabajador WHERE documento_identidad = 'GER001' LIMIT 1);

-- Obtener IDs de roles
SET @admin_rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN' LIMIT 1);
SET @super_rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPER' LIMIT 1);

-- Insertar usuarios solo si los trabajadores existen
INSERT IGNORE INTO mot_usuario (trabajador_id, username, password_hash, rol_id, estado, created_at, created_by) 
SELECT t.trabajador_id, 'admin@agromano.com', '$2b$10$dummy.hash.for.auth0', @admin_rol_id, 'activo', NOW(), 1
FROM mom_trabajador t 
WHERE t.documento_identidad = 'ADM001' 
AND @admin_rol_id IS NOT NULL;

INSERT IGNORE INTO mot_usuario (trabajador_id, username, password_hash, rol_id, estado, created_at, created_by) 
SELECT t.trabajador_id, 'supervisor.campo@agromano.com', '$2b$10$dummy.hash.for.auth0', @super_rol_id, 'activo', NOW(), 1
FROM mom_trabajador t 
WHERE t.documento_identidad = 'SUP001' 
AND @super_rol_id IS NOT NULL;

INSERT IGNORE INTO mot_usuario (trabajador_id, username, password_hash, rol_id, estado, created_at, created_by) 
SELECT t.trabajador_id, 'gerente.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @admin_rol_id, 'activo', NOW(), 1
FROM mom_trabajador t 
WHERE t.documento_identidad = 'GER001' 
AND @admin_rol_id IS NOT NULL;

-- ================================================================
-- 4. ASIGNAR PERMISOS A ROLES (SOLO SI HAY PERMISOS)
-- ================================================================

-- ADMIN: Todos los permisos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @admin_rol_id, permiso_id, NOW(), 1 
FROM mom_permiso 
WHERE is_activo = 1 AND @admin_rol_id IS NOT NULL;

-- SUPERVISOR: Permisos específicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @super_rol_id, permiso_id, NOW(), 1 
FROM mom_permiso 
WHERE codigo IN (
    'trabajadores:read:all',
    'asistencia:read:all', 'asistencia:register', 'asistencia:update', 'asistencia:approve', 'asistencia:reports',
    'productividad:read:all', 'productividad:register', 'productividad:reports',
    'tareas:create', 'tareas:assign', 'tareas:read:all',
    'reportes:read:advanced', 'reportes:export', 'dashboard:view:advanced'
) AND @super_rol_id IS NOT NULL;

-- ================================================================
-- 5. VERIFICACIÓN FINAL
-- ================================================================

SELECT '=== VERIFICACIÓN FINAL ===' as info;

-- Contar roles
SELECT 'ROLES CONFIGURADOS:' as tipo, COUNT(*) as total 
FROM mom_rol WHERE codigo IN ('ADMIN', 'SUPER', 'OPER');

-- Contar usuarios Auth0
SELECT 'USUARIOS AUTH0:' as tipo, COUNT(*) as total 
FROM mot_usuario WHERE username LIKE '%@agromano.com%';

-- Mostrar usuarios para Auth0
SELECT '=== USUARIOS PARA AUTH0 ===' as info;
SELECT 
    u.username as 'Email para Auth0',
    r.nombre as 'Rol',
    'CREAR EN AUTH0' as 'Acción'
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
WHERE u.username LIKE '%@agromano.com%';

-- Contar permisos por rol
SELECT 'PERMISOS POR ROL:' as info;
SELECT 
    r.codigo as rol,
    COUNT(rp.permiso_id) as permisos
FROM mom_rol r
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
WHERE r.codigo IN ('ADMIN', 'SUPER', 'OPER')
GROUP BY r.rol_id, r.codigo;

SELECT '✅ CONFIGURACIÓN AUTH0 COMPLETADA' as resultado;
