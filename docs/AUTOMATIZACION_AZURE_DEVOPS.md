# Script de Importación Masiva - Azure DevOps Sprint 1

## 📋 Archivo CSV para Importación Directa

### **Instrucciones:**
1. Copia el contenido CSV en un archivo `.csv`
2. Ve a Azure DevOps → Boards → Work Items
3. Click en "Import Work Items" 
4. Sube el archivo CSV

---

## 📊 CSV para Epic, Features, User Stories y Tasks

```csv
Work Item Type,Title,Area Path,Iteration Path,Priority,Story Points,Parent,Assigned To,Description,Acceptance Criteria,Activity,Original Estimate,Remaining Work
Epic,Gestión de Identidad y Acceso,sistema-gestion-agricola,sistema-gestion-agricola,1,8,,,"Epic para gestión completa de autenticación y roles de usuario",,,,,
Feature,Autenticación Básica,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola,1,,Gestión de Identidad y Acceso,,"Sistema de login y logout con JWT",,,,,
User Story,Login de usuario,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola\Sprint 1,1,5,Autenticación Básica,[Developer 1],"Como usuario del sistema quiero poder iniciar sesión con mi email y contraseña para acceder a las funcionalidades del sistema","- Formulario de login con email y contraseña<br>- Validación de credenciales en backend<br>- Generación y persistencia de token JWT<br>- Redirección a dashboard después de login exitoso<br>- Manejo de errores de autenticación con mensajes claros",,,,
Task,Crear modelo de Usuario en base de datos,sistema-gestion-agricola\Backend\Base-Datos,sistema-gestion-agricola\Sprint 1,2,,Login de usuario,[Developer 1],"Definir tabla usuarios con campos email password hash rol timestamps",,"Development",4,4
Task,Implementar endpoint POST /auth/login,sistema-gestion-agricola\Backend\API,sistema-gestion-agricola\Sprint 1,2,,Login de usuario,[Developer 1],"Controlador para autenticar usuario y generar JWT",,"Development",6,6
Task,Crear componente LoginForm en React,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola\Sprint 1,2,,Login de usuario,[Developer 2],"Formulario con validaciones frontend",,"Development",4,4
Task,Implementar hook useAuth para gestión de estado,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola\Sprint 1,2,,Login de usuario,[Developer 2],"Context y hook para manejar autenticación global",,"Development",3,3
Task,Testing de login con casos válidos e inválidos,sistema-gestion-agricola\Testing,sistema-gestion-agricola\Sprint 1,3,,Login de usuario,[Developer 1],"Pruebas unitarias y de integración",,"Testing",3,3
User Story,Logout de usuario,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola\Sprint 1,1,2,Autenticación Básica,[Developer 2],"Como usuario autenticado quiero poder cerrar mi sesión para proteger mi información al salir del sistema","- Botón de logout visible en header<br>- Invalidación del token JWT en backend<br>- Limpieza del estado local de autenticación<br>- Redirección automática a página de login",,,,
Task,Crear endpoint POST /auth/logout,sistema-gestion-agricola\Backend\API,sistema-gestion-agricola\Sprint 1,2,,Logout de usuario,[Developer 1],"Endpoint para invalidar token JWT",,"Development",2,2
Task,Implementar componente LogoutButton,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola\Sprint 1,2,,Logout de usuario,[Developer 2],"Botón con confirmación y manejo de estado",,"Development",2,2
Task,Configurar limpieza automática de rutas protegidas,sistema-gestion-agricola\Frontend\Autenticacion,sistema-gestion-agricola\Sprint 1,2,,Logout de usuario,[Developer 2],"Guard de rutas que valide token válido",,"Development",2,2
Epic,Administración de Personal,sistema-gestion-agricola,sistema-gestion-agricola,1,7,,,"Epic para gestión completa de trabajadores y personal agrícola",,,,,
Feature,CRUD de Trabajadores,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola,1,,Administración de Personal,,"Gestión completa de trabajadores agrícolas",,,,,
User Story,Crear registro de trabajador,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,1,5,CRUD de Trabajadores,[Developer 1],"Como administrador quiero registrar un nuevo trabajador para gestionar el personal de la empresa agrícola","- Formulario completo con datos personales y laborales<br>- Validación de cédula y email únicos<br>- Selección de cargo y departamento desde catálogos<br>- Guardado exitoso en base de datos<br>- Confirmación visual de registro exitoso",,,,
Task,Diseñar modelo de Trabajador en BD,sistema-gestion-agricola\Backend\Base-Datos,sistema-gestion-agricola\Sprint 1,2,,Crear registro de trabajador,[Developer 1],"Tabla trabajadores con todos los campos requeridos",,"Development",3,3
Task,Crear endpoint POST /trabajadores,sistema-gestion-agricola\Backend\API,sistema-gestion-agricola\Sprint 1,2,,Crear registro de trabajador,[Developer 1],"API para crear trabajador con validaciones",,"Development",5,5
Task,Desarrollar FormularioTrabajador component,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,2,,Crear registro de trabajador,[Developer 2],"Formulario completo con validaciones frontend",,"Development",6,6
Task,Implementar validaciones de negocio,sistema-gestion-agricola\Backend\Validaciones,sistema-gestion-agricola\Sprint 1,2,,Crear registro de trabajador,[Developer 1],"Validar cédula única formato email campos requeridos",,"Development",2,2
User Story,Asignar información laboral al trabajador,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,2,3,CRUD de Trabajadores,[Developer 2],"Como administrador quiero asignar información laboral específica al trabajador para mantener datos completos y actualizados","- Formulario específico para información laboral<br>- Campos: fecha ingreso salario base tipo contrato especialidades<br>- Validación de fechas y rangos salariales<br>- Actualización exitosa en base de datos",,,,
Task,Extender modelo Trabajador con info laboral,sistema-gestion-agricola\Backend\Base-Datos,sistema-gestion-agricola\Sprint 1,2,,Asignar información laboral al trabajador,[Developer 1],"Agregar campos laborales a tabla trabajadores",,"Development",2,2
Task,Crear endpoint PATCH /trabajadores/:id/info-laboral,sistema-gestion-agricola\Backend\API,sistema-gestion-agricola\Sprint 1,2,,Asignar información laboral al trabajador,[Developer 1],"API para actualizar información laboral específica",,"Development",3,3
Task,Desarrollar FormularioInfoLaboral component,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,2,,Asignar información laboral al trabajador,[Developer 2],"Formulario específico para datos laborales",,"Development",4,4
User Story,Consulta de empleados,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,2,3,CRUD de Trabajadores,[Developer 2],"Como usuario quiero consultar la lista de empleados para ver información del personal y realizar búsquedas específicas","- Lista paginada con información básica<br>- Filtros por departamento cargo y estado<br>- Búsqueda por nombre cédula o email<br>- Vista detallada al hacer click en empleado",,,,
Task,Crear endpoint GET /trabajadores con filtros,sistema-gestion-agricola\Backend\API,sistema-gestion-agricola\Sprint 1,2,,Consulta de empleados,[Developer 1],"API con paginación filtros y búsqueda",,"Development",4,4
Task,Desarrollar componente ListaTrabajadores,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,2,,Consulta de empleados,[Developer 2],"Lista con paginación filtros y búsqueda",,"Development",5,5
Task,Crear componente DetalleTrabajador,sistema-gestion-agricola\Frontend\Personal,sistema-gestion-agricola\Sprint 1,2,,Consulta de empleados,[Developer 2],"Modal o página con información completa",,"Development",3,3
Feature,Gestión de Roles,sistema-gestion-agricola\Backend\Autenticacion,sistema-gestion-agricola,1,,Administración de Personal,,"Sistema de roles y permisos",,,,,
User Story,Crear roles de usuario,sistema-gestion-agricola\Backend\Autenticacion,sistema-gestion-agricola\Sprint 1,1,2,Gestión de Roles,[Developer 1],"Como administrador quiero crear roles de usuario para organizar la estructura de permisos del sistema","- CRUD completo de roles (crear ver editar eliminar)<br>- Definición de permisos por módulo<br>- Roles predefinidos: Administrador Supervisor Trabajador<br>- Validación de nombres de roles únicos",,,,
Task,Crear modelo Rol y tabla de permisos,sistema-gestion-agricola\Backend\Base-Datos,sistema-gestion-agricola\Sprint 1,2,,Crear roles de usuario,[Developer 1],"Tablas roles y roles_permisos con relaciones",,"Development",3,3
Task,Implementar endpoints CRUD para roles,sistema-gestion-agricola\Backend\API,sistema-gestion-agricola\Sprint 1,2,,Crear roles de usuario,[Developer 1],"API completa para gestión de roles",,"Development",4,4
Task,Crear componente GestionRoles,sistema-gestion-agricola\Frontend\Admin,sistema-gestion-agricola\Sprint 1,2,,Crear roles de usuario,[Developer 2],"Interface para CRUD de roles",,"Development",3,3
```

---

## 🛠️ Scripts de Azure CLI para Automatización

### **Opción 2: Azure CLI (Comando por línea)**

```bash
# Configurar proyecto
az devops configure --defaults organization=https://dev.azure.com/[tu-organizacion] project=sistema-gestion-agricola

# Crear Épicas
az boards work-item create --type "Epic" --title "Gestión de Identidad y Acceso" --description "Epic para gestión completa de autenticación y roles" --area "sistema-gestion-agricola" --priority 1

az boards work-item create --type "Epic" --title "Administración de Personal" --description "Epic para gestión completa de trabajadores agrícolas" --area "sistema-gestion-agricola" --priority 1

# Crear Features (necesitas los IDs de las épicas)
az boards work-item create --type "Feature" --title "Autenticación Básica" --description "Sistema de login y logout con JWT" --area "sistema-gestion-agricola\\Frontend\\Autenticacion" --parent [ID_EPIC_1] --priority 1

az boards work-item create --type "Feature" --title "CRUD de Trabajadores" --description "Gestión completa **de** trabajadores" --area "sistema-gestion-agricola\\Frontend\\Personal" --parent [ID_EPIC_2] --priority 1

# Crear User Stories
az boards work-item create --type "User Story" --title "Login de usuario" --description "Como usuario del sistema quiero poder iniciar sesión" --area "sistema-gestion-agricola\\Frontend\\Autenticacion" --iteration "sistema-gestion-agricola\\Sprint 1" --parent [ID_FEATURE_1] --fields "Microsoft.VSTS.Scheduling.StoryPoints=5" --assigned-to "[Developer 1]"

# Y así sucesivamente...
```

---

## 🔄 PowerShell Script Automatizado

### **Opción 3: Script PowerShell Completo**

```powershell
# Variables de configuración
$organization = "https://dev.azure.com/[tu-organizacion]"
$project = "sistema-gestion-agricola"

# Configurar Azure DevOps CLI
az devops configure --defaults organization=$organization project=$project

# Función para crear work item y retornar ID
function Create-WorkItem {
    param($type, $title, $description, $area, $iteration, $parent, $storyPoints, $assignedTo, $priority)
    
    $cmd = "az boards work-item create --type '$type' --title '$title'"
    if ($description) { $cmd += " --description '$description'" }
    if ($area) { $cmd += " --area '$area'" }
    if ($iteration) { $cmd += " --iteration '$iteration'" }
    if ($parent) { $cmd += " --parent $parent" }
    if ($storyPoints) { $cmd += " --fields 'Microsoft.VSTS.Scheduling.StoryPoints=$storyPoints'" }
    if ($assignedTo) { $cmd += " --assigned-to '$assignedTo'" }
    if ($priority) { $cmd += " --priority $priority" }
    
    $result = Invoke-Expression $cmd | ConvertFrom-Json
    return $result.id
}

# Crear Épicas
$epic1 = Create-WorkItem -type "Epic" -title "Gestión de Identidad y Acceso" -description "Epic para autenticación completa" -area "sistema-gestion-agricola" -priority 1

$epic2 = Create-WorkItem -type "Epic" -title "Administración de Personal" -description "Epic para gestión de trabajadores" -area "sistema-gestion-agricola" -priority 1

# Crear Features
$feature1 = Create-WorkItem -type "Feature" -title "Autenticación Básica" -description "Login y logout" -area "sistema-gestion-agricola\Frontend\Autenticacion" -parent $epic1 -priority 1

$feature2 = Create-WorkItem -type "Feature" -title "CRUD de Trabajadores" -description "Gestión completa" -area "sistema-gestion-agricola\Frontend\Personal" -parent $epic2 -priority 1

# Crear User Stories y Tasks...
Write-Host "Épicas creadas: $epic1, $epic2"
Write-Host "Features creadas: $feature1, $feature2"
```

---

## 🎯 **Mi Recomendación:**

### **Opción Más Práctica: CSV Import**
1. **Guarda el CSV** que creé arriba
2. **Ve a Azure DevOps** → Boards → Work Items  
3. **Click "Import Work Items"**
4. **Sube el archivo CSV**
5. **Revisa y confirma** la importación

### **Ventajas del CSV:**
- ✅ **Más rápido** (toda la estructura de una vez)
- ✅ **Fácil de modificar** antes de importar
- ✅ **Visual preview** antes de crear
- ✅ **Relaciones automáticas** (parent-child)

¿Quieres que prepare el archivo CSV completo con todas las User Stories y Tasks del Sprint 1 listo para importar? O prefieres que te ayude con alguna de las otras opciones?
