# Frontend - Sistema RBAC con Auth0

## 🎯 Lo que ya tienes implementado

He creado un sistema completo de RBAC (Role-Based Access Control) con Auth0 que puedes integrar fácilmente con tu trabajo existente. 

## 📁 Archivos Creados

```
frontend/
├── src/
│   ├── auth/
│   │   ├── types.ts              # Tipos TypeScript para auth y permisos
│   │   └── AuthContext.tsx       # Contexto principal de autenticación
│   ├── components/
│   │   └── rbac/
│   │       ├── ProtectedComponent.tsx  # Componente para proteger contenido
│   │       ├── RBACNavigation.tsx      # Navegación que se adapta por permisos
│   │       ├── RBACLayout.tsx          # Layout principal con header y sidebar
│   │       ├── ExampleRBACPage.tsx     # Página de ejemplo
│   │       └── index.ts                # Exportaciones principales
│   └── config/
│       └── auth0.ts              # Configuración de Auth0
├── .env.example                  # Variables de entorno (ya existía)
└── RBAC_GUIDE.md                # Documentación completa
```

## 🚀 Cómo integrar con tu App.tsx existente

### 1. Instalar dependencia adicional (si no la tienes)

```bash
npm install @auth0/auth0-react
```

### 2. Configurar variables de entorno

En tu archivo `.env.local`:

```bash
REACT_APP_AUTH0_DOMAIN=dev-agromano.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=tu-client-id-de-auth0
REACT_APP_AUTH0_AUDIENCE=https://api.agromano.com
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Modificar tu index.tsx principal

Crear `src/index.tsx` (o modificar el existente):

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

### 4. Usar en tus componentes existentes

En cualquier componente donde necesites control de acceso:

```tsx
import { ProtectedComponent, usePermissions } from './components/rbac';

function TuComponenteExistente() {
  const { canManageUsers, hasPermission } = usePermissions();

  return (
    <div>
      {/* Tu contenido existente */}
      
      {/* Agregar protección por permisos */}
      <ProtectedComponent requiredPermission="gestionar_usuarios">
        <button>Solo para usuarios con permiso de gestión</button>
      </ProtectedComponent>
      
      {/* O usar el hook directamente */}
      {canManageUsers() && (
        <div>Panel de administración</div>
      )}
    </div>
  );
}
```

## 🔄 Integración con tu App.tsx actual

Tu App.tsx actual parece tener:
- React Router
- Material-UI
- Auth0Provider (genial!)
- Contextos propios

Para integrar el RBAC:

1. **Reemplazar tu AuthContext** con el que creé, o combinar ambos
2. **Usar RBACLayout** como wrapper de tus rutas
3. **Proteger rutas específicas** con ProtectedComponent

Ejemplo de integración:

```tsx
// En tu App.tsx, dentro de las rutas:
<Routes>
  <Route path="/dashboard" element={
    <ProtectedComponent requiredPermission="consultar_reportes">
      <Dashboard />
    </ProtectedComponent>
  } />
  
  <Route path="/usuarios" element={
    <ProtectedComponent requiredPermission="gestionar_usuarios">
      <GestionUsuarios />
    </ProtectedComponent>
  } />
  
  {/* Más rutas... */}
</Routes>
```

## 🎨 Usar el Layout RBAC (Opcional)

Si quieres usar mi layout con navegación automática por permisos:

```tsx
import { RBACLayout } from './components/rbac';

function App() {
  return (
    <RBACLayout title="Sistema de Gestión Agrícola">
      {/* Tu contenido aquí */}
    </RBACLayout>
  );
}
```

## 📋 Lista de Permisos Disponibles

- `gestionar_usuarios` / `consultar_usuarios`
- `gestionar_personal` / `consultar_personal`
- `gestionar_asistencia` / `consultar_asistencia`
- `gestionar_nomina` / `consultar_nomina`
- `gestionar_productividad` / `consultar_productividad`
- `gestionar_reportes` / `consultar_reportes`
- `gestionar_configuracion` / `consultar_configuracion`

## 🧪 Probar el Sistema

1. **Ver la página de ejemplo**:
   ```tsx
   import { ExampleRBACPage } from './components/rbac';
   
   // Usar en cualquier ruta para ver cómo funciona
   ```

2. **Verificar permisos en consola**:
   ```tsx
   const { user } = usePermissions();
   console.log('Usuario actual:', user);
   console.log('Permisos:', user?.permisos);
   ```

## 🤝 Para tu equipo

Cada miembro puede:

1. **Importar fácilmente**:
   ```tsx
   import { ProtectedComponent, usePermissions } from './components/rbac';
   ```

2. **Proteger su contenido**:
   ```tsx
   <ProtectedComponent requiredPermission="su_permiso">
     {/* Su código aquí */}
   </ProtectedComponent>
   ```

3. **No modificar** los archivos en `auth/` y `rbac/` sin coordinación

## 📞 Siguiente Paso

1. Lee la documentación completa en `RBAC_GUIDE.md`
2. Integra gradualmente en tu App.tsx existente
3. Prueba con la página de ejemplo
4. Coordina con tu equipo para la integración final

## 🔗 Conexión con Backend

El sistema ya está configurado para conectar con el backend que configuramos antes:
- Valida tokens Auth0
- Obtiene permisos desde MySQL
- Funciona con el middleware híbrido que creamos

¿Quieres que te ayude a integrar esto con tu App.tsx actual específicamente?
