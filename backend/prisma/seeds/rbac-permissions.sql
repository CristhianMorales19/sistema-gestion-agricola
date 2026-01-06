-- Insertar permisos específicos para el sistema AgroMano
-- Ejecutar después de tener las tablas creadas

USE AgroMano;

-- Insertar permisos granulares por módulo
INSERT INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, updated_at, created_by, updated_by) VALUES

-- TRABAJADORES
('trabajadores.crear', 'Crear Trabajador', 'Trabajadores', 'Permite crear nuevos trabajadores', 1, NOW(), NOW(), 1, 1),
('trabajadores.ver', 'Ver Trabajadores', 'Trabajadores', 'Permite ver lista de trabajadores', 1, NOW(), NOW(), 1, 1),
('trabajadores.editar', 'Editar Trabajador', 'Trabajadores', 'Permite editar datos de trabajadores', 1, NOW(), NOW(), 1, 1),
('trabajadores.eliminar', 'Eliminar Trabajador', 'Trabajadores', 'Permite eliminar trabajadores', 1, NOW(), NOW(), 1, 1),

-- ASISTENCIA
('asistencia.registrar', 'Registrar Asistencia', 'Asistencia', 'Permite registrar entrada/salida', 1, NOW(), NOW(), 1, 1),
('asistencia.ver', 'Ver Asistencia', 'Asistencia', 'Permite ver registros de asistencia', 1, NOW(), NOW(), 1, 1),
('asistencia.editar', 'Editar Asistencia', 'Asistencia', 'Permite modificar registros de asistencia', 1, NOW(), NOW(), 1, 1),
('asistencia.reportes', 'Reportes Asistencia', 'Asistencia', 'Permite generar reportes de asistencia', 1, NOW(), NOW(), 1, 1),

-- NÓMINA
('nomina.procesar', 'Procesar Nómina', 'Nómina', 'Permite procesar nómina mensual', 1, NOW(), NOW(), 1, 1),
('nomina.ver', 'Ver Nómina', 'Nómina', 'Permite ver liquidaciones y recibos', 1, NOW(), NOW(), 1, 1),
('nomina.aprobar', 'Aprobar Nómina', 'Nómina', 'Permite aprobar liquidaciones', 1, NOW(), NOW(), 1, 1),
('nomina.reportes', 'Reportes Nómina', 'Nómina', 'Permite generar reportes de nómina', 1, NOW(), NOW(), 1, 1),

-- PRODUCTIVIDAD
('productividad.registrar', 'Registrar Productividad', 'Productividad', 'Permite registrar productividad de trabajadores', 1, NOW(), NOW(), 1, 1),
('productividad.ver', 'Ver Productividad', 'Productividad', 'Permite ver registros de productividad', 1, NOW(), NOW(), 1, 1),
('productividad.evaluar', 'Evaluar Productividad', 'Productividad', 'Permite evaluar rendimiento', 1, NOW(), NOW(), 1, 1),
('productividad.reportes', 'Reportes Productividad', 'Productividad', 'Permite generar reportes de productividad', 1, NOW(), NOW(), 1, 1),

-- CULTIVOS Y PARCELAS
('parcelas.crear', 'Crear Parcela', 'Parcelas', 'Permite crear nuevas parcelas', 1, NOW(), NOW(), 1, 1),
('parcelas.ver', 'Ver Parcelas', 'Parcelas', 'Permite ver parcelas', 1, NOW(), NOW(), 1, 1),
('parcelas.editar', 'Editar Parcela', 'Parcelas', 'Permite editar parcelas', 1, NOW(), NOW(), 1, 1),
('cultivos.gestionar', 'Gestionar Cultivos', 'Cultivos', 'Permite gestionar cultivos y tareas', 1, NOW(), NOW(), 1, 1),

-- CUADRILLAS
('cuadrillas.crear', 'Crear Cuadrilla', 'Cuadrillas', 'Permite crear cuadrillas de trabajo', 1, NOW(), NOW(), 1, 1),
('cuadrillas.asignar', 'Asignar Cuadrilla', 'Cuadrillas', 'Permite asignar trabajadores a cuadrillas', 1, NOW(), NOW(), 1, 1),
('cuadrillas.ver', 'Ver Cuadrillas', 'Cuadrillas', 'Permite ver cuadrillas', 1, NOW(), NOW(), 1, 1),

-- REPORTES EJECUTIVOS
('reportes.ejecutivos', 'Reportes Ejecutivos', 'Reportes', 'Permite ver reportes ejecutivos completos', 1, NOW(), NOW(), 1, 1),
('reportes.financieros', 'Reportes Financieros', 'Reportes', 'Permite ver reportes financieros', 1, NOW(), NOW(), 1, 1),

-- ADMINISTRACIÓN DEL SISTEMA
('sistema.usuarios', 'Gestionar Usuarios', 'Sistema', 'Permite gestionar usuarios del sistema', 1, NOW(), NOW(), 1, 1),
('sistema.roles', 'Gestionar Roles', 'Sistema', 'Permite gestionar roles y permisos', 1, NOW(), NOW(), 1, 1),
('sistema.configuracion', 'Configuración Sistema', 'Sistema', 'Permite configurar parámetros del sistema', 1, NOW(), NOW(), 1, 1);

-- Asignar todos los permisos al rol ADMIN (asumiendo que el ADMIN tiene rol_id = 1)
INSERT INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 1, permiso_id, NOW(), 1 
FROM mom_permiso 
WHERE is_activo = 1;

-- Asignar permisos específicos al SUPERVISOR (asumiendo que SUPERVISOR tiene rol_id = 2)
INSERT INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 2, permiso_id, NOW(), 1 
FROM mom_permiso 
WHERE codigo IN (
    'trabajadores.ver', 'asistencia.ver', 'asistencia.reportes', 'nomina.ver', 
    'productividad.ver', 'productividad.reportes', 'parcelas.ver', 'cuadrillas.ver'
);

-- Asignar permisos básicos al OPERARIO (asumiendo que OPERARIO tiene rol_id = 3)
INSERT INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT 3, permiso_id, NOW(), 1 
FROM mom_permiso 
WHERE codigo IN (
    'asistencia.registrar', 'productividad.registrar', 'trabajadores.ver'
);

-- Verificar la configuración
SELECT 
    r.nombre AS rol,
    p.codigo AS permiso,
    p.nombre AS descripcion_permiso,
    p.categoria
FROM rel_mom_rol__mom_permiso rp
JOIN mom_rol r ON r.rol_id = rp.rol_id
JOIN mom_permiso p ON p.permiso_id = rp.permiso_id
ORDER BY r.nombre, p.categoria, p.codigo;
