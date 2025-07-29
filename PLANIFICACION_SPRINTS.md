# Planificación de Sprints - Sistema de Gestión Agrícola

División estratégica de las 32 Historias de Usuario en 5 sprints, considerando entregas académicas y desarrollo en vacaciones.

## 📅 Cronograma General

### **Periodo Académico (Sprints 1-2)**
- **Sprint 1**: 2 semanas - Entrega académica
- **Sprint 2**: 2 semanas - Entrega académica
- Total: **16 HU** (Funcionalidades básicas del sistema)

### **Periodo de Vacaciones (Sprints 3-5)**
- **Sprint 3**: 3 semanas - Desarrollo intensivo
- **Sprint 4**: 3 semanas - Desarrollo intensivo  
- **Sprint 5**: 2 semanas - Refinamiento y entrega final
- Total: **16 HU** (Funcionalidades avanzadas y optimización)

---

## 🚀 Sprint 1 (2 semanas) - Fundación del Sistema
**Objetivo**: Establecer la base del sistema con autenticación y gestión básica de personal

### Historias de Usuario (6 HU):
- **HU-026**: Login de usuario ⭐ **(Crítico)**
- **HU-027**: Logout de usuario ⭐ **(Crítico)**
- **HU-001**: Registro de nuevo empleado ⭐ **(Crítico)**
- **HU-002**: Edición de información de empleado
- **HU-003**: Consulta de empleados
- **HU-005**: Gestión de cargos

### ✅ Entregables Sprint 1:
- Sistema de autenticación funcional
- CRUD básico de empleados
- Gestión de cargos y departamentos
- Base de datos configurada
- Frontend con login y listado de empleados

### 🛠 Tareas Técnicas:
- Configuración inicial de base de datos
- Implementación de JWT para autenticación
- Componentes React para login y gestión de personal
- API REST básica (auth + personal)

---

## 🚀 Sprint 2 (2 semanas) - Control de Asistencia Básico
**Objetivo**: Implementar sistema básico de control de asistencia y configuración inicial

### Historias de Usuario (6 HU):
- **HU-006**: Registro de entrada ⭐ **(Crítico)**
- **HU-007**: Registro de salida ⭐ **(Crítico)**
- **HU-008**: Consulta de asistencia diaria
- **HU-028**: Registro de usuario
- **HU-029**: Gestión de perfil de usuario
- **HU-004**: Eliminación de empleado

### ✅ Entregables Sprint 2:
- Sistema de marcado de asistencia
- Consulta de registros diarios
- Gestión completa de usuarios
- CRUD completo de empleados
- Dashboard básico de asistencia

### 🛠 Tareas Técnicas:
- Implementación de registros de entrada/salida
- Dashboard de asistencia en tiempo real
- Validaciones de horarios laborales
- Perfiles de usuario completos

---

## 🚀 Sprint 3 (3 semanas) - Gestión Avanzada de Asistencia y Nómina Base
**Objetivo**: Completar sistema de asistencia y establecer base para nómina

### Historias de Usuario (6 HU):
- **HU-009**: Reporte de asistencia mensual
- **HU-010**: Gestión de permisos y ausencias
- **HU-011**: Configuración de salario base ⭐ **(Crítico)**
- **HU-012**: Cálculo de horas extras
- **HU-030**: Control de acceso por roles ⭐ **(Crítico)**
- **HU-031**: Recuperación de contraseña

### ✅ Entregables Sprint 3:
- Reportes de asistencia completos
- Sistema de permisos y ausencias
- Configuración inicial de nómina
- Sistema de roles y permisos
- Recuperación de contraseñas

### 🛠 Tareas Técnicas:
- Generación de reportes PDF/Excel
- Workflow de aprobación de permisos
- Cálculos básicos de nómina
- Middleware de autorización por roles

---

## 🚀 Sprint 4 (3 semanas) - Nómina Completa y Productividad
**Objetivo**: Sistema completo de nómina y bases del control de productividad

### Historias de Usuario (7 HU):
- **HU-013**: Aplicación de deducciones
- **HU-014**: Generación de recibo de pago ⭐ **(Crítico)**
- **HU-015**: Reporte de nómina mensual
- **HU-016**: Registro de tarea completada
- **HU-017**: Definición de metas de productividad
- **HU-018**: Seguimiento de productividad diaria
- **HU-032**: Cambio de contraseña

### ✅ Entregables Sprint 4:
- Sistema completo de nómina
- Recibos de pago automatizados
- Registro y seguimiento de tareas
- Sistema de metas de productividad
- Reportes financieros

### 🛠 Tareas Técnicas:
- Motor de cálculo de nómina completo
- Generación automática de recibos
- Dashboard de productividad
- Alertas y notificaciones

---

## 🚀 Sprint 5 (2 semanas) - Reportes Avanzados y Optimización
**Objetivo**: Sistema completo de reportes y optimización final del sistema

### Historias de Usuario (7 HU):
- **HU-019**: Evaluación de rendimiento de empleados
- **HU-020**: Reporte de productividad semanal
- **HU-021**: Reporte de empleados activos
- **HU-022**: Reporte de asistencia por período
- **HU-023**: Reporte financiero mensual
- **HU-024**: Reporte de productividad mensual
- **HU-025**: Exportación de reportes a PDF/Excel

### ✅ Entregables Sprint 5:
- Sistema completo de evaluaciones
- Suite completa de reportes
- Exportación en múltiples formatos
- Optimización de rendimiento
- Documentación completa

### 🛠 Tareas Técnicas:
- Dashboard ejecutivo con todos los KPIs
- Optimización de consultas de base de datos
- Sistema completo de exportación
- Testing y documentación final

---

## 📊 Resumen por Módulos

### 🔐 **Autenticación y Usuarios**
- **Sprint 1**: HU-026, HU-027 (Login/Logout básico)
- **Sprint 2**: HU-028, HU-029 (Registro y perfil)
- **Sprint 3**: HU-030, HU-031 (Roles y recuperación)
- **Sprint 4**: HU-032 (Cambio de contraseña)

### 👥 **Gestión de Personal**
- **Sprint 1**: HU-001, HU-002, HU-003, HU-005 (CRUD básico)
- **Sprint 2**: HU-004 (Eliminación)

### ⏰ **Control de Asistencia**
- **Sprint 2**: HU-006, HU-007, HU-008 (Registros básicos)
- **Sprint 3**: HU-009, HU-010 (Reportes y permisos)

### 💰 **Gestión de Nómina**
- **Sprint 3**: HU-011, HU-012 (Configuración base)
- **Sprint 4**: HU-013, HU-014, HU-015 (Sistema completo)

### 📊 **Control de Productividad**
- **Sprint 4**: HU-016, HU-017, HU-018 (Sistema básico)
- **Sprint 5**: HU-019, HU-020 (Evaluaciones avanzadas)

### 📈 **Gestión de Reportes**
- **Sprint 5**: HU-021, HU-022, HU-023, HU-024, HU-025 (Suite completa)

---

## 🎯 Criterios de Éxito por Sprint

### **Sprint 1** ✅
- [ ] Usuario puede hacer login/logout
- [ ] Administrador puede gestionar empleados
- [ ] Base de datos funcionando correctamente

### **Sprint 2** ✅
- [ ] Empleados pueden marcar entrada/salida
- [ ] Se pueden consultar registros diarios
- [ ] Sistema de usuarios completo

### **Sprint 3** ✅
- [ ] Reportes de asistencia funcionando
- [ ] Sistema de permisos operativo
- [ ] Configuración de salarios lista

### **Sprint 4** ✅
- [ ] Nómina calculándose automáticamente
- [ ] Recibos de pago generándose
- [ ] Tracking de productividad funcionando

### **Sprint 5** ✅
- [ ] Todos los reportes operativos
- [ ] Exportación funcionando
- [ ] Sistema optimizado y documentado

---

## 🚨 Dependencias Críticas

### **Sprint 1 → Sprint 2**
- Autenticación debe estar lista
- Base de datos de empleados operativa

### **Sprint 2 → Sprint 3**
- Registros de asistencia funcionando
- Sistema de usuarios con roles

### **Sprint 3 → Sprint 4**
- Datos de asistencia disponibles
- Configuración de salarios lista

### **Sprint 4 → Sprint 5**
- Datos de nómina y productividad disponibles
- Todos los módulos base funcionando

---

## 📝 Recomendaciones

### **Para Entregas Académicas (Sprints 1-2)**
- Enfócate en funcionalidades **básicas pero completas**
- Asegura que login, CRUD de empleados y asistencia básica funcionen perfectamente
- Prepara demos sólidas con datos de prueba

### **Para Desarrollo en Vacaciones (Sprints 3-5)**
- Desarrolla funcionalidades más complejas
- Implementa optimizaciones y mejoras de UX
- Completa la suite de reportes y análisis

### **Flexibilidad**
- Si algún sprint se adelanta, puedes mover HU del siguiente
- Mantén las dependencias críticas respetadas
- Documenta todo para facilitar el trabajo en vacaciones
