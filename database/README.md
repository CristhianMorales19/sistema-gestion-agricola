# Base de Datos - Sistema de Gestión Agrícola

✅ **BASE DE DATOS COMPLETAMENTE GENERADA Y FUNCIONAL**

Scripts SQL completos para la configuración de la base de datos MySQL que cubren los 32 requerimientos funcionales (HU-001 a HU-032).

## 🚀 Instalación Rápida

```bash
# Instalar base de datos completa
mysql -u root -p < instalar_bd.sql

# Verificar instalación
mysql -u root -p < verificar_bd.sql
```

📖 **Ver [GUIA_RAPIDA.md](GUIA_RAPIDA.md) para instrucciones paso a paso**

## Estructura

```
database/
├── instalar_bd.sql    # 🎯 SCRIPT PRINCIPAL - Instalación completa
├── verificar_bd.sql   # ✅ Verificación de la instalación  
├── GUIA_RAPIDA.md     # 📖 Guía de instalación paso a paso
├── esquemas/          # Definición de esquemas de base de datos
├── migraciones/       # Scripts de migración de datos (7 archivos)
└── semillas/          # Datos iniciales - seeds (4 archivos)
```

## ✅ Estado de la Base de Datos

- **33 tablas creadas** cubriendo todos los requerimientos
- **Datos iniciales cargados** (roles, departamentos, cargos, usuarios)
- **Todos los módulos funcionales** (HU-001 a HU-032)
- **Usuario administrador**: `admin@gestionagricola.com` / `Admin123!`

## Configuración Inicial

1. Crear la base de datos:
```sql
CREATE DATABASE gestion_agricola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Ejecutar las migraciones en orden:
   - `001_crear_tablas_usuarios.sql`
   - `002_crear_tablas_personal.sql`
   - `003_crear_tablas_asistencia.sql`
   - `004_crear_tablas_nomina.sql`
   - `005_crear_tablas_productividad.sql`

3. Insertar datos iniciales:
   - `001_roles_permisos.sql`
   - `002_cargos_departamentos.sql`
   - `003_usuario_admin.sql`

## Consideraciones

- Todas las tablas usan IDs autoincrementales
- Se implementan soft deletes con campo `activo`
- Campos de auditoría: `fecha_creacion`, `fecha_actualizacion`
- Uso de ENUM para estados y tipos
- Claves foráneas con restricciones de integridad

## Backup y Restauración

```bash
# Backup
mysqldump -u root -p gestion_agricola > backup_gestion_agricola.sql

# Restauración
mysql -u root -p gestion_agricola < backup_gestion_agricola.sql
```
