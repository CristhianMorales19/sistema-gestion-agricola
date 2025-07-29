-- =====================================================
-- MIGRACIÓN 006: TABLAS DE REPORTES
-- Soporte para HU-021 a HU-025: Gestión de Reportes
-- =====================================================

USE gestion_agricola;

-- Tabla de configuración de reportes
CREATE TABLE configuracion_reportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_reporte VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_reporte ENUM('personal', 'asistencia', 'nomina', 'productividad', 'financiero') NOT NULL,
    parametros_sql TEXT,
    campos_incluidos JSON,
    filtros_disponibles JSON,
    formato_por_defecto ENUM('pdf', 'excel', 'csv') DEFAULT 'pdf',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de reportes generados (historial)
CREATE TABLE reportes_generados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    configuracion_reporte_id INT,
    usuario_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    formato_exportacion ENUM('pdf', 'excel', 'csv') NOT NULL,
    parametros_utilizados JSON,
    fecha_inicio DATE,
    fecha_fin DATE,
    total_registros INT DEFAULT 0,
    tamaño_archivo INT DEFAULT 0, -- en bytes
    ruta_archivo VARCHAR(500),
    estado ENUM('generando', 'completado', 'error') DEFAULT 'generando',
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_descarga TIMESTAMP NULL,
    FOREIGN KEY (configuracion_reporte_id) REFERENCES configuracion_reportes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_fecha (usuario_id, fecha_generacion),
    INDEX idx_tipo_estado (configuracion_reporte_id, estado)
);

-- Tabla de programación de reportes automáticos
CREATE TABLE programacion_reportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    configuracion_reporte_id INT NOT NULL,
    usuario_id INT NOT NULL,
    nombre_programacion VARCHAR(100) NOT NULL,
    frecuencia ENUM('diario', 'semanal', 'mensual', 'trimestral') NOT NULL,
    dia_mes INT NULL, -- Para reportes mensuales (1-31)
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NULL,
    hora TIME DEFAULT '08:00:00',
    parametros_fijos JSON,
    emails_destino JSON, -- Lista de emails para envío automático
    activo BOOLEAN DEFAULT TRUE,
    fecha_ultima_ejecucion TIMESTAMP NULL,
    fecha_proxima_ejecucion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (configuracion_reporte_id) REFERENCES configuracion_reportes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_proxima_ejecucion (fecha_proxima_ejecucion, activo)
);

-- Tabla de favoritos de reportes por usuario
CREATE TABLE reportes_favoritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    configuracion_reporte_id INT NOT NULL,
    parametros_guardados JSON,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (configuracion_reporte_id) REFERENCES configuracion_reportes(id),
    UNIQUE KEY unique_usuario_reporte (usuario_id, configuracion_reporte_id)
);

-- Índices adicionales para optimización de reportes
CREATE INDEX idx_empleados_activo_departamento ON empleados(activo, departamento_id);
CREATE INDEX idx_asistencia_fecha_empleado ON registros_asistencia(fecha, empleado_id);
CREATE INDEX idx_nomina_periodo_empleado ON nominas(año, mes, empleado_id);
CREATE INDEX idx_tareas_fecha_empleado ON tareas_completadas(fecha_completada, empleado_id);

-- Comentarios de las tablas
ALTER TABLE configuracion_reportes COMMENT = 'Configuración de tipos de reportes disponibles en el sistema';
ALTER TABLE reportes_generados COMMENT = 'Historial de reportes generados por los usuarios';
ALTER TABLE programacion_reportes COMMENT = 'Programación de reportes automáticos';
ALTER TABLE reportes_favoritos COMMENT = 'Reportes marcados como favoritos por cada usuario';
