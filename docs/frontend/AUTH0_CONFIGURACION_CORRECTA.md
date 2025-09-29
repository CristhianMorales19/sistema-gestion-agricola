"""
````markdown
# Configuración Correcta de Auth0 Dashboard

## ⚠️ ERROR SOLUCIONADO: "Oops!, something went wrong"

Este error se debe a configuración incorrecta en el Auth0 Dashboard. Aplica la siguiente configuración EXACTA:

## 1. Application Settings (Auth0 Dashboard)

**Ir a: Applications → agromano-frontend-app → Settings**

### Basic Information:
- **Name**: `agromano-frontend-app`
- **Domain**: `dev-agromano.us.auth0.com`
- **Client ID**: `jkaDs31ucGZTjRsq3cVa7BLApPSXP9oT`

### Application URIs:
```
Allowed Callback URLs:
http://localhost:3000,http://localhost:3000/callback,http://localhost:3001,http://localhost:3001/callback

Allowed Logout URLs:
http://localhost:3000,http://localhost:3001

Allowed Web Origins:
http://localhost:3000,http://localhost:3001

Allowed Origins (CORS):
http://localhost:3000,http://localhost:3001
```

### Application Type:
- **Application Type**: `Single Page Application`

### Grant Types:
- ✅ Authorization Code
- ✅ Refresh Token
- ✅ Implicit

## 2. API Configuration (Auth0 Dashboard)

**Ir a: Applications → APIs → agromano-api**

### API Details:
- **Name**: `agromano-api`
- **Identifier**: `https://agromano-api.com`
- **Signing Algorithm**: `RS256`

### Settings:
- ✅ Enable RBAC
- ✅ Add Permissions in the Access Token
- ✅ Allow Skipping User Consent
- ✅ Allow Offline Access

## 3. Verificar Variables de Entorno

### Frontend (.env):
```env
REACT_APP_AUTH0_DOMAIN=dev-agromano.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=jkaDs31ucGZTjRsq3cVa7BLApPSXP9oT
REACT_APP_AUTH0_AUDIENCE=https://agromano-api.com
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=production
```

### Backend (.env):
```env
AUTH0_DOMAIN=dev-agromano.us.auth0.com
AUTH0_AUDIENCE=https://agromano-api.com
AUTH0_CLIENT_ID=jkaDs31ucGZTjRsq3cVa7BLApPSXP9oT
AUTH0_CLIENT_SECRET=<tu-client-secret>
```

## 4. Pasos para Aplicar la Configuración

1. **Ir al Auth0 Dashboard**: https://manage.auth0.com/
2. **Seleccionar tu tenant**: `dev-agromano`
3. **Ir a Applications → agromano-frontend-app**
4. **Aplicar la configuración de URIs mostrada arriba**
5. **Guardar cambios**
6. **Ir a APIs → agromano-api**
7. **Verificar que RBAC esté habilitado**
8. **Reiniciar el frontend**: `npm start`

## 5. Verificación

Después de aplicar la configuración:

1. El frontend debe cargar sin errores
2. El botón "Iniciar Sesión" debe funcionar
3. Auth0 debe mostrar la pantalla de login
4. Tras autenticarse, debe redirigir de vuelta al dashboard

## 6. Debugging

Si persiste el error, verificar en Auth0 Dashboard → Logs para ver detalles específicos del error.

## 7. URLs de Callback Críticas

**IMPORTANTE**: Asegúrate de que estas URLs estén en "Allowed Callback URLs":
- `http://localhost:3000`
- `http://localhost:3000/callback`

Sin estas URLs, Auth0 mostrará el error "Oops!, something went wrong".

````
"""

// ...existing code...
