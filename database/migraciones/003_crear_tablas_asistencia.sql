-- ============================================
-- Migración 003: Crear tablas de asistencia
-- ============================================

USE gestion_agricola;

-- Tabla de horarios laborales
CREATE TABLE horarios_laborales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    hora_almuerzo_inicio TIME,
    hora_almuerzo_fin TIME,
    tolerancia_minutos INT DEFAULT 15,
    dias_semana JSON, -- ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de asignación de horarios a empleados
CREATE TABLE empleado_horarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    horario_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (horario_id) REFERENCES horarios_laborales(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_empleado_horario_activo (empleado_id, activo)
);

-- Tabla de registros de asistencia
CREATE TABLE registros_asistencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIMESTAMP NULL,
    hora_salida TIMESTAMP NULL,
    hora_almuerzo_inicio TIMESTAMP NULL,
    hora_almuerzo_fin TIMESTAMP NULL,
    horas_trabajadas DECIMAL(4,2) DEFAULT 0.00,
    horas_extras DECIMAL(4,2) DEFAULT 0.00,
    tardanza_minutos INT DEFAULT 0,
    salida_temprana_minutos INT DEFAULT 0,
    observaciones TEXT,
    estado ENUM('Presente', 'Ausente', 'Tardanza', 'Permiso', 'Falta_justificada', 'Falta_injustificada') DEFAULT 'Presente',
    validado_por INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (validado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE KEY unique_empleado_fecha (empleado_id, fecha)
);

-- Tabla de tipos de permisos
CREATE TABLE tipos_permisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    requiere_aprobacion BOOLEAN DEFAULT TRUE,
    dias_maximos INT DEFAULT NULL,
    remunerado BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de permisos y ausencias
CREATE TABLE permisos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    tipo_permiso_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INT NOT NULL,
    motivo TEXT NOT NULL,
    documento_adjunto VARCHAR(255) NULL,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado', 'Cancelado') DEFAULT 'Pendiente',
    solicitado_por INT NOT NULL,
    aprobado_por INT NULL,
    fecha_aprobacion TIMESTAMP NULL,
    comentarios_aprobacion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_permiso_id) REFERENCES tipos_permisos(id) ON DELETE RESTRICT,
    FOREIGN KEY (solicitado_por) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (aprobado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para optimización
CREATE INDEX idx_registros_empleado_fecha ON registros_asistencia(empleado_id, fecha);
CREATE INDEX idx_registros_fecha ON registros_asistencia(fecha);
CREATE INDEX idx_registros_estado ON registros_asistencia(estado);
CREATE INDEX idx_permisos_empleado ON permisos(empleado_id);
CREATE INDEX idx_permisos_estado ON permisos(estado);
CREATE INDEX idx_permisos_fechas ON permisos(fecha_inicio, fecha_fin);
CREATE INDEX idx_empleado_horarios_empleado ON empleado_horarios(empleado_id);
