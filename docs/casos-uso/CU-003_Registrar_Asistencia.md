# ESPECIFICACIÓN DE CASO DE USO

**Sistema:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Caso de Uso:** CU-003 - Registrar Asistencia  
**Versión:** 1.0  
**Fecha:** Diciembre 2024  

---

## 1. INFORMACIÓN GENERAL

### 1.1 Identificación
- **ID:** CU-003
- **Nombre:** Registrar Asistencia
- **Actor Principal:** Empleado / Supervisor
- **Nivel:** Objetivo del Usuario
- **Estado:** Activo

### 1.2 Resumen
Este caso de uso describe el proceso mediante el cual un empleado o supervisor registra la entrada y salida de trabajadores en el sistema, permitiendo el control efectivo de horarios laborales y el cálculo posterior de horas trabajadas para efectos de nómina y productividad.

### 1.3 Actores
- **Actor Principal:** Empleado, Supervisor de Campo, Supervisor RRHH
- **Actores Secundarios:** Sistema de Validación, Base de Datos, Servicio de Cálculo de Horas

---

## 2. ESPECIFICACIÓN DEL CASO DE USO

### 2.1 Precondiciones
- El usuario debe estar autenticado en el sistema
- El empleado a registrar debe existir en la base de datos
- El empleado debe estar activo en el sistema
- Debe existir configuración de horarios laborales
- La fecha actual debe ser un día laboral válido

### 2.2 Garantía de Éxito (Postcondiciones)
- El registro de entrada/salida queda almacenado correctamente
- Se actualiza el estado de asistencia del empleado
- Se calculan automáticamente las horas trabajadas (si es salida)
- Se identifican automáticamente horas extras (si aplica)
- Se registra la actividad en logs del sistema
- Los datos quedan disponibles para reportes y nómina

### 2.3 Garantía Mínima
- Se mantiene la integridad temporal de los registros
- No se permiten registros duplicados en el mismo día
- Se conserva la trazabilidad de quien hizo cada registro

---

## 3. FLUJO PRINCIPAL DE EVENTOS

### 3.1 Escenario Exitoso - Registro de Entrada

1. **Usuario** accede al módulo "Control de Asistencia"
2. **Usuario** selecciona "Registrar Asistencia"
3. **Sistema** presenta la interfaz de registro con:
   - Campo de búsqueda de empleado (cédula, nombre o código)
   - Botones "Entrada" y "Salida"
   - Fecha actual (no editable)
   - Hora actual (editable para supervisores)
   - Campo observaciones (opcional)
4. **Usuario** busca al empleado utilizando cédula o nombre
5. **Sistema** muestra lista de empleados coincidentes
6. **Usuario** selecciona el empleado correcto
7. **Sistema** muestra información del empleado:
   - Nombre completo
   - Cédula
   - Cargo
   - Departamento
   - Estado actual de asistencia del día
8. **Usuario** hace clic en botón "Entrada"
9. **Sistema** valida que no exista ya un registro de entrada para el día actual
10. **Sistema** verifica si el empleado tiene permisos o ausencias programadas
11. **Sistema** registra la hora actual como hora de entrada
12. **Sistema** calcula si hay tardanza comparando con horario estándar
13. **Sistema** guarda el registro en la base de datos:
    - ID del empleado
    - Fecha actual
    - Hora de entrada
    - Estado: "PRESENTE"
    - Usuario que registró
    - Observaciones (si las hay)
    - Indicador de tardanza (si aplica)
14. **Sistema** actualiza el estado del empleado para el día
15. **Sistema** registra la actividad en logs
16. **Sistema** muestra confirmación: "Entrada registrada exitosamente para [Nombre del empleado] a las [hora]"
17. **Sistema** limpia el formulario para próximo registro

### 3.2 Escenario Exitoso - Registro de Salida

1-7. **[Mismos pasos del registro de entrada]**
8. **Usuario** hace clic en botón "Salida"  
9. **Sistema** verifica que exista un registro de entrada para el día
10. **Sistema** valida que no exista ya un registro de salida para el día
11. **Sistema** registra la hora actual como hora de salida
12. **Sistema** calcula las horas trabajadas:
    - Horas regulares (hasta límite configurado)
    - Horas extras (si excede límite)
    - Tiempo de descanso (si aplica)
13. **Sistema** actualiza el registro existente con:
    - Hora de salida
    - Horas regulares calculadas
    - Horas extras calculadas
    - Estado actualizado
14. **Sistema** registra la actividad en logs
15. **Sistema** muestra confirmación detallada:
    - "Salida registrada para [Nombre]"
    - "Horas trabajadas: X horas Y minutos"
    - "Horas extras: Z horas" (si aplica)
16. **Sistema** limpia el formulario para próximo registro

---

## 4. FLUJOS ALTERNATIVOS

### 4.1 Empleado No Encontrado (A1)

**Punto de Extensión:** Después del paso 4 del flujo principal

1. **Sistema** no encuentra empleados con los criterios de búsqueda
2. **Sistema** muestra mensaje: "No se encontraron empleados con ese criterio"
3. **Sistema** sugiere verificar la información ingresada
4. **Sistema** ofrece opción "Mostrar todos los empleados activos"
5. Regresa al paso 4 del flujo principal

### 4.2 Empleado Inactivo (A2)

**Punto de Extensión:** Después del paso 6 del flujo principal

1. **Sistema** detecta que el empleado seleccionado está inactivo
2. **Sistema** muestra mensaje: "Este empleado está inactivo. No se puede registrar asistencia"
3. **Sistema** sugiere contactar a RRHH si es un error
4. Regresa al paso 4 del flujo principal

### 4.3 Entrada Duplicada (A3)

**Punto de Extensión:** Después del paso 9 del flujo principal (entrada)

1. **Sistema** detecta que ya existe registro de entrada para el día
2. **Sistema** muestra mensaje: "Ya existe registro de entrada para hoy a las [hora anterior]"
3. **Sistema** pregunta: "¿Desea actualizar la hora de entrada?"
4. Si **Usuario** confirma:
   a. **Sistema** actualiza la hora de entrada anterior
   b. **Sistema** registra la modificación en logs
   c. **Sistema** muestra confirmación de actualización
5. Si **Usuario** cancela:
   a. Regresa al paso 4 del flujo principal

### 4.4 Salida Sin Entrada (A4)

**Punto de Extensión:** Después del paso 9 del flujo principal (salida)

1. **Sistema** detecta que no existe registro de entrada para el día
2. **Sistema** muestra mensaje: "No se puede registrar salida sin entrada previa"
3. **Sistema** pregunta: "¿Desea registrar entrada y salida juntas?"
4. Si **Usuario** confirma:
   a. **Sistema** solicita hora de entrada
   b. **Sistema** procesa entrada y salida secuencialmente
   c. **Sistema** calcula horas trabajadas
5. Si **Usuario** cancela:
   a. Regresa al paso 4 del flujo principal

### 4.5 Empleado con Permiso/Ausencia (A5)

**Punto de Extensión:** Después del paso 10 del flujo principal

1. **Sistema** detecta que el empleado tiene permiso aprobado para el día
2. **Sistema** muestra información del permiso:
   - Tipo de permiso
   - Fechas del permiso
   - Estado (aprobado/pendiente)
3. **Sistema** pregunta: "El empleado tiene permiso. ¿Continuar con el registro?"
4. Si **Usuario** confirma:
   a. **Sistema** procede con el registro
   b. **Sistema** marca el registro como "excepción a permiso"
5. Si **Usuario** cancela:
   a. Regresa al paso 4 del flujo principal

### 4.6 Registro Fuera de Horario Laboral (A6)

**Punto de Extensión:** Después del paso 12 del flujo principal

1. **Sistema** detecta que el registro es muy temprano o muy tarde
2. **Sistema** muestra alerta: "Registro fuera del horario laboral normal"
3. **Sistema** solicita justificación en campo observaciones
4. Si es **Usuario** supervisor:
   a. **Sistema** permite el registro con justificación
5. Si es **Empleado** registrando para sí mismo:
   a. **Sistema** requiere aprobación posterior de supervisor
   b. **Sistema** marca el registro como "pendiente de aprobación"

---

## 5. REQUERIMIENTOS ESPECIALES

### 5.1 Requerimientos de Rendimiento
- El registro debe completarse en menos de 2 segundos
- La búsqueda de empleados debe ser inmediata (< 300ms)
- El sistema debe soportar hasta 50 registros simultáneos (hora pico)

### 5.2 Requerimientos de Seguridad
- Solo usuarios autenticados pueden registrar asistencia
- Los empleados solo pueden registrar su propia asistencia
- Los supervisores pueden registrar para empleados de su equipo
- Todos los registros deben ser auditables

### 5.3 Requerimientos de Usabilidad
- La interfaz debe ser simple y rápida de usar
- Debe funcionar en dispositivos móviles (tabletas en campo)
- Debe permitir registros masivos para supervisores
- Debe mostrar claramente el estado actual del empleado

### 5.4 Requerimientos de Integridad
- No se permiten registros en fechas futuras
- No se permiten múltiples entradas/salidas el mismo día
- Las horas de salida deben ser posteriores a las de entrada
- Los cálculos de horas deben ser exactos al minuto

---

## 6. INFORMACIÓN ADICIONAL

### 6.1 Frecuencia de Uso
- **Muy Alta:** 400-600 registros diarios
- **Picos:** Inicio (6:00-8:00 AM) y fin (4:00-6:00 PM) de jornada
- **Usuarios concurrentes:** Hasta 30 usuarios simultáneos

### 6.2 Reglas de Negocio
- **RN-020:** Jornada laboral estándar: 8 horas
- **RN-021:** Horas extras después de 8 horas diarias
- **RN-022:** Tardanza después de 15 minutos de tolerancia
- **RN-023:** Registros solo en días laborales (excepto turnos especiales)
- **RN-024:** Máximo 12 horas trabajadas por día

### 6.3 Supuestos y Dependencias
- **Supuesto:** Los empleados tienen acceso a dispositivos para registro
- **Supuesto:** La hora del sistema está sincronizada correctamente
- **Dependencia:** Módulo de gestión de empleados operativo
- **Dependencia:** Configuración de horarios laborales definida
- **Dependencia:** Sistema de permisos funcionando

### 6.4 Problemas Abiertos
- Implementar registro biométrico o por tarjeta
- Definir manejo de trabajadores en múltiples ubicaciones
- Considerar registro offline para áreas sin conectividad

---

## 7. TRAZABILIDAD

### 7.1 Relación con Requerimientos
- **RF-006:** Registro de entrada
- **RF-007:** Registro de salida
- **RF-008:** Consulta de asistencia diaria
- **RNF-005:** Tiempo de respuesta para registro
- **RNF-006:** Concurrencia de usuarios

### 7.2 Relación con Azure DevOps
- **Feature ID:** 4 - Registro de Asistencia
- **User Stories:** HU-006, HU-007, HU-008
- **Epic:** Control de Asistencia Laboral

### 7.3 Casos de Uso Relacionados
- **CU-001:** Autenticar Usuario (prerrequisito)
- **CU-002:** Registrar Empleado (empleado debe existir)
- **CU-004:** Procesar Nómina (usa datos de asistencia)

---

**Elaborado por:** Equipo de Desarrollo  
**Revisado por:** Supervisor de Campo  
**Aprobado por:** Gerente de Operaciones  
**Estado:** Aprobado para Implementación
