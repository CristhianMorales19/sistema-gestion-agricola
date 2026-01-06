-- ================================================================
-- MIGRATION: Agregar permiso gestionar_condiciones_trabajo
-- Fecha: 2024-12-24
-- Descripción: Agrega el permiso para gestionar condiciones de trabajo
--              y lo asigna a roles que lo necesitan
-- ================================================================

USE AgroMano;

-- 1. Insertar el permiso si no existe
INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
('gestionar_condiciones_trabajo', 'Gestionar Condiciones de Trabajo', 'Condiciones de Trabajo', 'Permite crear, editar y eliminar condiciones de trabajo', 1, NOW(), 1);

-- 2. Obtener el ID del permiso recién creado
SET @permiso_id = (SELECT permiso_id FROM mom_permiso WHERE codigo = 'gestionar_condiciones_trabajo' LIMIT 1);

-- 3. Asignar el permiso a los roles que lo necesitan
-- ADMIN_AGROMANO
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO' LIMIT 1),
    @permiso_id,
    NOW(),
    1
WHERE EXISTS (SELECT 1 FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');

-- SUPERVISOR_CAMPO
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO' LIMIT 1),
    @permiso_id,
    NOW(),
    1
WHERE EXISTS (SELECT 1 FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');

-- GERENTE_RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH' LIMIT 1),
    @permiso_id,
    NOW(),
    1
WHERE EXISTS (SELECT 1 FROM mom_rol WHERE codigo = 'GERENTE_RRHH');

-- SUPERVISOR_RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH' LIMIT 1),
    @permiso_id,
    NOW(),
    1
WHERE EXISTS (SELECT 1 FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

-- Verificación: mostrar el resultado
SELECT 
    'Permiso agregado correctamente' AS estado,
    p.codigo,
    p.nombre,
    COUNT(rp.permiso_id) AS 'Total de roles asignados'
FROM mom_permiso p
LEFT JOIN rel_mom_rol__mom_permiso rp ON p.permiso_id = rp.permiso_id
WHERE p.codigo = 'gestionar_condiciones_trabajo'
GROUP BY p.permiso_id, p.codigo, p.nombre;
