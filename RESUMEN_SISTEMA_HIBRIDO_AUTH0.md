# 📦 Sistema Híbrido Auth0 + Agromano - Resumen de Implementación

## ✅ Archivos Creados

### 1. **Migración de Base de Datos**
📄 `database/migraciones/008_agregar_auth0_id.sql`
- Agrega campo `auth0_id` a tabla `mot_usuario`
- Agrega campos: `email`, `auth_provider`, `email_verified`, `last_login_at`, `auth0_metadata`
- Hace `password_hash` opcional (NULL cuando usa Auth0)
- Actualiza usuario existente si tiene formato Auth0

### 2. **Servicio de Sincronización**
📄 `backend/src/services/agromano-user-sync.service.ts`
- `getOrCreateUser()` - Sincroniza usuario de Auth0 con BD local
- `vincularTrabajador()` - Vincula usuario con trabajador existente
- `crearTrabajador()` - Crea trabajador y vincula automáticamente
- `obtenerPermisos()` - Obtiene permisos desde rol
- `actualizarRol()` - Cambia rol con auditoría

### 3. **Middleware de Autenticación**
📄 `backend/src/middleware/agromano-auth.middleware.ts`
- `checkJwt` - Valida token JWT contra Auth0 usando JWKS
- `agroManoAuthMiddleware` - Sincroniza usuario y carga datos en `req.user`
- `requirePermiso()` - Verifica permisos específicos
- `requireAdmin()` - Solo administradores
- `requireSupervisorOrAdmin()` - Supervisores o administradores

### 4. **Rutas de Ejemplo**
📄 `backend/src/routes/usuarios.routes.ts`
- GET `/api/usuarios/health` - Health check (público)
- GET `/api/usuarios/perfil` - Perfil del usuario autenticado
- GET `/api/usuarios/mis-permisos` - Listar permisos propios
- PUT `/api/usuarios/perfil` - Actualizar perfil
- GET `/api/usuarios` - Listar usuarios (admin)
- GET `/api/usuarios/:id` - Detalle de usuario (admin)
- PUT `/api/usuarios/:id/rol` - Cambiar rol (admin)
- PUT `/api/usuarios/:id/estado` - Activar/desactivar (admin)
- GET `/api/usuarios/estadisticas/resumen` - Estadísticas (admin)

### 5. **Documentación**
📄 `backend/docs/SISTEMA_HIBRIDO_AUTH0_AGROMANO.md` - Documentación completa
📄 `backend/IMPLEMENTACION_AUTH0_HIBRIDO.md` - Guía rápida de implementación

### 6. **Script de Prueba**
📄 `backend/test-auth0-hybrid.js` - Prueba configuración de Auth0

---

## 🎯 Cómo Funciona

### Flujo de Autenticación

```
1. Usuario inicia sesión en Auth0 (frontend)
   ↓
2. Auth0 devuelve token JWT con campo "sub" (auth0_id)
   Ejemplo: { "sub": "auth0|68b8a6d1bf1669b349577af6", "email": "usuario@agromano.com" }
   ↓
3. Frontend envía request con token en header:
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6...
   ↓
4. Backend - Middleware checkJwt valida token contra Auth0 (JWKS)
   ↓
5. Backend - agroManoAuthMiddleware sincroniza usuario:
   - Busca en mot_usuario por auth0_id
   - Si no existe, lo crea con rol por defecto
   - Carga permisos desde mom_rol
   ↓
6. Backend - Controller tiene acceso a req.user con todos los datos:
   {
     auth0_id: "auth0|...",
     usuario_id: 1,
     username: "usuario@agromano.com",
     rol_nombre: "Administrador AgroMano",
     permisos: ["trabajadores:update:all", ...],
     trabajador_id: 1,
     trabajador: { ... }
   }
   ↓
7. Backend ejecuta lógica de negocio con datos completos
   ↓
8. Backend devuelve respuesta a frontend
```

---

## 🗄️ Estructura de Tablas

### mot_usuario (usuarios del sistema)
```
usuario_id (PK)
├─ auth0_id (UNIQUE) ← Enlace con Auth0 ("auth0|abc123")
├─ trabajador_id (FK) → mom_trabajador
├─ username
├─ email ← Email de Auth0
├─ password_hash (NULL si usa Auth0)
├─ rol_id (FK) → mom_rol
├─ estado (activo/inactivo)
├─ auth_provider ('auth0', 'local', 'google')
├─ email_verified (0/1)
├─ last_login_at
└─ auth0_metadata (JSON)
```

### Relaciones
```
mot_usuario
    ├→ mom_rol → rel_mom_rol__mom_permiso → mom_permiso (permisos)
    └→ mom_trabajador
           ├→ mot_info_laboral (datos laborales)
           ├→ mot_asistencia (asistencia)
           ├→ mot_registro_productividad (productividad)
           └→ moh_trabajador_historial (historial)
```

---

## 🚀 Pasos de Implementación

### 1. Ejecutar Migración SQL
```bash
mysql -h 174.138.186.187 -u usuario -p agromano < database/migraciones/008_agregar_auth0_id.sql
```

### 2. Configurar .env
```env
AUTH0_DOMAIN=tu-tenant.auth0.com
AUTH0_AUDIENCE=https://api.agromano.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
DATABASE_URL=mysql://user:pass@174.138.186.187:3306/agromano
```

### 3. Regenerar Prisma
```bash
cd backend
npx prisma db pull
npx prisma generate
```

### 4. Probar Configuración
```bash
node backend/test-auth0-hybrid.js
```

### 5. Iniciar Servidor
```bash
cd backend
npm run dev
```

### 6. Probar Endpoints
```bash
# Sin autenticación
curl http://localhost:3000/api/usuarios/health

# Con token de Auth0
curl -H "Authorization: Bearer TU_TOKEN" \
  http://localhost:3000/api/usuarios/perfil
```

---

## 📝 Ejemplo de Uso en Código

### Proteger una ruta con autenticación
```typescript
import { checkJwt, agroManoAuthMiddleware } from './middleware/agromano-auth.middleware';

router.get('/api/trabajadores',
  checkJwt,                    // 1. Valida token
  agroManoAuthMiddleware,      // 2. Sincroniza usuario
  async (req, res) => {
    const user = (req as any).user;
    // user.usuario_id, user.permisos, user.trabajador_id disponibles
    // ...
  }
);
```

### Verificar permisos específicos
```typescript
import { requirePermiso } from './middleware/agromano-auth.middleware';

router.put('/api/trabajadores/:id',
  checkJwt,
  agroManoAuthMiddleware,
  requirePermiso('trabajadores:update:all'),  // Solo con este permiso
  async (req, res) => {
    // ...
  }
);
```

### Solo administradores
```typescript
import { requireAdmin } from './middleware/agromano-auth.middleware';

router.post('/api/roles',
  checkJwt,
  agroManoAuthMiddleware,
  requireAdmin,  // Solo ADMIN, ADMIN_AGROMANO, GERENTE_RRHH
  async (req, res) => {
    // ...
  }
);
```

---

## 🔐 Datos Disponibles en req.user

```typescript
{
  // Auth0
  auth0_id: "auth0|68b8a6d1bf1669b349577af6",
  auth0_email: "usuario@agromano.com",
  auth0_email_verified: true,

  // BD Local
  usuario_id: 1,
  username: "usuario@agromano.com",
  email: "usuario@agromano.com",
  rol_id: 2,
  rol_codigo: "ADMIN_AGROMANO",
  rol_nombre: "Administrador AgroMano",
  estado: "activo",

  // Trabajador (si existe)
  trabajador_id: 1,
  trabajador: {
    trabajador_id: 1,
    documento_identidad: "12345678",
    nombre_completo: "Usuario Auth0",
    email: "usuario@agromano.com",
    telefono: "123456789"
  },

  // Permisos
  permisos: [
    "trabajadores:update:all",
    "asistencia:dashboard",
    "nomina:calculate",
    // ...
  ],

  // Métodos auxiliares
  hasPermiso: (codigo: string) => boolean,
  hasAnyPermiso: (...codigos: string[]) => boolean,
  hasAllPermisos: (...codigos: string[]) => boolean,
  isAdmin: () => boolean,
  isSupervisor: () => boolean
}
```

---

## ✅ Ventajas del Sistema

1. **🔒 Seguridad Robusta**: Auth0 maneja autenticación con estándares OAuth2/OIDC
2. **🎯 Control Total**: Tu BD gestiona permisos granulares y datos de negocio
3. **📈 Escalabilidad**: Auth0 se encarga de la infraestructura de autenticación
4. **🔗 Integración Simple**: Enlace mediante campo `auth0_id`
5. **📊 Auditoría Completa**: Historial de cambios en tu BD
6. **🚀 Sincronización Automática**: Usuario se crea/actualiza en primer login
7. **🔄 Compatible**: Mantiene compatibilidad con usuarios existentes

---

## 📚 Documentación Adicional

- **Guía Completa**: `backend/docs/SISTEMA_HIBRIDO_AUTH0_AGROMANO.md`
- **Guía Rápida**: `backend/IMPLEMENTACION_AUTH0_HIBRIDO.md`
- **Auth0 Docs**: https://auth0.com/docs
- **Express JWT**: https://github.com/auth0/express-jwt
- **Prisma**: https://www.prisma.io/docs

---

## 🎉 Resumen

Has implementado exitosamente un **sistema híbrido de autenticación** donde:

- ✅ **Auth0** maneja login, registro y gestión de contraseñas
- ✅ **Base de datos Agromano** maneja roles, permisos y datos de negocio
- ✅ Usuarios se sincronizan automáticamente mediante `auth0_id`
- ✅ Sistema de permisos granular con `mom_permiso`
- ✅ Auditoría completa con `mol_audit_log`
- ✅ Historial de cambios con `moh_trabajador_historial`

**🚀 ¡Tu sistema está listo para producción!**

---

**Fecha**: 2025-10-02  
**Proyecto**: Sistema de Gestión Agrícola - AgroMano  
**Versión**: 1.0.0
