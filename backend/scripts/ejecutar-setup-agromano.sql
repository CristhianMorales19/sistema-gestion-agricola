-- ================================================================
-- SCRIPT COMPLETO AGROMANO - VERSIÓN SIMPLIFICADA PARA MYSQL
-- Basado en tu script original, adaptado para el proyecto
-- ================================================================

USE AgroMano;

-- ================================================================
-- 1. ROLES BÁSICOS
-- ================================================================

INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN', 'Administrador', 'Rol de administrador del sistema', NOW(), 1, 1, NOW(), 1),
('SUPER', 'Supervisor', 'Rol de supervisor de campo', NOW(), 0, 1, NOW(), 1),
('OPER', 'Operario', 'Rol de operario de campo', NOW(), 0, 1, NOW(), 1);

-- ================================================================
-- 2. CULTIVOS DE PIÑA (4 VARIEDADES)
-- ================================================================

INSERT IGNORE INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, created_by) VALUES
('Piña BELLA SWEET', 'Variedad BELLA SWEET premium', 'Unidades', 'Todo el año', 1, NOW(), 1),
('Piña BABY SWEET', 'Variedad BABY SWEET compacta', 'Unidades', 'Todo el año', 1, NOW(), 1),
('Piña QUEEN SOFÍA', 'Variedad QUEEN SOFÍA especial', 'Unidades', 'Todo el año', 1, NOW(), 1),
('Piña Costa Rica', 'Variedad Costa Rica tradicional', 'Unidades', 'Todo el año', 1, NOW(), 1);

-- ================================================================
-- 3. PARCELAS PARA PIÑA
-- ================================================================

INSERT IGNORE INTO mom_parcela (nombre, ubicacion_descripcion, area_hectareas, tipo_terreno, descripcion, estado, is_activa, created_at, created_by) VALUES
('Lote A1', 'Sector norte de la finca piñera', 8.50, 'Plano', 'Área principal de cultivo de piña', 'disponible', 1, NOW(), 1),
('Lote B2', 'Sector sur con pendiente suave', 6.20, 'Inclinado', 'Zona de expansión piñera', 'disponible', 1, NOW(), 1),
('Lote C3', 'Cerca del sistema de riego', 7.80, 'Húmedo', 'Área con mejor acceso a agua', 'disponible', 1, NOW(), 1),
('Lote D4', 'Sector experimental', 3.10, 'Mixto', 'Área para pruebas de variedades', 'disponible', 1, NOW(), 1);

-- ================================================================
-- 4. CUADRILLAS ESPECIALIZADAS
-- ================================================================

INSERT IGNORE INTO mom_cuadrilla (codigo_identificador, nombre, descripcion, area_trabajo, fecha_creacion_at, is_activa, created_at, created_by) VALUES
('PINA01', 'Cuadrilla Siembra Piña', 'Equipo especializado en siembra de piña', 'Lotes A1, B2', NOW(), 1, NOW(), 1),
('PINA02', 'Cuadrilla Mantenimiento', 'Equipo de mantenimiento y cuidado', 'Todos los lotes', NOW(), 1, NOW(), 1),
('PINA03', 'Cuadrilla Cosecha', 'Equipo especializado en cosecha', 'Lotes C3, D4', NOW(), 1, NOW(), 1);

-- ================================================================
-- 5. TAREAS ESPECÍFICAS DE PIÑA
-- ================================================================

-- Obtener ID del primer cultivo de piña
SET @cultivo_pina_id = (SELECT cultivo_id FROM mom_cultivo WHERE nombre LIKE 'Piña%' LIMIT 1);

INSERT IGNORE INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, instrucciones, niveles_dificultad, is_activo, created_at, created_by) VALUES
(@cultivo_pina_id, 'Siembra de coronas', 'Plantación de coronas de piña MD2', 'Plantas/día', 300.0000, 'Plantar coronas a 30cm de distancia', 'Medio', 1, NOW(), 1),
(@cultivo_pina_id, 'Fertilización', 'Aplicación de fertilizantes específicos', 'Plantas/día', 500.0000, 'Aplicar fertilizante granulado alrededor de la planta', 'Fácil', 1, NOW(), 1),
(@cultivo_pina_id, 'Deshierbe manual', 'Control manual de malezas', 'Metros²/día', 400.0000, 'Remover malezas sin dañar raíces', 'Fácil', 1, NOW(), 1),
(@cultivo_pina_id, 'Aplicación de reguladores', 'Aplicación de hormonas para inducir floración', 'Plantas/día', 800.0000, 'Aplicar carburo de calcio en el cogollo', 'Difícil', 1, NOW(), 1),
(@cultivo_pina_id, 'Embolse de frutos', 'Protección de frutos con bolsas', 'Frutos/día', 100.0000, 'Colocar bolsa protectora en cada fruto', 'Medio', 1, NOW(), 1),
(@cultivo_pina_id, 'Cosecha de piña', 'Recolección de frutos maduros', 'Unidades/día', 200.0000, 'Cortar frutos en punto óptimo de madurez', 'Medio', 1, NOW(), 1);

-- ================================================================
-- 6. TRABAJADOR ADMINISTRADOR
-- ================================================================

INSERT IGNORE INTO mom_trabajador (documento_identidad, nombre_completo, fecha_nacimiento, telefono, email, is_activo, fecha_registro_at, created_at, created_by) VALUES
('12345678', 'Administrador Sistema', '1990-01-01', '555-0000', 'admin@agromano.com', 1, NOW(), NOW(), 1);

-- ================================================================
-- 7. USUARIOS ADMINISTRATIVOS PARA AUTH0
-- ================================================================

INSERT IGNORE INTO mot_usuario (trabajador_id, username, password_hash, rol_id, estado, created_at, created_by) VALUES
(1, 'admin@agromano.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 1, 'activo', NOW(), 1),
(1, 'supervisor@agromano.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 2, 'activo', NOW(), 1),
(1, 'operario@agromano.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 3, 'activo', NOW(), 1);

-- ================================================================
-- 8. PERMISOS GRANULARES
-- ================================================================

INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
-- Trabajadores
('trabajadores.read.all', 'Ver todos trabajadores', 'Trabajadores', 'Ver información de todos los trabajadores', 1, NOW(), 1),
('trabajadores.create', 'Crear trabajadores', 'Trabajadores', 'Crear nuevos trabajadores', 1, NOW(), 1),
('trabajadores.update', 'Actualizar trabajadores', 'Trabajadores', 'Actualizar información de trabajadores', 1, NOW(), 1),
('trabajadores.delete', 'Eliminar trabajadores', 'Trabajadores', 'Eliminar trabajadores del sistema', 1, NOW(), 1),

-- Asistencia
('asistencia.read.all', 'Ver asistencia', 'Asistencia', 'Ver registros de asistencia', 1, NOW(), 1),
('asistencia.create', 'Registrar asistencia', 'Asistencia', 'Registrar asistencia de trabajadores', 1, NOW(), 1),
('asistencia.update', 'Actualizar asistencia', 'Asistencia', 'Modificar registros de asistencia', 1, NOW(), 1),

-- Productividad
('productividad.read.all', 'Ver productividad', 'Productividad', 'Ver registros de productividad', 1, NOW(), 1),
('productividad.create', 'Registrar productividad', 'Productividad', 'Registrar productividad de trabajadores', 1, NOW(), 1),

-- Nómina
('nomina.read.all', 'Ver nóminas', 'Nómina', 'Ver nóminas de todos los trabajadores', 1, NOW(), 1),
('nomina.process', 'Procesar nómina', 'Nómina', 'Procesar y calcular nóminas', 1, NOW(), 1),

-- Reportes
('reportes.read.all', 'Ver reportes', 'Reportes', 'Ver todos los reportes del sistema', 1, NOW(), 1),
('reportes.create', 'Crear reportes', 'Reportes', 'Crear nuevos reportes', 1, NOW(), 1),

-- Administración
('admin.usuarios', 'Administrar usuarios', 'Administración', 'Gestionar usuarios del sistema', 1, NOW(), 1),
('admin.roles', 'Administrar roles', 'Administración', 'Gestionar roles y permisos', 1, NOW(), 1);

-- ================================================================
-- 9. ASIGNAR PERMISOS A ROLES
-- ================================================================

-- Obtener IDs de roles
SET @admin_rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN');
SET @supervisor_rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPER');
SET @operario_rol_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'OPER');

-- ADMIN: Todos los permisos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @admin_rol_id, permiso_id, NOW(), 1 FROM mom_permiso WHERE is_activo = 1;

-- SUPERVISOR: Permisos limitados
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_rol_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN (
    'trabajadores.read.all', 
    'asistencia.read.all', 'asistencia.create', 'asistencia.update', 
    'productividad.read.all', 'productividad.create', 
    'reportes.read.all'
);

-- OPERARIO: Permisos básicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @operario_rol_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('asistencia.create', 'productividad.create');

-- ================================================================
-- 10. VERIFICACIÓN FINAL
-- ================================================================

-- Verificar usuarios creados
SELECT 'USUARIOS ADMINISTRATIVOS PARA AUTH0:' as resultado;

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

-- Verificar datos de piña
SELECT 'DATOS DE PIÑA CONFIGURADOS:' as resultado;

SELECT 
    'Variedades de piña' as tipo, 
    COUNT(*) as total 
FROM mom_cultivo 
WHERE nombre LIKE 'Piña%'
UNION ALL
SELECT 
    'Tareas específicas', 
    COUNT(*) 
FROM mom_tarea 
WHERE cultivo_id = @cultivo_pina_id
UNION ALL
SELECT 'Parcelas', COUNT(*) FROM mom_parcela
UNION ALL
SELECT 'Cuadrillas', COUNT(*) FROM mom_cuadrilla
UNION ALL
SELECT 'Permisos', COUNT(*) FROM mom_permiso;

SELECT '✅ SCRIPT COMPLETADO - SISTEMA LISTO PARA AUTH0' as final;
