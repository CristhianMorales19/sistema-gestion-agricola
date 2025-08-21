# 🗄️ INSTALACIÓN COMPLETA DE BASE DE DATOS

## 📋 Script Único - Todo en Uno

El archivo `INSTALACION_COMPLETA.sql` contiene **TODO** el código SQL necesario para crear la base de datos completa del Sistema de Gestión Agrícola.

## 🚀 Cómo usar en otro equipo

### Opción 1: Instalación Directa (Más Simple)

```bash
# 1. Descargar o copiar el archivo INSTALACION_COMPLETA.sql
# 2. Abrir terminal en la carpeta donde está el archivo
# 3. Ejecutar (te pedirá la contraseña de MySQL root):

mysql -u root -p < INSTALACION_COMPLETA.sql
```

### Opción 2: Con MySQL Workbench o phpMyAdmin

1. Abrir MySQL Workbench o phpMyAdmin
2. Crear nueva consulta SQL
3. Copiar y pegar todo el contenido de `INSTALACION_COMPLETA.sql`
4. Ejecutar el script completo

## ✅ Lo que hace el script:

### 🗃️ Base de Datos
- ✅ Elimina BD existente (si existe)
- ✅ Crea BD `gestion_agricola` con charset UTF8MB4
- ✅ Crea **33 tablas** con todas sus relaciones
- ✅ Crea todos los índices necesarios

### 📊 Estructura Completa
- ✅ **4 tablas** de usuarios y autenticación  
- ✅ **4 tablas** de gestión de personal
- ✅ **6 tablas** de control de asistencia
- ✅ **6 tablas** de gestión de nómina
- ✅ **7 tablas** de control de productividad
- ✅ **4 tablas** de sistema de reportes
- ✅ **4 tablas** de configuración del sistema

### 🎯 Datos Iniciales
- ✅ **5 roles** del sistema (Super_Admin, Admin, Supervisor, etc.)
- ✅ **6 departamentos** organizacionales
- ✅ **20 cargos** diferentes por departamento
- ✅ **1 usuario administrador** listo para usar
- ✅ **7 tipos de permisos** laborales
- ✅ **3 horarios** de trabajo predefinidos
- ✅ **6 categorías** de tareas
- ✅ **12 tareas** básicas del sistema
- ✅ **8 conceptos** de nómina (ingresos/deducciones)
- ✅ **10 configuraciones** del sistema
- ✅ **5 reportes** predefinidos

### 👤 Usuarios Creados
- ✅ **Usuario Web:** admin@gestionagricola.com / Admin123!
- ✅ **Usuario MySQL:** app_agricola / App123!Segura

## 🔧 Configuración del Backend

Después de ejecutar el script, configura tu backend con:

```env
# Archivo .env del backend
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_agricola
DB_PASSWORD=App123!Segura
DB_NAME=gestion_agricola

# Usuario administrador web
ADMIN_EMAIL=admin@gestionagricola.com
ADMIN_PASSWORD=Admin123!
```

## ⚡ Ventajas del Script Único

1. **📦 Todo en uno:** No necesitas múltiples archivos
2. **🚀 Ejecución simple:** Un solo comando
3. **🔄 Repetible:** Puedes ejecutarlo cuantas veces quieras
4. **💼 Portátil:** Funciona en cualquier equipo con MySQL
5. **🛡️ Completo:** Incluye datos iniciales listos para usar

## 🎯 Resultado Final

Después de ejecutar el script tendrás:

```
Base de Datos: gestion_agricola
├── 33 tablas creadas ✅
├── Todas las relaciones configuradas ✅
├── Índices optimizados ✅
├── Datos iniciales insertados ✅
├── Usuarios configurados ✅
└── Sistema listo para desarrollo ✅
```

## ⚠️ Importante

- El script **ELIMINA** la base de datos existente si ya existe
- **Cambia las contraseñas** en producción
- Haz **backup** antes de ejecutar en datos importantes
- El script es **idempotente** (puedes ejecutarlo múltiples veces)

## 🆘 Solución de Problemas

### Error de permisos:
```bash
sudo mysql -u root -p < INSTALACION_COMPLETA.sql
```

### Error de conexión:
```bash
# Verificar que MySQL esté funcionando
sudo service mysql start
# o
sudo systemctl start mysql
```

### Error de usuario root:
```bash
# Si no tienes contraseña root, usa:
sudo mysql < INSTALACION_COMPLETA.sql
```

## 🎉 ¡Listo!

Con este script único puedes recrear la base de datos completa en cualquier equipo con MySQL en menos de 1 minuto.

**¡Todo el trabajo de creación de 33 tablas, relaciones, índices y datos iniciales en un solo archivo!**
