## Módulo de Asistencia (Entradas y Salidas)

Este módulo permite registrar ENTRADAS y SALIDAS de trabajadores, mantener un log local (incluyendo soporte offline) y visualizar actividad del día de forma compacta. Fue estilizado para integrarse visualmente con el resto de AgroManager (paleta oscura y componentes uniformes).

---

## Objetivos
- Control operativo de asistencia diaria.
- Experiencia rápida (selección / autocompletar / atajos Enter).
- Resiliencia ante desconexión (cola offline + sincronización automática).
- Cohesión visual con Dashboard y Gestión de Personal.

---

## Arquitectura (Vista Rápida)

```
AsistenciaPage
 ├── RegistrarEntradaForm (usa useAsistencia)
 │    ├── WorkerSelect | WorkerSelectStatic
 │    └── GeolocationButton
 ├── RegistrarSalidaForm (usa useRegistroSalida)
 ├── ActionLog (eventos de entrada locales)
 └── ActionLogEntradas (estado de entradas del día + salidas)

Servicios / Hooks
 ├── AsistenciaService (REST + cola offline)
 ├── useAsistencia (registro de entrada + feedback)
 ├── useRegistroSalida (pendientes y confirmación de salida)
 └── useEntradasHoy (cache local optimista para lista diaria)
```

---

## Componentes Principales

| Componente | Rol | Notas |
|------------|-----|-------|
| `AsistenciaPage` | Orquestador / Layout | Inyecta servicios y agrupa formularios + logs. |
| `RegistrarEntradaForm` | Formulario de entrada | Usa lista estática o búsqueda dinámica de trabajadores. |
| `RegistrarSalidaForm` | Formulario de salida | Lista solo trabajadores con entrada activa hoy. |
| `WorkerSelect` | Autocomplete remoto | Búsqueda incremental; Enter selecciona coincidencia exacta. |
| `WorkerSelectStatic` | Select precargado | Optimiza cuando la lista es pequeña. |
| `GeolocationButton` | Captura GPS | Concatena coordenadas formateadas a ubicación. |
| `ActionLog` | Timeline de eventos UI | Muestra mensajes generados por acciones de entrada. |
| `ActionLogEntradas` | Resumen diario | Entradas de hoy y sus salidas (cuando existen). |

---

## Flujo de Registro de Entrada
1. Selección de trabajador (autocomplete o lista estática).
2. Fecha prellenada (hoy) editable.
3. Hora opcional (backend asigna si se omite).
4. Ubicación opcional + botón GPS que añade `geo:lat,lng`.
5. Submit: si offline o fallo de red → cola local; si éxito → feedback inmediato y actualización optimista.

### Mensajes UI (Entrada)
| Tipo | Ejemplo | Origen |
|------|---------|--------|
| SUCCESS | ✔️ Entrada registrada correctamente | 2xx backend |
| WARNING | ⚠️ Este trabajador ya tiene una entrada registrada para hoy | HTTP 409 |
| INFO | Trabajador: CI - Nombre | Callback `onAfterRegistro` |
| OFFLINE | Entrada guardada offline. Se sincronizará automáticamente. | Falla red / offline |

## Flujo de Registro de Salida
1. Select de trabajadores con entrada abierta (derivado de `useRegistroSalida`).
2. Hora Salida opcional (backend asigna si se omite).
3. Observación libre (opcional).
4. Submit → actualiza lista en memoria y dispara callback a `AsistenciaPage` para reflejar horas trabajadas.

### Mensajes UI (Salida)
Badges: SUCCESS / ERROR + log interno compacto.

---

## Reglas de Negocio Clave
| Regla | Descripción |
|-------|-------------|
| Unicidad diaria | Máx. una entrada por trabajador por día (enforced backend). |
| Estado pendiente | Trabajadores con entrada sin salida aparecen en selector de salida. |
| Offline first | Entradas en cola se reintentan en: load inicial, evento `online`, y tick interno. |
| Geolocalización | No bloqueante; errores de GPS no interrumpen el registro. |

---

## Offline / Sincronización
| Fuente | Mecanismo |
|--------|-----------|
| Cola local | `localStorage` (serialización JSON) |
| Trigger sync | Evento `online`, reinicios y operaciones manuales exitosas |
| Resolución | Al sincronizar se reenvían entradas pendientes; al éxito se purgan |

---

## Estilos y UI Unificada
Archivo: `theme/asistenciaStyles.ts`.

Tokens clave:
| Token | Valor | Uso |
|-------|-------|-----|
| `bgPage` | `#0f172a` | Fondo pantalla |
| `bgCard` | `#1e293b` | Tarjetas / formularios |
| `textPrimary` | `#f1f5f9` | Títulos / texto principal |
| `textSecondary` | `#cbd5e1` | Descripciones / metadata |
| `btnPrimary` | `#059669` | Botones acción (registrar) |
| `btnSecondary` | `#475569` | Botones secundarios (GPS) |
| Badges | Verde / Rojo / Azul | SUCCESS / ERROR / INFO |

Se encapsulan en un módulo para cumplir Open/Closed y evitar “fugas” hacia otros features. No se alteró theme global.

---

## Principios de Diseño Aplicados
| Principio | Implementación |
|-----------|----------------|
| Open/Closed | Añadimos `asistenciaStyles.ts` sin modificar componentes externos. |
| Ley de Demeter | Componentes sólo conocen sus servicios inyectados (`service`, `workerService`). |
| SRP | Hooks vs UI vs servicio (sin mezcla de responsabilidades). |
| Inversión de Dependencias | Page compone los servicios; formularios sólo consumen interfaces. |
| Optimistic Update | Lista del día se actualiza tras callback local (entrada / salida). |

---

## Hooks
| Hook | Rol |
|------|-----|
| `useAsistencia` | Orquesta registro de entrada + feedback + historial UI. |
| `useRegistroSalida` | Gestiona pendientes y procesa salidas. |
| `useEntradasHoy` | Mantiene cache local reactiva de entradas del día. |

---

## Servicios
`AsistenciaService`: Comunica con backend (REST) y expone operaciones de entrada/salida + listados.

`WorkerSearchService` (interfaz) y `DirectFetchWorkerSearchService`: búsqueda dinámica (modo autocomplete).

---

## Uso Rápido
```tsx
import { RegistrarEntradaForm } from '@/features/asistencia/components/RegistrarEntradaForm';
import { createAsistenciaService } from '@/features/asistencia/core/AsistenciaConfig';

const servicio = createAsistenciaService(() => getAccessTokenSilently());

<RegistrarEntradaForm service={servicio} workerService={/* WorkerSearchService */} />
```

Para salidas:
```tsx
import RegistrarSalidaForm from '@/features/asistencia/components/RegistrarSalidaForm';
<RegistrarSalidaForm service={servicio} />
```

---

## Estrategia de Extensión Futura
| Mejora | Justificación |
|--------|---------------|
| Indicador contador offline | Transparencia de sincronización |
| Filtro por fecha | Consultas históricas rápidas |
| Export CSV / XLS | Reportería operativa |
| Integrar ausencias | Evitar doble fuente para no asistencia |
| Notificaciones push | Alerta de jornadas incompletas |

---

## Testing / Consideraciones
- Probar duplicidad: registrar misma persona dos veces → debe mostrar advertencia.
- Simular offline (DevTools > Offline) y registrar: verificar cola y posterior sincronización al volver online.
- Validar que al registrar salida los chips cambian (horas y estado) en `ActionLogEntradas`.

---

## Troubleshooting
| Problema | Causa Probable | Acción |
|----------|----------------|--------|
| No carga lista de trabajadores | Error red / token expirado | Revisar token y network tab |
| Entrada no aparece en actividad | Sincronización pendiente | Esperar evento `online` o revisar consola |
| Geolocalización falla | Permisos navegador denegados | Habilitar permisos / recargar |

---

## Licencia
Parte del sistema AgroManager. Ver licencia raíz del monorepo.

---

## Changelog Resumido
- (Reciente) Integración visual consistente (paleta oscura, badges personalizados, botones verde/gris).
- Callback enriquecido para historial de entrada.
- Soporte selección rápida con Enter en autocomplete.
- Registro de salida integrado con actualización optimista.

---

## Autoría
Equipo AgroManager – Módulo de Asistencia.
