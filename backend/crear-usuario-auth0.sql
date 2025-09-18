-- Script para crear usuario para Auth0 ID: auth0|68b8a6d1bf1669b349577af6

-- 1. Primero crear un trabajador (si no existe)
INSERT INTO agromano.moh_trabajador_historial (
    trabajador_id, cambio_tipo, datos_nuevos, usuario_accion, 
    fecha_accion_at, created_at
) VALUES (
    1, 'CREACION_USUARIO_AUTH0', 
    '{"auth0_user_id": "auth0|68b8a6d1bf1669b349577af6", "email": "usuario@agromano.com"}',
    1, NOW(), NOW()
);

-- 2. Crear el usuario vinculado a Auth0
INSERT INTO agromano.mot_usuario (
    trabajador_id, auth0_user_id, username, password_hash, rol_id, estado,
    created_at, created_by
) VALUES (
    1, 
    'auth0|68b8a6d1bf1669b349577af6',
    "usuario@agromano.com",
    'auth0_managed', 
    1, -- Rol de administrador
    'activo',
    NOW(),
    1
) ON DUPLICATE KEY UPDATE
    username = 'auth0|68b8a6d1bf1669b349577af6',
    estado = 'activo';

-- 3. Verificar que se creó correctamente
SELECT 
    u.usuario_id,
    u.username,
    u.rol_id,
    r.nombre as rol_nombre,
    u.estado
FROM agromano.mot_usuario u
LEFT JOIN agromano.mom_rol r ON u.rol_id = r.rol_id
WHERE u.username LIKE '%auth0%';

-- 4. Verificar permisos del rol
SELECT DISTINCT
    rp.rol_id,
    r.nombre as rol_nombre,
    p.permiso_id,
    p.nombre as permiso_nombre,
    p.codigo as permiso_codigo
FROM agromano.mom_rol r
JOIN agromano.rel_rol_permiso rp ON r.rol_id = rp.rol_id  
JOIN agromano.mom_permiso p ON rp.permiso_id = p.permiso_id
WHERE r.rol_id = 1
ORDER BY p.nombre;
