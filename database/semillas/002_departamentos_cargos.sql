-- ============================================
-- Datos iniciales: Departamentos y cargos
-- ============================================

USE gestion_agricola;

-- Insertar departamentos
INSERT INTO departamentos (nombre, descripcion) VALUES 
('Administración', 'Departamento administrativo y gerencial'),
('Recursos Humanos', 'Gestión del personal y nómina'),
('Producción Agrícola', 'Actividades de siembra, cultivo y cosecha'),
('Mantenimiento', 'Mantenimiento de equipos e infraestructura'),
('Comercialización', 'Ventas y comercialización de productos'),
('Contabilidad', 'Área contable y financiera');

-- Insertar cargos por departamento
-- Administración
INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES 
('Gerente General', 'Dirección general de la empresa', 3500000.00, 1),
('Asistente Administrativo', 'Apoyo en tareas administrativas', 1200000.00, 1),
('Secretaria', 'Secretaria ejecutiva', 1100000.00, 1);

-- Recursos Humanos
INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES 
('Jefe de Recursos Humanos', 'Dirección del área de RRHH', 2500000.00, 2),
('Analista de Nómina', 'Cálculo y procesamiento de nómina', 1800000.00, 2),
('Coordinador de Personal', 'Coordinación del personal operativo', 1600000.00, 2);

-- Producción Agrícola
INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES 
('Supervisor de Campo', 'Supervisión de actividades agrícolas', 2000000.00, 3),
('Operario Agrícola', 'Labores de campo y cultivo', 1000000.00, 3),
('Técnico Agrónomo', 'Asesoría técnica en cultivos', 2200000.00, 3),
('Trabajador de Campo', 'Actividades básicas de campo', 900000.00, 3),
('Encargado de Riego', 'Manejo del sistema de riego', 1300000.00, 3);

-- Mantenimiento
INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES 
('Jefe de Mantenimiento', 'Dirección del área de mantenimiento', 2100000.00, 4),
('Mecánico', 'Mantenimiento de maquinaria', 1500000.00, 4),
('Electricista', 'Mantenimiento eléctrico', 1600000.00, 4),
('Auxiliar de Mantenimiento', 'Apoyo en mantenimiento general', 1100000.00, 4);

-- Comercialización
INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES 
('Jefe de Ventas', 'Dirección del área comercial', 2300000.00, 5),
('Vendedor', 'Ventas directas de productos', 1400000.00, 5),
('Coordinador Logístico', 'Coordinación de entregas', 1700000.00, 5);

-- Contabilidad
INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES 
('Contador', 'Contabilidad general de la empresa', 2400000.00, 6),
('Auxiliar Contable', 'Apoyo en tareas contables', 1300000.00, 6);
