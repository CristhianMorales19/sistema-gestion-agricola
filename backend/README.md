# Backend - Sistema de Gestión Agrícola

API REST con Node.js, Express y TypeScript para el sistema de gestión agrícola.

## Estructura de Carpetas

La estructura sigue la **Screaming Architecture**, organizando el código por dominios de negocio:

```
src/
├── caracteristicas/          # Dominios de negocio
│   ├── auth/                # Autenticación y autorización
│   ├── personal/            # Gestión de empleados
│   ├── asistencia/          # Control de asistencia
│   ├── nomina/              # Administración de nómina
│   ├── productividad/       # Control de productividad
│   └── reportes/            # Generación de reportes
├── infraestructura/         # Configuración técnica
│   ├── base-datos/          # Configuración de base de datos
│   ├── servidor/            # Configuración del servidor Express
│   └── middleware/          # Middleware personalizado
└── compartido/              # Código reutilizable
    ├── utilidades/          # Funciones auxiliares
    ├── constantes/          # Constantes de la aplicación
    └── tipos/               # Tipos TypeScript compartidos
```

## Convenciones por Característica

Cada característica (dominio) contiene:

- **controladores/**: Controladores HTTP (Express)
- **servicios/**: Lógica de negocio
- **repositorios/**: Acceso a datos (patrón Repository)
- **modelos/**: Modelos de datos y validaciones
- **rutas/**: Definición de endpoints

## Variables de Entorno

```bash
# .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=gestion_agricola
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

## Instalación

```bash
npm install
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm start` - Inicia el servidor en producción
- `npm run build` - Compila TypeScript
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Ejecuta el linter
