# Módulo de Asistencia – Registro de Entradas

## 🎯 Objetivo
Permitir el registro de la entrada (check‑in) de un trabajador, evitando duplicados en el mismo día, con soporte para:
- Arquitectura desacoplada (Screaming Architecture: domain / application / infrastructure)
- Persistencia vía Prisma
- API REST (`POST /api/asistencia/entrada`)
- Health check específico (`GET /api/asistencia/health`)
- Frontend React con:
  - Formulario de registro
  - Servicio resiliente con autodetección de baseUrl
  - Cola offline (localStorage) y sincronización diferida
  - Integración no intrusiva con el dashboard existente

---

## 🏗️ Arquitectura (Screaming Architecture)

Backend (feature aislada):
```
backend/src/caracteristicas/asistencia/
  domain/
    Asistencia.ts               (Entidad + invariantes)
    AsistenciaRepository.ts     (Contrato)
  application/
    RegistrarEntrada.ts         (Caso de uso)
  infrastructure/
    PrismaAsistenciaRepository.ts
    asistencia.routes.ts        (Rutas REST /entrada + /health)
  __tests__/
    RegistrarEntrada.test.ts    (Pruebas unitarias del caso de uso)
  index.ts
```

Frontend (feature folder):
```
frontend/src/features/asistencia/
  services/
    AsistenciaService.ts        (API + cola offline + resolución baseUrl dinámica)
  hooks/
    useAsistencia.ts            (Estado + sincronización pendientes)
    useSyncAsistenciaView.ts    (Sync vista ↔ ruta /asistencia sin afectar otras)
  components/
    RegistrarEntradaForm.tsx
  AsistenciaPage.tsx
  index.ts
```

---

## 🧩 Backend – Detalles

### Entidad: `Asistencia`
Archivo: `domain/Asistencia.ts`
- Propiedades clave: `id`, `trabajadorId`, `fecha (YYYY-MM-DD)`, `horaEntrada (HH:mm:ss)`, `ubicacion`, `creadoEn`.
- Factory `crear()` genera fecha/hora si no se proveen.
- Invariante: un trabajador no puede registrar dos entradas el mismo día (validado a nivel de caso de uso + repositorio).

### Contrato repositorio
Archivo: `domain/AsistenciaRepository.ts`
```ts
interface AsistenciaRepository {
  existeEntradaHoy(trabajadorId: number, fecha: string): Promise<boolean>;
  registrarEntrada(asistencia: Asistencia): Promise<Asistencia>;
}
```

### Caso de uso: `RegistrarEntrada`
Archivo: `application/RegistrarEntrada.ts`
- Orquesta validación de duplicados llamando `existeEntradaHoy`.
- Genera entidad con timestamps consistentes.
- Lanza error semántico si ya existe entrada (409 en capa presentación).

### Implementación Prisma
Archivo: `infrastructure/PrismaAsistenciaRepository.ts`
- Intenta mapear al modelo Prisma existente (`asistencia` o variación según esquema).
- `existeEntradaHoy()` filtra por trabajador y fecha.
- `registrarEntrada()` persiste y devuelve la entidad adaptada.

### Rutas REST
Archivo: `infrastructure/asistencia.routes.ts`
- `POST /api/asistencia/entrada`
  - Body: `{ trabajadorId:number, fecha?, horaEntrada?, ubicacion? }`
  - 201 → JSON con datos normalizados
  - 400 → Falta trabajadorId
  - 409 → Entrada duplicada del mismo día
  - 500 → Error interno
- `GET /api/asistencia/health`
  - Devuelve `{ status: 'ok', timestamp }` para probing del frontend.

### Montaje en la app
En `backend/src/app.ts`:
```ts
app.use('/api/asistencia', asistenciaRouter);
```

### Pruebas
Archivo: `__tests__/RegistrarEntrada.test.ts`
- Caso feliz: registra primera entrada.
- Caso duplicado: segunda llamada produce error (409 en capa presentación).
- Ajustado para evitar dependencias externas complejas.

---

## 💡 Frontend – Detalles

### Página principal
`AsistenciaPage.tsx`
- Monta el formulario `<RegistrarEntradaForm />`
- Instancia `AsistenciaService` con:
  - `baseUrl: '/api/asistencia'`
  - `fallbackBaseUrls: ['http://localhost:3000/api/asistencia', 'http://127.0.0.1:3000/api/asistencia']`
  - Uso de token Auth0 (si disponible)
- Bordes y estilos simples (aún sin refinar diseño).

### Servicio: `AsistenciaService`
Archivo: `services/AsistenciaService.ts`
Responsabilidades:
- Resolución dinámica de baseUrl:
  - Orden: `REACT_APP_API_ASISTENCIA_BASE` > `options.baseUrl` > `window.location.origin + /api/asistencia` > localhost fallbacks > `fallbackBaseUrls`.
  - Probing con `GET {base}/health`.
  - Cachea base resuelta.
- Registro: `registrarEntrada()` → POST `{base}/entrada`
- Cola offline:
  - Si `navigator.onLine === false` o status 0/network error → agrega a localStorage.
  - `sincronizarPendientes()` reintenta en orden FIFO.
- Logging debug (temporal):
  - `[AsistenciaService] Probando baseUrls [...]`
  - `[AsistenciaService] baseUrl resuelta => ...`
  - `[AsistenciaService] registrarEntrada -> URL ...`
- Errores enriquecidos: `Error al registrar entrada (status XXX) -> URL`.

### Hook: `useAsistencia`
- Provee acciones `registrarEntrada` y sincroniza la cola cada cierto intervalo (si se implementó).
- Maneja feedback de éxito/error para UI.

### Hook: `useSyncAsistenciaView`
- Sincroniza la URL `/asistencia` con el estado interno `currentView` del dashboard sin modificar la lógica de otras vistas.

### Formulario: `RegistrarEntradaForm.tsx`
- Campos: `trabajadorId` (obligatorio), fecha, hora (opcional), ubicación.
- Muestra mensajes de error simples (puede mejorarse para diferenciar 404 vs 409).

### Integración UI
- Ruta añadida en `AppWithRBAC.tsx`: `<Route path="/asistencia" element={<AsistenciaPage />}/>`
- Opción agregada en layout/dashboard (no intrusivo al resto de módulos).
- Vista se monta sin afectar navegación existente.

---

## 🔌 Flujo de Registro (Happy Path)
1. Usuario abre `/asistencia`.
2. Servicio resuelve baseUrl (health probing).
3. Usuario completa `trabajadorId` y envía.
4. Frontend hace POST → Backend valida duplicados → Devuelve 201.
5. Respuesta se muestra (pendiente: UI de confirmación).

---

## 📴 Modo Offline
1. Sin conexión o error de red → entrada se encola (`asistencia_offline_queue` en localStorage).
2. Al reconectar, `sincronizarPendientes()` reenvía en orden.
3. Entradas enviadas exitosamente se eliminan de la cola.

---

## ⚙️ Configuración de Entorno

### Backend (variables comunes)
```
PORT=3000
DATABASE_URL=mysql://user:pass@localhost:3306/tu_db
AUTH0_DOMAIN=...
AUTH0_AUDIENCE=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:3001
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_ASISTENCIA_BASE=http://localhost:3000/api/asistencia
# O dejar vacío y confiar en resolución automática + proxy
```

### Proxy (opcional para Create React App)
Añadir en `frontend/package.json`:
```json
"proxy": "http://localhost:3000"
```
Y ejecutar frontend en puerto distinto del backend:
Script start recomendado:
```
set PORT=3001 && react-scripts start
```

---

## 🛡️ Seguridad / Auth
- El endpoint actual de asistencia NO exige todavía un permiso específico (puede endurecerse añadiendo middleware Auth0 / RBAC).
- Propuesta futura: Permiso `asistencia:register` y validación de identidad vs. `trabajadorId`.

---

## 🧪 Errores y Manejo
| Situación | Respuesta | Notas UI |
|-----------|-----------|----------|
| Falta `trabajadorId` | 400 JSON `{ error: 'trabajadorId es obligatorio' }` | Validar antes en frontend |
| Duplicado de día | 409 JSON `{ error: 'Ya existe...' }` | Mostrar feedback claro |
| Error interno | 500 JSON `{ error: 'Error al registrar entrada' }` | Retentar / soporte |
| BaseUrl incorrecta | 404 HTML o `{ success:false, message:'Endpoint no encontrado' }` | Revisar puertos / proxy |
| Offline | Encola localStorage | Badge “(offline)” posible |

---

## 🧪 Pruebas Unitarias
Ejecutar en backend:
```
npm run test
```
(Enfocadas por ahora en caso de uso RegistrarEntrada; pendiente ampliar: repositorio mock y pruebas de ruta con supertest.)

---

## 🛠️ Troubleshooting
| Problema | Causa probable | Acción |
|----------|----------------|--------|
| 404 a `/api/asistencia/entrada` | Frontend y backend en mismo puerto / baseUrl relativa sin proxy | Separar puertos, usar `REACT_APP_API_ASISTENCIA_BASE` |
| No aparecen logs `[AsistenciaService]` | Bundle viejo / caché | Hard reload / reiniciar `npm start` |
| Duplicado no bloqueado | Falta índice único en BD | Agregar índice compuesto `(trabajadorId, fecha)` |
| Cola nunca se vacía | `navigator.onLine` siempre false (entorno) | Añadir botón manual de sincronización |
| 409 inesperado | Diferencias de zona horaria en fecha | Unificar fecha en UTC o normalizar TZ |

---

## 🗺️ Roadmap Sugerido
1. Añadir permiso RBAC `asistencia:register`.
2. Endpoint GET para listar registros del día.
3. Índice único en BD `(trabajadorId, fecha)` para robustez.
4. Feedback visual (snackbar) en éxito / duplicado / offline.
5. Tests de integración (supertest) para `/api/asistencia/entrada`.
6. Exportaciones/reportes (CSV mensual).
7. Sincronización inteligente (backoff exponencial).
8. Limpieza de logs debug para build producción.

---

## 📜 Changelog (Resumen de Cambios Aplicados)
- Backend:
  - Creación de entidad, contrato, caso de uso y repositorio Prisma.
  - Rutas: `POST /api/asistencia/entrada`, `GET /api/asistencia/health`.
  - Montaje en `app.ts`.
  - Test unitario de duplicado.
  - Fix boolean `is_activo` (externo pero relacionado a integración).
- Frontend:
  - Feature folder `asistencia`.
  - Servicio con cola offline + resolución dinámica de baseUrl + health probing.
  - Hooks `useAsistencia`, `useSyncAsistenciaView`.
  - Formulario y página `AsistenciaPage`.
  - Integración ruta `/asistencia`.
  - Logging detallado (temporal).
- Diagnóstico:
  - Detectado 404 por colisión de puertos / baseUrl relativa.
  - Añadido endpoint `/health` para probing.
  - Propuesta de separación de puertos + proxy CRA + `.env`.

---

## 🧪 Flujo Manual de Prueba
1. Backend: `npm run dev` (ver endpoints en consola).
2. Frontend (puerto 3001): `npm start`.
3. Abrir `http://localhost:3001/asistencia`.
4. Revisar consola:
   - `[AsistenciaService] Probando baseUrls ...`
   - `[AsistenciaService] baseUrl resuelta => ...`
5. Registrar entrada con `trabajadorId=1`.
6. Ver 201 + objeto respuesta.
7. Reintentar igual → Debe lanzar 409 (duplicado).
8. Simular offline (DevTools → Network Offline) → Registrar → Ver mensaje offline → Volver online → Forzar `sincronizarPendientes()` (hook o recarga).

---

## 🧾 Ejemplo de Respuesta Exitosa
```json
{
  "id": 12,
  "trabajadorId": 1,
  "fecha": "2025-10-08",
  "horaEntrada": "07:32:11",
  "ubicacion": null,
  "creadoEn": "2025-10-08T10:32:11.123Z"
}
```

---

## 🔒 Futuro (Hardening)
| Mejora | Beneficio |
|--------|-----------|
| Middleware Auth0 en `/api/asistencia/entrada` | Seguridad real por token |
| RBAC permission check | Control fino por rol |
| Índice único BD | Evita race condition en alta concurrencia |
| Auditoría (tabla logs) | Trazabilidad |
| Firma digital / device id | Prevención de fraude |

---

## 🧹 Limpieza Pendiente
Antes de producción:
- Eliminar `console.debug` del servicio.
- Reemplazar mensajes genéricos por componentes UI.
- Validar formatos con Yup/React Hook Form en el frontend.
- Configurar Sentry / logger estructurado.

---

## 📌 Resumen Corto
Módulo funcional mínimo viable (MVP) implementado con:
- Backend desacoplado (dominio + caso de uso + repositorio + ruta).
- Frontend con servicio resiliente y soporte offline.
- Integración controlada (sin romper otras vistas).
- Infra lista para extender a permisos, listados y reportes.
