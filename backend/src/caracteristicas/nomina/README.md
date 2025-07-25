# Nómina - Backend

API para el cálculo y administración de la nómina del personal.

## Endpoints Principales

```
GET    /api/nomina/calcular/:periodo # Calcular nómina por período
POST   /api/nomina/procesar         # Procesar nómina
GET    /api/nomina/recibo/:empleado  # Generar recibo de pago
GET    /api/nomina/reporte/:periodo  # Reporte de nómina

GET    /api/salarios                # Configuración de salarios
PUT    /api/salarios/:empleado      # Actualizar salario
GET    /api/deducciones             # Listar deducciones
POST   /api/deducciones             # Crear deducción
```

## Modelos

- **Nomina**: Cálculos de nómina por período
- **ConfiguracionSalario**: Salarios base por cargo
- **Deduccion**: Descuentos aplicables
- **ReciboPago**: Comprobantes de pago

## Servicios

- `NominaService`: Cálculo de nómina y horas extras
- `SalarioService`: Configuración de salarios
- `DeduccionService`: Gestión de deducciones

## Cálculos

- Horas regulares y extras
- Deducciones por ley y voluntarias
- Bonificaciones y incentivos
- Cálculo de prestaciones sociales
