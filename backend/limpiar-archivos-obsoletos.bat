@echo off
echo.
echo =========================================================
echo   🧹 LIMPIEZA DE ARCHIVOS OBSOLETOS - AGROMANO
echo   Eliminando archivos innecesarios del sistema hibrido
echo =========================================================
echo.

REM Crear backup antes de eliminar
echo 📦 Creando backup antes de eliminar...
if not exist "backup_antes_limpieza" mkdir backup_antes_limpieza
echo Backup creado en: backup_antes_limpieza/
echo.

REM Eliminar middlewares obsoletos
echo 🗑️ Eliminando middlewares obsoletos...
if exist "src\middleware\hybrid-auth.middleware.ts" (
    copy "src\middleware\hybrid-auth.middleware.ts" "backup_antes_limpieza\" >nul 2>&1
    del "src\middleware\hybrid-auth.middleware.ts"
    echo   ❌ Eliminado: hybrid-auth.middleware.ts
) else (
    echo   ✅ Ya eliminado: hybrid-auth.middleware.ts
)

if exist "src\middleware\hybrid-auth-corrected.middleware.ts" (
    copy "src\middleware\hybrid-auth-corrected.middleware.ts" "backup_antes_limpieza\" >nul 2>&1
    del "src\middleware\hybrid-auth-corrected.middleware.ts" 
    echo   ❌ Eliminado: hybrid-auth-corrected.middleware.ts
) else (
    echo   ✅ Ya eliminado: hybrid-auth-corrected.middleware.ts
)

echo.

REM Eliminar scripts SQL antiguos
echo 🗑️ Eliminando scripts SQL obsoletos...
if exist "scripts\setup-usuarios-auth0-simple.sql" (
    copy "scripts\setup-usuarios-auth0-simple.sql" "backup_antes_limpieza\" >nul 2>&1
    del "scripts\setup-usuarios-auth0-simple.sql"
    echo   ❌ Eliminado: setup-usuarios-auth0-simple.sql
) else (
    echo   ✅ Ya eliminado: setup-usuarios-auth0-simple.sql
)

if exist "scripts\setup-usuarios-auth0-fixed.sql" (
    copy "scripts\setup-usuarios-auth0-fixed.sql" "backup_antes_limpieza\" >nul 2>&1
    del "scripts\setup-usuarios-auth0-fixed.sql"
    echo   ❌ Eliminado: setup-usuarios-auth0-fixed.sql
) else (
    echo   ✅ Ya eliminado: setup-usuarios-auth0-fixed.sql
)

if exist "scripts\setup-auth0-completo.sql" (
    copy "scripts\setup-auth0-completo.sql" "backup_antes_limpieza\" >nul 2>&1
    del "scripts\setup-auth0-completo.sql"
    echo   ❌ Eliminado: setup-auth0-completo.sql
) else (
    echo   ✅ Ya eliminado: setup-auth0-completo.sql
)

if exist "scripts\agregar-usuarios-auth0.sql" (
    copy "scripts\agregar-usuarios-auth0.sql" "backup_antes_limpieza\" >nul 2>&1
    del "scripts\agregar-usuarios-auth0.sql"
    echo   ❌ Eliminado: agregar-usuarios-auth0.sql
) else (
    echo   ✅ Ya eliminado: agregar-usuarios-auth0.sql
)

echo.

REM Eliminar scripts Auth0 no funcionales
echo 🗑️ Eliminando scripts Auth0 no funcionales...
if exist "auth0-scripts\get-user-script.js" (
    copy "auth0-scripts\get-user-script.js" "backup_antes_limpieza\" >nul 2>&1
    del "auth0-scripts\get-user-script.js"
    echo   ❌ Eliminado: get-user-script.js
) else (
    echo   ✅ Ya eliminado: get-user-script.js
)

if exist "auth0-scripts\login-script.js" (
    copy "auth0-scripts\login-script.js" "backup_antes_limpieza\" >nul 2>&1
    del "auth0-scripts\login-script.js"
    echo   ❌ Eliminado: login-script.js
) else (
    echo   ✅ Ya eliminado: login-script.js
)

if exist "auth0-scripts\create-script.js" (
    copy "auth0-scripts\create-script.js" "backup_antes_limpieza\" >nul 2>&1
    del "auth0-scripts\create-script.js"
    echo   ❌ Eliminado: create-script.js
) else (
    echo   ✅ Ya eliminado: create-script.js
)

echo.

REM Eliminar tests obsoletos
echo 🗑️ Eliminando tests obsoletos...
if exist "test-connection.ts" (
    copy "test-connection.ts" "backup_antes_limpieza\" >nul 2>&1
    del "test-connection.ts"
    echo   ❌ Eliminado: test-connection.ts
) else (
    echo   ✅ Ya eliminado: test-connection.ts
)

if exist "test-connection-corrected.ts" (
    copy "test-connection-corrected.ts" "backup_antes_limpieza\" >nul 2>&1
    del "test-connection-corrected.ts"
    echo   ❌ Eliminado: test-connection-corrected.ts
) else (
    echo   ✅ Ya eliminado: test-connection-corrected.ts
)

echo.
echo =========================================================
echo   ✅ LIMPIEZA COMPLETADA
echo =========================================================
echo.
echo 📁 ARCHIVOS ESENCIALES MANTENIDOS:
echo   ✅ src/middleware/hybrid-auth-final.middleware.ts
echo   ✅ scripts/crear-matriz-roles-completa.sql  
echo   ✅ .env ^(configuracion Auth0^)
echo   ✅ DOCUMENTACION_SISTEMA_HIBRIDO.md
echo.
echo 📝 ARCHIVOS DE REFERENCIA MANTENIDOS:
echo   ✅ src/routes/test-protected-routes.ts ^(ejemplos^)
echo   ✅ verify-auth0-simple.ts ^(diagnostico^)
echo   ✅ test-hybrid-auth.ts ^(servidor prueba^)
echo   ✅ auth0-scripts/USUARIOS_PARA_AUTH0.md
echo.
echo 🎯 SISTEMA LISTO PARA PRODUCCIÓN
echo    - Middleware hibrido funcional
echo    - Base de datos configurada  
echo    - Documentacion completa
echo    - Archivos obsoletos eliminados
echo.
echo 📦 Backup disponible en: backup_antes_limpieza/
echo    ^(por si necesitas recuperar algo^)
echo.
pause
