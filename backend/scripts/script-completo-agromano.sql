/*
    Fecha: 2025-08-09
    Propósito: Script de creación de esquema para Sistema de Gestión de Trabajadores Agrícolas (Mano de Obra).
    Convenciones aplicadas: B02, B05, BB06. Prefijos: mom_ (catálogos/mantenimiento), mot_ (transaccional), mof_ (fijas), rel_ (M:N).
    
    ADAPTADO PARA PROYECTO AGROMANO - COMPATIBLE CON PRISMA
*/

-- Usar la base de datos existente
USE AgroMano;

-- ================================================================
-- DATOS INICIALES PARA ROLES Y USUARIOS ADMIN
-- ================================================================

-- Insertar roles administrativos
INSERT INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN', 'Administrador', 'Rol de administrador del sistema', NOW(), 1, 1, NOW(), 1),
('SUPER', 'Supervisor', 'Rol de supervisor de campo', NOW(), 0, 1, NOW(), 1),
('OPER', 'Operario', 'Rol de operario de campo', NOW(), 0, 1, NOW(), 1)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    updated_at = NOW();

-- ================================================================
-- DATOS INICIALES PARA PIÑA
-- ================================================================

-- Insertar datos básicos para las 4 variedades de piña
INSERT INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, updated_at, created_by, updated_by) VALUES
('Piña BELLA SWEET ', 'Variedad BELLA SWEET', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1),
('Piña  BABY SWEET', 'Variedad BABY SWEET', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1),
('Piña QUEEN SOFÍA', 'Variedad QUEEN SOFÍA', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1),
('Piña Costa Rica', 'Variedad Costa Rica', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    updated_at = NOW();

-- Insertar parcelas para piña
INSERT INTO mom_parcela (nombre, ubicacion_descripcion, area_hectareas, tipo_terreno, descripcion, estado, is_activa, created_at, updated_at, created_by, updated_by) VALUES
('Lote A1', 'Sector norte de la finca piñera', 8.50, 'Plano', 'Área principal de cultivo de piña', 'disponible', 1, NOW(), NOW(), 1, 1),
('Lote B2', 'Sector sur con pendiente suave', 6.20, 'Inclinado', 'Zona de expansión piñera', 'disponible', 1, NOW(), NOW(), 1, 1),
('Lote C3', 'Cerca del sistema de riego', 7.80, 'Húmedo', 'Área con mejor acceso a agua', 'disponible', 1, NOW(), NOW(), 1, 1),
('Lote D4', 'Sector experimental', 3.10, 'Mixto', 'Área para pruebas de variedades', 'disponible', 1, NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    updated_at = NOW();

-- Insertar cuadrillas especializadas en piña
INSERT INTO mom_cuadrilla (codigo_identificador, nombre, descripcion, area_trabajo, fecha_creacion_at, is_activa, created_at, updated_at, created_by, updated_by) VALUES
('PINA01', 'Cuadrilla Siembra Piña', 'Equipo especializado en siembra de piña', 'Lotes A1, B2', NOW(), 1, NOW(), NOW(), 1, 1),
('PINA02', 'Cuadrilla Mantenimiento', 'Equipo de mantenimiento y cuidado', 'Todos los lotes', NOW(), 1, NOW(), NOW(), 1, 1),
('PINA03', 'Cuadrilla Cosecha', 'Equipo especializado en cosecha', 'Lotes C3, D4', NOW(), 1, NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    updated_at = NOW();

-- Insertar tareas específicas de piña
INSERT INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, instrucciones, niveles_dificultad, is_activo, created_at, updated_at, created_by, updated_by) VALUES
(1, 'Siembra de coronas', 'Plantación de coronas de piña MD2', 'Plantas/día', 300.0000, 'Plantar coronas a 30cm de distancia', 'Medio', 1, NOW(), NOW(), 1, 1),
(1, 'Fertilización', 'Aplicación de fertilizantes específicos', 'Plantas/día', 500.0000, 'Aplicar fertilizante granulado alrededor de la planta', 'Fácil', 1, NOW(), NOW(), 1, 1),
(1, 'Deshierbe manual', 'Control manual de malezas', 'Metros²/día', 400.0000, 'Remover malezas sin dañar raíces', 'Fácil', 1, NOW(), NOW(), 1, 1),
(1, 'Aplicación de reguladores', 'Aplicación de hormonas para inducir floración', 'Plantas/día', 800.0000, 'Aplicar carburo de calcio en el cogollo', 'Difícil', 1, NOW(), NOW(), 1, 1),
(1, 'Embolse de frutos', 'Protección de frutos con bolsas', 'Frutos/día', 100.0000, 'Colocar bolsa protectora en cada fruto', 'Medio', 1, NOW(), NOW(), 1, 1),
(1, 'Cosecha de piña', 'Recolección de frutos maduros', 'Unidades/día', 200.0000, 'Cortar frutos en punto óptimo de madurez', 'Medio', 1, NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion),
    updated_at = NOW();

-- Insertar trabajador inicial (se referenciará como admin)
INSERT INTO mom_trabajador (documento_identidad, nombre_completo, fecha_nacimiento, telefono, email, is_activo, fecha_registro_at, created_at, updated_at, created_by, updated_by) VALUES
('12345678', 'Administrador Sistema', '1990-01-01', '555-0000', 'admin@agromano.com', 1, NOW(), NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    updated_at = NOW();

-- ================================================================
-- USUARIOS ADMINISTRATIVOS PARA AUTH0
-- ================================================================

-- Crear usuarios del sistema compatibles con Auth0
INSERT INTO mot_usuario (trabajador_id, username, password_hash, rol_id, estado, created_at, updated_at, created_by, updated_by) VALUES
(1, 'admin@agromano.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 1, 'activo', NOW(), NOW(), 1, 1),
(1, 'supervisor@agromano.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 2, 'activo', NOW(), NOW(), 1, 1),
(1, 'operario@agromano.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 3, 'activo', NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    rol_id = VALUES(rol_id),
    estado = VALUES(estado),
    updated_at = NOW();

-- ================================================================
-- PERMISOS GRANULARES PARA EL SISTEMA
-- ================================================================

INSERT INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, updated_at, created_by, updated_by) VALUES
-- Trabajadores
('trabajadores.read.all', 'Ver todos trabajadores', 'Trabajadores', 'Ver información de todos los trabajadores', 1, NOW(), NOW(), 1, 1),
('trabajadores.create', 'Crear trabajadores', 'Trabajadores', 'Crear nuevos trabajadores', 1, NOW(), NOW(), 1, 1),
('trabajadores.update', 'Actualizar trabajadores', 'Trabajadores', 'Actualizar información de trabajadores', 1, NOW(), NOW(), 1, 1),
('trabajadores.delete', 'Eliminar trabajadores', 'Trabajadores', 'Eliminar trabajadores del sistema', 1, NOW(), NOW(), 1, 1),

-- Asistencia
('asistencia.read.all', 'Ver asistencia', 'Asistencia', 'Ver registros de asistencia', 1, NOW(), NOW(), 1, 1),
('asistencia.create', 'Registrar asistencia', 'Asistencia', 'Registrar asistencia de trabajadores', 1, NOW(), NOW(), 1, 1),
('asistencia.update', 'Actualizar asistencia', 'Asistencia', 'Modificar registros de asistencia', 1, NOW(), NOW(), 1, 1),

-- Productividad
('productividad.read.all', 'Ver productividad', 'Productividad', 'Ver registros de productividad', 1, NOW(), NOW(), 1, 1),
('productividad.create', 'Registrar productividad', 'Productividad', 'Registrar productividad de trabajadores', 1, NOW(), NOW(), 1, 1),

-- Nómina
('nomina.read.all', 'Ver nóminas', 'Nómina', 'Ver nóminas de todos los trabajadores', 1, NOW(), NOW(), 1, 1),
('nomina.process', 'Procesar nómina', 'Nómina', 'Procesar y calcular nóminas', 1, NOW(), NOW(), 1, 1),

-- Reportes
('reportes.read.all', 'Ver reportes', 'Reportes', 'Ver todos los reportes del sistema', 1, NOW(), NOW(), 1, 1),
('reportes.create', 'Crear reportes', 'Reportes', 'Crear nuevos reportes', 1, NOW(), NOW(), 1, 1),

-- Administración
('admin.usuarios', 'Administrar usuarios', 'Administración', 'Gestionar usuarios del sistema', 1, NOW(), NOW(), 1, 1),
('admin.roles', 'Administrar roles', 'Administración', 'Gestionar roles y permisos', 1, NOW(), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    updated_at = NOW();

-- ================================================================
-- ASIGNAR PERMISOS A ROLES
-- ================================================================

-- ADMIN: Todos los permisos
INSERT INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 1, permiso_id, NOW(), 1 FROM mom_permiso WHERE is_activo = 1
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- SUPERVISOR: Permisos limitados
INSERT INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 2, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores.read.all', 'asistencia.read.all', 'asistencia.create', 'asistencia.update', 'productividad.read.all', 'productividad.create', 'reportes.read.all')
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- OPERARIO: Permisos básicos
INSERT INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 3, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('asistencia.create', 'productividad.create')
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ================================================================
-- VERIFICACIÓN
-- ================================================================

-- Mostrar resumen de la configuración
SELECT 
    'CONFIGURACIÓN COMPLETADA' as mensaje,
    COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_schema = 'AgroMano';

-- Verificar usuarios creados
SELECT 
    'USUARIOS ADMINISTRATIVOS PARA AUTH0:' as info;

SELECT 
    u.usuario_id,
    u.username as email_auth0,
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

-- Verificar cultivos y tareas de piña
SELECT 
    '🍍 DATOS DE PIÑA CONFIGURADOS:' as info;

SELECT 
    'Variedades de piña' as tipo, 
    COUNT(*) as total 
FROM mom_cultivo 
WHERE nombre LIKE '%Piña%'
UNION ALL
SELECT 
    'Tareas específicas', 
    COUNT(*) 
FROM mom_tarea 
WHERE cultivo_id IN (SELECT cultivo_id FROM mom_cultivo WHERE nombre LIKE '%Piña%')
UNION ALL
SELECT 'Parcelas configuradas', COUNT(*) FROM mom_parcela
UNION ALL
SELECT 'Cuadrillas especializadas', COUNT(*) FROM mom_cuadrilla;

SELECT '✅ SISTEMA LISTO PARA AUTH0 - Usar estos emails para crear usuarios en Auth0' as resultado;
