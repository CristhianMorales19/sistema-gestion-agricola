# Módulo: Registro de Entrada de Asistencia

Este módulo implementa el caso de uso de registrar la **entrada diaria** de un trabajador siguiendo la arquitectura orientada a características (Screaming Architecture).

## Estructura
```
caracteristicas/asistencia/
  domain/
    Asistencia.ts
    AsistenciaRepository.ts
  application/
    RegistrarEntrada.ts
  infrastructure/
    PrismaAsistenciaRepository.ts
    asistencia.routes.ts
  index.ts
```

## Caso de Uso Principal
`RegistrarEntrada` valida:
1. Que exista `trabajadorId` válido.
2. Que no exista una entrada previa para el mismo trabajador y fecha.
3. Captura automáticamente hora actual si no se especifica.

## Integración en `app.ts`
```ts
import { asistenciaRouter } from './caracteristicas/asistencia';
app.use('/api/asistencia', asistenciaRouter);
```

## Notas Prisma
El repositorio intenta usar el modelo `asistencia` y hace fallback a `registroAsistencia`. Ajustar externamente si el nombre difiere. No se modificó el schema existente.

## Extensiones Futuras
- Registrar salida
- Reportes diarios
- Tracking de geolocalización
- Auditoría / eventos de dominio
