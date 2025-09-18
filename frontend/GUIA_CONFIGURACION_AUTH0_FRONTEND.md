# 📋 GUÍA COMPLETA: CONFIGURACIÓN AUTH0 PARA FRONTEND

## 🎯 OBJETIVO
Configurar Auth0 Dashboard para que el frontend pueda autenticar usuarios correctamente y eliminar el error "Oops!, something went wrong".

---

## 🚀 PASOS DETALLADOS

### PASO 1: Acceder a Auth0 Dashboard
1. Ve a: **https://manage.auth0.com/**
2. Inicia sesión con tu cuenta Auth0
3. Selecciona tu tenant: **`dev-agromano`**

### PASO 2: Crear/Verificar Aplicación Frontend
1. En el menú izquierdo, click en **"Applications"**
2. Busca una aplicación llamada **`agromano-frontend-app`**

**Si NO existe:**
- Click en **"Create Application"**
- Name: `agromano-frontend-app`
- Choose an application type: **"Single Page Web Applications"**
- Click **"Create"**

**Si SÍ existe:**
- Click en la aplicación existente

### PASO 3: Configurar Settings Básicos
En la pestaña **"Settings"**:

#### 3.1 Basic Information:
```
Name: agromano-frontend-app
Domain: dev-agromano.us.auth0.com
Client ID: [Copiar este valor - lo necesitarás]
```

#### 3.2 Application URIs (¡MUY IMPORTANTE!):

**⚠️ VERIFICAR PUERTO DEL FRONTEND:**
- Si el frontend está en puerto **3000**: usar `http://localhost:3000`
- Si el frontend está en puerto **3001**: usar `http://localhost:3001`

**Para Frontend en Puerto 3000 (por defecto):**
```
Allowed Callback URLs:
http://localhost:3000

Allowed Logout URLs:
http://localhost:3000

Allowed Web Origins:
http://localhost:3000

Allowed Origins (CORS):
http://localhost:3000
```

**Para Frontend en Puerto 3001:**
```
Allowed Callback URLs:
http://localhost:3001

Allowed Logout URLs:
http://localhost:3001

Allowed Web Origins:
http://localhost:3001

Allowed Origins (CORS):
http://localhost:3001
```

**⚠️ CRÍTICO:** Sin estas URLs exactas, obtendrás el error "Oops!, something went wrong"

#### 3.3 Application Type:
```
Application Type: Single Page Application
```

### PASO 4: Configurar Advanced Settings
1. Scroll down hasta **"Advanced Settings"**
2. Click en **"Grant Types"**
3. Asegúrate que estén marcados:
   - ✅ **Authorization Code**
   - ✅ **Refresh Token** 
   - ✅ **Implicit** (para compatibilidad)

### PASO 5: Configurar API Audience
1. En la misma página de Settings
2. Busca la sección **"APIs"** o **"API Authorization"**
3. En **"API Identifier"** asegúrate que aparezca: `https://agromano-api.com`

### PASO 6: Guardar Configuración
1. Scroll hasta abajo
2. Click en **"Save Changes"**
3. **¡IMPORTANTE!** Espera la confirmación verde

---

## 🔧 VERIFICAR CONFIGURACIÓN DE API

### PASO 7: Verificar API Backend
1. Ve a **"Applications"** → **"APIs"**
2. Click en **`agromano-api`**
3. Verifica:
   - **Identifier**: `https://agromano-api.com`
   - **Signing Algorithm**: `RS256`

### PASO 8: Configurar RBAC en API
En la API settings:
1. **Settings** tab
2. Marca estas opciones:
   - ✅ **Enable RBAC**
   - ✅ **Add Permissions in the Access Token**
   - ✅ **Allow Skipping User Consent**
   - ✅ **Allow Offline Access**
3. **Save**

---

## 📝 ACTUALIZAR FRONTEND

### PASO 9: Verificar .env del Frontend
Archivo: `frontend/.env`
```env
REACT_APP_AUTH0_DOMAIN=dev-agromano.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=[Client ID de la aplicación frontend]
REACT_APP_AUTH0_AUDIENCE=https://agromano-api.com
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=production
```

**⚠️ Importante:** Usa el Client ID de la aplicación **frontend**, no del backend.

---

## 🧪 PROBAR LA CONFIGURACIÓN

### PASO 10: Verificar Puerto del Frontend

**Antes de continuar, verifica en qué puerto se ejecuta tu frontend:**

1. **Abre una terminal** en la carpeta frontend
2. **Ejecuta:** `npm start`
3. **Observa el mensaje:** "Local: http://localhost:XXXX"
4. **Anota el puerto** (usualmente 3000, pero puede ser 3001 si ya está ocupado)

### PASO 11: Reiniciar y Probar
1. **Reinicia el frontend:**
   ```cmd
   cd frontend
   npm start
   ```

2. **Ve a:** `http://localhost:3000`

3. **Click en "Iniciar Sesión"**

4. **Debería:**
   - Redirigir a Auth0 login page
   - Permitir login con credenciales
   - Redirigir de vuelta al frontend
   - Mostrar el dashboard

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Si aparece "Oops!, something went wrong":

#### Verificar URLs:
1. Auth0 Dashboard → Applications → agromano-frontend-app → Settings
2. **Allowed Callback URLs** debe tener exactamente: `http://localhost:3000`
3. **NO** debe tener espacios, comas extra, o URLs incorrectas

#### Verificar Application Type:
- Debe ser **"Single Page Application"**, no "Regular Web Application"

#### Verificar Grant Types:
- **Authorization Code** debe estar marcado

### Si aparece error de CORS:
1. **Allowed Origins (CORS)** debe tener: `http://localhost:3000`
2. **Allowed Web Origins** debe tener: `http://localhost:3000`

### Si no redirige después del login:
- **Allowed Callback URLs** debe incluir: `http://localhost:3000`

---

## 📊 VERIFICACIÓN FINAL

### Checklist de Configuración Completa:
- ✅ Aplicación frontend creada como "Single Page Application"
- ✅ Client ID copiado al .env del frontend
- ✅ URLs de callback configuradas correctamente
- ✅ Grant Types habilitados
- ✅ API RBAC habilitado
- ✅ Frontend reiniciado
- ✅ Login funciona sin errores

---

## 🎉 RESULTADO ESPERADO

Después de completar estos pasos:

1. **Login** → Redirige a Auth0 sin errores
2. **Autenticación** → Login con credenciales reales
3. **Callback** → Regresa al frontend exitosamente
4. **Dashboard** → Muestra interfaz según rol del usuario

---

## 📞 SOPORTE

Si después de seguir todos los pasos persiste algún error:

1. **Auth0 Logs**: Dashboard → Monitoring → Logs
2. **Browser Console**: F12 → Console (ver errores)
3. **Network Tab**: F12 → Network (ver requests fallidos)

**¡El sistema estará listo para producción después de estos pasos!**
