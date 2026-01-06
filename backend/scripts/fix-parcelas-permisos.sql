-- ================================================================
-- FIX: Agregar permisos de parcelas faltantes
-- Ejecutar si el módulo de parcelas no funciona
-- ================================================================

-- 1. Verificar si existe el permiso parcelas:read
SELECT * FROM mom_permiso WHERE codigo LIKE 'parcelas%';

-- 2. Insertar permisos de parcelas si no existen
INSERT IGNORE INTO mom_permiso (codigo, nombre, modulo, descripcion, is_activo, created_at, created_by)
VALUES 
('parcelas:read', 'Ver parcelas', 'Cultivos', 'Ver información de parcelas', 1, NOW(), 1),
('parcelas:read:all', 'Ver todas las parcelas', 'Cultivos', 'Ver todas las parcelas del sistema', 1, NOW(), 1),
('parcelas:read:own', 'Ver parcelas propias', 'Cultivos', 'Ver parcelas asignadas', 1, NOW(), 1),
('parcelas:create', 'Crear parcelas', 'Cultivos', 'Crear nuevas parcelas', 1, NOW(), 1),
('parcelas:update', 'Actualizar parcelas', 'Cultivos', 'Modificar información de parcelas', 1, NOW(), 1),
('parcelas:delete', 'Eliminar parcelas', 'Cultivos', 'Eliminar parcelas del sistema', 1, NOW(), 1);

-- 3. Asignar permisos de parcelas al rol ADMIN_AGROMANO
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    r.rol_id,
    p.permiso_id, 
    NOW(), 
    1 
FROM mom_rol r
CROSS JOIN mom_permiso p
WHERE r.codigo = 'ADMIN_AGROMANO'
AND p.codigo IN ('parcelas:read', 'parcelas:read:all', 'parcelas:create', 'parcelas:update', 'parcelas:delete');

-- 4. Asignar permisos de parcelas al rol SUPERVISOR_CAMPO
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    r.rol_id,
    p.permiso_id, 
    NOW(), 
    1 
FROM mom_rol r
CROSS JOIN mom_permiso p
WHERE r.codigo = 'SUPERVISOR_CAMPO'
AND p.codigo IN ('parcelas:read', 'parcelas:read:all', 'parcelas:update');

-- 5. Asignar permisos de parcelas al rol GERENTE_RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 
    r.rol_id,
    p.permiso_id, 
    NOW(), 
    1 
FROM mom_rol r
CROSS JOIN mom_permiso p
WHERE r.codigo = 'GERENTE_RRHH'
AND p.codigo IN ('parcelas:read', 'parcelas:read:all');

-- 6. Verificar asignaciones
SELECT 
    r.codigo as rol,
    p.codigo as permiso
FROM rel_mom_rol__mom_permiso rp
JOIN mom_rol r ON r.rol_id = rp.rol_id
JOIN mom_permiso p ON p.permiso_id = rp.permiso_id
WHERE p.codigo LIKE 'parcelas%'
ORDER BY r.codigo, p.codigo;
