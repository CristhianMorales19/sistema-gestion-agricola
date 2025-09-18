-- Script para crear usuarios administrativos en la base de datos
-- Ejecutar esto en MySQL Workbench antes de crear usuarios en Auth0

-- 1. Crear roles si no existen
INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN_AGROMANO', 'Administrador del Sistema', 'Administrador con acceso completo al sistema', NOW(), true, true, NOW(), 1),
('SUPERVISOR_CAMPO', 'Supervisor de Campo', 'Supervisor de operaciones de campo', NOW(), false, true, NOW(), 1),
('GERENTE_RRHH', 'Gerente de Recursos Humanos', 'Gerente con permisos completos de RRHH', NOW(), false, true, NOW(), 1),
('SUPERVISOR_RRHH', 'Supervisor de RRHH', 'Supervisor con permisos limitados de RRHH', NOW(), false, true, NOW(), 1);

-- 2. Obtener IDs de los roles
SET @admin_rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');
SET @supervisor_campo_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');
SET @gerente_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH');
SET @supervisor_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

-- 3. Crear usuarios administrativos
-- IMPORTANTE: Los usernames DEBEN coincidir con los emails que usarás en Auth0
INSERT INTO mot_usuario (username, password_hash, rol_id, estado, created_at, created_by) VALUES
('admin@agromano.com', '$2b$10$dummy.hash.for.auth0', @admin_rol_id, 'activo', NOW(), 1),
('supervisor.campo@agromano.com', '$2b$10$dummy.hash.for.auth0', @supervisor_campo_id, 'activo', NOW(), 1),
('gerente.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @gerente_rrhh_id, 'activo', NOW(), 1),
('supervisor.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @supervisor_rrhh_id, 'activo', NOW(), 1);

-- 4. Verificar que se crearon correctamente
SELECT 
    u.usuario_id,
    u.username,
    r.codigo as rol,
    r.nombre as rol_nombre,
    u.estado
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
WHERE u.username LIKE '%@agromano.com%';
