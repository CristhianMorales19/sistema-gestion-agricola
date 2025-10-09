-- ================================================================
-- CONFIGURACIÓN COMPLETA PARA SISTEMA AGROMANO CON AUTH0
-- ================================================================

USE agromano;

-- 1. CREAR ROLES
INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN_AGROMANO', 'Administrador del Sistema', 'Administrador con acceso completo', NOW(), true, true, NOW(), 1),
('SUPERVISOR_CAMPO', 'Supervisor de Campo', 'Supervisor de operaciones de campo', NOW(), false, true, NOW(), 1),
('GERENTE_RRHH', 'Gerente de RRHH', 'Gerente con permisos de RRHH y nómina', NOW(), false, true, NOW(), 1),
('SUPERVISOR_RRHH', 'Supervisor de RRHH', 'Supervisor con permisos limitados', NOW(), false, true, NOW(), 1);

-- 2. CREAR PERMISOS GRANULARES
INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
-- Personal
('trabajadores:read:all', 'Ver todos trabajadores', 'Personal', 'Ver información de todos los trabajadores', 1, NOW(), 1),
('trabajadores:create', 'Crear trabajadores', 'Personal', 'Registrar nuevos trabajadores', 1, NOW(), 1),
('trabajadores:update:all', 'Actualizar trabajadores', 'Personal', 'Editar cualquier trabajador', 1, NOW(), 1),
('trabajadores:delete', 'Eliminar trabajadores', 'Personal', 'Eliminar trabajadores', 1, NOW(), 1),
('trabajadores:export', 'Exportar trabajadores', 'Personal', 'Exportar datos de trabajadores', 1, NOW(), 1),
-- Asistencia
('asistencia:read:all', 'Ver toda asistencia', 'Asistencia', 'Ver registros de todos', 1, NOW(), 1),
('asistencia:update', 'Actualizar asistencia', 'Asistencia', 'Modificar registros', 1, NOW(), 1),
('asistencia:approve', 'Aprobar asistencia', 'Asistencia', 'Aprobar registros', 1, NOW(), 1),
('asistencia:reports', 'Reportes asistencia', 'Asistencia', 'Generar reportes', 1, NOW(), 1),
-- Nómina
('nomina:process', 'Procesar nómina', 'Nomina', 'Procesar nóminas', 1, NOW(), 1),
('nomina:read:all', 'Ver nóminas', 'Nomina', 'Ver nóminas de todos', 1, NOW(), 1),
('nomina:approve', 'Aprobar nóminas', 'Nomina', 'Aprobar nóminas', 1, NOW(), 1),
('nomina:reports', 'Reportes nómina', 'Nomina', 'Generar reportes', 1, NOW(), 1),
-- Productividad
('productividad:read:all', 'Ver productividad', 'Productividad', 'Ver productividad de todos', 1, NOW(), 1),
('productividad:reports', 'Reportes productividad', 'Productividad', 'Generar reportes', 1, NOW(), 1),
-- Tareas
('tareas:create', 'Crear tareas', 'Tareas', 'Crear nuevas tareas', 1, NOW(), 1),
('tareas:assign', 'Asignar tareas', 'Tareas', 'Asignar tareas', 1, NOW(), 1),
-- Reportes
('reportes:read:advanced', 'Reportes avanzados', 'Reportes', 'Ver reportes avanzados', 1, NOW(), 1),
('dashboard:view:advanced', 'Dashboard avanzado', 'Dashboard', 'Ver dashboard avanzado', 1, NOW(), 1);

-- 3. OBTENER IDs DE ROLES
SET @admin_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');
SET @supervisor_campo_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');
SET @gerente_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH');
SET @supervisor_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

-- 4. ASIGNAR PERMISOS A ROLES
-- ADMIN: Todos los permisos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @admin_id, permiso_id, NOW(), 1 FROM mom_permiso WHERE is_activo = 1;

-- SUPERVISOR CAMPO: Permisos específicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_campo_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all', 'asistencia:approve', 'productividad:read:all', 'tareas:create', 'tareas:assign', 'reportes:read:advanced');

-- GERENTE RRHH: Permisos de RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @gerente_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:create', 'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:delete', 
<<<<<<< HEAD
                 'asistencia:read:all', 'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:reports', 'reportes:read:advanced');
=======
                    'asistencia:read:all', 'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:reports', 'reportes:read:advanced');
>>>>>>> 5a7c7fa (Primer commit)

-- SUPERVISOR RRHH: Permisos limitados
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all');

-- 5. CREAR USUARIOS ADMINISTRATIVOS CON AUTH0
-- Crear usuario admin con Auth0
-- INSERT IGNORE INTO moh_trabajador_historial (
--     cambio_tipo, datos_nuevos, usuario_accion, 
--     fecha_accion_at, created_at
-- ) VALUES (
--     'CREACION_USUARIO_AUTH0', 
--     '{"auth0_user_id": "auth0|68c6f8947a6e3d8d71f0360f", "email": "admin@agromano.com"}',
--     1, NOW(), NOW()
-- );

INSERT IGNORE INTO mot_usuario (
<<<<<<< HEAD
    trabajador_id, auth0_user_id, username, password_hash, rol_id, estado,
=======
    trabajador_id, auth0_user_id, auth0_id, username, email, password_hash, rol_id, estado,
>>>>>>> 5a7c7fa (Primer commit)
    created_at, created_by
) VALUES (
    NULL, 
    'auth0|68c6f8947a6e3d8d71f0360f',
<<<<<<< HEAD
=======
    'auth0|68c6f8947a6e3d8d71f0360f',
    'admin@agromano.com',
>>>>>>> 5a7c7fa (Primer commit)
    'admin@agromano.com',
    'auth0_managed', 
    @admin_id,
    'activo',
    NOW(),
    1
);

-- -- Crear usuario supervisor campo con Auth0
-- INSERT IGNORE INTO moh_trabajador_historial (
--     cambio_tipo, datos_nuevos, usuario_accion, 
--     fecha_accion_at, created_at
-- ) VALUES (
--     'CREACION_USUARIO_AUTH0', 
--     '{"auth0_user_id": "auth0|68cb20febf717e002030f72b", "email": "supervisor.campo@agromano.com"}',
--     1, NOW(), NOW()
-- );

INSERT IGNORE INTO mot_usuario (
<<<<<<< HEAD
    trabajador_id, auth0_user_id, username, password_hash, rol_id, estado,
=======
    trabajador_id, auth0_user_id, auth0_id, username, email, password_hash, rol_id, estado,
>>>>>>> 5a7c7fa (Primer commit)
    created_at, created_by
) VALUES (
    NULL,
    'auth0|68cb20febf717e002030f72b',
<<<<<<< HEAD
    'supervisor.campo@agromano.com',
    'auth0_managed', 
=======
    'auth0|68cb20febf717e002030f72b',
    'supervisor.campo@agromano.com',
    'supervisor.campo@agromano.com',
    'auth0_managed',
>>>>>>> 5a7c7fa (Primer commit)
    @supervisor_campo_id,
    'activo',
    NOW(),
    1
);

-- Crear usuario gerente RRHH con Auth0
-- INSERT IGNORE INTO moh_trabajador_historial (
--     cambio_tipo, datos_nuevos, usuario_accion, 
--     fecha_accion_at, created_at
-- ) VALUES (
--     'CREACION_USUARIO_AUTH0', 
--     '{"auth0_user_id": "auth0|68c6f9487a6e3d8d71f0364e", "email": "gerente.rrhh@agromano.com"}',
--     1, NOW(), NOW()
-- );

INSERT IGNORE INTO mot_usuario (
<<<<<<< HEAD
    trabajador_id, auth0_user_id, username, password_hash, rol_id, estado,
=======
    trabajador_id, auth0_user_id, auth0_id, username, email, password_hash, rol_id, estado,
>>>>>>> 5a7c7fa (Primer commit)
    created_at, created_by
) VALUES (
    NULL,
    'auth0|68c6f9487a6e3d8d71f0364e',
<<<<<<< HEAD
    'gerente.rrhh@agromano.com',
    'auth0_managed', 
=======
    'auth0|68c6f9487a6e3d8d71f0364e',
    'gerente.rrhh@agromano.com',
    'gerente.rrhh@agromano.com',
    'auth0_managed',
>>>>>>> 5a7c7fa (Primer commit)
    @gerente_rrhh_id,
    'activo',
    NOW(),
    1
);

-- Crear usuario supervisor RRHH con Auth0
-- INSERT IGNORE INTO moh_trabajador_historial (
--     cambio_tipo, datos_nuevos, usuario_accion, 
--     fecha_accion_at, created_at
-- ) VALUES (
--     'CREACION_USUARIO_AUTH0', 
--     '{"auth0_user_id": "auth0|68c6f91e7a6e3d8d71f03641", "email": "supervisor.rrhh@agromano.com"}',
--     1, NOW(), NOW()
-- );

INSERT IGNORE INTO mot_usuario (
<<<<<<< HEAD
    trabajador_id, auth0_user_id, username, password_hash, rol_id, estado,
=======
    trabajador_id, auth0_user_id, auth0_id, username, email, password_hash, rol_id, estado,
>>>>>>> 5a7c7fa (Primer commit)
    created_at, created_by
) VALUES (
    NULL,
    'auth0|68c6f91e7a6e3d8d71f03641',
<<<<<<< HEAD
=======
    'auth0|68c6f91e7a6e3d8d71f03641',
    'supervisor.rrhh@agromano.com',
>>>>>>> 5a7c7fa (Primer commit)
    'supervisor.rrhh@agromano.com',
    'auth0_managed', 
    @supervisor_rrhh_id,
    'activo',
    NOW(),
    1
);

-- 6. DATOS INICIALES PARA PIÑA
INSERT IGNORE INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, created_by) VALUES
('Piña', 'Cultivo principal de piña', 'unidades', 'Todo el año', true, NOW(), 1);

SET @cultivo_pina_id = (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña');

INSERT IGNORE INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, is_activo, created_at, created_by) VALUES
(@cultivo_pina_id, 'Siembra de Corona', 'Plantación de coronas', 'unidades/hora', 25.0, true, NOW(), 1),
(@cultivo_pina_id, 'Cosecha de Piña', 'Recolección de piñas maduras', 'unidades/hora', 15.0, true, NOW(), 1),
(@cultivo_pina_id, 'Clasificación y Empaque', 'Clasificar y empacar', 'unidades/hora', 20.0, true, NOW(), 1);

-- 7. VERIFICACIÓN
SELECT 'USUARIOS CREADOS CON AUTH0:' as info;
SELECT 
    u.usuario_id,
    u.auth0_user_id,
    u.username,
    r.nombre as rol,
    u.estado
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
WHERE u.auth0_user_id IS NOT NULL;

SELECT 'PERMISOS POR ROL:' as info;
SELECT 
    r.rol_id,
    r.nombre as rol_nombre,
    COUNT(rp.permiso_id) as total_permisos,
    GROUP_CONCAT(p.codigo SEPARATOR ', ') as permisos
FROM mom_rol r
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
LEFT JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
WHERE r.codigo IN ('ADMIN_AGROMANO', 'SUPERVISOR_CAMPO', 'GERENTE_RRHH', 'SUPERVISOR_RRHH')
GROUP BY r.rol_id, r.nombre;