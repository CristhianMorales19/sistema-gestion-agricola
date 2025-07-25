# Productividad - Backend

API para el seguimiento y evaluación de la productividad del personal.

## Endpoints Principales

```
POST   /api/productividad/tarea     # Registrar tarea completada
GET    /api/productividad/empleado/:id # Productividad por empleado
GET    /api/productividad/periodo/:fecha # Productividad por período

GET    /api/metas                   # Listar metas
POST   /api/metas                   # Crear meta
PUT    /api/metas/:id               # Actualizar meta
GET    /api/metas/empleado/:id      # Metas por empleado

POST   /api/evaluaciones            # Crear evaluación
GET    /api/evaluaciones/empleado/:id # Evaluaciones por empleado
```

## Modelos

- **TareaCompletada**: Registro de tareas realizadas
- **Meta**: Objetivos y metas del personal
- **EvaluacionRendimiento**: Evaluaciones periódicas
- **IndicadorProductividad**: Métricas de desempeño

## Servicios

- `ProductividadService`: Cálculo de indicadores
- `TareaService`: Gestión de tareas
- `MetaService`: Administración de metas
- `EvaluacionService`: Proceso de evaluaciones

## Métricas

- Tareas completadas por día/semana/mes
- Porcentaje de cumplimiento de metas
- Indicadores de eficiencia
- Ranking de productividad
