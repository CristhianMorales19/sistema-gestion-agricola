-- ============================================
-- Datos iniciales: Usuario administrador y datos básicos
-- ============================================

USE gestion_agricola;

-- Crear usuario administrador inicial
-- Contraseña: Admin123! (debe ser cambiada en el primer acceso)
INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono, rol_id) VALUES 
('admin@gestionagricola.com', '$2b$10$rN8Lx9Z8ZF6yQ2wY4vR8COeKGQGkKxY7HrR6Tk5nC2mV9bX3pA1qS', 'Administrador', 'Sistema', '300-000-0000', 1);

-- Insertar tipos de permisos básicos
INSERT INTO tipos_permisos (nombre, descripcion, requiere_aprobacion, dias_maximos, remunerado) VALUES 
('Vacaciones', 'Vacaciones anuales del empleado', TRUE, 15, TRUE),
('Permiso Médico', 'Cita médica o incapacidad', TRUE, 3, TRUE),
('Calamidad Doméstica', 'Emergencia familiar', TRUE, 3, TRUE),
('Permiso Personal', 'Asuntos personales', TRUE, 1, FALSE),
('Licencia de Maternidad', 'Licencia por maternidad', TRUE, 84, TRUE),
('Licencia de Paternidad', 'Licencia por paternidad', TRUE, 8, TRUE),
('Compensatorio', 'Descanso compensatorio por horas extras', FALSE, 1, TRUE);

-- Insertar horarios laborales básicos
INSERT INTO horarios_laborales (nombre, hora_entrada, hora_salida, hora_almuerzo_inicio, hora_almuerzo_fin, tolerancia_minutos, dias_semana) VALUES 
('Horario Administrativo', '08:00:00', '17:00:00', '12:00:00', '13:00:00', 15, JSON_ARRAY('lunes', 'martes', 'miercoles', 'jueves', 'viernes')),
('Horario Campo - Mañana', '06:00:00', '14:00:00', '10:00:00', '10:30:00', 10, JSON_ARRAY('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado')),
('Horario Campo - Tarde', '14:00:00', '22:00:00', '18:00:00', '18:30:00', 10, JSON_ARRAY('lunes', 'martes', 'miercoles', 'jueves', 'viernes')),
('Horario Completo Campo', '06:00:00', '16:00:00', '12:00:00', '13:00:00', 15, JSON_ARRAY('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'));

-- Insertar conceptos básicos de nómina
INSERT INTO conceptos_nomina (codigo, nombre, descripcion, tipo, es_base, es_automatico, porcentaje) VALUES 
-- Ingresos
('SALBASE', 'Salario Base', 'Salario base del empleado', 'Ingreso', TRUE, TRUE, NULL),
('HORAEXT', 'Horas Extras', 'Pago por horas extras trabajadas', 'Ingreso', FALSE, TRUE, 125.00),
('AUXTRSP', 'Auxilio de Transporte', 'Auxilio de transporte legal', 'Ingreso', FALSE, TRUE, NULL),
('BONIFIC', 'Bonificaciones', 'Bonificaciones adicionales', 'Ingreso', FALSE, FALSE, NULL),

-- Deducciones
('SALUD', 'Salud (4%)', 'Aporte a salud del empleado', 'Deduccion', FALSE, TRUE, 4.00),
('PENSION', 'Pensión (4%)', 'Aporte a pensión del empleado', 'Deduccion', FALSE, TRUE, 4.00),
('RETENCION', 'Retención en la Fuente', 'Retención por ingresos', 'Deduccion', FALSE, FALSE, NULL),
('PRESTAMO', 'Préstamos', 'Descuentos por préstamos', 'Deduccion', FALSE, FALSE, NULL),
('OTROS_DESC', 'Otros Descuentos', 'Otros descuentos autorizados', 'Deduccion', FALSE, FALSE, NULL);

-- Insertar categorías de tareas
INSERT INTO categorias_tareas (nombre, descripcion, color_hex) VALUES 
('Siembra', 'Actividades de siembra y plantación', '#4CAF50'),
('Cultivo', 'Mantenimiento y cuidado de cultivos', '#8BC34A'),
('Cosecha', 'Recolección de productos', '#FF9800'),
('Riego', 'Actividades de riego y irrigación', '#2196F3'),
('Mantenimiento', 'Mantenimiento de equipos e instalaciones', '#9C27B0'),
('Administrativo', 'Tareas administrativas y de oficina', '#607D8B');

-- Insertar tareas básicas
INSERT INTO tareas (nombre, descripcion, categoria_id, unidad_medida, tiempo_estimado_horas, dificultad) VALUES 
('Preparación del terreno', 'Arar y preparar el suelo para siembra', 1, 'hectáreas', 8.00, 'Medio'),
('Siembra de semillas', 'Plantar semillas en el terreno preparado', 1, 'hectáreas', 6.00, 'Facil'),
('Aplicación de fertilizantes', 'Aplicar fertilizantes a los cultivos', 2, 'hectáreas', 4.00, 'Medio'),
('Control de plagas', 'Aplicar pesticidas y control de plagas', 2, 'hectáreas', 3.00, 'Medio'),
('Riego por aspersión', 'Riego de cultivos con sistema de aspersión', 4, 'hectáreas', 2.00, 'Facil'),
('Cosecha manual', 'Recolección manual de productos', 3, 'kilogramos', 8.00, 'Dificil'),
('Mantenimiento de tractores', 'Revisión y mantenimiento de maquinaria', 5, 'unidades', 4.00, 'Medio'),
('Inventario de productos', 'Conteo y registro de productos cosechados', 6, 'lotes', 2.00, 'Facil');
