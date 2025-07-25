# Reportes - Backend

API para la generación de reportes e informes del sistema.

## Endpoints Principales

```
GET    /api/reportes/personal       # Reporte de personal
GET    /api/reportes/asistencia     # Reporte de asistencia
GET    /api/reportes/nomina         # Reporte de nómina
GET    /api/reportes/productividad  # Reporte de productividad
POST   /api/reportes/personalizado  # Reporte personalizado

GET    /api/reportes/export/:tipo   # Exportar reporte
POST   /api/reportes/programar      # Programar reporte automático
```

## Modelos

- **ReportePersonal**: Informes de empleados
- **ReporteAsistencia**: Informes de asistencia
- **ReporteNomina**: Informes financieros
- **ReporteProductividad**: Informes de rendimiento

## Servicios

- `ReporteService`: Generación de reportes
- `ExportacionService`: Exportación a PDF/Excel
- `ProgramacionService`: Reportes automáticos

## Tipos de Reporte

- Reportes estándar predefinidos
- Reportes personalizados con filtros
- Reportes programados automáticos
- Exportación en múltiples formatos

## Filtros Disponibles

- Por fecha (desde/hasta)
- Por empleado o grupo
- Por departamento
- Por estado (activo/inactivo)
