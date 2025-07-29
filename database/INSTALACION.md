# Instalación de Base de Datos - Sistema de Gestión Agrícola

Este documento describe la instalación completa de la base de datos MySQL que soporta **los 32 requerimientos funcionales** del sistema.

## ✅ COBERTURA COMPLETA DE LOS 32 REQUERIMIENTOS FUNCIONALES

### HU-001 a HU-005: Gestión de Personal ✅
- **HU-001**: Registro empleado → `empleados`, `historial_laboral`
- **HU-002**: Edición empleado → `empleados` (campos actualizables)  
- **HU-003**: Consulta empleados → `empleados` + `cargos` + `departamentos`
- **HU-004**: Eliminación empleado → `empleados.activo` (soft delete)
- **HU-005**: Gestión cargos → `cargos`, `departamentos`

### HU-006 a HU-010: Control de Asistencia ✅
- **HU-006**: Registro entrada → `registros_asistencia.hora_entrada`
- **HU-007**: Registro salida → `registros_asistencia.hora_salida`
- **HU-008**: Consulta diaria → `registros_asistencia` por fecha
- **HU-009**: Reporte mensual → `registros_asistencia` agregado por mes
- **HU-010**: Gestión permisos → `permisos`, `tipos_permiso`

### HU-011 a HU-015: Gestión de Nómina ✅
- **HU-011**: Configurar salario → `configuracion_salarios`
- **HU-012**: Cálculo horas extras → `nominas.horas_extras`
- **HU-013**: Aplicar deducciones → `deducciones`, `nomina_deducciones`
- **HU-014**: Generar recibo → `recibos_pago`
- **HU-015**: Reporte nómina → `nominas` agregado por período

### HU-016 a HU-020: Control de Productividad ✅
- **HU-016**: Registro tarea → `tareas_completadas`
- **HU-017**: Definir metas → `metas`
- **HU-018**: Seguimiento productividad → `indicadores_productividad`
- **HU-019**: Evaluación rendimiento → `evaluaciones_rendimiento`
- **HU-020**: Reporte productividad → `tareas_completadas` + `metas`

### HU-021 a HU-025: Gestión de Reportes ✅
- **HU-021**: Reporte empleados → `empleados.activo = 1`
- **HU-022**: Reporte asistencia → `registros_asistencia` por período
- **HU-023**: Reporte financiero → `nominas` + `deducciones` por mes
- **HU-024**: Reporte productividad → `tareas_completadas` + `metas`
- **HU-025**: Exportar reportes → `reportes_generados.formato_exportacion`

### HU-026 a HU-032: Autenticación ✅
- **HU-026**: Login usuario → `usuarios.email/password` + `sesiones`
- **HU-027**: Logout usuario → `sesiones.fecha_fin`
- **HU-028**: Registrar usuario → `INSERT usuarios`
- **HU-029**: Gestión perfil → `usuarios` (campos editables)
- **HU-030**: Control acceso → `roles` + `permisos` + `usuarios_roles`
- **HU-031**: Recuperar contraseña → `tokens_recuperacion`
- **HU-032**: Cambiar contraseña → `usuarios.password` + hash

## 📋 Prerrequisitos

- MySQL 8.0 o superior
- Cliente MySQL (MySQL Workbench, phpMyAdmin, o línea de comandos)
- Permisos de administrador en MySQL

# 🗄️ INSTALACIÓN DE BASE DE DATOS - MySQL

## Paso a Paso para Instalar la Base de Datos

### 1. Verificar MySQL
Asegúrate de tener MySQL instalado y funcionando:

```bash
# Verificar estado del servicio MySQL
net start | findstr MySQL

# Si no está iniciado, iniciar el servicio
net start MySQL80  # o el nombre de tu servicio MySQL
```

### 2. Conectar a MySQL
```bash
mysql -u root -p
```

### 3. Opción A: Instalación Automática (Recomendada)
Ejecutar el script principal desde MySQL:

```sql
-- Dentro de MySQL
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/instalar_bd.sql;
```

### 4. Opción B: Instalación Manual
Si prefieres ejecutar paso a paso:

#### 4.1 Crear base de datos:
```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestion_agricola 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE gestion_agricola;
```

#### 4.2 Ejecutar migraciones en orden:
```sql
-- 1. Tablas de usuarios
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/migraciones/001_crear_tablas_usuarios.sql;

-- 2. Tablas de personal  
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/migraciones/002_crear_tablas_personal.sql;

-- 3. Tablas de asistencia
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/migraciones/003_crear_tablas_asistencia.sql;

-- 4. Tablas de nómina
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/migraciones/004_crear_tablas_nomina.sql;

-- 5. Tablas de productividad
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/migraciones/005_crear_tablas_productividad.sql;
```

#### 4.3 Insertar datos iniciales:
```sql
-- 1. Roles y permisos
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/semillas/001_roles_permisos.sql;

-- 2. Departamentos y cargos
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/semillas/002_departamentos_cargos.sql;

-- 3. Datos iniciales
SOURCE C:/Users/Cristhian/Desktop/ProyectoIngenieria/database/semillas/003_datos_iniciales.sql;
```

### 5. Verificar Instalación
```sql
-- Verificar que se crearon las tablas
SHOW TABLES;

-- Verificar datos iniciales
SELECT * FROM roles;
SELECT * FROM departamentos;
SELECT * FROM cargos LIMIT 5;
SELECT email, nombre, apellido FROM usuarios;
```

### 6. Crear Usuario para la Aplicación
```sql
-- Crear usuario específico para la aplicación
CREATE USER 'app_agricola'@'localhost' IDENTIFIED BY 'tu_password_seguro';

-- Otorgar permisos
GRANT SELECT, INSERT, UPDATE, DELETE ON gestion_agricola.* TO 'app_agricola'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;
```

## 📊 Estructura Final

Después de la instalación tendrás:

### Tablas Principales:
- ✅ `usuarios` - Sistema de autenticación
- ✅ `roles` - Roles y permisos
- ✅ `empleados` - Información del personal
- ✅ `departamentos` y `cargos` - Estructura organizacional
- ✅ `registros_asistencia` - Control de asistencia
- ✅ `nomina_empleados` - Gestión de nómina
- ✅ `tareas_completadas` - Productividad
- ✅ `metas` - Objetivos del personal

### Datos Iniciales:
- ✅ 5 roles básicos del sistema
- ✅ 6 departamentos organizacionales
- ✅ 18 cargos diferentes
- ✅ Usuario administrador: `admin@gestionagricola.com`
- ✅ Tipos de permisos laborales
- ✅ Horarios de trabajo
- ✅ Conceptos de nómina
- ✅ Categorías y tareas básicas

### Credenciales Iniciales:
- **Email:** admin@gestionagricola.com
- **Contraseña:** Admin123!
- **Rol:** Super_Admin

## ⚠️ Importante

1. **Cambiar contraseña:** La contraseña del admin debe cambiarse en el primer acceso
2. **Backup:** Hacer backup antes de cualquier modificación
3. **Seguridad:** Configurar firewall y accesos seguros
4. **Variables de entorno:** Actualizar el archivo `.env` del backend

## 🔧 Configuración del Backend

Después de instalar la BD, configurar el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_agricola  # o root
DB_PASSWORD=tu_password_seguro
DB_NAME=gestion_agricola
```
