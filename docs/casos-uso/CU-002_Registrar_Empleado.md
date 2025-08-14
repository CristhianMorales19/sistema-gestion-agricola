# ESPECIFICACIÓN DE CASO DE USO

**Sistema:** Sistema de Control y Planificación de Mano de Obra Agroindustrial  
**Caso de Uso:** CU-002 - Registrar Empleado  
**Versión:** 1.0  
**Fecha:** Diciembre 2024  

---

## 1. INFORMACIÓN GENERAL

### 1.1 Identificación
- **ID:** CU-002
- **Nombre:** Registrar Empleado
- **Actor Principal:** Administrador / Gerente RRHH
- **Nivel:** Objetivo del Usuario
- **Estado:** Activo

### 1.2 Resumen
Este caso de uso describe el proceso mediante el cual un usuario autorizado registra un nuevo empleado en el sistema, incluyendo toda su información personal, laboral y asignaciones organizacionales necesarias para su correcta gestión dentro de la empresa agroindustrial.

### 1.3 Actores
- **Actor Principal:** Administrador, Gerente RRHH
- **Actores Secundarios:** Sistema de Validación, Base de Datos, Servicio de Notificaciones

---

## 2. ESPECIFICACIÓN DEL CASO DE USO

### 2.1 Precondiciones
- El usuario debe estar autenticado en el sistema
- El usuario debe tener permisos para crear empleados (rol Admin o Gerente RRHH)
- Debe existir al menos un cargo y un departamento en el sistema
- La base de datos debe estar operativa

### 2.2 Garantía de Éxito (Postcondiciones)
- El empleado queda registrado correctamente en el sistema
- Se genera un ID único para el empleado
- Se crea automáticamente un usuario asociado (opcional)
- Se registra la actividad en los logs del sistema
- Se envía notificación de bienvenida al empleado (si tiene email)
- Los datos quedan disponibles para otros módulos del sistema

### 2.3 Garantía Mínima
- Se mantiene la integridad de los datos
- No se crean registros duplicados
- Se registran los errores para auditoría

---

## 3. FLUJO PRINCIPAL DE EVENTOS

### 3.1 Escenario Exitoso

1. **Usuario** accede al módulo de "Gestión de Personal"
2. **Usuario** hace clic en "Nuevo Empleado"
3. **Sistema** presenta el formulario de registro con las siguientes secciones:
   
   **Información Personal:**
   - Cédula (campo obligatorio, único)
   - Nombre (campo obligatorio)
   - Apellidos (campo obligatorio)
   - Email (campo obligatorio, único)
   - Teléfono (opcional)
   - Dirección (opcional)
   - Fecha de nacimiento (opcional)
   - Foto (opcional)

   **Información Laboral:**
   - Fecha de ingreso (campo obligatorio, por defecto fecha actual)
   - Cargo (lista desplegable obligatoria)
   - Departamento (lista desplegable obligatoria)
   - Salario base (campo obligatorio, numérico)
   - Estado (activo/inactivo, por defecto activo)

   **Crear Usuario del Sistema:**
   - Checkbox "Crear cuenta de usuario"
   - Rol del sistema (si se marca el checkbox)

4. **Usuario** completa la información personal del empleado
5. **Usuario** selecciona el cargo desde la lista desplegable
6. **Usuario** selecciona el departamento desde la lista desplegable  
7. **Usuario** ingresa el salario base
8. **Usuario** opcionalmente marca "Crear cuenta de usuario" y selecciona el rol
9. **Usuario** hace clic en "Guardar Empleado"
10. **Sistema** valida que todos los campos obligatorios estén completos
11. **Sistema** valida el formato de email
12. **Sistema** valida que la cédula tenga formato correcto y sea única
13. **Sistema** valida que el email sea único en el sistema
14. **Sistema** valida que el salario sea un valor numérico positivo
15. **Sistema** valida que la fecha de ingreso no sea futura
16. **Sistema** inicia transacción en base de datos
17. **Sistema** genera ID único para el empleado
18. **Sistema** guarda el registro del empleado en la tabla `empleados`
19. Si se marcó "Crear cuenta de usuario":
    a. **Sistema** genera contraseña temporal aleatoria
    b. **Sistema** crea registro en tabla `usuarios`
    c. **Sistema** asocia usuario con empleado
20. **Sistema** confirma la transacción
21. **Sistema** registra la actividad en logs: "Empleado creado por [usuario]"
22. **Sistema** muestra mensaje de confirmación: "Empleado registrado exitosamente"
23. **Sistema** muestra la información del empleado creado
24. Si el empleado tiene email:
    a. **Sistema** envía email de bienvenida
    b. Si se creó usuario, incluye credenciales temporales
25. **Sistema** redirige a la lista de empleados actualizada

---

## 4. FLUJOS ALTERNATIVOS

### 4.1 Cédula Duplicada (A1)

**Punto de Extensión:** Después del paso 12 del flujo principal

1. **Sistema** detecta que la cédula ya existe en la base de datos
2. **Sistema** resalta el campo cédula en rojo
3. **Sistema** muestra mensaje: "Ya existe un empleado con esta cédula"
4. **Sistema** sugiere buscar el empleado existente
5. Regresa al paso 4 del flujo principal

### 4.2 Email Duplicado (A2)

**Punto de Extensión:** Después del paso 13 del flujo principal

1. **Sistema** detecta que el email ya está registrado
2. **Sistema** resalta el campo email en rojo
3. **Sistema** muestra mensaje: "Este email ya está en uso"
4. **Usuario** debe ingresar un email diferente
5. Regresa al paso 4 del flujo principal

### 4.3 Campos Obligatorios Vacíos (A3)

**Punto de Extensión:** Después del paso 10 del flujo principal

1. **Sistema** identifica campos obligatorios vacíos
2. **Sistema** resalta en rojo todos los campos faltantes
3. **Sistema** muestra mensaje: "Complete todos los campos obligatorios"
4. **Sistema** enumera específicamente los campos faltantes
5. Regresa al paso 4 del flujo principal

### 4.4 Formato de Cédula Inválido (A4)

**Punto de Extensión:** Después del paso 12 del flujo principal

1. **Sistema** detecta formato de cédula inválido para Costa Rica
2. **Sistema** resalta el campo cédula en rojo
3. **Sistema** muestra mensaje: "Formato de cédula inválido (ej: 1-2345-6789)"
4. Regresa al paso 4 del flujo principal

### 4.5 Salario Inválido (A5)

**Punto de Extensión:** Después del paso 14 del flujo principal

1. **Sistema** detecta que el salario no es un número positivo
2. **Sistema** resalta el campo salario en rojo
3. **Sistema** muestra mensaje: "El salario debe ser un número mayor a cero"
4. Regresa al paso 4 del flujo principal

### 4.6 Error en Creación de Usuario (A6)

**Punto de Extensión:** Después del paso 19 del flujo principal

1. **Sistema** detecta error al crear la cuenta de usuario
2. **Sistema** registra el error en logs
3. **Sistema** continúa con la creación del empleado
4. **Sistema** muestra mensaje: "Empleado creado, pero hubo un error creando la cuenta de usuario"
5. **Sistema** sugiere crear la cuenta manualmente después
6. Continúa con paso 21 del flujo principal

### 4.7 Error de Base de Datos (A7)

**Punto de Extensión:** En cualquier momento después del paso 16

1. **Sistema** detecta error en la base de datos
2. **Sistema** ejecuta rollback de la transacción
3. **Sistema** registra el error técnico en logs
4. **Sistema** muestra mensaje: "Error temporal del sistema. Intente nuevamente"
5. **Sistema** conserva los datos ingresados en el formulario
6. Regresa al paso 4 del flujo principal

---

## 5. REQUERIMIENTOS ESPECIALES

### 5.1 Requerimientos de Rendimiento
- El registro debe completarse en menos de 3 segundos
- La validación de campos debe ser inmediata (< 200ms)
- El sistema debe soportar registro de hasta 10 empleados simultáneamente

### 5.2 Requerimientos de Seguridad
- Solo usuarios con roles Admin o Gerente RRHH pueden registrar empleados
- Los datos personales deben transmitirse encriptados
- Las contraseñas temporales deben ser seguras (8+ caracteres, alfanuméricos)
- Los logs deben registrar quién creó cada empleado

### 5.3 Requerimientos de Usabilidad
- El formulario debe tener validación en tiempo real
- Debe mostrar indicadores claros de campos obligatorios (*)
- Debe incluir ayuda contextual para formato de cédula
- Debe permitir subir foto mediante drag & drop
- Debe ser responsive para tablets

### 5.4 Requerimientos de Integridad
- La cédula debe ser única en todo el sistema
- El email debe ser único en todo el sistema
- Las relaciones con cargo y departamento deben ser válidas
- No se debe permitir salarios negativos o cero

---

## 6. INFORMACIÓN ADICIONAL

### 6.1 Frecuencia de Uso
- **Media:** Se estima 5-10 registros por semana
- **Picos:** Inicios de temporada agrícola
- **Usuarios típicos:** 2-3 usuarios con estos permisos

### 6.2 Reglas de Negocio
- **RN-010:** La cédula debe seguir el formato costarricense
- **RN-011:** Los empleados menores de edad requieren documentación especial
- **RN-012:** El salario no puede ser menor al mínimo legal
- **RN-013:** La fecha de ingreso no puede ser anterior a la fundación de la empresa
- **RN-014:** Empleados inactivos no pueden tener usuarios del sistema activos

### 6.3 Supuestos y Dependencias
- **Supuesto:** Los cargos y departamentos ya están configurados
- **Supuesto:** El sistema de email está configurado
- **Dependencia:** Módulo de gestión de cargos operativo
- **Dependencia:** Módulo de gestión de departamentos operativo
- **Dependencia:** Servicio de validación de cédulas

### 6.4 Problemas Abiertos
- Definir proceso para empleados extranjeros sin cédula costarricense
- Evaluar integración con CCSS para validación automática
- Considerar importación masiva de empleados desde Excel

---

## 7. TRAZABILIDAD

### 7.1 Relación con Requerimientos
- **RF-001:** Registro de nuevo empleado
- **RF-028:** Registro de usuario
- **RNF-003:** Validación de datos únicos
- **RNF-004:** Integridad referencial

### 7.2 Relación con Azure DevOps
- **Feature ID:** 2 - Registro de personal
- **User Stories:** HU-001, HU-028
- **Epic:** Administración de Personal

### 7.3 Casos de Uso Relacionados
- **CU-001:** Autenticar Usuario (para creación de cuenta)
- **CU-003:** Registrar Asistencia (empleado debe existir)
- **CU-004:** Procesar Nómina (empleado debe estar registrado)

---

**Elaborado por:** Equipo de Desarrollo  
**Revisado por:** Gerente de RRHH  
**Aprobado por:** Product Owner  
**Estado:** Aprobado para Implementación
