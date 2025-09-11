// Tipos para el sistema RBAC
export interface Permission {
  id: number;
  nombre: string;
  descripcion: string;
  recurso: string;
  accion: string;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  auth0_id: string;
  roles: Role[];
  permisos: Permission[];
}

// Enums para recursos y acciones comunes
export enum Recurso {
  USUARIOS = 'usuarios',
  EMPLEADOS = 'empleados',
  ASISTENCIA = 'asistencia',
  NOMINA = 'nomina',
  PRODUCTIVIDAD = 'productividad',
  REPORTES = 'reportes',
  CONFIGURACION = 'configuracion',
  DASHBOARD = 'dashboard'
}

export enum Accion {
  CREAR = 'crear',
  LEER = 'leer',
  ACTUALIZAR = 'actualizar',
  ELIMINAR = 'eliminar',
  APROBAR = 'aprobar',
  PROCESAR = 'procesar',
  EXPORTAR = 'exportar'
}

// Tipos para componentes según roles
export interface RoleBasedComponent {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallbackComponent?: React.ComponentType;
  children: React.ReactNode;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  children?: NavigationItem[];
}
