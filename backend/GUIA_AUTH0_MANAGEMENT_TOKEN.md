# 🔑 Guía: Configurar Auth0 Management API

**Fecha:** 15 de octubre de 2025  
**Propósito:** Configurar autenticación para sincronización de usuarios  
**Método Recomendado:** ✅ Client Credentials (automático)

---

## 🎯 ¿Qué Necesitamos?

Para que tu aplicación pueda sincronizar usuarios con Auth0, necesitas configurar una **Machine to Machine Application** que use **Client Credentials Grant**.

### ✅ Ventajas de Client Credentials:
- 🔄 Token se renueva automáticamente
- 🔒 Más seguro (no necesitas almacenar tokens)
- ⏱️ No expira (las credenciales son permanentes)
- 🚀 Más fácil de mantener

---

## 📋 Configuración Actual

### Variables de Entorno Necesarias

Ya tienes estas configuradas en tu `.env`:
```env
AUTH0_DOMAIN=dev-agromano.us.auth0.com
AUTH0_CLIENT_ID=jkaDs3lUcGZTjR8q3cVa7BLApPSXP9oT
AUTH0_CLIENT_SECRET=GMkDYDl2TGsZ9aGsHn2HxTUvO4DX6U9Ph5ws3okspKMIZhKmrBlfHcPvhI1QdsWW
```

### Cómo Funciona

El código **genera automáticamente** el Management API Token usando:
```typescript
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});
```

**No necesitas `AUTH0_MANAGEMENT_TOKEN`** - se genera automáticamente.

---

## 🔧 Verificar Configuración en Auth0

### 1️⃣ Ir al Dashboard de Auth0
```
https://manage.auth0.com/dashboard
```

### 2️⃣ Verificar tu Application
1. En el menú lateral, clic en **"Applications"**
2. Busca tu aplicación: **"AgroMano API"** o similar
3. Verifica que sea tipo **"Machine to Machine"**

### 3️⃣ Autorizar Auth0 Management API

Si tu aplicación NO está autorizada para la Management API:

1. En tu aplicación, ve a la pestaña **"APIs"**
2. Busca **"Auth0 Management API"**
3. Si no está autorizada, clic en **"Authorize"**
4. Selecciona los permisos necesarios:

**Permisos Requeridos:**
- ✅ `read:users` - Leer usuarios
- ✅ `read:users_app_metadata` - Leer metadata
- ✅ `update:users` - Actualizar usuarios
- ✅ `create:users` - Crear usuarios

5. Clic en **"Update"**

---

## ✅ Prueba de Configuración

### 1️⃣ Reiniciar Backend
```bash
# Presiona Ctrl+C en la terminal
cd backend
npm run dev
```

### 2️⃣ Probar Sincronización
1. Ir a http://localhost:3000
2. Login con admin@agromano.com
3. Ir a "Gestión de Usuarios"
4. Clic en "Sincronizar con Auth0"

### 3️⃣ Verificar Logs
Deberías ver:
```
🔄 Iniciando sincronización de usuarios Auth0...
✅ Variables de entorno Auth0 configuradas
📡 Conectando a Auth0: dev-agromano.us.auth0.com
📥 Obteniendo usuarios de Auth0...
✅ Obtenidos N usuarios de Auth0
```

---

## � Solución de Problemas

### Error: "Bad HTTP authentication header format"
✅ **RESUELTO** - Ahora usa Client Credentials automáticamente

### Error: "Faltan variables de entorno Auth0"
✅ **Solución:** Verifica que existan en `.env`:
```env
AUTH0_DOMAIN=dev-agromano.us.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
```

### Error: "Insufficient scope"
✅ **Solución:**
1. Ir a Auth0 Dashboard
2. Applications > Tu App > APIs
3. Autorizar "Auth0 Management API"
4. Seleccionar permisos: `read:users`, `update:users`, `create:users`

### Error: "Unauthorized"
✅ **Solución:**
1. Verificar que `AUTH0_CLIENT_ID` y `AUTH0_CLIENT_SECRET` sean correctos
2. Verificar que la aplicación sea tipo "Machine to Machine"
3. Verificar que esté autorizada para Management API

---

## 📚 Referencias

- [Auth0 Management API v2](https://auth0.com/docs/api/management/v2)
- [Client Credentials Grant](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)
- [Machine to Machine Applications](https://auth0.com/docs/get-started/applications/application-types#machine-to-machine-applications)

---

**Documentado por:** GitHub Copilot  
**Última actualización:** 15 de octubre de 2025

#### 1️⃣ Acceder al Dashboard de Auth0
```
https://manage.auth0.com/dashboard
```

#### 2️⃣ Ir a Applications
1. En el menú lateral, clic en **"Applications"**
2. Clic en **"Applications"** nuevamente
3. Buscar o crear una **"Machine to Machine Application"**

#### 3️⃣ Crear Machine to Machine Application (si no existe)
1. Clic en **"+ Create Application"**
2. Nombre: `AgroMano Management API`
3. Tipo: Seleccionar **"Machine to Machine Applications"**
4. Clic en **"Create"**

#### 4️⃣ Autorizar la API
1. En la aplicación creada, ve a la pestaña **"APIs"**
2. Busca **"Auth0 Management API"**
3. Clic en el switch para **autorizarla**
4. Se abrirá un modal con permisos

#### 5️⃣ Seleccionar Permisos Necesarios
Marca los siguientes permisos:

**Usuarios:**
- ✅ `read:users` - Leer usuarios
- ✅ `read:users_app_metadata` - Leer metadata de usuarios
- ✅ `update:users` - Actualizar usuarios
- ✅ `create:users` - Crear usuarios
- ✅ `update:users_app_metadata` - Actualizar metadata

**Roles (opcional):**
- ✅ `read:roles` - Leer roles
- ✅ `read:role_members` - Leer miembros de roles
- ✅ `create:role_members` - Asignar roles

#### 6️⃣ Guardar y Obtener Token
1. Clic en **"Authorize"**
2. Ve a la pestaña **"Quick Start"** o **"Settings"**
3. Copia el **Client ID** y **Client Secret**

#### 7️⃣ Generar Access Token
Puedes generar el token de dos formas:

**Opción A: Desde el Dashboard (Desarrollo)**
1. Ve a **"APIs"** en el menú lateral
2. Selecciona **"Auth0 Management API"**
3. Ve a la pestaña **"API Explorer"**
4. Copia el **Token** mostrado (válido por 24 horas)

**Opción B: Mediante código (Producción)**
Usa las credenciales para obtener un token programáticamente.

---

### Método 2: Test Token desde API Explorer (Solo Desarrollo)

⚠️ **ADVERTENCIA:** Este token expira cada 24 horas y es solo para pruebas.

#### 1️⃣ Ir a Auth0 Management API
```
Dashboard > APIs > Auth0 Management API
```

#### 2️⃣ Acceder al API Explorer
1. Clic en la pestaña **"API Explorer"**
2. Verás un token generado automáticamente

#### 3️⃣ Copiar el Token
```
Clic en "Copy Token"
```

#### 4️⃣ Pegar en .env
```env
AUTH0_MANAGEMENT_TOKEN=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik...
```

---

## 🔧 Configuración en el Proyecto

### 1️⃣ Editar archivo `.env`
```env
# Auth0 Management API Token
# Método 1: Machine to Machine (renovación automática)
# Método 2: Manual desde API Explorer (expira en 24h)
AUTH0_MANAGEMENT_TOKEN=tu_token_aqui
```

### 2️⃣ Verificar otras variables
Asegúrate de tener configuradas:
```env
AUTH0_DOMAIN=dev-agromano.us.auth0.com
AUTH0_CLIENT_ID=jkaDs3lUcGZTjR8q3cVa7BLApPSXP9oT
AUTH0_CLIENT_SECRET=GMkDYDl2TGsZ9aGsHn2HxTUvO4DX6U9Ph5ws3okspKMIZhKmrBlfHcPvhI1QdsWW
```

### 3️⃣ Reiniciar el servidor
```bash
cd backend
npm run dev
```

---

## ✅ Verificación

### Test desde la Aplicación
1. Ir a "Gestión de Usuarios"
2. Clic en "Sincronizar con Auth0"
3. Verificar logs en consola:

```
🔄 Iniciando sincronización de usuarios Auth0...
✅ Variables de entorno Auth0 configuradas
📡 Conectando a Auth0: dev-agromano.us.auth0.com
📥 Obteniendo usuarios de Auth0...
✅ Obtenidos N usuarios de Auth0
```

### Test Manual con cURL
```bash
curl -X GET "https://dev-agromano.us.auth0.com/api/v2/users" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔄 Renovación Automática del Token (Recomendado)

Para evitar que el token expire, implementa un sistema de renovación automática:

### Código de Ejemplo
```typescript
import { AuthenticationClient } from 'auth0';

const auth = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!
});

// Obtener token automáticamente
async function getManagementToken() {
  const response = await auth.oauth.clientCredentialsGrant({
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
  });
  return response.access_token;
}
```

---

## 🚨 Solución de Problemas

### Error: "Faltan variables de entorno Auth0"
✅ **Solución:** Agregar `AUTH0_MANAGEMENT_TOKEN` al archivo `.env`

### Error: "Invalid token"
✅ **Solución:** 
- Verificar que el token no haya expirado
- Generar un nuevo token desde el Dashboard

### Error: "Insufficient permissions"
✅ **Solución:**
- Verificar que la Machine to Machine app tenga los permisos necesarios
- Re-autorizar la aplicación con los permisos correctos

### Error: "Token expired"
✅ **Solución:**
- Si usas el token del API Explorer, genera uno nuevo cada 24 horas
- Mejor: implementa renovación automática con Client Credentials

---

## 📚 Referencias

- [Auth0 Management API Documentation](https://auth0.com/docs/api/management/v2)
- [Get Management API Access Tokens](https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-access-tokens-for-production)
- [Machine to Machine Applications](https://auth0.com/docs/get-started/applications/application-types#machine-to-machine-applications)

---

## 🎯 Resultado Esperado

Después de configurar el token correctamente:

```
✅ AUTH0_MANAGEMENT_TOKEN configurado
✅ Sincronización de usuarios funcionando
✅ Logs detallados mostrando progreso
✅ Usuarios de Auth0 sincronizados con BD local
```

---

**Documentado por:** GitHub Copilot  
**Última actualización:** 15 de octubre de 2025
