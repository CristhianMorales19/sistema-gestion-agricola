# Control de Asistencia

Módulo para el registro y seguimiento de la asistencia del personal.

## Funcionalidades

- Registro de entrada y salida
- Control de horarios de trabajo
- Gestión de permisos y ausencias
- Reportes de asistencia
- Notificaciones de tardanzas

## Componentes Principales

- `RegistroAsistencia`: Interfaz de marcado
- `TablaAsistencia`: Listado de registros
- `GestionPermisos`: Solicitud y aprobación de permisos
- `ReporteAsistencia`: Reportes por período

## Servicios

- `asistenciaService`: CRUD de registros de asistencia
- `permisoService`: Gestión de permisos
- `horarioService`: Configuración de horarios

## Historias de Usuario Cubiertas

- HU-006: Registro de entrada
- HU-007: Registro de salida
- HU-008: Consulta de asistencia diaria
- HU-009: Reporte de asistencia mensual
- HU-010: Gestión de permisos
