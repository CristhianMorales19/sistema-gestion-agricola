# 🔧 Guía Completa: Configuración de Auth0 Management API

## 📋 Resumen

Esta guía te ayudará a configurar correctamente una aplicación Machine-to-Machine (M2M) en Auth0 para que tu backend pueda gestionar usuarios y roles mediante la Management API.

---

## ✅ Requisitos Previos

- Cuenta de Auth0 activa
- Acceso al Dashboard de Auth0: https://manage.auth0.com
- Tenant configurado: `dev-agromano.us.auth0.com`

---

## 🎯 Objetivo

Configurar una aplicación M2M que permita al backend:
- Leer usuarios y sus datos
- Crear, actualizar y eliminar usuarios
- Leer roles del sistema
- Asignar y remover roles a usuarios

---

## 📝 Pasos de Configuración

### **Paso 1: Verificar/Crear Aplicación Machine-to-Machine**

#### 1.1 Ir a Applications
```
Dashboard → Applications → Applications
```

#### 1.2 Verificar tipo de aplicación
- Busca tu aplicación (ej: "AgroMano")
- **IMPORTANTE:** Debe ser tipo **"Machine to Machine"**
- Si NO es M2M, debes crear una nueva aplicación

#### 1.3 Crear nueva aplicación M2M (si es necesario)
1. Click en **"Create Application"**
2. **Name:** `AgroMano Backend M2M`
3. **Choose an application type:** **Machine to Machine Applications** ⚠️
4. **Authorize:** Selecciona **"Auth0 Management API"**
5. Click **"Create"**

---

### **Paso 2: Configurar Authentication Method**

#### 2.1 Ir a Application Settings
```
Applications → Applications → [Tu App] → Settings
```

#### 2.2 Configurar Advanced Settings
1. Scroll hasta **"Advanced Settings"**
2. Click para expandir
3. Ve a la pestaña **"OAuth"**

#### 2.3 Configurar Token Endpoint Authentication
```
Application Authentication
└─ Authentication Method: Client Secret (Post) ✅
```

**Opciones disponibles:**
- ~~None~~ ❌ (No funciona para M2M)
- **Client Secret (Post)** ✅ (RECOMENDADO)
- Client Secret (Basic) ✅ (Alternativa válida)
- Private Key JWT (Enterprise)
- mTLS (Enterprise)

**Selecciona:** `Client Secret (Post)`

#### 2.4 Guardar cambios
Click en **"Save Changes"** al final de la página

---

### **Paso 3: Habilitar Grant Type Client Credentials**

#### 3.1 Ir a Grant Types
```
Settings → Advanced Settings → Grant Types (pestaña)
```

#### 3.2 Marcar Client Credentials
```
Grant Types:
✅ Client Credentials  ← IMPORTANTE
```

**Nota:** Después de cambiar el Authentication Method a "Client Secret (Post)", esta opción estará disponible.

#### 3.3 Guardar cambios
Click en **"Save Changes"**

---

### **Paso 4: Autorizar Auth0 Management API**

#### 4.1 Ir a la Management API
```
Applications → APIs → Auth0 Management API
```

#### 4.2 Ir a Machine to Machine Applications
```
Auth0 Management API → Machine To Machine Applications (pestaña)
```

#### 4.3 Autorizar tu aplicación
1. Busca tu aplicación en la lista
2. Activa el **toggle** (debe estar en verde: "Authorized")
3. Click en la **flecha (▼)** para expandir

---

### **Paso 5: Seleccionar Permisos (Scopes)**

#### 5.1 Permisos Esenciales para Gestión de Usuarios

```
Usuarios:
✅ read:users                    - Leer información de usuarios
✅ read:users_app_metadata      - Leer metadata de aplicación
✅ update:users                 - Actualizar usuarios
✅ update:users_app_metadata    - Actualizar metadata
✅ create:users                 - Crear nuevos usuarios
✅ delete:users                 - Eliminar usuarios

Roles:
✅ read:roles                    - Leer roles disponibles
✅ create:roles                  - Crear nuevos roles
✅ update:roles                  - Actualizar roles existentes
✅ delete:roles                  - Eliminar roles

Asignación de Roles:
✅ read:role_members             - Ver usuarios con roles
✅ create:role_members           - Asignar roles a usuarios
✅ delete:role_members           - Remover roles de usuarios
```

#### 5.2 Permisos Opcionales (Recomendados)

```
✅ read:clients                  - Información de aplicaciones
✅ read:connections              - Información de conexiones
✅ read:grants                   - Información de grants
```

#### 5.3 Guardar permisos
Click en **"Update"** después de seleccionar los permisos

---

### **Paso 6: Obtener Credenciales**

#### 6.1 Ir a Settings de la aplicación
```
Applications → Applications → [Tu App] → Settings
```

#### 6.2 Copiar credenciales
```
Domain:        dev-agromano.us.auth0.com
Client ID:     jkaDs3lUcGZTjR8q3cVa7BLApPSXP9oT
Client Secret: [Click en el ícono del ojo 👁️ para revelar]
```

**IMPORTANTE:** Guarda estas credenciales de forma segura.

---

## 🔧 Configuración en el Backend

### Actualizar archivo `.env`

```env
# Auth0 Configuration - Machine to Machine
AUTH0_DOMAIN=dev-agromano.us.auth0.com
AUTH0_AUDIENCE=https://agromano-api.com
AUTH0_CLIENT_ID=jkaDs3lUcGZTjR8q3cVa7BLApPSXP9oT
AUTH0_CLIENT_SECRET=GMkDYDl2TGsZ9aGsHn2HxTUvO4DX6U9Ph5ws3okspKMIZhKmrBlfHcPvhI1QdsWW
AUTH0_ISSUER_BASE_URL=https://dev-agromano.us.auth0.com
```

---

## ✅ Verificación de Configuración

### Test de Conexión

Ejecuta el script de prueba:

```bash
cd backend
npx ts-node test-auth0-connection.ts
```

### Resultado Esperado

```
✅ Success! Found 6 roles
   1. ADMIN_AGROMANO (rol_xxx)
   2. SUPERVISOR_CAMPO (rol_xxx)
   3. GERENTE_RRHH (rol_xxx)
   ...

✅ Success! Found users
   1. admin@agromano.com
   2. gerente.rrhh@agromano.com
   ...

✅ Auth0 connection test successful!
```

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Grant type 'client_credentials' not allowed"

**Causa:** Grant Type no habilitado o Authentication Method incorrecto

**Solución:**
1. Verificar que Authentication Method sea "Client Secret (Post)"
2. Habilitar Grant Type "Client Credentials"
3. Guardar cambios y esperar 30 segundos

---

### Error: "Unauthorized (401)"

**Causa:** Aplicación no autorizada para Management API o sin permisos

**Solución:**
1. Ir a: Applications → APIs → Auth0 Management API
2. Verificar que la app esté "Authorized" (toggle verde)
3. Expandir y verificar permisos necesarios
4. Hacer clic en "Update"

---

### Error: "Invalid token"

**Causa:** Permisos no configurados correctamente

**Solución:**
1. Verificar que la aplicación tenga permisos en Management API
2. Asegurarse de tener al menos: `read:users`, `read:roles`
3. Esperar 1-2 minutos después de cambiar permisos

---

## 📊 Checklist de Configuración

Antes de continuar, verifica que TODO esté configurado:

- [ ] Aplicación es tipo **"Machine to Machine"** ✅
- [ ] Authentication Method: **"Client Secret (Post)"** ✅
- [ ] Grant Type: **"Client Credentials"** habilitado ✅
- [ ] Auth0 Management API está **"Authorized"** ✅
- [ ] Permisos seleccionados:
  - [ ] `read:users` ✅
  - [ ] `update:users` ✅
  - [ ] `create:users` ✅
  - [ ] `read:roles` ✅
  - [ ] `create:role_members` ✅
  - [ ] `delete:role_members` ✅
- [ ] Credenciales copiadas (Client ID y Secret) ✅
- [ ] Archivo `.env` actualizado ✅
- [ ] Test de conexión exitoso ✅

---

## 🎯 Resumen Visual de la Configuración

```
Auth0 Dashboard
│
├─ Applications
│  └─ Applications
│     └─ AgroMano (Machine to Machine) ✅
│        │
│        ├─ Settings
│        │  ├─ Basic Information
│        │  │  ├─ Client ID ✅
│        │  │  └─ Client Secret ✅
│        │  │
│        │  └─ Advanced Settings
│        │     ├─ OAuth
│        │     │  └─ Authentication Method: Client Secret (Post) ✅
│        │     │
│        │     └─ Grant Types
│        │        └─ Client Credentials ✅
│        │
│        └─ APIs (pestaña aparece después de autorizar)
│           └─ Auth0 Management API ✅
│
└─ APIs
   └─ Auth0 Management API
      └─ Machine to Machine Applications
         └─ AgroMano: Authorized ✅
            └─ Permisos seleccionados ✅
```

---

## 📖 Documentación Oficial

- **Auth0 Management API:** https://auth0.com/docs/api/management/v2
- **Machine to Machine Apps:** https://auth0.com/docs/get-started/applications/application-grant-types
- **Client Credentials Flow:** https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow

---

## 🔒 Seguridad

### Buenas Prácticas

✅ **HACER:**
- Usar variables de entorno para credenciales
- Nunca commitear `.env` al repositorio
- Rotar Client Secret periódicamente
- Usar permisos mínimos necesarios
- Revisar logs de Auth0 regularmente

❌ **NO HACER:**
- Exponer Client Secret en frontend
- Hardcodear credenciales en código
- Usar aplicaciones SPA/Web para Management API
- Dar permisos innecesarios
- Compartir credenciales públicamente

---

## ✨ Resultado Final

Después de esta configuración, tu backend podrá:

✅ Autenticarse con Auth0 usando Client Credentials
✅ Obtener lista de usuarios del sistema
✅ Crear y actualizar usuarios
✅ Obtener lista de roles disponibles
✅ Asignar y remover roles a usuarios
✅ Gestionar permisos y accesos

---

**Fecha de última actualización:** 2025-10-01  
**Estado:** ✅ Configuración completada y verificada  
**Versión:** 1.0
