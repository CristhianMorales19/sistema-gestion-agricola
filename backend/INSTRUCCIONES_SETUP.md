# 🚀 INSTRUCCIONES PARA CONFIGURAR LA BASE DE DATOS AGROMANO

## 📋 PASOS PARA EJECUTAR EL SETUP COMPLETO

### 1. **Ejecutar el Script Principal**
```bash
# En MySQL Workbench o phpMyAdmin, ejecutar:
```

### 2. **Script SQL a ejecutar:**

```sql
-- ================================================================
-- CONFIGURACIÓN COMPLETA PARA SISTEMA AGROMANO
-- ================================================================

USE AgroMano;

-- 1. CREAR ROLES
INSERT IGNORE INTO mom_rol (codigo, nombre, descripcion, fecha_creacion_at, is_critico, is_activo, created_at, created_by) VALUES
('ADMIN_AGROMANO', 'Administrador del Sistema', 'Administrador con acceso completo', NOW(), true, true, NOW(), 1),
('SUPERVISOR_CAMPO', 'Supervisor de Campo', 'Supervisor de operaciones de campo', NOW(), false, true, NOW(), 1),
('GERENTE_RRHH', 'Gerente de RRHH', 'Gerente con permisos de RRHH y nómina', NOW(), false, true, NOW(), 1),
('SUPERVISOR_RRHH', 'Supervisor de RRHH', 'Supervisor con permisos limitados', NOW(), false, true, NOW(), 1);

-- 2. CREAR PERMISOS GRANULARES
INSERT IGNORE INTO mom_permiso (codigo, nombre, categoria, descripcion, is_activo, created_at, created_by) VALUES
-- Personal
('trabajadores:read:all', 'Ver todos trabajadores', 'Personal', 'Ver información de todos los trabajadores', 1, NOW(), 1),
('trabajadores:create', 'Crear trabajadores', 'Personal', 'Registrar nuevos trabajadores', 1, NOW(), 1),
('trabajadores:update:all', 'Actualizar trabajadores', 'Personal', 'Editar cualquier trabajador', 1, NOW(), 1),
('trabajadores:delete', 'Eliminar trabajadores', 'Personal', 'Eliminar trabajadores', 1, NOW(), 1),
('trabajadores:export', 'Exportar trabajadores', 'Personal', 'Exportar datos de trabajadores', 1, NOW(), 1),
-- Asistencia
('asistencia:read:all', 'Ver toda asistencia', 'Asistencia', 'Ver registros de todos', 1, NOW(), 1),
('asistencia:update', 'Actualizar asistencia', 'Asistencia', 'Modificar registros', 1, NOW(), 1),
('asistencia:approve', 'Aprobar asistencia', 'Asistencia', 'Aprobar registros', 1, NOW(), 1),
('asistencia:reports', 'Reportes asistencia', 'Asistencia', 'Generar reportes', 1, NOW(), 1),
-- Nómina
('nomina:process', 'Procesar nómina', 'Nomina', 'Procesar nóminas', 1, NOW(), 1),
('nomina:read:all', 'Ver nóminas', 'Nomina', 'Ver nóminas de todos', 1, NOW(), 1),
('nomina:approve', 'Aprobar nóminas', 'Nomina', 'Aprobar nóminas', 1, NOW(), 1),
('nomina:reports', 'Reportes nómina', 'Nomina', 'Generar reportes', 1, NOW(), 1),
-- Productividad
('productividad:read:all', 'Ver productividad', 'Productividad', 'Ver productividad de todos', 1, NOW(), 1),
('productividad:reports', 'Reportes productividad', 'Productividad', 'Generar reportes', 1, NOW(), 1),
-- Tareas
('tareas:create', 'Crear tareas', 'Tareas', 'Crear nuevas tareas', 1, NOW(), 1),
('tareas:assign', 'Asignar tareas', 'Tareas', 'Asignar tareas', 1, NOW(), 1),
-- Reportes
('reportes:read:advanced', 'Reportes avanzados', 'Reportes', 'Ver reportes avanzados', 1, NOW(), 1),
('dashboard:view:advanced', 'Dashboard avanzado', 'Dashboard', 'Ver dashboard avanzado', 1, NOW(), 1);

-- 3. OBTENER IDs DE ROLES
SET @admin_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'ADMIN_AGROMANO');
SET @supervisor_campo_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_CAMPO');
SET @gerente_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'GERENTE_RRHH');
SET @supervisor_rrhh_id = (SELECT rol_id FROM mom_rol WHERE codigo = 'SUPERVISOR_RRHH');

-- 4. ASIGNAR PERMISOS A ROLES
-- ADMIN: Todos los permisos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @admin_id, permiso_id, NOW(), 1 FROM mom_permiso WHERE is_activo = 1;

-- SUPERVISOR CAMPO: Permisos específicos
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_campo_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all', 'asistencia:approve', 'productividad:read:all', 'tareas:create', 'tareas:assign', 'reportes:read:advanced');

-- GERENTE RRHH: Permisos de RRHH
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @gerente_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:create', 'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:delete', 
                 'asistencia:read:all', 'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:reports', 'reportes:read:advanced');

-- SUPERVISOR RRHH: Permisos limitados
INSERT IGNORE INTO rel_mom_rol__mom_permiso (rol_id, permiso_id, created_at, created_by)
SELECT @supervisor_rrhh_id, permiso_id, NOW(), 1 FROM mom_permiso 
WHERE codigo IN ('trabajadores:read:all', 'asistencia:read:all');

-- 5. CREAR USUARIOS ADMINISTRATIVOS
INSERT IGNORE INTO mot_usuario (username, password_hash, rol_id, estado, created_at, created_by) VALUES
('admin@agromano.com', '$2b$10$dummy.hash.for.auth0', @admin_id, 'activo', NOW(), 1),
('supervisor.campo@agromano.com', '$2b$10$dummy.hash.for.auth0', @supervisor_campo_id, 'activo', NOW(), 1),
('gerente.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @gerente_rrhh_id, 'activo', NOW(), 1),
('supervisor.rrhh@agromano.com', '$2b$10$dummy.hash.for.auth0', @supervisor_rrhh_id, 'activo', NOW(), 1);

-- 6. DATOS INICIALES PARA PIÑA
INSERT IGNORE INTO mom_cultivo (nombre, descripcion, unidad_medida_principal, temporada_tipica, is_activo, created_at, created_by) VALUES
('Piña', 'Cultivo principal de piña', 'unidades', 'Todo el año', true, NOW(), 1);

SET @cultivo_pina_id = (SELECT cultivo_id FROM mom_cultivo WHERE nombre = 'Piña');

INSERT IGNORE INTO mom_tarea (cultivo_id, nombre, descripcion, unidad_medicion, rendimiento_estandar, is_activo, created_at, created_by) VALUES
(@cultivo_pina_id, 'Siembra de Corona', 'Plantación de coronas', 'unidades/hora', 25.0, true, NOW(), 1),
(@cultivo_pina_id, 'Cosecha de Piña', 'Recolección de piñas maduras', 'unidades/hora', 15.0, true, NOW(), 1),
(@cultivo_pina_id, 'Clasificación y Empaque', 'Clasificar y empacar', 'unidades/hora', 20.0, true, NOW(), 1);

-- 7. VERIFICACIÓN
SELECT 'USUARIOS CREADOS:' as info;
SELECT u.username, r.nombre as rol, COUNT(rp.permiso_id) as permisos
FROM mot_usuario u
JOIN mom_rol r ON u.rol_id = r.rol_id
LEFT JOIN rel_mom_rol__mom_permiso rp ON r.rol_id = rp.rol_id
WHERE u.username LIKE '%@agromano.com%'
GROUP BY u.usuario_id, u.username, r.nombre;
```

### 3. **Después de ejecutar el script:**

✅ **Usuarios creados en la BD:**
- admin@agromano.com
- supervisor.campo@agromano.com  
- gerente.rrhh@agromano.com
- supervisor.rrhh@agromano.com

### 4. **Siguiente paso - Configurar Auth0:**

1. **Crear usuarios en Auth0** con los mismos emails
2. **Probar autenticación** usando el middleware híbrido
3. **Validar permisos** desde la BD local

### 5. **Probar el sistema:**

```bash
# Ir al backend
cd backend

# Instalar dependencias
npm install

# Verificar que la BD esté corriendo
# Probar conexión con Prisma
npx prisma db pull

# Ejecutar el servidor
npm run dev
```

## 🔧 **Configuración de Auth0:**

1. **Crear Application** en Auth0 Dashboard
2. **Configurar URLs:**
   - Allowed Callback URLs: `http://localhost:3000/callback`
   - Allowed Logout URLs: `http://localhost:3000`
3. **Crear usuarios** con los emails de arriba
4. **Configurar variables de entorno** en `.env`

## 📝 **Variables de entorno necesarias:**

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/AgroMano"
AUTH0_DOMAIN="tu-dominio.auth0.com"
AUTH0_CLIENT_ID="tu-client-id"
AUTH0_CLIENT_SECRET="tu-client-secret"
AUTH0_AUDIENCE="https://tu-api-identifier"
```

¿Estás listo para ejecutar este script y configurar Auth0?
