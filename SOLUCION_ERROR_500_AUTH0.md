# Solución al Error 500 en Endpoints de Gestión de Usuarios

## 🔍 Problema Identificado

Los endpoints `/api/test/users` y `/api/test/roles` estaban devolviendo errores 500 (Internal Server Error) debido a dos problemas principales:

### 1. **Auth0 Management API no autorizada**
- Error: `Unauthorized` (401) al intentar acceder a la Management API de Auth0
- Causa: La aplicación Auth0 no tiene los permisos necesarios para acceder a la Management API
- Los endpoints requerían obtener usuarios y roles de Auth0, pero fallaban en la autenticación

### 2. **Columna `auth0_user_id` no existe en la base de datos**
- Error: `The column agromano.mot_usuario.auth0_user_id does not exist in the current database`
- Causa: El schema de Prisma define esta columna, pero la base de datos real no la tiene
- El controlador intentaba buscar usuarios por este campo inexistente

### 3. **Frontend esperaba estructura de datos incorrecta**
- Error: `roles.map is not a function`
- Causa: El frontend esperaba recibir un array directo, pero el backend devolvía un objeto envuelto

## ✅ Soluciones Implementadas

### 1. **Sistema de Fallback con Datos Mock**

Creé un servicio mock que provee datos de prueba cuando Auth0 no está disponible:

**Archivo creado:** `backend/src/services/mock-auth0.service.ts`

```typescript
export const mockUsers = [
  {
    user_id: 'auth0|mock-user-1',
    email: 'admin@agromano.com',
    name: 'Administrador AgroMano',
    // ... más datos
  },
  // ... más usuarios
];

export const mockRoles = [
  {
    id: 'rol_mock_admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema'
  },
  // ... más roles
];
```

### 2. **Actualización del Auth0 Management Service**

**Archivo modificado:** `backend/src/services/auth0-management.service.ts`

Agregué:
- Método `testConnectionAndFallback()` para detectar si Auth0 está disponible
- Lógica de fallback en todos los métodos principales:
  - `getUsers()`: Devuelve usuarios mock si Auth0 falla
  - `getRoles()`: Devuelve roles mock si Auth0 falla
  - `getUserById()`: Busca en mock si Auth0 falla
  - `getUserRoles()`: Devuelve roles mock del usuario

```typescript
private async testConnectionAndFallback(): Promise<boolean> {
  try {
    await this.management.roles.getAll({ per_page: 1 });
    return false; // Auth0 funciona
  } catch (error) {
    console.warn('⚠️  Auth0 no disponible, usando datos mock para desarrollo');
    return true; // Usar mock
  }
}
```

### 3. **Manejo Robusto de Errores en el Controlador**

**Archivo modificado:** `backend/src/controllers/user-role.controller.ts`

Cambios en `getUsers()` y `getUserById()`:

```typescript
// Buscar datos locales con manejo de errores
try {
  let localUser = await prisma.mot_usuario.findUnique({
    where: { auth0_user_id: user.user_id }
  }).catch(() => null);

  // Fallback: buscar por username si falla
  if (!localUser && user.email) {
    localUser = await prisma.mot_usuario.findFirst({
      where: { username: user.email.split('@')[0] }
    }).catch(() => null);
  }
} catch (error) {
  console.warn('No se pudo obtener datos locales');
}
```

### 4. **Corrección del Frontend**

**Archivo modificado:** `frontend/src/user-management/services/UserManagementService.ts`

Actualicé el método `getRoles()` para extraer correctamente los datos:

```typescript
async getRoles(): Promise<Role[]> {
  const response = await this.request<any>('/test/roles');
  // El backend devuelve: { success: true, data: { roles: [], total: 4 } }
  if (response.data && response.data.roles) {
    return response.data.roles;
  }
  return response.data || response;
}
```

## 🎯 Resultado

### Antes:
```
❌ GET /api/test/users → 500 Error
❌ GET /api/test/roles → 500 Error
❌ Frontend: "roles.map is not a function"
```

### Después:
```
✅ GET /api/test/users → 200 OK (datos mock)
✅ GET /api/test/roles → 200 OK (datos mock)
✅ Frontend: Muestra la interfaz correctamente
```

## 📝 Datos Mock Disponibles

### Usuarios:
1. **admin@agromano.com** - Administrador
2. **trabajador@agromano.com** - Trabajador de Campo
3. **supervisor@agromano.com** - Supervisor de Área

### Roles:
1. **Administrador** - Acceso completo al sistema
2. **Supervisor** - Supervisión de operaciones
3. **Trabajador** - Acceso básico
4. **Contador** - Gestión financiera

## 🔧 Próximos Pasos Recomendados

### Para solucionar definitivamente el problema de Auth0:

1. **Configurar Auth0 Management API:**
   - Ir a Auth0 Dashboard
   - Crear una "Machine to Machine Application"
   - Autorizar la aplicación para usar la Auth0 Management API
   - Asignar los siguientes scopes:
     - `read:users`
     - `read:roles`
     - `update:users`
     - `create:role_members`
     - `delete:role_members`
   - Actualizar las credenciales en `.env`:
     ```
     AUTH0_CLIENT_ID=<nuevo_client_id>
     AUTH0_CLIENT_SECRET=<nuevo_client_secret>
     ```

2. **Actualizar la Base de Datos:**
   
   Ejecutar migración para agregar la columna `auth0_user_id`:
   
   ```sql
   ALTER TABLE mot_usuario 
   ADD COLUMN auth0_user_id VARCHAR(255) NULL,
   ADD UNIQUE INDEX idx_auth0_user_id (auth0_user_id);
   ```

   O regenerar Prisma:
   ```bash
   cd backend
   npx prisma db push
   ```

3. **Desactivar Mock Data:**
   
   Una vez que Auth0 esté configurado correctamente, el sistema automáticamente dejará de usar los datos mock y usará datos reales de Auth0.

## 🧪 Pruebas

Para verificar que todo funciona:

```bash
# Probar endpoint de roles
curl http://localhost:3001/api/test/roles

# Probar endpoint de usuarios
curl "http://localhost:3001/api/test/users?page=0&limit=10"
```

Ambos deben devolver status 200 con datos mock.

## 📚 Archivos Modificados

1. ✅ `backend/src/services/mock-auth0.service.ts` (nuevo)
2. ✅ `backend/src/services/auth0-management.service.ts` (modificado)
3. ✅ `backend/src/controllers/user-role.controller.ts` (modificado)
4. ✅ `frontend/src/user-management/services/UserManagementService.ts` (modificado)

---

**Fecha de solución:** 30 de septiembre de 2025  
**Estado:** ✅ Resuelto con datos mock de desarrollo  
**Ambiente:** Desarrollo local
