# Sprint 2 - Control de Asistencia y Gestión de Cuadrillas
**Duración**: 2 semanas  
**Tipo**: Entrega académica  
**Objetivo**: Implementar sistema básico de control de asistencia y gestión de cuadrillas de trabajo

## 🎯 Historias de Usuario (7 HU)

### HU-007: Registrar entrada de trabajador ⭐ **CRÍTICO** - **[EN AZURE]**
**Como** empleado  
**Quiero** registrar mi hora de entrada  
**Para** que quede constancia de mi asistencia diaria

**Criterios de Aceptación:**
- [x] Interfaz simple para marcar entrada
- [x] Validación de horarios laborales
- [x] Prevención de doble marcado
- [x] Registro automático de fecha/hora
- [x] Confirmación visual del registro

### HU-008: Registrar salida de trabajador ⭐ **CRÍTICO** - **[EN AZURE]**
**Como** empleado  
**Quiero** registrar mi hora de salida  
**Para** completar mi jornada laboral

**Criterios de Aceptación:**
- [x] Interfaz para marcar salida
- [x] Validación que existe entrada previa
- [x] Cálculo automático de horas trabajadas
- [x] Prevención de múltiples salidas
- [x] Confirmación del registro

### HU-003: Crear cuadrilla de trabajo - **[EN AZURE]**
**Como** supervisor  
**Quiero** crear cuadrillas de trabajo  
**Para** organizar grupos de trabajadores por tareas específicas

**Criterios de Aceptación:**
- [x] Formulario para crear cuadrilla con nombre y descripción
- [x] Asignación de supervisor responsable
- [x] Definición de capacidad máxima de trabajadores
- [x] Estado activo/inactivo
- [x] Guardado en base de datos

### HU-004: Asignar trabajadores a cuadrilla - **[EN AZURE]**
**Como** supervisor  
**Quiero** asignar trabajadores a cuadrillas  
**Para** formar equipos de trabajo organizados

**Criterios de Aceptación:**
- [x] Selección de trabajadores disponibles
- [x] Validación de capacidad máxima de cuadrilla
- [x] Prevención de asignaciones duplicadas
- [x] Historial de asignaciones
- [x] Posibilidad de remover trabajadores

### HU-006: Asignar rol a usuario - **[EN AZURE]**
**Como** administrador  
**Quiero** asignar roles a usuarios  
**Para** controlar el acceso a diferentes funcionalidades

**Criterios de Aceptación:**
- [x] Lista de usuarios sin rol o con rol actual
- [x] Selección de rol desde catálogo
- [x] Validación de permisos del administrador
- [x] Actualización inmediata de permisos
- [x] Auditoría de cambios de roles

### HU-009: Registrar productividad de trabajador - **[EN AZURE]**
**Como** supervisor  
**Quiero** registrar la productividad de trabajadores  
**Para** llevar control del rendimiento diario

**Criterios de Aceptación:**
- [x] Selección de trabajador y fecha
- [x] Registro de tareas completadas
- [x] Cantidad/calidad de trabajo realizado
- [x] Observaciones adicionales
- [x] Validación de datos ingresados

### HU-010: Registrar ausencia justificada - **[EN AZURE]**
**Como** empleado o supervisor  
**Quiero** registrar ausencias justificadas  
**Para** mantener registro correcto de asistencia

**Criterios de Aceptación:**
- [x] Selección de tipo de ausencia (permiso, enfermedad, etc.)
- [x] Rango de fechas de ausencia
- [x] Adjunto de documentos justificatorios
- [x] Estado de aprobación (pendiente/aprobado/rechazado)
- [x] Notificaciones al supervisor

## 🛠 Tareas Técnicas Detalladas

### Backend
- [ ] **Módulo de Asistencia**
  - [ ] Modelo RegistroAsistencia (entrada/salida)
  - [ ] Controlador de asistencia con validaciones
  - [ ] Servicios de cálculo de horas trabajadas
  - [ ] Endpoints para entrada/salida de trabajadores
  - [ ] Modelo AusenciaJustificada

- [ ] **Módulo de Cuadrillas**
  - [ ] Modelo Cuadrilla con relaciones
  - [ ] Controlador para CRUD de cuadrillas  
  - [ ] Asignación de trabajadores a cuadrillas
  - [ ] Validaciones de capacidad máxima
  - [ ] Historial de asignaciones

- [ ] **Gestión de Usuarios y Roles**
  - [ ] Middleware de autorización por roles
  - [ ] Endpoint para asignar roles
  - [ ] Auditoría de cambios de permisos
  - [ ] Validaciones de permisos de administrador

- [ ] **Módulo de Productividad**
  - [ ] Modelo RegistroProductividad
  - [ ] Controlador para registro diario
  - [ ] Validaciones de datos de productividad
  - [ ] Relaciones con trabajadores y tareas
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

---

## 🔥 Matriz de Riesgo Calórica - Sprint 2

### Metodología de Evaluación
- **Riesgo Técnico** (1-5): Complejidad de implementación y dependencias
- **Impacto de Negocio** (1-5): Criticidad operacional
- **Esfuerzo** (1-5): Story Points y complejidad técnica
- **Calor Total**: Riesgo × Impacto × Esfuerzo

| HU | User Story | Riesgo Técnico | Impacto Negocio | Esfuerzo | 🔥 Calor | Prioridad |
|---|---|---|---|---|---|---|
| **HU-007** | Registrar entrada trabajador | 4 | 5 | 4 | **80** | 🔴 CRÍTICO |
| **HU-008** | Registrar salida trabajador | 4 | 5 | 4 | **80** | 🔴 CRÍTICO |
| **HU-009** | Registrar productividad | 4 | 4 | 4 | **64** | 🔴 ALTO |
| **HU-003** | Crear cuadrilla trabajo | 3 | 4 | 3 | **36** | 🟡 MEDIO |
| **HU-004** | Asignar trabajadores cuadrilla | 3 | 3 | 4 | **36** | 🟡 MEDIO |
| **HU-010** | Registrar ausencia justificada | 3 | 3 | 3 | **27** | 🟡 MEDIO |
| **HU-006** | Asignar rol a usuario | 2 | 3 | 2 | **12** | 🟢 BAJO |

### 🎯 Análisis de Riesgo por Categorías

#### 🔴 **RIESGO CRÍTICO** (Calor > 60)
- **HU-007/008 (Asistencia)**: Control horario preciso, validaciones temporales, cálculo horas
- **HU-009 (Productividad)**: Métricas complejas, relaciones múltiples con tareas

#### 🟡 **RIESGO MEDIO** (Calor 20-60)
- **HU-003/004 (Cuadrillas)**: Gestión de grupos, capacidades máximas
- **HU-010 (Ausencias)**: Workflow de aprobación, tipos de permisos

#### 🟢 **RIESGO BAJO** (Calor < 20)
- **HU-006**: Asignación simple de roles existentes

### 🚨 Estrategias de Mitigación

#### Para HU-007/008 (Asistencia) - Calor 80 cada una:
- [ ] Algoritmo de validación horaria probado primero
- [ ] Manejo de casos edge (entrada sin salida, múltiples entradas)
- [ ] Sincronización temporal precisa
- [ ] Testing con diferentes zonas horarias

#### Para HU-009 (Productividad) - Calor 64:
- [ ] Definir métricas específicas con stakeholders
- [ ] Prototipo de cálculos antes de implementación
- [ ] Validación de datos con supervisores reales

### 📊 Distribución de Calor Total: 335 puntos
- **Asistencia (HU-007/008)**: 160 puntos (48% del sprint)
- **Productividad (HU-009)**: 64 puntos (19% del sprint)
- **Cuadrillas (HU-003/004)**: 72 puntos (21% del sprint)
- **Otros (HU-006/010)**: 39 puntos (12% del sprint)

### 🔗 Dependencias Críticas
- HU-007/008 dependen de datos de trabajadores (Sprint 1)
- HU-009 requiere cuadrillas operativas (HU-003/004)
- HU-004 necesita HU-003 completada primero
