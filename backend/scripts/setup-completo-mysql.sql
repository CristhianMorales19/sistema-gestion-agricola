-- ================================================================
-- SCRIPT PARA CONFIGURAR USUARIOS ADMIN Y DATOS INICIALES
-- Compatible con el esquema Prisma y MySQL
-- ================================================================

-- Usar la base de datos AgroMano
USE AgroMano;

-- ================================================================
-- 1. CREAR ROLES ADMINISTRATIVOS
-- ================================================================

-- Insertar roles si no existen (usando INSERT IGNORE)
INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN_AGROMANO', 'Administrador del Sistema', 'Administrador con acceso completo al sistema AgroMano', NOW(), true, true, NOW(), 1),
('SUPERVISOR_CAMPO', 'Supervisor de Campo', 'Supervisor de operaciones de campo y productividad', NOW(), false, true, NOW(), 1),
('GERENTE_RRHH', 'Gerente de Recursos Humanos', 'Gerente con permisos completos de RRHH y nómina', NOW(), false, true, NOW(), 1),
('SUPERVISOR_RRHH', 'Supervisor de RRHH', 'Supervisor con permisos limitados de RRHH', NOW(), false, true, NOW(), 1);

-- ================================================================
-- 2. CREAR PERMISOS GRANULARES
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
-- 3. DATOS INICIALES ESPECÍFICOS PARA PIÑA
-- ================================================================

-- Crear cultivos de piña
INSERT IGNORE INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, created_by) VALUES
('Piña', 'Cultivo principal de piña (Ananas comosus)', 'unidades', 'Todo el año', true, NOW(), 1),
('Piña Premium', 'Variedad premium de piña para exportación', 'unidades', 'Todo el año', true, NOW(), 1);

-- Obtener ID del cultivo de piña
SET @cultivo_pina_id = (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña' AND is_activo = true);

-- Crear tareas específicas para piña (solo si no existen)
INSERT IGNORE INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, instrucciones, is_activo, created_at, created_by) VALUES
(@cultivo_pina_id, 'Siembra de Corona', 'Plantación de coronas de piña en terreno preparado', 'unidades/hora', 25.0000, 'Plantar coronas con espaciamiento de 30cm entre plantas', true, NOW(), 1),
(@cultivo_pina_id, 'Deshierbe Manual', 'Eliminación manual de malezas alrededor de plantas', 'hectáreas/día', 0.5000, 'Remover malezas sin dañar raíces superficiales', true, NOW(), 1),
(@cultivo_pina_id, 'Aplicación de Fertilizante', 'Aplicación de fertilizante específico para piña', 'hectáreas/día', 2.0000, 'Aplicar fertilizante según cronograma nutricional', true, NOW(), 1),
(@cultivo_pina_id, 'Control de Plagas', 'Aplicación de tratamientos contra plagas comunes', 'hectáreas/día', 3.0000, 'Identificar plagas y aplicar tratamiento adecuado', true, NOW(), 1),
(@cultivo_pina_id, 'Cosecha de Piña', 'Recolección de piñas maduras', 'unidades/hora', 15.0000, 'Cortar piñas en punto óptimo de maduración', true, NOW(), 1),
(@cultivo_pina_id, 'Clasificación y Empaque', 'Clasificar piñas por calidad y empacar', 'unidades/hora', 20.0000, 'Clasificar por tamaño, peso y calidad visual', true, NOW(), 1),
(@cultivo_pina_id, 'Mantenimiento de Canales', 'Limpieza y mantenimiento de sistema de drenaje', 'metros/día', 200.0000, 'Mantener canales libres de sedimentos', true, NOW(), 1),
(@cultivo_pina_id, 'Poda de Hijuelos', 'Eliminación selectiva de hijuelos', 'plantas/hora', 30.0000, 'Podar hijuelos excesivos para concentrar energía', true, NOW(), 1);

-- Crear parcelas ejemplo
INSERT IGNORE INTO mom_parcela (nombre, ubicacion_descripcion, area_hectareas, tipo_terreno, descripcion, estado, is_activa, created_at, created_by) VALUES
('Parcela A-1', 'Sector Norte - Lote 1', 5.50, 'Franco-arcilloso', 'Parcela principal para piña de exportación', 'disponible', true, NOW(), 1),
('Parcela A-2', 'Sector Norte - Lote 2', 4.25, 'Franco-arenoso', 'Parcela secundaria para piña nacional', 'disponible', true, NOW(), 1),
('Parcela B-1', 'Sector Sur - Lote 1', 6.00, 'Franco', 'Parcela nueva en preparación', 'en_preparacion', true, NOW(), 1),
('Parcela C-1', 'Sector Este - Lote 1', 3.75, 'Franco-arcilloso', 'Parcela para pruebas varietales', 'disponible', true, NOW(), 1);

-- Crear cuadrillas ejemplo
INSERT IGNORE INTO mom_cuadrilla (codigo_identificador, nombre, descripcion, area_trabajo, fecha_creacion_at, is_activa, created_at, created_by) VALUES
('CUA-001', 'Cuadrilla Siembra', 'Especializada en siembra y plantación', 'Sector Norte', NOW(), true, NOW(), 1),
('CUA-002', 'Cuadrilla Mantenimiento', 'Mantenimiento y cuidado de cultivos', 'Sector Norte y Sur', NOW(), true, NOW(), 1),
('CUA-003', 'Cuadrilla Cosecha', 'Especializada en cosecha y post-cosecha', 'Todo el campo', NOW(), true, NOW(), 1),
('CUA-004', 'Cuadrilla Empaque', 'Clasificación y empaque de productos', 'Centro de empaque', NOW(), true, NOW(), 1);

-- ================================================================
-- 4. ASIGNAR PERMISOS A ROLES
-- ================================================================

-- Obtener IDs de roles
SET @admin_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');
SET @supervisor_campo_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');
SET @gerente_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH');
SET @supervisor_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

-- ADMIN_AGROMANO: TODOS LOS PERMISOS
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @admin_id, permiso_id, NOW(), 1 FROM mom_permiso WHERE is_activo = 1;

-- SUPERVISOR_CAMPO: Permisos específicos de campo
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
-- 5. CREAR USUARIOS ADMINISTRATIVOS
-- ================================================================

-- IMPORTANTE: Los usernames DEBEN coincidir con los emails que usarás en Auth0
INSERT IGNORE INTO mot_usuario (username, password_hash, rol_id, estado, created_at, created_by) VALUES
('admin@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @admin_id, 'activo', NOW(), 1),
('supervisor.campo@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @supervisor_campo_id, 'activo', NOW(), 1),
('gerente.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @gerente_rrhh_id, 'activo', NOW(), 1),
('supervisor.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0.authentication', @supervisor_rrhh_id, 'activo', NOW(), 1);

-- ================================================================
-- 6. VERIFICACIÓN Y RESULTADOS
-- ================================================================

-- Verificar usuarios creados
SELECT 
    'USUARIOS ADMINISTRATIVOS CREADOS:' as info;

SELECT 
    u.usuario_id,
    u.username as email_para_auth0,
    r.codigo as rol_codigo,
    r.nombre as rol_nombre,
    u.estado,
    COUNT(rp.permiso_id) as total_permisos
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
WHERE u.username LIKE '%@agromano.com%'
GROUP BY u.usuario_id, u.username, r.codigo, r.nombre, u.estado
ORDER BY total_permisos DESC;

-- Verificar permisos por rol
SELECT 
    'PERMISOS POR ROL:' as info;

SELECT 
    r.codigo as rol,
    r.nombre as rol_nombre,
    COUNT(rp.permiso_id) as total_permisos
FROM mom_rol r
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
WHERE r.codigo IN ('ADMIN_AGROMANO', 'SUPERVISOR_CAMPO', 'GERENTE_RRHH', 'SUPERVISOR_RRHH')
GROUP BY r.rol_id, r.codigo, r.nombre
ORDER BY total_permisos DESC;

-- Verificar datos de piña
SELECT 
    'DATOS INICIALES CONFIGURADOS:' as info;

SELECT 
    'Cultivos de piña' as tipo, 
    COUNT(*) as total 
FROM mom_cultivo 
WHERE nombre LIKE '%Piña%'
UNION ALL
SELECT 
    'Tareas de piña' as tipo, 
    COUNT(*) as total 
FROM mom_tarea t
JOIN mom_cultivo c ON t.cultivo_id = c.cultivo_id
WHERE c.nombre = 'Piña'
UNION ALL
SELECT 'Parcelas' as tipo, COUNT(*) as total FROM mom_parcela
UNION ALL
SELECT 'Cuadrillas' as tipo, COUNT(*) as total FROM mom_cuadrilla;

-- Resultado final
SELECT 
    '✅ CONFIGURACIÓN COMPLETADA' as resultado,
    'Usuarios admin listos para Auth0' as siguiente_paso;
