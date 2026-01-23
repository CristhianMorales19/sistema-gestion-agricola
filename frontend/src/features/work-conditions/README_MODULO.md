# 🌤️ Work Conditions Module - README

## Descripción Rápida

Módulo completo para registrar y gestionar **Condiciones de Trabajo** (clima, dificultad) que afectan la productividad diaria de los trabajadores.

## ¿Qué es?

Un sistema para que supervisores de campo registren rápidamente:
- ☀️ **Condición general** (despejado, lluvioso, muy caluroso, nublado)
- 💪 **Nivel de dificultad** (normal, difícil, muy difícil)
- 📝 **Observaciones** (notas opcionales)

Estos datos se utilizan para:
- Analizar impacto de clima en productividad
- Justificar variaciones en rendimiento
- Planificar recursos según condiciones
- Generar reportes históricos

## 🏗️ Arquitectura

### Backend (Express + Prisma)
```
work-conditions/
├── domain/          # Entidades y reglas de negocio
├── application/     # Servicios y lógica
├── infrastructure/  # Acceso a datos (Prisma)
└── presentation/    # Controladores y rutas
```

**Endpoints:** `/api/work-conditions`

### Frontend (React)
```
work-conditions/
├── domain/          # Tipos TypeScript
├── application/     # Servicios y hooks
├── infrastructure/  # Cliente HTTP
└── presentation/    # Componentes React
```

**Ruta:** `/condiciones-trabajo`

## 🎯 Características

- ✅ CRUD completo
- ✅ Validaciones en tiempo real
- ✅ Autenticación JWT
- ✅ Autorización RBAC
- ✅ Calendario visual
- ✅ Búsqueda por fecha/mes
- ✅ Soft delete
- ✅ Timestamps automáticos

## 📡 API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/work-conditions/health | ❌ | Health check |
| GET | /api/work-conditions | ✅ | Obtener todas |
| GET | /api/work-conditions/:id | ✅ | Obtener por ID |
| GET | /api/work-conditions/date/:fecha | ✅ | Obtener por fecha |
| GET | /api/work-conditions/month/:year/:month | ✅ | Obtener por mes |
| POST | /api/work-conditions | ✅ | Crear nueva |
| PUT | /api/work-conditions/:id | ✅ | Actualizar |
| DELETE | /api/work-conditions/:id | ✅ | Eliminar |

Permiso requerido: `gestionar_condiciones`

## 🗄️ Base de Datos

Tabla: `mot_condiciones_trabajo`

```sql
CREATE TABLE mot_condiciones_trabajo (
  condicion_id INT PRIMARY KEY AUTO_INCREMENT,
  fecha_at DATETIME NOT NULL,
  condicion_general VARCHAR(150),
  nivel_dificultad VARCHAR(80),
  observaciones TEXT,
  usuario_registro INT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  created_by INT,
  updated_by INT,
  deleted_at DATETIME
);
```

## 🚀 Uso Rápido

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend
```bash
cd frontend
npm start
```

### 3. Acceder
- URL: http://localhost:3000/condiciones-trabajo
- Necesitas usuario con permiso `gestionar_condiciones`

### 4. Usar
1. Ver condiciones existentes en calendario
2. Llenar formulario con nuevos datos
3. Guardar
4. Modificar o eliminar según sea necesario

## 🔐 Seguridad

- JWT authentication
- RBAC con permiso específico
- Validación de entrada
- SQL injection prevenido (Prisma)

## 📚 Documentación

- `WORK_CONDITIONS_IMPLEMENTATION.md` - Resumen ejecutivo
- `INTEGRACION_WORK_CONDITIONS.md` - Guía técnica completa
- `WORK_CONDITIONS_CHECKLIST.md` - Validación y troubleshooting

## 💡 Ejemplos de Uso

### Crear Condición
```typescript
const { addCondition } = useWorkConditions();

await addCondition({
  fecha: "2025-12-24",
  condicionGeneral: "despejado",
  nivelDificultad: "normal",
  observacion: "Día soleado, ideal para trabajo"
});
```

### Obtener por Mes
```typescript
const { getConditionsByMonth } = useWorkConditions();

const december = await getConditionsByMonth(12, 2025);
```

### API directo (curl)
```bash
# Crear
curl -X POST http://localhost:3001/api/work-conditions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fecha_at": "2025-12-24T00:00:00Z",
    "condicion_general": "despejado",
    "nivel_dificultad": "normal",
    "observaciones": "Día soleado",
    "usuario_registro": 1
  }'

# Obtener todas
curl http://localhost:3001/api/work-conditions \
  -H "Authorization: Bearer <token>"
```

## 🐛 Solución de Problemas

**Problema:** No aparece en menú
- Verifica que tienes permiso `gestionar_condiciones`
- Recarga la página

**Problema:** Error 404 en API
- Verifica que backend está en puerto 3001
- Verifica `REACT_APP_API_URL` en `.env.local`

**Problema:** "Unauthorized"
- Verifica que el token es válido
- Verifica que tienes el permiso correcto

**Problema:** Condiciones no se cargan
- Verifica logs del backend
- Verifica que tabla tiene datos
- Abre Network tab (F12) para ver la respuesta

## 📊 Estructuras de Datos

### WorkCondition (Frontend)
```typescript
interface WorkCondition {
  id?: number;
  fecha: string;                    // "2025-12-24"
  condicionGeneral: "despejado" | "lluvioso" | "muy_caluroso" | "nublado";
  nivelDificultad: "normal" | "dificil" | "muy_dificil";
  observacion?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

### API Response
```json
{
  "condicion_id": 1,
  "fecha_at": "2025-12-24T00:00:00.000Z",
  "condicion_general": "despejado",
  "nivel_dificultad": "normal",
  "observaciones": "Día soleado",
  "usuario_registro": 1,
  "created_at": "2025-12-24T10:30:00.000Z",
  "updated_at": null,
  "created_by": 1,
  "updated_by": null,
  "deleted_at": null
}
```

## 🎨 UI/UX

### Formulario
- ✅ Inputs validados en tiempo real
- ✅ Mensajes de error claros
- ✅ Estados de carga
- ✅ Responsive design

### Calendario
- ✅ Vista mensual
- ✅ Colores según condición
- ✅ Iconos visuales
- ✅ Información al pasar mouse

### Tabla
- ✅ Listado de todas las condiciones
- ✅ Ordenable por columnas
- ✅ Acciones: editar/eliminar
- ✅ Paginación (si aplica)

## 📈 Casos de Uso

1. **Supervisor registra condición diaria**
   - Abre módulo cada mañana
   - Selecciona condición del día
   - Guarda observaciones
   - Sistema almacena en BD

2. **Analista revisa historial**
   - Navega al mes específico
   - Ve todas las condiciones registradas
   - Analiza correlación con productividad

3. **Gerente genera reporte**
   - Exporta datos por período
   - Crea gráficos de tendencias
   - Justifica variaciones de rendimiento

## 🔄 Flujo de Datos

```
Usuario (React)
    ↓
WorkConditionsForm
    ↓
handleSubmit()
    ↓
addCondition() [useWorkConditions]
    ↓
WorkConditionsRepository.create()
    ↓
fetch POST /api/work-conditions
    ↓
Backend (Express)
    ↓
WorkConditionController.createWorkCondition()
    ↓
WorkConditionService.createWorkCondition()
    ↓
PrismaWorkConditionRepository.create()
    ↓
Prisma Client
    ↓
MySQL Database
    ↓
Response con nueva condición
    ↓
Estado actualiza en React
    ↓
UI re-renderiza mostrando nuevo registro
```

## ✨ Características Avanzadas

- **Validación en dos niveles:** Frontend + Backend
- **Manejo de errores:** Clases personalizadas
- **Soft delete:** Conserva histórico
- **Timestamps:** Automáticos
- **RBAC:** Control granular de permisos
- **Búsquedas:** Por fecha, por mes, todas
- **DDD:** Arquitectura escalable y mantenible

## 📞 Soporte Técnico

Para problemas o preguntas:

1. Revisa `WORK_CONDITIONS_CHECKLIST.md`
2. Abre consola del navegador (F12)
3. Verifica logs del backend
4. Consulta la BD directamente si es necesario

## 🎓 Aprendizaje

Este módulo demuestra:
- ✅ Clean Architecture
- ✅ Domain-Driven Design (DDD)
- ✅ Repository Pattern
- ✅ Service Layer Pattern
- ✅ Frontend/Backend separation
- ✅ API REST design
- ✅ Authentication/Authorization
- ✅ Validation patterns

## 📄 Licencia

Parte del sistema AgroMano

## 🎉 ¡Listo para Usar!

El módulo está 100% funcional y documentado.

**Última actualización:** 24 de Diciembre, 2025
**Versión:** 1.0.0
**Status:** ✅ COMPLETADO Y PROBADO
