# API de Gestión de Usuarios y Roles - AgroMano

## Descripción

Este módulo implementa la funcionalidad completa para asignar roles a usuarios utilizando Auth0 como proveedor de autenticación, cumpliendo con la Historia de Usuario HU-006.

## Características Implementadas

### ✅ Criterios de Aceptación Cumplidos:

1. **Lista de usuarios sin rol o con rol actual** - ✅ Implementado
2. **Selección de rol desde catálogo** - ✅ Implementado
3. **Validación de permisos del administrador** - ✅ Implementado
4. **Actualización inmediata de permisos** - ✅ Implementado
5. **Auditoría de cambios de roles** - ✅ Implementado

## Arquitectura

### Servicios
- **Auth0ManagementService**: Interactúa con Auth0 Management API
- **UserSyncService**: Sincroniza usuarios entre Auth0 y base de datos local

### Controladores
- **UserRoleController**: Gestión de usuarios y roles
- **UserSyncController**: Operaciones de sincronización

### Middleware
- **hybridAuthMiddleware**: Autenticación híbrida Auth0 + Local
- **user-role-permissions.middleware**: Verificación de permisos específicos
- **role-validation.middleware**: Validación de requests

## Endpoints de la API

### Base URL: `/api/admin`

### 1. Gestión de Usuarios

#### Obtener lista de usuarios
```http
GET /api/admin/users
```

**Parámetros de consulta:**
- `page` (opcional): Número de página (default: 0)
- `perPage` (opcional): Elementos por página (default: 25, max: 100)
- `email` (opcional): Filtrar por email
- `name` (opcional): Filtrar por nombre
- `role` (opcional): Filtrar por rol
- `hasRole` (opcional): Filtrar usuarios con/sin roles

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "user": {
          "user_id": "auth0|60a1b2c3d4e5f6789012345",
          "email": "usuario@example.com",
          "name": "Juan Pérez",
          "email_verified": true,
          "created_at": "2024-01-15T10:30:00.000Z"
        },
        "roles": [
          {
            "id": "rol_abc123",
            "name": "Admin",
            "description": "Administrador del sistema"
          }
        ],
        "localUserData": {
          "usuario_id": 1,
          "username": "jperez",
          "rol_id": 1,
          "estado": "activo"
        }
      }
    ],
    "total": 25,
    "page": 0,
    "perPage": 25,
    "totalPages": 1
  },
  "message": "Usuarios obtenidos exitosamente"
}
```

#### Obtener usuarios sin roles
```http
GET /api/admin/users/without-roles?page=0&perPage=25
```

#### Obtener usuario específico
```http
GET /api/admin/users/{userId}
```

### 2. Gestión de Roles

#### Obtener lista de roles disponibles
```http
GET /api/admin/roles
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "rol_admin123",
        "name": "Admin",
        "description": "Administrador del sistema"
      },
      {
        "id": "rol_user456",
        "name": "Usuario",
        "description": "Usuario estándar"
      },
      {
        "id": "rol_supervisor789",
        "name": "Supervisor",
        "description": "Supervisor de campo"
      }
    ],
    "total": 3
  },
  "message": "Roles obtenidos exitosamente"
}
```

### 3. Asignación de Roles

#### Asignar/Actualizar roles de un usuario
```http
PUT /api/admin/users/{userId}/roles
```

**Cuerpo de la petición:**
```json
{
  "roleIds": ["rol_admin123", "rol_supervisor789"],
  "reason": "Promoción a supervisor con permisos administrativos"
}
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "userId": "auth0|60a1b2c3d4e5f6789012345",
    "roles": [
      {
        "id": "rol_admin123",
        "name": "Admin",
        "description": "Administrador del sistema"
      },
      {
        "id": "rol_supervisor789",
        "name": "Supervisor",
        "description": "Supervisor de campo"
      }
    ],
    "assignedBy": "admin_user"
  },
  "message": "Roles asignados exitosamente"
}
```

#### Remover roles de un usuario
```http
DELETE /api/admin/users/{userId}/roles
```

**Cuerpo de la petición:**
```json
{
  "roleIds": ["rol_admin123"],
  "reason": "Cambio de departamento"
}
```

### 4. Auditoría y Historial

#### Obtener historial de cambios de roles
```http
GET /api/admin/users/{userId}/role-history?page=0&limit=20
```

#### Obtener historial completo
```http
GET /api/admin/role-history?page=0&limit=20
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "log_id": 1,
        "entidad": "auth0_user_roles",
        "entidad_id": 123,
        "accion": "update_roles",
        "datos_antes": "{\"roles\":[\"rol_user456\"]}",
        "datos_despues": "{\"roles\":[\"rol_admin123\",\"rol_supervisor789\"]}",
        "usuario_id": 1,
        "fecha_at": "2024-01-15T10:30:00.000Z",
        "ip_origen": "192.168.1.100"
      }
    ],
    "total": 1,
    "page": 0,
    "limit": 20,
    "totalPages": 1
  },
  "message": "Historial obtenido exitosamente"
}
```

### 5. Sincronización

#### Sincronizar usuario específico
```http
POST /api/admin/sync/users/{userId}
```

#### Sincronizar todos los usuarios
```http
POST /api/admin/sync/users
```

#### Verificar integridad de datos
```http
GET /api/admin/sync/integrity
```

#### Obtener estadísticas de sincronización
```http
GET /api/admin/sync/stats
```

#### Limpiar usuarios huérfanos
```http
DELETE /api/admin/sync/orphaned-users?dryRun=true
```

## Autenticación y Permisos

### Requisitos de Autenticación
1. **Token Auth0 válido** en el header `Authorization: Bearer <token>`
2. **Usuario local sincronizado** con permisos apropiados

### Permisos Requeridos

#### Para lectura de usuarios y roles:
- `roles:read`
- `usuarios:read`
- `admin:full`

#### Para asignación de roles:
- `roles:assign`
- `users:manage`
- `admin:full`

#### Para gestión completa:
- `admin:full`

### Ejemplo de Headers
```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6...
Content-Type: application/json
```

## Códigos de Estado HTTP

- `200` - Operación exitosa
- `400` - Datos de entrada inválidos
- `401` - No autenticado
- `403` - Permisos insuficientes
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

## Validaciones Implementadas

### Validación de entrada:
- IDs de usuario deben seguir formato Auth0: `auth0|{identificador}`
- Array de roles no puede estar vacío
- Razón opcional máximo 255 caracteres
- Parámetros de paginación validados

### Validaciones de seguridad:
- Usuario no puede modificar sus propios roles
- Solo administradores pueden asignar roles
- Verificación de existencia de usuario en Auth0
- Auditoría completa de todas las operaciones

## Configuración Requerida

### Variables de Entorno
```env
# Auth0 Configuration
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_AUDIENCE=https://tu-api.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret

# Database
DATABASE_URL="mysql://user:password@host:port/database"
```

### Scopes requeridos en Auth0:
```
read:users
update:users
read:roles
update:roles
read:role_members
create:role_members
delete:role_members
```

## Ejemplos de Uso con JavaScript

### Obtener usuarios
```javascript
const response = await fetch('/api/admin/users?page=0&perPage=10', {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.data.users);
```

### Asignar roles
```javascript
const assignRoles = async (userId, roleIds, reason) => {
  const response = await fetch(`/api/admin/users/${userId}/roles`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roleIds,
      reason
    })
  });

  return await response.json();
};

// Uso
await assignRoles(
  'auth0|60a1b2c3d4e5f6789012345',
  ['rol_admin123', 'rol_supervisor789'],
  'Promoción a supervisor'
);
```

## Manejo de Errores

### Errores comunes y soluciones:

#### Error 400 - Datos inválidos
```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "roleIds",
      "message": "Debe especificar al menos un rol"
    }
  ]
}
```

#### Error 403 - Permisos insuficientes
```json
{
  "success": false,
  "message": "No tienes permisos para gestionar usuarios y roles",
  "required_permissions": ["users:manage", "roles:assign", "admin:full"]
}
```

## Notas Técnicas

1. **Sincronización**: Los usuarios se sincronizan automáticamente entre Auth0 y la base de datos local
2. **Auditoría**: Todas las operaciones de roles se registran en `mol_audit_log`
3. **Seguridad**: Se implementan múltiples capas de validación y autorización
4. **Performance**: Se utiliza paginación para manejar grandes cantidades de usuarios
5. **Integridad**: Sistema de verificación de integridad entre Auth0 y datos locales

## Troubleshooting

### Problemas comunes:

1. **Usuario no encontrado**: Verificar que el usuario existe en Auth0
2. **Error de sincronización**: Ejecutar endpoint de sincronización manual
3. **Permisos insuficientes**: Verificar roles y permisos del usuario administrativo
4. **Roles no aplicados**: Los roles se aplican inmediatamente en Auth0, verificar cache del cliente