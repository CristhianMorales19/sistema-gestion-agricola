# Documento de Arquitectura del Sistema
## Sistema de Control y Planificación de Mano de Obra Agroindustrial

**Universidad Nacional de Costa Rica**  
**Escuela de Informática**  
**Curso:** Desarrollo de Aplicaciones  
**Proyecto:** Sistema de Gestión Agrícola  

---

## Tabla de Contenido

1. [Introducción](#1-introducción)
2. [Alcance y Objetivos](#2-alcance-y-objetivos)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
   - 3.1 [Plataforma Técnica](#31-plataforma-técnica)
   - 3.2 [Portabilidad](#32-portabilidad)
   - 3.3 [Seguridad y Control de Acceso](#33-seguridad-y-control-de-acceso)
     - 3.3.1 [Autenticación](#331-autenticación)
     - 3.3.2 [Autorización](#332-autorización)
     - 3.3.3 [Matriz de Permisos por Rol](#333-matriz-de-permisos-por-rol)
4. [Vistas Arquitectónicas (Modelo 4+1)](#4-vistas-arquitectónicas-modelo-41)
   - 4.1 [Vista Lógica](#41-vista-lógica)
   - 4.2 [Vista de Desarrollo](#42-vista-de-desarrollo)
   - 4.3 [Vista de Procesos](#43-vista-de-procesos)
   - 4.4 [Vista Física](#44-vista-física)
   - 4.5 [Vista de Escenarios](#45-vista-de-escenarios)
5. [Patrones de Diseño](#5-patrones-de-diseño)
6. [Tecnologías y Herramientas](#6-tecnologías-y-herramientas)
7. [Anexos](#7-anexos)

---

## 1. Introducción

El Sistema de Control y Planificación de Mano de Obra Agroindustrial es una aplicación web integral diseñada para gestionar de manera eficiente los recursos humanos en el sector agroindustrial. El sistema abarca desde el control de asistencia y productividad hasta la gestión de nómina y generación de reportes especializados.

### 1.1 Propósito del Documento

Este documento presenta la arquitectura técnica del sistema, describiendo las decisiones de diseño, patrones utilizados, tecnologías seleccionadas y la estructura organizacional del código siguiendo los principios de **Screaming Architecture**.

### 1.2 Audiencia

- Desarrolladores del equipo
- Arquitectos de software
- Evaluadores académicos
- Administradores de sistemas
- Stakeholders técnicos

---

## 2. Alcance y Objetivos

### 2.1 Requerimientos Funcionales Principales

El sistema debe satisfacer **32 requerimientos funcionales** organizados en 6 módulos principales:

1. **Autenticación y Autorización** (5 requerimientos)
2. **Gestión de Personal** (6 requerimientos)
3. **Control de Asistencia** (7 requerimientos)
4. **Gestión de Nómina** (5 requerimientos)
5. **Control de Productividad** (5 requerimientos)
6. **Reportes y Analytics** (4 requerimientos)

### 2.2 Objetivos de Calidad

- **Escalabilidad:** Soportar hasta 500 usuarios concurrentes
- **Disponibilidad:** 99.5% de uptime
- **Seguridad:** Cumplimiento con estándares de protección de datos
- **Usabilidad:** Interfaz intuitiva y responsive
- **Mantenibilidad:** Código limpio y bien documentado

### 2.3 Restricciones Arquitectónicas

- **Tecnológicas:** Stack basado en JavaScript/TypeScript (Node.js + React)
- **Presupuestarias:** Uso de tecnologías open source para minimizar costos
- **Temporales:** Desarrollo por sprints con entregas cada 2-3 semanas
- **Organizacionales:** Equipo de desarrollo académico con conocimientos específicos
- **Regulatorias:** Cumplimiento con leyes de protección de datos personales

### 2.4 Confiabilidad/Disponibilidad

El sistema garantiza altos niveles de confiabilidad y disponibilidad mediante una arquitectura robusta y estrategias de tolerancia a fallos.

#### Nivel de Disponibilidad Requerido

**Objetivo:** 99.5% de disponibilidad (SLA)
- **Tiempo de inactividad máximo:** 3.65 horas por mes
- **Tiempo de inactividad máximo diario:** 7.2 minutos
- **RPO (Recovery Point Objective):** 1 hora
- **RTO (Recovery Time Objective):** 30 minutos

#### Estrategias de Disponibilidad

**1. Redundancia de Servicios**
- **Load Balancer:** NGINX con múltiples instancias del backend
- **Base de Datos:** Configuración Master-Slave con failover automático
- **Almacenamiento:** Backup automático cada 6 horas

**2. Monitoreo y Alertas**
- **Health Checks:** Verificación cada 30 segundos de servicios críticos
- **Alertas Automáticas:** Notificación inmediata por email/SMS en caso de fallas
- **Dashboards:** Monitoreo en tiempo real de métricas del sistema

**3. Tolerancia a Fallos**
- **Circuit Breaker Pattern:** Protección contra cascadas de fallos
- **Retry Logic:** Reintentos automáticos con backoff exponencial
- **Graceful Degradation:** Funcionalidad limitada en caso de fallos parciales

**4. Backup y Recuperación**
- **Backup Incremental:** Cada 6 horas con retención de 30 días
- **Backup Completo:** Semanal con retención de 6 meses
- **Pruebas de Recuperación:** Mensuales para validar integridad
- **Replicación Geográfica:** Backup offsite para disaster recovery

#### Garantías de la Arquitectura

**Nivel de Aplicación:**
- **Stateless Services:** Servicios sin estado para fácil escalamiento
- **Database Connection Pooling:** Gestión eficiente de conexiones
- **Caching Strategy:** Redis para reducir carga en base de datos

**Nivel de Infraestructura:**
- **Auto-scaling:** Escalamiento automático basado en métricas
- **Container Orchestration:** Docker Swarm o Kubernetes para alta disponibilidad
- **Geographic Distribution:** Despliegue en múltiples zonas de disponibilidad

### 2.5 Desempeño

#### 2.5.1 Requisitos de Desempeño

El sistema debe cumplir con estrictos requisitos de desempeño para garantizar una experiencia de usuario óptima en el entorno agroindustrial.

**Tiempo de Respuesta**
- **Consultas simples:** ≤ 200ms (95% de las requests)
- **Consultas complejas:** ≤ 1 segundo (reportes básicos)
- **Reportes avanzados:** ≤ 5 segundos (análisis de grandes volúmenes)
- **Carga inicial de página:** ≤ 3 segundos (First Contentful Paint)

**Throughput (Capacidad de Procesamiento)**
- **Usuarios concurrentes:** 500 usuarios simultáneos
- **Transacciones por segundo (TPS):** 1,000 TPS en horas pico
- **Consultas a base de datos:** 5,000 queries/segundo
- **Procesamiento de archivos:** 10MB/segundo para importación de datos

**Escalabilidad**
- **Crecimiento horizontal:** Capacidad de agregar instancias sin downtime
- **Carga de CPU:** Mantener < 70% en condiciones normales
- **Uso de memoria:** < 80% en cada instancia
- **Latencia de red:** < 50ms en red local, < 200ms remoto

**Eficiencia de Recursos**
- **Tamaño de bundle frontend:** < 2MB comprimido
- **Memory footprint por usuario:** < 50MB en backend
- **Database query optimization:** Todas las consultas con índices apropiados
- **Cache hit ratio:** > 85% para datos frecuentemente accedidos

#### 2.5.2 Volumen Transaccional

La estimación del volumen transaccional se basa en el análisis del sector agroindustrial costarricense y proyecciones de crecimiento.

**Parámetros Base del Negocio**

**Personal y Organización:**
- **Empleados activos:** 200-500 trabajadores por empresa
- **Supervisores:** 1 supervisor por cada 15-20 empleados
- **Departamentos:** 5-10 departamentos por empresa
- **Cuadrillas de trabajo:** 3-8 cuadrillas por departamento
- **Crecimiento anual del personal:** 15-20%

**Operaciones Diarias**

| **Operación** | **Frecuencia Diaria** | **Frecuencia Mensual** | **Datos Asociados** |
|---|---|---|---|
| **Marcadas de asistencia** | 1,000 registros | 22,000 registros | Entrada/salida por empleado |
| **Registros de productividad** | 300 registros | 6,600 registros | Tareas completadas |
| **Solicitudes de permisos** | 15 solicitudes | 330 solicitudes | Vacaciones, médicos, personales |
| **Consultas de reportes** | 50 consultas | 1,100 consultas | Dashboards y reports |
| **Actualizaciones de datos** | 200 modificaciones | 4,400 modificaciones | Edición de perfiles, datos |

**Volumen Transaccional Mensual**

**Transacciones de Lectura (80% del total):**
- **Consultas de asistencia:** 8,800 consultas/mes
- **Visualización de reportes:** 1,100 consultas/mes
- **Dashboard refreshes:** 15,000 actualizaciones/mes
- **Búsquedas de empleados:** 2,200 búsquedas/mes
- **Consultas de nómina:** 500 consultas/mes
- **Total lecturas:** ~27,600 transacciones/mes

**Transacciones de Escritura (20% del total):**
- **Registros de asistencia:** 22,000 inserts/mes
- **Actualizaciones de productividad:** 6,600 inserts/mes
- **Modificaciones de datos:** 4,400 updates/mes
- **Procesamientos de nómina:** 500 procesos/mes
- **Gestión de permisos:** 330 transacciones/mes
- **Total escrituras:** ~33,830 transacciones/mes

**Proyección de Crecimiento**

| **Año** | **Empleados** | **Transacciones/Mes** | **Almacenamiento (GB)** | **Bandwidth (GB/mes)** |
|---|---|---|---|---|
| **Año 1** | 300 | 45,000 | 2.5 GB | 50 GB |
| **Año 2** | 400 | 60,000 | 4.2 GB | 75 GB |
| **Año 3** | 500 | 75,000 | 6.8 GB | 100 GB |
| **Año 5** | 750 | 112,500 | 15.0 GB | 180 GB |

**Impacto en Decisiones Arquitectónicas**

**Base de Datos:**
- **Tamaño inicial:** 10 GB con crecimiento de 3-4 GB/año
- **Índices:** Optimización para consultas de asistencia y reportes
- **Particionado:** Tabla de registros por mes para mejor performance
- **Archiving:** Datos históricos > 2 años en almacenamiento frío

**Servidor de Aplicaciones:**
- **CPU:** Mínimo 4 cores para procesamiento de nómina
- **RAM:** 8 GB inicial, escalable a 16 GB
- **Storage:** SSD para mejor I/O en consultas frecuentes
- **Network:** Bandwidth mínimo de 100 Mbps

**Frontend y UX:**
- **Paginación:** Máximo 50 registros por página
- **Lazy Loading:** Carga diferida de componentes pesados
- **Caching:** Cache local de datos frecuentes por 5 minutos
- **Offline Mode:** Capacidad básica para registro de asistencia

**Estrategias de Optimización:**
- **Connection Pooling:** Pool de 20-50 conexiones concurrentes
- **Query Optimization:** Índices compuestos para consultas complejas
- **Background Jobs:** Procesamiento asíncrono de reportes pesados
- **CDN:** Distribución de assets estáticos para mejor latencia

---

## 3. Arquitectura del Sistema

### 3.1 Plataforma Técnica

El sistema está construido sobre una arquitectura de **3 capas** con las siguientes tecnologías:

#### Frontend (Capa de Presentación)
- **Framework:** React 18 con TypeScript
- **Gestión de Estado:** Zustand
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Routing:** React Router v6
- **Validación:** React Hook Form + Zod
- **Comunicación:** Axios + React Query

#### Backend (Capa de Lógica de Negocio)
- **Runtime:** Node.js 18+
- **Framework:** Express.js con TypeScript
- **ORM:** Prisma
- **Autenticación:** JWT + bcrypt
- **Validación:** Joi
- **Documentación:** Swagger/OpenAPI

#### Base de Datos (Capa de Persistencia)
- **Motor:** MySQL 8.0+
- **Migración:** Prisma Migrate
- **Backup:** Scripts automatizados
- **Índices:** Optimizados para consultas frecuentes

### 3.2 Portabilidad

#### Desarrollo
- **Docker:** Contenedores para desarrollo local
- **Docker Compose:** Orquestación de servicios
- **Variables de Entorno:** Configuración flexible

#### Producción
- **Cloud Ready:** Compatible con AWS, Azure, GCP
- **Horizontal Scaling:** Load balancer + múltiples instancias
- **Database Scaling:** Read replicas + connection pooling

### 3.3 Seguridad y Control de Acceso

#### 3.3.1 Autenticación

El sistema implementa un esquema de autenticación basado en **JWT (JSON Web Tokens)** con las siguientes características:

- **Algoritmo:** HS256 (HMAC with SHA-256)
- **Expiración:** 8 horas para tokens de acceso
- **Refresh Tokens:** 7 días de vigencia
- **Logout:** Invalidación inmediata de tokens
- **Protección CSRF:** Tokens anti-CSRF en formularios

#### 3.3.2 Autorización

La autorización se implementa mediante un sistema de **roles y permisos granulares**:

- **Verificación por Endpoint:** Middleware de autorización en cada ruta protegida
- **Permisos Granulares:** Control específico por acción y recurso
- **Herencia de Roles:** Los roles superiores incluyen permisos de roles inferiores
- **Validación en Frontend:** Ocultación de UI basada en permisos del usuario

#### 3.3.3 Matriz de Permisos por Rol

El sistema implementa un **modelo de control de acceso basado en roles (RBAC)** con **5 roles principales** que definen diferentes niveles de acceso y responsabilidades dentro del sistema agroindustrial.

##### Roles del Sistema

1. **ADMIN** - Administrador del sistema con acceso total
2. **GERENTE_RRHH** - Gerente de recursos humanos
3. **SUP_CAMPO** - Supervisor de campo y operaciones
4. **SUP_RRHH** - Supervisor de recursos humanos
5. **EMPLEADO** - Empleado básico del sistema
6. **VISUAL** - Usuario con acceso de solo lectura/consulta

##### Matriz Detallada de Permisos

> **Leyenda:** ✅ = Acceso Completo | 🔄 = Acceso Limitado | ❌ = Sin Acceso

| **Módulo / Funcionalidad** | **Admin** | **Gerente RRHH** | **Sup.Campo** | **Sup.RRHH** | **Empleado** | **Visual** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **GESTIÓN DE PERSONAL** |||||||
| Crear trabajador | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Asignar info laboral | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Crear cuadrilla | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Asignar a cuadrilla | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Crear roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Asignar roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver empleados | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Editar empleados | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Eliminar empleados | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **GESTIÓN DE USUARIOS** |||||||
| Crear usuarios | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar usuarios | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Eliminar usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver usuarios | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Gestionar permisos | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gestionar cargos | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Gestionar departamentos | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **CONTROL DE ASISTENCIA** |||||||
| Registrar asistencia (otros) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar asistencia propia | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Editar asistencia | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver asistencia (todos) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Ver asistencia propia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Aprobar permisos/vacaciones | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Solicitar permisos/vacaciones | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GESTIÓN DE NÓMINA** |||||||
| Crear períodos nómina | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Calcular nómina | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Procesar pagos | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Ver nómina (todos) | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Ver nómina propia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Configurar deducciones | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **CONTROL DE PRODUCTIVIDAD** |||||||
| Crear tareas/metas | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Asignar tareas | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar progreso (otros) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Registrar progreso propio | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Ver productividad (todos) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Ver productividad propia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Evaluar rendimiento | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **REPORTES Y ANALYTICS** |||||||
| Generar reportes RH | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Generar reportes asistencia | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Generar reportes nómina | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Generar reportes productividad | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Exportar datos | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Dashboard ejecutivo | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **CONFIGURACIÓN SISTEMA** |||||||
| Configurar parámetros | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configurar notificaciones | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Realizar backups | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver logs del sistema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

##### Descripción de Permisos por Rol

**🔴 ADMIN (Administrador del Sistema)**
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y roles del sistema
- Configuración global del sistema
- Respaldo y mantenimiento
- Supervisión completa de logs y actividad del sistema

**� GERENTE_RRHH (Gerente de Recursos Humanos)**
- Gestión completa de empleados y personal
- Control total de asistencia y permisos
- Acceso completo a nómina y beneficios
- Generación de reportes de RRHH
- Configuración de políticas de personal

**🟡 SUP_CAMPO (Supervisor de Campo)**
- Gestión de asistencia de trabajadores de campo
- Control de productividad y tareas agrícolas
- Creación y asignación de cuadrillas de trabajo
- Evaluación de rendimiento del personal de campo
- Generación de reportes operativos

**🟢 SUP_RRHH (Supervisor de Recursos Humanos)**
- Gestión parcial de empleados bajo su supervisión
- Control de asistencia y aprobación de permisos
- Acceso a cálculos de nómina y deducciones
- Evaluación de rendimiento de su equipo
- Reportes específicos de su área

**🔵 EMPLEADO (Usuario Básico)**
- Vista de su propia información personal y laboral
- Registro de asistencia personal
- Seguimiento de productividad propia
- Solicitud de permisos y vacaciones
- Consulta de nómina personal

**⚪ VISUAL (Usuario de Solo Lectura)**
- Acceso de consulta a información general
- Visualización de reportes y dashboards
- Sin capacidad de modificación de datos
- Ideal para directivos o auditores externos
- Acceso limitado a información sensible
- **Empleado → Ver empleados:** Solo información básica de contacto
- **Empleado → Historial laboral:** Solo su propio historial
- **Supervisor → Configurar horarios:** Solo para su equipo
- **Supervisor → Aprobar extras/bonos:** Solo para su equipo, con límites
- **Supervisor → Configurar KPIs:** Solo para su área de responsabilidad
- **Contador → Dashboard ejecutivo:** Solo métricas financieras
- **Admin RH → Ver logs:** Solo logs relacionados con RRHH
- **Supervisor → Configurar notificaciones:** Solo para su equipo

##### Descripción de Permisos por Rol

**🔴 SUPER_ADMIN (Administrador del Sistema)**
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y roles
- Configuración del sistema
- Respaldo y mantenimiento
- Supervisión completa de logs y actividad

**🟠 ADMIN_RECURSOS_HUMANOS (Administrador de RRHH)**
- Gestión completa de empleados y personal
- Control total de asistencia y permisos
- Acceso completo a nómina
- Generación de reportes de RRHH
- Sin acceso a configuración del sistema

**🟡 SUPERVISOR (Supervisor de Campo)**
- Gestión de asistencia de su equipo
- Control de productividad y tareas
- Evaluación de rendimiento
- Generación de reportes operativos
- Sin acceso a nómina ni configuración

**🟢 CONTADOR (Encargado Financiero)**
- Gestión completa de nómina
- Configuración de deducciones
- Reportes financieros
- Consulta de información de empleados
- Sin acceso a gestión de personal

**🔵 EMPLEADO (Usuario Básico)**
- Vista de su propia información
- Registro de asistencia personal
- Seguimiento de productividad propia
- Solicitud de permisos
- Consulta de nómina personal

##### Implementación Técnica

```typescript
// Definición de roles y permisos del sistema
export const ROLES = {
  ADMIN: 'ADMIN',
  GERENTE_RRHH: 'GERENTE_RRHH', 
  SUP_CAMPO: 'SUP_CAMPO',
  SUP_RRHH: 'SUP_RRHH',
  EMPLEADO: 'EMPLEADO',
  VISUAL: 'VISUAL'
} as const;

export const PERMISOS = {
  // Gestión de Personal
  PERSONAL: {
    CREAR_TRABAJADOR: 'personal.crear_trabajador',
    ASIGNAR_INFO_LABORAL: 'personal.asignar_info_laboral',
    CREAR_CUADRILLA: 'personal.crear_cuadrilla',
    ASIGNAR_CUADRILLA: 'personal.asignar_cuadrilla',
    CREAR_ROLES: 'personal.crear_roles',
    ASIGNAR_ROLES: 'personal.asignar_roles',
    VER_EMPLEADOS: 'personal.ver_empleados',
    EDITAR_EMPLEADOS: 'personal.editar_empleados',
    ELIMINAR_EMPLEADOS: 'personal.eliminar_empleados'
  },
  // Control de Asistencia
  ASISTENCIA: {
    REGISTRAR_OTROS: 'asistencia.registrar_otros',
    REGISTRAR_PROPIA: 'asistencia.registrar_propia',
    EDITAR: 'asistencia.editar',
    VER_TODOS: 'asistencia.ver_todos',
    VER_PROPIA: 'asistencia.ver_propia',
    APROBAR_PERMISOS: 'asistencia.aprobar_permisos',
    SOLICITAR_PERMISOS: 'asistencia.solicitar_permisos'
  },
  // Gestión de Nómina
  NOMINA: {
    CREAR_PERIODOS: 'nomina.crear_periodos',
    CALCULAR: 'nomina.calcular',
    PROCESAR_PAGOS: 'nomina.procesar_pagos',
    VER_TODOS: 'nomina.ver_todos',
    VER_PROPIA: 'nomina.ver_propia',
    CONFIGURAR_DEDUCCIONES: 'nomina.configurar_deducciones'
  },
  // Control de Productividad
  PRODUCTIVIDAD: {
    CREAR_TAREAS: 'productividad.crear_tareas',
    ASIGNAR_TAREAS: 'productividad.asignar_tareas',
    REGISTRAR_PROGRESO_OTROS: 'productividad.registrar_progreso_otros',
    REGISTRAR_PROGRESO_PROPIO: 'productividad.registrar_progreso_propio',
    VER_TODOS: 'productividad.ver_todos',
    VER_PROPIA: 'productividad.ver_propia',
    EVALUAR_RENDIMIENTO: 'productividad.evaluar_rendimiento'
  },
  // Reportes
  REPORTES: {
    GENERAR_RH: 'reportes.generar_rh',
    GENERAR_ASISTENCIA: 'reportes.generar_asistencia',
    GENERAR_NOMINA: 'reportes.generar_nomina',
    GENERAR_PRODUCTIVIDAD: 'reportes.generar_productividad',
    EXPORTAR_DATOS: 'reportes.exportar_datos',
    DASHBOARD_EJECUTIVO: 'reportes.dashboard_ejecutivo'
  },
  // Configuración
  CONFIGURACION: {
    PARAMETROS_SISTEMA: 'config.parametros_sistema',
    NOTIFICACIONES: 'config.notificaciones',
    BACKUPS: 'config.backups',
    LOGS_SISTEMA: 'config.logs_sistema'
  }
} as const;

// Matriz de permisos por rol
export const ROLES_PERMISOS = {
  [ROLES.ADMIN]: [
    // Acceso total - todos los permisos
    ...Object.values(PERMISOS.PERSONAL),
    ...Object.values(PERMISOS.ASISTENCIA),
    ...Object.values(PERMISOS.NOMINA),
    ...Object.values(PERMISOS.PRODUCTIVIDAD),
    ...Object.values(PERMISOS.REPORTES),
    ...Object.values(PERMISOS.CONFIGURACION)
  ],
  
  [ROLES.GERENTE_RRHH]: [
    // Gestión completa de RRHH
    PERMISOS.PERSONAL.CREAR_TRABAJADOR,
    PERMISOS.PERSONAL.ASIGNAR_INFO_LABORAL,
    PERMISOS.PERSONAL.CREAR_CUADRILLA,
    PERMISOS.PERSONAL.ASIGNAR_CUADRILLA,
    PERMISOS.PERSONAL.VER_EMPLEADOS,
    PERMISOS.PERSONAL.EDITAR_EMPLEADOS,
    PERMISOS.PERSONAL.ELIMINAR_EMPLEADOS,
    // Control total de asistencia
    ...Object.values(PERMISOS.ASISTENCIA),
    // Gestión completa de nómina
    ...Object.values(PERMISOS.NOMINA),
    // Productividad completa
    ...Object.values(PERMISOS.PRODUCTIVIDAD),
    // Reportes de RRHH
    PERMISOS.REPORTES.GENERAR_RH,
    PERMISOS.REPORTES.GENERAR_ASISTENCIA,
    PERMISOS.REPORTES.GENERAR_NOMINA,
    PERMISOS.REPORTES.GENERAR_PRODUCTIVIDAD,
    PERMISOS.REPORTES.EXPORTAR_DATOS,
    PERMISOS.REPORTES.DASHBOARD_EJECUTIVO,
    // Configuración limitada
    PERMISOS.CONFIGURACION.NOTIFICACIONES
  ],
  
  [ROLES.SUP_CAMPO]: [
    // Gestión limitada de personal
    PERMISOS.PERSONAL.CREAR_CUADRILLA,
    PERMISOS.PERSONAL.ASIGNAR_CUADRILLA,
    PERMISOS.PERSONAL.VER_EMPLEADOS,
    // Control de asistencia del equipo
    PERMISOS.ASISTENCIA.REGISTRAR_OTROS,
    PERMISOS.ASISTENCIA.REGISTRAR_PROPIA,
    PERMISOS.ASISTENCIA.EDITAR,
    PERMISOS.ASISTENCIA.VER_TODOS,
    PERMISOS.ASISTENCIA.VER_PROPIA,
    PERMISOS.ASISTENCIA.APROBAR_PERMISOS,
    PERMISOS.ASISTENCIA.SOLICITAR_PERMISOS,
    // Productividad del equipo
    ...Object.values(PERMISOS.PRODUCTIVIDAD),
    // Reportes operativos
    PERMISOS.REPORTES.GENERAR_ASISTENCIA,
    PERMISOS.REPORTES.GENERAR_PRODUCTIVIDAD,
    PERMISOS.REPORTES.EXPORTAR_DATOS,
    PERMISOS.REPORTES.DASHBOARD_EJECUTIVO
  ],
  
  [ROLES.SUP_RRHH]: [
    // Gestión limitada de empleados
    PERMISOS.PERSONAL.VER_EMPLEADOS,
    PERMISOS.PERSONAL.EDITAR_EMPLEADOS,
    // Control de asistencia
    ...Object.values(PERMISOS.ASISTENCIA),
    // Acceso a nómina
    ...Object.values(PERMISOS.NOMINA),
    // Productividad del equipo
    ...Object.values(PERMISOS.PRODUCTIVIDAD),
    // Reportes de RRHH
    PERMISOS.REPORTES.GENERAR_RH,
    PERMISOS.REPORTES.GENERAR_ASISTENCIA,
    PERMISOS.REPORTES.GENERAR_NOMINA,
    PERMISOS.REPORTES.GENERAR_PRODUCTIVIDAD,
    PERMISOS.REPORTES.EXPORTAR_DATOS,
    PERMISOS.REPORTES.DASHBOARD_EJECUTIVO,
    // Configuración limitada
    PERMISOS.CONFIGURACION.NOTIFICACIONES
  ],
  
  [ROLES.EMPLEADO]: [
    // Solo información personal
    PERMISOS.ASISTENCIA.REGISTRAR_PROPIA,
    PERMISOS.ASISTENCIA.VER_PROPIA,
    PERMISOS.ASISTENCIA.SOLICITAR_PERMISOS,
    PERMISOS.NOMINA.VER_PROPIA,
    PERMISOS.PRODUCTIVIDAD.REGISTRAR_PROGRESO_PROPIO,
    PERMISOS.PRODUCTIVIDAD.VER_PROPIA
  ],
  
  [ROLES.VISUAL]: [
    // Solo lectura/consulta
    PERMISOS.PERSONAL.VER_EMPLEADOS,
    PERMISOS.ASISTENCIA.VER_TODOS,
    PERMISOS.ASISTENCIA.VER_PROPIA,
    PERMISOS.NOMINA.VER_TODOS,
    PERMISOS.NOMINA.VER_PROPIA,
    PERMISOS.PRODUCTIVIDAD.VER_TODOS,
    PERMISOS.PRODUCTIVIDAD.VER_PROPIA,
    PERMISOS.REPORTES.GENERAR_RH,
    PERMISOS.REPORTES.GENERAR_ASISTENCIA,
    PERMISOS.REPORTES.GENERAR_NOMINA,
    PERMISOS.REPORTES.GENERAR_PRODUCTIVIDAD,
    PERMISOS.REPORTES.DASHBOARD_EJECUTIVO
  ]
} as const;

// Middleware de autorización
export const verificarPermiso = (permisoRequerido: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.user; // Datos del JWT
    const rolUsuario = usuario.rol;
    const permisosRol = ROLES_PERMISOS[rolUsuario] || [];
    
    if (permisosRol.includes(permisoRequerido)) {
      next();
    } else {
      res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: 'No tienes permisos para realizar esta acción'
      });
    }
  };
};
```

##### Reglas de Negocio Especiales

**Restricciones por Contexto:**

1. **Supervisores de Campo:** 
   - Solo pueden gestionar empleados de su cuadrilla asignada
   - Acceso limitado a datos de otras cuadrillas

2. **Supervisores de RRHH:**
   - Pueden editar empleados solo de su departamento
   - Acceso completo a su área de responsabilidad

3. **Empleados:**
   - Acceso exclusivo a su propia información
   - No pueden ver datos de otros empleados

4. **Usuario Visual:**
   - Solo acceso de lectura
   - Datos sensibles ocultos (salarios específicos)
   - Ideal para auditorías y revisiones ejecutivas

**Validaciones de Seguridad:**

- Verificación de permisos en cada endpoint de la API
- Validación adicional en el frontend para UX
- Logs de acceso para auditoría
- Tokens JWT con información de rol
- Refresh automático de permisos al cambiar roles

---

## 4. Vistas Arquitectónicas (Modelo 4+1)

### 4.1 Vista Lógica

#### Diagrama de Componentes Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE GESTIÓN AGRÍCOLA                 │
├─────────────────────────────────────────────────────────────────┤
│                        CAPA DE PRESENTACIÓN                     │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Autenticación │    Personal     │      Asistencia             │
│   - Login       │   - CRUD Emp.   │    - Registro E/S           │
│   - Logout      │   - Cuadrillas  │    - Permisos               │
│   - Roles       │   - Cargos      │    - Reportes               │
├─────────────────┼─────────────────┼─────────────────────────────┤
│   Productividad │     Nómina      │      Reportes               │
│   - Tareas      │   - Cálculos    │    - Dashboards             │
│   - Metas       │   - Recibos     │    - Exportación            │
│   - Evaluación  │   - Deducciones │    - Analytics              │
└─────────────────┴─────────────────┴─────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE LÓGICA DE NEGOCIO                │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Auth Service   │ Personal Service│   Asistencia Service        │
│  Role Service   │ Cuadrilla Srv   │   Permiso Service           │
├─────────────────┼─────────────────┼─────────────────────────────┤
│ Productividad   │  Nómina Service │   Reporte Service           │
│ Service         │  Cálculo Service│   Export Service            │
└─────────────────┴─────────────────┴─────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE PERSISTENCIA                     │
├─────────────────┬─────────────────┬─────────────────────────────┤
│    Usuarios     │    Empleados    │    Registros Asistencia     │
│    Roles        │    Cargos       │    Permisos                 │
│    Sesiones     │    Departamentos│    Horarios                 │
├─────────────────┼─────────────────┼─────────────────────────────┤
│  Productividad  │     Nómina      │       Configuración         │
│  Tareas         │     Deducciones │       Parámetros            │
│  Evaluaciones   │     Bonificación│       Logs                  │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

#### Módulos del Sistema

**Módulo de Autenticación:**
- Gestión de sesiones y tokens JWT
- Control de acceso basado en roles (RBAC)
- Recuperación de contraseñas
- Auditoría de accesos

**Módulo de Personal:**
- CRUD completo de empleados
- Gestión de cuadrillas de trabajo
- Administración de cargos y departamentos
- Estructura organizacional

**Módulo de Asistencia:**
- Registro de entrada/salida
- Control de horarios laborales
- Gestión de permisos y ausencias
- Cálculo de horas trabajadas

**Módulo de Nómina:**
- Configuración de salarios base
- Cálculo de horas extras
- Aplicación de deducciones y bonificaciones
- Generación de recibos de pago

**Módulo de Productividad:**
- Definición y asignación de tareas
- Seguimiento de metas
- Evaluación de rendimiento
- Métricas de productividad

**Módulo de Reportes:**
- Dashboards ejecutivos
- Reportes operacionales
- Análisis de tendencias
- Exportación de datos

### 4.2 Vista de Desarrollo

El proyecto sigue **Screaming Architecture**, donde la estructura de carpetas refleja directamente las funcionalidades del negocio:

```
Sistema de Gestión Agrícola/
├── frontend/
│   ├── src/
│   │   ├── caracteristicas/
│   │   │   ├── autenticacion/
│   │   │   │   ├── componentes/
│   │   │   │   ├── hooks/
│   │   │   │   ├── servicios/
│   │   │   │   └── tipos/
│   │   │   ├── gestion-personal/
│   │   │   ├── control-asistencia/
│   │   │   ├── gestion-nomina/
│   │   │   ├── control-productividad/
│   │   │   └── gestion-reportes/
│   │   ├── compartido/
│   │   └── infraestructura/
├── backend/
│   ├── src/
│   │   ├── caracteristicas/
│   │   │   ├── auth/
│   │   │   │   ├── controladores/
│   │   │   │   ├── servicios/
│   │   │   │   ├── repositorios/
│   │   │   │   └── rutas/
│   │   │   ├── personal/
│   │   │   ├── asistencia/
│   │   │   ├── nomina/
│   │   │   ├── productividad/
│   │   │   └── reportes/
│   │   ├── compartido/
│   │   └── infraestructura/
└── database/
    ├── migraciones/
    ├── semillas/
    └── esquemas/
```

### 4.3 Vista de Procesos

#### Flujo Principal de Autenticación

```
Usuario → Login → Verificación de Credenciales → Generación JWT → 
Acceso a Recursos → Verificación de Permisos → Respuesta
```

#### Flujo de Registro de Asistencia

```
Empleado → Marca Entrada → Validación de Horario → Registro en BD → 
Cálculo de Horas → Actualización de Estado → Confirmación
```

#### Flujo de Procesamiento de Nómina

```
Fin de Mes → Recopilación de Datos → Cálculo de Salarios → 
Aplicación de Deducciones → Generación de Recibos → Aprobación → Pago
```

### 4.4 Vista Física

#### Entornos de Despliegue

**Desarrollo:**
```
Docker Compose Local
├── Frontend Container (React + Vite)
├── Backend Container (Node.js + Express)
├── Database Container (MySQL)
└── Redis Container (Cache)
```

**Producción:**
```
Cloud Infrastructure
├── Load Balancer (NGINX)
├── Frontend Instances (2x React Apps)
├── Backend Instances (3x Node.js APIs)
├── Database Cluster (MySQL Master + 2 Slaves)
├── Cache Layer (Redis Cluster)
└── File Storage (Cloud Storage)
```

### 4.5 Vista de Escenarios

Esta sección presenta los **casos de uso más representativos** del sistema, cada uno desarrollado siguiendo la plantilla estándar de Ingeniería de Sistemas.

#### 4.5.1 Diagrama General de Casos de Uso

```
                    SISTEMA DE GESTIÓN AGRÍCOLA
    
    Admin                          Supervisor                 Empleado
      │                               │                         │
      ├─ Gestionar Usuarios          ├─ Registrar Asistencia    ├─ Marcar Entrada/Salida
      ├─ Configurar Roles            ├─ Asignar Tareas          ├─ Consultar Mi Asistencia
      ├─ Gestionar Personal          ├─ Evaluar Rendimiento     ├─ Ver Mi Nómina
      ├─ Procesar Nómina             ├─ Generar Reportes        └─ Solicitar Permisos
      ├─ Configurar Sistema          └─ Aprobar Permisos              
      └─ Generar Reportes                      
                    │                               
              ┌─────────────────┐                  
              │ Sistema Externo │                  
              │ (Backup/Export) │                  
              └─────────────────┘                  
```

#### 4.5.2 Casos de Uso Principales (Especificaciones Detalladas)

Los siguientes casos de uso han sido seleccionados por ser los más representativos y críticos para el funcionamiento del sistema:

---

##### **CU-001: Autenticar Usuario**
- **Actor Principal:** Usuario del Sistema
- **Nivel:** Objetivo del Usuario
- **Precondiciones:** Usuario tiene credenciales válidas
- **Garantía de Éxito:** Usuario accede al sistema con permisos apropiados

##### **CU-002: Registrar Empleado**
- **Actor Principal:** Administrador/Gerente RRHH
- **Nivel:** Objetivo del Usuario
- **Precondiciones:** Usuario tiene permisos de gestión de personal
- **Garantía de Éxito:** Empleado queda registrado en el sistema

##### **CU-003: Registrar Asistencia**
- **Actor Principal:** Empleado/Supervisor
- **Nivel:** Objetivo del Usuario
- **Precondiciones:** Empleado existe en el sistema
- **Garantía de Éxito:** Asistencia queda registrada correctamente

##### **CU-004: Procesar Nómina Mensual**
- **Actor Principal:** Administrador/Contador
- **Nivel:** Objetivo del Negocio
- **Precondiciones:** Datos de asistencia completos del mes
- **Garantía de Éxito:** Nómina calculada y recibos generados

##### **CU-005: Asignar Tareas de Productividad**
- **Actor Principal:** Supervisor
- **Nivel:** Objetivo del Usuario
- **Precondiciones:** Empleados asignados a cuadrilla
- **Garantía de Éxito:** Tareas asignadas y rastreables

##### **CU-006: Generar Reporte Ejecutivo**
- **Actor Principal:** Gerente/Administrador
- **Nivel:** Objetivo del Negocio
- **Precondiciones:** Datos históricos disponibles
- **Garantía de Éxito:** Reporte generado y exportable

---

#### 4.5.3 Especificaciones Completas por Caso de Uso

*Nota: Cada caso de uso se desarrolla en un documento Word separado usando la plantilla estándar de Ingeniería de Sistemas I, y se adjunta como attachment al item correspondiente en Azure DevOps.*

#### Estructura de Archivos de Casos de Uso:

1. **CU-001_Autenticar_Usuario.docx**
2. **CU-002_Registrar_Empleado.docx**
3. **CU-003_Registrar_Asistencia.docx**
4. **CU-004_Procesar_Nomina_Mensual.docx**
5. **CU-005_Asignar_Tareas_Productividad.docx**
6. **CU-006_Generar_Reporte_Ejecutivo.docx**

#### Trazabilidad con Features de Azure DevOps:

| Caso de Uso | Feature ID | Feature Name | User Stories Relacionadas |
|---|---|---|---|
| CU-001 | *Pendiente* | Autenticación Básica | HU-026, HU-027 |
| CU-002 | 2 | Registro de personal | HU-001, HU-028 |
| CU-003 | 4 | Registro de Asistencia | HU-006, HU-007, HU-008 |
| CU-004 | 15 | Proceso de Nómina | HU-014, HU-015 |
| CU-005 | 7, 8 | Planificación/Asignación de Tareas | HU-017, HU-019 |
| CU-006 | 16, 17 | Reportes de Asistencia/Productividad | HU-020, HU-022, HU-023 |

#### Criterios de Selección de Casos de Uso:

1. **Criticidad del Negocio:** Funcionalidades esenciales para la operación
2. **Complejidad Técnica:** Casos que involucran múltiples componentes
3. **Frecuencia de Uso:** Operaciones diarias/frecuentes del sistema
4. **Riesgo de Implementación:** Casos con mayor probabilidad de fallos
5. **Valor para Stakeholders:** Funcionalidades con mayor impacto visible

---
## 7. Anexos

### 7.1 Glosario de Términos

#### Términos del Dominio Agroindustrial
- **Cuadrilla:** Grupo de trabajadores agrícolas organizados para tareas específicas
- **Parcela:** Subdivisión del terreno agrícola para cultivos específicos
- **Jornal:** Unidad de trabajo diario en el sector agrícola
- **Ciclo de Cultivo:** Periodo completo desde siembra hasta cosecha
- **Maquila:** Procesamiento de productos agrícolas por terceros

#### Términos Técnicos
- **RBAC:** Role-Based Access Control - Control de acceso basado en roles
- **JWT:** JSON Web Token - Token de autenticación web
- **SLA:** Service Level Agreement - Acuerdo de nivel de servicio
- **RPO:** Recovery Point Objective - Objetivo de punto de recuperación
- **RTO:** Recovery Time Objective - Objetivo de tiempo de recuperación
- **TPS:** Transactions Per Second - Transacciones por segundo
- **API:** Application Programming Interface - Interfaz de programación
- **ORM:** Object-Relational Mapping - Mapeo objeto-relacional

#### Términos de Recursos Humanos
- **CCSS:** Caja Costarricense de Seguro Social
- **Planilla:** Nómina o lista de empleados y salarios
- **Incapacidad:** Permiso médico temporal
- **Aguinaldo:** Décimo tercer salario en Costa Rica
- **Cesantía:** Prestación por terminación laboral
- **INS:** Instituto Nacional de Seguros

### 7.2 Matriz de Trazabilidad de Requerimientos

#### Trazabilidad Épicas → Features → User Stories

| Épica | Feature Azure DevOps | User Stories | Casos de Uso | Criterios de Aceptación |
|---|---|---|---|---|
| **Gestión de Identidad** | F1: Configuración de roles | HU-030, HU-031, HU-032 | CU-001 | Login seguro, roles definidos |
| **Administración Personal** | F2: Registro de personal | HU-001, HU-028, HU-029 | CU-002 | CRUD empleados completo |
| **Control de Asistencia** | F4: Registro de Asistencia | HU-006, HU-007, HU-008 | CU-003 | Marcado entrada/salida |
| **Gestión de Nómina** | F15: Proceso de Nómina | HU-014, HU-015 | CU-004 | Cálculo automático, recibos |
| **Control de Productividad** | F7: Planificación de Tareas | HU-017, HU-019 | CU-005 | Asignación tareas, seguimiento |
| **Inteligencia de Negocio** | F16: Reporte de Asistencia | HU-022, HU-023 | CU-006 | Reportes ejecutivos |

#### Matriz de Cobertura de Requerimientos No Funcionales

| Requerimiento No Funcional | Implementación Técnica | Métricas de Verificación |
|---|---|---|
| **Disponibilidad 99.5%** | Load balancer, redundancia DB | Uptime monitoring, alertas |
| **500 usuarios concurrentes** | Horizontal scaling, cache | Load testing, stress testing |
| **Tiempo respuesta < 200ms** | Índices DB, CDN, caching | Performance monitoring |
| **Seguridad de datos** | JWT, HTTPS, encriptación | Auditorías de seguridad |
| **Backup automático** | Scripts cron, replicación | Pruebas de recuperación |

### 7.3 Diagramas Técnicos

#### 7.3.1 Diagrama de Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Auth Module │ │ HR Module   │ │ Reports     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Attendance  │ │ Payroll     │ │ Productivity│           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                          HTTP/HTTPS
                              │
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NGINX)                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ Auth Service│ │ HR Service  │ │ Report Svc  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │Attendance Svc│ │Payroll Svc  │ │Product. Svc │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │MySQL Primary│ │Redis Cache  │ │File Storage │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐                                           │
│  │MySQL Replica│                                           │
│  └─────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

#### 7.3.2 Diagrama de Base de Datos (ER)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   USUARIOS  │    │  EMPLEADOS  │    │    CARGOS   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ email       │    │ cedula      │    │ nombre      │
│ password    │◄───┤ usuario_id  │    │ descripcion │
│ rol         │    │ cargo_id    │───►│ salario_base│
│ activo      │    │ nombre      │    │ activo      │
│ created_at  │    │ apellido    │    └─────────────┘
└─────────────┘    │ salario     │           │
                   │ activo      │           │
                   │ created_at  │           │
                   └─────────────┘           │
                           │                 │
                           ▼                 │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ ASISTENCIA  │    │DEPARTAMENTOS│    │   NOMINA    │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │◄───┤ id (PK)     │
│ empleado_id │───►│ nombre      │    │ empleado_id │
│ fecha       │    │ descripcion │    │ periodo     │
│ hora_entrada│    │ activo      │    │ salario_base│
│ hora_salida │    └─────────────┘    │ horas_extras│
│ horas_reg   │                       │ deducciones │
│ horas_extra │                       │ total_pagar │
│ estado      │                       │ estado      │
└─────────────┘                       └─────────────┘
```

#### 7.3.3 Diagrama de Flujo de Autenticación

```
Usuario Ingresa Credenciales
           │
           ▼
    ┌─────────────┐
    │ Validar     │
    │ Credenciales│
    └─────────────┘
           │
           ▼
    ┌─────────────┐      NO     ┌─────────────┐
    │ ¿Válidas?   │──────────►  │ Mostrar     │
    └─────────────┘             │ Error       │
           │ SI                  └─────────────┘
           ▼
    ┌─────────────┐
    │ Generar JWT │
    │ con Rol     │
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │ Almacenar   │
    │ en Cliente  │
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │ Redireccionar│
    │ a Dashboard │
    └─────────────┘
```

### 7.4 Configuraciones de Entorno

#### 7.4.1 Variables de Entorno - Backend

```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:3306/gestion_agricola"
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestion_agricola
DB_USER=app_user
DB_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-256-bits
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production
API_PREFIX=/api/v1

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis_password

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=system@empresa.com
SMTP_PASSWORD=email_password

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10MB

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

#### 7.4.2 Variables de Entorno - Frontend

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_API_TIMEOUT=10000

# Environment
REACT_APP_ENV=production
REACT_APP_VERSION=1.0.0

# Features Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_OFFLINE=true

# External Services
REACT_APP_MAPS_API_KEY=your-google-maps-key
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

### 7.5 Scripts de Despliegue

#### 7.5.1 Docker Compose - Desarrollo

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:3001/api/v1

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/gestion_agricola
      - JWT_SECRET=dev-secret-key
      - NODE_ENV=development
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=gestion_agricola
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

#### 7.5.2 Script de Migración de Base de Datos

```sql
-- migration_v1.0.0.sql
-- Migración inicial del sistema

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion_agricola 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_agricola;

-- Crear tablas principales
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol ENUM('ADMIN', 'GERENTE_RRHH', 'SUP_CAMPO', 'SUP_RRHH', 'EMPLEADO', 'VISUAL') DEFAULT 'EMPLEADO',
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear índices para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, password, nombre, apellido, rol) VALUES 
('admin@sistema.com', '$2b$12$hashed_password_here', 'Administrador', 'Sistema', 'ADMIN');
```

### 7.6 Documentación de APIs

#### 7.6.1 Especificación OpenAPI (Swagger)

```yaml
openapi: 3.0.0
info:
  title: Sistema de Gestión Agrícola API
  description: API para el sistema de control y planificación de mano de obra agroindustrial
  version: 1.0.0
  contact:
    name: Equipo de Desarrollo
    email: desarrollo@sistema.com

servers:
  - url: http://localhost:3000/api/v1
    description: Servidor de desarrollo
  - url: https://api.gestion-agricola.com/v1
    description: Servidor de producción

paths:
  /auth/login:
    post:
      summary: Autenticar usuario
      tags: [Autenticación]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 6
      responses:
        200:
          description: Login exitoso
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
        401:
          description: Credenciales inválidas

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        email:
          type: string
        nombre:
          type: string
        apellido:
          type: string
        rol:
          type: string
          enum: [ADMIN, GERENTE_RRHH, SUP_CAMPO, SUP_RRHH, EMPLEADO, VISUAL]
```

#### 7.6.2 Endpoints Principales por Módulo

**Módulo de Autenticación:**
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/forgot-password` - Recuperar contraseña

**Módulo de Personal:**
- `GET /empleados` - Listar empleados
- `POST /empleados` - Crear empleado
- `PUT /empleados/:id` - Actualizar empleado
- `DELETE /empleados/:id` - Eliminar empleado

**Módulo de Asistencia:**
- `POST /asistencia/entrada` - Marcar entrada
- `POST /asistencia/salida` - Marcar salida
- `GET /asistencia/empleado/:id` - Ver asistencia de empleado
- `GET /asistencia/reporte/:periodo` - Reporte de asistencia

### 7.7 Plan de Pruebas

#### 7.7.1 Estrategia de Testing

**Niveles de Prueba:**
1. **Unitarias (70%):** Funciones individuales, componentes React
2. **Integración (20%):** APIs, base de datos, servicios
3. **End-to-End (10%):** Flujos completos de usuario

**Herramientas de Testing:**
- **Frontend:** Jest, React Testing Library, Cypress
- **Backend:** Jest, Supertest, Postman
- **Base de Datos:** Prisma migrations, data seeding

#### 7.7.2 Casos de Prueba Críticos

| ID | Caso de Prueba | Tipo | Prioridad | Resultado Esperado |
|---|---|---|---|---|
| TC-001 | Login con credenciales válidas | Funcional | Alta | Usuario autenticado y redirigido |
| TC-002 | Registro de asistencia entrada | Funcional | Alta | Hora de entrada registrada |
| TC-003 | Cálculo de nómina mensual | Funcional | Alta | Nómina calculada correctamente |
| TC-004 | Generación de reporte PDF | Funcional | Media | PDF descargado exitosamente |
| TC-005 | 500 usuarios concurrentes | Performance | Alta | Sistema responde < 1s |
| TC-006 | Backup automático | Seguridad | Media | Backup completado sin errores |

### 7.8 Cronograma Detallado del Proyecto

#### 7.8.1 Hitos Principales

| Hito | Fecha | Entregables | Responsable |
|---|---|---|---|
| **H1: Setup inicial** | Semana 1 | Repositorio, DB, CI/CD | DevOps |
| **H2: Sprint 1 Demo** | Semana 3 | Login, CRUD empleados | Frontend/Backend |
| **H3: Sprint 2 Demo** | Semana 5 | Control asistencia | Backend |
| **H4: Sprint 3 Demo** | Semana 8 | Nómina básica | Backend |
| **H5: Sprint 4 Demo** | Semana 11 | Productividad | Full Stack |
| **H6: Release Final** | Semana 13 | Sistema completo | Todo el equipo |

#### 7.8.2 Dependencias Críticas

- **Diseño DB → Desarrollo Backend**
- **APIs Backend → Desarrollo Frontend**
- **Autenticación → Todos los módulos**
- **Datos de Asistencia → Cálculo de Nómina**

### 7.9 Referencias y Bibliografía

#### 7.9.1 Documentación Técnica
1. **React 18 Documentation** - https://react.dev/
2. **Node.js Best Practices** - https://github.com/goldbergyoni/nodebestpractices
3. **Prisma ORM Guide** - https://www.prisma.io/docs
4. **MySQL 8.0 Reference** - https://dev.mysql.com/doc/
5. **JWT Best Practices** - https://datatracker.ietf.org/doc/html/rfc7519

#### 7.9.2 Estándares y Metodologías
1. **Scrum Guide 2020** - https://scrumguides.org/
2. **Clean Code Principles** - Robert C. Martin
3. **RESTful API Design** - https://restfulapi.net/
4. **ISO/IEC 25010** - Calidad de software
5. **OWASP Security Guidelines** - https://owasp.org/

#### 7.9.3 Sector Agroindustrial en Costa Rica
1. **SEPSA** - Secretaría Ejecutiva de Planificación Sectorial Agropecuaria
2. **INDER** - Instituto de Desarrollo Rural
3. **MAG** - Ministerio de Agricultura y Ganadería
4. **Código de Trabajo de Costa Rica** - Ley 2
5. **Reglamento del Seguro Social** - CCSS

### 7.10 Contactos del Proyecto

#### 7.10.1 Equipo de Desarrollo

| Rol | Nombre | Email | Responsabilidades |
|---|---|---|---|
| **Project Manager** | [Nombre] | pm@proyecto.com | Coordinación general |
| **Tech Lead** | [Nombre] | tech@proyecto.com | Arquitectura técnica |
| **Frontend Lead** | [Nombre] | frontend@proyecto.com | UI/UX, React |
| **Backend Lead** | [Nombre] | backend@proyecto.com | APIs, Base de datos |
| **QA Lead** | [Nombre] | qa@proyecto.com | Testing, Calidad |

#### 7.10.2 Stakeholders

| Rol | Organización | Email | Interés |
|---|---|---|---|
| **Product Owner** | Universidad Nacional | po@una.cr | Requerimientos funcionales |
| **Usuario Experto** | Empresa Agrícola | experto@empresa.com | Validación de dominio |
| **Evaluador Académico** | UNA - Informática | evaluador@una.cr | Calificación del proyecto |

---

**Documento de Arquitectura del Sistema**  
**Universidad Nacional de Costa Rica**  
**Escuela de Informática**  
**Versión:** 2.0  
**Fecha:** Diciembre 2024  
**Total de páginas:** [Automático]
