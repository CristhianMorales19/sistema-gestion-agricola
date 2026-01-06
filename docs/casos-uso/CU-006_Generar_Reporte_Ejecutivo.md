# ESPECIFICACIÓN DE CASO DE USO

**Sistema:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Caso de Uso:** CU-006 - Generar Reporte Ejecutivo  
**Versión:** 1.0  
**Fecha:** Diciembre 2024  

---

## 1. INFORMACIÓN GENERAL

### 1.1 Identificación
- **ID:** CU-006
- **Nombre:** Generar Reporte Ejecutivo
- **Actor Principal:** Gerente / Administrador
- **Nivel:** Objetivo del Negocio
- **Estado:** Activo

### 1.2 Resumen
Este caso de uso describe el proceso de generación de reportes ejecutivos consolidados que presentan métricas clave de desempeño (KPIs) del negocio agroindustrial, incluyendo datos de recursos humanos, productividad, asistencia y finanzas para la toma de decisiones estratégicas.

### 1.3 Actores
- **Actor Principal:** Administrador, Gerente RRHH, Usuarios con rol Visual
- **Actores Secundarios:** Sistema de Reportes, Base de Datos, Servicio de Exportación

---

## 2. ESPECIFICACIÓN DEL CASO DE USO

### 2.1 Precondiciones
- El usuario debe estar autenticado con permisos de reportes
- Debe existir información histórica en el sistema (mínimo 1 mes)
- Los módulos de asistencia, nómina y productividad deben estar operativos
- Las configuraciones de KPIs deben estar definidas

### 2.2 Garantía de Éxito (Postcondiciones)
- Se genera reporte ejecutivo con datos actualizados
- El reporte incluye visualizaciones (gráficos, tendencias)
- Se puede exportar en múltiples formatos (PDF, Excel)
- Los datos están correctamente calculados y validados
- El reporte queda guardado para consultas futuras

### 2.3 Garantía Mínima
- Se generan reportes básicos aunque algunos datos no estén disponibles
- Se mantiene consistencia en cálculos y fórmulas
- Se registra actividad de generación de reportes

---

## 3. FLUJO PRINCIPAL DE EVENTOS

### 3.1 Escenario Exitoso

1. **Usuario** accede al módulo "Gestión de Reportes"
2. **Usuario** selecciona "Generar Reporte Ejecutivo"
3. **Sistema** presenta configurador de reporte con opciones:
   - **Período de Análisis:**
     - Rango de fechas personalizable
     - Períodos predefinidos (Último mes, Trimestre, Año)
   - **Módulos a Incluir:**
     - ☑ Recursos Humanos
     - ☑ Asistencia y Puntualidad  
     - ☑ Productividad
     - ☑ Indicadores Financieros
   - **Nivel de Detalle:**
     - Resumen ejecutivo
     - Detalle por departamento
     - Comparativo con períodos anteriores
   - **Formato de Salida:**
     - PDF (para presentaciones)
     - Excel (para análisis)
     - Dashboard web (para visualización)
4. **Usuario** selecciona período de análisis (ej: "Último trimestre")
5. **Usuario** confirma módulos a incluir (por defecto todos marcados)
6. **Usuario** elige nivel de detalle según audiencia del reporte
7. **Usuario** selecciona formato de salida deseado
8. **Usuario** hace clic en "Generar Reporte"
9. **Sistema** muestra indicador de progreso: "Generando reporte ejecutivo..."
10. **Sistema** ejecuta "Fase 1: Recopilación de Datos"
    - Extrae datos de asistencia del período
    - Obtiene métricas de productividad
    - Recopila información financiera (nóminas)
    - Calcula indicadores de RRHH
11. **Sistema** ejecuta "Fase 2: Cálculo de KPIs"
    - **KPIs de Asistencia:**
      - Porcentaje de asistencia global
      - Índice de puntualidad
      - Días de ausencia promedio por empleado
    - **KPIs de Productividad:**
      - Rendimiento promedio por empleado
      - Cumplimiento de metas por departamento
      - Eficiencia por tipo de tarea
    - **KPIs Financieros:**
      - Costo de mano de obra por hectárea
      - Variación salarial vs período anterior
      - Distribución de costos por departamento
    - **KPIs de RRHH:**
      - Rotación de personal
      - Satisfacción laboral (si hay datos)
      - Distribución por cargos y departamentos
12. **Sistema** ejecuta "Fase 3: Análisis de Tendencias"
    - Compara KPIs con períodos anteriores
    - Identifica tendencias positivas y negativas
    - Calcula porcentajes de cambio
    - Detecta patrones estacionales
13. **Sistema** ejecuta "Fase 4: Generación de Visualizaciones"
    - Crea gráficos de barras para comparativos
    - Genera gráficos de línea para tendencias
    - Produce gráficos circulares para distribuciones
    - Crea mapas de calor para productividad por área
14. **Sistema** ejecuta "Fase 5: Compilación del Reporte"
    - Estructura el reporte según plantilla ejecutiva
    - Incluye resumen ejecutivo en primera página
    - Organiza secciones por módulo
    - Añade insights y recomendaciones automáticas
15. **Sistema** genera archivo en formato solicitado
16. **Sistema** presenta vista previa del reporte generado
17. **Usuario** revisa la vista previa y verifica contenido
18. **Usuario** hace clic en "Finalizar y Descargar"
19. **Sistema** registra la generación en logs de auditoría
20. **Sistema** almacena copia del reporte en sistema de archivos
21. **Sistema** inicia descarga automática del archivo
22. **Sistema** muestra mensaje: "Reporte ejecutivo generado exitosamente"
23. **Sistema** ofrece opciones adicionales:
    - Programar generación automática recurrente
    - Compartir por email con stakeholders
    - Generar en formato adicional

---

## 4. FLUJOS ALTERNATIVOS

### 4.1 Datos Insuficientes (A1)
1. **Sistema** detecta que no hay suficientes datos para el período
2. **Sistema** muestra advertencia: "Datos limitados para el período seleccionado"
3. **Sistema** sugiere ampliar rango de fechas o genera reporte parcial
4. **Usuario** decide entre ampliar período o continuar con datos disponibles

### 4.2 Error en Cálculos (A2)
1. **Sistema** detecta inconsistencias en datos durante cálculos
2. **Sistema** registra errores específicos en logs
3. **Sistema** excluye datos problemáticos y marca secciones afectadas
4. **Sistema** incluye nota técnica sobre limitaciones en el reporte

### 4.3 Falla en Generación de Archivo (A3)
1. **Sistema** detecta error al generar archivo final
2. **Sistema** ofrece formato alternativo
3. **Sistema** permite guardar datos en dashboard web como respaldo

---

## 5. INFORMACIÓN ADICIONAL

### 5.1 KPIs Principales Incluidos

**Asistencia y Puntualidad:**
- Porcentaje de asistencia mensual
- Índice de puntualidad (% llegadas a tiempo)
- Promedio de horas extras por empleado
- Días de permiso utilizados vs disponibles

**Productividad:**
- Rendimiento por empleado (tareas/día)
- Cumplimiento de metas por departamento
- Eficiencia por tipo de cultivo
- Tiempo promedio de completar tareas

**Indicadores Financieros:**
- Costo total de nómina por período
- Costo de mano de obra por unidad producida
- Variación de costos vs presupuesto
- Distribución de gastos por concepto

**Recursos Humanos:**
- Número total de empleados activos
- Rotación de personal (%)
- Distribución por departamentos
- Crecimiento/reducción de plantilla

### 5.2 Reglas de Negocio
- **RN-050:** Reportes solo incluyen datos de empleados activos
- **RN-051:** Comparativos requieren mínimo 2 períodos de datos
- **RN-052:** Datos financieros solo visibles para roles autorizados
- **RN-053:** Reportes se archivan automáticamente por 2 años

### 5.3 Trazabilidad
- **Feature ID:** 16 - Reporte de Asistencia, 17 - Reporte de Productividad
- **User Stories:** HU-020, HU-022, HU-023, HU-024, HU-025
- **Epic:** Inteligencia de Negocio y Reportes

---

**Estado:** Aprobado para Implementación
