# Frontend - Sistema de Gestión Agrícola

Aplicación React con TypeScript para la interfaz de usuario del sistema de gestión agrícola.

## Estructura de Carpetas

La estructura sigue la **Screaming Architecture**, organizando el código por dominios de negocio:

```
src/
├── caracteristicas/           # Dominios de negocio
│   ├── autenticacion/        # Sistema de login y usuarios
│   ├── gestion-personal/     # Gestión de empleados
│   ├── control-asistencia/   # Control de asistencia
│   ├── gestion-nomina/       # Administración de nómina
│   ├── control-productividad/ # Control de productividad
│   └── gestion-reportes/     # Generación de reportes
├── infraestructura/          # Configuración técnica
│   ├── api/                  # Cliente HTTP y configuración de API
│   ├── almacenamiento/       # LocalStorage, SessionStorage
│   └── navegacion/           # Configuración de rutas
└── compartido/               # Código reutilizable
    ├── componentes/          # Componentes UI comunes
    ├── utilidades/           # Funciones auxiliares
    ├── constantes/           # Constantes de la aplicación
    └── tipos/                # Tipos TypeScript compartidos
```

## Convenciones por Característica

Cada característica (dominio) contiene:

- **componentes/**: Componentes React específicos del dominio
- **servicios/**: Lógica de negocio y llamadas a API
- **hooks/**: Hooks personalizados de React
- **tipos/**: Interfaces y tipos TypeScript del dominio

## Instalación

```bash
npm install
npm start
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Ejecuta el linter
