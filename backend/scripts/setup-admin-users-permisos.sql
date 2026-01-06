-- ================================================================
-- SCRIPT PARA USUARIOS ADMIN Y PERMISOS - SISTEMA AGROMANO
-- Basado en la MATRIZ DE ROLES Y PERMISOS compartida
-- ================================================================

USE AgroMano;

-- ================================================================
-- 1. INSERTAR PERMISOS SEGÚN LA MATRIZ
-- ================================================================

INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES

-- Personal/Trabajadores
('trabajadores:read:all', 'Ver todos los trabajadores', 'Personal', 'Permiso para ver información de todos los trabajadores', 1, NOW(), 1),
('trabajadores:read:own', 'Ver trabajadores propios', 'Personal', 'Permiso para ver solo trabajadores asignados', 1, NOW(), 1),
('trabajadores:create', 'Crear trabajadores', 'Personal', 'Permiso para registrar nuevos trabajadores', 1, NOW(), 1),
('trabajadores:update:all', 'Actualizar todos los trabajadores', 'Personal', 'Permiso para editar cualquier trabajador', 1, NOW(), 1),
('trabajadores:update:own', 'Actualizar trabajadores propios', 'Personal', 'Permiso para editar trabajadores asignados', 1, NOW(), 1),
('trabajadores:delete', 'Eliminar trabajadores', 'Personal', 'Permiso para eliminar trabajadores', 1, NOW(), 1),
('trabajadores:import', 'Importar trabajadores', 'Personal', 'Permiso para importar trabajadores masivamente', 1, NOW(), 1),
('trabajadores:export', 'Exportar trabajadores', 'Personal', 'Permiso para exportar datos de trabajadores', 1, NOW(), 1),

-- Asistencia
('asistencia:read:all', 'Ver toda la asistencia', 'Asistencia', 'Permiso para ver registros de asistencia de todos', 1, NOW(), 1),
('asistencia:read:own', 'Ver asistencia propia', 'Asistencia', 'Permiso para ver solo registros propios', 1, NOW(), 1),
('asistencia:register', 'Registrar asistencia', 'Asistencia', 'Permiso para registrar asistencia', 1, NOW(), 1),
('asistencia:update', 'Actualizar asistencia', 'Asistencia', 'Permiso para modificar registros de asistencia', 1, NOW(), 1),
('asistencia:approve', 'Aprobar asistencia', 'Asistencia', 'Permiso para aprobar registros de asistencia', 1, NOW(), 1),
('asistencia:reports', 'Reportes de asistencia', 'Asistencia', 'Permiso para generar reportes de asistencia', 1, NOW(), 1),
('asistencia:dashboard', 'Dashboard de asistencia', 'Asistencia', 'Permiso para ver dashboard de asistencia', 1, NOW(), 1),

-- Permisos y Licencias
('permisos:create', 'Crear permisos', 'Permisos', 'Permiso para crear solicitudes de permisos', 1, NOW(), 1),
('permisos:approve', 'Aprobar permisos', 'Permisos', 'Permiso para aprobar solicitudes de permisos', 1, NOW(), 1),
('permisos:read', 'Ver permisos', 'Permisos', 'Permiso para consultar permisos', 1, NOW(), 1),

-- Nómina
('nomina:process', 'Procesar nómina', 'Nomina', 'Permiso para procesar nóminas', 1, NOW(), 1),
('nomina:read:all', 'Ver todas las nóminas', 'Nomina', 'Permiso para ver nóminas de todos', 1, NOW(), 1),
('nomina:approve', 'Aprobar nóminas', 'Nomina', 'Permiso para aprobar nóminas', 1, NOW(), 1),
('nomina:calculate', 'Calcular nóminas', 'Nomina', 'Permiso para realizar cálculos de nómina', 1, NOW(), 1),
('nomina:reports', 'Reportes de nómina', 'Nomina', 'Permiso para generar reportes de nómina', 1, NOW(), 1),
('nomina:export', 'Exportar nóminas', 'Nomina', 'Permiso para exportar datos de nómina', 1, NOW(), 1),

-- Productividad
('productividad:read:all', 'Ver toda la productividad', 'Productividad', 'Permiso para ver productividad de todos', 1, NOW(), 1),
('productividad:register:others', 'Registrar productividad de otros', 'Productividad', 'Permiso para registrar productividad de otros trabajadores', 1, NOW(), 1),
('productividad:reports', 'Reportes de productividad', 'Productividad', 'Permiso para generar reportes de productividad', 1, NOW(), 1),

-- Tareas y Metas
('tareas:create', 'Crear tareas', 'Tareas', 'Permiso para crear nuevas tareas', 1, NOW(), 1),
('tareas:assign', 'Asignar tareas', 'Tareas', 'Permiso para asignar tareas a trabajadores', 1, NOW(), 1),
('metas:set', 'Establecer metas', 'Metas', 'Permiso para establecer metas de productividad', 1, NOW(), 1),
('metas:track', 'Seguimiento de metas', 'Metas', 'Permiso para hacer seguimiento de metas', 1, NOW(), 1),

-- Reportes
('reportes:read:advanced', 'Reportes avanzados', 'Reportes', 'Permiso para ver reportes avanzados', 1, NOW(), 1),
('reportes:export', 'Exportar reportes', 'Reportes', 'Permiso para exportar reportes', 1, NOW(), 1),
('dashboard:view:advanced', 'Dashboard avanzado', 'Dashboard', 'Permiso para ver dashboard avanzado', 1, NOW(), 1),

-- Gestión de horarios
('horarios:manage', 'Gestión de horarios', 'Horarios', 'Permiso para gestionar horarios', 1, NOW(), 1),

-- Gestión de salarios y bonificaciones
('salarios:update', 'Actualizar salarios', 'Salarios', 'Permiso para actualizar salarios', 1, NOW(), 1),
('bonificaciones:manage', 'Gestión de bonificaciones', 'Bonificaciones', 'Permiso para gestionar bonificaciones', 1, NOW(), 1),
('deducciones:manage', 'Gestión de deducciones', 'Deducciones', 'Permiso para gestionar deducciones', 1, NOW(), 1);

-- ================================================================
-- 2. ACTUALIZAR ROLES EXISTENTES
-- ================================================================

UPDATE mom_rol SET 
    codigo = 'ADMIN_AGROMANO', 
    nombre = 'Administrador AgroMano',
    descripcion = 'Administrador del sistema con acceso completo'
WHERE codigo = 'ADMIN';

UPDATE mom_rol SET 
    codigo = 'SUPERVISOR_CAMPO', 
    nombre = 'Supervisor de Campo',
    descripcion = 'Supervisor de operaciones de campo'
WHERE codigo = 'SUPER';

UPDATE mom_rol SET 
    codigo = 'SUPERVISOR_RRHH', 
    nombre = 'Supervisor de RRHH',
    descripcion = 'Supervisor con permisos limitados de RRHH'
WHERE codigo = 'OPER';

-- Insertar roles adicionales
INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('GERENTE_RRHH', 'Gerente de Recursos Humanos', 'Gerente con permisos completos de RRHH', NOW(), false, true, NOW(), 1);

-- ================================================================
-- 3. ASIGNAR PERMISOS A ROLES
-- ================================================================

-- Obtener IDs de roles
SET @admin_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');
SET @supervisor_campo_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');
SET @gerente_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH');
SET @supervisor_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

-- ADMIN_AGROMANO: TODOS LOS PERMISOS
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @admin_id, permiso_id, NOW(), 1 FROM mom_permiso WHERE is_activo = 1;

-- SUPERVISOR_CAMPO: Permisos específicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_campo_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN (
    'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:export',
    'asistencia:read:all', 'asistencia:update', 'asistencia:approve', 'asistencia:reports',
    'asistencia:dashboard', 'permisos:approve',
    'productividad:read:all', 'productividad:register:others', 'productividad:reports',
    'tareas:create', 'tareas:assign', 'metas:set', 'metas:track',
    'reportes:read:advanced', 'reportes:export', 'dashboard:view:advanced'
);

-- GERENTE_RRHH: Permisos de RRHH y nómina
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @gerente_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN (
    'trabajadores:create', 'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:delete',
    'trabajadores:import', 'trabajadores:export',
    'asistencia:read:all', 'asistencia:update', 'asistencia:reports', 'permisos:approve',
    'horarios:manage',
    'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:calculate',
    'nomina:reports', 'nomina:export', 'salarios:update', 'bonificaciones:manage', 'deducciones:manage',
    'reportes:read:advanced', 'reportes:export', 'dashboard:view:advanced'
);

-- SUPERVISOR_RRHH: Permisos limitados de RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN (
    'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:export',
    'asistencia:read:all', 'asistencia:reports', 'permisos:read'
);

-- ================================================================
-- 4. CREAR USUARIOS ADMINISTRATIVOS
-- ================================================================

-- IMPORTANTE: Los usernames DEBEN coincidir con los emails que usarás en Auth0
INSERT IGNORE INTO mot_usuario (username, password_hash, rol_id, estado, created_at, created_by) VALUES
('admin@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @admin_id, 'activo', NOW(), 1),
('supervisor.campo@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @supervisor_campo_id, 'activo', NOW(), 1),
('gerente.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @gerente_rrhh_id, 'activo', NOW(), 1),
('supervisor.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @supervisor_rrhh_id, 'activo', NOW(), 1);

-- ================================================================
-- 5. VERIFICACIÓN
-- ================================================================

-- Mostrar usuarios creados con sus roles
SELECT 
    u.usuario_id,
    u.username,
    r.codigo as rol_codigo,
    r.nombre as rol_nombre,
    u.estado,
    COUNT(rp.permiso_id) as total_permisos
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
WHERE u.username LIKE '%@agromano.com%'
GROUP BY u.usuario_id, u.username, r.codigo, r.nombre, u.estado;

-- Mostrar permisos por rol
SELECT 
    r.codigo as rol,
    r.nombre as rol_nombre,
    COUNT(rp.permiso_id) as total_permisos
FROM mom_rol r
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
WHERE r.codigo IN ('ADMIN_AGROMANO', 'SUPERVISOR_CAMPO', 'GERENTE_RRHH', 'SUPERVISOR_RRHH')
GROUP BY r.rol_id, r.codigo, r.nombre
ORDER BY total_permisos DESC;

SELECT '✅ Script completado - Usuarios admin listos para Auth0' as resultado;
