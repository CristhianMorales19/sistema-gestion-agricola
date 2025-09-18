# Archivos y Carpetas a Limpiar

## Archivos Duplicados/Obsoletos Encontrados:

### 1. Estructura duplicada de autenticación:
- `src/auth/` (obsoleto)
- `src/authentication/` (correcto - mantener)

### 2. Configuración duplicada:
- `src/config/auth0.config.ts` (obsoleto)
- `src/config/auth0.ts` (obsoleto)
- `src/app/config/index.ts` (correcto - mantener)

### 3. Contextos obsoletos:
- `src/contexts/AuthContext.tsx` (obsoleto)
- `src/authentication/application/hooks/useAuth.ts` (correcto - mantener)

### 4. Componentes duplicados:
- `src/components/Login.tsx` (obsoleto)
- `src/components/ProtectedRoute.tsx` (obsoleto)
- `src/authentication/presentation/components/LoginPage/` (correcto - mantener)
- `src/authentication/presentation/components/ProtectedRoute/` (correcto - mantener)

### 5. Carpetas vacías/incompletas:
- `src/caracteristicas/` (contiene módulos vacíos)
- `src/services/` (posiblemente obsoleto)
- `src/types/` (posiblemente obsoleto)

## Acciones a Realizar:

1. ✅ Eliminar `src/App.tsx` (ya eliminado)
2. 🔄 Renombrar carpetas obsoletas agregando sufijo `_obsoleto`
3. ✅ Mantener solo la estructura correcta en `src/authentication/`
4. ✅ Usar `src/AppWithRBAC.tsx` como archivo principal
5. 🔄 Limpiar imports innecesarios

## Estado Actual:
- ✅ AppWithRBAC.tsx simplificado y funcionando
- ✅ Estructura de authentication/ completa
- 🔄 Limpieza pendiente de archivos duplicados
