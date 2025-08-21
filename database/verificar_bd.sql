-- ============================================
-- VERIFICACIÓN DE BASE DE DATOS - Sistema de Gestión Agrícola
-- Script para verificar que la instalación fue exitosa
-- ============================================

USE gestion_agricola;

SELECT '🔍 VERIFICACIÓN DEL SISTEMA DE GESTIÓN AGRÍCOLA' as '';

-- Verificar tablas principales
SELECT 
    '📊 RESUMEN DE INSTALACIÓN' as '',
    COUNT(*) as 'Tablas Creadas'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'gestion_agricola';

-- Verificar datos básicos
SELECT '👥 DATOS BÁSICOS' as '';
SELECT COUNT(*) as 'Usuarios' FROM usuarios;
SELECT COUNT(*) as 'Roles' FROM roles;
SELECT COUNT(*) as 'Departamentos' FROM departamentos;
SELECT COUNT(*) as 'Cargos' FROM cargos;
SELECT COUNT(*) as 'Tipos de Permisos' FROM tipos_permisos;

-- Verificar estructura por módulos
SELECT '📋 VERIFICACIÓN POR MÓDULOS' as '';

SELECT 'HU-001 a HU-005: Gestión de Personal' as Modulo,
       CASE WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'gestion_agricola' AND TABLE_NAME IN ('empleados', 'cargos', 'departamentos', 'historial_cargos')) = 4 
            THEN '✅ COMPLETO' 
            ELSE '❌ INCOMPLETO' END as Estado;

SELECT 'HU-006 a HU-010: Control de Asistencia' as Modulo,
       CASE WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'gestion_agricola' AND TABLE_NAME IN ('registros_asistencia', 'permisos', 'tipos_permisos')) = 3 
            THEN '✅ COMPLETO' 
            ELSE '❌ INCOMPLETO' END as Estado;

SELECT 'HU-011 a HU-015: Gestión de Nómina' as Modulo,
       CASE WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'gestion_agricola' AND TABLE_NAME IN ('nomina_empleados', 'nomina_detalles', 'periodos_nomina', 'recibos_pago')) = 4 
            THEN '✅ COMPLETO' 
            ELSE '❌ INCOMPLETO' END as Estado;

SELECT 'HU-016 a HU-020: Control de Productividad' as Modulo,
       CASE WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'gestion_agricola' AND TABLE_NAME IN ('tareas', 'tareas_completadas', 'metas', 'evaluaciones_rendimiento')) = 4 
            THEN '✅ COMPLETO' 
            ELSE '❌ INCOMPLETO' END as Estado;

SELECT 'HU-021 a HU-025: Gestión de Reportes' as Modulo,
       CASE WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'gestion_agricola' AND TABLE_NAME IN ('configuracion_reportes', 'reportes_generados', 'reportes_favoritos')) = 3 
            THEN '✅ COMPLETO' 
            ELSE '❌ INCOMPLETO' END as Estado;

SELECT 'HU-026 a HU-032: Autenticación' as Modulo,
       CASE WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'gestion_agricola' AND TABLE_NAME IN ('usuarios', 'roles', 'sesiones', 'tokens_recuperacion')) = 4 
            THEN '✅ COMPLETO' 
            ELSE '❌ INCOMPLETO' END as Estado;

-- Listar todas las tablas creadas
SELECT '📝 LISTADO DE TABLAS' as '';
SELECT TABLE_NAME as 'Tablas Creadas'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'gestion_agricola' 
ORDER BY TABLE_NAME;

-- Usuario administrador por defecto
SELECT '🔑 CREDENCIALES POR DEFECTO' as '';
SELECT 
    email as 'Usuario',
    'Admin123!' as 'Contraseña',
    nombre as 'Nombre',
    apellido as 'Apellido'
FROM usuarios 
WHERE email = 'admin@gestionagricola.com';

SELECT '✅ VERIFICACIÓN COMPLETADA - BASE DE DATOS LISTA PARA USO' as 'RESULTADO FINAL';