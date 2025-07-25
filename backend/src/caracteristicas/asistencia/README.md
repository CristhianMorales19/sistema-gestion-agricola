# Asistencia - Backend

API para el control y seguimiento de asistencia del personal.

## Endpoints Principales

```
POST   /api/asistencia/entrada     # Registrar entrada
POST   /api/asistencia/salida      # Registrar salida
GET    /api/asistencia/empleado/:id # Asistencia por empleado
GET    /api/asistencia/fecha/:fecha # Asistencia por fecha
GET    /api/asistencia/reporte     # Reportes de asistencia

GET    /api/permisos               # Listar permisos
POST   /api/permisos               # Solicitar permiso
PUT    /api/permisos/:id/aprobar   # Aprobar permiso
PUT    /api/permisos/:id/rechazar  # Rechazar permiso
```

## Modelos

- **RegistroAsistencia**: Entradas y salidas diarias
- **Permiso**: Solicitudes de ausencia
- **Horario**: Configuración de horarios laborales

## Servicios

- `AsistenciaService`: Lógica de registros de asistencia
- `PermisoService`: Gestión de permisos y ausencias
- `HorarioService`: Configuración de horarios

## Validaciones

- Validación de horarios laborales
- Control de doble marcado
- Verificación de permisos aprobados
