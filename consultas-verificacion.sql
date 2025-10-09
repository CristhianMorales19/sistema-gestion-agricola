-- ========================================
-- CONSULTAS PARA VERIFICAR BD REMOTA
-- Base de datos: agromano (174.138.186.187:3306)
-- ========================================

-- 1. Ver todos los trabajadores en la BD remota
SELECT 
    trabajador_id,
    documento_identidad,
    nombre_completo,
    email,
    telefono,
    fecha_ingreso,
    estado,
    created_at
FROM mom_trabajador
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- 2. Ver todos los usuarios del sistema (mot_usuario)
-- Estos son los usuarios que han hecho login y están sincronizados con Auth0
SELECT 
    u.usuario_id,
    u.auth0_id,
    u.username,
    u.email,
    u.estado,
    u.trabajador_id,
    u.rol_id,
    r.codigo AS rol_codigo,
    r.nombre AS rol_nombre,
    t.nombre_completo AS trabajador_nombre,
    u.last_login_at,
    u.created_at
FROM mot_usuario u
LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
LEFT JOIN mom_trabajador t ON u.trabajador_id = t.trabajador_id
WHERE u.deleted_at IS NULL
ORDER BY u.created_at DESC;

-- 3. Ver todos los roles disponibles en la BD remota
SELECT 
    rol_id,
    codigo,
    nombre,
    descripcion,
    is_critico,
    is_activo,
    created_at
FROM mom_rol
WHERE is_activo = true
ORDER BY nombre;

-- 4. Ver permisos de cada rol
SELECT 
    r.codigo AS rol_codigo,
    r.nombre AS rol_nombre,
    p.codigo AS permiso_codigo,
    p.nombre AS permiso_nombre,
    p.categoria AS permiso_categoria
FROM mom_rol r
INNER JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
WHERE r.is_activo = true
ORDER BY r.nombre, p.categoria, p.nombre;

-- 5. Verificar si hay usuarios sin rol asignado
SELECT 
    u.usuario_id,
    u.username,
    u.email,
    u.auth0_id,
    t.nombre_completo,
    u.created_at
FROM mot_usuario u
LEFT JOIN mom_trabajador t ON u.trabajador_id = t.trabajador_id
WHERE u.rol_id IS NULL
  AND u.deleted_at IS NULL
ORDER BY u.created_at DESC;

-- 6. Verificar trabajadores SIN usuario del sistema
-- (Trabajadores que existen pero no han sido invitados a Auth0 aún)
SELECT 
    t.trabajador_id,
    t.documento_identidad,
    t.nombre_completo,
    t.email,
    t.telefono,
    t.created_at
FROM mom_trabajador t
LEFT JOIN mot_usuario u ON t.trabajador_id = u.trabajador_id
WHERE u.usuario_id IS NULL
  AND t.deleted_at IS NULL
ORDER BY t.created_at DESC;

-- 7. Ver auditoría de cambios de roles
SELECT 
    a.audit_log_id,
    a.entidad,
    a.entidad_id,
    a.accion,
    a.datos_antes,
    a.datos_despues,
    u.username AS usuario_que_hizo_cambio,
    a.fecha_at,
    a.ip_origen
FROM mol_audit_log a
LEFT JOIN mot_usuario u ON a.usuario_id = u.usuario_id
WHERE a.entidad = 'mot_usuario'
  AND a.accion = 'CAMBIO_ROL'
ORDER BY a.fecha_at DESC
LIMIT 20;

-- 8. Resumen: Conteo de usuarios por estado y rol
SELECT 
    r.nombre AS rol,
    u.estado,
    COUNT(*) AS cantidad
FROM mot_usuario u
LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
WHERE u.deleted_at IS NULL
GROUP BY r.nombre, u.estado
ORDER BY r.nombre, u.estado;
