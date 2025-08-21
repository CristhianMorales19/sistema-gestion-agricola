# 🗄️ GUÍA RÁPIDA DE INSTALACIÓN - Base de Datos

## ⚡ Instalación Rápida

### 1. Prerrequisitos
- MySQL 8.0+ instalado y ejecutándose
- Usuario con permisos para crear bases de datos

### 2. Instalación Automática (Recomendada)

```bash
# Navegar al directorio de base de datos
cd database/

# Ejecutar instalación completa
mysql -u root -p < instalar_bd.sql
```

### 3. Verificación de Instalación

```bash
# Verificar que todo esté correcto
mysql -u root -p < verificar_bd.sql
```

## 📊 Resultado Esperado

Después de la instalación exitosa, deberías ver:

- ✅ **33 tablas creadas** 
- ✅ **Todos los módulos funcionando** (HU-001 a HU-032)
- ✅ **Usuario administrador creado**: `admin@gestionagricola.com` / `Admin123!`

## 🔧 Solución de Problemas

### Error: "Access denied for user 'root'"
```bash
# Configurar contraseña de root
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'tu_password';
FLUSH PRIVILEGES;
exit;
```

### Reinstalar Base de Datos
```bash
# Eliminar y volver a crear
mysql -u root -p -e "DROP DATABASE IF EXISTS gestion_agricola;"
mysql -u root -p < instalar_bd.sql
```

## 📋 Estructura de la Base de Datos

- **33 tablas** cubriendo todos los requerimientos funcionales
- **5 roles** de usuario predefinidos
- **6 departamentos** de ejemplo
- **20 cargos** predefinidos
- **7 tipos de permisos** configurados

## 🚀 Siguiente Paso

Una vez instalada la base de datos, puedes:

1. **Backend**: Configurar la conexión en `backend/.env`
2. **Prisma**: Sincronizar el esquema con `npx prisma db pull`
3. **Frontend**: Conectar a la API del backend

## 📁 Archivos Importantes

- `instalar_bd.sql` - Script de instalación principal
- `verificar_bd.sql` - Verificación de la instalación
- `INSTALACION.md` - Documentación completa
- `migraciones/` - Scripts de creación de tablas
- `semillas/` - Datos iniciales

---

¿Problemas? Revisa `INSTALACION.md` para documentación completa.