# Plantillas de Work Items para Azure DevOps - Sistema Gestión Agrícola

Este documento contiene las plantillas exactas para crear los work items en Azure DevOps, incluyendo el formato CSV para importación masiva.

---

## 📋 Plantilla CSV para Importación Masiva

### **Épicas (6 items)**
```csv
Work Item Type,Title,Area Path,Priority,Value Area,Tags,Description,Story Points
Epic,GESTIÓN DE IDENTIDAD Y ACCESO,sistema-gestion-agricola,1,Business,"epic,auth",Gestión de roles y usuarios del sistema agrícola,13
Epic,ADMINISTRACIÓN DE PERSONAL AGRÍCOLA,sistema-gestion-agricola,1,Business,"epic,personal",Gestión de trabajadores y cuadrillas agrícolas,12
Epic,CONTROL DE ASISTENCIA Y PRODUCTIVIDAD,sistema-gestion-agricola,2,Business,"epic,asistencia",Control de asistencia y registro de productividad,18
Epic,GESTIÓN AGRÍCOLA Y TAREAS,sistema-gestion-agricola,2,Business,"epic,agricola",Gestión de cultivos parcelas y tareas programadas,21
Epic,GESTIÓN DE NÓMINA Y PAGOS,sistema-gestion-agricola,3,Business,"epic,nomina",Sistema completo de esquemas de pago y nómina,24
Epic,GESTIÓN DE REPORTES Y ANÁLISIS,sistema-gestion-agricola,4,Business,"epic,reportes",Sistema de reportes y exportación de datos,12
```

### **Features (14 items principales)**
```csv
Work Item Type,Title,Area Path,Priority,Value Area,Parent,Tags,Description
Feature,Gestión de Roles y Usuarios,sistema-gestion-agricola\Backend\Autenticacion,1,Business,GESTIÓN DE IDENTIDAD Y ACCESO,"feature,roles",Sistema de roles y asignación de usuarios
Feature,Consultas de Personal,sistema-gestion-agricola\Frontend\Personal,1,Business,GESTIÓN DE IDENTIDAD Y ACCESO,"feature,consultas",Consulta y visualización de empleados
Feature,Gestión de Trabajadores,sistema-gestion-agricola\Frontend\Personal,1,Business,ADMINISTRACIÓN DE PERSONAL AGRÍCOLA,"feature,trabajadores",Registro y gestión de información laboral
Feature,Gestión de Cuadrillas,sistema-gestion-agricola\Backend\API,1,Business,ADMINISTRACIÓN DE PERSONAL AGRÍCOLA,"feature,cuadrillas",Creación y gestión de cuadrillas de trabajo
Feature,Registro de Asistencia,sistema-gestion-agricola\Frontend\Asistencia,2,Business,CONTROL DE ASISTENCIA Y PRODUCTIVIDAD,"feature,registro",Sistema de entrada y salida de trabajadores
Feature,Gestión de Ausencias,sistema-gestion-agricola\Frontend\Asistencia,2,Business,CONTROL DE ASISTENCIA Y PRODUCTIVIDAD,"feature,ausencias",Registro de ausencias justificadas
Feature,Control de Productividad,sistema-gestion-agricola\Frontend\Productividad,2,Business,CONTROL DE ASISTENCIA Y PRODUCTIVIDAD,"feature,productividad",Registro y seguimiento de productividad
Feature,Gestión de Cultivos,sistema-gestion-agricola\Backend\API,2,Business,GESTIÓN AGRÍCOLA Y TAREAS,"feature,cultivos",Gestión de tipos de cultivo y parcelas
Feature,Gestión de Tareas,sistema-gestion-agricola\Backend\Servicios,2,Business,GESTIÓN AGRÍCOLA Y TAREAS,"feature,tareas",Creación y asignación de tareas programadas
Feature,Condiciones de Trabajo,sistema-gestion-agricola\Backend\API,2,Business,GESTIÓN AGRÍCOLA Y TAREAS,"feature,condiciones",Registro de condiciones generales de trabajo
Feature,Esquemas de Pago,sistema-gestion-agricola\Backend\API,3,Business,GESTIÓN DE NÓMINA Y PAGOS,"feature,esquemas",Configuración de esquemas y fórmulas de pago
Feature,Procesamiento de Nómina,sistema-gestion-agricola\Backend\Servicios,3,Business,GESTIÓN DE NÓMINA Y PAGOS,"feature,nomina",Procesamiento completo de nómina mensual
Feature,Reportes Operativos,sistema-gestion-agricola\Frontend\Reportes,4,Business,GESTIÓN DE REPORTES Y ANÁLISIS,"feature,reportes",Generación de reportes de asistencia y productividad
Feature,Exportación de Datos,sistema-gestion-agricola\Backend\API,4,Business,GESTIÓN DE REPORTES Y ANÁLISIS,"feature,exportacion",Exportación y consulta de datos históricos
```

### **User Stories (33 items - HU reales del sistema)**
```csv
Work Item Type,Title,Area Path,Priority,Story Points,Parent,Tags,Acceptance Criteria,Description
User Story,Crear registro de trabajador,sistema-gestion-agricola\Frontend\Personal,1,3,Gestión de Trabajadores,"sprint-1,personal","Administrador puede registrar trabajador con datos completos","Como administrador quiero registrar un nuevo trabajador para incorporarlo al sistema agrícola"
User Story,Asignar información laboral al trabajador,sistema-gestion-agricola\Frontend\Personal,1,3,Gestión de Trabajadores,"sprint-1,personal","Administrador puede asignar información laboral específica","Como administrador quiero asignar información laboral para completar perfil del trabajador"
User Story,Crear cuadrilla de trabajo,sistema-gestion-agricola\Backend\API,1,3,Gestión de Cuadrillas,"sprint-1,cuadrillas","Supervisor puede crear cuadrillas de trabajo","Como supervisor quiero crear cuadrillas para organizar el trabajo por equipos"
User Story,Asignar trabajadores a cuadrilla,sistema-gestion-agricola\Backend\API,2,2,Gestión de Cuadrillas,"sprint-2,cuadrillas","Supervisor puede asignar trabajadores a cuadrillas específicas","Como supervisor quiero asignar trabajadores a cuadrillas para organizar equipos de trabajo"
User Story,Crear roles de usuario,sistema-gestion-agricola\Backend\Autenticacion,1,2,Gestión de Roles y Usuarios,"sprint-1,auth","Administrador puede crear diferentes roles de usuario","Como administrador quiero crear roles para definir permisos en el sistema"
User Story,Asignar rol a usuario,sistema-gestion-agricola\Backend\Autenticacion,1,2,Gestión de Roles y Usuarios,"sprint-1,auth","Administrador puede asignar roles a usuarios específicos","Como administrador quiero asignar roles para controlar acceso al sistema"
User Story,Registrar entrada de trabajador,sistema-gestion-agricola\Frontend\Asistencia,2,3,Registro de Asistencia,"sprint-2,asistencia","Trabajador puede registrar entrada con timestamp","Como trabajador quiero marcar mi entrada para registrar inicio de jornada"
User Story,Registrar salida de trabajador,sistema-gestion-agricola\Frontend\Asistencia,2,3,Registro de Asistencia,"sprint-2,asistencia","Trabajador puede registrar salida con timestamp","Como trabajador quiero marcar mi salida para registrar fin de jornada"
User Story,Registrar productividad de trabajador,sistema-gestion-agricola\Frontend\Productividad,2,2,Control de Productividad,"sprint-2,productividad","Trabajador puede registrar su productividad diaria","Como trabajador quiero registrar mi productividad para demostrar rendimiento"
User Story,Registrar ausencia justificada,sistema-gestion-agricola\Frontend\Asistencia,2,2,Gestión de Ausencias,"sprint-2,ausencias","Trabajador puede registrar ausencias con justificación","Como trabajador quiero registrar ausencias justificadas para mantener control de asistencia"
User Story,Crear tarea programada,sistema-gestion-agricola\Backend\Servicios,3,3,Gestión de Tareas,"sprint-3,tareas","Supervisor puede crear tareas programadas para cuadrillas","Como supervisor quiero programar tareas para planificar trabajo agrícola"
User Story,Asignar tarea a cuadrilla o trabajador,sistema-gestion-agricola\Frontend\Productividad,3,3,Gestión de Tareas,"sprint-3,tareas","Supervisor puede asignar tareas específicas a cuadrillas o trabajadores","Como supervisor quiero asignar tareas para distribuir trabajo eficientemente"
User Story,Registrar condiciones generales de trabajo,sistema-gestion-agricola\Backend\API,2,1,Condiciones de Trabajo,"sprint-2,condiciones","Supervisor puede registrar condiciones ambientales y de trabajo","Como supervisor quiero registrar condiciones para documentar contexto laboral"
User Story,Crear tipo de cultivo,sistema-gestion-agricola\Backend\API,3,2,Gestión de Cultivos,"sprint-3,cultivos","Administrador puede crear diferentes tipos de cultivo","Como administrador quiero crear tipos de cultivo para categorizar trabajo agrícola"
User Story,Crear tarea específica para cultivo,sistema-gestion-agricola\Backend\API,3,3,Gestión de Cultivos,"sprint-3,cultivos","Administrador puede crear tareas específicas por tipo de cultivo","Como administrador quiero crear tareas específicas para optimizar trabajo por cultivo"
User Story,Registrar parcela agrícola,sistema-gestion-agricola\Frontend\Personal,3,3,Gestión de Cultivos,"sprint-3,parcelas","Administrador puede registrar parcelas con ubicación y características","Como administrador quiero registrar parcelas para organizar trabajo por zonas"
User Story,Asignar cultivo a parcela,sistema-gestion-agricola\Backend\API,3,2,Gestión de Cultivos,"sprint-3,cultivos","Administrador puede asignar cultivos específicos a parcelas","Como administrador quiero asignar cultivos a parcelas para planificar producción"
User Story,Crear esquema de pago,sistema-gestion-agricola\Backend\API,4,3,Esquemas de Pago,"sprint-4,pago","Administrador puede crear diferentes esquemas de pago","Como administrador quiero crear esquemas de pago para remunerar trabajo diferenciado"
User Story,Configurar fórmula de cálculo,sistema-gestion-agricola\Backend\Servicios,4,5,Esquemas de Pago,"sprint-4,pago","Administrador puede configurar fórmulas complejas de cálculo","Como administrador quiero configurar fórmulas para automatizar cálculos de pago"
User Story,Asignar esquema de pago a tarea,sistema-gestion-agricola\Backend\API,4,3,Esquemas de Pago,"sprint-4,pago","Administrador puede asignar esquemas de pago a tareas específicas","Como administrador quiero asignar esquemas para establecer tarifas por tarea"
User Story,Crear bonificación,sistema-gestion-agricola\Backend\API,4,2,Esquemas de Pago,"sprint-4,pago","Administrador puede crear bonificaciones especiales","Como administrador quiero crear bonificaciones para incentivar productividad"
User Story,Iniciar período de nómina,sistema-gestion-agricola\Backend\Servicios,4,3,Procesamiento de Nómina,"sprint-4,nomina","Administrador puede iniciar proceso de nómina mensual","Como administrador quiero iniciar nómina para procesar pagos mensuales"
User Story,Generar preliquidación,sistema-gestion-agricola\Frontend\Nomina,4,2,Procesamiento de Nómina,"sprint-4,nomina","Sistema genera preliquidación antes de nómina final","Como administrador quiero ver preliquidación para revisar antes de procesar"
User Story,Revisar nómina individual,sistema-gestion-agricola\Frontend\Nomina,5,3,Procesamiento de Nómina,"sprint-5,nomina","Administrador puede revisar nómina de cada trabajador","Como administrador quiero revisar nóminas individuales para verificar cálculos"
User Story,Ajustar datos en nómina,sistema-gestion-agricola\Frontend\Nomina,5,2,Procesamiento de Nómina,"sprint-5,nomina","Administrador puede hacer ajustes manuales en nómina","Como administrador quiero ajustar nómina para corregir errores o situaciones especiales"
User Story,Aprobar nómina,sistema-gestion-agricola\Backend\Servicios,5,2,Procesamiento de Nómina,"sprint-5,nomina","Administrador puede aprobar nómina final","Como administrador quiero aprobar nómina para autorizar pagos"
User Story,Generar recibo individual,sistema-gestion-agricola\Backend\API,5,3,Procesamiento de Nómina,"sprint-5,nomina","Sistema genera recibos individuales para cada trabajador","Como trabajador quiero recibir mi recibo para conocer detalles de mi pago"
User Story,Registrar deducción especial,sistema-gestion-agricola\Backend\Servicios,5,2,Procesamiento de Nómina,"sprint-5,nomina","Administrador puede registrar deducciones especiales","Como administrador quiero registrar deducciones para aplicar descuentos específicos"
User Story,Generar reporte de asistencia,sistema-gestion-agricola\Frontend\Reportes,5,2,Reportes Operativos,"sprint-5,reportes","Usuario puede generar reportes de asistencia por período","Como supervisor quiero generar reportes de asistencia para evaluar cumplimiento"
User Story,Generar reporte de productividad,sistema-gestion-agricola\Frontend\Reportes,5,2,Reportes Operativos,"sprint-5,reportes","Usuario puede generar reportes de productividad por trabajador/cuadrilla","Como supervisor quiero generar reportes de productividad para evaluar rendimiento"
User Story,Consultar historial de pagos,sistema-gestion-agricola\Frontend\Reportes,5,1,Reportes Operativos,"sprint-5,reportes","Usuario puede consultar historial de pagos de trabajadores","Como administrador quiero consultar historial para verificar pagos anteriores"
User Story,Exportar datos de nómina,sistema-gestion-agricola\Backend\API,5,3,Exportación de Datos,"sprint-5,exportacion","Usuario puede exportar datos de nómina a Excel/PDF","Como administrador quiero exportar datos para enviar a contabilidad externa"
User Story,Consulta de empleados,sistema-gestion-agricola\Frontend\Personal,1,2,Consultas de Personal,"sprint-1,personal","Usuario puede consultar listado y detalles de empleados","Como usuario quiero consultar empleados para verificar información del personal"
```

---

## 🔧 Comandos Azure CLI para Configuración Automática

### **Configuración Inicial del Proyecto**
```bash
# Login en Azure DevOps
az login

# Configurar organización por defecto
az devops configure --defaults organization=https://dev.azure.com/[tu-organizacion]

# Crear proyecto
az devops project create --name "sistema-gestion-agricola" --process "Scrum" --visibility private

# Configurar proyecto por defecto
az devops configure --defaults project="sistema-gestion-agricola"
```

### **Configuración de Iterations (Sprints)**
```bash
# Crear iteration root
az boards iteration project create --name "sistema-gestion-agricola" --path "\sistema-gestion-agricola"

# Crear sprints con fechas actualizadas 2025-2026
az boards iteration project create --name "Sprint 1" --path "\sistema-gestion-agricola\Sprint 1" --start-date "2025-09-02" --finish-date "2025-09-15"
az boards iteration project create --name "Sprint 2" --path "\sistema-gestion-agricola\Sprint 2" --start-date "2025-09-16" --finish-date "2025-09-29"
az boards iteration project create --name "Sprint 3" --path "\sistema-gestion-agricola\Sprint 3" --start-date "2025-12-01" --finish-date "2025-12-21"
az boards iteration project create --name "Sprint 4" --path "\sistema-gestion-agricola\Sprint 4" --start-date "2025-12-22" --finish-date "2026-01-11"
az boards iteration project create --name "Sprint 5" --path "\sistema-gestion-agricola\Sprint 5" --start-date "2026-01-12" --finish-date "2026-01-25"
```

### **Configuración de Areas**
```bash
# Crear area paths
az boards area project create --name "Frontend" --path "\sistema-gestion-agricola\Frontend"
az boards area project create --name "Backend" --path "\sistema-gestion-agricola\Backend"
az boards area project create --name "DevOps" --path "\sistema-gestion-agricola\DevOps"

# Sub-areas Frontend
az boards area project create --name "Autenticacion" --path "\sistema-gestion-agricola\Frontend\Autenticacion"
az boards area project create --name "Personal" --path "\sistema-gestion-agricola\Frontend\Personal"
az boards area project create --name "Asistencia" --path "\sistema-gestion-agricola\Frontend\Asistencia"
az boards area project create --name "Nomina" --path "\sistema-gestion-agricola\Frontend\Nomina"
az boards area project create --name "Productividad" --path "\sistema-gestion-agricola\Frontend\Productividad"
az boards area project create --name "Reportes" --path "\sistema-gestion-agricola\Frontend\Reportes"

# Sub-areas Backend
az boards area project create --name "API" --path "\sistema-gestion-agricola\Backend\API"
az boards area project create --name "Autenticacion" --path "\sistema-gestion-agricola\Backend\Autenticacion"
az boards area project create --name "Base-Datos" --path "\sistema-gestion-agricola\Backend\Base-Datos"
az boards area project create --name "Servicios" --path "\sistema-gestion-agricola\Backend\Servicios"
```

---

## 📊 PowerShell Script para Creación Masiva de Work Items

### **Script de Creación de Épicas**
```powershell
# Configuración
$organization = "https://dev.azure.com/[tu-organizacion]"
$project = "sistema-gestion-agricola"

# Array de épicas
$epicas = @(
    @{Title="GESTIÓN DE IDENTIDAD Y ACCESO"; Priority=1; StoryPoints=13; Tags="epic,auth"}
    @{Title="ADMINISTRACIÓN DE PERSONAL"; Priority=1; StoryPoints=8; Tags="epic,personal"}
    @{Title="CONTROL DE ASISTENCIA LABORAL"; Priority=2; StoryPoints=21; Tags="epic,asistencia"}
    @{Title="GESTIÓN DE NÓMINA Y FINANZAS"; Priority=2; StoryPoints=18; Tags="epic,nomina"}
    @{Title="CONTROL DE PRODUCTIVIDAD AGRÍCOLA"; Priority=3; StoryPoints=24; Tags="epic,productividad"}
    @{Title="GESTIÓN DE REPORTES Y ANÁLISIS"; Priority=4; StoryPoints=16; Tags="epic,reportes"}
)

# Crear épicas
foreach ($epica in $epicas) {
    az boards work-item create --type "Epic" --title $epica.Title --area $project --priority $epica.Priority
}
```

### **Script de Creación de User Stories**
```powershell
# User Stories para Sprint 1
$sprint1Stories = @(
    @{Title="Crear registro de trabajador"; Points=3; Area="Frontend\Personal"; Sprint="Sprint 1"}
    @{Title="Asignar información laboral al trabajador"; Points=3; Area="Frontend\Personal"; Sprint="Sprint 1"}
    @{Title="Crear cuadrilla de trabajo"; Points=3; Area="Backend\API"; Sprint="Sprint 1"}
    @{Title="Crear roles de usuario"; Points=2; Area="Backend\Autenticacion"; Sprint="Sprint 1"}
    @{Title="Asignar rol a usuario"; Points=2; Area="Backend\Autenticacion"; Sprint="Sprint 1"}
    @{Title="Consulta de empleados"; Points=2; Area="Frontend\Personal"; Sprint="Sprint 1"}
)

# User Stories para Sprint 2
$sprint2Stories = @(
    @{Title="Registrar entrada de trabajador"; Points=3; Area="Frontend\Asistencia"; Sprint="Sprint 2"}
    @{Title="Registrar salida de trabajador"; Points=3; Area="Frontend\Asistencia"; Sprint="Sprint 2"}
    @{Title="Registrar ausencia justificada"; Points=2; Area="Frontend\Asistencia"; Sprint="Sprint 2"}
    @{Title="Asignar trabajadores a cuadrilla"; Points=2; Area="Backend\API"; Sprint="Sprint 2"}
    @{Title="Registrar productividad de trabajador"; Points=2; Area="Frontend\Productividad"; Sprint="Sprint 2"}
    @{Title="Registrar condiciones generales de trabajo"; Points=1; Area="Backend\API"; Sprint="Sprint 2"}
)

# User Stories para Sprint 3
$sprint3Stories = @(
    @{Title="Crear tipo de cultivo"; Points=2; Area="Backend\API"; Sprint="Sprint 3"}
    @{Title="Crear tarea específica para cultivo"; Points=3; Area="Backend\API"; Sprint="Sprint 3"}
    @{Title="Registrar parcela agrícola"; Points=3; Area="Frontend\Personal"; Sprint="Sprint 3"}
    @{Title="Asignar cultivo a parcela"; Points=2; Area="Backend\API"; Sprint="Sprint 3"}
    @{Title="Crear tarea programada"; Points=3; Area="Backend\Servicios"; Sprint="Sprint 3"}
    @{Title="Asignar tarea a cuadrilla o trabajador"; Points=3; Area="Frontend\Productividad"; Sprint="Sprint 3"}
)

# User Stories para Sprint 4
$sprint4Stories = @(
    @{Title="Crear esquema de pago"; Points=3; Area="Backend\API"; Sprint="Sprint 4"}
    @{Title="Configurar fórmula de cálculo"; Points=5; Area="Backend\Servicios"; Sprint="Sprint 4"}
    @{Title="Asignar esquema de pago a tarea"; Points=3; Area="Backend\API"; Sprint="Sprint 4"}
    @{Title="Crear bonificación"; Points=2; Area="Backend\API"; Sprint="Sprint 4"}
    @{Title="Iniciar período de nómina"; Points=3; Area="Backend\Servicios"; Sprint="Sprint 4"}
    @{Title="Generar preliquidación"; Points=2; Area="Frontend\Nomina"; Sprint="Sprint 4"}
)

# User Stories para Sprint 5
$sprint5Stories = @(
    @{Title="Revisar nómina individual"; Points=3; Area="Frontend\Nomina"; Sprint="Sprint 5"}
    @{Title="Ajustar datos en nómina"; Points=2; Area="Frontend\Nomina"; Sprint="Sprint 5"}
    @{Title="Aprobar nómina"; Points=2; Area="Backend\Servicios"; Sprint="Sprint 5"}
    @{Title="Generar recibo individual"; Points=3; Area="Backend\API"; Sprint="Sprint 5"}
    @{Title="Registrar deducción especial"; Points=2; Area="Backend\Servicios"; Sprint="Sprint 5"}
    @{Title="Generar reporte de asistencia"; Points=2; Area="Frontend\Reportes"; Sprint="Sprint 5"}
    @{Title="Generar reporte de productividad"; Points=2; Area="Frontend\Reportes"; Sprint="Sprint 5"}
    @{Title="Consultar historial de pagos"; Points=1; Area="Frontend\Reportes"; Sprint="Sprint 5"}
    @{Title="Exportar datos de nómina"; Points=3; Area="Backend\API"; Sprint="Sprint 5"}
)

# Función para crear user stories
function Create-UserStories {
    param($stories)
    
    foreach ($story in $stories) {
        az boards work-item create --type "User Story" --title $story.Title --area "$project\$($story.Area)" --iteration "$project\$($story.Sprint)" --fields "Microsoft.VSTS.Scheduling.StoryPoints=$($story.Points)"
        Write-Host "Created: $($story.Title)" -ForegroundColor Green
    }
}

# Ejecutar creación por sprint
Create-UserStories -stories $sprint1Stories
Create-UserStories -stories $sprint2Stories
Create-UserStories -stories $sprint3Stories
Create-UserStories -stories $sprint4Stories
Create-UserStories -stories $sprint5Stories
```
```

---

## 📋 Checklist de Importación

### **Pre-requisitos** ✅
- [ ] Tener acceso de administrador a Azure DevOps
- [ ] Instalar Azure CLI con extensión devops
- [ ] Configurar autenticación con PAT (Personal Access Token)
- [ ] Tener los CSVs preparados y validados

### **Proceso de Importación** ✅
1. **Crear estructura básica:**
   - [ ] Crear proyecto con template Scrum
   - [ ] Configurar iterations (sprints)
   - [ ] Configurar area paths

2. **Importar work items:**
   - [ ] Importar épicas (6 items)
   - [ ] Importar features (16 items)
   - [ ] Importar user stories (32 items)
   - [ ] Verificar relaciones padre-hijo

3. **Configurar sprints:**
   - [ ] Asignar user stories a sprints correctos
   - [ ] Configurar capacity por sprint
   - [ ] Establecer sprint goals

4. **Configurar boards:**
   - [ ] Personalizar columnas de boards
   - [ ] Configurar swimlanes
   - [ ] Establecer WIP limits

### **Post-Importación** ✅
- [ ] Verificar todas las relaciones
- [ ] Probar boards y funcionalidad
- [ ] Configurar permisos de equipo
- [ ] Entrenar al equipo en uso de Azure DevOps

---

## 📞 Soporte y Troubleshooting

### **Errores Comunes**
1. **"Area path not found"**
   - Verificar que area paths estén creados
   - Usar path completo: `sistema-gestion-agricola\Frontend\Autenticacion`

2. **"Parent work item not found"**
   - Importar en orden: Épicas → Features → User Stories
   - Usar títulos exactos para referencias

3. **"Iteration path not found"**
   - Verificar que sprints estén configurados
   - Usar formato: `sistema-gestion-agricola\Sprint 1`

### **Comandos de Verificación**
```bash
# Listar work items
az boards work-item show --id [work-item-id]

# Listar iterations
az boards iteration project list

# Listar area paths
az boards area project list
```

---

**Última actualización:** Agosto 2025  
**Versión del documento:** 1.0  
**Compatible con:** Azure DevOps Services
