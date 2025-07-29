-- ============================================
-- Migración 002: Crear tablas de personal
-- ============================================

USE gestion_agricola;

-- Tabla de departamentos
CREATE TABLE departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    jefe_id INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de cargos
CREATE TABLE cargos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    salario_base DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    departamento_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE RESTRICT
);

-- Tabla de empleados
CREATE TABLE empleados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    genero ENUM('M', 'F', 'Otro') NOT NULL,
    estado_civil ENUM('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Union_libre') DEFAULT 'Soltero',
    numero_hijos INT DEFAULT 0,
    contacto_emergencia_nombre VARCHAR(100),
    contacto_emergencia_telefono VARCHAR(20),
    cargo_id INT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    fecha_salida DATE NULL,
    salario_actual DECIMAL(10,2) NOT NULL,
    tipo_contrato ENUM('Indefinido', 'Fijo', 'Temporal', 'Practicante') DEFAULT 'Indefinido',
    jornada_laboral ENUM('Completa', 'Media', 'Por_horas') DEFAULT 'Completa',
    usuario_id INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de historial de cargos
CREATE TABLE historial_cargos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    cargo_anterior_id INT,
    cargo_nuevo_id INT NOT NULL,
    salario_anterior DECIMAL(10,2),
    salario_nuevo DECIMAL(10,2) NOT NULL,
    motivo TEXT,
    fecha_cambio DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (cargo_anterior_id) REFERENCES cargos(id) ON DELETE SET NULL,
    FOREIGN KEY (cargo_nuevo_id) REFERENCES cargos(id) ON DELETE RESTRICT
);

-- Agregar clave foránea para jefe de departamento
ALTER TABLE departamentos 
ADD FOREIGN KEY (jefe_id) REFERENCES empleados(id) ON DELETE SET NULL;

-- Índices para optimización
CREATE INDEX idx_empleados_cedula ON empleados(cedula);
CREATE INDEX idx_empleados_cargo ON empleados(cargo_id);
CREATE INDEX idx_empleados_activo ON empleados(activo);
CREATE INDEX idx_empleados_fecha_ingreso ON empleados(fecha_ingreso);
CREATE INDEX idx_cargos_departamento ON cargos(departamento_id);
CREATE INDEX idx_historial_empleado ON historial_cargos(empleado_id);
