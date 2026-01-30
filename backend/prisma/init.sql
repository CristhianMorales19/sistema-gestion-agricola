-- ================================================================
-- CONFIGURACIÓN COMPLETA PARA SISTEMA AGROMANO CON AUTH0
-- ================================================================

-- 1. CREAR ROLES
INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN_AGROMANO', 'Administrador del Sistema', 'Administrador con acceso completo', NOW(), true, true, NOW(), 1),
('SUPERVISOR_CAMPO', 'Supervisor de Campo', 'Supervisor de operaciones de campo', NOW(), false, true, NOW(), 1),
('GERENTE_RRHH', 'Gerente de RRHH', 'Gerente con permisos de RRHH y nómina', NOW(), false, true, NOW(), 1),
('SUPERVISOR_RRHH', 'Supervisor de RRHH', 'Supervisor con permisos limitados', NOW(), false, true, NOW(), 1);

-- 2. CREAR PERMISOS GRANULARES
INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
('trabajadores:read:all', 'Ver todos trabajadores', 'Personal', 'Ver información de todos los trabajadores', 1, NOW(), 1),
('trabajadores:create', 'Crear trabajadores', 'Personal', 'Registrar nuevos trabajadores', 1, NOW(), 1),
('trabajadores:update:all', 'Actualizar trabajadores', 'Personal', 'Editar cualquier trabajador', 1, NOW(), 1),
('trabajadores:delete', 'Eliminar trabajadores', 'Personal', 'Eliminar trabajadores', 1, NOW(), 1),
('trabajadores:export', 'Exportar trabajadores', 'Personal', 'Exportar datos de trabajadores', 1, NOW(), 1),
('asistencia:read:all', 'Ver toda asistencia', 'Asistencia', 'Ver registros de todos', 1, NOW(), 1),
('asistencia:update', 'Actualizar asistencia', 'Asistencia', 'Modificar registros', 1, NOW(), 1),
('asistencia:approve', 'Aprobar asistencia', 'Asistencia', 'Aprobar registros', 1, NOW(), 1),
('asistencia:reports', 'Reportes asistencia', 'Asistencia', 'Generar reportes', 1, NOW(), 1),
('nomina:process', 'Procesar nómina', 'Nomina', 'Procesar nóminas', 1, NOW(), 1),
('nomina:read:all', 'Ver nóminas', 'Nomina', 'Ver nóminas de todos', 1, NOW(), 1),
('nomina:approve', 'Aprobar nóminas', 'Nomina', 'Aprobar nóminas', 1, NOW(), 1),
('nomina:reports', 'Reportes nómina', 'Nomina', 'Generar reportes', 1, NOW(), 1),
('productividad:read:all', 'Ver productividad', 'Productividad', 'Ver productividad de todos', 1, NOW(), 1),
('productividad:reports', 'Reportes productividad', 'Productividad', 'Generar reportes', 1, NOW(), 1),
('tareas:create', 'Crear tareas', 'Tareas', 'Crear nuevas tareas', 1, NOW(), 1),
('tareas:assign', 'Asignar tareas', 'Tareas', 'Asignar tareas', 1, NOW(), 1),
('reportes:read:advanced', 'Reportes avanzados', 'Reportes', 'Ver reportes avanzados', 1, NOW(), 1),
('dashboard:view:advanced', 'Dashboard avanzado', 'Dashboard', 'Ver dashboard avanzado', 1, NOW(), 1);

-- 3. ASIGNAR PERMISOS A ROLES

-- ADMIN: Todos los permisos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
  (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO'),
  permiso_id,
  NOW(),
  1
FROM mom_permiso
WHERE is_activo = 1;

-- SUPERVISOR CAMPO
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
  (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO'),
  permiso_id,
  NOW(),
  1
FROM mom_permiso
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all', 'asistencia:approve', 'productividad:read:all', 'tareas:create', 'tareas:assign', 'reportes:read:advanced');

-- GERENTE RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
  (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH'),
  permiso_id,
  NOW(),
  1
FROM mom_permiso
WHERE codigo IN (
  'trabajadores:create', 'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:delete',
  'asistencia:read:all', 'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:reports', 'reportes:read:advanced'
);

-- SUPERVISOR RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
  (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH'),
  permiso_id,
  NOW(),
  1
FROM mom_permiso
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all');

-- 4. CREAR USUARIOS AUTH0

INSERT IGNORE INTO mot_usuario (
  trabajador_id, auth0_user_id, auth0_id, username, email, password_hash, rol_id, estado, created_at, created_by
) VALUES
(
  NULL,
  'auth0|68c6f8947a6e3d8d71f0360f',
  'auth0|68c6f8947a6e3d8d71f0360f',
  'admin@agromano.com',
  'admin@agromano.com',
  'auth0_managed',
  (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO'),
  'activo',
  NOW(),
  1
),
(
  NULL,
  'auth0|68cb20febf717e002030f72b',
  'auth0|68cb20febf717e002030f72b',
  'supervisor.campo@agromano.com',
  'supervisor.campo@agromano.com',
  'auth0_managed',
  (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO'),
  'activo',
  NOW(),
  1
),
(
  NULL,
  'auth0|68c6f9487a6e3d8d71f0364e',
  'auth0|68c6f9487a6e3d8d71f0364e',
  'gerente.rrhh@agromano.com',
  'gerente.rrhh@agromano.com',
  'auth0_managed',
  (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH'),
  'activo',
  NOW(),
  1
),
(
  NULL,
  'auth0|68c6f91e7a6e3d8d71f03641',
  'auth0|68c6f91e7a6e3d8d71f03641',
  'supervisor.rrhh@agromano.com',
  'supervisor.rrhh@agromano.com',
  'auth0_managed',
  (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH'),
  'activo',
  NOW(),
  1
);

-- 5. CULTIVO PIÑA
INSERT IGNORE INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, created_by)
VALUES ('Piña', 'Cultivo principal de piña', 'unidades', 'Todo el año', true, NOW(), 1);

INSERT IGNORE INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, is_activo, created_at, created_by)
VALUES
(
  (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña'),
  'Siembra de Corona', 'Plantación de coronas', 'unidades/hora', 25.0, true, NOW(), 1
),
(
  (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña'),
  'Cosecha de Piña', 'Recolección de piñas maduras', 'unidades/hora', 15.0, true, NOW(), 1
),
(
  (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña'),
  'Clasificación y Empaque', 'Clasificar y empacar', 'unidades/hora', 20.0, true, NOW(), 1
);
