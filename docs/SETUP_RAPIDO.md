# Setup Rápido del Proyecto

Guía paso a paso para configurar el entorno de desarrollo usando los frameworks y librerías recomendadas.

## 🚀 Instalación Rápida (15 minutos)

### Paso 1: Clonar y Setup Inicial
```bash
# Ya tienes el proyecto, así que:
cd C:\Users\Cristhian\Desktop\ProyectoIngenieria

# Instalar dependencias optimizadas
cd frontend && npm install
cd ../backend && npm install
```

### Paso 2: Configurar Base de Datos con Prisma
```bash
cd backend

# Inicializar Prisma (más fácil que MySQL directo)
npx prisma init

# Generar cliente
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Llenar con datos iniciales
npx prisma db seed
```

### Paso 3: Configurar Variables de Entorno
```bash
# Backend
cp .env.example .env

# Editar .env con:
DATABASE_URL="mysql://root:password@localhost:3306/gestion_agricola"
JWT_SECRET="tu-secreto-super-seguro"
PORT=3001
```

### Paso 4: Ejecutar en Modo Desarrollo
```bash
# Terminal 1 - Backend con auto-reload
cd backend && npm run dev

# Terminal 2 - Frontend con hot-reload  
cd frontend && npm start
```

## ⚡ Aceleradores Implementados

### Material-UI Setup Automático
Ya configurado en package.json:
- Dashboard components listos
- Forms con validación automática
- Tablas con paginación incluida
- Iconos y themes profesionales

### Prisma ORM
Reemplaza SQL manual:
```javascript
// En lugar de escribir SQL:
const empleados = await prisma.empleado.findMany({
  include: { cargo: true, departamento: true }
});

// Auto-completado y type safety incluido
```

### React Hook Form + Yup
Formularios sin dolor:
```javascript
// Validación automática
const schema = yup.object({
  nombre: yup.string().required('Nombre requerido'),
  email: yup.string().email().required('Email requerido')
});

// Hook form maneja todo automáticamente
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
});
```

### React Query
HTTP state automático:
```javascript
// Cache, loading, error handling automático
const { data: empleados, isLoading, error } = useQuery(
  ['empleados'], 
  fetchEmpleados,
  { refetchInterval: 30000 } // Auto-refresh cada 30s
);
```

## 📦 Templates Pre-configurados

### Componente Empleado (Lista + Form)
```javascript
// Ya incluye: búsqueda, filtros, paginación, validación
import { EmpleadoDataGrid } from '@/components/empleados/EmpleadoDataGrid';
import { EmpleadoForm } from '@/components/empleados/EmpleadoForm';
```

### Dashboard Template
```javascript
// Layout completo con navegación
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AsistenciaDashboard } from '@/components/dashboard/AsistenciaDashboard';
```

### API Controllers Pre-construidos
```javascript
// CRUD automático con Prisma
export const empleadoController = createCRUDController('empleado', {
  include: { cargo: true, departamento: true }
});
```

## 🎯 Sprint 1 Acelerado (1 semana en lugar de 2)

### Día 1: Auth Instantáneo
```bash
# Usar Passport.js pre-configurado
npm install passport passport-local passport-jwt

# O mejor aún, Auth0 (5 minutos):
npm install @auth0/auth0-react
# Configurar en auth0.com, copiar keys, listo
```

### Día 2-3: CRUD con Material-UI
```bash
# DataGrid con todas las funciones
import { DataGrid } from '@mui/x-data-grid';

# Forms automáticos
import { AutoForm } from '@/components/shared/AutoForm';
```

### Día 4-5: Testing y Pulido
```bash
# Tests automáticos
npm install -D @testing-library/react vitest

# Storybook para componentes
npx storybook@latest init
```

## 🛠 Herramientas de Desarrollo

### VS Code Extensions Recomendadas
```json
{
  "recommendations": [
    "prisma.prisma",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Database GUI
```bash
# Prisma Studio (mejor que phpMyAdmin)
npx prisma studio
# Abre en http://localhost:5555
```

### API Testing
```bash
# Thunder Client en VS Code
# O instalar Insomnia/Postman
```

## 📊 Monitoreo y Analytics

### Performance Monitoring
```javascript
// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Bundle analyzer
npm install -D @next/bundle-analyzer
```

### Error Tracking
```javascript
// Sentry para errores en producción
npm install @sentry/react @sentry/node
```

## 🚀 Deployment Rápido

### Vercel (Frontend)
```bash
# Deploy automático desde GitHub
npm install -g vercel
vercel --prod
```

### Railway/Heroku (Backend)
```bash
# Deploy con un comando
npm install -g railway
railway deploy
```

### Database
```bash
# PlanetScale (MySQL en la nube)
# O Railway PostgreSQL
# Configuración en 2 minutos
```

## 📈 Métricas de Aceleración

### Tiempo Original vs Acelerado:

| Funcionalidad | Tiempo Manual | Con Frameworks | Ahorro |
|---------------|---------------|----------------|--------|
| Auth Sistema | 3 días | 2 horas | 95% |
| CRUD Empleados | 4 días | 1 día | 75% |
| Dashboard | 5 días | 1 día | 80% |
| Reportes PDF | 3 días | 2 horas | 90% |
| Gráficos | 2 días | 1 hora | 95% |
| **TOTAL Sprint 1** | **2 semanas** | **3-4 días** | **75%** |

## 🎯 Próximos Pasos Inmediatos

### 1. Setup Material-UI Theme
```bash
cd frontend
# Configurar theme personalizado para agricultura
```

### 2. Configurar Prisma Schema
```bash
cd backend
# Convertir migraciones SQL a Prisma schema
```

### 3. Implementar Auth con Auth0
```bash
# Registro en auth0.com
# Configuración en 5 minutos
# Auth completo funcionando
```

### 4. Generar Componentes Base
```bash
# Usar plop.js para generar:
# - Componente Empleado completo
# - API routes
# - Types TypeScript
```

**¡Con estos aceleradores, tu Sprint 1 se puede completar en 3-4 días en lugar de 2 semanas!** 🚀
