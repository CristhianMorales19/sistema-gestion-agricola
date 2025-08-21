-- =====================================================
-- INSTALACIÓN PARA NUEVO EQUIPO
-- Sistema de Gestión Agrícola - Base de Datos Completa
-- =====================================================
-- INSTRUCCIONES:
-- 1. Asegúrate de tener MySQL 8.0+ instalado
-- 2. Ejecuta este archivo desde la carpeta /database/
-- 3. Comando: mysql -u root -p < INSTALAR_NUEVO_EQUIPO.sql
-- =====================================================

-- Eliminar base de datos existente si existe (CUIDADO: Borra todo)
DROP DATABASE IF EXISTS gestion_agricola;

-- Crear la base de datos
CREATE DATABASE gestion_agricola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_agricola;

-- =====================================================
-- PASO 1: CREAR TODAS LAS TABLAS
-- =====================================================

-- Tablas de autenticación y usuarios
SOURCE migraciones/001_crear_tablas_usuarios.sql;

-- Tablas de personal y estructura organizacional  
SOURCE migraciones/002_crear_tablas_personal.sql;

-- Tablas de control de asistencia
SOURCE migraciones/003_crear_tablas_asistencia.sql;

-- Tablas de nómina y pagos
SOURCE migraciones/004_crear_tablas_nomina.sql;

-- Tablas de productividad y tareas
SOURCE migraciones/005_crear_tablas_productividad.sql;

-- Tablas de reportes y análisis
SOURCE migraciones/006_crear_tablas_reportes.sql;

-- Tablas de configuración del sistema
SOURCE migraciones/007_crear_tablas_configuracion.sql;

-- =====================================================
-- PASO 2: INSERTAR DATOS INICIALES
-- =====================================================

-- Roles y permisos del sistema
SOURCE semillas/001_roles_permisos.sql;

-- Departamentos y cargos organizacionales
SOURCE semillas/002_departamentos_cargos.sql;

-- Usuario administrador y datos básicos
SOURCE semillas/003_datos_iniciales.sql;

-- Configuración del sistema
SOURCE semillas/004_configuracion_sistema.sql;

-- =====================================================
-- PASO 3: CREAR USUARIO PARA LA APLICACIÓN
-- =====================================================

-- Usuario específico para la aplicación (recomendado para producción)
CREATE USER IF NOT EXISTS 'app_agricola'@'localhost' IDENTIFIED BY 'App123!Segura';
CREATE USER IF NOT EXISTS 'app_agricola'@'%' IDENTIFIED BY 'App123!Segura';

-- Otorgar permisos completos sobre la base de datos
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_agricola.* TO 'app_agricola'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_agricola.* TO 'app_agricola'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Mostrar resumen de instalación
SELECT '✅ INSTALACIÓN COMPLETADA EXITOSAMENTE' as ESTADO;

SELECT 
    'Tablas creadas' as Componente,
    COUNT(*) as Total
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'gestion_agricola';

SELECT 'Roles instalados' as Componente, COUNT(*) as Total FROM roles;
SELECT 'Departamentos creados' as Componente, COUNT(*) as Total FROM departamentos;
SELECT 'Cargos definidos' as Componente, COUNT(*) as Total FROM cargos;
SELECT 'Usuarios administradores' as Componente, COUNT(*) as Total FROM usuarios;

-- Mostrar credenciales de acceso
SELECT '=== CREDENCIALES DE ACCESO ===' as INFO;
SELECT 
    'admin@gestionagricola.com' as 'Usuario Web',
    'Admin123!' as 'Contraseña Web',
    'app_agricola' as 'Usuario BD',
    'App123!Segura' as 'Contraseña BD',
    'gestion_agricola' as 'Base de Datos';

SELECT '🎉 ¡Base de datos lista para usar!' as RESULTADO;

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Cambia las contraseñas en producción
-- 2. Configura el archivo .env del backend con estos datos:
--    DB_HOST=localhost
--    DB_USER=app_agricola  
--    DB_PASSWORD=App123!Segura
--    DB_NAME=gestion_agricola
-- 3. Usuario web: admin@gestionagricola.com / Admin123!
-- =====================================================
