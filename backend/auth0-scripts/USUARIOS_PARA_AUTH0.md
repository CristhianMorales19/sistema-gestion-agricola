## USUARIOS PARA CREAR EN AUTH0

### Usuario 1 - Administrador
- **Email:** admin@agromano.com
- **Password:** Admin123!
- **Connection:** Username-Password-Authentication
- **Roles:** ADMIN_AGROMANO

### Usuario 2 - Supervisor Campo
- **Email:** supervisor.campo@agromano.com  
- **Password:** Super123!
- **Connection:** Username-Password-Authentication
- **Roles:** SUPERVISOR_CAMPO

### Usuario 3 - Gerente RRHH
- **Email:** gerente.rrhh@agromano.com
- **Password:** Gerente123!
- **Connection:** Username-Password-Authentication
- **Roles:** GERENTE_RRHH

## NOTA IMPORTANTE:
- El middleware híbrido funciona buscando el EMAIL del usuario
- No importa dónde esté almacenado el usuario en Auth0
- Los permisos REALES vienen de la base de datos local
- Auth0 solo maneja la autenticación, no la autorización
