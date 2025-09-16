-- ================================================================
-- SCRIPT COMPLETO PARA CREAR TODOS LOS ROLES SEGÚN LA MATRIZ
-- Basado en MATRIZ_ROLES_PERMISOS.md
-- ================================================================

USE agromano; 

-- ================================================================
-- 1. LIMPIAR CONFIGURACIÓN ANTERIOR (OPCIONAL)
-- ================================================================

-- DELETE FROM rel_mom_rol__mom_permiso;
-- DELETE FROM mom_rol WHERE codigo NOT IN ('ADMIN', 'SUPER', 'OPER');

-- ================================================================
-- 2. CREAR TODOS LOS ROLES SEGÚN LA MATRIZ
-- ================================================================

INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, updated_at, created_by, updated_by) VALUES
-- Roles principales de la matriz
('ADMIN_AGROMANO', 'Administrador AgroMano', 'Administrador del sistema con acceso completo', NOW(), 1, 1, NOW(), NOW(), 1, 1),
('SUPERVISOR_CAMPO', 'Supervisor Campo', 'Supervisor de operaciones de campo', NOW(), 0, 1, NOW(), NOW(), 1, 1),
('GERENTE_RRHH', 'Gerente RRHH', 'Gerente de Recursos Humanos', NOW(), 1, 1, NOW(), NOW(), 1, 1),
('SUPERVISOR_RRHH', 'Supervisor RRHH', 'Supervisor de RRHH con permisos limitados', NOW(), 0, 1, NOW(), NOW(), 1, 1),
('EMPLEADO_CAMPO', 'Empleado Campo', 'Trabajador de campo con acceso básico', NOW(), 0, 1, NOW(), NOW(), 1, 1),
('VISUAL_SOLO_LECTURA', 'Solo Lectura', 'Usuario con acceso de solo lectura para reportes', NOW(), 0, 1, NOW(), NOW(), 1, 1);

-- ================================================================
-- 3. CREAR PERMISOS ADICIONALES SEGÚN LA MATRIZ
-- ================================================================

INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
-- Personal (extendidos)
('trabajadores:update:all', 'Actualizar todos trabajadores', 'Personal', 'Modificar información de cualquier trabajador', 1, NOW(), 1),
('trabajadores:import', 'Importar trabajadores', 'Personal', 'Importar datos masivos de trabajadores', 1, NOW(), 1),

-- Asistencia (extendidos)
('asistencia:dashboard', 'Dashboard asistencia', 'Asistencia', 'Ver dashboard de asistencia', 1, NOW(), 1),
('permisos:approve', 'Aprobar permisos', 'Asistencia', 'Aprobar solicitudes de permisos', 1, NOW(), 1),
('permisos:read', 'Ver permisos', 'Asistencia', 'Ver solicitudes de permisos', 1, NOW(), 1),
('horarios:manage', 'Gestionar horarios', 'Asistencia', 'Gestionar horarios de trabajo', 1, NOW(), 1),

-- Productividad (extendidos)
('productividad:register:others', 'Registrar productividad otros', 'Productividad', 'Registrar productividad de otros trabajadores', 1, NOW(), 1),
('metas:set', 'Establecer metas', 'Productividad', 'Establecer metas de productividad', 1, NOW(), 1),
('metas:track', 'Seguir metas', 'Productividad', 'Hacer seguimiento de metas', 1, NOW(), 1),

-- Nómina (completos)
('nomina:calculate', 'Calcular nómina', 'Nomina', 'Realizar cálculos de nómina', 1, NOW(), 1),
('nomina:export', 'Exportar nómina', 'Nomina', 'Exportar datos de nómina', 1, NOW(), 1),
('salarios:update', 'Actualizar salarios', 'Nomina', 'Modificar salarios base', 1, NOW(), 1),
('bonificaciones:manage', 'Gestionar bonificaciones', 'Nomina', 'Administrar bonificaciones', 1, NOW(), 1),
('deducciones:manage', 'Gestionar deducciones', 'Nomina', 'Administrar deducciones', 1, NOW(), 1),

-- Cultivos y Parcelas
('parcelas:read', 'Ver parcelas', 'Cultivos', 'Ver información de parcelas', 1, NOW(), 1),
('parcelas:update', 'Actualizar parcelas', 'Cultivos', 'Modificar información de parcelas', 1, NOW(), 1),
('cultivos:read', 'Ver cultivos', 'Cultivos', 'Ver información de cultivos', 1, NOW(), 1),
('cultivos:update', 'Actualizar cultivos', 'Cultivos', 'Modificar información de cultivos', 1, NOW(), 1),
('cultivos:track', 'Seguir cultivos', 'Cultivos', 'Hacer seguimiento de cultivos', 1, NOW(), 1),
('cosechas:register', 'Registrar cosechas', 'Cultivos', 'Registrar datos de cosecha', 1, NOW(), 1),
('cosechas:read', 'Ver cosechas', 'Cultivos', 'Ver datos de cosechas', 1, NOW(), 1),

-- KPIs y Dashboard
('kpis:view', 'Ver KPIs', 'Dashboard', 'Ver indicadores clave', 1, NOW(), 1),

-- Configuración del sistema
('system:config', 'Configurar sistema', 'Sistema', 'Configuraciones del sistema', 1, NOW(), 1),
('system:backup', 'Backup sistema', 'Sistema', 'Realizar respaldos', 1, NOW(), 1),
('system:maintenance', 'Mantenimiento sistema', 'Sistema', 'Modo mantenimiento', 1, NOW(), 1);

-- ================================================================
-- 4. ASIGNAR PERMISOS A ROLES SEGÚN LA MATRIZ
-- ================================================================

-- 4.1. ADMIN_AGROMANO: TODOS los permisos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO'),
    permiso_id, 
    NOW(), 
    1 
FROM mom_permiso WHERE is_activo = 1;

-- 4.2. SUPERVISOR_CAMPO: Permisos específicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO'),
    permiso_id, 
    NOW(), 
    1 
FROM mom_permiso 
WHERE codigo IN (
    -- Personal
    'trabajadores:read:all',
    'trabajadores:update:all', 
    'trabajadores:export',
    
    -- Asistencia
    'asistencia:read:all',
    'asistencia:update',
    'asistencia:approve',
    'asistencia:reports',
    'asistencia:dashboard',
    'permisos:approve',
    
    -- Productividad
    'productividad:read:all',
    'productividad:register:others',
    'productividad:reports',
    'tareas:create',
    'tareas:assign',
    'metas:set',
    'metas:track',
    
    -- Cultivos
    'parcelas:read',
    'parcelas:update',
    'cultivos:read',
    'cultivos:update',
    'cultivos:track',
    'cosechas:register',
    'cosechas:read',
    
    -- Reportes
    'reportes:read:advanced',
    'reportes:export',
    'dashboard:view:advanced',
    'kpis:view'
) AND is_activo = 1;

-- 4.3. GERENTE_RRHH: Permisos específicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH'),
    permiso_id, 
    NOW(), 
    1 
FROM mom_permiso 
WHERE codigo IN (
    -- Personal
    'trabajadores:create',
    'trabajadores:read:all',
    'trabajadores:update:all',
    'trabajadores:delete',
    'trabajadores:import',
    'trabajadores:export',
    
    -- Asistencia
    'asistencia:read:all',
    'asistencia:update',
    'asistencia:reports',
    'permisos:approve',
    'horarios:manage',
    
    -- Nómina
    'nomina:process',
    'nomina:read:all',
    'nomina:approve',
    'nomina:calculate',
    'nomina:reports',
    'nomina:export',
    'salarios:update',
    'bonificaciones:manage',
    'deducciones:manage',
    
    -- Reportes
    'reportes:read:advanced',
    'reportes:export',
    'dashboard:view:advanced'
) AND is_activo = 1;

-- 4.4. SUPERVISOR_RRHH: Permisos limitados
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH'),
    permiso_id, 
    NOW(), 
    1 
FROM mom_permiso 
WHERE codigo IN (
    -- Personal
    'trabajadores:read:all',
    'trabajadores:update:all',
    'trabajadores:export',
    
    -- Asistencia
    'asistencia:read:all',
    'asistencia:reports',
    'permisos:read',
    
    -- Reportes básicos
    'reportes:read:advanced',
    'dashboard:view:advanced'
) AND is_activo = 1;

-- 4.5. EMPLEADO_CAMPO: Permisos básicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'EMPLEADO_CAMPO'),
    permiso_id, 
    NOW(), 
    1 
FROM mom_permiso 
WHERE codigo IN (
    'asistencia:register',
    'productividad:register',
    'tareas:read:all'
) AND is_activo = 1;

-- 4.6. VISUAL_SOLO_LECTURA: Solo lectura
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'VISUAL_SOLO_LECTURA'),
    permiso_id, 
    NOW(), 
    1 
FROM mom_permiso 
WHERE codigo IN (
    'trabajadores:read:all',
    'asistencia:read:all',
    'productividad:read:all',
    'reportes:read:advanced',
    'dashboard:view:advanced',
    'kpis:view'
) AND is_activo = 1;

-- ================================================================
-- 5. ACTUALIZAR USUARIOS EXISTENTES CON NUEVOS ROLES
-- ================================================================

-- Actualizar usuarios existentes para usar los nuevos códigos de rol
UPDATE mot_usuario 
SET rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO')
WHERE username = 'admin@agromano.com';

UPDATE mot_usuario 
SET rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO')
WHERE username = 'supervisor.campo@agromano.com';

UPDATE mot_usuario 
SET rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH')
WHERE username = 'gerente.rrhh@agromano.com';

-- ================================================================
-- 6. VERIFICACIÓN FINAL
-- ================================================================

SELECT '=== ROLES CREADOS SEGÚN LA MATRIZ ===' as info;
SELECT 
    codigo as 'Código_Rol',
    nombre as 'Nombre_Rol',
    descripcion as 'Descripción'
FROM mom_rol 
ORDER BY 
    CASE codigo 
        WHEN 'ADMIN_AGROMANO' THEN 1
        WHEN 'SUPERVISOR_CAMPO' THEN 2
        WHEN 'GERENTE_RRHH' THEN 3
        WHEN 'SUPERVISOR_RRHH' THEN 4
        WHEN 'EMPLEADO_CAMPO' THEN 5
        WHEN 'VISUAL_SOLO_LECTURA' THEN 6
        ELSE 7
    END;

SELECT '=== PERMISOS POR ROL ===' as info;
SELECT 
    r.codigo as 'Rol',
    COUNT(rp.permiso_id) as 'Total_Permisos'
FROM mom_rol r
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id AND rp.deleted_at IS NULL
GROUP BY r.rol_id, r.codigo, r.nombre
ORDER BY COUNT(rp.permiso_id) DESC;

SELECT '=== USUARIOS CONFIGURADOS ===' as info;
SELECT 
    u.username as 'Email_Auth0',
    r.codigo as 'Rol_Asignado',
    r.nombre as 'Nombre_Rol'
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
WHERE u.username LIKE '%@agromano.com%';

SELECT '✅ MATRIZ DE ROLES IMPLEMENTADA COMPLETAMENTE' as resultado;
