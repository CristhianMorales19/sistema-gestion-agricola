@echo off
echo ================================================================
echo EJECUTANDO SETUP DE USUARIOS ADMIN PARA AUTH0
echo ================================================================

echo.
echo Conectando a MySQL...
"C:\xampp\mysql\bin\mysql.exe" -u root -p < "setup-usuarios-auth0-simple.sql"

echo.
echo ================================================================
echo SETUP COMPLETADO
echo ================================================================
echo.
echo Usuarios creados para Auth0:
echo - admin@agromano.com
echo - supervisor.campo@agromano.com  
echo - gerente.rrhh@agromano.com
echo.
echo Siguiente paso: Crear estos usuarios en Auth0
echo ================================================================

pause
