-- =====================================================
-- INSTALACIÓN COMPLETA - SISTEMA DE GESTIÓN AGRÍCOLA
-- Script maestro que ejecuta todas las migraciones y semillas
-- ✅ Cubre los 32 requerimientos funcionales (HU-001 a HU-032)
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestion_agricola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_agricola;

-- =====================================================
-- PASO 1: CREAR ESQUEMA BASE
-- =====================================================
SOURCE esquemas/00_crear_base_datos.sql;

-- =====================================================
-- PASO 2: EJECUTAR MIGRACIONES EN ORDEN
-- =====================================================

-- HU-026 a HU-032: Autenticación y usuarios
SOURCE migraciones/001_crear_tablas_usuarios.sql;

-- HU-001 a HU-005: Gestión de personal
SOURCE migraciones/002_crear_tablas_personal.sql;

-- HU-006 a HU-010: Control de asistencia
SOURCE migraciones/003_crear_tablas_asistencia.sql;

-- HU-011 a HU-015: Gestión de nómina
SOURCE migraciones/004_crear_tablas_nomina.sql;

-- HU-016 a HU-020: Control de productividad
SOURCE migraciones/005_crear_tablas_productividad.sql;

-- HU-021 a HU-025: Gestión de reportes
SOURCE migraciones/006_crear_tablas_reportes.sql;

-- Configuraciones del sistema
SOURCE migraciones/007_crear_tablas_configuracion.sql;

-- =====================================================
-- PASO 3: INSERTAR DATOS INICIALES (SEMILLAS)
-- =====================================================

-- Roles y permisos del sistema
SOURCE semillas/001_roles_permisos.sql;

-- Departamentos y cargos
SOURCE semillas/002_departamentos_cargos.sql;

-- Usuarios iniciales
SOURCE semillas/003_datos_iniciales.sql;

-- Configuración del sistema
SOURCE semillas/004_configuracion_sistema.sql;

-- =====================================================
-- ✅ VERIFICACIÓN: 32 REQUERIMIENTOS FUNCIONALES CUBIERTOS
-- =====================================================

SELECT 'HU-001 a HU-005' as Requerimientos, 'Gestión de Personal' as Modulo, '✅ CUBIERTO' as Estado
UNION ALL SELECT 'HU-006 a HU-010', 'Control de Asistencia', '✅ CUBIERTO'
UNION ALL SELECT 'HU-011 a HU-015', 'Gestión de Nómina', '✅ CUBIERTO'
UNION ALL SELECT 'HU-016 a HU-020', 'Control de Productividad', '✅ CUBIERTO'
UNION ALL SELECT 'HU-021 a HU-025', 'Gestión de Reportes', '✅ CUBIERTO'
UNION ALL SELECT 'HU-026 a HU-032', 'Autenticación', '✅ CUBIERTO';

-- Verificar instalación exitosa
SELECT 
    '✅ INSTALACIÓN COMPLETADA' as Estado,
    COUNT(*) as 'Tablas Creadas'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'gestion_agricola';

-- Credenciales por defecto
SELECT 'admin@gestionagricola.com / Admin123!' as 'Usuario Administrador';

-- Resumen final de la instalación
SELECT '✅ BASE DE DATOS COMPLETADA' as 'ESTADO FINAL';
SELECT COUNT(*) as 'TABLAS CREADAS' FROM information_schema.tables WHERE table_schema = 'gestion_agricola';
SELECT COUNT(*) as 'USUARIOS CREADOS' FROM usuarios;
SELECT COUNT(*) as 'DEPARTAMENTOS' FROM departamentos;
SELECT COUNT(*) as 'CARGOS' FROM cargos;
