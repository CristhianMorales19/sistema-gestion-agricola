-- CreateTable
CREATE TABLE `moh_trabajador_historial` (
    `historial_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajador_id` INTEGER NOT NULL,
    `cambio_tipo` VARCHAR(80) NOT NULL,
    `datos_previos` TEXT NULL,
    `datos_nuevos` TEXT NULL,
    `usuario_accion` INTEGER NULL,
    `fecha_accion_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    INDEX `FK_MOH_TRABAJADOR_HISTORIAL_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`historial_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mol_audit_log` (
    `log_id` BIGINT NOT NULL AUTO_INCREMENT,
    `entidad` VARCHAR(120) NOT NULL,
    `entidad_id` INTEGER NULL,
    `accion` VARCHAR(50) NOT NULL,
    `datos_antes` TEXT NULL,
    `datos_despues` TEXT NULL,
    `usuario_id` INTEGER NULL,
    `fecha_at` DATETIME(0) NOT NULL,
    `ip_origen` VARCHAR(100) NULL,

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_bonificacion` (
    `bonificacion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `descripcion` TEXT NULL,
    `tipo` VARCHAR(50) NULL,
    `monto_fijo` DECIMAL(13, 2) NULL,
    `porcentaje` DECIMAL(7, 4) NULL,
    `base_calculo` VARCHAR(120) NULL,
    `condiciones_aplicacion` TEXT NULL,
    `limite_maximo` DECIMAL(13, 2) NULL,
    `limite_minimo` DECIMAL(13, 2) NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'activa',
    `is_activa` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`bonificacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_cuadrilla` (
    `cuadrilla_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_identificador` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `descripcion` TEXT NULL,
    `area_trabajo` VARCHAR(150) NULL,
    `fecha_creacion_at` DATETIME(0) NOT NULL,
    `is_activa` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `codigo_identificador`(`codigo_identificador`),
    PRIMARY KEY (`cuadrilla_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_cultivo` (
    `cultivo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `descripcion` TEXT NULL,
    `unidad_medida_principal` VARCHAR(40) NULL,
    `temporada_tipica` VARCHAR(80) NULL,
    `imagen_path` VARCHAR(250) NULL,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`cultivo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_deduccion_especial_tipo` (
    `deduccion_tipo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `descripcion` TEXT NULL,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`deduccion_tipo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_esquema_pago` (
    `esquema_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `descripcion` TEXT NULL,
    `fecha_creacion_at` DATETIME(0) NOT NULL,
    `fecha_vigencia_inicio_at` DATETIME(0) NULL,
    `fecha_vigencia_fin_at` DATETIME(0) NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'activo',
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`esquema_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_formula_pago` (
    `formula_id` INTEGER NOT NULL AUTO_INCREMENT,
    `esquema_id` INTEGER NOT NULL,
    `formula` TEXT NOT NULL,
    `variables_utilizadas` TEXT NULL,
    `ejemplo_calculo` TEXT NULL,
    `fecha_creacion_at` DATETIME(0) NOT NULL,
    `usuario_creacion` INTEGER NOT NULL,
    `is_activa` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOM_FORMULA_PAGO_RELATION_MOM_ESQUEMA_PAGO`(`esquema_id`),
    PRIMARY KEY (`formula_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_parcela` (
    `parcela_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `ubicacion_descripcion` VARCHAR(250) NULL,
    `area_hectareas` DECIMAL(10, 2) NULL,
    `tipo_terreno` VARCHAR(80) NULL,
    `descripcion` TEXT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'disponible',
    `is_activa` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`parcela_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_periodo_nomina` (
    `periodo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_identificador` VARCHAR(80) NOT NULL,
    `fecha_inicio_at` DATETIME(0) NOT NULL,
    `fecha_fin_at` DATETIME(0) NOT NULL,
    `tipo_nomina` VARCHAR(50) NULL DEFAULT 'regular',
    `alcance` VARCHAR(200) NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'iniciado',
    `fecha_creacion_at` DATETIME(0) NOT NULL,
    `usuario_creacion` INTEGER NOT NULL,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `codigo_identificador`(`codigo_identificador`),
    PRIMARY KEY (`periodo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_permiso` (
    `permiso_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `categoria` VARCHAR(100) NULL,
    `descripcion` TEXT NULL,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`permiso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_rol` (
    `rol_id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `fecha_creacion_at` DATETIME(0) NOT NULL,
    `is_critico` BOOLEAN NOT NULL DEFAULT false,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `codigo`(`codigo`),
    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`rol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_tarea` (
    `tarea_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cultivo_id` INTEGER NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `unidad_medicion` VARCHAR(50) NULL,
    `rendimiento_estandar` DECIMAL(10, 4) NULL,
    `instrucciones` TEXT NULL,
    `niveles_dificultad` VARCHAR(100) NULL,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOM_TAREA_RELATION_MOM_CULTIVO`(`cultivo_id`),
    PRIMARY KEY (`tarea_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mom_trabajador` (
    `trabajador_id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento_identidad` VARCHAR(50) NOT NULL,
    `nombre_completo` VARCHAR(150) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `is_activo` BOOLEAN NOT NULL DEFAULT true,
    `fecha_registro_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `documento_identidad`(`documento_identidad`),
    INDEX `idx_mom_trabajador_documento`(`documento_identidad`),
    INDEX `idx_mom_trabajador_nombre`(`nombre_completo`),
    PRIMARY KEY (`trabajador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_asignacion_cuadrilla` (
    `asignacion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuadrilla_id` INTEGER NOT NULL,
    `trabajador_id` INTEGER NOT NULL,
    `fecha_asignacion_at` DATETIME(0) NOT NULL,
    `usuario_asignacion` INTEGER NOT NULL,
    `fecha_retiro_at` DATETIME(0) NULL,
    `usuario_retiro` INTEGER NULL,
    `is_activa` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_ASIGNACION_CUADRILLA_RELATION_MOM_CUADRILLA`(`cuadrilla_id`),
    INDEX `FK_MOT_ASIGNACION_CUADRILLA_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`asignacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_asignacion_cultivo_parcela` (
    `asignacion_cultivo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcela_id` INTEGER NOT NULL,
    `cultivo_id` INTEGER NOT NULL,
    `fecha_inicio_at` DATETIME(0) NOT NULL,
    `temporada` VARCHAR(80) NULL,
    `caracteristicas_particulares` TEXT NULL,
    `fecha_fin_at` DATETIME(0) NULL,
    `usuario_asignacion` INTEGER NOT NULL,
    `is_activa` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_ASIGNACION_CULTIVO_PARCELA_RELATION_MOM_CULTIVO`(`cultivo_id`),
    INDEX `FK_MOT_ASIGNACION_CULTIVO_PARCELA_RELATION_MOM_PARCELA`(`parcela_id`),
    PRIMARY KEY (`asignacion_cultivo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_asignacion_tarea` (
    `asignacion_tarea_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_programada_id` INTEGER NOT NULL,
    `cuadrilla_id` INTEGER NULL,
    `trabajador_id` INTEGER NULL,
    `fecha_asignacion_at` DATETIME(0) NOT NULL,
    `usuario_asignacion` INTEGER NOT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_ASIGNACION_TAREA_RELATION_MOM_CUADRILLA`(`cuadrilla_id`),
    INDEX `FK_MOT_ASIGNACION_TAREA_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    INDEX `FK_MOT_ASIGNACION_TAREA_RELATION_MOT_TAREA_PROGRAMADA`(`tarea_programada_id`),
    PRIMARY KEY (`asignacion_tarea_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_asistencia` (
    `asistencia_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajador_id` INTEGER NOT NULL,
    `fecha_at` DATE NOT NULL,
    `hora_entrada_at` DATETIME(0) NOT NULL,
    `ubicacion_entrada` VARCHAR(150) NULL,
    `hora_salida_at` DATETIME(0) NULL,
    `horas_trabajadas` DECIMAL(5, 2) NULL,
    `observaciones_salida` TEXT NULL,
    `estado` VARCHAR(30) NOT NULL DEFAULT 'completa',
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `idx_mot_asistencia_trabajador_fecha`(`trabajador_id`, `fecha_at`),
    PRIMARY KEY (`asistencia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_ausencia_justificada` (
    `ausencia_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajador_id` INTEGER NOT NULL,
    `fecha_at` DATE NOT NULL,
    `motivo` TEXT NOT NULL,
    `tipo_ausencia` VARCHAR(80) NULL,
    `documento_respaldo_path` VARCHAR(250) NULL,
    `estado_aprobacion` VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    `usuario_registro` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_AUSENCIA_JUSTIFICADA_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`ausencia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_concepto_liquidacion` (
    `concepto_id` INTEGER NOT NULL AUTO_INCREMENT,
    `liquidacion_id` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(250) NULL,
    `monto` DECIMAL(13, 2) NOT NULL,
    `formula_aplicada` TEXT NULL,
    `referencia_id` INTEGER NULL,
    `referencia_tipo` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_CONCEPTO_LIQUIDACION_RELATION_MOT_LIQUIDACION`(`liquidacion_id`),
    PRIMARY KEY (`concepto_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_condiciones_trabajo` (
    `condicion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_at` DATETIME(0) NOT NULL,
    `condicion_general` VARCHAR(150) NULL,
    `nivel_dificultad` VARCHAR(80) NULL,
    `observaciones` TEXT NULL,
    `usuario_registro` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`condicion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_deduccion_especial` (
    `deduccion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajador_id` INTEGER NOT NULL,
    `tipo_id` INTEGER NULL,
    `tipo` VARCHAR(100) NULL,
    `monto` DECIMAL(13, 2) NOT NULL,
    `es_porcentual` BOOLEAN NOT NULL DEFAULT false,
    `base_calculo` VARCHAR(120) NULL,
    `periodicidad` VARCHAR(80) NULL,
    `cuotas_totales` INTEGER NULL,
    `cuotas_restantes` INTEGER NULL,
    `fecha_inicio_at` DATETIME(0) NULL,
    `fecha_fin_at` DATETIME(0) NULL,
    `justificacion` TEXT NULL,
    `documento_autorizacion_path` VARCHAR(250) NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'activa',
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_DEDUCCION_ESPECIAL_RELATION_MOM_DEDUCCION_TIPO`(`tipo_id`),
    INDEX `FK_MOT_DEDUCCION_ESPECIAL_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`deduccion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_info_laboral` (
    `info_laboral_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajador_id` INTEGER NOT NULL,
    `cargo` VARCHAR(100) NOT NULL,
    `fecha_ingreso_at` DATETIME(0) NOT NULL,
    `tipo_contrato` VARCHAR(50) NOT NULL,
    `codigo_nomina` VARCHAR(50) NULL,
    `salario_bruto` DECIMAL(13, 2) NULL,
    `rebajas_ccss` DECIMAL(13, 2) NULL,
    `otras_rebajas` DECIMAL(13, 2) NULL,
    `salario_por_hora` DECIMAL(13, 2) NULL,
    `horas_ordinarias` DECIMAL(7, 2) NULL,
    `horas_extras` DECIMAL(7, 2) NULL,
    `horas_otras` DECIMAL(7, 2) NULL,
    `vacaciones_monto` DECIMAL(13, 2) NULL,
    `incapacidad_monto` DECIMAL(13, 2) NULL,
    `lactancia_monto` DECIMAL(13, 2) NULL,
    `salario_promedio` DECIMAL(13, 2) NULL,
    `meses_trabajados` INTEGER NULL,
    `area` VARCHAR(120) NULL,
    `salario_base` DECIMAL(13, 2) NOT NULL,
    `fecha_ultima_actualizacion_at` DATETIME(0) NOT NULL,
    `usuario_ultima_actualizacion` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_INFO_LABORAL_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`info_laboral_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_liquidacion` (
    `liquidacion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `periodo_id` INTEGER NOT NULL,
    `trabajador_id` INTEGER NOT NULL,
    `total_bruto` DECIMAL(13, 2) NULL DEFAULT 0.00,
    `total_deducciones` DECIMAL(13, 2) NULL DEFAULT 0.00,
    `total_neto` DECIMAL(13, 2) NULL DEFAULT 0.00,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'preliminar',
    `fecha_generacion_at` DATETIME(0) NOT NULL,
    `usuario_generacion` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_LIQUIDACION_RELATION_MOM_PERIODO_NOMINA`(`periodo_id`),
    INDEX `FK_MOT_LIQUIDACION_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`liquidacion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_recibo` (
    `recibo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `liquidacion_id` INTEGER NOT NULL,
    `codigo_identificador` VARCHAR(120) NOT NULL,
    `fecha_generacion_at` DATETIME(0) NOT NULL,
    `usuario_generacion` INTEGER NOT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    `archivo_path` VARCHAR(250) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `liquidacion_id`(`liquidacion_id`),
    UNIQUE INDEX `codigo_identificador`(`codigo_identificador`),
    PRIMARY KEY (`recibo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_registro_productividad` (
    `productividad_id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajador_id` INTEGER NOT NULL,
    `tarea_id` INTEGER NOT NULL,
    `cantidad_producida` DECIMAL(13, 4) NULL,
    `unidad_medida` VARCHAR(50) NULL,
    `fecha_at` DATETIME(0) NOT NULL,
    `rendimiento_calculado` DECIMAL(13, 4) NULL,
    `condiciones_trabajo_id` INTEGER NULL,
    `condiciones_trabajo` TEXT NULL,
    `usuario_registro` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_REGISTRO_PRODUCTIVIDAD_RELATION_MOM_TAREA`(`tarea_id`),
    INDEX `idx_mot_registro_productividad_trabajador_fecha`(`trabajador_id`, `fecha_at`),
    PRIMARY KEY (`productividad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_tarea_programada` (
    `tarea_programada_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `parcela_id` INTEGER NOT NULL,
    `fecha_at` DATETIME(0) NOT NULL,
    `duracion_estimada` DECIMAL(7, 2) NULL,
    `prioridad` INTEGER NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    `bonificacion_asociada` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_BONIFICACION`(`bonificacion_asociada`),
    INDEX `FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_PARCELA`(`parcela_id`),
    INDEX `FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_TAREA`(`tarea_id`),
    PRIMARY KEY (`tarea_programada_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mot_usuario` (
    `usuario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `auth0_user_id` VARCHAR(191) NULL,
    `auth0_id` VARCHAR(255) NULL,
    `trabajador_id` INTEGER NULL,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NULL,
    `password_hash` VARCHAR(255) NULL,
    `rol_id` INTEGER NOT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'activo',
    `auth_provider` VARCHAR(50) NULL DEFAULT 'local',
    `email_verified` BOOLEAN NULL DEFAULT false,
    `last_login_at` DATETIME(0) NULL,
    `fecha_ultimo_cambio_rol_at` DATETIME(0) NULL,
    `auth0_enabled` BOOLEAN NULL DEFAULT true,
    `local_auth_enabled` BOOLEAN NULL DEFAULT true,
    `last_auth_method` VARCHAR(20) NULL,
    `failed_login_attempts` INTEGER NULL DEFAULT 0,
    `account_locked_until` DATETIME(0) NULL,
    `password_changed_at` DATETIME(0) NULL,
    `password_expires_at` DATETIME(0) NULL,
    `require_password_change` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    UNIQUE INDEX `mot_usuario_auth0_user_id_key`(`auth0_user_id`),
    UNIQUE INDEX `mot_usuario_auth0_id_key`(`auth0_id`),
    UNIQUE INDEX `username`(`username`),
    INDEX `FK_MOT_USUARIO_RELATION_MOM_ROL`(`rol_id`),
    INDEX `FK_MOT_USUARIO_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    INDEX `idx_mot_usuario_email`(`email`),
    INDEX `idx_mot_usuario_auth_method`(`last_auth_method`),
    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rel_mom_cuadrilla__mom_trabajador` (
    `cuadrilla_id` INTEGER NOT NULL,
    `trabajador_id` INTEGER NOT NULL,
    `fecha_asignacion_at` DATETIME(0) NOT NULL,
    `fecha_retiro_at` DATETIME(0) NULL,
    `usuario_asignacion` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_REL_MOM_CUADRILLA__MOM_TRABAJADOR_RELATION_MOM_TRABAJADOR`(`trabajador_id`),
    PRIMARY KEY (`cuadrilla_id`, `trabajador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rel_mom_parcela__mom_cultivo` (
    `parcela_id` INTEGER NOT NULL,
    `cultivo_id` INTEGER NOT NULL,
    `fecha_inicio_at` DATETIME(0) NOT NULL,
    `fecha_fin_at` DATETIME(0) NULL,
    `usuario_asignacion` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_REL_MOM_PARCELA__MOM_CULTIVO_RELATION_MOM_CULTIVO`(`cultivo_id`),
    PRIMARY KEY (`parcela_id`, `cultivo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rel_mom_rol__mom_permiso` (
    `rol_id` INTEGER NOT NULL,
    `permiso_id` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_REL_MOM_ROL__MOM_PERMISO_RELATION_MOM_PERMISO`(`permiso_id`),
    PRIMARY KEY (`rol_id`, `permiso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rel_mom_tarea__mom_esquema_pago` (
    `tarea_id` INTEGER NOT NULL,
    `esquema_id` INTEGER NOT NULL,
    `fecha_asignacion_at` DATETIME(0) NOT NULL,
    `fecha_vigencia_inicio_at` DATETIME(0) NULL,
    `usuario_asignacion` INTEGER NOT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'activo',
    `created_at` DATETIME(0) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_at` DATETIME(0) NULL,
    `updated_by` INTEGER NULL,
    `deleted_at` DATETIME(0) NULL,

    INDEX `FK_REL_MOM_TAREA__MOM_ESQUEMA_PAGO_RELATION_MOM_ESQUEMA_PAGO`(`esquema_id`),
    PRIMARY KEY (`tarea_id`, `esquema_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `moh_trabajador_historial` ADD CONSTRAINT `FK_MOH_TRABAJADOR_HISTORIAL_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mom_formula_pago` ADD CONSTRAINT `FK_MOM_FORMULA_PAGO_RELATION_MOM_ESQUEMA_PAGO` FOREIGN KEY (`esquema_id`) REFERENCES `mom_esquema_pago`(`esquema_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mom_tarea` ADD CONSTRAINT `FK_MOM_TAREA_RELATION_MOM_CULTIVO` FOREIGN KEY (`cultivo_id`) REFERENCES `mom_cultivo`(`cultivo_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_cuadrilla` ADD CONSTRAINT `FK_MOT_ASIGNACION_CUADRILLA_RELATION_MOM_CUADRILLA` FOREIGN KEY (`cuadrilla_id`) REFERENCES `mom_cuadrilla`(`cuadrilla_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_cuadrilla` ADD CONSTRAINT `FK_MOT_ASIGNACION_CUADRILLA_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_cultivo_parcela` ADD CONSTRAINT `FK_MOT_ASIGNACION_CULTIVO_PARCELA_RELATION_MOM_CULTIVO` FOREIGN KEY (`cultivo_id`) REFERENCES `mom_cultivo`(`cultivo_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_cultivo_parcela` ADD CONSTRAINT `FK_MOT_ASIGNACION_CULTIVO_PARCELA_RELATION_MOM_PARCELA` FOREIGN KEY (`parcela_id`) REFERENCES `mom_parcela`(`parcela_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_tarea` ADD CONSTRAINT `FK_MOT_ASIGNACION_TAREA_RELATION_MOM_CUADRILLA` FOREIGN KEY (`cuadrilla_id`) REFERENCES `mom_cuadrilla`(`cuadrilla_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_tarea` ADD CONSTRAINT `FK_MOT_ASIGNACION_TAREA_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asignacion_tarea` ADD CONSTRAINT `FK_MOT_ASIGNACION_TAREA_RELATION_MOT_TAREA_PROGRAMADA` FOREIGN KEY (`tarea_programada_id`) REFERENCES `mot_tarea_programada`(`tarea_programada_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_asistencia` ADD CONSTRAINT `FK_MOT_ASISTENCIA_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_ausencia_justificada` ADD CONSTRAINT `FK_MOT_AUSENCIA_JUSTIFICADA_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_concepto_liquidacion` ADD CONSTRAINT `FK_MOT_CONCEPTO_LIQUIDACION_RELATION_MOT_LIQUIDACION` FOREIGN KEY (`liquidacion_id`) REFERENCES `mot_liquidacion`(`liquidacion_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_deduccion_especial` ADD CONSTRAINT `FK_MOT_DEDUCCION_ESPECIAL_RELATION_MOM_DEDUCCION_TIPO` FOREIGN KEY (`tipo_id`) REFERENCES `mom_deduccion_especial_tipo`(`deduccion_tipo_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_deduccion_especial` ADD CONSTRAINT `FK_MOT_DEDUCCION_ESPECIAL_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_info_laboral` ADD CONSTRAINT `FK_MOT_INFO_LABORAL_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_liquidacion` ADD CONSTRAINT `FK_MOT_LIQUIDACION_RELATION_MOM_PERIODO_NOMINA` FOREIGN KEY (`periodo_id`) REFERENCES `mom_periodo_nomina`(`periodo_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_liquidacion` ADD CONSTRAINT `FK_MOT_LIQUIDACION_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_recibo` ADD CONSTRAINT `FK_MOT_RECIBO_RELATION_MOT_LIQUIDACION` FOREIGN KEY (`liquidacion_id`) REFERENCES `mot_liquidacion`(`liquidacion_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_registro_productividad` ADD CONSTRAINT `FK_MOT_REGISTRO_PRODUCTIVIDAD_RELATION_MOM_TAREA` FOREIGN KEY (`tarea_id`) REFERENCES `mom_tarea`(`tarea_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_registro_productividad` ADD CONSTRAINT `FK_MOT_REGISTRO_PRODUCTIVIDAD_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_tarea_programada` ADD CONSTRAINT `FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_BONIFICACION` FOREIGN KEY (`bonificacion_asociada`) REFERENCES `mom_bonificacion`(`bonificacion_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_tarea_programada` ADD CONSTRAINT `FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_PARCELA` FOREIGN KEY (`parcela_id`) REFERENCES `mom_parcela`(`parcela_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_tarea_programada` ADD CONSTRAINT `FK_MOT_TAREA_PROGRAMADA_RELATION_MOM_TAREA` FOREIGN KEY (`tarea_id`) REFERENCES `mom_tarea`(`tarea_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_usuario` ADD CONSTRAINT `FK_MOT_USUARIO_RELATION_MOM_ROL` FOREIGN KEY (`rol_id`) REFERENCES `mom_rol`(`rol_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mot_usuario` ADD CONSTRAINT `FK_MOT_USUARIO_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_cuadrilla__mom_trabajador` ADD CONSTRAINT `FK_REL_MOM_CUADRILLA__MOM_TRABAJADOR_RELATION_MOM_CUADRILLA` FOREIGN KEY (`cuadrilla_id`) REFERENCES `mom_cuadrilla`(`cuadrilla_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_cuadrilla__mom_trabajador` ADD CONSTRAINT `FK_REL_MOM_CUADRILLA__MOM_TRABAJADOR_RELATION_MOM_TRABAJADOR` FOREIGN KEY (`trabajador_id`) REFERENCES `mom_trabajador`(`trabajador_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_parcela__mom_cultivo` ADD CONSTRAINT `FK_REL_MOM_PARCELA__MOM_CULTIVO_RELATION_MOM_CULTIVO` FOREIGN KEY (`cultivo_id`) REFERENCES `mom_cultivo`(`cultivo_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_parcela__mom_cultivo` ADD CONSTRAINT `FK_REL_MOM_PARCELA__MOM_CULTIVO_RELATION_MOM_PARCELA` FOREIGN KEY (`parcela_id`) REFERENCES `mom_parcela`(`parcela_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_rol__mom_permiso` ADD CONSTRAINT `FK_REL_MOM_ROL__MOM_PERMISO_RELATION_MOM_PERMISO` FOREIGN KEY (`permiso_id`) REFERENCES `mom_permiso`(`permiso_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_rol__mom_permiso` ADD CONSTRAINT `FK_REL_MOM_ROL__MOM_PERMISO_RELATION_MOM_ROL` FOREIGN KEY (`rol_id`) REFERENCES `mom_rol`(`rol_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_tarea__mom_esquema_pago` ADD CONSTRAINT `FK_REL_MOM_TAREA__MOM_ESQUEMA_PAGO_RELATION_MOM_ESQUEMA_PAGO` FOREIGN KEY (`esquema_id`) REFERENCES `mom_esquema_pago`(`esquema_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rel_mom_tarea__mom_esquema_pago` ADD CONSTRAINT `FK_REL_MOM_TAREA__MOM_ESQUEMA_PAGO_RELATION_MOM_TAREA` FOREIGN KEY (`tarea_id`) REFERENCES `mom_tarea`(`tarea_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
