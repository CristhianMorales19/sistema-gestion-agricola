# ESPECIFICACIÓN DE CASO DE USO

**Sistema:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Caso de Uso:** CU-005 - Asignar Tareas de Productividad  
**Versión:** 1.0  
**Fecha:** Diciembre 2024  

---

## 1. INFORMACIÓN GENERAL

### 1.1 Identificación
- **ID:** CU-005
- **Nombre:** Asignar Tareas de Productividad
- **Actor Principal:** Supervisor de Campo
- **Nivel:** Objetivo del Usuario
- **Estado:** Activo

### 1.2 Resumen
Este caso de uso describe el proceso mediante el cual un supervisor asigna tareas específicas de productividad a empleados o cuadrillas de trabajo, estableciendo metas, plazos y criterios de evaluación para optimizar el rendimiento en las actividades agroindustriales.

### 1.3 Actores
- **Actor Principal:** Supervisor de Campo, Supervisor RRHH
- **Actores Secundarios:** Sistema de Productividad, Base de Datos, Servicio de Notificaciones

---

## 2. ESPECIFICACIÓN DEL CASO DE USO

### 2.1 Precondiciones
- El usuario debe estar autenticado con permisos de gestión de productividad
- Deben existir empleados activos en el sistema
- Deben estar definidas las cuadrillas de trabajo
- Debe existir catálogo de tipos de tareas disponibles

### 2.2 Garantía de Éxito (Postcondiciones)
- Las tareas quedan asignadas correctamente a empleados/cuadrillas
- Se establecen metas medibles y plazos específicos
- Los empleados reciben notificación de sus nuevas asignaciones
- Se genera calendario de seguimiento automático
- Los datos quedan disponibles para evaluación posterior

### 2.3 Garantía Mínima
- Se mantiene integridad en las asignaciones
- No se crean tareas duplicadas o conflictivas
- Se conserva trazabilidad de quien asignó cada tarea

---

## 3. FLUJO PRINCIPAL DE EVENTOS

### 3.1 Escenario Exitoso

1. **Supervisor** accede al módulo "Control de Productividad"
2. **Supervisor** selecciona "Asignar Nuevas Tareas"
3. **Sistema** presenta formulario con secciones:
   - **Información de la Tarea:**
     - Tipo de tarea (lista: Siembra, Cosecha, Fumigación, Riego, etc.)
     - Descripción detallada
     - Prioridad (Alta/Media/Baja)
   - **Asignación:**
     - Selector: Individual/Cuadrilla completa
     - Lista de empleados/cuadrillas disponibles
   - **Metas y Plazos:**
     - Cantidad objetivo (ej: hectáreas, kilogramos, unidades)
     - Fecha de inicio
     - Fecha límite
     - Criterios de calidad
4. **Supervisor** selecciona el tipo de tarea desde la lista predefinida
5. **Supervisor** completa la descripción específica de la tarea
6. **Supervisor** establece la prioridad según urgencia
7. **Supervisor** decide si asignar individualmente o a cuadrilla completa
8. **Supervisor** selecciona empleados/cuadrilla desde lista filtrada por:
   - Disponibilidad (no sobrecargados)
   - Competencias para el tipo de tarea
   - Ubicación geográfica
9. **Supervisor** define la meta cuantificable (ej: "Cosechar 5 hectáreas")
10. **Supervisor** establece fechas de inicio y finalización
11. **Supervisor** especifica criterios de calidad o condiciones especiales
12. **Supervisor** hace clic en "Asignar Tarea"
13. **Sistema** valida que:
    - Todos los campos obligatorios estén completos
    - Las fechas sean lógicas (inicio <= fin, no en el pasado)
    - Los empleados no estén sobrecargados
    - No existan conflictos de ubicación
14. **Sistema** calcula automáticamente:
    - Duración estimada basada en tipo de tarea
    - Recursos necesarios
    - Indicadores de rendimiento esperados
15. **Sistema** genera ID único para la tarea
16. **Sistema** crea registros en base de datos:
    - Tarea principal con toda la información
    - Asignaciones individuales por empleado
    - Metas específicas por persona (si aplica)
17. **Sistema** actualiza calendarios de trabajo de empleados asignados
18. **Sistema** registra la actividad en logs
19. **Sistema** envía notificaciones automáticas:
    - A empleados asignados (email/SMS si está configurado)
    - A supervisor RRHH (para seguimiento)
20. **Sistema** muestra confirmación: "Tarea asignada exitosamente a [X] empleados"
21. **Sistema** ofrece opciones:
    - Asignar otra tarea
    - Ver calendario de tareas
    - Configurar recordatorios de seguimiento

---

## 4. FLUJOS ALTERNATIVOS

### 4.1 Empleados No Disponibles (A1)
1. **Sistema** detecta que empleados seleccionados ya tienen carga completa
2. **Sistema** muestra alternativas disponibles con capacidad
3. **Supervisor** ajusta selección o modifica fechas

### 4.2 Conflicto de Ubicación (A2)
1. **Sistema** detecta que empleados están asignados en ubicaciones distantes
2. **Sistema** sugiere reasignación por proximidad geográfica
3. **Supervisor** ajusta asignaciones para optimizar desplazamientos

### 4.3 Meta Irrealizable (A3)
1. **Sistema** detecta que meta excede capacidad histórica del equipo
2. **Sistema** muestra estadísticas de rendimiento previo
3. **Supervisor** ajusta meta a niveles alcanzables

---

## 5. INFORMACIÓN ADICIONAL

### 5.1 Reglas de Negocio
- **RN-040:** Máximo 8 horas de tareas por empleado por día
- **RN-041:** Prioridad alta no puede exceder 30% de tareas totales
- **RN-042:** Tareas de fumigación requieren certificación especial
- **RN-043:** Cuadrillas no pueden dividirse entre ubicaciones distantes

### 5.2 Trazabilidad
- **Feature ID:** 7 - Planificación de Tareas, 8 - Asignación de Tareas
- **User Stories:** HU-017, HU-019
- **Epic:** Control de Productividad Agrícola

---

**Estado:** Aprobado para Implementación
