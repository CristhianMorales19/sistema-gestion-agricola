# 🔐 Gestión de Usuarios y Roles - HU-006

## 📋 Resumen

**Historia de Usuario:** HU-006: Asignar rol a usuario

**Descripción:** Como administrador, quiero asignar roles a usuarios para controlar el acceso a diferentes funcionalidades del sistema.

## ✅ Estado de Implementación

**COMPLETADO AL 100%** - Todos los criterios de aceptación implementados y funcionando.

### Criterios de Aceptación Cumplidos:

- ✅ **Lista de usuarios sin rol o con rol actual**
- ✅ **Selección de rol desde catálogo**  
- ✅ **Validación de permisos del administrador**
- ✅ **Actualización inmediata de permisos**
- ✅ **Auditoría de cambios de roles**

## 🚀 Funcionalidades Implementadas

### 1. **Gestión de Usuarios**
- Listar todos los usuarios con sus roles actuales
- Filtrar usuarios por email, nombre, rol
- Buscar usuarios sin roles asignados
- Ver detalles completos de un usuario específico
- Paginación para manejar grandes volúmenes de datos

### 2. **Gestión de Roles**
- Obtener catálogo completo de roles de Auth0
- Asignar múltiples roles a un usuario
- Remover roles específicos de un usuario
- Actualizar roles completos de un usuario
- Validación de roles existentes

### 3. **Seguridad y Permisos**
- Autenticación híbrida (Auth0 + Base de datos local)
- Verificación de permisos administrativos
- Validación de que usuario no modifique sus propios roles
- Rate limiting y validación de entrada
- Manejo seguro de errores

### 4. **Auditoría Completa**
- Registro de todos los cambios de roles
- Trazabilidad de quién hizo qué cambio y cuándo
- Historial completo por usuario
- Razones de los cambios
- IP de origen de las modificaciones

### 5. **Sincronización**
- Sincronización automática entre Auth0 y base de datos local
- Verificación de integridad de datos
- Limpieza de usuarios huérfanos
- Estadísticas de sincronización

## 📁 Archivos Implementados

### 🔧 Servicios
- `src/services/auth0-management.service.ts` - Interacción con Auth0 Management API
- `src/services/user-sync.service.ts` - Sincronización de usuarios

### 🎮 Controladores
- `src/controllers/user-role.controller.ts` - Gestión principal de usuarios y roles
- `src/controllers/user-sync.controller.ts` - Operaciones de sincronización

### 🛡️ Middleware
- `src/middleware/user-role-permissions.middleware.ts` - Verificación de permisos específicos
- `src/middleware/hybrid-auth.middleware.ts` - Autenticación híbrida Auth0 + Local
- `src/middleware/role-validation.middleware.ts` - Validación de requests

### 🌐 Rutas
- `src/routes/user-role-management.ts` - Todos los endpoints de gestión

### 📝 Types
- `src/types/auth0-roles.types.ts` - Interfaces y tipos TypeScript

### 📚 Documentación
- `docs/API_GESTION_USUARIOS_ROLES.md` - Documentación completa de la API
- `docs/AUTH0_USUARIOS_ROLES_CONFIG.md` - Configuración de Auth0
- `README_HU006.md` - Este archivo

### 🧪 Scripts de Prueba
- `scripts/test-user-roles.ts` - Suite completa de pruebas

## 🛠️ Configuración Necesaria

### 1. Auth0 Setup
```bash
# 1. Crear aplicación Machine-to-Machine en Auth0
# 2. Autorizar para Management API
# 3. Configurar scopes: read:users, update:users, read:roles, update:roles, etc.
```

### 2. Variables de Entorno
```env
AUTH0_DOMAIN=tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_AUDIENCE=https://tu-api.com
```

### 3. Base de Datos
```sql
-- Ejecutar scripts SQL para permisos y roles
-- Ver archivo: docs/AUTH0_USUARIOS_ROLES_CONFIG.md
```

## 🚀 Cómo Usar

### 1. Iniciar el Servidor
```bash
npm run dev
```

### 2. Obtener Token Auth0
```javascript
// Obtener token de autenticación desde Auth0
const token = "eyJhbGciOiJSUzI1NiIs...";
```

### 3. Ejemplos de Uso

#### Listar Usuarios
```bash
curl -H "Authorization: Bearer $TOKEN" \
     "http://localhost:3001/api/admin/users?page=0&perPage=10"
```

#### Obtener Roles Disponibles
```bash
curl -H "Authorization: Bearer $TOKEN" \
     "http://localhost:3001/api/admin/roles"
```

#### Asignar Roles
```bash
curl -X PUT \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"roleIds":["rol_admin123"],"reason":"Promoción"}' \
     "http://localhost:3001/api/admin/users/auth0|123456/roles"
```

#### Ver Historial
```bash
curl -H "Authorization: Bearer $TOKEN" \
     "http://localhost:3001/api/admin/users/auth0|123456/role-history"
```

### 4. Ejecutar Pruebas
```bash
# Configurar token en scripts/test-user-roles.ts
npm run test:user-roles
```

## 📊 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/users` | Listar usuarios con filtros |
| GET | `/api/admin/users/without-roles` | Usuarios sin roles |
| GET | `/api/admin/users/{id}` | Detalles de usuario |
| GET | `/api/admin/roles` | Catálogo de roles |
| PUT | `/api/admin/users/{id}/roles` | Asignar roles |
| DELETE | `/api/admin/users/{id}/roles` | Remover roles |
| GET | `/api/admin/users/{id}/role-history` | Historial de usuario |
| GET | `/api/admin/role-history` | Historial completo |
| POST | `/api/admin/sync/users` | Sincronizar usuarios |
| GET | `/api/admin/sync/stats` | Estadísticas |

## 🔒 Seguridad Implementada

### Autenticación
- ✅ Token JWT Auth0 requerido
- ✅ Verificación de firma digital
- ✅ Validación de audiencia y emisor

### Autorización
- ✅ Permisos específicos por endpoint
- ✅ Roles administrativos requeridos
- ✅ Usuario no puede modificar sus propios roles

### Validación
- ✅ Validación de formato de IDs Auth0
- ✅ Validación de arrays de roles
- ✅ Sanitización de entrada
- ✅ Límites de caracteres

### Auditoría
- ✅ Registro de todas las operaciones
- ✅ IP de origen
- ✅ Timestamp preciso
- ✅ Datos antes/después del cambio

## 🧪 Testing

### Pruebas Manuales
```bash
# 1. Configurar token en test script
# 2. Ejecutar suite de pruebas
npm run test:user-roles
```

### Pruebas con Postman/Thunder Client
```json
{
  "info": {
    "name": "AgroMano - User Role Management",
    "description": "Collection para probar gestión de usuarios y roles"
  }
}
```

### Casos de Prueba Cubiertos
- ✅ Autenticación exitosa y fallida
- ✅ Permisos suficientes e insuficientes
- ✅ Asignación de roles válidos e inválidos
- ✅ Validación de entrada correcta e incorrecta
- ✅ Auditoría de todas las operaciones
- ✅ Sincronización Auth0 ↔ Local
- ✅ Manejo de errores

## 📈 Métricas y Monitoreo

### Logs Implementados
- ✅ Operaciones de roles registradas
- ✅ Errores detallados con contexto
- ✅ Performance de sincronización
- ✅ Intentos de acceso no autorizado

### Auditoría
- ✅ Tabla `mol_audit_log` con registros completos
- ✅ Endpoints para consultar historial
- ✅ Filtros por usuario, fecha, acción

## 🔮 Próximas Mejoras

### Funcionalidades Adicionales
- [ ] Notificaciones por email cuando se asignan roles
- [ ] API webhooks para integraciones externas
- [ ] Dashboard visual de roles y permisos
- [ ] Bulk operations (asignación masiva)
- [ ] Roles temporales con expiración

### Optimizaciones
- [ ] Cache de roles para mejor performance
- [ ] Paginación optimizada para grandes datasets
- [ ] Compresión de respuestas JSON
- [ ] Rate limiting más granular

## 🆘 Troubleshooting

### Problemas Comunes

#### Error 401 - No autenticado
```
Solución: Verificar token Auth0 válido y configuración
```

#### Error 403 - Permisos insuficientes
```
Solución: Asegurar que usuario tiene roles administrativos
```

#### Error de sincronización
```
Solución: Ejecutar endpoint de sincronización manual
```

#### Roles no aplicados
```
Solución: Verificar configuración Auth0 Management API
```

### Logs Útiles
```bash
# Ver logs del servidor
tail -f logs/app.log

# Ver logs específicos de roles
grep "role" logs/app.log

# Ver errores de Auth0
grep "auth0" logs/error.log
```

## 👥 Contribuir

### Estructura de Commits
```
feat(roles): agregar funcionalidad X
fix(auth): corregir validación Y  
docs(api): actualizar documentación Z
```

### Testing Requerido
- Agregar tests unitarios
- Validar casos edge
- Probar con datos reales
- Verificar performance

---

**Estado:** ✅ **IMPLEMENTACIÓN COMPLETA**  
**Fecha:** Septiembre 2024  
**Versión:** 1.0.0

La Historia de Usuario HU-006 está 100% implementada y lista para producción. Todos los criterios de aceptación se han cumplido exitosamente.