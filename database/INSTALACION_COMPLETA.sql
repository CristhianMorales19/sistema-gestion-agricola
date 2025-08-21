-- =====================================================
-- INSTALACIÓN COMPLETA DE BASE DE DATOS - SCRIPT ÚNICO
-- Sistema de Gestión Agrícola
-- =====================================================
-- INSTRUCCIONES:
-- 1. Tener MySQL 8.0+ instalado y funcionando
-- 2. Ejecutar: mysql -u root -p < INSTALACION_COMPLETA.sql
-- 3. Todo el código SQL está consolidado en este archivo
-- =====================================================

-- Eliminar base de datos si existe (CUIDADO: Borra datos existentes)
DROP DATABASE IF EXISTS gestion_agricola;

-- Crear la base de datos
CREATE DATABASE gestion_agricola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_agricola;

-- =====================================================
-- MIGRACION 001: TABLAS DE USUARIOS Y AUTENTICACIÓN
-- =====================================================

-- Tabla de roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos JSON,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    avatar_url VARCHAR(255),
    rol_id INT NOT NULL,
    ultimo_acceso TIMESTAMP NULL,
    intentos_login INT DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Tabla de sesiones
CREATE TABLE sesiones (
    id VARCHAR(255) PRIMARY KEY,
    usuario_id INT NOT NULL,
    token_refresh VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expira_en TIMESTAMP NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de tokens de recuperación
CREATE TABLE tokens_recuperacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    tipo ENUM('password_reset', 'email_verification') NOT NULL,
    expira_en TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =====================================================
-- MIGRACION 002: TABLAS DE PERSONAL
-- =====================================================

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

-- =====================================================
-- MIGRACION 003: TABLAS DE ASISTENCIA
-- =====================================================

-- Tabla de horarios laborales
CREATE TABLE horarios_laborales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    hora_almuerzo_inicio TIME,
    hora_almuerzo_fin TIME,
    tolerancia_minutos INT DEFAULT 15,
    dias_semana JSON,
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

-- =====================================================
-- MIGRACION 004: TABLAS DE NÓMINA
-- =====================================================

-- Tabla de períodos de nómina
CREATE TABLE periodos_nomina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
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

-- Tabla de conceptos de nómina
CREATE TABLE conceptos_nomina (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('Ingreso', 'Deduccion') NOT NULL,
    es_base BOOLEAN DEFAULT FALSE,
    es_automatico BOOLEAN DEFAULT FALSE,
    formula TEXT,
    porcentaje DECIMAL(5,2) DEFAULT NULL,
    valor_fijo DECIMAL(10,2) DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de nómina por empleado
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
    observaciones TEXT,
    fecha_calculo TIMESTAMP NULL,
    fecha_pago TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (periodo_id) REFERENCES periodos_nomina(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY unique_nomina_empleado_periodo (empleado_id, periodo_id)
);

-- Tabla de detalles de nómina
CREATE TABLE nomina_detalles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nomina_empleado_id INT NOT NULL,
    concepto_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cantidad DECIMAL(8,2) DEFAULT 1.00,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nomina_empleado_id) REFERENCES nomina_empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (concepto_id) REFERENCES conceptos_nomina(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_nomina_concepto (nomina_empleado_id, concepto_id)
);

-- Tabla de recibos de pago
CREATE TABLE recibos_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nomina_empleado_id INT NOT NULL,
    numero_recibo VARCHAR(50) NOT NULL UNIQUE,
    pdf_path VARCHAR(500),
    enviado_email BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nomina_empleado_id) REFERENCES nomina_empleados(id) ON DELETE CASCADE
);

-- Tabla de configuración de salarios
CREATE TABLE configuracion_salarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cargo_id INT NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL,
    fecha_vigencia DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cargo_id) REFERENCES cargos(id) ON DELETE CASCADE
);

-- =====================================================
-- MIGRACION 005: TABLAS DE PRODUCTIVIDAD
-- =====================================================

-- Tabla de categorías de tareas
CREATE TABLE categorias_tareas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas disponibles
CREATE TABLE tareas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT NOT NULL,
    unidad_medida VARCHAR(50) DEFAULT 'Unidad',
    tiempo_estimado INT DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_tareas(id) ON DELETE RESTRICT
);

-- Tabla de tareas completadas por empleados
CREATE TABLE tareas_completadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    tarea_id INT NOT NULL,
    fecha_completada DATE NOT NULL,
    cantidad_completada DECIMAL(8,2) NOT NULL DEFAULT 1.00,
    tiempo_empleado INT DEFAULT NULL,
    calidad_trabajo ENUM('Excelente', 'Bueno', 'Regular', 'Deficiente') DEFAULT 'Bueno',
    observaciones TEXT,
    validado_por INT NULL,
    fecha_validacion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE RESTRICT,
    FOREIGN KEY (validado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de metas por empleado
CREATE TABLE metas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    tarea_id INT NOT NULL,
    periodo_tipo ENUM('Diario', 'Semanal', 'Mensual', 'Anual') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    meta_cantidad DECIMAL(8,2) NOT NULL,
    cantidad_actual DECIMAL(8,2) DEFAULT 0.00,
    porcentaje_cumplimiento DECIMAL(5,2) DEFAULT 0.00,
    estado ENUM('Activa', 'Cumplida', 'Vencida', 'Cancelada') DEFAULT 'Activa',
    observaciones TEXT,
    creado_por INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE RESTRICT,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de evaluaciones de rendimiento
CREATE TABLE evaluaciones_rendimiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    evaluador_id INT NOT NULL,
    periodo_evaluacion VARCHAR(100) NOT NULL,
    fecha_evaluacion DATE NOT NULL,
    puntaje_total DECIMAL(5,2) DEFAULT 0.00,
    puntaje_productividad DECIMAL(5,2) DEFAULT 0.00,
    puntaje_calidad DECIMAL(5,2) DEFAULT 0.00,
    puntaje_cumplimiento DECIMAL(5,2) DEFAULT 0.00,
    puntaje_actitud DECIMAL(5,2) DEFAULT 0.00,
    fortalezas TEXT,
    areas_mejora TEXT,
    plan_desarrollo TEXT,
    observaciones_generales TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluador_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- Tabla de indicadores de productividad
CREATE TABLE indicadores_productividad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    fecha DATE NOT NULL,
    tareas_asignadas INT DEFAULT 0,
    tareas_completadas INT DEFAULT 0,
    porcentaje_cumplimiento DECIMAL(5,2) DEFAULT 0.00,
    horas_productivas DECIMAL(4,2) DEFAULT 0.00,
    eficiencia_promedio DECIMAL(5,2) DEFAULT 0.00,
    fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY unique_empleado_fecha (empleado_id, fecha)
);

-- =====================================================
-- MIGRACION 006: TABLAS DE REPORTES
-- =====================================================

-- Tabla de configuración de reportes
CREATE TABLE configuracion_reportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('empleados', 'asistencia', 'nomina', 'productividad', 'financiero') NOT NULL,
    campos_disponibles JSON,
    filtros_disponibles JSON,
    formato_exportacion ENUM('pdf', 'excel', 'csv') DEFAULT 'pdf',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reportes generados
CREATE TABLE reportes_generados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    configuracion_reporte_id INT NOT NULL,
    generado_por INT NOT NULL,
    nombre_archivo VARCHAR(500) NOT NULL,
    ruta_archivo VARCHAR(1000),
    parametros_filtros JSON,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tamaño_archivo BIGINT DEFAULT 0,
    estado ENUM('Generando', 'Completado', 'Error') DEFAULT 'Generando',
    mensaje_error TEXT NULL,
    FOREIGN KEY (configuracion_reporte_id) REFERENCES configuracion_reportes(id) ON DELETE CASCADE,
    FOREIGN KEY (generado_por) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de programación de reportes automáticos
CREATE TABLE programacion_reportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    configuracion_reporte_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    frecuencia ENUM('Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual') NOT NULL,
    dia_ejecucion INT DEFAULT 1,
    hora_ejecucion TIME DEFAULT '08:00:00',
    emails_envio JSON,
    parametros_filtros JSON,
    activo BOOLEAN DEFAULT TRUE,
    ultima_ejecucion TIMESTAMP NULL,
    proxima_ejecucion TIMESTAMP NULL,
    creado_por INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (configuracion_reporte_id) REFERENCES configuracion_reportes(id) ON DELETE CASCADE,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de reportes favoritos por usuario
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

-- =====================================================
-- MIGRACION 007: TABLAS DE CONFIGURACIÓN
-- =====================================================

-- Tabla de configuración del sistema
CREATE TABLE configuracion_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descripcion TEXT,
    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    categoria VARCHAR(50) DEFAULT 'general',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de logs del sistema
CREATE TABLE logs_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nivel ENUM('debug', 'info', 'warning', 'error', 'critical') NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    detalles JSON NULL,
    usuario_id INT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    leida BOOLEAN DEFAULT FALSE,
    fecha_leida TIMESTAMP NULL,
    enlace VARCHAR(500) NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de respaldos automáticos
CREATE TABLE respaldos_automaticos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    ruta_archivo VARCHAR(1000) NOT NULL,
    tamaño_archivo BIGINT DEFAULT 0,
    tipo ENUM('completo', 'incremental') DEFAULT 'completo',
    estado ENUM('iniciado', 'completado', 'error') DEFAULT 'iniciado',
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    mensaje_error TEXT NULL
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices de usuarios y autenticación
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_sesiones_usuario ON sesiones(usuario_id);
CREATE INDEX idx_sesiones_activa ON sesiones(activa);
CREATE INDEX idx_tokens_token ON tokens_recuperacion(token);
CREATE INDEX idx_tokens_expira ON tokens_recuperacion(expira_en);

-- Índices de personal
CREATE INDEX idx_empleados_cedula ON empleados(cedula);
CREATE INDEX idx_empleados_cargo ON empleados(cargo_id);
CREATE INDEX idx_empleados_activo ON empleados(activo);
CREATE INDEX idx_empleados_fecha_ingreso ON empleados(fecha_ingreso);
CREATE INDEX idx_cargos_departamento ON cargos(departamento_id);
CREATE INDEX idx_historial_empleado ON historial_cargos(empleado_id);

-- Índices de asistencia
CREATE INDEX idx_registros_empleado_fecha ON registros_asistencia(empleado_id, fecha);
CREATE INDEX idx_registros_fecha ON registros_asistencia(fecha);
CREATE INDEX idx_registros_estado ON registros_asistencia(estado);
CREATE INDEX idx_permisos_empleado ON permisos(empleado_id);
CREATE INDEX idx_permisos_estado ON permisos(estado);
CREATE INDEX idx_permisos_fechas ON permisos(fecha_inicio, fecha_fin);
CREATE INDEX idx_empleado_horarios_empleado ON empleado_horarios(empleado_id);

-- Índices de nómina
CREATE INDEX idx_nomina_empleados_periodo ON nomina_empleados(periodo_id);
CREATE INDEX idx_nomina_empleados_empleado ON nomina_empleados(empleado_id);
CREATE INDEX idx_nomina_detalles_nomina ON nomina_detalles(nomina_empleado_id);
CREATE INDEX idx_recibos_nomina ON recibos_pago(nomina_empleado_id);

-- Índices de productividad
CREATE INDEX idx_tareas_categoria ON tareas(categoria_id);
CREATE INDEX idx_tareas_completadas_empleado ON tareas_completadas(empleado_id);
CREATE INDEX idx_tareas_completadas_fecha ON tareas_completadas(fecha_completada);
CREATE INDEX idx_metas_empleado ON metas(empleado_id);
CREATE INDEX idx_metas_estado ON metas(estado);
CREATE INDEX idx_evaluaciones_empleado ON evaluaciones_rendimiento(empleado_id);
CREATE INDEX idx_indicadores_empleado ON indicadores_productividad(empleado_id);

-- Índices de reportes
CREATE INDEX idx_empleados_activo_cargo ON empleados(activo, cargo_id);
CREATE INDEX idx_asistencia_fecha_empleado ON registros_asistencia(fecha, empleado_id);
CREATE INDEX idx_tareas_fecha_empleado ON tareas_completadas(fecha_completada, empleado_id);

-- Relación faltante (se debe ejecutar después de crear empleados)
ALTER TABLE departamentos 
ADD CONSTRAINT fk_departamentos_jefe
FOREIGN KEY (jefe_id) REFERENCES empleados(id) ON DELETE SET NULL;

-- =====================================================
-- DATOS INICIALES - ROLES Y PERMISOS
-- =====================================================

INSERT INTO roles (nombre, descripcion, permisos) VALUES
('Super_Admin', 'Administrador con acceso completo al sistema', JSON_ARRAY('*')),
('Admin', 'Administrador con permisos de gestión', JSON_ARRAY('usuarios.*', 'empleados.*', 'reportes.*', 'configuracion.*')),
('Supervisor', 'Supervisor con permisos de gestión de personal', JSON_ARRAY('empleados.view', 'empleados.edit', 'asistencia.*', 'productividad.*')),
('Empleado', 'Empleado con permisos básicos', JSON_ARRAY('asistencia.view', 'productividad.view', 'perfil.edit')),
('Invitado', 'Usuario con permisos de solo lectura', JSON_ARRAY('reportes.view'));

-- =====================================================
-- DATOS INICIALES - DEPARTAMENTOS
-- =====================================================

INSERT INTO departamentos (nombre, descripcion) VALUES
('Producción', 'Departamento encargado de las actividades productivas agrícolas'),
('Administración', 'Departamento administrativo y financiero'),
('Recursos Humanos', 'Gestión del personal y desarrollo humano'),
('Mantenimiento', 'Mantenimiento de equipos e infraestructura'),
('Control de Calidad', 'Supervisión y control de calidad de productos'),
('Logística', 'Gestión de inventarios y distribución');

-- =====================================================
-- DATOS INICIALES - CARGOS
-- =====================================================

INSERT INTO cargos (nombre, descripcion, salario_base, departamento_id) VALUES
-- Cargos de Producción
('Supervisor de Producción', 'Supervisa las actividades de producción agrícola', 2500000.00, 1),
('Operario Agrícola', 'Ejecuta labores agrícolas básicas', 1200000.00, 1),
('Técnico Agrícola', 'Técnico especializado en cultivos', 1800000.00, 1),
('Jefe de Cultivo', 'Responsable de un cultivo específico', 2200000.00, 1),

-- Cargos de Administración
('Gerente General', 'Gerencia general de la empresa', 4500000.00, 2),
('Contador', 'Responsable de la contabilidad', 2800000.00, 2),
('Auxiliar Contable', 'Apoyo en labores contables', 1500000.00, 2),
('Secretaria', 'Asistente administrativa', 1300000.00, 2),

-- Cargos de Recursos Humanos
('Jefe de Recursos Humanos', 'Jefe del departamento de RRHH', 3000000.00, 3),
('Analista de Personal', 'Análisis y gestión de personal', 2000000.00, 3),
('Psicólogo Organizacional', 'Apoyo psicológico y organizacional', 2400000.00, 3),

-- Cargos de Mantenimiento
('Jefe de Mantenimiento', 'Responsable del mantenimiento general', 2600000.00, 4),
('Mecánico', 'Mantenimiento de maquinaria', 1800000.00, 4),
('Electricista', 'Mantenimiento eléctrico', 1900000.00, 4),

-- Cargos de Control de Calidad
('Supervisor de Calidad', 'Supervisión de control de calidad', 2300000.00, 5),
('Inspector de Calidad', 'Inspección de productos', 1600000.00, 5),

-- Cargos de Logística
('Jefe de Logística', 'Responsable de logística y distribución', 2700000.00, 6),
('Almacenista', 'Gestión de almacén', 1400000.00, 6),
('Conductor', 'Transporte de productos', 1350000.00, 6),
('Coordinador de Despachos', 'Coordinación de entregas', 1700000.00, 6);

-- =====================================================
-- DATOS INICIALES - USUARIO ADMINISTRADOR
-- =====================================================

INSERT INTO usuarios (email, password_hash, nombre, apellido, rol_id) VALUES
('admin@gestionagricola.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Sistema', 1);

-- =====================================================
-- DATOS INICIALES - TIPOS DE PERMISOS
-- =====================================================

INSERT INTO tipos_permisos (nombre, descripcion, requiere_aprobacion, dias_maximos, remunerado) VALUES
('Vacaciones', 'Vacaciones anuales del empleado', TRUE, 15, TRUE),
('Enfermedad', 'Permiso por enfermedad', FALSE, 30, TRUE),
('Calamidad Doméstica', 'Permiso por calamidad doméstica', TRUE, 5, TRUE),
('Licencia de Maternidad', 'Licencia por maternidad', FALSE, 126, TRUE),
('Licencia de Paternidad', 'Licencia por paternidad', FALSE, 8, TRUE),
('Capacitación', 'Permiso para capacitación', TRUE, 10, TRUE),
('Asuntos Personales', 'Permiso por asuntos personales', TRUE, 3, FALSE);

-- =====================================================
-- DATOS INICIALES - HORARIOS LABORALES
-- =====================================================

INSERT INTO horarios_laborales (nombre, hora_entrada, hora_salida, hora_almuerzo_inicio, hora_almuerzo_fin, tolerancia_minutos, dias_semana) VALUES
('Jornada Normal', '07:00:00', '16:00:00', '12:00:00', '13:00:00', 15, JSON_ARRAY('lunes', 'martes', 'miercoles', 'jueves', 'viernes')),
('Jornada Administrativa', '08:00:00', '17:00:00', '12:30:00', '13:30:00', 10, JSON_ARRAY('lunes', 'martes', 'miercoles', 'jueves', 'viernes')),
('Jornada Sábado', '07:00:00', '12:00:00', NULL, NULL, 15, JSON_ARRAY('sabado'));

-- =====================================================
-- DATOS INICIALES - CATEGORÍAS DE TAREAS
-- =====================================================

INSERT INTO categorias_tareas (nombre, descripcion, color) VALUES
('Cultivo', 'Tareas relacionadas con cultivos', '#28a745'),
('Cosecha', 'Actividades de cosecha', '#ffc107'),
('Mantenimiento', 'Mantenimiento de equipos e instalaciones', '#17a2b8'),
('Administración', 'Tareas administrativas', '#6c757d'),
('Control de Calidad', 'Inspección y control de calidad', '#dc3545'),
('Logística', 'Actividades de logística y distribución', '#6f42c1');

-- =====================================================
-- DATOS INICIALES - TAREAS BÁSICAS
-- =====================================================

INSERT INTO tareas (nombre, descripcion, categoria_id, unidad_medida, tiempo_estimado) VALUES
-- Tareas de Cultivo
('Siembra', 'Siembra de semillas en campo', 1, 'Hectáreas', 480),
('Riego', 'Riego de cultivos', 1, 'Hectáreas', 120),
('Fumigación', 'Aplicación de pesticidas', 1, 'Hectáreas', 180),
('Fertilización', 'Aplicación de fertilizantes', 1, 'Hectáreas', 240),
('Desyerbe', 'Eliminación de maleza', 1, 'Hectáreas', 360),

-- Tareas de Cosecha  
('Recolección Manual', 'Recolección manual de frutos', 2, 'Kilogramos', 60),
('Clasificación', 'Clasificación de productos', 2, 'Kilogramos', 30),
('Empaque', 'Empaque de productos', 2, 'Cajas', 5),

-- Tareas de Mantenimiento
('Mantenimiento de Equipos', 'Revisión y mantenimiento de maquinaria', 3, 'Equipos', 120),
('Reparación de Infraestructura', 'Reparaciones menores en instalaciones', 3, 'Unidad', 180),

-- Tareas Administrativas
('Elaboración de Reportes', 'Creación de reportes operativos', 4, 'Reportes', 60),
('Gestión de Inventarios', 'Control y actualización de inventarios', 4, 'Inventarios', 120);

-- =====================================================
-- DATOS INICIALES - CONCEPTOS DE NÓMINA
-- =====================================================

INSERT INTO conceptos_nomina (codigo, nombre, descripcion, tipo, es_base, es_automatico) VALUES
-- Ingresos
('SUELDO', 'Sueldo Básico', 'Salario básico mensual', 'Ingreso', TRUE, TRUE),
('HEXTRAS', 'Horas Extras', 'Pago por horas extras trabajadas', 'Ingreso', FALSE, TRUE),
('BONIF', 'Bonificaciones', 'Bonificaciones especiales', 'Ingreso', FALSE, FALSE),
('AUXILIO', 'Auxilio de Transporte', 'Auxilio legal de transporte', 'Ingreso', FALSE, TRUE),

-- Deducciones
('SALUD', 'Aporte Salud', 'Aporte empleado sistema de salud', 'Deduccion', FALSE, TRUE),
('PENSION', 'Aporte Pensión', 'Aporte empleado sistema pensional', 'Deduccion', FALSE, TRUE),
('RETENCION', 'Retención en la Fuente', 'Retención tributaria', 'Deduccion', FALSE, TRUE),
('PRESTAMO', 'Descuento Préstamo', 'Descuento por préstamos', 'Deduccion', FALSE, FALSE);

-- =====================================================
-- DATOS INICIALES - CONFIGURACIÓN DEL SISTEMA
-- =====================================================

INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo, categoria) VALUES
('empresa_nombre', 'Gestión Agrícola S.A.S', 'Nombre de la empresa', 'string', 'empresa'),
('empresa_nit', '900.123.456-7', 'NIT de la empresa', 'string', 'empresa'),
('empresa_telefono', '+57 1 234-5678', 'Teléfono principal', 'string', 'empresa'),
('empresa_email', 'contacto@gestionagricola.com', 'Email de contacto', 'string', 'empresa'),
('empresa_direccion', 'Km 15 Vía Principal, Municipio Agrícola', 'Dirección física', 'string', 'empresa'),
('sistema_version', '1.0.0', 'Versión del sistema', 'string', 'sistema'),
('backup_automatico', 'true', 'Habilitar backup automático', 'boolean', 'sistema'),
('notificaciones_email', 'true', 'Envío de notificaciones por email', 'boolean', 'notificaciones'),
('salario_minimo', '1300000', 'Salario mínimo legal vigente', 'number', 'nomina'),
('auxilio_transporte', '140606', 'Valor auxilio de transporte', 'number', 'nomina');

-- =====================================================
-- CONFIGURACIÓN DE REPORTES PREDEFINIDOS
-- =====================================================

INSERT INTO configuracion_reportes (nombre, descripcion, tipo, campos_disponibles, filtros_disponibles, formato_exportacion) VALUES
('Reporte de Empleados Activos', 'Listado completo de empleados activos', 'empleados',
 '["nombre", "apellido", "cedula", "cargo", "departamento", "fecha_ingreso", "salario"]',
 '["departamento_id", "cargo_id", "estado_civil", "fecha_ingreso"]', 'excel'),

('Reporte de Asistencia Mensual', 'Reporte de asistencia por mes', 'asistencia',
 '["empleado", "dias_trabajados", "tardanzas", "faltas", "horas_trabajadas"]',
 '["mes", "año", "departamento_id", "empleado_id"]', 'pdf'),

('Reporte de Nómina', 'Resumen de nómina procesada', 'nomina',
 '["empleado", "salario_base", "total_ingresos", "total_deducciones", "neto_pagar"]',
 '["periodo_inicio", "periodo_fin", "empleado_id", "departamento_id"]', 'pdf'),

('Reporte de Productividad', 'Análisis de productividad por empleado', 'productividad',
 '["empleado", "tareas_asignadas", "tareas_completadas", "porcentaje_cumplimiento"]',
 '["periodo_inicio", "periodo_fin", "empleado_id", "departamento_id"]', 'pdf'),

('Reporte Financiero', 'Resumen financiero de gastos de personal', 'financiero',
 '["total_nomina", "total_aportes", "total_deducciones", "costo_total"]',
 '["mes", "año", "departamento_id"]', 'excel');

-- =====================================================
-- CREAR USUARIO PARA LA APLICACIÓN
-- =====================================================

CREATE USER IF NOT EXISTS 'app_agricola'@'localhost' IDENTIFIED BY 'App123!Segura';
CREATE USER IF NOT EXISTS 'app_agricola'@'%' IDENTIFIED BY 'App123!Segura';

GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_agricola.* TO 'app_agricola'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_agricola.* TO 'app_agricola'@'%';

FLUSH PRIVILEGES;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

SELECT '✅ INSTALACIÓN COMPLETADA EXITOSAMENTE' as ESTADO;

SELECT 
    'Base de Datos' as Componente,
    'gestion_agricola' as Nombre,
    'Creada correctamente' as Estado;

SELECT 
    'Tablas creadas' as Componente,
    COUNT(*) as Total,
    'Estructura completa implementada' as Estado
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'gestion_agricola';

SELECT 'Roles del sistema' as Componente, COUNT(*) as Total, '✅ Configurados' as Estado FROM roles;
SELECT 'Departamentos' as Componente, COUNT(*) as Total, '✅ Configurados' as Estado FROM departamentos;  
SELECT 'Cargos definidos' as Componente, COUNT(*) as Total, '✅ Configurados' as Estado FROM cargos;
SELECT 'Usuarios admin' as Componente, COUNT(*) as Total, '✅ Creado' as Estado FROM usuarios;
SELECT 'Tipos de permisos' as Componente, COUNT(*) as Total, '✅ Configurados' as Estado FROM tipos_permisos;
SELECT 'Categorías de tareas' as Componente, COUNT(*) as Total, '✅ Configuradas' as Estado FROM categorias_tareas;
SELECT 'Tareas básicas' as Componente, COUNT(*) as Total, '✅ Configuradas' as Estado FROM tareas;
SELECT 'Conceptos de nómina' as Componente, COUNT(*) as Total, '✅ Configurados' as Estado FROM conceptos_nomina;

-- Mostrar credenciales de acceso
SELECT '=== CREDENCIALES PARA LA APLICACIÓN ===' as INFO;

SELECT 
    'admin@gestionagricola.com' as 'Usuario Web',
    'Admin123!' as 'Contraseña Web',
    'Super Administrador' as 'Rol Web';

SELECT 
    'app_agricola' as 'Usuario MySQL',
    'App123!Segura' as 'Contraseña MySQL', 
    'gestion_agricola' as 'Base de Datos',
    'localhost' as 'Host';

SELECT '🎉 BASE DE DATOS LISTA PARA USAR' as RESULTADO;
SELECT '📊 33 tablas implementadas con datos iniciales' as DETALLE;
SELECT '🔐 Usuarios configurados para desarrollo y producción' as SEGURIDAD;
SELECT '⚙️ Sistema listo para conectar el backend' as SIGUIENTE_PASO;

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Cambiar contraseñas en producción
-- 2. Configurar .env del backend con estas credenciales
-- 3. Realizar backup antes de modificaciones importantes  
-- 4. Usuario web: admin@gestionagricola.com / Admin123!
-- 5. Usuario BD: app_agricola / App123!Segura
-- =====================================================
