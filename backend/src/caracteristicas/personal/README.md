# Personal - Backend

API para la gestión integral del personal agrícola.

## Endpoints Principales

```
GET    /api/personal              # Listar empleados
POST   /api/personal              # Crear empleado
GET    /api/personal/:id          # Obtener empleado
PUT    /api/personal/:id          # Actualizar empleado
DELETE /api/personal/:id          # Eliminar empleado

GET    /api/cargos                # Listar cargos
POST   /api/cargos                # Crear cargo
PUT    /api/cargos/:id            # Actualizar cargo
DELETE /api/cargos/:id            # Eliminar cargo
```

## Modelos

- **Empleado**: Información personal y laboral
- **Cargo**: Puestos de trabajo
- **Departamento**: Áreas de trabajo

## Servicios

- `PersonalService`: Lógica de negocio para empleados
- `CargoService`: Gestión de cargos
- `DepartamentoService`: Gestión de departamentos

## Validaciones

- Datos personales únicos (cédula, email)
- Validación de fechas de ingreso
- Verificación de cargos activos
