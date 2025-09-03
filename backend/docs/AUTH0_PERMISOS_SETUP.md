# CONFIGURACIÓN AUTH0 - PERMISOS AGROMANO

## Permisos/Scopes a crear en Auth0 Dashboard

### Personal/Trabajadores
- `trabajadores:create` - Crear nuevos trabajadores
- `trabajadores:read:all` - Ver todos los trabajadores
- `trabajadores:read:own` - Ver solo propio perfil
- `trabajadores:update:all` - Actualizar cualquier trabajador
- `trabajadores:update:own` - Actualizar solo propio perfil
- `trabajadores:delete` - Eliminar trabajadores
- `trabajadores:import` - Importar datos de trabajadores
- `trabajadores:export` - Exportar datos de trabajadores

### Asistencia
- `asistencia:register` - Registrar entrada/salida
- `asistencia:read:all` - Ver asistencia de todos
- `asistencia:read:own` - Ver solo propia asistencia
- `asistencia:update` - Modificar registros de asistencia
- `asistencia:approve` - Aprobar asistencias
- `asistencia:reports` - Generar reportes de asistencia
- `asistencia:dashboard` - Ver dashboard de asistencia
- `permisos:create` - Crear solicitudes de permiso
- `permisos:read` - Ver permisos
- `permisos:approve` - Aprobar permisos
- `horarios:manage` - Gestionar horarios

### Nómina
- `nomina:process` - Procesar nómina
- `nomina:read:all` - Ver nóminas de todos
- `nomina:approve` - Aprobar nóminas
- `nomina:calculate` - Calcular nóminas
- `nomina:reports` - Generar reportes de nómina
- `nomina:export` - Exportar datos de nómina
- `salarios:update` - Actualizar salarios
- `bonificaciones:manage` - Gestionar bonificaciones
- `deducciones:manage` - Gestionar deducciones

### Productividad
- `productividad:register` - Registrar productividad propia
- `productividad:read:all` - Ver productividad de todos
- `productividad:read:own` - Ver solo productividad propia
- `productividad:register:others` - Registrar productividad de otros
- `productividad:reports` - Generar reportes de productividad
- `tareas:create` - Crear tareas
- `tareas:read` - Ver tareas
- `tareas:assign` - Asignar tareas
- `tareas:update` - Actualizar tareas
- `tareas:complete` - Completar tareas
- `metas:set` - Establecer metas
- `metas:track` - Seguimiento de metas

### Cultivos/Parcelas
- `parcelas:read` - Ver información de parcelas
- `parcelas:update` - Actualizar parcelas
- `cultivos:read` - Ver información de cultivos
- `cultivos:update` - Actualizar cultivos
- `cultivos:track` - Seguimiento de cultivos
- `cosechas:register` - Registrar cosechas
- `cosechas:read` - Ver datos de cosechas

### Reportes y Dashboard
- `reportes:read` - Ver reportes básicos
- `reportes:read:advanced` - Ver reportes avanzados
- `reportes:export` - Exportar reportes
- `dashboard:view:basic` - Ver dashboard básico
- `dashboard:view:advanced` - Ver dashboard avanzado
- `kpis:view` - Ver indicadores clave

### Móvil
- `mobile:access` - Acceso desde móvil
- `mobile:sync` - Sincronización móvil
- `gps:track` - Seguimiento GPS
- `photos:upload` - Subir fotos

## Pasos para configurar en Auth0:

### 1. Crear API en Auth0
- Ve a **APIs** en Auth0 Dashboard
- Nombre: `AgroMano API`
- Identifier: `https://agromano-api.com`

### 2. Agregar Scopes
- En la API creada, ve a **Scopes**
- Agrega TODOS los permisos listados arriba

### 3. Crear Roles
- Ve a **User Management > Roles**
- Crea los roles: `ADMIN_AGROMANO`, `SUPERVISOR_CAMPO`, `GERENTE_RRHH`, `SUPERVISOR_RRHH`, `EMPLEADO_CAMPO`, `VISUAL_SOLO_LECTURA`

### 4. Asignar Permisos a Roles
Según la matriz de permisos definida en `MATRIZ_ROLES_PERMISOS.md`

### 5. Autorizar Aplicación Machine to Machine
- Ve a **APIs > AgroMano API > Machine To Machine Applications**
- Autoriza la aplicación `AgroMano`
- Asigna TODOS los scopes creados

### 6. Crear Usuarios de Prueba
- `admin@agromano.com` → Rol: `ADMIN_AGROMANO`
- `supervisor@agromano.com` → Rol: `SUPERVISOR_CAMPO`  
- `gerente@agromano.com` → Rol: `GERENTE_RRHH`
- `empleado@agromano.com` → Rol: `EMPLEADO_CAMPO`
- `viewer@agromano.com` → Rol: `VISUAL_SOLO_LECTURA`

## Endpoints de Prueba Disponibles:

### Trabajadores
- `GET /api/agromano/trabajadores` - Lista trabajadores
- `POST /api/agromano/trabajadores` - Crear trabajador
- `PUT /api/agromano/trabajadores/:id` - Actualizar trabajador
- `DELETE /api/agromano/trabajadores/:id` - Eliminar trabajador
- `GET /api/agromano/trabajadores/export` - Exportar trabajadores
- `POST /api/agromano/trabajadores/import` - Importar trabajadores

### Asistencia
- `POST /api/agromano/asistencia/marcar` - Marcar asistencia
- `GET /api/agromano/asistencia` - Ver asistencias
- `PUT /api/agromano/asistencia/:id/aprobar` - Aprobar asistencia
- `GET /api/agromano/asistencia/reportes` - Reportes de asistencia
- `GET /api/agromano/asistencia/dashboard` - Dashboard de asistencia
- `POST /api/agromano/asistencia/permisos` - Solicitar permiso
- `PUT /api/agromano/asistencia/permisos/:id/aprobar` - Aprobar permiso
