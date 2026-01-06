-- ================================================================
-- SCRIPT COMPLETO BASADO EN TU SCRIPT ORIGINAL
-- Adaptado para el esquema Prisma del proyecto
-- ================================================================

USE AgroMano;

-- ================================================================
-- 1. ROLES ADMINISTRATIVOS
-- ================================================================

INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN_AGROMANO', 'Administrador AgroMano', 'Administrador con acceso completo al sistema', NOW(), 1, 1, NOW(), 1),
('SUPERVISOR_CAMPO', 'Supervisor de Campo', 'Supervisor de operaciones de campo y productividad', NOW(), 0, 1, NOW(), 1),
('GERENTE_RRHH', 'Gerente de RRHH', 'Gerente con permisos completos de RRHH y nómina', NOW(), 0, 1, NOW(), 1),
('SUPERVISOR_RRHH', 'Supervisor de RRHH', 'Supervisor con permisos limitados de RRHH', NOW(), 0, 1, NOW(), 1);

-- ================================================================
-- 2. PERMISOS GRANULARES
-- ================================================================

INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
-- Personal/Trabajadores
('trabajadores:read:all', 'Ver todos trabajadores', 'Personal', 'Ver información de todos los trabajadores', 1, NOW(), 1),
('trabajadores:create', 'Crear trabajadores', 'Personal', 'Registrar nuevos trabajadores', 1, NOW(), 1),
('trabajadores:update:all', 'Actualizar trabajadores', 'Personal', 'Editar cualquier trabajador', 1, NOW(), 1),
('trabajadores:delete', 'Eliminar trabajadores', 'Personal', 'Eliminar trabajadores', 1, NOW(), 1),
('trabajadores:export', 'Exportar trabajadores', 'Personal', 'Exportar datos', 1, NOW(), 1),

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

-- ================================================================
-- 3. CULTIVOS Y DATOS PARA PIÑA (DE TU SCRIPT ORIGINAL)
-- ================================================================

INSERT IGNORE INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, created_by) VALUES
('Piña BELLA SWEET', 'Variedad BELLA SWEET', 'Unidades', 'Todo el año', 1, NOW(), 1),
('Piña BABY SWEET', 'Variedad BABY SWEET', 'Unidades', 'Todo el año', 1, NOW(), 1),
('Piña QUEEN SOFÍA', 'Variedad QUEEN SOFÍA', 'Unidades', 'Todo el año', 1, NOW(), 1),
('Piña Costa Rica', 'Variedad Costa Rica', 'Unidades', 'Todo el año', 1, NOW(), 1);

-- ================================================================
-- 4. PARCELAS (DE TU SCRIPT ORIGINAL)
-- ================================================================

INSERT IGNORE INTO mom_parcela (nombre, ubicacion_descripcion, area_hectareas, tipo_terreno, descripcion, estado, is_activa, created_at, created_by) VALUES
('Lote A1', 'Sector norte de la finca piñera', 8.50, 'Plano', 'Área principal de cultivo de piña', 'disponible', 1, NOW(), 1),
('Lote B2', 'Sector sur con pendiente suave', 6.20, 'Inclinado', 'Zona de expansión piñera', 'disponible', 1, NOW(), 1),
('Lote C3', 'Cerca del sistema de riego', 7.80, 'Húmedo', 'Área con mejor acceso a agua', 'disponible', 1, NOW(), 1),
('Lote D4', 'Sector experimental', 3.10, 'Mixto', 'Área para pruebas de variedades', 'disponible', 1, NOW(), 1);

-- ================================================================
-- 5. CUADRILLAS (DE TU SCRIPT ORIGINAL)
-- ================================================================

INSERT IGNORE INTO mom_cuadrilla (codigo_identificador, nombre, descripcion, area_trabajo, fecha_creacion_at, is_activa, created_at, created_by) VALUES
('PINA01', 'Cuadrilla Siembra Piña', 'Equipo especializado en siembra de piña', 'Lotes A1, B2', NOW(), 1, NOW(), 1),
('PINA02', 'Cuadrilla Mantenimiento', 'Equipo de mantenimiento y cuidado', 'Todos los lotes', NOW(), 1, NOW(), 1),
('PINA03', 'Cuadrilla Cosecha', 'Equipo especializado en cosecha', 'Lotes C3, D4', NOW(), 1, NOW(), 1);

-- ================================================================
-- 6. TAREAS ESPECÍFICAS DE PIÑA (DE TU SCRIPT ORIGINAL)
-- ================================================================

-- Obtener ID del cultivo de piña
SET @cultivo_pina_id = (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña BELLA SWEET' LIMIT 1);

INSERT IGNORE INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, instrucciones, niveles_dificultad, is_activo, created_at, created_by) VALUES
(@cultivo_pina_id, 'Siembra de coronas', 'Plantación de coronas de piña MD2', 'Plantas/día', 300.0000, 'Plantar coronas a 30cm de distancia', 'Medio', 1, NOW(), 1),
(@cultivo_pina_id, 'Fertilización', 'Aplicación de fertilizantes específicos', 'Plantas/día', 500.0000, 'Aplicar fertilizante granulado alrededor de la planta', 'Fácil', 1, NOW(), 1),
(@cultivo_pina_id, 'Deshierbe manual', 'Control manual de malezas', 'Metros²/día', 400.0000, 'Remover malezas sin dañar raíces', 'Fácil', 1, NOW(), 1),
(@cultivo_pina_id, 'Aplicación de reguladores', 'Aplicación de hormonas para inducir floración', 'Plantas/día', 800.0000, 'Aplicar carburo de calcio en el cogollo', 'Difícil', 1, NOW(), 1),
(@cultivo_pina_id, 'Embolse de frutos', 'Protección de frutos con bolsas', 'Frutos/día', 100.0000, 'Colocar bolsa protectora en cada fruto', 'Medio', 1, NOW(), 1),
(@cultivo_pina_id, 'Cosecha de piña', 'Recolección de frutos maduros', 'Unidades/día', 200.0000, 'Cortar frutos en punto óptimo de madurez', 'Medio', 1, NOW(), 1);

-- ================================================================
-- 7. ASIGNAR PERMISOS A ROLES
-- ================================================================

-- Obtener IDs de roles
SET @admin_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');
SET @supervisor_campo_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');  
SET @gerente_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH');
SET @supervisor_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

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
                 'asistencia:read:all', 'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:reports', 'reportes:read:advanced');

-- SUPERVISOR RRHH: Permisos limitados
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all');

-- ================================================================
-- 8. CREAR USUARIOS ADMIN (IMPORTANTES PARA AUTH0)
-- ================================================================

INSERT IGNORE INTO mot_usuario (username, password_hash, rol_id, estado, created_at, created_by) VALUES
('admin@agromano.com', '$2b$10$dummy.hash.for.auth0', @admin_id, 'activo', NOW(), 1),
('supervisor.campo@agromano.com', '$2b$10$dummy.hash.for.auth0', @supervisor_campo_id, 'activo', NOW(), 1),
('gerente.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @gerente_rrhh_id, 'activo', NOW(), 1),
('supervisor.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @supervisor_rrhh_id, 'activo', NOW(), 1);

-- ================================================================
-- 9. TRABAJADOR INICIAL (PARA COMPLETAR REFERENCIAS)
-- ================================================================

INSERT IGNORE INTO mom_trabajador (documento_identidad, nombre_completo, fecha_nacimiento, telefono, email, is_activo, fecha_registro_at, created_at, created_by) VALUES
('12345678', 'Administrador Sistema', '1990-01-01', '555-0000', 'admin@agromano.com', 1, NOW(), NOW(), 1);

-- ================================================================
-- 10. VERIFICACIÓN FINAL
-- ================================================================

-- Mostrar usuarios creados
SELECT 'USUARIOS ADMINISTRATIVOS CREADOS:' as info;
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

-- Mostrar resumen final
SELECT '✅ SCRIPT COMPLETADO - DATOS INICIALES CARGADOS' as resultado;
SELECT '🍍 Cultivos de piña configurados' as especializacion;
SELECT '👥 4 usuarios admin listos para Auth0' as usuarios;
SELECT '🔐 Permisos granulares configurados' as permisos;
