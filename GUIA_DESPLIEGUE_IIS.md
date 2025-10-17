# 🚀 Guía Rápida: Desplegar AgroMano en IIS

Esta guía te ayudará a desplegar el sistema en IIS y probarlo en tu red local.

---

## 📋 PASO 1: Requisitos Previos

### Software Necesario:
- ✅ **IIS** (Internet Information Services) instalado
- ✅ **Node.js** instalado (versión 18+)
- ✅ **MySQL** corriendo con base de datos `agromano`
- ✅ **URL Rewrite Module** para IIS: [Descargar aquí](https://www.iis.net/downloads/microsoft/url-rewrite)

### Verificar IIS:
1. Presiona `Win + R` → escribe `inetmgr` → Enter
2. Debe abrirse el "Administrador de Internet Information Services"

---

## 📋 PASO 2: Configurar Variables de Entorno

### Frontend (.env.production)
Ya está creado en: `frontend/.env.production`

**Si vas a compartir en red local, actualiza:**
```bash
# Reemplaza "localhost" con la IP de tu PC
REACT_APP_AUTH0_REDIRECT_URI=http://192.168.1.X:3000/callback
REACT_APP_API_URL=http://192.168.1.X:3001/api
```

Para saber tu IP:
```bash
ipconfig
# Busca "Dirección IPv4" en tu adaptador de red
```

### Backend (.env)
Ya está configurado. Solo verifica en `backend/.env`:
```bash
# Agregar la IP de tu PC si vas a compartir en red
FRONTEND_URLS=http://localhost:3000,http://localhost:3001,http://192.168.1.X:3000
```

---

## 📋 PASO 3: Configurar Auth0

1. Ve a [Auth0 Dashboard](https://manage.auth0.com)
2. Selecciona tu aplicación
3. En **Settings**, agrega en:

**Allowed Callback URLs:**
```
http://localhost:3000/callback,
http://192.168.1.X:3000/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000,
http://192.168.1.X:3000
```

**Allowed Web Origins:**
```
http://localhost:3000,
http://192.168.1.X:3000
```

**⚠️ Importante:** Reemplaza `192.168.1.X` con tu IP real

---

## 📋 PASO 4: Compilar el Frontend

```bash
cd frontend
npm run build
```

Esto crea la carpeta `build/` con todos los archivos listos para IIS.

**Verifica que se creó:** `frontend/build/web.config` ✅

---

## 📋 PASO 5: Configurar IIS

### 5.1 Crear Sitio Web

1. Abre **Administrador de IIS** (`Win + R` → `inetmgr`)
2. En el panel izquierdo, click derecho en **Sitios** → **Agregar sitio web**
3. Configura:
   - **Nombre del sitio:** AgroMano-Frontend
   - **Ruta física:** `C:\Users\Cristhian\Desktop\AGRO\sistema-gestion-agricola\frontend\build`
   - **Tipo:** http
   - **Dirección IP:** Todas las no asignadas
   - **Puerto:** 3000
   - **Nombre de host:** (dejar vacío)
4. Click **Aceptar**

### 5.2 Verificar Permisos

1. En IIS, selecciona el sitio **AgroMano-Frontend**
2. Panel derecho → **Configuración básica**
3. Click en **Conectarse como...**
4. Seleccionar **Usuario específico** → **Establecer...**
5. Usar credenciales de administrador o usuario con permisos

### 5.3 Abrir Puertos en Firewall

```bash
# Ejecutar PowerShell como Administrador
netsh advfirewall firewall add rule name="IIS AgroMano Frontend" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="IIS AgroMano Backend" dir=in action=allow protocol=TCP localport=3001
```

O manualmente:
1. `Panel de Control` → `Firewall de Windows Defender`
2. `Configuración avanzada`
3. `Reglas de entrada` → `Nueva regla`
4. Puerto TCP: 3000 y 3001

---

## 📋 PASO 6: Iniciar Backend

```bash
cd backend
npm start
```

**Verificar:** Abre navegador en `http://localhost:3001/api/health`

Deberías ver:
```json
{"status":"ok","timestamp":"..."}
```

---

## 📋 PASO 7: Probar el Sistema

### 7.1 Prueba Local (en tu PC)

1. Abre navegador en: `http://localhost:3000`
2. Click en **Iniciar Sesión**
3. Login con:
   - Email: `admin@agromano.com`
   - Password: `Admin123!`
4. Verifica que carga el dashboard

### 7.2 Prueba en Otro Dispositivo (misma red)

**Desde tu PC:**
1. Obtén tu IP: `ipconfig` → Busca "Dirección IPv4"
   - Ejemplo: `192.168.1.105`

**Desde otro dispositivo (celular, laptop):**
1. Conecta a la misma red WiFi
2. Abre navegador en: `http://192.168.1.105:3000`
3. Inicia sesión normalmente

---

## 🔧 Solución de Problemas

### Error: "No se puede acceder al sitio"
✅ Verificar que IIS está corriendo:
```bash
iisreset /start
```

✅ Verificar puerto 3000 está libre:
```bash
netstat -ano | findstr :3000
```

### Error: "Cannot GET /"
✅ Verificar que `web.config` está en `build/`
✅ Verificar URL Rewrite Module instalado en IIS

### Error: "CORS policy"
✅ Agregar tu IP en `backend/.env` → `FRONTEND_URLS`
✅ Reiniciar backend

### Error: "Auth0 callback URL mismatch"
✅ Verificar Auth0 Dashboard tiene tu IP configurada
✅ Verificar `frontend/.env.production` tiene la URL correcta

---

## 📦 Compartir con Otros

### Opción 1: Compartir IP (misma red)
1. Dile a otros tu IP: `192.168.1.X`
2. Que abran: `http://192.168.1.X:3000`
3. ¡Listo! Todos usan el mismo sistema

### Opción 2: Compartir Proyecto Completo

**Archivos a compartir:**
```
sistema-gestion-agricola/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   │   └── web.config ✅
│   ├── .env.production ✅
│   └── package.json
├── database/
│   └── instalar_bd.sql
└── GUIA_DESPLIEGUE_IIS.md (este archivo)
```

**NO compartir:**
- ❌ `node_modules/` (pesa mucho)
- ❌ `.env` (tiene credenciales sensibles)
- ❌ `build/` y `dist/` (se generan después)

**Instrucciones para quien recibe:**
1. Descomprimir proyecto
2. En `backend/`: copiar `.env.example` → `.env` y configurar
3. En `frontend/`: copiar `.env.production` y configurar con su IP
4. Ejecutar:
```bash
cd backend && npm install && npm start
cd frontend && npm install && npm run build
```
5. Seguir pasos 5-7 de esta guía

---

## ✅ Checklist Final

### Antes de compartir:
- [ ] `web.config` creado en `frontend/public/`
- [ ] `.env.production` configurado con IPs correctas
- [ ] Auth0 configurado con todas las IPs
- [ ] Firewall abierto (puertos 3000 y 3001)
- [ ] Backend corriendo sin errores
- [ ] Frontend compilado (`npm run build`)
- [ ] IIS configurado apuntando a `build/`
- [ ] Probado desde otro dispositivo en la red

### Al desplegar:
- [ ] IIS instalado con URL Rewrite Module
- [ ] Node.js instalado
- [ ] MySQL corriendo con BD `agromano`
- [ ] Variables de entorno configuradas
- [ ] Puertos del firewall abiertos
- [ ] Auth0 configurado

---

## 🎯 Resumen Rápido

```bash
# 1. Compilar
cd frontend
npm run build

# 2. Configurar IIS
# - Crear sitio apuntando a: frontend/build
# - Puerto: 3000

# 3. Iniciar backend
cd backend
npm start

# 4. Abrir navegador
http://localhost:3000
# o
http://TU_IP:3000
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa logs del backend en la terminal
3. Verifica que todos los puertos están abiertos
4. Verifica Auth0 configuración

**¡Listo! Tu sistema AgroMano está funcionando en IIS!** 🎉
