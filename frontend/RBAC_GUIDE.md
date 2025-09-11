# Sistema RBAC con Auth0 - Guía para Desarrolladores

## 📋 Descripción

Este sistema proporciona autenticación híbrida con Auth0 y control de acceso basado en roles (RBAC) para el frontend React. Los usuarios se autentican con Auth0 y los permisos se consultan desde la base de datos MySQL local.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crear un archivo `.env.local` en la raíz del frontend con:

```bash
REACT_APP_AUTH0_DOMAIN=dev-agromano.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=tu-client-id-de-auth0
REACT_APP_AUTH0_AUDIENCE=https://api.agromano.com
REACT_APP_API_URL=http://localhost:3001/api
```

### 2. Configurar Auth0 en tu aplicación

En `src/index.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './components/rbac';
import { auth0Config } from './components/rbac';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Auth0Provider
    domain={auth0Config.domain}
    clientId={auth0Config.clientId}
    authorizationParams={{
      redirect_uri: auth0Config.redirectUri,
      audience: auth0Config.audience,
      scope: auth0Config.scope
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </Auth0Provider>
);
```

## 🧩 Componentes Disponibles

### 1. **RBACLayout** - Layout principal con navegación

```tsx
import { RBACLayout } from './components/rbac';

function App() {
  return (
    <RBACLayout title="Mi Aplicación">
      <div>Contenido de la aplicación</div>
    </RBACLayout>
  );
}
```

### 2. **ProtectedComponent** - Proteger contenido por permisos

```tsx
import { ProtectedComponent } from './components/rbac';

function MiComponente() {
  return (
    <div>
      <h1>Página pública</h1>
      
      {/* Solo usuarios con permiso para gestionar personal */}
      <ProtectedComponent requiredPermission="gestionar_personal">
        <button>Agregar Empleado</button>
      </ProtectedComponent>
      
      {/* Solo administradores */}
      <ProtectedComponent requiredRole="Administrador del Sistema">
        <button>Configuración Avanzada</button>
      </ProtectedComponent>
      
      {/* Con fallback personalizado */}
      <ProtectedComponent 
        requiredPermission="gestionar_usuarios"
        fallback={<p>No tienes permisos para esta acción</p>}
      >
        <button>Gestionar Usuarios</button>
      </ProtectedComponent>
    </div>
  );
}
```

### 3. **usePermissions** - Hook para verificar permisos

```tsx
import { usePermissions } from './components/rbac';

function MiComponente() {
  const { 
    hasPermission, 
    hasRole, 
    user,
    canManageUsers,
    canViewReports,
    isAdmin 
  } = usePermissions();

  if (isAdmin()) {
    return <AdminPanel />;
  }

  return (
    <div>
      <h1>Hola {user?.name}</h1>
      
      {canManageUsers() && (
        <button>Gestionar Usuarios</button>
      )}
      
      {hasPermission('consultar_reportes') && (
        <link to="/reportes">Ver Reportes</link>
      )}
    </div>
  );
}
```

### 4. **useAuth** - Hook principal de autenticación

```tsx
import { useAuth } from './components/rbac';

function MiComponente() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  
  if (!isAuthenticated) {
    return <button onClick={login}>Iniciar Sesión</button>;
  }

  return (
    <div>
      <p>Bienvenido {user?.name}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

## 🔐 Permisos Disponibles

### Usuarios
- `gestionar_usuarios` - Crear, editar, eliminar usuarios
- `consultar_usuarios` - Ver lista de usuarios

### Personal  
- `gestionar_personal` - Crear, editar, eliminar empleados
- `consultar_personal` - Ver lista de empleados

### Asistencia
- `gestionar_asistencia` - Registrar, editar asistencia
- `consultar_asistencia` - Ver reportes de asistencia

### Nómina
- `gestionar_nomina` - Procesar, editar nómina
- `consultar_nomina` - Ver reportes de nómina

### Productividad
- `gestionar_productividad` - Asignar tareas, metas
- `consultar_productividad` - Ver reportes de productividad

### Reportes
- `gestionar_reportes` - Crear, editar reportes
- `consultar_reportes` - Ver reportes

### Configuración
- `gestionar_configuracion` - Modificar configuración del sistema
- `consultar_configuracion` - Ver configuración del sistema

## 👥 Roles Disponibles

- **Administrador del Sistema** - Acceso completo
- **Gerente de RRHH** - Gestión de personal y nómina
- **Supervisor de Campo** - Gestión de asistencia y productividad
- **Empleado** - Solo consulta de su información personal

## 📝 Ejemplos de Implementación

### Página con diferentes acciones según rol

```tsx
import { ProtectedComponent, usePermissions } from './components/rbac';

function GestionPersonal() {
  const { canManagePersonal, canViewPersonal } = usePermissions();

  return (
    <div>
      <h1>Gestión de Personal</h1>
      
      {/* Tabla visible para todos con permisos de consulta */}
      <ProtectedComponent requiredPermission="consultar_personal">
        <TablaEmpleados />
      </ProtectedComponent>
      
      {/* Botones de acción solo para gestión */}
      <ProtectedComponent requiredPermission="gestionar_personal">
        <div>
          <button>Agregar Empleado</button>
          <button>Editar Empleado</button>
          <button>Eliminar Empleado</button>
        </div>
      </ProtectedComponent>
    </div>
  );
}
```

### Navegación condicional

```tsx
import { RBACNavigation } from './components/rbac';

// La navegación ya se adapta automáticamente según los permisos del usuario
// Solo aparecerán las opciones para las que tiene permisos
```

## 🔧 Personalización

### Agregar nuevos permisos

1. Actualizar `src/auth/types.ts`:
```tsx
export interface UserPermissions {
  // ...permisos existentes...
  mi_nuevo_permiso: boolean;
}
```

2. Actualizar la base de datos con el nuevo permiso
3. Usar en componentes:
```tsx
<ProtectedComponent requiredPermission="mi_nuevo_permiso">
  <MiNuevoComponente />
</ProtectedComponent>
```

### Agregar shortcuts en usePermissions

En `src/components/rbac/ProtectedComponent.tsx`:
```tsx
export const usePermissions = () => {
  // ...código existente...
  return {
    // ...funciones existentes...
    canDoSomethingNew: () => hasPermission('mi_nuevo_permiso')
  };
};
```

## 🚨 Consideraciones Importantes

1. **Seguridad**: Los permisos en el frontend son solo para UX. La seguridad real debe implementarse en el backend.

2. **Performance**: Los permisos se cargan una vez al iniciar sesión y se mantienen en memoria.

3. **Navegación**: Recuerda integrar con React Router para manejar las rutas protegidas.

4. **Testing**: Todos los componentes aceptan mocks para facilitar las pruebas.

## 🤝 Trabajo en Equipo

### Para otros desarrolladores:

1. **Importar componentes**:
```tsx
import { ProtectedComponent, usePermissions, RBACLayout } from './components/rbac';
```

2. **Crear nuevas páginas**:
```tsx
function MiNuevaPagina() {
  return (
    <RBACLayout title="Mi Página">
      <ProtectedComponent requiredPermission="mi_permiso">
        {/* Tu contenido aquí */}
      </ProtectedComponent>
    </RBACLayout>
  );
}
```

3. **No modificar** los archivos en `src/auth/` y `src/components/rbac/` sin coordinación.

4. **Usar siempre** los componentes proporcionados para mantener consistencia.

## 📞 Soporte

Si tienes dudas sobre cómo implementar alguna funcionalidad con RBAC, consulta los ejemplos en `ExampleRBACPage.tsx` o pregunta al responsable del sistema de autenticación.
