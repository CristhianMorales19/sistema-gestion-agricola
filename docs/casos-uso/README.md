# ÍNDICE DE CASOS DE USO
## Sistema de Control y Planificación de Mano de Obra Agroindustrial

**Universidad Nacional de Costa Rica**  
**Proyecto:** Sistema de Gestión Agrícola  
**Fecha:** Diciembre 2024

---

## 📋 CASOS DE USO ESPECIFICADOS

Este directorio contiene las especificaciones completas de los 6 casos de uso más representativos del sistema, desarrollados siguiendo la plantilla estándar de Ingeniería de Sistemas I.

### **CU-001: Autenticar Usuario** ⭐ **CRÍTICO**
- **Archivo:** `CU-001_Autenticar_Usuario.md`
- **Actor Principal:** Usuario del Sistema
- **Descripción:** Proceso de login y autenticación con control de acceso por roles
- **Feature Azure DevOps:** *Pendiente de creación* - Autenticación Básica
- **User Stories:** HU-026, HU-027
- **Prioridad:** 🔴 Crítica (MVP)

### **CU-002: Registrar Empleado** ⭐ **CRÍTICO**
- **Archivo:** `CU-002_Registrar_Empleado.md`
- **Actor Principal:** Administrador / Gerente RRHH
- **Descripción:** Registro completo de empleados con información personal y laboral
- **Feature Azure DevOps:** Feature #2 - Registro de personal
- **User Stories:** HU-001, HU-028
- **Prioridad:** 🔴 Crítica (MVP)

### **CU-003: Registrar Asistencia** ⭐ **CRÍTICO**
- **Archivo:** `CU-003_Registrar_Asistencia.md`
- **Actor Principal:** Empleado / Supervisor
- **Descripción:** Control de entrada/salida y cálculo de horas trabajadas
- **Feature Azure DevOps:** Feature #4 - Registro de Asistencia
- **User Stories:** HU-006, HU-007, HU-008
- **Prioridad:** 🔴 Crítica (MVP)

### **CU-004: Procesar Nómina Mensual** ⭐ **CRÍTICO**
- **Archivo:** `CU-004_Procesar_Nomina_Mensual.md`
- **Actor Principal:** Administrador / Contador
- **Descripción:** Proceso completo de cálculo y generación de nómina mensual
- **Feature Azure DevOps:** Feature #15 - Proceso de Nómina
- **User Stories:** HU-014, HU-015, HU-011, HU-012, HU-013
- **Prioridad:** 🔴 Crítica

### **CU-005: Asignar Tareas de Productividad**
- **Archivo:** `CU-005_Asignar_Tareas_Productividad.md`
- **Actor Principal:** Supervisor de Campo
- **Descripción:** Asignación de tareas y metas a empleados/cuadrillas
- **Feature Azure DevOps:** Feature #7, #8 - Planificación/Asignación de Tareas
- **User Stories:** HU-017, HU-019
- **Prioridad:** 🟡 Media

### **CU-006: Generar Reporte Ejecutivo**
- **Archivo:** `CU-006_Generar_Reporte_Ejecutivo.md`
- **Actor Principal:** Gerente / Administrador
- **Descripción:** Generación de reportes con KPIs y análisis de tendencias
- **Feature Azure DevOps:** Feature #16, #17 - Reportes de Asistencia/Productividad
- **User Stories:** HU-020, HU-022, HU-023, HU-024, HU-025
- **Prioridad:** 🟡 Media

---

## 🎯 CRITERIOS DE SELECCIÓN

Los casos de uso fueron seleccionados por:

1. **Criticidad del Negocio** - Funcionalidades esenciales para la operación
2. **Complejidad Técnica** - Casos que involucran múltiples componentes del sistema
3. **Frecuencia de Uso** - Operaciones diarias/frecuentes del sistema
4. **Riesgo de Implementación** - Casos con mayor probabilidad de fallos
5. **Valor para Stakeholders** - Funcionalidades con mayor impacto visible

---

## 📊 COBERTURA DEL SISTEMA

### **Por Épica:**
- **Gestión de Identidad y Acceso:** CU-001 (100% crítico)
- **Administración de Personal:** CU-002 (Feature principal)
- **Control de Asistencia Laboral:** CU-003 (Feature principal)
- **Gestión de Nómina y Finanzas:** CU-004 (Feature principal)
- **Control de Productividad Agrícola:** CU-005 (Features principales)
- **Inteligencia de Negocio y Reportes:** CU-006 (Features principales)

### **Por Prioridad:**
- **🔴 Críticos (MVP):** 4 casos de uso (67%)
- **🟡 Importantes:** 2 casos de uso (33%)

### **Por Actor Principal:**
- **Administrador:** CU-001, CU-002, CU-004, CU-006
- **Supervisor:** CU-003, CU-005
- **Empleado:** CU-003
- **Gerente:** CU-006

---

## 🔗 TRAZABILIDAD CON AZURE DEVOPS

### **Features Cubiertos:**
| Feature ID | Feature Name | Caso de Uso | Estado |
|---|---|---|---|
| 2 | Registro de personal | CU-002 | ✅ Especificado |
| 4 | Registro de Asistencia | CU-003 | ✅ Especificado |
| 7 | Planificación de Tareas | CU-005 | ✅ Especificado |
| 8 | Asignación de Tareas | CU-005 | ✅ Especificado |
| 15 | Proceso de Nómina | CU-004 | ✅ Especificado |
| 16 | Reporte de Asistencia | CU-006 | ✅ Especificado |
| 17 | Reporte de Productividad | CU-006 | ✅ Especificado |
| *Pendiente* | Autenticación Básica | CU-001 | ⏳ Feature por crear |

### **User Stories Cubiertas:** 18 de 32 (56%)
**Historias críticas cubiertas:** 8 de 8 (100% del MVP)

---

## 📝 INSTRUCCIONES DE USO

### **Para Desarrollo:**
1. Cada caso de uso incluye flujos principales y alternativos detallados
2. Los requerimientos especiales están claramente definidos
3. La trazabilidad con Features facilita la implementación
4. Las reglas de negocio están específicamente documentadas

### **Para Testing:**
1. Los criterios de aceptación están implícitos en los flujos
2. Los flujos alternativos cubren casos de error principales
3. Las precondiciones y postcondiciones facilitan la creación de tests

### **Para Azure DevOps:**
1. Adjuntar cada archivo .md como attachment al Feature correspondiente
2. Referenciar el caso de uso en la descripción de User Stories relacionadas
3. Usar la información para crear Tasks específicas de desarrollo

### **Para Stakeholders:**
1. Los casos de uso están escritos en lenguaje de negocio
2. Los escenarios son fáciles de validar con usuarios finales
3. Los beneficios y objetivos están claramente expresados

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar** cada especificación con stakeholders correspondientes
2. **Aprobar** los casos de uso antes de iniciar desarrollo
3. **Adjuntar** archivos a Features en Azure DevOps
4. **Crear** casos de uso adicionales para Features restantes (opcional)
5. **Actualizar** especificaciones durante el desarrollo según necesidades

---

**Elaborado por:** Equipo de Desarrollo  
**Revisado por:** Product Owner  
**Aprobado por:** Stakeholders de Negocio  
**Estado:** Listo para Implementación
