# UNIVERSIDAD NACIONAL DE COSTA RICA
## ESCUELA DE INFORMATICA
### Cátedra Ingeniería de Sistemas

---

# Documento de la Arquitectura del Sistema

## Sistema de Gestión Agrícola
**Número de Proyecto:** SGA-2025-001

### Integrantes:
- [Nombre del Estudiante 1]
- [Nombre del Estudiante 2] 
- [Nombre del Estudiante 3]
- [Nombre del Estudiante 4]

**Versión 1.0**

---

## Historial de Revisiones

| Fecha | Versión | Descripción | Autor |
|-------|---------|-------------|--------|
| 28/07/2025 | 1.0 | Creación inicial del documento | [Administrador de Arquitectura] |
|       |     |             |        |

---

## Tabla de Contenido

- [UNIVERSIDAD NACIONAL DE COSTA RICA](#universidad-nacional-de-costa-rica)
  - [ESCUELA DE INFORMATICA](#escuela-de-informatica)
    - [Cátedra Ingeniería de Sistemas](#cátedra-ingeniería-de-sistemas)
- [Documento de la Arquitectura del Sistema](#documento-de-la-arquitectura-del-sistema)
  - [Sistema de Gestión Agrícola](#sistema-de-gestión-agrícola)
    - [Integrantes:](#integrantes)
  - [Historial de Revisiones](#historial-de-revisiones)
  - [Tabla de Contenido](#tabla-de-contenido)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
  - [1. Introducción](#1-introducción)
    - [1.1 Propósito](#11-propósito)
    - [1.2 Alcance del documento de arquitectura](#12-alcance-del-documento-de-arquitectura)
    - [1.3 Documentos relacionados](#13-documentos-relacionados)
  - [2. Consideraciones y Limitaciones](#2-consideraciones-y-limitaciones)
    - [2.1 Plataforma técnica](#21-plataforma-técnica)
    - [2.2 Portabilidad](#22-portabilidad)
    - [2.3 Seguridad](#23-seguridad)
      - [2.3.1 Controles sobre la composición y asignación del password (políticas de seguridad)](#231-controles-sobre-la-composición-y-asignación-del-password-políticas-de-seguridad)
      - [2.3.2 Registro de usuarios nuevos](#232-registro-de-usuarios-nuevos)
      - [2.3.3 Control de acceso de los usuarios y los componentes del sistema](#233-control-de-acceso-de-los-usuarios-y-los-componentes-del-sistema)
      - [2.3.4 Bitácoras de transacciones](#234-bitácoras-de-transacciones)
    - [2.4 Confiabilidad/Disponibilidad](#24-confiabilidaddisponibilidad)
    - [2.5 Desempeño](#25-desempeño)
      - [2.5.1 Requisitos de desempeño](#251-requisitos-de-desempeño)
      - [2.5.2 Volumen transaccional](#252-volumen-transaccional)
  - [3. Representación de la arquitectura](#3-representación-de-la-arquitectura)
    - [3.1 Estilo de Arquitectura a implementar en el proyecto](#31-estilo-de-arquitectura-a-implementar-en-el-proyecto)
    - [3.2 Vista descomposición en Subsistemas o Módulos](#32-vista-descomposición-en-subsistemas-o-módulos)
    - [3.3 Backlog actualizado del Sistema](#33-backlog-actualizado-del-sistema)
  - [4. Vistas del Sistema](#4-vistas-del-sistema)
    - [4.1 Vista Lógica](#41-vista-lógica)
      - [4.1.1 Organización por Características (Features)](#411-organización-por-características-features)
      - [4.1.2 Flujo de Datos por Característica](#412-flujo-de-datos-por-característica)
      - [4.1.3 Modelo de Datos por Dominio](#413-modelo-de-datos-por-dominio)
    - [4.2 Vista de desarrollo o implementación](#42-vista-de-desarrollo-o-implementación)
    - [4.3 Vista de Procesos](#43-vista-de-procesos)
    - [4.4 Vista Física](#44-vista-física)
    - [4.5 Vista Escenarios](#45-vista-escenarios)
  - [5. Anexos](#5-anexos)

---

# Arquitectura del Sistema

## 1. Introducción

### 1.1 Propósito

El propósito de este documento es resumir la arquitectura del Sistema de Gestión Agrícola, proporcionando una visión integral de los componentes técnicos, patrones arquitectónicos y decisiones de diseño que sustentan el desarrollo del sistema.

### 1.2 Alcance del documento de arquitectura

Identificar los elementos técnicos requeridos para el desarrollo integral del proyecto de software denominado **Sistema de Gestión Agrícola** el cual será implementado para empresas del sector agrícola que requieren una gestión integral de personal, asistencia, nómina, productividad y reportes.

### 1.3 Documentos relacionados

Para la elaboración de este documento de Arquitectura del Sistema, se utilizaron como base y referencia los siguientes documentos:

| Código | Descripción | Anexo |
|--------|-------------|--------|
| SGA-REQ-001 | Documento de Requerimientos del Sistema | A |
| SGA-DIS-001 | Documento de Diseño de Base de Datos | B |
| SGA-API-001 | Especificación de API REST | C |

## 2. Consideraciones y Limitaciones

En este apartado se presentan los requerimientos técnicos y condiciones especiales que serán consideradas en el desarrollo e implementación del Sistema. Se tratan los requisitos no funcionales relacionados con la ejecución, disponibilidad, tolerancia a fallos, integridad, etc.

### 2.1 Plataforma técnica

El Sistema de Gestión Agrícola se desarrollará utilizando las siguientes tecnologías:

**Frontend:**
- React 18.2+ con TypeScript para la interfaz de usuario
- React Router DOM para navegación
- Axios para comunicación HTTP
- Material-UI o Tailwind CSS para componentes de interfaz

**Backend:**
- Node.js 16+ con TypeScript para el servidor
- Express.js como framework web
- JWT para autenticación y autorización
- Bcrypt para encriptación de contraseñas
- Winston para logging del sistema
- Joi para validación de datos

**Base de Datos:**
- MySQL 8.0+ como motor de base de datos principal
- Uso de MySQL2 como driver de conexión

**Herramientas de Desarrollo:**
- Visual Studio Code como IDE principal
- Git para control de versiones
- ESLint y Prettier para calidad de código
- Jest para testing
- Nodemon para desarrollo en tiempo real

### 2.2 Portabilidad

El Sistema de Gestión Agrícola está diseñado para ejecutarse en múltiples plataformas:

**Sistemas Operativos Soportados:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, CentOS 7+)

**Acceso al Sistema:**
- **Aplicación Web:** Compatible con navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Diseño Responsivo:** Adaptable a dispositivos móviles (tablets y smartphones)
- **API REST:** Permite integración con aplicaciones móviles nativas futuras

**Deployment:**
- Soporte para contenedores Docker
- Compatible con servicios cloud (AWS, Azure, Google Cloud)
- Posibilidad de instalación on-premise

### 2.3 Seguridad

El sistema implementa múltiples capas de seguridad para proteger la información sensible del personal y las operaciones empresariales.

#### 2.3.1 Controles sobre la composición y asignación del password (políticas de seguridad)

**Políticas de Contraseña:**
- Mínimo 8 caracteres
- Debe contener al menos: una mayúscula, una minúscula, un número y un carácter especial
- Renovación obligatoria cada 90 días para usuarios administrativos
- Renovación cada 180 días para usuarios operativos
- Historial de últimas 5 contraseñas para evitar reutilización
- Bloqueo de cuenta después de 5 intentos fallidos
- Recuperación mediante token temporal enviado por email

#### 2.3.2 Registro de usuarios nuevos

**Proceso de Registro:**
- Solo usuarios con rol "Administrador" pueden crear nuevos usuarios
- Validación de datos únicos (email, cédula)
- Asignación automática de rol "Empleado" por defecto
- Envío de credenciales temporales por email
- Obligación de cambio de contraseña en primer acceso
- Activación manual de cuenta por administrador

#### 2.3.3 Control de acceso de los usuarios y los componentes del sistema

**Roles del Sistema:**
- **Administrador:** Control total del sistema y configuraciones
- **Gerente/Jefe RRHH:** Gestión completa de nómina y personal
- **Supervisor de Campo:** Control operativo de trabajo agrícola
- **Supervisor RRHH:** Revisión y ajustes de nómina
- **Empleado:** Acceso limitado a sus propios datos
- **Visualizador:** Solo consulta sin modificaciones

**Matriz Detallada de Permisos por Funcionalidad:**

| **GESTIÓN DE PERSONAL** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|-------------------------|-------|--------------|-----------|----------|----------|--------|
| HU-001: Crear trabajador | ✓ | ✓ | - | - | - | - |
| HU-002: Asignar info laboral | ✓ | ✓ | - | - | - | - |
| HU-003: Crear cuadrilla | ✓ | ✓ | ✓ | - | - | - |
| HU-004: Asignar a cuadrilla | ✓ | ✓ | ✓ | - | - | - |
| HU-005: Crear roles | ✓ | - | - | - | - | - |
| HU-006: Asignar roles | ✓ | - | - | - | - | - |

| **CONTROL DE ASISTENCIA** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|---------------------------|-------|--------------|-----------|----------|----------|--------|
| HU-007: Registrar entrada | ✓ | ✓ | ✓ | ✓ | Solo propio | - |
| HU-008: Registrar salida | ✓ | ✓ | ✓ | ✓ | Solo propio | - |
| HU-010: Ausencia justificada | ✓ | ✓ | ✓ | ✓ | Solo propio | - |
| Consultar asistencia | ✓ | ✓ | ✓ | ✓ | Solo propio | ✓ |

| **GESTIÓN AGRÍCOLA** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|----------------------|-------|--------------|-----------|----------|----------|--------|
| HU-014: Crear tipo cultivo | ✓ | - | ✓ | - | - | - |
| HU-015: Crear tarea cultivo | ✓ | - | ✓ | - | - | - |
| HU-016: Registrar parcela | ✓ | - | ✓ | - | - | - |
| HU-017: Asignar cultivo | ✓ | - | ✓ | - | - | - |

| **CONTROL PRODUCTIVIDAD** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|---------------------------|-------|--------------|-----------|----------|----------|--------|
| HU-009: Registrar productividad | ✓ | ✓ | ✓ | - | Solo propio | - |
| HU-011: Crear tarea programada | ✓ | ✓ | ✓ | - | - | - |
| HU-012: Asignar tarea | ✓ | ✓ | ✓ | - | - | - |
| HU-013: Condiciones trabajo | ✓ | ✓ | ✓ | - | - | - |

| **GESTIÓN DE NÓMINA** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|-----------------------|-------|--------------|-----------|----------|----------|--------|
| HU-018: Crear esquema pago | ✓ | ✓ | - | - | - | - |
| HU-019: Fórmula cálculo | ✓ | ✓ | - | - | - | - |
| HU-020: Asignar esquema | ✓ | ✓ | - | - | - | - |
| HU-021: Crear bonificación | ✓ | ✓ | - | - | - | - |
| HU-022: Iniciar período | ✓ | ✓ | - | - | - | - |
| HU-023: Generar preliquidación | ✓ | ✓ | - | ✓ | - | - |
| HU-024: Revisar nómina | ✓ | ✓ | - | ✓ | - | - |
| HU-025: Ajustar datos | ✓ | ✓ | - | ✓ | - | - |
| HU-026: Aprobar nómina | ✓ | ✓ | - | - | - | - |
| HU-027: Generar recibo | ✓ | ✓ | - | ✓ | Solo propio | - |
| HU-028: Deducción especial | ✓ | ✓ | - | - | - | - |

| **GESTIÓN DE REPORTES** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|-------------------------|-------|--------------|-----------|----------|----------|--------|
| HU-029: Reporte asistencia | ✓ | ✓ | ✓ | ✓ | Solo propio | ✓ |
| HU-030: Reporte productividad | ✓ | ✓ | ✓ | ✓ | Solo propio | ✓ |
| HU-031: Historial pagos | ✓ | ✓ | - | ✓ | Solo propio | - |
| HU-032: Exportar datos | ✓ | ✓ | - | - | - | - |

| **ADMINISTRACIÓN SISTEMA** | Admin | Gerente RRHH | Sup.Campo | Sup.RRHH | Empleado | Visual |
|----------------------------|-------|--------------|-----------|----------|----------|--------|
| Configuración general | ✓ | - | - | - | - | - |
| Gestión usuarios | ✓ | - | - | - | - | - |
| Respaldos y logs | ✓ | - | - | - | - | - |

#### 2.3.4 Bitácoras de transacciones

**Registro de Auditoría:**
- Todas las operaciones CRUD se registran con: usuario, fecha/hora, IP, acción realizada
- Logs de acceso exitoso y fallido al sistema
- Registro de cambios en información sensible (salarios, datos personales)
- Backup automático de logs cada 24 horas
- Retención de logs por 12 meses para auditorías
- Logs a nivel de aplicación (Winston) y base de datos (triggers)

### 2.4 Confiabilidad/Disponibilidad

**Objetivos de Disponibilidad:**
- 99.5% de tiempo de actividad durante horario laboral (6:00 AM - 6:00 PM)
- 98% de disponibilidad en horario nocturno
- Tiempo máximo de recuperación (RTO): 4 horas
- Punto máximo de recuperación (RPO): 1 hora

**Mecanismos de Confiabilidad:**
- Backup automático diario de base de datos
- Validación de integridad de datos en cada transacción
- Manejo de errores con reintentos automáticos
- Logs detallados para diagnóstico de problemas
- Monitoreo de recursos del servidor

### 2.5 Desempeño

#### 2.5.1 Requisitos de desempeño

**Tiempo de Respuesta:**
- Consultas simples: < 2 segundos
- Generación de reportes: < 10 segundos
- Carga de páginas: < 3 segundos
- Operaciones de cálculo de nómina: < 30 segundos

**Concurrencia:**
- Soporte para 50 usuarios concurrentes
- Máximo 100 sesiones activas simultáneas
- Rate limiting: 100 requests por minuto por usuario

#### 2.5.2 Volumen transaccional

**Estimaciones Mensuales:**
- Registros de asistencia: 2,200 (50 empleados x 22 días x 2 marcajes)
- Consultas de información: 5,000 requests
- Generación de reportes: 200 reportes
- Cálculos de nómina: 50 procesamiento mensuales
- Respaldos de datos: 30 backups automáticos

**Crecimiento Proyectado:**
- Incremento del 20% anual en número de empleados
- Incremento del 30% anual en consultas del sistema
- Capacidad para escalar hasta 200 empleados

## 3. Representación de la arquitectura

### 3.1 Estilo de Arquitectura a implementar en el proyecto

**Patrón Arquitectónico Seleccionado: Screaming Architecture (Clean Architecture por Dominios)**

**Justificación:**
La Screaming Architecture es la más adecuada para el Sistema de Gestión Agrícola debido a:

1. **Organización por Dominio de Negocio:** El código se organiza por funcionalidades del negocio agrícola (personal, asistencia, nómina), no por capas técnicas
2. **Autonomía de Módulos:** Cada característica es independiente y puede desarrollarse/mantenerse por separado
3. **Escalabilidad Funcional:** Fácil agregar nuevas características agrícolas sin afectar las existentes
4. **Legibilidad del Negocio:** La estructura del código "grita" qué hace el sistema (gestión agrícola)
5. **Testabilidad Superior:** Cada dominio puede testearse independientemente
6. **Preparación para Microservicios:** Cada módulo puede convertirse en microservicio si es necesario

**Representación Gráfica:**

```
┌─────────────────────────────────────────────────────────────┐
│                    SCREAMING ARCHITECTURE                   │
│              (Organización por Dominios de Negocio)        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  AUTENTICACIÓN  │  │ GESTIÓN PERSONAL│  │CONTROL ASISTENCIA│
│                 │  │                 │  │                 │
│ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │
│ │Components   │ │  │ │Components   │ │  │ │Components   │ │
│ │Services     │ │  │ │Services     │ │  │ │Services     │ │
│ │Controllers  │ │  │ │Controllers  │ │  │ │Controllers  │ │
│ │Models       │ │  │ │Models       │ │  │ │Models       │ │
│ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ GESTIÓN NÓMINA  │  │CONTROL PRODUCTIV│  │GESTIÓN REPORTES │
│                 │  │                 │  │                 │
│ ┌─────────────┐ │  │ ┌─────────────┐ │  │ ┌─────────────┐ │
│ │Components   │ │  │ │Components   │ │  │ │Components   │ │
│ │Services     │ │  │ │Services     │ │  │ │Services     │ │
│ │Controllers  │ │  │ │Controllers  │ │  │ │Controllers  │ │
│ │Models       │ │  │ │Models       │ │  │ │Models       │ │
│ └─────────────┘ │  │ └─────────────┘ │  │ └─────────────┘ │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUCTURA COMPARTIDA              │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Base Datos  │  │    Auth     │  │   Logging   │         │
│  │   MySQL     │  │ Middleware  │  │  Winston    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Vista descomposición en Subsistemas o Módulos

Esta vista muestra los Subsistemas o Módulos en los que se divide la aplicación y la funcionalidad que brinda dentro de cada uno de ellos.

**Diagrama de Módulos del Sistema:**

```
┌─────────────────────────────────────────────────────────────┐
│                SISTEMA DE GESTIÓN AGRÍCOLA                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Autenticación│  │   Gestión   │  │   Control   │         │
│  │      y       │  │   Personal  │  │ Asistencia  │         │
│  │Autorización  │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Gestión   │  │   Control   │  │   Gestión   │         │
│  │   Nómina    │  │Productividad│  │  Reportes   │         │
│  │             │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Descripción de Subsistemas:**

**Módulo de Autenticación y Autorización:**
- Gestión de usuarios del sistema
- Login/logout con JWT
- Control de acceso por roles (Administrador, Supervisor, Empleado, Visualizador)
- Recuperación de contraseñas
- Gestión de sesiones activas

**Módulo de Gestión de Personal:**
- Registro y edición de trabajadores (HU-001, HU-002)
- Creación y gestión de cuadrillas de trabajo (HU-003, HU-004)
- Asignación de roles y permisos de usuario (HU-005, HU-006)
- Consulta de información personal
- Historial laboral y expedientes

**Módulo de Control de Asistencia:**
- Registro de entrada y salida de trabajadores (HU-007, HU-008)
- Control de horarios de trabajo
- Gestión de ausencias justificadas (HU-010)
- Cálculo de horas trabajadas
- Seguimiento de puntualidad

**Módulo de Gestión Agrícola:**
- Creación y gestión de tipos de cultivos (HU-014)
- Definición de tareas específicas por cultivo (HU-015)
- Registro y administración de parcelas (HU-016)
- Asignación de cultivos a parcelas (HU-017)
- Planificación de actividades agrícolas

**Módulo de Control de Productividad:**
- Registro de productividad por trabajador (HU-009)
- Creación y asignación de tareas programadas (HU-011, HU-012)
- Registro de condiciones generales de trabajo (HU-013)
- Seguimiento de metas y objetivos
- Evaluaciones de rendimiento

**Módulo de Gestión de Nómina:**
- Creación de esquemas de pago y fórmulas (HU-018, HU-019, HU-020)
- Gestión de bonificaciones (HU-021)
- Procesamiento de períodos de nómina (HU-022, HU-023)
- Revisión y ajuste de cálculos (HU-024, HU-025)
- Aprobación y generación de recibos (HU-026, HU-027)
- Gestión de deducciones especiales (HU-028)

**Módulo de Gestión de Reportes:**
- Reportes de asistencia por período (HU-029)
- Reportes de productividad (HU-030)
- Consulta de historial de pagos (HU-031)
- Exportación de datos de nómina (HU-032)
- Análisis comparativo y tendencias

### 3.3 Backlog actualizado del Sistema

**Épicas y Product Backlog Items (PBIs) - 32 Historias de Usuario:**

**ÉPICA 1: Gestión de Personal y Usuarios (6 HU)**
- HU-001: Crear registro de trabajador
- HU-002: Asignar información laboral al trabajador
- HU-003: Crear cuadrilla de trabajo
- HU-004: Asignar trabajadores a cuadrilla
- HU-005: Crear roles de usuario
- HU-006: Asignar rol a usuario

**ÉPICA 2: Control de Asistencia (3 HU)**
- HU-007: Registrar entrada de trabajador
- HU-008: Registrar salida de trabajador
- HU-010: Registrar ausencia justificada

**ÉPICA 3: Gestión Agrícola y Parcelas (4 HU)**
- HU-014: Crear tipo de cultivo
- HU-015: Crear tarea específica para cultivo
- HU-016: Registrar parcela agrícola
- HU-017: Asignar cultivo a parcela

**ÉPICA 4: Control de Productividad y Tareas (4 HU)**
- HU-009: Registrar productividad de trabajador
- HU-011: Crear tarea programada
- HU-012: Asignar tarea a cuadrilla o trabajador
- HU-013: Registrar condiciones generales de trabajo

**ÉPICA 5: Gestión de Nómina y Pagos (11 HU)**
- HU-018: Crear esquema de pago
- HU-019: Seleccionar fórmula de cálculo
- HU-020: Asignar esquema de pago a tarea
- HU-021: Crear bonificación
- HU-022: Iniciar período de nómina
- HU-023: Generar preliquidación
- HU-024: Revisar nómina individual
- HU-025: Ajustar datos en nómina
- HU-026: Aprobar nómina
- HU-027: Generar recibo individual
- HU-028: Registrar deducción especial

**ÉPICA 6: Generación de Reportes y Consultas (4 HU)**
- HU-029: Generar reporte de asistencia
- HU-030: Generar reporte de productividad
- HU-031: Consultar historial de cálculos de pagos
- HU-032: Exportar datos de nómina

**Resumen del Backlog:**
- **Total: 32 Historias de Usuario**
- **6 Épicas** organizadas por dominio funcional
- **Prioridad Alta:** Épicas 1, 2 y 5 (funcionalidad core)
- **Prioridad Media:** Épicas 3 y 4 (funcionalidad específica agrícola)
- **Prioridad Baja:** Épica 6 (reportes y consultas)

## 4. Vistas del Sistema

Esta sección describe las partes de la arquitectura más significativas del modelo de diseño utilizando como base el modelo 4+1 de Kruchten: Vista lógica, vista de despliegue (o de desarrollo), vista de procesos, vista física y escenarios.

### 4.1 Vista Lógica

En esta vista se representa la funcionalidad que el sistema proporcionará a los usuarios finales, organizada por dominios de negocio siguiendo los principios de Screaming Architecture.

#### 4.1.1 Organización por Características (Features)

La aplicación se organiza por características de negocio, donde cada módulo contiene toda la funcionalidad relacionada:

**Estructura por Dominios:**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND REACT                           │
├─────────────────────────────────────────────────────────────┤
│ src/caracteristicas/                                        │
│ ├── autenticacion/                                          │
│ │   ├── componentes/      (LoginForm, RegisterForm)         │
│ │   ├── servicios/        (authService, userService)        │
│ │   ├── hooks/            (useAuth, useLogin)               │
│ │   └── tipos/            (User, AuthState)                 │
│ │                                                           │
│ ├── gestion-personal/                                       │
│ │   ├── componentes/      (ListaEmpleados, FormEmpleado)    │
│ │   ├── servicios/        (personalService, cargoService)   │
│ │   ├── hooks/            (useEmpleados, useCargos)         │
│ │   └── tipos/            (Empleado, Cargo)                 │
│ │                                                           │
│ └── [otros módulos...]                                      │
│                                                             │
│ compartido/                                                 │
│ ├── componentes/         (Button, Modal, Table)             │
│ ├── utilidades/          (formatters, validators)           │
│ └── tipos/               (ApiResponse, PaginatedResult)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BACKEND NODE.JS                          │
├─────────────────────────────────────────────────────────────┤
│ src/caracteristicas/                                        │
│ ├── auth/                                                   │
│ │   ├── controladores/    (AuthController, UserController)  │
│ │   ├── servicios/        (AuthService, TokenService)       │
│ │   ├── repositorios/     (UserRepository, RoleRepository)  │
│ │   ├── modelos/          (User, Role, Session)             │
│ │   └── rutas/            (authRoutes, userRoutes)          │
│ │                                                           │
│ ├── personal/                                               │
│ │   ├── controladores/    (PersonalController)              │
│ │   ├── servicios/        (PersonalService, CargoService)   │
│ │   ├── repositorios/     (EmpleadoRepository)              │
│ │   ├── modelos/          (Empleado, Cargo, Departamento)   │
│ │   └── rutas/            (personalRoutes)                  │
│ │                                                           │
│ └── [otros módulos...]                                      │
│                                                             │
│ compartido/                                                 │
│ ├── utilidades/          (helpers, formatters)             │
│ ├── middleware/          (auth, validation, logging)        │
│ └── tipos/               (BaseEntity, ApiResponse)          │
└─────────────────────────────────────────────────────────────┘
```

#### 4.1.2 Flujo de Datos por Característica

Cada característica maneja su propio flujo de datos de forma independiente:

```
Frontend Feature          Backend Feature           Database
┌─────────────────┐       ┌─────────────────┐      ┌─────────────┐
│   Component     │──────▶│   Controller    │─────▶│   Table     │
│                 │       │                 │      │             │
│   Service       │◀─────▶│   Service       │◀────▶│   Schema    │
│                 │       │                 │      │             │
│   Hook/State    │       │   Repository    │      │   Relations │
└─────────────────┘       └─────────────────┘      └─────────────┘
```

#### 4.1.3 Modelo de Datos por Dominio

Cada dominio tiene sus entidades específicas con relaciones bien definidas:

**Modelo Entidad-Relación por Características:**

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTENTICACIÓN                            │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                  │
│  │Usuario  │────│  Rol    │────│Permiso  │                  │
│  │- id     │ N:1│- id     │1:N │- id     │                  │
│  │- email  │    │- nombre │    │- nombre │                  │
│  │- pass   │    │- activo │    │- recurso│                  │
│  └─────────┘    └─────────┘    └─────────┘                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  GESTIÓN PERSONAL                           │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                  │
│  │Empleado │────│  Cargo  │────│Depto    │                  │
│  │- id     │ N:1│- id     │N:1 │- id     │                  │
│  │- cedula │    │- nombre │    │- nombre │                  │
│  │- nombre │    │- salario│    │- jefe   │                  │
│  └─────────┘    └─────────┘    └─────────┘                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 CONTROL ASISTENCIA                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                  │
│  │Registro │────│Empleado │────│Horario  │                  │
│  │- id     │ N:1│- id     │1:N │- id     │                  │
│  │- fecha  │    │         │    │- entrada│                  │
│  │- entrada│    │         │    │- salida │                  │
│  │- salida │    │         │    │         │                  │
│  └─────────┘    └─────────┘    └─────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Vista de desarrollo o implementación

Esta vista representa la organización del código siguiendo Screaming Architecture, donde los componentes se organizan por características de negocio:

**Diagrama de Componentes por Características:**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │AUTENTICACIÓN│ │GESTION      │ │CONTROL      │             │
│ │             │ │PERSONAL     │ │ASISTENCIA   │             │
│ │• Login      │ │• Empleados  │ │• Registro   │             │
│ │• Register   │ │• Cargos     │ │• Horarios   │             │
│ │• Profile    │ │• Departam.  │ │• Permisos   │             │
│ │• Roles      │ │• Historial  │ │• Reportes   │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │GESTION      │ │CONTROL      │ │GESTION      │             │
│ │NOMINA       │ │PRODUCTIVIDAD│ │REPORTES     │             │
│ │• Salarios   │ │• Tareas     │ │• Generador  │             │
│ │• Horas      │ │• Metas      │ │• Exportar   │             │
│ │• Recibos    │ │• Evaluacion │ │• Filtros    │             │
│ │• Deduccion  │ │• Indicadores│ │• Templates  │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 COMPARTIDO                              │ │
│ │ • Componentes UI (Button, Modal, Table, Form)          │ │
│ │ • Hooks comunes (useApi, usePagination)                │ │
│ │ • Utilidades (formatters, validators, helpers)         │ │
│ │ • Tipos compartidos (ApiResponse, PaginatedData)       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │AUTH MODULE  │ │PERSONAL     │ │ASISTENCIA   │             │
│ │             │ │MODULE       │ │MODULE       │             │
│ │• Controller │ │• Controller │ │• Controller │             │
│ │• Service    │ │• Service    │ │• Service    │             │
│ │• Repository │ │• Repository │ │• Repository │             │
│ │• Models     │ │• Models     │ │• Models     │             │
│ │• Routes     │ │• Routes     │ │• Routes     │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │NOMINA       │ │PRODUCTIVIDAD│ │REPORTES     │             │
│ │MODULE       │ │MODULE       │ │MODULE       │             │
│ │• Controller │ │• Controller │ │• Controller │             │
│ │• Service    │ │• Service    │ │• Service    │             │
│ │• Repository │ │• Repository │ │• Repository │             │
│ │• Models     │ │• Models     │ │• Models     │             │
│ │• Routes     │ │• Routes     │ │• Routes     │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 INFRAESTRUCTURA                         │ │
│ │ • Database (MySQL connection, migrations)               │ │
│ │ • Auth Middleware (JWT, permissions)                    │ │
│ │ • Logging (Winston, error handling)                     │ │
│ │ • Validation (Joi schemas, sanitization)                │ │
│ │ • Server (Express config, CORS, security)               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BASE DE DATOS (MySQL)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │Esquemas por │ │Índices      │ │Triggers     │             │
│ │Característica│ │Optimizados  │ │Auditoría    │             │
│ │             │ │             │ │             │             │
│ │• auth_*     │ │• Performance│ │• Logs       │             │
│ │• personal_* │ │• Búsquedas  │ │• Validación │             │
│ │• asist_*    │ │• Relaciones │ │• Integridad │             │
│ │• nomina_*   │ │             │ │             │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

**Ventajas de esta Organización:**

✅ **Cohesión Alta:** Todo lo relacionado con una característica está junto
✅ **Acoplamiento Bajo:** Las características son independientes entre sí  
✅ **Desarrollo Paralelo:** Equipos pueden trabajar en características diferentes
✅ **Testing Fácil:** Cada módulo se puede testear independientemente
✅ **Escalabilidad:** Fácil convertir características en microservicios

### 4.3 Vista de Procesos

Esta vista muestra la interacción dinámica entre los componentes del sistema durante la ejecución:

**Diagrama de Secuencia - Proceso de Login:**

```
Usuario    Frontend    Backend    Database
  │          │          │          │
  │─Register─│          │          │
  │          │          │          │
  │          │─login────│          │
  │          │          │          │
  │          │          │─verify───│
  │          │          │          │
  │          │          │←─user────│
  │          │          │          │
  │          │←─token───│          │
  │          │          │          │
  │←─success─│          │          │
  │          │          │          │
```

### 4.4 Vista Física

Esta vista representa la topología física del sistema y su despliegue:

**Diagrama de Despliegue:**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE                              │
│  ┌─────────────────────────────────────────────────────┐│
│  │              Navegador Web                          ││
│  │         (Chrome, Firefox, Safari)                   ││
│  │                                                     ││
│  │  ┌─────────────────────────────────────────────────┐││
│  │  │           React Application                     │││
│  │  └─────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 SERVIDOR WEB                            │
│  ┌─────────────────────────────────────────────────────┐│
│  │            Node.js + Express                        ││
│  │                                                     ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ││
│  │  │   API REST  │  │    Auth     │  │   Logging   │  ││
│  │  │   Endpoints │  │ Middleware  │  │  (Winston)  │  ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                              │ TCP/IP
                              ▼
┌─────────────────────────────────────────────────────────┐
│               SERVIDOR DE BASE DE DATOS                 │
│  ┌─────────────────────────────────────────────────────┐│
│  │                   MySQL 8.0+                       ││
│  │                                                     ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ││
│  │  │  Esquemas   │  │   Índices   │  │   Triggers  │  ││
│  │  │    de BD    │  │             │  │             │  ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 4.5 Vista Escenarios

Esta sección presenta los casos de uso más representativos del sistema:

**Diagrama de Casos de Uso Principal:**

```
                    Sistema de Gestión Agrícola

      ┌─────────────┐                           ┌─────────────┐
      │Administrador│                           │  Empleado   │
      └──────┬──────┘                           └──────┬──────┘
             │                                         │
             │                                         │
    ┌────────▼────────┐                       ┌────────▼────────┐
    │ Gestionar       │                       │ Marcar          │
    │ Personal        │                       │ Asistencia      │
    └─────────────────┘                       └─────────────────┘
             │                                         │
    ┌────────▼────────┐                       ┌────────▼────────┐
    │ Procesar        │                       │ Consultar       │
    │ Nómina          │                       │ Información     │
    └─────────────────┘                       └─────────────────┘
             │
    ┌────────▼────────┐          ┌─────────────┐
    │ Generar         │          │ Supervisor  │
    │ Reportes        │          └──────┬──────┘
    └─────────────────┘                 │
                                ┌───────▼───────┐
                                │ Evaluar       │
                                │ Productividad │
                                └───────────────┘
```

**Casos de Uso Principales:**

1. **CU-001: Gestionar Personal**
   - Actor: Administrador
   - Descripción: Permite registrar, editar y consultar información de empleados

2. **CU-002: Control de Asistencia**
   - Actor: Empleado
   - Descripción: Registro de entrada y salida del personal

3. **CU-003: Procesar Nómina**
   - Actor: Administrador
   - Descripción: Cálculo y generación de nómina mensual

4. **CU-004: Generar Reportes**
   - Actor: Administrador, Supervisor
   - Descripción: Generación de reportes de gestión

5. **CU-005: Evaluar Productividad**
   - Actor: Supervisor
   - Descripción: Seguimiento y evaluación del rendimiento

## 5. Anexos

**Anexo A:** Documento de Requerimientos del Sistema
**Anexo B:** Documento de Diseño de Base de Datos  
**Anexo C:** Especificación de API REST
**Anexo D:** Diagramas UML Detallados
**Anexo E:** Manual de Instalación y Configuración

---

**Fecha de Elaboración:** 28 de Julio, 2025
**Elaborado por:** [Administrador de la Arquitectura]
**Revisado por:** [Líder Técnico]
**Aprobado por:** [Product Owner]
