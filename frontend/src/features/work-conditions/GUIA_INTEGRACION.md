# Guía de Integración - Módulo Condiciones de Trabajo

## 🎯 Objetivo
Este documento proporciona instrucciones para integrar el nuevo módulo de Condiciones de Trabajo en el sistema de gestión agrícola.

## 📦 Qué se ha entregado

### Estructura Creada
```
frontend/src/features/work-conditions/
├── application/          # Lógica de negocio
│   ├── hooks/
│   │   └── useWorkConditions.ts
│   ├── WorkConditionsService.ts
│   ├── WorkConditionsService.test.ts
│   └── index.ts
├── domain/               # Entidades
│   ├── entities/
│   │   └── WorkCondition.ts
│   └── index.ts
├── infrastructure/       # Conexión con API
│   ├── WorkConditionsRepository.ts
│   └── index.ts
├── pages/                # Página principal
│   ├── WorkConditionsPage.tsx
│   └── index.ts
├── presentation/         # Componentes UI
│   └── components/
│       ├── WorkConditionsForm.tsx
│       ├── WorkConditionsCalendar.tsx
│       ├── WorkConditionsView.tsx
│       └── index.ts
├── README.md             # Documentación completa
├── EXAMPLES.md           # Ejemplos de uso
├── index.ts              # Exportador principal
```

### Archivos Principales Creados
1. **WorkConditionsForm.tsx** - Formulario de registro (237 líneas)
2. **WorkConditionsCalendar.tsx** - Calendario interactivo (318 líneas)
3. **WorkConditionsView.tsx** - Componente integrador (37 líneas)
4. **WorkCondition.ts** - Entidades y tipos (29 líneas)
5. **WorkConditionsService.ts** - Lógica centralizada (168 líneas)
6. **useWorkConditions.ts** - Hook personalizado (63 líneas)
7. **WorkConditionsRepository.ts** - Interfaz con API (144 líneas)
8. **README.md** - Documentación completa (400+ líneas)

## 🎨 Diseño e Interfaz

### Colores Implementados
- **Background Principal**: `#0f172a` ✅ Coincide con dashboard
- **Cards**: `#1e293b` ✅ Consistente
- **Bordes**: `#334155` ✅ Sutiles
- **Texto**: `#ffffff`, `#94a3b8`, `#64748b` ✅ Jerarquía clara

### Condiciones Climáticas
- ☀️ Despejado: Amarillo `#fbbf24`
- 🌧️ Lluvioso: Azul `#3b82f6`
- 🔥 Muy Caluroso: Rojo `#ef4444`
- ☁️ Nublado: Gris `#6b7280`

### Niveles de Dificultad
- Normal: Verde `#10b981`
- Difícil: Naranja `#f97316`
- Muy Difícil: Rojo `#ef4444`

## 🚀 Cómo Usar

### 1. Importar el Módulo
```typescript
import { WorkConditionsView, useWorkConditions } from '@features/work-conditions';
```

### 2. Uso Básico en un Componente
```typescript
import React from 'react';
import { WorkConditionsPage } from '@features/work-conditions';

export const ConditionsRoute = () => {
  return <WorkConditionsPage />;
};
```

### 3. Uso Avanzado con Hook
```typescript
import { useWorkConditions, WorkConditionsView } from '@features/work-conditions';

const MyComponent = () => {
  const { 
    conditions, 
    addCondition, 
    error, 
    getStats 
  } = useWorkConditions([]);

  const handleSubmit = (data) => {
    if (addCondition(data)) {
      console.log('✔️ Guardado');
      const stats = getStats();
      console.log('Estadísticas:', stats);
    }
  };

  return (
    <WorkConditionsView 
      onSubmit={handleSubmit}
      conditions={conditions}
    />
  );
};
```

### 4. Integración en SupervisorCampoDashboard
```typescript
import { WorkConditionsView, useWorkConditions } from '@features/work-conditions';

export const SupervisorCampoDashboard: React.FC = () => {
  const { conditions, addCondition } = useWorkConditions([]);

  return (
    <Box sx={{ flex: 1, p: 4, backgroundColor: '#0f172a' }}>
      <Grid container spacing={3}>
        {/* ... otros componentes ... */}
        <Grid item xs={12}>
          <WorkConditionsView
            onSubmit={(data) => addCondition(data)}
            conditions={conditions}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
```

## ✅ Checklist de Integración

### Fase 1: Frontend Básico
- [x] Componentes creados y estilizados
- [x] Hook personalizado implementado
- [x] Validaciones integradas
- [x] Tipos TypeScript completos
- [x] Background `#0f172a` aplicado
- [x] Respuesta compatible (mobile, tablet, desktop)

### Fase 2: Servicios y Lógica
- [x] WorkConditionsService implementado
- [x] Tests unitarios incluidos
- [x] Manejo de errores robusto
- [x] Métodos de utilidad implementados

### Fase 3: Infraestructura (Future)
- [ ] Implementar endpoints en backend
- [ ] Conectar WorkConditionsRepository
- [ ] Agregar autenticación
- [ ] Tests de integración E2E

### Fase 4: Integración con Dashboard
- [ ] Agregar ruta en enrutador
- [ ] Integrar en SupervisorCampoDashboard
- [ ] Integrar en reportes de productividad
- [ ] Agregar al menú de navegación

### Fase 5: Funcionalidades Avanzadas
- [ ] Exportar a PDF/Excel
- [ ] Gráficos de tendencias
- [ ] Notificaciones por condiciones críticas
- [ ] Historial y comparación de períodos

## 🔧 Endpoints Esperados del Backend

Una vez que el backend esté listo, se espera que implemente los siguientes endpoints:

```
POST   /api/condiciones-trabajo              # Crear
GET    /api/condiciones-trabajo              # Obtener todas
GET    /api/condiciones-trabajo/:id          # Obtener por ID
GET    /api/condiciones-trabajo/by-date      # Obtener por fecha
GET    /api/condiciones-trabajo/by-month     # Obtener por mes
PUT    /api/condiciones-trabajo/:id          # Actualizar
DELETE /api/condiciones-trabajo/:id          # Eliminar
```

## 📝 Formato de Respuesta Esperado

### Crear Condición (POST)
```json
{
  "id": 1,
  "fecha": "2025-12-24",
  "condicionGeneral": "despejado",
  "nivelDificultad": "normal",
  "observacion": "Día soleado",
  "created_at": "2025-12-24T10:30:00Z",
  "updated_at": "2025-12-24T10:30:00Z"
}
```

### Obtener Múltiples (GET)
```json
[
  {
    "id": 1,
    "fecha": "2025-12-24",
    "condicionGeneral": "despejado",
    "nivelDificultad": "normal",
    "observacion": "Día soleado",
    "created_at": "2025-12-24T10:30:00Z"
  },
  ...
]
```

## 🧪 Pruebas Unitarias

Para ejecutar los tests del servicio:

```bash
npm test WorkConditionsService.test.ts
```

Tests incluidos:
- ✅ Validación de datos
- ✅ Obtención de colores e iconos
- ✅ Cálculo de estadísticas
- ✅ Agrupamiento por mes

## 📊 Casos de Uso Soportados

1. **Registro de Condiciones**
   - Supervisor selecciona fecha
   - Selecciona condición general (4 opciones)
   - Selecciona nivel de dificultad (3 opciones)
   - Añade observación opcional
   - Guarda registro

2. **Visualización en Calendario**
   - Vista mensual
   - Navegación entre meses
   - Indicadores visuales por condición
   - Puntos de dificultad
   - Tooltips informativos

3. **Análisis de Datos**
   - Estadísticas por mes
   - Conteo de condiciones
   - Promedio de dificultad
   - Agrupamiento de datos

## 🔐 Seguridad

- Validación de datos en cliente y (será) en servidor
- Token JWT para autenticación (en repository)
- Manejo seguro de errores sin exponer detalles internos
- Tipos TypeScript para prevenir errores de tipo

## 📱 Responsividad

- ✅ Mobile: Responsive en pantallas < 600px
- ✅ Tablet: Optimizado para 600px - 1024px
- ✅ Desktop: Diseño completo en > 1024px
- ✅ Accesibilidad: Colores con contraste, labels claras

## 🎓 Documentación para Desarrolladores

- **README.md**: Documentación técnica completa
- **EXAMPLES.md**: 4 ejemplos de uso práctico
- **GUIA_INTEGRACION.md**: Este archivo
- **Comentarios en código**: Explicaciones inline

## 🤝 Soporte Técnico

Para preguntas sobre:
- **Componentes**: Ver `README.md` sección "Componentes"
- **Tipos**: Ver `domain/entities/WorkCondition.ts`
- **Servicio**: Ver `application/WorkConditionsService.ts`
- **Hooks**: Ver `application/hooks/useWorkConditions.ts`
- **Ejemplos**: Ver `EXAMPLES.md`

## 📈 Próximos Pasos Sugeridos

1. **Corto Plazo** (Esta semana)
   - Revisar la documentación
   - Probar los componentes localmente
   - Integrar en SupervisorCampoDashboard

2. **Mediano Plazo** (Próximas 2 semanas)
   - Implementar endpoints en backend
   - Conectar con API
   - Agregar a rutador de la aplicación

3. **Largo Plazo** (Próximas 4 semanas)
   - Integrar con productividad
   - Crear reportes
   - Agregar gráficos y análisis avanzado

## ✨ Características Implementadas

- ✅ Formulario de registro rápido (< 30 segundos)
- ✅ 4 condiciones climáticas predefinidas
- ✅ 3 niveles de dificultad
- ✅ Observación breve (200 caracteres máx)
- ✅ Calendario interactivo con indicadores
- ✅ Validaciones integradas
- ✅ Servicio centralizado
- ✅ Hook personalizado para estado
- ✅ Tipos TypeScript completos
- ✅ Tests unitarios
- ✅ Documentación exhaustiva
- ✅ Diseño responsive
- ✅ Background consistente (#0f172a)

## 🚨 Notas Importantes

1. **Background**: El background `#0f172a` ya está aplicado en todos los componentes
2. **Estilos**: Todos los colores fueron validados contra el dashboard existente
3. **API**: El repositorio espera un backend con los endpoints mencionados
4. **Testing**: Ejecutar tests antes de deployar
5. **Documentación**: Se encuentra completa en README.md y EXAMPLES.md

---

**Última actualización**: Diciembre 24, 2025  
**Versión del módulo**: 1.0.0  
**Estado**: Listo para integración  
**Próxima revisión**: Después de integración con backend
