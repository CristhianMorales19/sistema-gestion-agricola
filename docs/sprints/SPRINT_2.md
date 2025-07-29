# Sprint 2 - Control de Asistencia Básico
**Duración**: 2 semanas  
**Tipo**: Entrega académica  
**Objetivo**: Implementar sistema básico de control de asistencia y completar gestión de usuarios

## 🎯 Historias de Usuario (6 HU)

### HU-006: Registro de entrada ⭐ **CRÍTICO**
**Como** empleado  
**Quiero** registrar mi hora de entrada  
**Para** que quede constancia de mi asistencia diaria

**Criterios de Aceptación:**
- [x] Interfaz simple para marcar entrada
- [x] Validación de horarios laborales
- [x] Prevención de doble marcado
- [x] Registro automático de fecha/hora
- [x] Confirmación visual del registro

### HU-007: Registro de salida ⭐ **CRÍTICO**
**Como** empleado  
**Quiero** registrar mi hora de salida  
**Para** completar mi jornada laboral

**Criterios de Aceptación:**
- [x] Interfaz para marcar salida
- [x] Validación que existe entrada previa
- [x] Cálculo automático de horas trabajadas
- [x] Prevención de múltiples salidas
- [x] Confirmación del registro

### HU-008: Consulta de asistencia diaria
**Como** supervisor  
**Quiero** consultar la asistencia del día  
**Para** verificar quién está presente

**Criterios de Aceptación:**
- [x] Lista de empleados con estado (presente/ausente)
- [x] Horarios de entrada y salida
- [x] Filtro por departamento
- [x] Indicadores visuales de estado
- [x] Actualización en tiempo real

### HU-028: Registro de usuario
**Como** administrador  
**Quiero** registrar nuevos usuarios del sistema  
**Para** dar acceso a empleados y supervisores

**Criterios de Aceptación:**
- [x] Formulario de registro con roles
- [x] Validación de email único
- [x] Asignación de rol (empleado/supervisor/admin)
- [x] Generación de contraseña temporal
- [x] Envío de credenciales al usuario

### HU-029: Gestión de perfil de usuario
**Como** usuario  
**Quiero** gestionar mi perfil  
**Para** mantener mi información actualizada

**Criterios de Aceptación:**
- [x] Vista de perfil personal
- [x] Edición de datos básicos
- [x] Cambio de foto de perfil
- [x] Historial de actividad
- [x] Configuraciones personales

### HU-004: Eliminación de empleado
**Como** administrador  
**Quiero** eliminar empleados del sistema  
**Para** mantener la base de datos actualizada

**Criterios de Aceptación:**
- [x] Soft delete (marcar como inactivo)
- [x] Confirmación antes de eliminar
- [x] Preservar historial de asistencia
- [x] Opción de reactivar empleado
- [x] Auditoría de eliminaciones

## 🛠 Tareas Técnicas Detalladas

### Backend
- [ ] **Módulo de Asistencia**
  - [ ] Modelo RegistroAsistencia
  - [ ] Controlador de asistencia
  - [ ] Validaciones de horarios
  - [ ] Servicios de cálculo de horas
  - [ ] Endpoints para entrada/salida

- [ ] **Gestión de Usuarios Avanzada**
  - [ ] Controlador de usuarios completo
  - [ ] Sistema de roles y permisos
  - [ ] Middleware de autorización
  - [ ] Gestión de perfiles
  - [ ] Soft delete para empleados

- [ ] **API de Consultas**
  - [ ] Endpoint de asistencia diaria
  - [ ] Filtros por departamento/fecha
  - [ ] Agregaciones y estadísticas básicas
  - [ ] Paginación para listas grandes

### Frontend
- [ ] **Interfaz de Asistencia**
  - [ ] Componente RegistroAsistencia
  - [ ] Dashboard de asistencia diaria
  - [ ] Estados visuales (presente/ausente/tarde)
  - [ ] Notificaciones de registro exitoso

- [ ] **Gestión de Usuarios**
  - [ ] Componente RegistroUsuario
  - [ ] Componente PerfilUsuario
  - [ ] Gestión de roles en UI
  - [ ] Upload de foto de perfil

- [ ] **Mejoras de UX**
  - [ ] Dashboard principal mejorado
  - [ ] Navegación por roles
  - [ ] Indicadores de estado en tiempo real
  - [ ] Confirmaciones para acciones críticas

## 📋 Checklist de Entregables

### Funcionalidades Principales
- [ ] Sistema de marcado de entrada/salida
- [ ] Dashboard de asistencia diaria
- [ ] Gestión completa de usuarios
- [ ] Eliminación segura de empleados
- [ ] Perfiles de usuario funcionales

### Mejoras de Sistema
- [ ] Autorización por roles implementada
- [ ] Validaciones robustas
- [ ] Interfaz intuitiva para asistencia
- [ ] Tiempo real en dashboard

### Calidad
- [ ] Validaciones de negocio (horarios, dobles registros)
- [ ] Manejo de errores mejorado
- [ ] Estados de carga optimizados
- [ ] Datos de prueba realistas

## 🎮 Demo Script para Entrega Académica

### 1. Sistema de Asistencia (10 min)
- [ ] **Escenario feliz**: Empleado marca entrada y salida
- [ ] **Validaciones**: Intentar doble entrada → error
- [ ] **Dashboard**: Mostrar estado en tiempo real
- [ ] **Supervisión**: Vista de asistencia diaria por supervisor

### 2. Gestión de Usuarios (8 min)
- [ ] **Registro**: Crear nuevo usuario con rol
- [ ] **Perfiles**: Editar perfil personal
- [ ] **Roles**: Mostrar diferencias de acceso por rol
- [ ] **Eliminación**: Proceso de soft delete

### 3. Flujo Completo (7 min)
- [ ] **Admin**: Crea empleado → asigna usuario
- [ ] **Empleado**: Login → marca asistencia → ve su perfil
- [ ] **Supervisor**: Ve dashboard de asistencia del día
- [ ] **Admin**: Gestiona eliminación de empleado

## 🔧 Configuraciones Técnicas

### Base de Datos
```sql
-- Nuevas tablas para Sprint 2
- registros_asistencia
- configuracion_horarios  
- logs_auditoria
```

### Variables de Entorno Adicionales
```env
# Configuración de horarios
HORA_ENTRADA_MINIMA=06:00
HORA_ENTRADA_MAXIMA=09:00
HORA_SALIDA_MINIMA=16:00
HORA_SALIDA_MAXIMA=20:00

# Configuración de uploads
UPLOAD_PATH=./uploads/profiles
MAX_FILE_SIZE=5MB
```

### APIs Nuevas
```
POST /api/asistencia/entrada
POST /api/asistencia/salida  
GET /api/asistencia/diaria/:fecha
GET /api/asistencia/empleado/:id

POST /api/usuarios
PUT /api/usuarios/:id/perfil
DELETE /api/empleados/:id (soft delete)
```

## 🚨 Dependencias del Sprint 1

### Críticas (deben estar terminadas)
- [x] Sistema de autenticación funcionando
- [x] Base de datos de empleados operativa
- [x] CRUD básico de empleados
- [x] Estructura de navegación

### Recomendadas (pueden mejorarse en paralelo)
- [ ] UI/UX del Sprint 1 pulida
- [ ] Validaciones completas
- [ ] Manejo de errores consistente

## 📊 Métricas de Éxito

### Funcionales
- [ ] 100% de empleados pueden marcar entrada/salida
- [ ] Dashboard actualiza en < 5 segundos
- [ ] 0 errores en registros duplicados
- [ ] Roles funcionando correctamente

### Técnicas
- [ ] APIs responden en < 500ms
- [ ] 0 errores de validación no manejados
- [ ] Upload de imágenes estable
- [ ] Soft delete preserva integridad

## 🎯 Criterios de Aceptación del Sprint

### Mínimo Viable
- [ ] Empleados pueden marcar entrada y salida
- [ ] Dashboard muestra estado actual del día
- [ ] Usuarios pueden gestionar sus perfiles
- [ ] Admin puede crear/eliminar empleados

### Deseable
- [ ] Validaciones robustas de horarios
- [ ] Notificaciones en tiempo real
- [ ] Interfaz intuitiva y responsiva
- [ ] Auditoría completa de acciones

### Excepcional
- [ ] Dashboard con gráficos básicos
- [ ] Notificaciones automáticas de tardanzas
- [ ] Búsqueda avanzada en listas
- [ ] Exportación básica de datos

## 📅 Cronograma Detallado

### Semana 1
- **Día 1**: Setup de módulo asistencia (backend)
- **Día 2**: Implementar registro entrada/salida
- **Día 3**: Dashboard de asistencia (frontend)
- **Día 4**: Sistema de usuarios avanzado
- **Día 5**: Gestión de perfiles
- **Días 6-7**: Testing y validaciones

### Semana 2  
- **Día 1**: Soft delete de empleados
- **Día 2**: Autorización por roles
- **Día 3**: Mejoras de UX/UI
- **Día 4**: Datos de prueba y casos edge
- **Día 5**: Documentación y preparación
- **Días 6-7**: Demo final y entrega

## 🔄 Continuidad hacia Sprint 3

### Preparación para vacaciones
- [ ] Documentar todas las APIs
- [ ] Crear casos de prueba detallados
- [ ] Setup de entorno de desarrollo
- [ ] Lista de mejoras identificadas

### Bases para funcionalidades avanzadas
- [ ] Estructura de asistencia lista para reportes
- [ ] Sistema de usuarios robusto
- [ ] Datos históricos acumulándose
- [ ] Patrones de desarrollo establecidos
