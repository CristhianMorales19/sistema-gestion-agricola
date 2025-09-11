# Configuración Auth0 Dashboard - CORRECCIÓN OBLIGATORIA

## 🚨 ERROR IDENTIFICADO
El error "Oops!, something went wrong" en Auth0 indica problemas de configuración en el Auth0 Dashboard.

## ✅ CONFIGURACIÓN REQUERIDA EN AUTH0 DASHBOARD

### 1. Aplicación SPA (Single Page Application)
- **Tipo de Aplicación**: Single Page Application
- **Client ID**: `jkaDs31ucGZTjRsq3cVa7BLApPSXP9oT`
- **Domain**: `dev-agromano.us.auth0.com`

### 2. URLs Permitidas (OBLIGATORIO)
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

### 3. API (Identifier)
```
Name: AgroMano API
Identifier: https://agromano-api.com
Signing Algorithm: RS256
Allow Skipping User Consent: Yes
Allow Offline Access: Yes
```

### 4. Advanced Settings
```
Grant Types:
✅ Authorization Code
✅ Refresh Token
✅ Implicit

Token Endpoint Authentication Method: None (para SPA)
```

## 🔧 PASOS PARA CORREGIR

1. **Ir a Auth0 Dashboard**: https://manage.auth0.com
2. **Applications** → Seleccionar la aplicación `jkaDs31ucGZTjRsq3cVa7BLApPSXP9oT`
3. **Settings** → Configurar las URLs como se indica arriba
4. **Advanced Settings** → Grant Types → Verificar que estén habilitados
5. **Save Changes**

## 🚀 VERIFICACIÓN POST-CONFIGURACIÓN

Después de aplicar los cambios:

1. Reiniciar el frontend:
```bash
cd frontend
npm start
```

2. Reiniciar el backend:
```bash
cd backend
npm run dev
```

3. Probar login en: http://localhost:3000

## 🐛 PROBLEMAS COMUNES

- **Client ID incorrecto**: Verificar que coincida exactamente
- **URLs no permitidas**: Asegurar que `http://localhost:3000` esté en todas las URLs
- **Tipo de aplicación incorrecto**: Debe ser SPA, no Regular Web App
- **API no configurada**: Verificar que el audience `https://agromano-api.com` exista

## 📝 CREDENCIALES ACTUALES

```env
REACT_APP_AUTH0_DOMAIN=dev-agromano.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=jkaDs31ucGZTjRsq3cVa7BLApPSXP9oT
REACT_APP_AUTH0_AUDIENCE=https://agromano-api.com
```

**IMPORTANTE**: Si el Client ID no existe o es incorrecto, crear una nueva aplicación SPA en Auth0 Dashboard.
