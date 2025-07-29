-- ============================================
-- Datos iniciales: Roles y permisos del sistema
-- ============================================

USE gestion_agricola;

-- Insertar roles básicos del sistema
INSERT INTO roles (nombre, descripcion, permisos) VALUES 
('Super_Admin', 'Administrador del sistema con acceso total', JSON_ARRAY(
    'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar', 'usuarios.ver',
    'roles.crear', 'roles.editar', 'roles.eliminar', 'roles.ver',
    'empleados.crear', 'empleados.editar', 'empleados.eliminar', 'empleados.ver',
    'asistencia.crear', 'asistencia.editar', 'asistencia.ver', 'asistencia.reportes',
    'nomina.crear', 'nomina.calcular', 'nomina.procesar', 'nomina.ver', 'nomina.reportes',
    'productividad.crear', 'productividad.editar', 'productividad.ver', 'productividad.reportes',
    'reportes.generar', 'reportes.exportar', 'configuracion.sistema'
)),
('Admin_Recursos_Humanos', 'Administrador de recursos humanos', JSON_ARRAY(
    'empleados.crear', 'empleados.editar', 'empleados.ver',
    'asistencia.crear', 'asistencia.editar', 'asistencia.ver', 'asistencia.reportes',
    'nomina.crear', 'nomina.calcular', 'nomina.procesar', 'nomina.ver', 'nomina.reportes',
    'productividad.ver', 'productividad.reportes',
    'reportes.generar', 'reportes.exportar'
)),
('Supervisor', 'Supervisor de campo y operaciones', JSON_ARRAY(
    'empleados.ver',
    'asistencia.crear', 'asistencia.editar', 'asistencia.ver',
    'productividad.crear', 'productividad.editar', 'productividad.ver',
    'reportes.generar'
)),
('Empleado', 'Empleado básico del sistema', JSON_ARRAY(
    'asistencia.ver_propia',
    'productividad.crear_propia', 'productividad.ver_propia',
    'nomina.ver_propia'
)),
('Contador', 'Encargado de nómina y finanzas', JSON_ARRAY(
    'empleados.ver',
    'nomina.crear', 'nomina.calcular', 'nomina.procesar', 'nomina.ver', 'nomina.reportes',
    'reportes.generar', 'reportes.exportar'
));
