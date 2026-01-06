/*
    Autor: Sebastian Alpízar Porras (CORREGIDO)
    Fecha: 2025-08-09
    Propósito: Script de creación de esquema para Sistema de Gestión de Trabajadores Agrícolas (Mano de Obra).
    Convenciones aplicadas: B02, B05, B06. Prefijos: mom_ (catálogos/mantenimiento), mot_ (transaccional), mof_ (fijas), rel_ (M:N).
    
    CORRECCIONES APLICADAS:
    - Removido "IF NOT EXISTS" de los CREATE INDEX (no soportado en MySQL)
    - Mantenida toda la funcionalidad original
*/

-- Eliminar base de datos si existe
DROP DATABASE IF EXISTS gestion_agricola_sebastian;

-- Crear la base de datos
CREATE DATABASE gestion_agricola_sebastian CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_agricola_sebastian;

/* ===========================================================
   1) TABLAS DE CATÁLOGO / MANTENIMIENTO (mom_)
   =========================================================== */

CREATE TABLE IF NOT EXISTS mom_trabajador (
    trabajador_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del trabajador',
    documento_identidad VARCHAR(50) NOT NULL UNIQUE COMMENT 'Documento de identidad del trabajador',
    nombre_completo VARCHAR(150) NOT NULL COMMENT 'Nombre completo',
    fecha_nacimiento DATE NOT NULL COMMENT 'Fecha de nacimiento',
    telefono VARCHAR(20) DEFAULT NULL COMMENT 'Teléfono',
    email VARCHAR(100) DEFAULT NULL COMMENT 'Correo electrónico',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado: activo/inactivo',
    fecha_registro_at DATETIME NOT NULL COMMENT 'Fecha de registro',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de trabajadores. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_rol (
    rol_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del rol',
    codigo VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código del rol',
    nombre VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre del rol',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción del rol',
    fecha_creacion_at DATETIME NOT NULL COMMENT 'Fecha de creación',
    is_critico TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Rol crítico (booleano)',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de roles. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_permiso (
    permiso_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador del permiso',
    codigo VARCHAR(50) DEFAULT NULL COMMENT 'Código del permiso',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del permiso',
    categoria VARCHAR(100) DEFAULT NULL COMMENT 'Categoría',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción del permiso',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de permisos. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_cuadrilla (
    cuadrilla_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de la cuadrilla',
    codigo_identificador VARCHAR(50) NOT NULL UNIQUE COMMENT 'Código único de la cuadrilla',
    nombre VARCHAR(120) NOT NULL COMMENT 'Nombre de la cuadrilla',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción',
    area_trabajo VARCHAR(150) DEFAULT NULL COMMENT 'Área de trabajo',
    fecha_creacion_at DATETIME NOT NULL COMMENT 'Fecha de creación',
    is_activa TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activa/inactiva',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de cuadrillas. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_parcela (
    parcela_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de parcela',
    nombre VARCHAR(120) NOT NULL UNIQUE COMMENT 'Nombre de la parcela',
    ubicacion_descripcion VARCHAR(250) DEFAULT NULL COMMENT 'Ubicación y descripción',
    area_hectareas DECIMAL(10,2) DEFAULT NULL COMMENT 'Área en hectáreas',
    tipo_terreno VARCHAR(80) DEFAULT NULL COMMENT 'Tipo de terreno',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción adicional',
    estado VARCHAR(50) NOT NULL DEFAULT 'disponible' COMMENT 'Estado: disponible/ocupada',
    is_activa TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de parcelas. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_cultivo (
    cultivo_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de cultivo',
    nombre VARCHAR(120) NOT NULL UNIQUE COMMENT 'Nombre del cultivo',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción',
    unidad_medida_principal VARCHAR(40) DEFAULT NULL COMMENT 'Unidad de medida principal',
    temporada_tipica VARCHAR(80) DEFAULT NULL COMMENT 'Temporada típica',
    imagen_path VARCHAR(250) DEFAULT NULL COMMENT 'Ruta imagen',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de cultivos. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_tarea (
    tarea_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de tarea específica',
    cultivo_id INT NOT NULL COMMENT 'Referencia al cultivo',
    nombre VARCHAR(150) NOT NULL COMMENT 'Nombre de la tarea',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción',
    unidad_medicion VARCHAR(50) DEFAULT NULL COMMENT 'Unidad de medición',
    rendimiento_estandar DECIMAL(10,4) DEFAULT NULL COMMENT 'Rendimiento estándar',
    instrucciones TEXT DEFAULT NULL COMMENT 'Instrucciones',
    niveles_dificultad VARCHAR(100) DEFAULT NULL COMMENT 'Niveles de dificultad',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOM_TAREA_RELATION_MOM_CULTIVO FOREIGN KEY (cultivo_id) REFERENCES mom_cultivo(cultivo_id)
) COMMENT='Catálogo de tareas específicas por cultivo. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_esquema_pago (
    esquema_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de esquema de pago',
    codigo VARCHAR(50) DEFAULT NULL COMMENT 'Código esquema',
    nombre VARCHAR(120) NOT NULL UNIQUE COMMENT 'Nombre del esquema',
    tipo VARCHAR(50) NOT NULL COMMENT 'Tipo (tareas/extras)',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción',
    fecha_creacion_at DATETIME NOT NULL COMMENT 'Fecha creación',
    fecha_vigencia_inicio_at DATETIME DEFAULT NULL COMMENT 'Inicio de vigencia',
    fecha_vigencia_fin_at DATETIME DEFAULT NULL COMMENT 'Fin de vigencia (NULL si no tiene fin)',
    estado VARCHAR(50) NOT NULL DEFAULT 'activo' COMMENT 'Estado',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de esquemas de pago. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_formula_pago (
    formula_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de fórmula de pago',
    esquema_id INT NOT NULL COMMENT 'Referencia al esquema de pago',
    formula TEXT NOT NULL COMMENT 'Fórmula (expresión o referencia)',
    variables_utilizadas TEXT DEFAULT NULL COMMENT 'Listado/JSON de variables utilizadas',
    ejemplo_calculo TEXT DEFAULT NULL COMMENT 'Ejemplo de cálculo',
    fecha_creacion_at DATETIME NOT NULL COMMENT 'Fecha creación',
    usuario_creacion INT NOT NULL COMMENT 'Usuario que creó la fórmula',
    is_activa TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOM_FORMULA_PAGO_RELATION_MOM_ESQUEMA_PAGO FOREIGN KEY (esquema_id) REFERENCES mom_esquema_pago(esquema_id)
) COMMENT='Fórmulas de pago asociadas a esquemas. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_bonificacion (
    bonificacion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de bonificación',
    codigo VARCHAR(50) DEFAULT NULL COMMENT 'Código bonificación',
    nombre VARCHAR(120) NOT NULL UNIQUE COMMENT 'Nombre',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción',
    tipo VARCHAR(50) DEFAULT NULL COMMENT 'Tipo (fija/porcentual)',
    monto_fijo DECIMAL(13,2) DEFAULT NULL COMMENT 'Monto fijo',
    porcentaje DECIMAL(7,4) DEFAULT NULL COMMENT 'Porcentaje (0..1)',
    base_calculo VARCHAR(120) DEFAULT NULL COMMENT 'Base de cálculo',
    condiciones_aplicacion TEXT DEFAULT NULL COMMENT 'Condiciones de aplicación',
    limite_maximo DECIMAL(13,2) DEFAULT NULL COMMENT 'Límite máximo',
    limite_minimo DECIMAL(13,2) DEFAULT NULL COMMENT 'Límite mínimo',
    estado VARCHAR(50) NOT NULL DEFAULT 'activa' COMMENT 'Estado',
    is_activa TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de bonificaciones. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_periodo_nomina (
    periodo_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de período de nómina',
    codigo_identificador VARCHAR(80) NOT NULL UNIQUE COMMENT 'Código identificador',
    fecha_inicio_at DATETIME NOT NULL COMMENT 'Fecha inicio del período',
    fecha_fin_at DATETIME NOT NULL COMMENT 'Fecha fin del período',
    tipo_nomina VARCHAR(50) DEFAULT 'regular' COMMENT 'Tipo de nómina: regular/extraordinaria',
    alcance VARCHAR(200) DEFAULT NULL COMMENT 'Alcance del período',
    estado VARCHAR(50) NOT NULL DEFAULT 'iniciado' COMMENT 'Estado: iniciado/en proceso/revisión/aprobado',
    fecha_creacion_at DATETIME NOT NULL COMMENT 'Fecha creación',
    usuario_creacion INT NOT NULL COMMENT 'Usuario que creó el período',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Períodos de nómina. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mom_deduccion_especial_tipo (
    deduccion_tipo_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Tipo de deducción especial (catálogo auxiliar)',
    codigo VARCHAR(50) DEFAULT NULL COMMENT 'Código',
    nombre VARCHAR(120) NOT NULL UNIQUE COMMENT 'Nombre tipo',
    descripcion TEXT DEFAULT NULL COMMENT 'Descripción',
    is_activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activo/inactivo',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Catálogo de tipos de deducción especial. Autor: Sebastian Jon (2025-08-09)';

/* ===========================================================
   3) TABLAS TRANSACCIONALES (mot_)
   =========================================================== */

CREATE TABLE IF NOT EXISTS mot_info_laboral (
    info_laboral_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de información laboral',
    trabajador_id INT NOT NULL COMMENT 'FK al trabajador',
    cargo VARCHAR(100) NOT NULL COMMENT 'Cargo',
    fecha_ingreso_at DATETIME NOT NULL COMMENT 'Fecha de ingreso',
    tipo_contrato VARCHAR(50) NOT NULL COMMENT 'Tipo de contrato',
    salario_base DECIMAL(13,2) NOT NULL COMMENT 'Salario base',
    fecha_ultima_actualizacion_at DATETIME NOT NULL COMMENT 'Fecha de última actualización',
    usuario_ultima_actualizacion INT NOT NULL COMMENT 'Usuario que actualizó',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_INFO_LABORAL_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Información laboral de trabajadores. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_asignacion_cuadrilla (
    asignacion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de asignación a cuadrilla',
    cuadrilla_id INT NOT NULL COMMENT 'FK a cuadrilla',
    trabajador_id INT NOT NULL COMMENT 'FK a trabajador',
    fecha_asignacion_at DATETIME NOT NULL COMMENT 'Fecha asignación',
    usuario_asignacion INT NOT NULL COMMENT 'Usuario que asignó',
    fecha_retiro_at DATETIME NULL COMMENT 'Fecha de retiro (NULL si aún asignado)',
    usuario_retiro INT NULL COMMENT 'Usuario que retiró',
    is_activa TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Asignación activa',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_ASIGNACION_CUADRILLA_RELATION_MOM_CUADRILLA FOREIGN KEY (cuadrilla_id) REFERENCES mom_cuadrilla(cuadrilla_id),
    CONSTRAINT FK_MOT_ASIGNACION_CUADRILLA_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Asignaciones de trabajadores a cuadrillas. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de usuario del sistema',
    trabajador_id INT NULL COMMENT 'FK al trabajador si aplica',
    username VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nombre de usuario',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hash de contraseña',
    rol_id INT NOT NULL COMMENT 'FK al rol',
    estado VARCHAR(50) NOT NULL DEFAULT 'activo' COMMENT 'Estado: activo/inactivo',
    fecha_ultimo_cambio_rol_at DATETIME NULL COMMENT 'Fecha del último cambio de rol',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_USUARIO_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id),
    CONSTRAINT FK_MOT_USUARIO_RELATION_MOM_ROL FOREIGN KEY (rol_id) REFERENCES mom_rol(rol_id)
) COMMENT='Usuarios del sistema. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_asistencia (
    asistencia_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de asistencia',
    trabajador_id INT NOT NULL COMMENT 'FK trabajador',
    fecha_at DATE NOT NULL COMMENT 'Fecha de la jornada laboral',
    hora_entrada_at DATETIME NOT NULL COMMENT 'Hora de entrada',
    ubicacion_entrada VARCHAR(150) DEFAULT NULL COMMENT 'Ubicación de entrada',
    hora_salida_at DATETIME NULL COMMENT 'Hora de salida',
    horas_trabajadas DECIMAL(5,2) DEFAULT NULL COMMENT 'Horas trabajadas',
    observaciones_salida TEXT DEFAULT NULL COMMENT 'Observaciones de salida',
    estado VARCHAR(30) NOT NULL DEFAULT 'completa' COMMENT 'Estado (completa/incompleta/ausente)',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_ASISTENCIA_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Registra asistencia de trabajadores. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_ausencia_justificada (
    ausencia_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de ausencia justificada',
    trabajador_id INT NOT NULL COMMENT 'FK trabajador',
    fecha_at DATE NOT NULL COMMENT 'Fecha de ausencia',
    motivo TEXT NOT NULL COMMENT 'Motivo',
    tipo_ausencia VARCHAR(80) DEFAULT NULL COMMENT 'Tipo de ausencia',
    documento_respaldo_path VARCHAR(250) DEFAULT NULL COMMENT 'Ruta documento de respaldo',
    estado_aprobacion VARCHAR(50) NOT NULL DEFAULT 'pendiente' COMMENT 'Estado de aprobación',
    usuario_registro INT NOT NULL COMMENT 'Usuario que registró',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_AUSENCIA_JUSTIFICADA_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Ausencias justificadas registradas por trabajador. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_asignacion_cultivo_parcela (
    asignacion_cultivo_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Asignación cultivo-parcela',
    parcela_id INT NOT NULL COMMENT 'FK parcela',
    cultivo_id INT NOT NULL COMMENT 'FK cultivo',
    fecha_inicio_at DATETIME NOT NULL COMMENT 'Fecha inicio',
    temporada VARCHAR(80) DEFAULT NULL COMMENT 'Temporada',
    caracteristicas_particulares TEXT DEFAULT NULL COMMENT 'Características',
    fecha_fin_at DATETIME NULL COMMENT 'Fecha fin (NULL activo)',
    usuario_asignacion INT NOT NULL COMMENT 'Usuario que asignó',
    is_activa TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Activa/inactiva',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_ASIGNACION_CULTIVO_PARCELA_RELATION_MOM_PARCELA FOREIGN KEY (parcela_id) REFERENCES mom_parcela(parcela_id),
    CONSTRAINT FK_MOT_ASIGNACION_CULTIVO_PARCELA_RELATION_MOM_CULTIVO FOREIGN KEY (cultivo_id) REFERENCES mom_cultivo(cultivo_id)
) COMMENT='Relaciona cultivos con parcelas. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_tarea_programada (
    tarea_programada_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Tarea programada para parcela',
    tarea_id INT NOT NULL COMMENT 'FK a tarea específica',
    parcela_id INT NOT NULL COMMENT 'FK a parcela',
    fecha_at DATETIME NOT NULL COMMENT 'Fecha programada',
    duracion_estimada DECIMAL(7,2) DEFAULT NULL COMMENT 'Duración estimada (horas)',
    prioridad INT DEFAULT NULL COMMENT 'Prioridad',
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' COMMENT 'Estado (pendiente/asignada/completada/cancelada)',
    bonificacion_asociada INT DEFAULT NULL COMMENT 'FK a bonificación (NULL si no tiene)',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_TAREA FOREIGN KEY (tarea_id) REFERENCES mom_tarea(tarea_id),
    CONSTRAINT FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_PARCELA FOREIGN KEY (parcela_id) REFERENCES mom_parcela(parcela_id),
    CONSTRAINT FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_BONIFICACION FOREIGN KEY (bonificacion_asociada) REFERENCES mom_bonificacion(bonificacion_id)
) COMMENT='Tareas programadas por parcela. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_asignacion_tarea (
    asignacion_tarea_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Asignación de tarea (a cuadrilla o individual)',
    tarea_programada_id INT NOT NULL COMMENT 'FK tarea programada',
    cuadrilla_id INT DEFAULT NULL COMMENT 'FK cuadrilla (NULL si individual)',
    trabajador_id INT DEFAULT NULL COMMENT 'FK trabajador (NULL si es a cuadrilla)',
    fecha_asignacion_at DATETIME NOT NULL COMMENT 'Fecha asignación',
    usuario_asignacion INT NOT NULL COMMENT 'Usuario que asignó',
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' COMMENT 'Estado (pendiente/en progreso/completada)',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_ASIGNACION_TAREA_RELATION_MOT_TAREA_PROGRAMADA FOREIGN KEY (tarea_programada_id) REFERENCES mot_tarea_programada(tarea_programada_id),
    CONSTRAINT FK_MOT_ASIGNACION_TAREA_RELATION_MOM_CUADRILLA FOREIGN KEY (cuadrilla_id) REFERENCES mom_cuadrilla(cuadrilla_id),
    CONSTRAINT FK_MOT_ASIGNACION_TAREA_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Asignaciones de tareas a cuadrillas o trabajadores. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_registro_productividad (
    productividad_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Registro de productividad por trabajador',
    trabajador_id INT NOT NULL COMMENT 'FK trabajador',
    tarea_id INT NOT NULL COMMENT 'FK tarea específica',
    cantidad_producida DECIMAL(13,4) DEFAULT NULL COMMENT 'Cantidad producida',
    unidad_medida VARCHAR(50) DEFAULT NULL COMMENT 'Unidad de medida',
    fecha_at DATETIME NOT NULL COMMENT 'Fecha del registro',
    rendimiento_calculado DECIMAL(13,4) DEFAULT NULL COMMENT 'Rendimiento calculado',
    condiciones_trabajo_id INT DEFAULT NULL COMMENT 'Referencia a condiciones (opcional)',
    condiciones_trabajo TEXT DEFAULT NULL COMMENT 'Descripción de condiciones',
    usuario_registro INT NOT NULL COMMENT 'Usuario que registró',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_REGISTRO_PRODUCTIVIDAD_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id),
    CONSTRAINT FK_MOT_REGISTRO_PRODUCTIVIDAD_RELATION_MOM_TAREA FOREIGN KEY (tarea_id) REFERENCES mom_tarea(tarea_id)
) COMMENT='Registros de productividad por trabajador. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_condiciones_trabajo (
    condicion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador condiciones de trabajo',
    fecha_at DATETIME NOT NULL COMMENT 'Fecha condición',
    condicion_general VARCHAR(150) DEFAULT NULL COMMENT 'Condición general',
    nivel_dificultad VARCHAR(80) DEFAULT NULL COMMENT 'Nivel de dificultad',
    observaciones TEXT DEFAULT NULL COMMENT 'Observaciones',
    usuario_registro INT NOT NULL COMMENT 'Usuario que registró',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL
) COMMENT='Condiciones de trabajo registradas. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_liquidacion (
    liquidacion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de liquidación',
    periodo_id INT NOT NULL COMMENT 'FK al período de nómina',
    trabajador_id INT NOT NULL COMMENT 'FK trabajador',
    total_bruto DECIMAL(13,2) DEFAULT 0.00 COMMENT 'Total bruto',
    total_deducciones DECIMAL(13,2) DEFAULT 0.00 COMMENT 'Total deducciones',
    total_neto DECIMAL(13,2) DEFAULT 0.00 COMMENT 'Total neto',
    estado VARCHAR(50) NOT NULL DEFAULT 'preliminar' COMMENT 'Estado (preliminar/aprobada/pagada)',
    fecha_generacion_at DATETIME NOT NULL COMMENT 'Fecha de generación',
    usuario_generacion INT NOT NULL COMMENT 'Usuario que generó',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_LIQUIDACION_RELATION_MOM_PERIODO_NOMINA FOREIGN KEY (periodo_id) REFERENCES mom_periodo_nomina(periodo_id),
    CONSTRAINT FK_MOT_LIQUIDACION_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Liquidaciones por trabajador y período. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_concepto_liquidacion (
    concepto_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador concepto en la liquidación',
    liquidacion_id INT NOT NULL COMMENT 'FK a liquidación',
    tipo VARCHAR(50) NOT NULL COMMENT 'Tipo (ganancia/deducción)',
    descripcion VARCHAR(250) DEFAULT NULL COMMENT 'Descripción del concepto',
    monto DECIMAL(13,2) NOT NULL COMMENT 'Monto del concepto',
    formula_aplicada TEXT DEFAULT NULL COMMENT 'Fórmula aplicada (si aplica)',
    referencia_id INT DEFAULT NULL COMMENT 'ID de la entidad origen (p.ej. productividad, asistencia)',
    referencia_tipo VARCHAR(100) DEFAULT NULL COMMENT 'Tipo de referencia (asistencia/productividad/bonificación/etc.)',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_CONCEPTO_LIQUIDACION_RELATION_MOT_LIQUIDACION FOREIGN KEY (liquidacion_id) REFERENCES mot_liquidacion(liquidacion_id)
) COMMENT='Conceptos que componen una liquidación. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_recibo (
    recibo_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de recibo',
    liquidacion_id INT NOT NULL UNIQUE COMMENT 'FK a liquidación (1:1)',
    codigo_identificador VARCHAR(120) NOT NULL UNIQUE COMMENT 'Código del recibo',
    fecha_generacion_at DATETIME NOT NULL COMMENT 'Fecha de generación',
    usuario_generacion INT NOT NULL COMMENT 'Usuario que generó',
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' COMMENT 'Estado (pendiente/entregado)',
    archivo_path VARCHAR(250) DEFAULT NULL COMMENT 'Ruta del archivo PDF',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_RECIBO_RELATION_MOT_LIQUIDACION FOREIGN KEY (liquidacion_id) REFERENCES mot_liquidacion(liquidacion_id)
) COMMENT='Recibos de liquidación (uno por liquidación). Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mot_deduccion_especial (
    deduccion_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador deducción especial',
    trabajador_id INT NOT NULL COMMENT 'FK trabajador',
    tipo_id INT DEFAULT NULL COMMENT 'FK tipo de deducción (catálogo)',
    tipo VARCHAR(100) DEFAULT NULL COMMENT 'Tipo (texto, redundante si se desea)',
    monto DECIMAL(13,2) NOT NULL COMMENT 'Monto',
    es_porcentual TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Indicador si es porcentual',
    base_calculo VARCHAR(120) DEFAULT NULL COMMENT 'Base de cálculo',
    periodicidad VARCHAR(80) DEFAULT NULL COMMENT 'Periodicidad',
    cuotas_totales INT DEFAULT NULL COMMENT 'Cuotas totales',
    cuotas_restantes INT DEFAULT NULL COMMENT 'Cuotas restantes',
    fecha_inicio_at DATETIME DEFAULT NULL COMMENT 'Fecha inicio',
    fecha_fin_at DATETIME DEFAULT NULL COMMENT 'Fecha fin',
    justificacion TEXT DEFAULT NULL COMMENT 'Justificación',
    documento_autorizacion_path VARCHAR(250) DEFAULT NULL COMMENT 'Ruta documento autorizacion',
    estado VARCHAR(50) NOT NULL DEFAULT 'activa' COMMENT 'Estado',
    -- Auditoría
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    created_by INT NOT NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    CONSTRAINT FK_MOT_DEDUCCION_ESPECIAL_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id),
    CONSTRAINT FK_MOT_DEDUCCION_ESPECIAL_RELATION_MOM_DEDUCCION_TIPO FOREIGN KEY (tipo_id) REFERENCES mom_deduccion_especial_tipo(deduccion_tipo_id)
) COMMENT='Deducciones especiales por trabajador. Autor: Sebastian Jon (2025-08-09)';


/* ===========================================================
   4) TABLAS RELACIONALES M:N (rel_<a>__<b>) con PK compuesta
   =========================================================== */

-- Relación Rol <> Permiso
CREATE TABLE IF NOT EXISTS rel_mom_rol__mom_permiso (
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    -- Auditoría mínima (requerida para relaciones/M:N)
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    updated_at DATETIME NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (rol_id, permiso_id),
    CONSTRAINT FK_REL_MOM_ROL__MOM_PERMISO_RELATION_MOM_ROL FOREIGN KEY (rol_id) REFERENCES mom_rol(rol_id),
    CONSTRAINT FK_REL_MOM_ROL__MOM_PERMISO_RELATION_MOM_PERMISO FOREIGN KEY (permiso_id) REFERENCES mom_permiso(permiso_id)
) COMMENT='Relación M:N entre roles y permisos. Autor: Sebastian Jon (2025-08-09)';

-- Relación Parcela <> Cultivo (ya existe mot_asignacion_cultivo_parcela como transaccional,
-- pero si quieres un M:N pura con PK compuesta, también puedes usar la tabla rel_:
CREATE TABLE IF NOT EXISTS rel_mom_parcela__mom_cultivo (
    parcela_id INT NOT NULL,
    cultivo_id INT NOT NULL,
    fecha_inicio_at DATETIME NOT NULL,
    fecha_fin_at DATETIME NULL,
    usuario_asignacion INT NOT NULL,
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    updated_at DATETIME NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (parcela_id, cultivo_id),
    CONSTRAINT FK_REL_MOM_PARCELA__MOM_CULTIVO_RELATION_MOM_PARCELA FOREIGN KEY (parcela_id) REFERENCES mom_parcela(parcela_id),
    CONSTRAINT FK_REL_MOM_PARCELA__MOM_CULTIVO_RELATION_MOM_CULTIVO FOREIGN KEY (cultivo_id) REFERENCES mom_cultivo(cultivo_id)
) COMMENT='Relación M:N entre parcelas y cultivos (alternativa). Autor: Sebastian Jon (2025-08-09)';

-- Relación Tarea <> Esquema Pago (Asignación Esquema-Tarea)
CREATE TABLE IF NOT EXISTS rel_mom_tarea__mom_esquema_pago (
    tarea_id INT NOT NULL,
    esquema_id INT NOT NULL,
    fecha_asignacion_at DATETIME NOT NULL,
    fecha_vigencia_inicio_at DATETIME DEFAULT NULL,
    usuario_asignacion INT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'activo',
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    updated_at DATETIME NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (tarea_id, esquema_id),
    CONSTRAINT FK_REL_MOM_TAREA__MOM_ESQUEMA_PAGO_RELATION_MOM_TAREA FOREIGN KEY (tarea_id) REFERENCES mom_tarea(tarea_id),
    CONSTRAINT FK_REL_MOM_TAREA__MOM_ESQUEMA_PAGO_RELATION_MOM_ESQUEMA_PAGO FOREIGN KEY (esquema_id) REFERENCES mom_esquema_pago(esquema_id)
) COMMENT='Relaciona tareas con esquemas de pago. Autor: Sebastian Jon (2025-08-09)';

-- Relación Cuadrilla <> Trabajador (alternativa M:N; mot_asignacion_cuadrilla también existe)
CREATE TABLE IF NOT EXISTS rel_mom_cuadrilla__mom_trabajador (
    cuadrilla_id INT NOT NULL,
    trabajador_id INT NOT NULL,
    fecha_asignacion_at DATETIME NOT NULL,
    fecha_retiro_at DATETIME NULL,
    usuario_asignacion INT NOT NULL,
    created_at DATETIME NOT NULL,
    created_by INT NOT NULL,
    updated_at DATETIME NULL,
    updated_by INT NULL,
    deleted_at DATETIME NULL,
    PRIMARY KEY (cuadrilla_id, trabajador_id),
    CONSTRAINT FK_REL_MOM_CUADRILLA__MOM_TRABAJADOR_RELATION_MOM_CUADRILLA FOREIGN KEY (cuadrilla_id) REFERENCES mom_cuadrilla(cuadrilla_id),
    CONSTRAINT FK_REL_MOM_CUADRILLA__MOM_TRABAJADOR_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Relación M:N cuadrillas-trabajadores (alternativa). Autor: Sebastian Jon (2025-08-09)';


/* ===========================================================
   5) TABLAS HISTÓRICAS / LOGS (moh_, mol_) si aplica
   (Se pueden llenar por triggers; dejo la estructura básica)
   =========================================================== */

CREATE TABLE IF NOT EXISTS moh_trabajador_historial (
    historial_id INT AUTO_INCREMENT PRIMARY KEY,
    trabajador_id INT NOT NULL,
    cambio_tipo VARCHAR(80) NOT NULL,
    datos_previos TEXT DEFAULT NULL,
    datos_nuevos TEXT DEFAULT NULL,
    usuario_accion INT DEFAULT NULL,
    fecha_accion_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT FK_MOH_TRABAJADOR_HISTORIAL_RELATION_MOM_TRABAJADOR FOREIGN KEY (trabajador_id) REFERENCES mom_trabajador(trabajador_id)
) COMMENT='Histórico de cambios sobre trabajador. Autor: Sebastian Jon (2025-08-09)';

CREATE TABLE IF NOT EXISTS mol_audit_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entidad VARCHAR(120) NOT NULL,
    entidad_id INT DEFAULT NULL,
    accion VARCHAR(50) NOT NULL,
    datos_antes TEXT DEFAULT NULL,
    datos_despues TEXT DEFAULT NULL,
    usuario_id INT DEFAULT NULL,
    fecha_at DATETIME NOT NULL,
    ip_origen VARCHAR(100) DEFAULT NULL
) COMMENT='Log general de auditoría. Autor: Sebastian Jon (2025-08-09)';


/* ===========================================================
   6) ÍNDICES ADICIONALES (CORREGIDOS)
   =========================================================== */

-- Índices para búsquedas frecuentes (SIN "IF NOT EXISTS")
CREATE INDEX idx_mom_trabajador_documento ON mom_trabajador(documento_identidad);
CREATE INDEX idx_mom_trabajador_nombre ON mom_trabajador(nombre_completo);
CREATE INDEX idx_mot_asistencia_trabajador_fecha ON mot_asistencia(trabajador_id, fecha_at);
CREATE INDEX idx_mot_registro_productividad_trabajador_fecha ON mot_registro_productividad(trabajador_id, fecha_at);

-- =====================================================
-- DATOS INICIALES PARA PIÑA
-- =====================================================

-- Insertar datos básicos para las 4 variedades de piña
INSERT INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, updated_at, created_by, updated_by) VALUES
('Piña Golden (MD2)', 'Variedad Golden Sweet MD2 - La más comercial', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1),
('Piña Cayena Lisa', 'Variedad Cayena Lisa tradicional', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1),
('Piña Perolera', 'Variedad Perolera nacional', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1),
('Piña Roja Española', 'Variedad Red Spanish tradicional', 'Unidades', 'Todo el año', 1, NOW(), NOW(), 1, 1);

-- Insertar parcelas para piña
INSERT INTO mom_parcela (nombre, ubicacion_descripcion, area_hectareas, tipo_terreno, descripcion, estado, is_activa, created_at, updated_at, created_by, updated_by) VALUES
('Lote A1', 'Sector norte de la finca piñera', 8.50, 'Plano', 'Área principal de cultivo de piña', 'disponible', 1, NOW(), NOW(), 1, 1),
('Lote B2', 'Sector sur con pendiente suave', 6.20, 'Inclinado', 'Zona de expansión piñera', 'disponible', 1, NOW(), NOW(), 1, 1),
('Lote C3', 'Cerca del sistema de riego', 7.80, 'Húmedo', 'Área con mejor acceso a agua', 'disponible', 1, NOW(), NOW(), 1, 1),
('Lote D4', 'Sector experimental', 3.10, 'Mixto', 'Área para pruebas de variedades', 'disponible', 1, NOW(), NOW(), 1, 1);

-- Insertar cuadrillas especializadas en piña
INSERT INTO mom_cuadrilla (codigo_identificador, nombre, descripcion, area_trabajo, fecha_creacion_at, is_activa, created_at, updated_at, created_by, updated_by) VALUES
('PINA01', 'Cuadrilla Siembra Piña', 'Equipo especializado en siembra de piña', 'Lotes A1, B2', NOW(), 1, NOW(), NOW(), 1, 1),
('PINA02', 'Cuadrilla Mantenimiento', 'Equipo de mantenimiento y cuidado', 'Todos los lotes', NOW(), 1, NOW(), NOW(), 1, 1),
('PINA03', 'Cuadrilla Cosecha', 'Equipo especializado en cosecha', 'Lotes C3, D4', NOW(), 1, NOW(), NOW(), 1, 1);

-- Insertar tareas específicas de piña
INSERT INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, instrucciones, niveles_dificultad, is_activo, created_at, updated_at, created_by, updated_by) VALUES
(1, 'Siembra de coronas', 'Plantación de coronas de piña MD2', 'Plantas/día', 300.0000, 'Plantar coronas a 30cm de distancia', 'Medio', 1, NOW(), NOW(), 1, 1),
(1, 'Fertilización', 'Aplicación de fertilizantes específicos', 'Plantas/día', 500.0000, 'Aplicar fertilizante granulado alrededor de la planta', 'Fácil', 1, NOW(), NOW(), 1, 1),
(1, 'Deshierbe manual', 'Control manual de malezas', 'Metros²/día', 400.0000, 'Remover malezas sin dañar raíces', 'Fácil', 1, NOW(), NOW(), 1, 1),
(1, 'Aplicación de reguladores', 'Aplicación de hormonas para inducir floración', 'Plantas/día', 800.0000, 'Aplicar carburo de calcio en el cogollo', 'Difícil', 1, NOW(), NOW(), 1, 1),
(1, 'Embolse de frutos', 'Protección de frutos con bolsas', 'Frutos/día', 100.0000, 'Colocar bolsa protectora en cada fruto', 'Medio', 1, NOW(), NOW(), 1, 1),
(1, 'Cosecha de piña', 'Recolección de frutos maduros', 'Unidades/día', 200.0000, 'Cortar frutos en punto óptimo de madurez', 'Medio', 1, NOW(), NOW(), 1, 1);

-- Crear usuario administrador básico
INSERT INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, updated_at, created_by, updated_by) VALUES
('ADMIN', 'Administrador', 'Rol de administrador del sistema', NOW(), 1, 1, NOW(), NOW(), 1, 1),
('SUPER', 'Supervisor', 'Rol de supervisor de campo', NOW(), 0, 1, NOW(), NOW(), 1, 1),
('OPER', 'Operario', 'Rol de operario de campo', NOW(), 0, 1, NOW(), NOW(), 1, 1);

-- Insertar trabajador inicial
INSERT INTO mom_trabajador (documento_identidad, nombre_completo, fecha_nacimiento, telefono, email, is_activo, fecha_registro_at, created_at, updated_at, created_by, updated_by) VALUES
('12345678', 'Administrador Sistema', '1990-01-01', '555-0000', 'admin@piñafinca.com', 1, NOW(), NOW(), NOW(), 1, 1);

-- Crear usuario del sistema
INSERT INTO mot_usuario (trabajador_id, username, password_hash, rol_id, estado, created_at, updated_at, created_by, updated_by) VALUES
(1, 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewfBNXoUhDxbh7H6', 1, 'activo', NOW(), NOW(), 1, 1);

-- Crear usuario para aplicación
CREATE USER IF NOT EXISTS 'app_pina'@'%' IDENTIFIED BY 'PinaApp2024!';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_agricola_sebastian.* TO 'app_pina'@'%';
FLUSH PRIVILEGES;

-- Mostrar resumen
SELECT 
    'SCRIPT SEBASTIAN CORREGIDO - BASE DE DATOS LISTA' as mensaje,
    COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_schema = 'gestion_agricola_sebastian';

SELECT '✅ Script de Sebastian ejecutado exitosamente' as resultado;
SELECT '🍍 Configurado específicamente para cultivo de piña' as especializacion;
SELECT '🔧 Todas las correcciones de sintaxis aplicadas' as correccion;
