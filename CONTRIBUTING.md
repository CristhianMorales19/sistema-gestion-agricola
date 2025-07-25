# Contribuyendo al Sistema de Gestión Agrícola

¡Gracias por tu interés en contribuir! Este documento proporciona pautas para contribuir al proyecto.

## Proceso de Contribución

1. **Fork del repositorio**
2. **Crear una rama para tu feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Realizar commits descriptivos**: `git commit -m "feat: agregar funcionalidad X"`
4. **Push a tu rama**: `git push origin feature/nueva-funcionalidad`
5. **Crear un Pull Request**

## Convenciones de Código

### Frontend (React/TypeScript)
- Usar PascalCase para componentes
- Usar camelCase para variables y funciones
- Usar kebab-case para nombres de archivos
- Documentar componentes con JSDoc

### Backend (Node.js/TypeScript)
- Usar camelCase para variables y funciones
- Usar PascalCase para clases e interfaces
- Usar kebab-case para nombres de archivos
- Documentar funciones con JSDoc

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bugs
- `docs:` cambios en documentación
- `style:` formato, punto y coma faltante, etc.
- `refactor:` refactorización de código
- `test:` agregar o modificar tests
- `chore:` tareas de mantenimiento

## Estructura de Branches

- `main`: rama principal (producción)
- `develop`: rama de desarrollo
- `feature/*`: nuevas funcionalidades
- `hotfix/*`: correcciones urgentes
- `release/*`: preparación de releases

## Testing

- Escribir tests para nuevas funcionalidades
- Asegurar que todos los tests pasen antes del PR
- Mantener cobertura de código > 80%

## Reporte de Issues

Al reportar un issue, incluir:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Información del entorno
