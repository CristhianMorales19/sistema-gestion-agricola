# Distribución Actualizada de Sprints - Historias de Usuario Reales

**Proyecto:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Metodología:** Scrum con Azure DevOps  
**Fecha:** Agosto 2025  
**Total HU:** 33 historias de usuario (incluye HU-000)

---

## 📋 Resumen de Distribución

### **Total por Sprint:**
- **Sprint 1:** 6 HU (15 Story Points) - Fundación del Sistema
- **Sprint 2:** 6 HU (13 Story Points) - Control de Asistencia  
- **Sprint 3:** 6 HU (16 Story Points) - Gestión Agrícola
- **Sprint 4:** 6 HU (18 Story Points) - Sistema de Nómina
- **Sprint 5:** 9 HU (18 Story Points) - Reportes y Optimización

---

## 🚀 SPRINT 1: Fundación del Sistema (6 HU - 15 SP)
**Fechas:** 02/09/2025 - 15/09/2025 (2 semanas)  
**Objetivo:** Establecer roles, usuarios y gestión básica de trabajadores

### **Historias de Usuario:**
| ID | Título | Story Points | Área | Prioridad |
|----|--------|--------------|------|-----------|
| HU-001 | Crear registro de trabajador | 3 | Frontend\Personal | 🔴 Crítico |
| HU-002 | Asignar información laboral al trabajador | 3 | Frontend\Personal | 🔴 Crítico |
| HU-003 | Crear cuadrilla de trabajo | 3 | Backend\API | 🔴 Crítico |
| HU-005 | Crear roles de usuario | 2 | Backend\Autenticacion | 🔴 Crítico |
| HU-006 | Asignar rol a usuario | 2 | Backend\Autenticacion | 🔴 Crítico |
| HU-000 | Consulta de empleados | 2 | Frontend\Personal | 🟠 Alto |

### **Criterios de Éxito Sprint 1:**
- ✅ Sistema de roles funcional
- ✅ Registro de trabajadores operativo
- ✅ Consulta de empleados funcionando
- ✅ Base de datos configurada
- ✅ Creación de cuadrillas básicas

---

## 🚀 SPRINT 2: Control de Asistencia (6 HU - 13 SP)
**Fechas:** 16/09/2025 - 29/09/2025 (2 semanas)  
**Objetivo:** Implementar registro de asistencia y gestión de cuadrillas

### **Historias de Usuario:**
| ID | Título | Story Points | Área | Prioridad |
|----|--------|--------------|------|-----------|
| HU-007 | Registrar entrada de trabajador | 3 | Frontend\Asistencia | 🔴 Crítico |
| HU-008 | Registrar salida de trabajador | 3 | Frontend\Asistencia | 🔴 Crítico |
| HU-010 | Registrar ausencia justificada | 2 | Frontend\Asistencia | 🟠 Alto |
| HU-004 | Asignar trabajadores a cuadrilla | 2 | Backend\API | 🟠 Alto |
| HU-009 | Registrar productividad de trabajador | 2 | Frontend\Productividad | 🟠 Alto |
| HU-013 | Registrar condiciones generales de trabajo | 1 | Backend\API | 🟡 Medio |

### **Criterios de Éxito Sprint 2:**
- ✅ Sistema de marcado entrada/salida funcional
- ✅ Registro de ausencias operativo
- ✅ Asignación de trabajadores a cuadrillas
- ✅ Registro básico de productividad
- ✅ Dashboard de asistencia básico

---

## 🚀 SPRINT 3: Gestión Agrícola (6 HU - 16 SP)
**Fechas:** 01/12/2025 - 21/12/2025 (3 semanas)  
**Objetivo:** Completar gestión de cultivos, parcelas y tareas programadas

### **Historias de Usuario:**
| ID | Título | Story Points | Área | Prioridad |
|----|--------|--------------|------|-----------|
| HU-014 | Crear tipo de cultivo | 2 | Backend\API | 🟠 Alto |
| HU-015 | Crear tarea específica para cultivo | 3 | Backend\API | 🟠 Alto |
| HU-016 | Registrar parcela agrícola | 3 | Frontend\Personal | 🟠 Alto |
| HU-017 | Asignar cultivo a parcela | 2 | Backend\API | 🟠 Alto |
| HU-011 | Crear tarea programada | 3 | Backend\Servicios | 🟠 Alto |
| HU-012 | Asignar tarea a cuadrilla o trabajador | 3 | Frontend\Productividad | 🟠 Alto |

### **Criterios de Éxito Sprint 3:**
- ✅ Gestión completa de tipos de cultivo
- ✅ Registro y gestión de parcelas agrícolas
- ✅ Asignación de cultivos a parcelas
- ✅ Sistema de tareas programadas
- ✅ Asignación de tareas a cuadrillas/trabajadores

---

## 🚀 SPRINT 4: Sistema de Nómina (6 HU - 18 SP)
**Fechas:** 22/12/2025 - 11/01/2026 (3 semanas)  
**Objetivo:** Sistema completo de esquemas de pago y procesamiento de nómina

### **Historias de Usuario:**
| ID | Título | Story Points | Área | Prioridad |
|----|--------|--------------|------|-----------|
| HU-018 | Crear esquema de pago | 3 | Backend\API | 🟠 Alto |
| HU-019 | Configurar fórmula de cálculo | 5 | Backend\Servicios | 🟠 Alto |
| HU-020 | Asignar esquema de pago a tarea | 3 | Backend\API | 🟠 Alto |
| HU-021 | Crear bonificación | 2 | Backend\API | 🟡 Medio |
| HU-022 | Iniciar período de nómina | 3 | Backend\Servicios | 🟠 Alto |
| HU-023 | Generar preliquidación | 2 | Frontend\Nomina | 🟠 Alto |

### **Criterios de Éxito Sprint 4:**
- ✅ Esquemas de pago configurables
- ✅ Fórmulas de cálculo flexibles
- ✅ Asignación de esquemas a tareas
- ✅ Sistema de bonificaciones
- ✅ Proceso de nómina inicializado
- ✅ Preliquidaciones funcionando

---

## 🚀 SPRINT 5: Reportes y Optimización Final (9 HU - 18 SP)
**Fechas:** 12/01/2026 - 25/01/2026 (2 semanas)  
**Objetivo:** Sistema completo de reportes y finalización de nómina

### **Historias de Usuario:**
| ID | Título | Story Points | Área | Prioridad |
|----|--------|--------------|------|-----------|
| HU-024 | Revisar nómina individual | 3 | Frontend\Nomina | 🟠 Alto |
| HU-025 | Ajustar datos en nómina | 2 | Frontend\Nomina | 🟠 Alto |
| HU-026 | Aprobar nómina | 2 | Backend\Servicios | 🔴 Crítico |
| HU-027 | Generar recibo individual | 3 | Backend\API | 🔴 Crítico |
| HU-028 | Registrar deducción especial | 2 | Backend\Servicios | 🟡 Medio |
| HU-029 | Generar reporte de asistencia | 2 | Frontend\Reportes | 🟡 Medio |
| HU-030 | Generar reporte de productividad | 2 | Frontend\Reportes | 🟡 Medio |
| HU-031 | Consultar historial de pagos | 1 | Frontend\Reportes | 🟢 Bajo |
| HU-032 | Exportar datos de nómina | 3 | Backend\API | 🟡 Medio |

### **Criterios de Éxito Sprint 5:**
- ✅ Revisión individual de nóminas
- ✅ Capacidad de ajustes manuales
- ✅ Proceso de aprobación de nómina
- ✅ Generación automática de recibos
- ✅ Sistema completo de reportes
- ✅ Exportación de datos funcionando

---

## 📊 Análisis de Distribución

### **Por Área de Desarrollo:**
- **Frontend:** 15 HU (45%)
- **Backend:** 18 HU (55%)

### **Por Módulo Funcional:**
- **Gestión de Personal:** 5 HU (15%)
- **Control de Asistencia:** 4 HU (12%)
- **Gestión Agrícola:** 7 HU (21%)
- **Sistema de Nómina:** 12 HU (36%)
- **Reportes y Análisis:** 5 HU (15%)

### **Por Prioridad:**
- **🔴 Crítico:** 8 HU (24%)
- **🟠 Alto:** 18 HU (55%)
- **🟡 Medio:** 6 HU (18%)
- **🟢 Bajo:** 1 HU (3%)

---

## 🎯 Recomendaciones de Implementación

### **Sprint 1-2 (Periodo Académico):**
- Enfoque en funcionalidades **críticas y básicas**
- Asegurar que login/roles, registro de trabajadores y asistencia básica funcionen
- Preparar demos sólidas para entregas académicas

### **Sprint 3-5 (Periodo de Vacaciones):**
- Desarrollar funcionalidades más complejas (gestión agrícola, nómina)
- Implementar optimizaciones y mejoras de UX
- Completar sistema de reportes y análisis

### **Dependencias Críticas:**
- **Sprint 1 → Sprint 2:** Roles y trabajadores deben estar listos
- **Sprint 2 → Sprint 3:** Datos de asistencia y cuadrillas operativos
- **Sprint 3 → Sprint 4:** Tareas y asignaciones funcionando
- **Sprint 4 → Sprint 5:** Datos de nómina disponibles para reportes

### **Flexibilidad:**
- Si algún sprint se adelanta, se pueden mover HU del siguiente
- Mantener las dependencias críticas siempre respetadas
- Documentar cambios para facilitar trabajo del equipo

---

## 📋 Checklist de Redistribución en Azure DevOps

### **Acciones Inmediatas:**
- [ ] Mover HU del Sprint 1 actual a los sprints correctos
- [ ] Crear las 6 épicas principales
- [ ] Crear las 14 features bajo épicas
- [ ] Vincular las 33 user stories a sus features
- [ ] Asignar story points según la tabla
- [ ] Configurar fechas de sprints correctas (2025-2026)

### **Configuración de Boards:**
- [ ] Configurar swimlanes por épica
- [ ] Establecer WIP limits por columna
- [ ] Configurar filtros por sprint
- [ ] Personalizar campos según necesidades

### **Métricas a Configurar:**
- [ ] Velocity chart por sprint
- [ ] Burndown chart por sprint
- [ ] Epic burndown para seguimiento
- [ ] Cumulative flow diagram

---

**Documento actualizado:** Agosto 30, 2025  
**Versión:** 2.0 (Actualizado con HU reales de Azure DevOps)  
**Estado:** Listo para implementar redistribución
