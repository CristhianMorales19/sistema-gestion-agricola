# 📁 INVENTARIO DE ARCHIVOS - SISTEMA HÍBRIDO AUTH0 + MYSQL

## ✅ ARCHIVOS ESENCIALES (MANTENER)

### 🔧 Middleware y lógica principal:
```
src/middleware/hybrid-auth-final.middleware.ts    ✅ ESENCIAL
├── hybridAuthMiddleware                         → Middleware principal
├── checkPermission                              → Validar permiso específico  
├── checkPermissions                             → Validar múltiples permisos
└── checkRole                                    → Validar rol específico
```

### 🗄️ Scripts de base de datos:
```
scripts/crear-matriz-roles-completa.sql          ✅ ESENCIAL
├── Crea 6 roles según matriz de permisos
├── Inserta 77 permisos granulares
├── Asigna permisos a roles correctamente
└── Actualiza usuarios existentes
```

### ⚙️ Configuración:
```
.env                                             ✅ ESENCIAL
├── Configuración Auth0 (domain, client_id, etc.)
├── Conexión base de datos MySQL
└── Variables de aplicación

.env.example                                     ✅ MANTENER
└── Plantilla para otros ambientes
```

### 📚 Documentación:
```
DOCUMENTACION_SISTEMA_HIBRIDO.md                 ✅ ESENCIAL
├── Guía completa del sistema
├── Instrucciones de recreación
├── Arquitectura y flujos
└── Troubleshooting
```

---

## 📝 ARCHIVOS DE REFERENCIA (MANTENER COMO EJEMPLO)

### 🧪 Código de ejemplo:
```
src/routes/test-protected-routes.ts              📝 REFERENCIA
├── Ejemplos de rutas protegidas
├── Uso del middleware híbrido
├── Diferentes niveles de permisos
└── Patrones de implementación
```

### 🔍 Herramientas de diagnóstico:
```
verify-auth0-simple.ts                          📝 UTILIDAD
├── Verifica configuración de BD
├── Simula middleware híbrido
├── Diagnóstico de problemas
└── Herramienta de troubleshooting

test-hybrid-auth.ts                              📝 EJEMPLO
├── Servidor de prueba completo
├── Simula tokens Auth0
├── Demuestra funcionamiento
└── Testing de integración
```

---

## ❌ ARCHIVOS OBSOLETOS (ELIMINAR)

### 🗑️ Middlewares antiguos:
```
src/middleware/hybrid-auth.middleware.ts         ❌ ELIMINAR
├── Versión original con errores
├── Estructura incorrecta de BD
└── Reemplazado por hybrid-auth-final.middleware.ts

src/middleware/hybrid-auth-corrected.middleware.ts ❌ ELIMINAR
├── Versión intermedia con problemas
├── Tipos incorrectos de Prisma
└── Reemplazado por versión final
```

### 🗑️ Scripts SQL antiguos:
```
scripts/setup-usuarios-auth0-simple.sql         ❌ ELIMINAR
├── Primera versión con errores LAST_INSERT_ID()
└── Reemplazado por crear-matriz-roles-completa.sql

scripts/setup-usuarios-auth0-fixed.sql          ❌ ELIMINAR
├── Versión intermedia incompleta
└── Reemplazado por versión completa

scripts/setup-auth0-completo.sql                ❌ ELIMINAR
├── Versión con problemas de duplicados
└── Reemplazado por versión final

scripts/agregar-usuarios-auth0.sql              ❌ ELIMINAR
├── Script muy básico e incompleto
└── Funcionalidad incluida en versión final
```

### 🗑️ Scripts Auth0 no funcionales:
```
auth0-scripts/get-user-script.js                ❌ ELIMINAR
auth0-scripts/login-script.js                   ❌ ELIMINAR  
auth0-scripts/create-script.js                  ❌ ELIMINAR
├── No funcionan con localhost
├── Conexión rechazada por Auth0 sandbox
└── Enfoque cambiado a conexión estándar Auth0

auth0-scripts/USUARIOS_PARA_AUTH0.md            ✅ MANTENER
└── Documentación útil de usuarios a crear
```

### 🗑️ Tests antiguos:
```
test-connection.ts                               ❌ ELIMINAR
├── Test básico de conexión
├── Funcionalidad incluida en verify-auth0-simple.ts
└── Reemplazado por herramientas más completas

test-connection-corrected.ts                    ❌ ELIMINAR
├── Versión corregida del anterior
└── Funcionalidad incluida en verificador actual
```

---

## 🧹 COMANDO DE LIMPIEZA RECOMENDADO

```bash
# Desde la carpeta backend/

# Eliminar middlewares obsoletos
rm src/middleware/hybrid-auth.middleware.ts
rm src/middleware/hybrid-auth-corrected.middleware.ts

# Eliminar scripts SQL antiguos
rm scripts/setup-usuarios-auth0-simple.sql
rm scripts/setup-usuarios-auth0-fixed.sql  
rm scripts/setup-auth0-completo.sql
rm scripts/agregar-usuarios-auth0.sql

# Eliminar scripts Auth0 no funcionales
rm auth0-scripts/get-user-script.js
rm auth0-scripts/login-script.js
rm auth0-scripts/create-script.js

# Eliminar tests obsoletos
rm test-connection.ts
rm test-connection-corrected.ts

# Mantener solo documentación útil en auth0-scripts/
# auth0-scripts/USUARIOS_PARA_AUTH0.md → MANTENER
```

---

## 📊 RESUMEN POR IMPORTANCIA

### 🚨 CRÍTICOS (No eliminar nunca):
1. `src/middleware/hybrid-auth-final.middleware.ts`
2. `scripts/crear-matriz-roles-completa.sql`
3. `.env` (con configuración Auth0)
4. `DOCUMENTACION_SISTEMA_HIBRIDO.md`

### 📋 IMPORTANTES (Mantener):
1. `src/routes/test-protected-routes.ts` (ejemplos)
2. `verify-auth0-simple.ts` (diagnóstico)
3. `.env.example` (plantilla)
4. `auth0-scripts/USUARIOS_PARA_AUTH0.md`

### 🧪 OPCIONALES (Para testing):
1. `test-hybrid-auth.ts` (servidor de prueba)

### 🗑️ ELIMINAR (19 archivos obsoletos):
- 2 middlewares antiguos
- 4 scripts SQL obsoletos  
- 3 scripts Auth0 no funcionales
- 2 tests antiguos
- +otros archivos temporales

---

## 🎯 ESTRUCTURA FINAL RECOMENDADA

```
backend/
├── src/
│   ├── middleware/
│   │   └── hybrid-auth-final.middleware.ts     ✅
│   └── routes/
│       └── test-protected-routes.ts            📝
├── scripts/
│   └── crear-matriz-roles-completa.sql         ✅
├── auth0-scripts/
│   └── USUARIOS_PARA_AUTH0.md                  📝
├── .env                                        ✅
├── .env.example                                ✅
├── DOCUMENTACION_SISTEMA_HIBRIDO.md            ✅
├── verify-auth0-simple.ts                      🔧
└── test-hybrid-auth.ts                         🧪
```

**Total archivos mantenidos: 8 esenciales + 3 opcionales = 11 archivos**  
**Archivos eliminados: ~19 archivos obsoletos**

---

*Inventario generado para optimizar el proyecto AgroMano*  
*Recomendación: Ejecutar comando de limpieza para reducir confusión*
