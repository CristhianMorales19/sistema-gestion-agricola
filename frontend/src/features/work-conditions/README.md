# Módulo de Condiciones de Trabajo

## Descripción
Módulo para que supervisores de campo registren rápidamente las condiciones generales de trabajo del día para documentar factores que afectan el rendimiento laboral.

## Características
- ✅ Registro rápido (menos de 30 segundos)
- ✅ Selección de condición general (despejado, lluvioso, muy caluroso, nublado)
- ✅ Nivel de dificultad (normal, difícil, muy difícil)
- ✅ Observación breve opcional
- ✅ Visualización en calendario con indicadores de color
- ✅ Consideración en evaluación de productividad
- ✅ Background #0f172a coincide con dashboard
- ✅ Validación de datos integrada
- ✅ Servicio de aplicación robusto

## Estructura del Proyecto

```
work-conditions/
├── presentation/
│   └── components/
│       ├── WorkConditionsForm.tsx       # Formulario de registro
│       ├── WorkConditionsCalendar.tsx   # Calendario con indicadores
│       ├── WorkConditionsView.tsx       # Vista integrada
│       └── index.ts
├── domain/
│   ├── entities/
│   │   └── WorkCondition.ts             # Entidades del dominio
│   └── index.ts
├── application/
│   ├── WorkConditionsService.ts         # Lógica de negocio
│   ├── WorkConditionsService.test.ts    # Tests unitarios
│   ├── hooks/
│   │   ├── useWorkConditions.ts         # Hook personalizado
│   │   └── index.ts
│   └── index.ts
├── infrastructure/
│   ├── WorkConditionsRepository.ts      # Interfaz con API
│   └── index.ts
├── pages/
│   ├── WorkConditionsPage.tsx           # Página principal
│   └── index.ts
├── README.md
└── index.ts
```

## Componentes

### WorkConditionsForm
Formulario para registrar nuevas condiciones de trabajo.

**Props:**
```typescript
interface WorkConditionsFormProps {
  onSubmit?: (data: WorkCondition) => void;
}
```

**Funcionalidades:**
- Selector de fecha (con validación automática de la fecha actual)
- Botones de selección de condición general con iconos y colores
- Botones de selección de nivel de dificultad con indicadores
- Campo de observación con contador de caracteres (máx 200)
- Validación en tiempo real
- Mensajes de éxito/error
- Botones de Guardar y Cancelar

**Ejemplo de uso:**
```typescript
<WorkConditionsForm 
  onSubmit={(data) => console.log(data)}
/>
```

### WorkConditionsCalendar
Calendario interactivo que muestra las condiciones registradas con indicadores visuales.

**Props:**
```typescript
interface WorkConditionsCalendarProps {
  month?: number;
  year?: number;
  conditions?: Array<{
    fecha: string;
    condicionGeneral: string;
    nivelDificultad: string;
  }>;
}
```

**Funcionalidades:**
- Navegación entre meses
- Indicadores de color por condición climática
- Puntos de dificultad en cada día
- Leyenda de colores interactiva
- Tooltips informativos al pasar el mouse
- Navegación fácil con botones < y >

**Ejemplo de uso:**
```typescript
<WorkConditionsCalendar 
  month={11}
  year={2025}
  conditions={conditions}
/>
```

### WorkConditionsView
Componente integrador que combina el formulario y el calendario en una vista completa.

**Props:**
```typescript
interface WorkConditionsViewProps {
  onSubmit?: (data: WorkCondition) => void;
  conditions?: WorkCondition[];
}
```

**Ejemplo de uso:**
```typescript
<WorkConditionsView 
  onSubmit={handleSubmit}
  conditions={conditions}
/>
```

## Servicios y Utilidades

### WorkConditionsService
Servicio con lógica de negocio centralizada.

**Métodos principales:**
```typescript
// Validación
validateWorkCondition(data: Partial<WorkCondition>): {
  isValid: boolean;
  errors: string[];
}

// Formateo
formatDate(dateStr: string): string
getConditionColor(condition: string): string
getConditionIcon(condition: string): string
getDifficultyColor(difficulty: string): string
getDifficultyLabel(difficulty: string): string

// Análisis
groupConditionsByMonth(conditions, month, year): Map<string, WorkCondition>
calculateStats(conditions): {
  totalRegistros: number;
  condicionesPorTipo: Record<string, number>;
  dificultadPromedio: string;
}
```

### useWorkConditions Hook
Hook personalizado para manejar el estado de condiciones.

```typescript
const {
  conditions,        // Array de condiciones
  loading,          // Estado de carga
  error,            // Mensajes de error
  addCondition,     // Agregar/actualizar condición
  removeCondition,  // Eliminar condición
  getConditionsByMonth, // Obtener por mes
  getStats,         // Obtener estadísticas
  clearError,       // Limpiar errores
} = useWorkConditions(initialConditions);
```

**Ejemplo de uso:**
```typescript
const { conditions, addCondition, error } = useWorkConditions([]);

const handleSubmit = (data) => {
  const success = addCondition(data);
  if (success) {
    console.log('✔️ Registrado exitosamente');
  }
};
```

## Colores y Estilos

### Paleta de Colores
```
Primary Background:  #0f172a
Secondary BG:        #1e293b
Borders:             #334155
Text Primary:        #ffffff
Text Secondary:      #94a3b8
Text Tertiary:       #64748b
```

### Condiciones Climáticas
| Condición | Emoji | Color | Hex |
|-----------|-------|-------|-----|
| Despejado | ☀️ | Amarillo | #fbbf24 |
| Lluvioso | 🌧️ | Azul | #3b82f6 |
| Muy Caluroso | 🔥 | Rojo | #ef4444 |
| Nublado | ☁️ | Gris | #6b7280 |

### Niveles de Dificultad
| Nivel | Color | Hex |
|-------|-------|-----|
| Normal | Verde | #10b981 |
| Difícil | Naranja | #f97316 |
| Muy Difícil | Rojo | #ef4444 |

## Tipos TypeScript

```typescript
// Tipos de datos básicos
export type CondicionGeneral = 'despejado' | 'lluvioso' | 'muy_caluroso' | 'nublado';
export type NivelDificultad = 'normal' | 'dificil' | 'muy_dificil';

// Entidad principal
export interface WorkCondition {
  id?: number;
  fecha: string;
  condicionGeneral: CondicionGeneral;
  nivelDificultad: NivelDificultad;
  observacion?: string;
  created_at?: Date;
  updated_at?: Date;
}

// DTOs para API
export interface CreateWorkConditionDTO {
  fecha: string;
  condicionGeneral: CondicionGeneral;
  nivelDificultad: NivelDificultad;
  observacion?: string;
}

export interface UpdateWorkConditionDTO {
  condicionGeneral?: CondicionGeneral;
  nivelDificultad?: NivelDificultad;
  observacion?: string;
}
```

## Uso Completo

### Integración en SupervisorCampoDashboard

```typescript
import { WorkConditionsView, useWorkConditions } from '@features/work-conditions';

export const MyDashboard = () => {
  const { conditions, addCondition } = useWorkConditions([]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <WorkConditionsView
          onSubmit={(data) => addCondition(data)}
          conditions={conditions}
        />
      </Grid>
    </Grid>
  );
};
```

### Importaciones

```typescript
// Componentes
import { 
  WorkConditionsForm,
  WorkConditionsCalendar,
  WorkConditionsView 
} from '@features/work-conditions';

// Servicios y Hooks
import { 
  WorkConditionsService,
  useWorkConditions 
} from '@features/work-conditions';

// Entidades
import { 
  WorkCondition,
  CreateWorkConditionDTO,
  UpdateWorkConditionDTO 
} from '@features/work-conditions';
```

## Requisitos de Negocio
1. ✅ Permite seleccionar condición general de lista predefinida (despejado, lluvioso, muy caluroso, nublado)
2. ✅ Registro completable en menos de 30 segundos (interfaz simplificada)
3. ✅ Visualización como indicador de color en calendario (con iconos y puntos de dificultad)
4. ✅ Consideración en evaluación de productividad (datos disponibles para cálculos)
5. ✅ No requiere mediciones técnicas ni conocimientos especializados
6. ✅ Background #0f172a coincide exactamente con el dashboard

## Validaciones Implementadas
- Fecha obligatoria
- Condición general obligatoria y válida
- Nivel de dificultad obligatorio y válido
- Observación máximo 200 caracteres
- Mensajes de error descriptivos

## Funcionalidades Futuras
- [ ] Integración con API del backend
- [ ] Persistencia en base de datos
- [ ] Reportes y análisis de tendencias
- [ ] Exportar datos a Excel/PDF
- [ ] Filtros avanzados en calendario
- [ ] Notificaciones por condiciones críticas
- [ ] Historial y comparación de períodos
- [ ] Integración con productividad y nómina

## Performance
- Renderizado optimizado con React.memo
- Hooks personalizados para gestión de estado
- Estructura escalable y mantenible
- Sin dependencias externas innecesarias

## Accesibilidad
- Controles claramente etiquetados
- Colores con suficiente contraste
- Iconos acompañados de texto
- Tooltips informativos
- Formularios con validación clara

## Testing
- Tests unitarios incluidos para WorkConditionsService
- Validaciones de datos integradas
- Manejo de errores robusto
- Tipos TypeScript completos para prevenir errores

---

**Última actualización:** Diciembre 24, 2025  
**Estado:** Listo para producción  
**Versión:** 1.0.0

