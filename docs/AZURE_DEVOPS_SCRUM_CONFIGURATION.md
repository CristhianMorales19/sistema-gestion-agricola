# Configuración Azure DevOps con Scrum - Sistema de Gestión Agrícola

**Universidad Nacional de Costa Rica**  
**Proyecto:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Metodología:** Scrum con Azure DevOps  
**Fecha:** Agosto 2025

---

## 📋 Índice
1. [Configuración Inicial Azure DevOps](#configuración-inicial-azure-devops)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración de Work Items](#configuración-de-work-items)
4. [División de Épicas y Features](#división-de-épicas-y-features)
5. [Configuración de Sprints](#configuración-de-sprints)
6. [Work Items por Sprint](#work-items-por-sprint)
7. [Configuración de Boards](#configuración-de-boards)
8. [Métricas y Reportes](#métricas-y-reportes)

---

## 🚀 Configuración Inicial Azure DevOps

### **1. Crear Organización y Proyecto**
```
Organización: [Tu-Organización]
Proyecto: sistema-gestion-agricola
Template: Scrum
Visibilidad: Private
Región: Central US (recomendado para Latinoamérica)
```

### **2. Configurar Team Settings**
- **Team Name:** Team Agrícola
- **Area Path:** sistema-gestion-agricola
- **Default Iteration:** sistema-gestion-agricola
- **Working Days:** Lunes a Viernes
- **Working Hours:** 8:00 AM - 5:00 PM (Costa Rica UTC-6)

### **3. Configurar Process Template**
- Usar **Scrum Process Template**
- Personalizar campos según necesidades específicas

---

## 🏗️ Estructura del Proyecto

### **Jerarquía de Work Items**
```
ÉPICAS (6 épicas principales)
├── FEATURES (18 features funcionales)
    ├── USER STORIES (32 historias de usuario)
        ├── TASKS (Tareas de desarrollo)
        └── BUGS (Defectos identificados)
```

### **Área Paths Configuradas**
```
sistema-gestion-agricola\
├── Frontend\
│   ├── Autenticacion
│   ├── Personal
│   ├── Asistencia
│   ├── Nomina
│   ├── Productividad
│   └── Reportes
├── Backend\
│   ├── API
│   ├── Autenticacion
│   ├── Base-Datos
│   └── Servicios
└── DevOps\
    ├── CI-CD
    ├── Testing
    └── Deployment
```

---

## 📝 Configuración de Work Items

### **Epic Template**
- **Title:** [Nombre descriptivo de la épica]
- **Area Path:** sistema-gestion-agricola
- **Priority:** 1-4 (1 = Más alta)
- **Value Area:** Business
- **Tags:** epic, [módulo]
- **Acceptance Criteria:** Criterios de épica completada

### **Feature Template**
- **Title:** [Nombre descriptivo del feature]
- **Area Path:** [Área específica]
- **Priority:** 1-4
- **Value Area:** Business/Architectural
- **Tags:** feature, [módulo]
- **Parent:** [Épica correspondiente]

### **User Story Template**
- **Title:** Como [rol] quiero [funcionalidad] para [beneficio]
- **Story Points:** 1, 2, 3, 5, 8, 13
- **Priority:** 1-4
- **Area Path:** [Área específica]
- **Parent:** [Feature correspondiente]
- **Tags:** user-story, [módulo]

---

## 🏛️ División de Épicas y Features

### **ÉPICA 1: GESTIÓN DE IDENTIDAD Y ACCESO** 🔴
**Epic ID:** E001  
**Story Points Total:** 13  
**Prioridad:** Crítico  

#### Features:
- **F001:** Gestión de Roles y Usuarios
  - HU-005: Crear roles de usuario
  - HU-006: Asignar rol a usuario
- **F002:** Consultas de Personal
  - HU-000: Consulta de empleados

### **ÉPICA 2: ADMINISTRACIÓN DE PERSONAL AGRÍCOLA** 🔴
**Epic ID:** E002  
**Story Points Total:** 12  
**Prioridad:** Crítico  

#### Features:
- **F003:** Gestión de Trabajadores
  - HU-001: Crear registro de trabajador
  - HU-002: Asignar información laboral al trabajador
- **F004:** Gestión de Cuadrillas
  - HU-003: Crear cuadrilla de trabajo
  - HU-004: Asignar trabajadores a cuadrilla

### **ÉPICA 3: CONTROL DE ASISTENCIA Y PRODUCTIVIDAD** 🟠
**Epic ID:** E003  
**Story Points Total:** 18  
**Prioridad:** Alto  

#### Features:
- **F005:** Registro de Asistencia
  - HU-007: Registrar entrada de trabajador
  - HU-008: Registrar salida de trabajador
- **F006:** Gestión de Ausencias
  - HU-010: Registrar ausencia justificada
- **F007:** Control de Productividad
  - HU-009: Registrar productividad de trabajador

### **ÉPICA 4: GESTIÓN AGRÍCOLA Y TAREAS** 🟠
**Epic ID:** E004  
**Story Points Total:** 21  
**Prioridad:** Alto  

#### Features:
- **F008:** Gestión de Cultivos
  - HU-014: Crear tipo de cultivo
  - HU-015: Crear tarea específica para cultivo
  - HU-016: Registrar parcela agrícola
  - HU-017: Asignar cultivo a parcela
- **F009:** Gestión de Tareas
  - HU-011: Crear tarea programada
  - HU-012: Asignar tarea a cuadrilla o trabajador
- **F010:** Condiciones de Trabajo
  - HU-013: Registrar condiciones generales de trabajo

### **ÉPICA 5: GESTIÓN DE NÓMINA Y PAGOS** 🟡
**Epic ID:** E005  
**Story Points Total:** 24  
**Prioridad:** Medio  

#### Features:
- **F011:** Esquemas de Pago
  - HU-018: Crear esquema de pago
  - HU-019: Configurar fórmula de cálculo
  - HU-020: Asignar esquema de pago a tarea
  - HU-021: Crear bonificación
- **F012:** Procesamiento de Nómina
  - HU-022: Iniciar período de nómina
  - HU-023: Generar preliquidación
  - HU-024: Revisar nómina individual
  - HU-025: Ajustar datos en nómina
  - HU-026: Aprobar nómina
  - HU-027: Generar recibo individual
  - HU-028: Registrar deducción especial

### **ÉPICA 6: GESTIÓN DE REPORTES Y ANÁLISIS** 🟢
**Epic ID:** E006  
**Story Points Total:** 12  
**Prioridad:** Bajo  

#### Features:
- **F013:** Reportes Operativos
  - HU-029: Generar reporte de asistencia
  - HU-030: Generar reporte de productividad
  - HU-031: Consultar historial de pagos
- **F014:** Exportación de Datos
  - HU-032: Exportar datos de nómina

---

## 🗓️ Configuración de Sprints

### **Iteration Structure**
```
sistema-gestion-agricola\
├── Sprint 1 (2025-09-02 to 2025-09-15) - 2 semanas
├── Sprint 2 (2025-09-16 to 2025-09-29) - 2 semanas
├── Sprint 3 (2025-12-01 to 2025-12-21) - 3 semanas
├── Sprint 4 (2025-12-22 to 2026-01-11) - 3 semanas
└── Sprint 5 (2026-01-12 to 2026-01-25) - 2 semanas
```

### **Configuración por Sprint**

#### **Sprint 1: Fundación del Sistema y Gestión Básica** (7 HU - 15 SP)
**Fechas:** 02/09/2025 - 15/09/2025 (2 semanas)  
**Objetivo:** Establecer roles, usuarios y gestión básica de trabajadores  
**Capacity:** 40 horas/semana por desarrollador  

#### **Sprint 2: Control de Asistencia y Cuadrillas** (6 HU - 13 SP)
**Fechas:** 16/09/2025 - 29/09/2025 (2 semanas)  
**Objetivo:** Implementar registro de asistencia y gestión de cuadrillas  
**Capacity:** 40 horas/semana por desarrollador  

#### **Sprint 3: Gestión Agrícola y Tareas** (7 HU - 16 SP)
**Fechas:** 01/12/2025 - 21/12/2025 (3 semanas)  
**Objetivo:** Completar gestión de cultivos, parcelas y tareas programadas  
**Capacity:** 60 horas/semana por desarrollador (vacaciones)  

#### **Sprint 4: Sistema de Nómina Completo** (6 HU - 18 SP)
**Fechas:** 22/12/2025 - 11/01/2026 (3 semanas)  
**Objetivo:** Sistema completo de esquemas de pago y procesamiento de nómina  
**Capacity:** 60 horas/semana por desarrollador (vacaciones)  

#### **Sprint 5: Reportes y Optimización Final** (6 HU - 16 SP)
**Fechas:** 12/01/2026 - 25/01/2026 (2 semanas)  
**Objetivo:** Sistema completo de reportes y exportación de datos  
**Capacity:** 60 horas/semana por desarrollador (vacaciones)  

---

## 📊 Work Items por Sprint

### **Sprint 1 Work Items - Fundación del Sistema**
| Work Item | Type | Points | Assigned To | Area |
|-----------|------|--------|-------------|------|
| HU-005 | User Story | 2 | [Developer] | Backend\Autenticacion |
| HU-006 | User Story | 2 | [Developer] | Backend\Autenticacion |
| HU-001 | User Story | 3 | [Developer] | Frontend\Personal |
| HU-002 | User Story | 3 | [Developer] | Frontend\Personal |
| HU-000 | User Story | 2 | [Developer] | Frontend\Personal |
| HU-003 | User Story | 3 | [Developer] | Backend\API |

**Tasks de Sprint 1:**
- Configurar proyecto React/Angular
- Implementar sistema de roles
- Crear componentes de gestión de trabajadores
- Diseñar base de datos
- Implementar API REST básica
- Crear consultas de empleados

### **Sprint 2 Work Items - Control de Asistencia**
| Work Item | Type | Points | Assigned To | Area |
|-----------|------|--------|-------------|------|
| HU-007 | User Story | 3 | [Developer] | Frontend\Asistencia |
| HU-008 | User Story | 3 | [Developer] | Frontend\Asistencia |
| HU-010 | User Story | 2 | [Developer] | Frontend\Asistencia |
| HU-004 | User Story | 2 | [Developer] | Backend\API |
| HU-009 | User Story | 2 | [Developer] | Frontend\Productividad |
| HU-013 | User Story | 1 | [Developer] | Backend\API |

**Tasks de Sprint 2:**
- Implementar registro de entrada/salida
- Crear dashboard de asistencia
- Gestión de ausencias justificadas
- Asignación de trabajadores a cuadrillas
- Registro de productividad básico

### **Sprint 3 Work Items - Gestión Agrícola**
| Work Item | Type | Points | Assigned To | Area |
|-----------|------|--------|-------------|------|
| HU-014 | User Story | 2 | [Developer] | Backend\API |
| HU-015 | User Story | 3 | [Developer] | Backend\API |
| HU-016 | User Story | 3 | [Developer] | Frontend\Personal |
| HU-017 | User Story | 2 | [Developer] | Backend\API |
| HU-011 | User Story | 3 | [Developer] | Backend\Servicios |
| HU-012 | User Story | 3 | [Developer] | Frontend\Productividad |

**Tasks de Sprint 3:**
- Crear gestión de tipos de cultivo
- Implementar tareas específicas por cultivo
- Registrar parcelas agrícolas
- Asignar cultivos a parcelas
- Sistema de tareas programadas

### **Sprint 4 Work Items - Sistema de Nómina**
| Work Item | Type | Points | Assigned To | Area |
|-----------|------|--------|-------------|------|
| HU-018 | User Story | 3 | [Developer] | Backend\API |
| HU-019 | User Story | 5 | [Developer] | Backend\Servicios |
| HU-020 | User Story | 3 | [Developer] | Backend\API |
| HU-021 | User Story | 2 | [Developer] | Backend\API |
| HU-022 | User Story | 3 | [Developer] | Backend\Servicios |
| HU-023 | User Story | 2 | [Developer] | Frontend\Nomina |

**Tasks de Sprint 4:**
- Crear esquemas de pago flexibles
- Implementar fórmulas de cálculo
- Asignar esquemas a tareas
- Sistema de bonificaciones
- Iniciar períodos de nómina

### **Sprint 5 Work Items - Nómina Final y Reportes**
| Work Item | Type | Points | Assigned To | Area |
|-----------|------|--------|-------------|------|
| HU-024 | User Story | 3 | [Developer] | Frontend\Nomina |
| HU-025 | User Story | 2 | [Developer] | Frontend\Nomina |
| HU-026 | User Story | 2 | [Developer] | Backend\Servicios |
| HU-027 | User Story | 3 | [Developer] | Backend\API |
| HU-028 | User Story | 2 | [Developer] | Backend\Servicios |
| HU-029 | User Story | 2 | [Developer] | Frontend\Reportes |
| HU-030 | User Story | 2 | [Developer] | Frontend\Reportes |
| HU-031 | User Story | 1 | [Developer] | Frontend\Reportes |
| HU-032 | User Story | 3 | [Developer] | Backend\API |

**Tasks de Sprint 5:**
- Revisión individual de nóminas
- Ajustes de datos en nómina
- Aprobación de nóminas
- Generación de recibos individuales
- Deducciones especiales
- Sistema completo de reportes
- Exportación de datos

---

## 🎯 Configuración de Boards

### **Product Backlog Board**
**Columnas:**
- New
- Approved
- Committed
- Done

**Swimlanes:**
- Por Épica (E001, E002, E003, E004, E005, E006)

### **Sprint Board**
**Columnas:**
- To Do
- In Progress
- Code Review
- Testing
- Done

**Swimlanes:**
- Por desarrollador
- Por área (Frontend/Backend)

### **Kanban Board (para Tasks)**
**Columnas:**
- New
- Active
- Resolved
- Closed

---

## 📈 Métricas y Reportes

### **Métricas de Sprint**
- **Velocity Chart:** Puntos completados por sprint
- **Burndown Chart:** Progreso diario del sprint
- **Cumulative Flow Diagram:** Flujo de work items
- **Sprint Goal:** Objetivo y criterios de éxito

### **Métricas de Producto**
- **Epic Burndown:** Progreso de épicas
- **Feature Progress:** Estado de features
- **Cycle Time:** Tiempo promedio de completar user stories
- **Lead Time:** Tiempo desde creación hasta completado

### **KPIs del Proyecto**
- **Sprint Success Rate:** % de sprints completados exitosamente
- **Story Points Delivered:** Puntos entregados vs. comprometidos
- **Code Coverage:** % de cobertura de pruebas
- **Bug Rate:** Número de bugs por sprint

---

## 🛠️ Configuración Técnica

### **Repositorios Git**
```
/sistema-gestion-agricola
├── /frontend (React/Angular)
├── /backend (Node.js/Express)
├── /database (Scripts SQL)
└── /docs (Documentación)
```

### **Branch Strategy**
- **main:** Código de producción
- **develop:** Desarrollo principal
- **feature/[HU-XXX]:** Features específicas
- **hotfix/[descripcion]:** Correcciones urgentes

### **CI/CD Pipeline**
- **Build:** Automatizado en cada push
- **Test:** Pruebas unitarias y de integración
- **Deploy:** Despliegue automático a staging
- **Production:** Despliegue manual aprobado

---

## 📋 Checklist de Configuración

### **Configuración Inicial** ✅
- [ ] Crear organización en Azure DevOps
- [ ] Configurar proyecto con template Scrum
- [ ] Configurar team settings y working days
- [ ] Establecer área paths
- [ ] Configurar iteration paths (sprints)

### **Work Items Setup** ✅
- [ ] Crear 6 épicas principales
- [ ] Crear 16 features bajo épicas
- [ ] Crear 32 user stories bajo features
- [ ] Asignar story points a cada user story
- [ ] Configurar prioridades y tags

### **Sprint Configuration** ✅
- [ ] Configurar Sprint 1 (2 semanas)
- [ ] Configurar Sprint 2 (2 semanas)
- [ ] Configurar Sprint 3 (3 semanas)
- [ ] Configurar Sprint 4 (3 semanas)
- [ ] Configurar Sprint 5 (2 semanas)
- [ ] Asignar capacity por sprint

### **Board Setup** ✅
- [ ] Configurar Product Backlog board
- [ ] Configurar Sprint boards
- [ ] Configurar Kanban board para tasks
- [ ] Configurar swimlanes y columnas
- [ ] Establecer WIP limits

### **Integration Setup** ✅
- [ ] Conectar repositorios Git
- [ ] Configurar branch policies
- [ ] Configurar CI/CD pipelines
- [ ] Configurar work item linking
- [ ] Configurar notifications

---

## 🎯 Recommendations

### **Best Practices**
1. **Daily Standups:** 15 minutos máximo, enfoque en impedimentos
2. **Sprint Planning:** Estimar usando Planning Poker
3. **Sprint Review:** Demo con stakeholders reales
4. **Sprint Retrospective:** Mejora continua documentada

### **Quality Gates**
- Definition of Ready para User Stories
- Definition of Done para todas las actividades
- Code review obligatorio antes de merge
- Testing automático antes de deploy

### **Risk Management**
- Dependencias críticas identificadas entre sprints
- Planes de contingencia para miembros del equipo
- Backup de configuraciones y datos importantes
- Comunicación clara de cambios en scope

---

**Documento creado por:** [Tu Nombre]  
**Fecha:** Agosto 2025  
**Versión:** 1.0  
**Próxima Revisión:** Inicio Sprint 1
