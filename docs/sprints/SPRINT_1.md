# Sprint 1 - Fundación del Sistema
**Duración**: 2 semanas  
**Tipo**: Entrega académica  
**Objetivo**: Establecer la base del sistema con autenticación y gestión básica de personal

## 🎯 Historias de Usuario (6 HU)

### HU-0: Login de usuario ⭐ **CRÍTICO**
**Como** usuario del sistema  
**Quiero** poder iniciar sesión con mi email y contraseña  
**Para** acceder a las funcionalidades del sistema

**Criterios de Aceptación:**
- [x] Formulario de login con email y contraseña
- [x] Validación de credenciales
- [x] Redirección después del login exitoso
- [x] Manejo de errores de autenticación
- [x] Persistencia de sesión con JWT

### HU-0: Logout de usuario ⭐ **CRÍTICO**
**Como** usuario autenticado  
**Quiero** poder cerrar mi sesión  
**Para** proteger mi información al salir del sistema

**Criterios de Aceptación:**
- [x] Botón de logout visible
- [x] Invalidación del token JWT
- [x] Redirección a página de login
- [x] Limpieza del estado de la aplicación

### HU-0: Registro de nuevo empleado ⭐ **CRÍTICO**
**Como** administrador  
**Quiero** registrar un nuevo empleado  
**Para** gestionar el personal de la empresa

**Criterios de Aceptación:**
- [x] Formulario completo de empleado
- [x] Validación de datos únicos (cédula, email)
- [x] Selección de cargo y departamento
- [x] Guardado en base de datos
- [x] Confirmación de registro exitoso

### HU-002: Edición de información de empleado
**Como** administrador  
**Quiero** editar la información de un empleado  
**Para** mantener los datos actualizados

**Criterios de Aceptación:**
- [x] Formulario prellenado con datos actuales
- [x] Validación de cambios
- [x] Actualización en base de datos
- [x] Confirmación de cambios

### HU-003: Consulta de empleados
**Como** usuario  
**Quiero** consultar la lista de empleados  
**Para** ver información del personal

**Criterios de Aceptación:**
- [x] Lista paginada de empleados
- [x] Filtros por departamento y cargo
- [x] Búsqueda por nombre o cédula
- [x] Vista detallada de empleado

### HU-005: Gestión de cargos
**Como** administrador  
**Quiero** gestionar los cargos de la empresa  
**Para** organizar la estructura laboral

**Criterios de Aceptación:**
- [x] CRUD completo de cargos
- [x] Asignación de salario base por cargo
- [x] Validación de cargos únicos
- [x] Lista de empleados por cargo

## 🛠 Tareas Técnicas Detalladas

### Backend
- [ ] **Configuración inicial**
  - [ ] Setup de Express + TypeScript
  - [ ] Configuración de CORS y middleware
  - [ ] Setup de variables de entorno
  - [ ] Configuración de Winston para logs

- [ ] **Base de datos**
  - [ ] Conexión a MySQL con mysql2
  - [ ] Modelos de Usuario, Empleado, Cargo, Departamento
  - [ ] Migraciones iniciales
  - [ ] Seeds con datos de prueba

- [ ] **Autenticación**
  - [ ] Middleware de autenticación JWT
  - [ ] Controlador de auth (login/logout)
  - [ ] Encriptación de contraseñas con bcrypt
  - [ ] Validaciones con Joi

- [ ] **API Personal**
  - [ ] Controlador de empleados (CRUD)
  - [ ] Controlador de cargos (CRUD)
  - [ ] Servicios de negocio
  - [ ] Repositorios de datos
  - [ ] Rutas protegidas

### Frontend
- [ ] **Setup inicial**
  - [ ] Configuración de React + TypeScript
  - [ ] Setup de React Router
  - [ ] Configuración de Axios
  - [ ] Estructura de carpetas por dominios

- [ ] **Autenticación**
  - [ ] Componente FormularioLogin
  - [ ] Hook useAuth
  - [ ] Context de autenticación
  - [ ] Guard de rutas privadas

- [ ] **Gestión Personal**
  - [ ] Componente ListaEmpleados
  - [ ] Componente FormularioEmpleado
  - [ ] Componente DetalleEmpleado
  - [ ] Hook useEmpleados
  - [ ] Servicios de API

- [ ] **UI/UX**
  - [ ] Layout principal con navegación
  - [ ] Componentes comunes (botones, inputs)
  - [ ] Manejo de estados de carga
  - [ ] Notificaciones de éxito/error

## 📋 Checklist de Entregables

### Funcionalidades Core
- [ ] Login funcional con JWT
- [ ] Logout y manejo de sesiones
- [ ] CRUD completo de empleados
- [ ] Gestión de cargos y departamentos
- [ ] Navegación básica del sistema

### Calidad y Testing
- [ ] Validaciones frontend y backend
- [ ] Manejo de errores
- [ ] Estados de carga
- [ ] Datos de prueba cargados

### Documentación
- [ ] README actualizado
- [ ] Documentación de API básica
- [ ] Guía de instalación
- [ ] Screenshots del sistema funcionando

## 🎮 Demo Script para Entrega Académica

### 1. Mostrar Autenticación (5 min)
- [ ] Intentar acceso sin login → redirección
- [ ] Login con credenciales incorrectas → error
- [ ] Login exitoso → dashboard principal
- [ ] Logout → vuelta al login

### 2. Gestión de Personal (10 min)
- [ ] Listar empleados existentes
- [ ] Crear nuevo empleado paso a paso
- [ ] Mostrar validaciones (email duplicado, etc.)
- [ ] Editar empleado existente
- [ ] Búsqueda y filtros funcionando

### 3. Gestión de Cargos (5 min)
- [ ] Listar cargos
- [ ] Crear nuevo cargo
- [ ] Asignar cargo a empleado
- [ ] Mostrar empleados por cargo

## 🚨 Riesgos y Contingencias

### Riesgos Técnicos
- **Configuración de base de datos**: Preparar scripts automatizados
- **Problemas de CORS**: Configuración documentada
- **Autenticación compleja**: Implementar versión básica primero

### Riesgos de Tiempo
- **Sprint corto (2 semanas)**: Priorizar funcionalidades críticas
- **Complejidad del CRUD**: Templates predefinidos
- **Testing**: Focus en funcionalidades core

### Plan B
- Si hay retrasos, entregar solo HU-026, HU-027, HU-001
- Simplificar UI en favor de funcionalidad
- Documentar lo que funciona vs lo que falta

## ✅ Definición de "Hecho"

Una historia está completa cuando:
- [ ] Funcionalidad implementada en frontend y backend
- [ ] Validaciones funcionando
- [ ] Casos de error manejados
- [ ] Probado manualmente
- [ ] Código subido a GitHub
- [ ] Documentación básica actualizada

## 📅 Cronograma Sugerido

### Semana 1
- **Días 1-2**: Setup inicial (backend + frontend)
- **Días 3-4**: Autenticación (HU-026, HU-027)
- **Días 5-7**: Inicio gestión personal (HU-001)

### Semana 2
- **Días 1-3**: Completar gestión personal (HU-002, HU-003)
- **Días 4-5**: Gestión de cargos (HU-005)
- **Días 6-7**: Testing, documentación y preparación de demo
