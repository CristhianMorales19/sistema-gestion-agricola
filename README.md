# Sistema de Gestión Agrícola

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue)](https://reactjs.org/)

Sistema integral para la gestión de personal, asistencia, nómina, productividad y reportes en el sector agrícola.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Documentation](#api-documentation)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## ✨ Características

### 👥 Gestión de Personal
- Registro y edición de empleados
- Gestión de cargos y departamentos
- Asignación de roles y permisos
- Historial laboral

### ⏰ Control de Asistencia
- Registro de entrada y salida
- Control de horarios de trabajo
- Gestión de permisos y ausencias
- Reportes de asistencia

### 💰 Gestión de Nómina
- Configuración de salarios base
- Cálculo de horas extras
- Gestión de deducciones
- Generación de recibos de pago

### 📊 Control de Productividad
- Registro de tareas y actividades
- Seguimiento de metas y objetivos
- Evaluación de rendimiento
- Indicadores de productividad

### 📈 Gestión de Reportes
- Reportes de personal, asistencia y nómina
- Reportes de productividad
- Exportación a PDF y Excel
- Reportes personalizados

### 🔐 Autenticación
- Sistema de login/logout
- Gestión de usuarios y roles
- Control de acceso por permisos
- Recuperación de contraseñas

## 🛠 Tecnologías

### Frontend
- **React** 18.2+ con TypeScript
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Material-UI** o **Tailwind CSS** (por definir)

### Backend
- **Node.js** 16+ con TypeScript
- **Express.js** para API REST
- **MySQL** como base de datos
- **JWT** para autenticación
- **Bcrypt** para encriptación
- **Winston** para logging

### DevOps & Tools
- **Git** para control de versiones
- **ESLint** y **Prettier** para calidad de código
- **Jest** para testing
- **Nodemon** para desarrollo

## 📁 Estructura del Proyecto

El proyecto está organizado siguiendo la **Screaming Architecture** (Arquitectura que Grita), donde los nombres de las carpetas reflejan claramente los dominios de negocio:

```
ProyectoIngenieria/
├── frontend/              # Aplicación React
│   └── src/
│       ├── caracteristicas/    # Dominios de negocio
│       ├── infraestructura/    # Configuración técnica
│       └── compartido/         # Código reutilizable
├── backend/               # API Node.js/Express
│   └── src/
│       ├── caracteristicas/    # Dominios de negocio
│       ├── infraestructura/    # Configuración técnica
│       └── compartido/         # Código reutilizable
└── database/              # Scripts de base de datos
    ├── esquemas/
    ├── migraciones/
    └── semillas/
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 16.0+ 
- npm 8.0+
- MySQL 8.0+
- Git

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sistema-gestion-agricola.git
cd sistema-gestion-agricola
```

### Instalar dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

## ⚙️ Configuración

### Base de Datos

1. Crear la base de datos MySQL:
```sql
CREATE DATABASE gestion_agricola CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Ejecutar migraciones:
```bash
cd database
# Ejecutar scripts en orden desde esquemas/ y migraciones/
```

### Variables de Entorno

Crear archivo `.env` en la carpeta `backend/` basado en `.env.example`:

```bash
cd backend
cp .env.example .env
```

Configurar las variables:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gestion_agricola
JWT_SECRET=tu_secreto_jwt_muy_seguro
PORT=3000
```

## 💻 Uso

### Desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

### Producción

```bash
# Construir frontend
cd frontend
npm run build

# Construir backend
cd ../backend
npm run build

# Iniciar servidor
npm start
```

## 📚 API Documentation

### Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

#### Personal
- `GET /api/personal` - Listar empleados
- `POST /api/personal` - Crear empleado
- `PUT /api/personal/:id` - Actualizar empleado
- `DELETE /api/personal/:id` - Eliminar empleado

#### Asistencia
- `POST /api/asistencia/entrada` - Registrar entrada
- `POST /api/asistencia/salida` - Registrar salida
- `GET /api/asistencia/empleado/:id` - Asistencia por empleado

#### Nómina
- `GET /api/nomina/calcular/:periodo` - Calcular nómina
- `POST /api/nomina/procesar` - Procesar nómina
- `GET /api/nomina/recibo/:empleado` - Generar recibo

> Para documentación completa de la API, ver archivos README en cada módulo del backend.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee el archivo [CONTRIBUTING.md](CONTRIBUTING.md) para conocer nuestras pautas de contribución.

### Proceso rápido:

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-github](https://github.com/tu-usuario)

## 🙏 Reconocimientos

- Inspirado en las necesidades reales del sector agrícola
- Construido con las mejores prácticas de desarrollo
- Siguiendo principios de Clean Architecture

---

⭐ ¡No olvides dar una estrella al proyecto si te resulta útil!

## 📅 Planificación de Desarrollo

El proyecto está dividido en **5 sprints estratégicos**:

### 🎓 Periodo Académico (4 semanas)
- **Sprint 1** (2 sem): Fundación - Auth + Personal básico (6 HU)
- **Sprint 2** (2 sem): Asistencia básica + Usuarios (6 HU)

### 🏖️ Periodo Vacaciones (8 semanas)  
- **Sprint 3** (3 sem): Reportes + Permisos + Nómina base (6 HU)
- **Sprint 4** (3 sem): Nómina completa + Productividad (7 HU)
- **Sprint 5** (2 sem): Reportes avanzados + Optimización (7 HU)

📋 Ver planificación detallada en [`PLANIFICACION_SPRINTS.md`](PLANIFICACION_SPRINTS.md)
