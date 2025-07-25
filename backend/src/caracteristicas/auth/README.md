# Autenticación - Backend

API para la gestión de usuarios, autenticación y autorización del sistema.

## Endpoints Principales

```
POST   /api/auth/login              # Iniciar sesión
POST   /api/auth/logout             # Cerrar sesión
POST   /api/auth/register           # Registrar usuario
POST   /api/auth/refresh            # Renovar token
POST   /api/auth/forgot-password    # Solicitar recuperación
POST   /api/auth/reset-password     # Restablecer contraseña
POST   /api/auth/change-password    # Cambiar contraseña

GET    /api/usuarios                # Listar usuarios
GET    /api/usuarios/:id            # Obtener usuario
PUT    /api/usuarios/:id            # Actualizar usuario
DELETE /api/usuarios/:id            # Eliminar usuario

GET    /api/roles                   # Listar roles
POST   /api/roles                   # Crear rol
PUT    /api/roles/:id               # Actualizar rol
```

## Modelos

- **Usuario**: Información de usuarios del sistema
- **Rol**: Roles y permisos
- **Sesion**: Control de sesiones activas
- **TokenRecuperacion**: Tokens para recuperación de contraseña

## Servicios

- `AuthService`: Autenticación y autorización
- `UsuarioService`: Gestión de usuarios
- `RolService`: Administración de roles
- `TokenService`: Gestión de tokens JWT

## Middleware

- `authMiddleware`: Verificación de tokens
- `roleMiddleware`: Control de acceso por roles
- `rateLimitMiddleware`: Límite de intentos de login

## Seguridad

- Encriptación de contraseñas con bcrypt
- Tokens JWT con expiración
- Validación de permisos por endpoint
- Registro de intentos de acceso
