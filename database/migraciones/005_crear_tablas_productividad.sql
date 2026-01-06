-- ============================================
-- Migración 005: Crear tablas de productividad
-- ============================================

USE gestion_agricola;

-- Tabla de categorías de tareas
CREATE TABLE categorias_tareas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color_hex VARCHAR(7), -- Para UI: #FF5733
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas/actividades
CREATE TABLE tareas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT NOT NULL,
    unidad_medida VARCHAR(50), -- hectáreas, kilos, horas, etc.
    tiempo_estimado_horas DECIMAL(6,2) DEFAULT NULL,
    dificultad ENUM('Facil', 'Medio', 'Dificil') DEFAULT 'Medio',
    requiere_supervision BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_tareas(id) ON DELETE RESTRICT
);

-- Tabla de metas y objetivos
CREATE TABLE metas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    tarea_id INT NULL, -- NULL para metas generales
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_meta ENUM('Individual', 'Grupal', 'Departamental') DEFAULT 'Individual',
    unidad_medida VARCHAR(50),
    cantidad_objetivo DECIMAL(10,2) NOT NULL,
    cantidad_actual DECIMAL(10,2) DEFAULT 0.00,
    fecha_inicio DATE NOT NULL,
    fecha_limite DATE NOT NULL,
    estado ENUM('Pendiente', 'En_progreso', 'Completada', 'Vencida', 'Cancelada') DEFAULT 'Pendiente',
    prioridad ENUM('Baja', 'Media', 'Alta', 'Critica') DEFAULT 'Media',
    recompensa_descripcion TEXT,
    creado_por INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE SET NULL,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de registros de tareas completadas
CREATE TABLE tareas_completadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    tarea_id INT NOT NULL,
    meta_id INT NULL, -- Si está relacionada con una meta específica
    fecha_realizacion DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    cantidad_realizada DECIMAL(10,2) NOT NULL,
    unidad_medida VARCHAR(50),
    tiempo_total_horas DECIMAL(6,2) NOT NULL,
    calidad_trabajo ENUM('Excelente', 'Bueno', 'Regular', 'Malo') DEFAULT 'Bueno',
    dificultad_percibida ENUM('Facil', 'Medio', 'Dificil') DEFAULT 'Medio',
    observaciones TEXT,
    ubicacion VARCHAR(200), -- Campo, sector, etc.
    clima_condiciones VARCHAR(100),
    herramientas_utilizadas TEXT,
    validado_por INT NULL,
    fecha_validacion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE RESTRICT,
    FOREIGN KEY (meta_id) REFERENCES metas(id) ON DELETE SET NULL,
    FOREIGN KEY (validado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de evaluaciones de rendimiento
CREATE TABLE evaluaciones_rendimiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    tipo_evaluacion ENUM('Mensual', 'Trimestral', 'Semestral', 'Anual') DEFAULT 'Mensual',
    puntaje_total DECIMAL(5,2) DEFAULT 0.00, -- 0-100
    puntaje_productividad DECIMAL(5,2) DEFAULT 0.00,
    puntaje_calidad DECIMAL(5,2) DEFAULT 0.00,
    puntaje_puntualidad DECIMAL(5,2) DEFAULT 0.00,
    puntaje_trabajo_equipo DECIMAL(5,2) DEFAULT 0.00,
    tareas_completadas INT DEFAULT 0,
    metas_alcanzadas INT DEFAULT 0,
    fortalezas TEXT,
    areas_mejora TEXT,
    comentarios_empleado TEXT,
    comentarios_supervisor TEXT,
    plan_mejora TEXT,
    evaluado_por INT NOT NULL,
    estado ENUM('Borrador', 'Completada', 'Aprobada') DEFAULT 'Borrador',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de indicadores de productividad (resumen por empleado/período)
CREATE TABLE indicadores_productividad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    periodo_year YEAR NOT NULL,
    periodo_month TINYINT NOT NULL, -- 1-12
    tareas_completadas INT DEFAULT 0,
    horas_trabajadas DECIMAL(8,2) DEFAULT 0.00,
    promedio_calidad DECIMAL(4,2) DEFAULT 0.00, -- 1-4 (Malo-Excelente)
    eficiencia_porcentaje DECIMAL(5,2) DEFAULT 0.00, -- 0-100%
    metas_completadas INT DEFAULT 0,
    metas_total INT DEFAULT 0,
    porcentaje_metas DECIMAL(5,2) DEFAULT 0.00,
    fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY unique_empleado_periodo (empleado_id, periodo_year, periodo_month)
);

-- Índices para optimización
CREATE INDEX idx_tareas_categoria ON tareas(categoria_id);
CREATE INDEX idx_metas_empleado ON metas(empleado_id);
CREATE INDEX idx_metas_fechas ON metas(fecha_inicio, fecha_limite);
CREATE INDEX idx_metas_estado ON metas(estado);
CREATE INDEX idx_tareas_completadas_empleado ON tareas_completadas(empleado_id);
CREATE INDEX idx_tareas_completadas_fecha ON tareas_completadas(fecha_realizacion);
CREATE INDEX idx_evaluaciones_empleado ON evaluaciones_rendimiento(empleado_id);
CREATE INDEX idx_evaluaciones_periodo ON evaluaciones_rendimiento(periodo_inicio, periodo_fin);
CREATE INDEX idx_indicadores_empleado_periodo ON indicadores_productividad(empleado_id, periodo_year, periodo_month);
