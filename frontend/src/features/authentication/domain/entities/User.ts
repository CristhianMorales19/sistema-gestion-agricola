import { Role } from './Role';

// Entidad User - Representa un usuario en el dominio
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly picture?: string;
  readonly roles: Role[];
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly lastLoginAt?: Date;
}

// Métodos del dominio para User
export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly roles: Role[],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly picture?: string,
    public readonly lastLoginAt?: Date
  ) {}

  // Reglas de negocio del dominio
  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName);
  }

  hasPermission(permission: string): boolean {
    return this.roles.some(role => 
      role.permissions.some(p => p.name === permission)
    );
  }

  isAdministrator(): boolean {
    return this.hasRole('Administrador del Sistema');
  }

  canAccessModule(module: string): boolean {
    // Lógica de negocio para determinar acceso a módulos
    const modulePermissions: Record<string, string[]> = {
      'user-management': ['gestionar_usuarios', 'consultar_usuarios'],
      'personnel-management': ['gestionar_personal', 'consultar_personal'],
      'attendance-tracking': ['gestionar_asistencia', 'consultar_asistencia'],
      'payroll-processing': ['gestionar_nomina', 'consultar_nomina'],
      'productivity-monitoring': ['gestionar_productividad', 'consultar_productividad'],
      'reporting-analytics': ['gestionar_reportes', 'consultar_reportes'],
      'system-configuration': ['gestionar_configuracion', 'consultar_configuracion']
    };

    const requiredPermissions = modulePermissions[module] || [];
    return requiredPermissions.some(permission => this.hasPermission(permission));
  }

  getDisplayRole(): string {
    if (this.roles.length === 0) return 'Sin rol';
    return this.roles[0].displayName || this.roles[0].name;
  }

  recordLogin(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.name,
      this.roles,
      this.isActive,
      this.createdAt,
      this.picture,
      new Date()
    );
  }
}
