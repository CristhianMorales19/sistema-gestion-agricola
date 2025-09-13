# Pruebas RBAC y Middleware en el Frontend

Este documento describe cómo ejecutar y crear pruebas para la funcionalidad de control de acceso basado en roles (RBAC) y los middleware implementados en el frontend.

## Dependencias necesarias
- Jest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- ts-jest

## Estructura sugerida de pruebas
- Ubicar los archivos de prueba en `test/fase-1-pruebas-unitarias-integracion/frontend/`
- Usar archivos con extensión `.test.tsx` para componentes y `.test.ts` para lógica de middleware.

## Ejemplo de prueba para RBAC
```tsx
import { render, screen } from '@testing-library/react';
import ProtectedComponent from '../../frontend/src/components/rbac/ProtectedComponent';

test('muestra contenido solo para roles permitidos', () => {
  render(<ProtectedComponent allowedRoles={['admin']} userRole="admin">Contenido</ProtectedComponent>);
  expect(screen.getByText('Contenido')).toBeInTheDocument();
});
```

## Ejemplo de prueba para Middleware
```ts
import { rbacMiddleware } from '../../frontend/src/components/rbac/RBACLayout';

test('permite acceso si el rol es válido', () => {
  const result = rbacMiddleware('admin', ['admin', 'user']);
  expect(result).toBe(true);
});
```

## Ejecución de pruebas
```bash
npm test
```

## Recomendaciones
- Crear pruebas unitarias para cada componente y función de middleware.
- Documentar los casos de prueba en este archivo.
- Mantener la cobertura de pruebas actualizada.

---
