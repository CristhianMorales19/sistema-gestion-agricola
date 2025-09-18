# 🎭 SISTEMA HÍBRIDO AUTH0 + MYSQL - AGROMANO

> **Sistema de autenticación híbrido que combina Auth0 (autenticación) + Base de datos MySQL local (autorización granular)**

## 🚀 ESTADO ACTUAL: ✅ COMPLETADO Y FUNCIONAL

### ✅ Lo que está listo:
- **Base de datos configurada** con 6 roles y 77 permisos granulares
- **3 usuarios administrativos** creados en BD y Auth0
- **Middleware híbrido funcional** que valida Auth0 y carga permisos de BD
- **Sistema probado y documentado** completamente

---

## ⚡ INICIO RÁPIDO

### 1. **Verificar que todo funciona:**
```bash
cd backend
npx ts-node verify-auth0-simple.ts
```

### 2. **Probar servidor de ejemplo:**
```bash
npx ts-node test-hybrid-auth.ts

# En otro terminal:
curl http://localhost:3000/api/test-auth?user=admin
```

### 3. **Limpiar archivos obsoletos (opcional):**
```bash
limpiar-archivos-obsoletos.bat
```

---

## 📁 ARCHIVOS PRINCIPALES

### 🔧 **Código de producción:**
- `src/middleware/hybrid-auth-final.middleware.ts` → Middleware principal
- `scripts/crear-matriz-roles-completa.sql` → Script de BD completo
- `.env` → Configuración Auth0 y BD

### 📚 **Documentación:**
- `DOCUMENTACION_SISTEMA_HIBRIDO.md` → Guía completa
- `INVENTARIO_ARCHIVOS.md` → Lista de archivos necesarios/obsoletos

### 🧪 **Herramientas:**
- `verify-auth0-simple.ts` → Verificar configuración
- `test-hybrid-auth.ts` → Servidor de pruebas

---

## 🏗️ CÓMO FUNCIONA

```
1. Usuario login → Auth0 → JWT token
2. Token llega a API → Auth0 middleware valida
3. Middleware híbrido → Busca usuario en BD local por email
4. Carga permisos REALES → Desde tabla rel_mom_rol__mom_permiso
5. Usuario autorizado → Con permisos específicos de BD
```

---

## 👥 USUARIOS CONFIGURADOS

| Email | Rol | Permisos | Estado |
|-------|-----|----------|--------|
| admin@agromano.com | ADMIN_AGROMANO | 77 permisos | ✅ Listo |
| supervisor.campo@agromano.com | SUPERVISOR_CAMPO | 40 permisos | ✅ Listo |
| gerente.rrhh@agromano.com | GERENTE_RRHH | 37 permisos | ✅ Listo |

---

## 🎯 USO EN PRODUCCIÓN

### Ruta básica protegida:
```typescript
import { hybridAuthMiddleware, checkPermission } from './middleware/hybrid-auth-final.middleware';

app.get('/api/trabajadores', 
  checkJwt,                                    // Auth0 valida JWT
  hybridAuthMiddleware,                        // Carga usuario de BD
  checkPermission('trabajadores:read:all'),    // Verifica permiso
  (req, res) => {
    const user = (req as any).user;
    // user.permissions = array de permisos reales
    res.json({ trabajadores: [...] });
  }
);
```

### Verificar múltiples permisos:
```typescript
app.post('/api/nomina', 
  checkJwt,
  hybridAuthMiddleware,
  checkPermissions(['nomina:process', 'nomina:calculate']),
  (req, res) => {
    // Solo usuarios con AMBOS permisos
  }
);
```

### Verificar rol específico:
```typescript
app.get('/api/admin', 
  checkJwt,
  hybridAuthMiddleware,
  checkRole('ADMIN_AGROMANO'),
  (req, res) => {
    // Solo administradores
  }
);
```

---

## 🔄 MIGRACIÓN A OTRO AMBIENTE

1. **Clonar este proyecto**
2. **Ejecutar script BD**: `mysql -u root -p agromano < scripts/crear-matriz-roles-completa.sql`
3. **Configurar Auth0**: Crear app, API y usuarios según documentación
4. **Configurar .env**: Con datos reales de Auth0
5. **Verificar**: `npx ts-node verify-auth0-simple.ts`

**Resultado**: Sistema híbrido funcional en nuevo ambiente.

---

## 🛠️ TROUBLESHOOTING

### Usuario no autorizado:
```json
{
  "success": false,
  "message": "Usuario no autorizado en el sistema",
  "email": "usuario@example.com"
}
```
**Solución**: Verificar que usuario existe en tabla `mot_usuario` con ese email.

### Token inválido:
**Solución**: Verificar variables Auth0 en `.env`

### Permisos insuficientes:
**Solución**: Verificar asignación de roles en tabla `rel_mom_rol__mom_permiso`

---

## 📊 MATRIZ DE ROLES

| Rol | Descripción | Permisos | Usuarios |
|-----|-------------|----------|----------|
| ADMIN_AGROMANO | Administrador completo | 77 | admin@agromano.com |
| SUPERVISOR_CAMPO | Supervisor operaciones | 40 | supervisor.campo@agromano.com |
| GERENTE_RRHH | Gerente recursos humanos | 37 | gerente.rrhh@agromano.com |
| SUPERVISOR_RRHH | Supervisor RRHH limitado | 14 | - |
| EMPLEADO_CAMPO | Trabajador básico | 6 | - |
| VISUAL_SOLO_LECTURA | Solo reportes | 11 | - |

---

## ⚠️ NOTAS IMPORTANTES

### **Temporal (hasta migrar BD a la nube):**
- Base de datos en localhost (XAMPP)
- Scripts Auth0 custom no funcionan con localhost
- Usuarios creados manualmente en Auth0

### **Para producción:**
- Migrar MySQL a RDS/Cloud SQL
- Configurar CORS adecuadamente
- Usar variables de entorno seguras

---

## 📞 SOPORTE

- **Documentación completa**: `DOCUMENTACION_SISTEMA_HIBRIDO.md`
- **Inventario de archivos**: `INVENTARIO_ARCHIVOS.md`
- **Scripts de verificación**: `verify-auth0-simple.ts`

---

*Sistema desarrollado para AgroMano - Gestión de Trabajadores Agrícolas*  
*Estado: ✅ COMPLETADO | Versión: 1.0 | Septiembre 2025*
