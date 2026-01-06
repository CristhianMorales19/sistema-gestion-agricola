-- ============================================
-- Migración 004: Crear tablas de nómina
-- ============================================

USE gestion_agricola;

-- Tabla de períodos de nómina
CREATE TABLE periodos_nomina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL, -- Ej: "Enero 2025", "Quincenal 1 - Enero 2025"
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo_periodo ENUM('Mensual', 'Quincenal', 'Semanal') DEFAULT 'Mensual',
    estado ENUM('Abierto', 'Calculado', 'Pagado', 'Cerrado') DEFAULT 'Abierto',
    fecha_pago DATE NULL,
    observaciones TEXT,
    creado_por INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_periodo (fecha_inicio, fecha_fin, tipo_periodo)
);

-- Tabla de conceptos de nómina (ingresos y deducciones)
CREATE TABLE conceptos_nomina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('Ingreso', 'Deduccion') NOT NULL,
    es_base BOOLEAN DEFAULT FALSE, -- Si se usa para calcular otros conceptos
    es_automatico BOOLEAN DEFAULT FALSE, -- Si se calcula automáticamente
    formula TEXT, -- Fórmula de cálculo si es automático
    porcentaje DECIMAL(5,2) DEFAULT NULL, -- Para cálculos porcentuales
    valor_fijo DECIMAL(10,2) DEFAULT NULL, -- Para valores fijos
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de nómina por empleado y período
CREATE TABLE nomina_empleados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    periodo_id INT NOT NULL,
    empleado_id INT NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL,
    dias_trabajados INT DEFAULT 0,
    horas_trabajadas DECIMAL(8,2) DEFAULT 0.00,
    horas_extras DECIMAL(8,2) DEFAULT 0.00,
    total_ingresos DECIMAL(10,2) DEFAULT 0.00,
    total_deducciones DECIMAL(10,2) DEFAULT 0.00,
    neto_pagar DECIMAL(10,2) DEFAULT 0.00,
    estado ENUM('Pendiente', 'Calculado', 'Pagado') DEFAULT 'Pendiente',
    fecha_pago TIMESTAMP NULL,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (periodo_id) REFERENCES periodos_nomina(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY unique_nomina_empleado_periodo (periodo_id, empleado_id)
);

-- Tabla de detalles de nómina (conceptos aplicados)
CREATE TABLE nomina_detalles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nomina_empleado_id INT NOT NULL,
    concepto_id INT NOT NULL,
    cantidad DECIMAL(8,2) DEFAULT 1.00, -- Para horas, días, etc.
    valor_unitario DECIMAL(10,2) DEFAULT 0.00,
    valor_total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nomina_empleado_id) REFERENCES nomina_empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (concepto_id) REFERENCES conceptos_nomina(id) ON DELETE RESTRICT
);

-- Tabla de configuración de salarios por cargo
CREATE TABLE configuracion_salarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cargo_id INT NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL,
    valor_hora_extra DECIMAL(10,2) DEFAULT NULL,
    bonificaciones JSON, -- Bonificaciones especiales del cargo
    fecha_vigencia_inicio DATE NOT NULL,
    fecha_vigencia_fin DATE NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_por INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de recibos de pago generados
CREATE TABLE recibos_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nomina_empleado_id INT NOT NULL,
    numero_recibo VARCHAR(50) NOT NULL UNIQUE,
    archivo_pdf VARCHAR(255) NULL,
    enviado_email BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nomina_empleado_id) REFERENCES nomina_empleados(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX idx_periodos_fechas ON periodos_nomina(fecha_inicio, fecha_fin);
CREATE INDEX idx_periodos_estado ON periodos_nomina(estado);
CREATE INDEX idx_nomina_empleados_periodo ON nomina_empleados(periodo_id);
CREATE INDEX idx_nomina_empleados_empleado ON nomina_empleados(empleado_id);
CREATE INDEX idx_nomina_detalles_nomina ON nomina_detalles(nomina_empleado_id);
CREATE INDEX idx_configuracion_cargo ON configuracion_salarios(cargo_id);
CREATE INDEX idx_configuracion_vigencia ON configuracion_salarios(fecha_vigencia_inicio, fecha_vigencia_fin);
