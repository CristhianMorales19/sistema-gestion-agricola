-- Script para configurar RBAC en Auth0
-- Estos roles y permisos los configurarás en el dashboard de Auth0

/*
ROLES A CREAR EN AUTH0:
========================
*/

-- 1. ADMIN_AGROMANO
--    Descripción: Administrador del sistema con acceso completo
--    Permisos: Todos los permisos del sistema

-- 2. SUPERVISOR_AGROMANO  
--    Descripción: Supervisor de campo con permisos de gestión
--    Permisos: Gestión de trabajadores, asistencia y reportes

-- 3. OPERARIO_AGROMANO
--    Descripción: Operario de campo con permisos limitados
--    Permisos: Solo registro de asistencia y consulta básica

/*
PERMISOS (SCOPES) A CREAR EN AUTH0:
==================================
*/

-- TRABAJADORES
-- trabajadores:create - Crear nuevos trabajadores
-- trabajadores:read   - Ver lista de trabajadores  
-- trabajadores:update - Actualizar información de trabajadores
-- trabajadores:delete - Eliminar/desactivar trabajadores

-- ASISTENCIA
-- asistencia:register - Registrar asistencia diaria
-- asistencia:read     - Ver registros de asistencia
-- asistencia:update   - Modificar registros de asistencia
-- asistencia:reports  - Generar reportes de asistencia

-- NÓMINA
-- nomina:process    - Procesar nómina mensual
-- nomina:read       - Ver liquidaciones de nómina
-- nomina:approve    - Aprobar liquidaciones
-- nomina:reports    - Generar reportes de nómina

-- PRODUCTIVIDAD
-- productividad:register - Registrar productividad diaria
-- productividad:read     - Ver registros de productividad
-- productividad:reports  - Generar reportes de productividad

-- CULTIVOS Y PARCELAS
-- parcelas:manage   - Gestionar parcelas y cultivos
-- parcelas:read     - Ver información de parcelas
-- tareas:assign     - Asignar tareas a trabajadores/cuadrillas
-- tareas:read       - Ver tareas asignadas

-- ADMINISTRACIÓN
-- admin:access      - Acceso a funciones administrativas
-- usuarios:manage   - Gestionar usuarios del sistema
-- roles:manage      - Gestionar roles y permisos
-- reportes:all      - Acceso a todos los reportes

-- CUADRILLAS
-- cuadrillas:manage - Gestionar cuadrillas
-- cuadrillas:assign - Asignar trabajadores a cuadrillas

/*
ASIGNACIÓN DE PERMISOS POR ROL:
==============================
*/

-- ADMIN_AGROMANO (Todos los permisos)
-- ✓ trabajadores:* (create, read, update, delete)
-- ✓ asistencia:* (register, read, update, reports)
-- ✓ nomina:* (process, read, approve, reports)
-- ✓ productividad:* (register, read, reports)
-- ✓ parcelas:* (manage, read)
-- ✓ tareas:* (assign, read)
-- ✓ admin:access
-- ✓ usuarios:manage
-- ✓ roles:manage
-- ✓ reportes:all
-- ✓ cuadrillas:* (manage, assign)

-- SUPERVISOR_AGROMANO (Permisos de gestión)
-- ✓ trabajadores:read
-- ✓ trabajadores:update
-- ✓ asistencia:* (register, read, update, reports)
-- ✓ nomina:read
-- ✓ nomina:reports
-- ✓ productividad:* (register, read, reports)
-- ✓ parcelas:read
-- ✓ tareas:* (assign, read)
-- ✓ cuadrillas:manage
-- ✓ cuadrillas:assign

-- OPERARIO_AGROMANO (Permisos básicos)
-- ✓ trabajadores:read (solo su información)
-- ✓ asistencia:register (solo su asistencia)
-- ✓ asistencia:read (solo su asistencia)
-- ✓ productividad:register (solo su productividad)
-- ✓ productividad:read (solo su productividad)
-- ✓ tareas:read (solo sus tareas asignadas)
