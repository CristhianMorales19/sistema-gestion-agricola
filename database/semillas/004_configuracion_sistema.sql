-- =====================================================
-- SEMILLA 004: CONFIGURACIÓN INICIAL DEL SISTEMA
-- Datos iniciales para configuración y reportes
-- =====================================================

USE gestion_agricola;

-- Configuraciones del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo, categoria) VALUES
-- Configuraciones generales
('empresa_nombre', 'Agrícola San José', 'Nombre de la empresa', 'string', 'empresa'),
('empresa_ruc', '1234567890', 'RUC de la empresa', 'string', 'empresa'),
('empresa_direccion', 'Calle Principal 123, Ciudad', 'Dirección de la empresa', 'string', 'empresa'),
('empresa_telefono', '+593-98-765-4321', 'Teléfono de la empresa', 'string', 'empresa'),
('empresa_email', 'info@agricolasanjose.com', 'Email corporativo', 'string', 'empresa'),

-- Configuraciones de nómina
('salario_minimo', '450.00', 'Salario mínimo vigente', 'number', 'nomina'),
('horas_laborales_dia', '8', 'Horas laborales por día', 'number', 'nomina'),
('dias_laborales_semana', '5', 'Días laborales por semana', 'number', 'nomina'),
('porcentaje_horas_extras', '50', 'Porcentaje adicional para horas extras', 'number', 'nomina'),
('descuento_iess', '9.45', 'Porcentaje descuento IESS empleado', 'number', 'nomina'),
('aporte_patronal', '11.15', 'Porcentaje aporte patronal IESS', 'number', 'nomina'),

-- Configuraciones de asistencia
('hora_entrada_estandar', '08:00:00', 'Hora de entrada estándar', 'string', 'asistencia'),
('hora_salida_estandar', '17:00:00', 'Hora de salida estándar', 'string', 'asistencia'),
('minutos_tolerancia', '15', 'Minutos de tolerancia para tardanza', 'number', 'asistencia'),
('dias_permiso_anuales', '15', 'Días de permiso anuales por empleado', 'number', 'asistencia'),

-- Configuraciones de productividad
('meta_tareas_diarias', '8', 'Meta de tareas completadas por día', 'number', 'productividad'),
('porcentaje_meta_mensual', '90', 'Porcentaje mínimo para cumplir meta mensual', 'number', 'productividad'),
('periodo_evaluacion_meses', '6', 'Periodo en meses para evaluaciones de rendimiento', 'number', 'productividad'),

-- Configuraciones de sistema
('moneda', 'USD', 'Moneda utilizada en el sistema', 'string', 'sistema'),
('zona_horaria', 'America/Guayaquil', 'Zona horaria del sistema', 'string', 'sistema'),
('idioma', 'es', 'Idioma por defecto del sistema', 'string', 'sistema'),
('formato_fecha', 'DD/MM/YYYY', 'Formato de fecha mostrado', 'string', 'sistema'),
('respaldo_automatico', 'true', 'Activar respaldos automáticos', 'boolean', 'sistema'),
('frecuencia_respaldo', 'diario', 'Frecuencia de respaldos automáticos', 'string', 'sistema');

-- Configuraciones predefinidas de reportes
INSERT INTO configuracion_reportes (nombre_reporte, descripcion, tipo_reporte, campos_incluidos, filtros_disponibles, formato_por_defecto) VALUES
('Empleados Activos', 'Listado completo de empleados activos', 'personal', 
 '["nombres", "apellidos", "cedula", "cargo", "departamento", "fecha_ingreso", "salario"]',
 '["departamento_id", "cargo_id", "fecha_ingreso"]', 'excel'),

('Asistencia Mensual', 'Reporte de asistencia por mes', 'asistencia',
 '["empleado", "dias_trabajados", "tardanzas", "faltas", "horas_extras", "permisos"]',
 '["mes", "año", "departamento_id", "empleado_id"]', 'pdf'),

('Nómina del Mes', 'Reporte detallado de nómina mensual', 'nomina',
 '["empleado", "salario_base", "horas_extras", "bonificaciones", "deducciones", "salario_neto"]',
 '["mes", "año", "departamento_id"]', 'excel'),

('Productividad por Empleado', 'Reporte de productividad individual', 'productividad',
 '["empleado", "tareas_completadas", "metas_cumplidas", "porcentaje_rendimiento", "evaluacion"]',
 '["periodo_inicio", "periodo_fin", "empleado_id", "departamento_id"]', 'pdf'),

('Reporte Financiero', 'Resumen financiero de gastos de personal', 'financiero',
 '["total_nomina", "total_aportes", "total_deducciones", "costo_total"]',
 '["mes", "año", "departamento_id"]', 'excel');

-- Tipos de permiso predefinidos (ya insertados en otras semillas)
-- Los tipos de permiso están siendo insertados por otro archivo de semillas

-- Tipos de tarea predefinidos (tabla no existe - podría estar en categorias_tareas)
-- Los tipos de tareas están siendo manejados por la tabla categorias_tareas

-- Configuración de deducciones estándar (tabla no existe - se maneja en nomina_detalles)
-- Las deducciones se manejan directamente en nomina_detalles

-- Configuración de bonificaciones estándar (tabla no existe - se maneja en nomina_detalles)
-- Las bonificaciones se manejan directamente en nomina_detalles

-- Notificaciones iniciales del sistema
INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo) VALUES
(1, 'Bienvenido al Sistema', 'Bienvenido al Sistema de Gestión Agrícola. El sistema ha sido configurado correctamente.', 'success'),
(1, 'Configuración Inicial', 'Se han cargado las configuraciones iniciales del sistema. Revise y ajuste según sus necesidades.', 'info'),
(1, 'Usuarios Creados', 'Se han creado los usuarios por defecto. Recuerde cambiar las contraseñas de seguridad.', 'warning');

-- Log inicial del sistema
INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada, datos_nuevos) VALUES
(1, 'INSTALACION_INICIAL', 'sistema', '{"evento": "instalacion_completa", "version": "1.0.0", "fecha": "2025-01-01"}');
