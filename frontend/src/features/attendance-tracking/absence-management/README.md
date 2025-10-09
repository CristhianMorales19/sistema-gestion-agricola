# Módulo de Gestión de Ausencias (Absence Management)

## Historia de Usuario: HU-010 - Registrar Ausencia Justificada

### Descripción
Módulo completo para gestionar ausencias justificadas del personal, implementado siguiendo **Screaming Architecture** y **Clean Architecture**.

## Estructura del Módulo

```
absence-management/
├── domain/                           # Capa de Dominio (Lógica de Negocio)
│   ├── entities/
│   │   └── Absence.ts               # Entidades y tipos del dominio
│   ├── repositories/
│   │   └── AbsenceRepository.ts     # Contrato del repositorio
│   └── use-cases/
│       └── AbsenceUseCases.ts       # Casos de uso del negocio
│
├── application/                      # Capa de Aplicación
│   ├── services/
│   │   └── AbsenceService.ts        # Servicio de aplicación
│   └── hooks/
│       └── useAbsenceManagement.ts  # Hook personalizado de React
│
├── infrastructure/                   # Capa de Infraestructura
│   └── ApiAbsenceRepository.ts      # Implementación con API REST
│
├── presentation/                     # Capa de Presentación
│   └── components/
│       ├── RegistrarAusencia/       # Formulario de registro
│       ├── AbsenceTable/            # Tabla de ausencias
│       └── AbsenceManagementView/   # Vista principal
│
└── index.ts                          # Punto de entrada del módulo
```

## Características Implementadas

### ✅ Criterios de Aceptación

1. **Validación de Duplicados**: El sistema valida que no exista un registro de ausencia para la misma fecha y trabajador
2. **Motivos Predefinidos**: Lista de motivos predefinidos más opción personalizada
3. **Documentación de Respaldo**: Soporte para adjuntar archivos (PDF, JPG, PNG) hasta 5MB
4. **Reglas de Pago**: Base para aplicar reglas de pago automáticas
5. **Reportes de Asistencia**: Los datos se reflejan correctamente en los reportes

### 🎨 Componentes

#### 1. RegistrarAusencia
Formulario para registrar nuevas ausencias con:
- Selección de trabajador
- Fecha de ausencia
- Motivo (predefinido o personalizado)
- Comentarios adicionales
- Carga de documentos
- Validaciones en tiempo real

#### 2. AbsenceTable
Tabla para visualizar ausencias con:
- Información del trabajador
- Fecha y motivo
- Estado (pendiente, aprobada, rechazada)
- Acciones (ver, aprobar, rechazar, eliminar)
- Visualización de documentos adjuntos

#### 3. AbsenceManagementView
Vista principal que integra:
- Estadísticas en tiempo real
- Búsqueda y filtros
- Gestión completa del CRUD
- Mensajes de feedback

## Uso del Módulo

### Importar Componentes

```typescript
import { 
  AbsenceManagementView,
  RegistrarAusencia,
  AbsenceTable,
  useAbsenceManagement
} from './absence-management';
```

### Usar el Hook

```typescript
const {
  absences,
  loading,
  error,
  successMessage,
  stats,
  registerAbsence,
  updateAbsence,
  deleteAbsence,
  approveAbsence,
  rejectAbsence,
  uploadDocument,
  refreshAbsences
} = useAbsenceManagement();
```

### Integrar en el Dashboard

```typescript
import { AbsenceManagementView } from './absence-management';

// En tu componente de dashboard
<Route
  path="/ausencias"
  element={
    <ProtectedRoute requiredPermission="gestionar_ausencias">
      <AbsenceManagementView />
    </ProtectedRoute>
  }
/>
```

## Validaciones Implementadas

### Validaciones de Negocio (UseCases)
- ID del trabajador requerido
- Fecha de ausencia requerida
- Motivo requerido
- Motivo personalizado requerido si selecciona "Otro"
- No se permite registrar ausencia duplicada
- Límite de 7 días de anticipación para registros futuros

### Validaciones de Archivo
- Tipos permitidos: PDF, JPG, PNG
- Tamaño máximo: 5MB

## Motivos de Ausencia Predefinidos

- Enfermedad
- Cita médica
- Permiso personal
- Emergencia familiar
- Incapacidad médica
- Duelo
- Matrimonio
- Paternidad/Maternidad
- Otro (especificar)

## API Endpoints Esperados

El módulo espera que el backend implemente los siguientes endpoints:

```
GET    /ausencias                    # Listar todas las ausencias
GET    /ausencias/:id                # Obtener ausencia específica
GET    /ausencias/trabajador/:id     # Ausencias de un trabajador
POST   /ausencias                    # Crear nueva ausencia
PUT    /ausencias/:id                # Actualizar ausencia
DELETE /ausencias/:id                # Eliminar ausencia
POST   /ausencias/:id/aprobar        # Aprobar ausencia
POST   /ausencias/:id/rechazar       # Rechazar ausencia
GET    /ausencias/estadisticas       # Obtener estadísticas
GET    /ausencias/verificar          # Verificar duplicados
POST   /ausencias/:id/documento      # Subir documento
```

## Principios de Clean Architecture Aplicados

### 1. Independencia de Frameworks
- La lógica de negocio no depende de React, Material-UI u otros frameworks
- Los use cases pueden funcionar sin UI

### 2. Testeable
- Los casos de uso son fáciles de probar
- No requieren UI, base de datos o servicios externos

### 3. Independiente de UI
- La lógica de negocio no conoce la UI
- Se puede cambiar fácilmente de React a Vue o Angular

### 4. Independiente de Base de Datos
- Los casos de uso no conocen la implementación del repositorio
- Se puede cambiar fácilmente de REST API a GraphQL

### 5. Dependencias Apuntan Hacia Adentro
- Domain no depende de nada
- Application depende de Domain
- Infrastructure y Presentation dependen de Application

## Próximos Pasos (TODOs)

- [ ] Implementar los endpoints en el backend
- [ ] Agregar paginación a la tabla
- [ ] Implementar filtros avanzados
- [ ] Agregar exportación a Excel/PDF
- [ ] Implementar notificaciones por email
- [ ] Agregar tests unitarios
- [ ] Agregar tests de integración
- [ ] Implementar permisos basados en roles

## Notas para el Equipo Backend

### Estructura de la Tabla `ausencias`

```sql
CREATE TABLE ausencias (
  id SERIAL PRIMARY KEY,
  trabajador_id INTEGER REFERENCES trabajadores(trabajador_id),
  fecha_ausencia DATE NOT NULL,
  motivo VARCHAR(100) NOT NULL,
  motivo_personalizado TEXT,
  documentacion_respaldo VARCHAR(500),
  estado VARCHAR(20) DEFAULT 'pendiente',
  supervisor_id INTEGER,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_aprobacion TIMESTAMP,
  comentarios TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(trabajador_id, fecha_ausencia)
);
```

## Autores

Sprint 2 - 2025-13
Equipo de Desarrollo Sistema Gestión Agrícola
