# ESPECIFICACIÓN DE CASO DE USO

**Sistema:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Caso de Uso:** CU-004 - Procesar Nómina Mensual  
**Versión:** 1.0  
**Fecha:** Diciembre 2024  

---

## 1. INFORMACIÓN GENERAL

### 1.1 Identificación
- **ID:** CU-004
- **Nombre:** Procesar Nómina Mensual
- **Actor Principal:** Administrador / Contador
- **Nivel:** Objetivo del Negocio
- **Estado:** Activo

### 1.2 Resumen
Este caso de uso describe el proceso completo de cálculo y generación de la nómina mensual, incluyendo la recopilación de datos de asistencia, aplicación de deducciones y bonificaciones, cálculo de salarios y generación de recibos de pago para todos los empleados activos.

### 1.3 Actores
- **Actor Principal:** Administrador, Contador
- **Actores Secundarios:** Sistema de Cálculo, Base de Datos, Servicio de Generación de Reportes, Sistema de Notificaciones

---

## 2. ESPECIFICACIÓN DEL CASO DE USO

### 2.1 Precondiciones
- El usuario debe estar autenticado con permisos de nómina
- Todos los registros de asistencia del mes deben estar completos
- Los salarios base de empleados deben estar actualizados
- Las configuraciones de deducciones deben estar definidas
- Debe existir al menos un empleado activo
- El período de nómina no debe haber sido procesado previamente

### 2.2 Garantía de Éxito (Postcondiciones)
- La nómina mensual queda calculada y aprobada
- Se generan recibos de pago para todos los empleados
- Los datos quedan listos para el proceso de pago
- Se crean registros contables correspondientes
- Se envían notificaciones a empleados (si está configurado)
- Se genera reporte resumen para gerencia

### 2.3 Garantía Mínima
- Se mantiene la integridad de los cálculos
- Se conserva trazabilidad completa del proceso
- Los datos no procesados se mantienen seguros

---

## 3. FLUJO PRINCIPAL DE EVENTOS

### 3.1 Escenario Exitoso

1. **Usuario** accede al módulo "Gestión de Nómina"
2. **Usuario** selecciona "Procesar Nómina Mensual"
3. **Sistema** presenta interfaz de procesamiento con:
   - Selector de período (mes/año)
   - Lista de empleados activos
   - Resumen de configuraciones actuales
   - Botón "Iniciar Procesamiento"
4. **Usuario** selecciona el período a procesar (por defecto mes anterior)
5. **Sistema** valida que el período no haya sido procesado
6. **Sistema** muestra resumen prelimar:
   - Número de empleados activos: X
   - Total de días laborales del mes: Y
   - Registros de asistencia disponibles: Z%
7. **Usuario** revisa la información y hace clic en "Iniciar Procesamiento"
8. **Sistema** muestra mensaje: "Iniciando procesamiento de nómina..." con barra de progreso
9. **Sistema** ejecuta "Fase 1: Recopilación de Datos"
   - Obtiene lista de empleados activos
   - Recopila registros de asistencia del período
   - Verifica integridad de datos
   - Identifica empleados con datos incompletos
10. **Sistema** ejecuta "Fase 2: Cálculo de Horas Trabajadas"
    - Calcula horas regulares por empleado
    - Calcula horas extras por empleado
    - Aplica políticas de redondeo configuradas
    - Identifica inconsistencias (ej: días sin registros)
11. **Sistema** ejecuta "Fase 3: Cálculo de Salarios Base"
    - Multiplica horas regulares por salario base/hora
    - Calcula pago de horas extras (factor configurado)
    - Suma salarios base más horas extras
12. **Sistema** ejecuta "Fase 4: Aplicación de Bonificaciones"
    - Aplica bonificaciones por productividad (si están configuradas)
    - Aplica bonificaciones fijas (aguinaldo proporcional, etc.)
    - Calcula incentivos por metas cumplidas
13. **Sistema** ejecuta "Fase 5: Aplicación de Deducciones"
    - Calcula CCSS (empleado): 9.34% del salario bruto
    - Calcula Impuesto sobre la Renta (según tabla del gobierno)
    - Aplica deducciones voluntarias (seguros, préstamos, etc.)
    - Aplica otras deducciones configuradas
14. **Sistema** ejecuta "Fase 6: Cálculo Final"
    - Calcula salario bruto (base + extras + bonificaciones)
    - Calcula total de deducciones
    - Calcula salario neto (bruto - deducciones)
    - Verifica que salario neto sea positivo
15. **Sistema** ejecuta "Fase 7: Generación de Registros"
    - Crea registros en tabla `nomina` para cada empleado
    - Genera número de nómina único para el período
    - Establece estado como "CALCULADA"
16. **Sistema** muestra resumen de procesamiento:
    - Empleados procesados exitosamente: X
    - Empleados con errores: Y (si los hay)
    - Total salarios brutos: ₡XXX,XXX
    - Total deducciones: ₡XXX,XXX
    - Total a pagar: ₡XXX,XXX
17. **Usuario** revisa el resumen y verifica que sea correcto
18. **Usuario** hace clic en "Aprobar Nómina"
19. **Sistema** solicita confirmación: "¿Está seguro de aprobar la nómina? Esta acción no se puede deshacer"
20. **Usuario** confirma la aprobación
21. **Sistema** ejecuta "Fase 8: Generación de Recibos"
    - Genera recibo de pago PDF para cada empleado
    - Incluye detalles completos de cálculo
    - Almacena recibos en sistema de archivos
22. **Sistema** actualiza estado de nómina a "APROBADA"
23. **Sistema** registra la actividad en logs de auditoría
24. **Sistema** envía notificaciones automáticas (si está configurado):
    - Email a empleados con su recibo adjunto
    - Notificación a gerencia sobre nómina lista
25. **Sistema** muestra mensaje de éxito: "Nómina procesada exitosamente"
26. **Sistema** ofrece opciones:
    - Descargar reporte resumen
    - Ver lista de recibos generados
    - Procesar pagos bancarios (siguiente paso)

---

## 4. FLUJOS ALTERNATIVOS

### 4.1 Período Ya Procesado (A1)

**Punto de Extensión:** Después del paso 5 del flujo principal

1. **Sistema** detecta que el período ya fue procesado anteriormente
2. **Sistema** muestra mensaje: "Este período ya fue procesado el [fecha]"
3. **Sistema** presenta opciones:
   - Ver nómina existente
   - Regenerar recibos (si es necesario)
   - Procesar corrección (con permisos especiales)
4. **Usuario** selecciona acción deseada
5. Según selección, continúa a proceso correspondiente

### 4.2 Datos de Asistencia Incompletos (A2)

**Punto de Extensión:** Después del paso 9 del flujo principal

1. **Sistema** identifica empleados con registros de asistencia incompletos
2. **Sistema** muestra lista detallada:
   - Nombre del empleado
   - Días faltantes
   - Tipo de falta (sin entrada, sin salida, día completo)
3. **Sistema** pregunta: "¿Desea continuar con datos incompletos?"
4. Si **Usuario** selecciona "Continuar":
   a. **Sistema** aplica políticas por defecto (ej: día no trabajado)
   b. **Sistema** marca registros como "con excepciones"
5. Si **Usuario** selecciona "Corregir":
   a. **Sistema** abre módulo de corrección de asistencia
   b. **Usuario** corrige los datos faltantes
   c. Regresa al paso 9 del flujo principal

### 4.3 Error en Cálculos (A3)

**Punto de Extensión:** Durante cualquier fase de cálculo (pasos 10-15)

1. **Sistema** detecta error en cálculo (ej: división por cero, datos corruptos)
2. **Sistema** detiene el procesamiento
3. **Sistema** registra el error detallado en logs
4. **Sistema** muestra mensaje: "Error en cálculo de nómina. Verifique configuraciones"
5. **Sistema** especifica el tipo de error y empleado afectado (si aplica)
6. **Usuario** corrige la configuración o datos problemáticos
7. Regresa al paso 8 del flujo principal

### 4.4 Salario Neto Negativo (A4)

**Punto de Extensión:** Después del paso 14 del flujo principal

1. **Sistema** detecta que un empleado tiene salario neto negativo o cero
2. **Sistema** muestra alerta específica:
   - Nombre del empleado
   - Salario bruto calculado
   - Total de deducciones
   - Salario neto resultante
3. **Sistema** pregunta: "¿Cómo proceder con este empleado?"
4. **Usuario** selecciona opción:
   a. "Ajustar deducciones" → Sistema reduce deducciones al máximo legal
   b. "Excluir de nómina" → Sistema marca empleado como excepción
   c. "Pago mínimo" → Sistema establece salario mínimo legal
5. **Sistema** aplica la corrección seleccionada
6. Continúa con paso 15 del flujo principal

### 4.5 Falla en Generación de Recibos (A5)

**Punto de Extensión:** Durante el paso 21 del flujo principal

1. **Sistema** detecta error al generar recibos PDF
2. **Sistema** registra el error específico
3. **Sistema** continúa con nómina aprobada pero sin recibos
4. **Sistema** muestra mensaje: "Nómina aprobada pero error en recibos"
5. **Sistema** ofrece: "Regenerar recibos más tarde"
6. Continúa con paso 22 del flujo principal

### 4.6 Error en Envío de Notificaciones (A6)

**Punto de Extensión:** Durante el paso 24 del flujo principal

1. **Sistema** detecta falla en servicio de email
2. **Sistema** registra empleados afectados
3. **Sistema** continúa con proceso normal
4. **Sistema** muestra advertencia: "Nómina procesada, pero no se enviaron emails"
5. **Sistema** programa reintento automático para más tarde

---

## 5. REQUERIMIENTOS ESPECIALES

### 5.1 Requerimientos de Rendimiento
- Procesamiento completo no debe exceder 5 minutos para 500 empleados
- Generación de recibos debe ser paralela para optimizar tiempo
- Base de datos debe mantenerse responsiva durante procesamiento

### 5.2 Requerimientos de Seguridad
- Solo usuarios con rol Admin o Contador pueden procesar nómina
- Todos los cálculos deben ser auditables y reversibles
- Los archivos de recibos deben estar protegidos con acceso limitado
- Se debe mantener backup automático antes del procesamiento

### 5.3 Requerimientos de Exactitud
- Todos los cálculos deben ser precisos al centavo
- Se debe cumplir con legislación laboral costarricense
- Los porcentajes de CCSS e impuestos deben estar actualizados
- Se debe validar contra salarios mínimos legales

### 5.4 Requerimientos de Trazabilidad
- Cada cálculo debe ser reproducible independientemente
- Se debe registrar quién procesó la nómina y cuándo
- Los cambios en configuraciones deben estar versionados
- Se debe mantener historial de correcciones

---

## 6. INFORMACIÓN ADICIONAL

### 6.1 Frecuencia de Uso
- **Mensual:** Una vez por mes (fin de mes)
- **Duración típica:** 15-30 minutos por procesamiento
- **Usuarios:** 1-2 personas autorizadas

### 6.2 Reglas de Negocio
- **RN-030:** CCSS empleado: 9.34% del salario bruto
- **RN-031:** Impuesto sobre la renta según tabla fiscal vigente
- **RN-032:** Horas extras: 1.5x el valor de hora regular
- **RN-033:** Salario mínimo legal debe respetarse siempre
- **RN-034:** Aguinaldo proporcional: 1/12 del salario anual

### 6.3 Supuestos y Dependencias
- **Supuesto:** Configuraciones fiscales están actualizadas
- **Supuesto:** Registros de asistencia son precisos y completos
- **Dependencia:** Módulo de asistencia operativo
- **Dependencia:** Configuración de salarios actualizada
- **Dependencia:** Servicio de generación de PDF funcionando

### 6.4 Problemas Abiertos
- Integración con sistemas bancarios para pagos automáticos
- Manejo de empleados con múltiples asignaciones
- Cálculo automático de vacaciones proporcionales

---

## 7. TRAZABILIDAD

### 7.1 Relación con Requerimientos
- **RF-014:** Generación de recibo de pago
- **RF-015:** Reporte de nómina mensual
- **RF-011:** Configuración de salario base
- **RF-012:** Cálculo de horas extras
- **RF-013:** Aplicación de deducciones

### 7.2 Relación con Azure DevOps
- **Feature ID:** 15 - Proceso de Nómina
- **Feature ID:** 12 - Configuración de cálculos de pago
- **Feature ID:** 14 - Registro de Deducciones
- **User Stories:** HU-014, HU-015, HU-011, HU-012, HU-013
- **Epic:** Gestión de Nómina y Finanzas

### 7.3 Casos de Uso Relacionados
- **CU-003:** Registrar Asistencia (fuente de datos)
- **CU-002:** Registrar Empleado (empleados a procesar)
- **CU-006:** Generar Reporte Ejecutivo (usa datos de nómina)

---

**Elaborado por:** Equipo de Desarrollo  
**Revisado por:** Contador General  
**Aprobado por:** Gerente Financiero  
**Estado:** Aprobado para Implementación
