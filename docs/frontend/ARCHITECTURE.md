"""
````markdown
# Estructura del Frontend - Screaming Architecture

## 🏗️ Organización por Características del Negocio

```
frontend/src/
├── 🔐 authentication/           # CARACTERÍSTICA PRINCIPAL: Autenticación
│   ├── domain/                  # Lógica de negocio pura
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Role.ts
│   │   │   └── Permission.ts
│   │   ├── repositories/
│   │   │   └── AuthRepository.ts
│   │   └── use-cases/
│   │       ├── LoginUser.ts
│   │       ├── LogoutUser.ts
│   │       └── GetUserPermissions.ts
│   ├── infrastructure/          # Implementaciones externas
│   │   ├── auth0/
│   │   │   ├── Auth0Service.ts
│   │   │   └── Auth0Repository.ts
│   │   └── api/
│   │       └── AuthApiClient.ts
│   ├── application/             # Servicios de aplicación
│   │   ├── services/
│   │   │   └── AuthService.ts
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       └── usePermissions.ts
│   └── presentation/            # UI y componentes
│       ├── components/
│       │   ├── LoginPage/
│       │   ├── RoleSelector/
│       │   └── UserProfile/
│       └── styles/
│
├── 🏢 user-management/          # Gestión de usuarios
├── 👥 personnel-management/     # Gestión de personal  
├── ⏰ attendance-tracking/      # Control de asistencia
├── 💰 payroll-processing/       # Procesamiento de nómina
├── 📊 productivity-monitoring/  # Monitoreo de productividad
├── 📈 reporting-analytics/      # Reportes y análisis
├── ⚙️ system-configuration/     # Configuración del sistema
│
├── 🔧 shared/                   # Componentes compartidos
│   ├── ui/                      # Componentes UI reutilizables
│   ├── utils/                   # Utilidades
│   ├── constants/               # Constantes
│   └── types/                   # Tipos compartidos
│
└── 🚀 app/                      # Configuración de la aplicación
	├── providers/               # Providers globales
	├── routing/                 # Configuración de rutas
	└── config/                  # Configuración general
```

## 🎯 Principios Aplicados

- **Screaming Architecture**: El nombre de las carpetas grita el propósito del sistema
- **Clean Architecture**: Separación clara de responsabilidades
- **Domain Driven Design**: Organización por dominios de negocio
- **Separation of Concerns**: Cada capa tiene una responsabilidad específica

````
"""

// ...existing code...
