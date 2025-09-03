# 🎭 SISTEMA HÍBRIDO AUTH0 + MYSQL PARA AGROMANO

## 📋 RESUMEN EJECUTIVO

Este sistema implementa una **autenticación híbrida** que combina:
- **Auth0** para la autenticación de usuarios (validación de credenciales)
- **Base de datos MySQL local** para la autorización (roles y permisos granulares)

### ⚡ Ventajas del enfoque híbrido:
- ✅ **Seguridad robusta** - Auth0 maneja tokens JWT y autenticación
- ✅ **Control granular** - Permisos específicos almacenados en BD local
- ✅ **Flexibilidad** - Cambios de permisos sin tocar Auth0
- ✅ **Escalabilidad** - Fácil migración a BD en la nube
- ✅ **Auditoría** - Historial completo de permisos en BD local

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │     AUTH0       │    │   BD MYSQL      │
│                 │    │                 │    │                 │
│ Login Button ──►│────┤ Autentica ────► │    │ Roles/Permisos  │
│                 │    │ Retorna JWT     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       ▲
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   MIDDLEWARE    │──────────────┘
                         │    HÍBRIDO      │
                         │                 │
                         │ 1. Valida JWT   │
                         │ 2. Busca user   │
                         │ 3. Carga perms  │
                         └─────────────────┘
```

### 🔄 Flujo de autenticación:

1. **Usuario hace login** → Auth0 valida credenciales
2. **Auth0 retorna JWT** → Con email del usuario
3. **JWT llega a la API** → Middleware Auth0 valida token
4. **Middleware híbrido** → Busca usuario por email en BD local
5. **Carga permisos reales** → Desde tabla `rel_mom_rol__mom_permiso`
6. **Usuario autorizado** → Con permisos específicos de la BD

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Tablas principales:
```sql
-- Usuarios del sistema
mot_usuario (usuario_id, username, rol_id, estado)
    ├── username = email del usuario (mismo que Auth0)
    └── rol_id → FK a mom_rol

-- Roles del sistema
mom_rol (rol_id, codigo, nombre, descripcion)
    ├── ADMIN_AGROMANO (77 permisos)
    ├── SUPERVISOR_CAMPO (40 permisos) 
    ├── GERENTE_RRHH (37 permisos)
    ├── SUPERVISOR_RRHH (14 permisos)
    ├── EMPLEADO_CAMPO (6 permisos)
    └── VISUAL_SOLO_LECTURA (11 permisos)

-- Permisos granulares
mom_permiso (permiso_id, codigo, nombre, categoria)
    ├── trabajadores:read:all
    ├── nomina:process
    ├── asistencia:approve
    └── ... (77 permisos total)

-- Relación roles-permisos (M:N)
rel_mom_rol__mom_permiso (rol_id, permiso_id)
```

---

## 📁 ARCHIVOS DEL SISTEMA

### ✅ ARCHIVOS NECESARIOS (PRODUCCIÓN):

#### 1. **Middleware principal**
```
src/middleware/hybrid-auth-final.middleware.ts
```
- **Propósito**: Middleware híbrido Auth0 + BD
- **Funciones**: 
  - `hybridAuthMiddleware`: Middleware principal
  - `checkPermission`: Verificar permiso específico
  - `checkPermissions`: Verificar múltiples permisos
  - `checkRole`: Verificar rol específico

#### 2. **Configuración de entorno**
```
.env
```
- **Variables Auth0**: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, etc.
- **Base de datos**: `DATABASE_URL`
- **Puerto**: `PORT=3000`

#### 3. **Script de configuración de BD**
```
scripts/crear-matriz-roles-completa.sql
```
- **Propósito**: Crear todos los roles y permisos según la matriz
- **Uso**: Ejecutar una sola vez por ambiente

### 📝 ARCHIVOS DE EJEMPLO/PRUEBA:

#### 1. **Rutas de ejemplo**
```
src/routes/test-protected-routes.ts
```
- **Propósito**: Ejemplos de cómo usar el middleware
- **Estado**: Opcional, solo para referencia

#### 2. **Servidor de prueba**
```
test-hybrid-auth.ts
```
- **Propósito**: Servidor para probar el middleware
- **Estado**: Solo para testing, no usar en producción

#### 3. **Scripts de verificación**
```
verify-auth0-simple.ts
```
- **Propósito**: Verificar configuración de BD
- **Estado**: Herramienta de diagnóstico

### ❌ ARCHIVOS INNECESARIOS:

#### Scripts Auth0 (no funcionan con localhost):
```
auth0-scripts/
├── get-user-script.js     ❌ No funciona (localhost)
├── login-script.js        ❌ No funciona (localhost)  
├── create-script.js       ❌ No funciona (localhost)
└── USUARIOS_PARA_AUTH0.md ✅ Documentación útil
```

#### Middlewares antiguos:
```
src/middleware/hybrid-auth.middleware.ts           ❌ Versión antigua
src/middleware/hybrid-auth-corrected.middleware.ts ❌ Versión intermedia
```

#### Scripts SQL antiguos:
```
scripts/setup-usuarios-auth0-simple.sql      ❌ Versión antigua
scripts/setup-usuarios-auth0-fixed.sql       ❌ Versión antigua
scripts/setup-auth0-completo.sql             ❌ Versión antigua
scripts/agregar-usuarios-auth0.sql           ❌ Versión antigua
```

---

## 🚀 GUÍA DE RECREACIÓN EN OTRO AMBIENTE

### PASO 1: Preparar Base de Datos

#### 1.1. Instalar MySQL
```bash
# Windows con XAMPP
- Descargar XAMPP
- Iniciar Apache y MySQL

# Linux/Ubuntu
sudo apt update
sudo apt install mysql-server

# macOS
brew install mysql
```

#### 1.2. Crear base de datos
```sql
CREATE DATABASE agromano CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agromano;
```

#### 1.3. Ejecutar script principal
```bash
# Desde la carpeta del proyecto
mysql -u root -p agromano < scripts/crear-matriz-roles-completa.sql
```

### PASO 2: Configurar Auth0

#### 2.1. Crear aplicación Auth0
1. Ir a [Auth0 Dashboard](https://manage.auth0.com)
2. **Applications** → **Create Application**
3. Seleccionar **Single Page Application** o **Regular Web Application**
4. Configurar:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

#### 2.2. Crear API en Auth0
1. **APIs** → **Create API**
2. **Name**: `AgroMano API`
3. **Identifier**: `https://agromano-api`
4. **Signing Algorithm**: `RS256`

#### 2.3. Crear roles en Auth0 (opcional)
1. **User Management** → **Roles** → **Create Role**
2. Crear roles que coincidan con la BD:
   - `ADMIN_AGROMANO`
   - `SUPERVISOR_CAMPO`
   - `GERENTE_RRHH`
   - `SUPERVISOR_RRHH`
   - `EMPLEADO_CAMPO`
   - `VISUAL_SOLO_LECTURA`

#### 2.4. Crear usuarios de prueba
1. **User Management** → **Users** → **Create User**
2. Crear usuarios con emails que coincidan con la BD:
   - `admin@agromano.com`
   - `supervisor.campo@agromano.com`
   - `gerente.rrhh@agromano.com`
3. Asignar roles correspondientes

### PASO 3: Configurar Backend

#### 3.1. Instalar dependencias
```bash
npm install express @prisma/client mysql2
npm install @types/express prisma ts-node typescript --save-dev

# Auth0 específico
npm install express-oauth-server express-jwt jwks-rsa
```

#### 3.2. Configurar variables de entorno
```env
# .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=agromano

DATABASE_URL="mysql://root@localhost:3306/agromano"

# Reemplazar con datos reales de Auth0
AUTH0_DOMAIN=tu-tenant.auth0.com
AUTH0_AUDIENCE=https://agromano-api
AUTH0_CLIENT_ID=tu-client-id-real
AUTH0_CLIENT_SECRET=tu-client-secret-real

PORT=3000
```

#### 3.3. Configurar Prisma
```bash
# Generar cliente Prisma
npx prisma generate

# Verificar conexión
npx prisma db pull
```

### PASO 4: Integrar Middleware

#### 4.1. Configurar Auth0 middleware
```typescript
// app.ts
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { hybridAuthMiddleware } from './middleware/hybrid-auth-final.middleware';

// Middleware Auth0
const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Aplicar middlewares
app.use('/api/protected', checkJwt, hybridAuthMiddleware);
```

#### 4.2. Usar en rutas
```typescript
import { checkPermission, checkRole } from './middleware/hybrid-auth-final.middleware';

// Ruta que requiere permiso específico
app.get('/api/trabajadores', 
  checkJwt,                                    // Validar token Auth0
  hybridAuthMiddleware,                        // Cargar usuario y permisos de BD
  checkPermission('trabajadores:read:all'),    // Verificar permiso específico
  (req, res) => {
    const user = (req as any).user;
    // user.permissions = array de permisos reales de BD
    res.json({ trabajadores: [...] });
  }
);
```

### PASO 5: Verificar funcionamiento

#### 5.1. Ejecutar test de verificación
```bash
npx ts-node verify-auth0-simple.ts
```

#### 5.2. Probar servidor de ejemplo
```bash
npx ts-node test-hybrid-auth.ts

# En otro terminal, probar endpoints:
curl http://localhost:3000/api/test-auth?user=admin
curl http://localhost:3000/api/test-auth?user=supervisor
curl http://localhost:3000/api/test-auth?user=gerente
```

---

## 🔄 MIGRACIÓN A PRODUCCIÓN

### Cambios necesarios para producción:

#### 1. **Base de datos en la nube**
```env
# Reemplazar MySQL local por RDS, Google Cloud SQL, etc.
DATABASE_URL="mysql://user:password@production-host:3306/agromano"
```

#### 2. **Auth0 en producción**
```env
# Configurar dominio y audience de producción
AUTH0_DOMAIN=produccion.auth0.com
AUTH0_AUDIENCE=https://api.agromano.com
```

#### 3. **CORS y seguridad**
```typescript
// Configurar CORS para producción
app.use(cors({
  origin: ['https://app.agromano.com'],
  credentials: true
}));
```

#### 4. **Variables de entorno seguras**
- Usar AWS Secrets Manager, Azure Key Vault, etc.
- No hardcodear secretos en código

---

## 🛠️ TROUBLESHOOTING

### Problemas comunes:

#### 1. **Error: Usuario no encontrado**
```json
{
  "success": false,
  "message": "Usuario no autorizado en el sistema",
  "code": "USER_NOT_AUTHORIZED",
  "email": "usuario@example.com"
}
```
**Solución**: 
- Verificar que el usuario existe en `mot_usuario` con ese email
- Verificar que `estado = 'activo'`

#### 2. **Error: Token inválido**
**Solución**:
- Verificar variables Auth0 en `.env`
- Verificar que el token no ha expirado
- Verificar `AUTH0_AUDIENCE` correcto

#### 3. **Error: Base de datos no conecta**
**Solución**:
- Verificar que MySQL está corriendo
- Verificar credenciales en `DATABASE_URL`
- Ejecutar `npx prisma db pull` para verificar

---

## 📚 CONSIDERACIONES ADICIONALES

### ⚠️ **Limitaciones actuales (temporales):**

1. **Base de datos local**: Solo funciona en ambiente de desarrollo
2. **Scripts Auth0**: Los scripts de conexión custom no funcionan con localhost
3. **Usuarios manuales**: Los usuarios deben crearse manualmente en Auth0

### 🎯 **Mejoras futuras:**

1. **Sincronización automática**: Script que sincronice usuarios BD ↔ Auth0  
2. **Interfaz de administración**: UI para gestionar roles y permisos
3. **Auditoría**: Logs de acceso y cambios de permisos
4. **Cache**: Redis para cachear permisos frecuentes
5. **Multi-tenant**: Soporte para múltiples organizaciones

### 🔒 **Seguridad:**

- ✅ Tokens JWT validados por Auth0
- ✅ Permisos granulares en BD
- ✅ Middleware de validación en cada ruta
- ✅ Estados de usuario (activo/inactivo)
- ✅ Roles críticos marcados en BD

---

## 📞 SOPORTE

Para recrear este sistema en otro ambiente:

1. **Seguir esta documentación paso a paso**
2. **Ejecutar scripts en orden**:
   - `crear-matriz-roles-completa.sql`
   - `verify-auth0-simple.ts` (verificación)
3. **Configurar Auth0 según instrucciones**
4. **Probar con `test-hybrid-auth.ts`**

**Resultado esperado**: Sistema híbrido funcional con autenticación Auth0 y autorización granular desde MySQL.

---

*Documentación generada para AgroMano - Sistema de Gestión Agrícola*  
*Versión: 1.0 | Fecha: Septiembre 2025*
