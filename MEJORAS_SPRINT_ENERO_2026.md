# 📋 Mejoras y Nuevos Módulos - Sprint Enero 2026

## Resumen de Cambios

Este documento describe las mejoras implementadas en el sistema AGROMANO durante el sprint de enero 2026, incluyendo optimizaciones al módulo de asistencia y la implementación de nuevos módulos.

---

## ✅ Módulo de Asistencia - Mejoras

### 🔧 Optimizaciones Realizadas

Se realizaron mejoras significativas al módulo de asistencia existente:

1. **Visualización de Comprobantes de Ausencia**
   - Los usuarios ahora pueden visualizar directamente los comprobantes adjuntos en las justificaciones de ausencia
   - Vista previa integrada en el modal de detalles de ausencia
   - Soporte para múltiples formatos de imagen 

2. **Descarga de Comprobantes**
   - Nueva funcionalidad para descargar los comprobantes de justificación
   - Botón de descarga accesible desde la lista de ausencias
---

## 🆕 Nuevo Módulo: Parcelas


### Estructura Implementada
```
backend/src/features/parcelas/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── value-objects/
├── application/
│   ├── dtos/
│   ├── use-cases/
│   └── services/
├── infrastructure/
│   ├── repositories/
│   └── mappers/
└── presentation/
    ├── controllers/
    └── routes/
```

---

## 🆕 Nuevo Módulo: Condiciones Climáticas

### Descripción
Nuevo módulo para el registro y monitoreo de condiciones climáticas que afectan las operaciones agrícolas.



## 🔐 Configuración de Permisos en Auth0

### ⚠️ IMPORTANTE: Permisos Requeridos para Condiciones Climáticas

Para el correcto funcionamiento del módulo de Condiciones Climáticas, es **necesario agregar los siguientes permisos** en la configuración de Auth0:

#### Permisos a Crear en Auth0 Dashboard

| Permiso | Descripción |
|---------|-------------|
| `clima:read` | Ver datos de clima y condiciones climáticas |
| `clima:create` | Registrar nuevas condiciones climáticas |
| `clima:update` | Actualizar registros de clima |
| `clima:reports` | Generar reportes de clima |
| `clima:dashboard` | Ver dashboard de condiciones climáticas |
| `clima:export` | Exportar datos de clima |
| `clima:delete` | Eliminar registros de clima |

### Pasos para Configurar en Auth0

1. **Acceder a Auth0 Dashboard**
   - Ir a [Auth0 Dashboard](https://manage.auth0.com/)
   - Seleccionar la aplicación/API de AGROMANO

2. **Agregar Permisos**
   - Navegar a `Applications` → `APIs` → `[Tu API]` → `Permissions`
   - Agregar cada permiso de la tabla anterior

3. **Asignar Permisos a Roles**
   
   **Rol Administrador:**
   - Asignar todos los permisos (`clima:read`, `clima:create`, `clima:update`, `clima:reports`, `clima:dashboard`, `clima:export`, `clima:delete`)
   
   **Rol Supervisor:**
   - Asignar: `clima:read`, `clima:create`, `clima:update`, `clima:reports`, `clima:dashboard`
   
   **Rol Operador/Empleado:**
   - Asignar: `clima:read`, `clima:dashboard`

4. **Verificar Configuración**
   - Probar el acceso con diferentes usuarios
   - Verificar que los endpoints respeten los permisos

### Script SQL para Base de Datos Local

Si utilizas permisos en base de datos local, ejecutar:

```sql
-- Insertar permisos de clima
INSERT INTO permisos (nombre, descripcion, modulo) VALUES
('clima:read', 'Ver datos de clima y condiciones climáticas', 'clima'),
('clima:create', 'Registrar nuevas condiciones climáticas', 'clima'),
('clima:update', 'Actualizar registros de clima', 'clima'),
('clima:reports', 'Generar reportes de clima', 'clima'),
('clima:dashboard', 'Ver dashboard de condiciones climáticas', 'clima'),
('clima:export', 'Exportar datos de clima', 'clima'),
('clima:delete', 'Eliminar registros de clima', 'clima');

-- Asignar permisos al rol administrador (ajustar ID según tu BD)
INSERT INTO rol_permisos (rol_id, permiso_id)
SELECT r.id, p.id 
FROM roles r, permisos p 
WHERE r.nombre = 'Administrador' AND p.modulo = 'clima';
```

---
