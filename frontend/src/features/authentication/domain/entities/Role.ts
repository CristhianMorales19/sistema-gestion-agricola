// Entidad Role - Representa un rol en el sistema
export interface Permission {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly module: string;
}

export interface Role {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly color: string;
  readonly icon: string;
  readonly permissions: Permission[];
  readonly isActive: boolean;
}

// Definición de roles predefinidos del sistema
export const SYSTEM_ROLES = {
  ADMIN: 'Administrador del Sistema',
  HR_MANAGER: 'Gerente de RRHH', 
  FARM_MANAGER: 'Gerente de Granja',
  FIELD_SUPERVISOR: 'Supervisor de Campo',
  FIELD_WORKER: 'Trabajador de Campo'
} as const;

// Configuración visual de roles para la UI
export const ROLE_CONFIG: Record<string, {
  color: string;
  icon: string;
  email: string;
  description: string;
}> = {
  [SYSTEM_ROLES.ADMIN]: {
    color: '#ef4444', // Rojo
    icon: '👨‍💼',
    email: 'admin@agrisystem.com',
    description: 'Acceso completo a todas las funciones'
  },
  [SYSTEM_ROLES.FARM_MANAGER]: {
    color: '#16d36c', // Verde
    icon: '🌾',
    email: 'manager@farm1.com', 
    description: 'Gestión completa de la granja asignada'
  },
  [SYSTEM_ROLES.FIELD_SUPERVISOR]: {
    color: '#3b82f6', // Azul
    icon: '👷‍♂️',
    email: 'supervisor@farm1.com',
    description: 'Supervisión de cultivos y trabajadores'
  },
  [SYSTEM_ROLES.FIELD_WORKER]: {
    color: '#f97316', // Naranja
    icon: '👨‍🌾',
    email: 'worker@farm1.com',
    description: 'Acceso a tareas y cultivos asignados'
  }
};

// Entidad Role con métodos de dominio
export class RoleEntity implements Role {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayName: string,
    public readonly description: string,
    public readonly color: string,
    public readonly icon: string,
    public readonly permissions: Permission[],
    public readonly isActive: boolean = true
  ) {}

  hasPermission(permissionName: string): boolean {
    return this.permissions.some(p => p.name === permissionName);
  }

  getPermissionsByModule(module: string): Permission[] {
    return this.permissions.filter(p => p.module === module);
  }

  static fromSystemRole(systemRole: string, permissions: Permission[]): RoleEntity {
    const config = ROLE_CONFIG[systemRole];
    if (!config) {
      throw new Error(`Rol del sistema no reconocido: ${systemRole}`);
    }

    return new RoleEntity(
      systemRole.toLowerCase().replace(/\s+/g, '_'),
      systemRole,
      systemRole,
      config.description,
      config.color,
      config.icon,
      permissions,
      true
    );
  }
}
