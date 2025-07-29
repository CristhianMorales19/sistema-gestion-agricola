-- =====================================================
-- MIGRACIÓN 007: TABLAS DE CONFIGURACIÓN DEL SISTEMA
-- Soporte para configuraciones generales del sistema
-- =====================================================

USE gestion_agricola;

-- Tabla de configuración general del sistema
CREATE TABLE configuracion_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descripcion VARCHAR(255),
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    categoria VARCHAR(50) DEFAULT 'general',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de notificaciones del sistema
CREATE TABLE notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Tabla de logs del sistema
CREATE TABLE logs_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL,
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(50),
    registro_id INT,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_usuario_fecha (usuario_id, fecha_creacion),
    INDEX idx_tabla_registro (tabla_afectada, registro_id),
    INDEX idx_accion_fecha (accion, fecha_creacion)
);

-- Tabla de respaldos automáticos
CREATE TABLE respaldos_automaticos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tamaño_archivo BIGINT,
    tipo_respaldo ENUM('completo', 'incremental', 'diferencial') DEFAULT 'completo',
    estado ENUM('iniciado', 'completado', 'error') DEFAULT 'iniciado',
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    duracion_segundos INT,
    observaciones TEXT,
    INDEX idx_fecha_tipo (fecha_inicio, tipo_respaldo),
    INDEX idx_estado (estado)
);

-- Comentarios de las tablas
ALTER TABLE configuracion_sistema COMMENT = 'Configuraciones generales del sistema';
ALTER TABLE notificaciones COMMENT = 'Notificaciones para los usuarios del sistema';
ALTER TABLE logs_sistema COMMENT = 'Registro de auditoría de todas las acciones del sistema';
ALTER TABLE respaldos_automaticos COMMENT = 'Registro de respaldos automáticos de la base de datos';
