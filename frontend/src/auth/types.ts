// Tipos para el sistema RBAC
import { Employee } from "../features/personnel-management";

export interface UserPermissions {
  gestionar_usuarios: boolean;
  consultar_usuarios: boolean;
  gestionar_personal: boolean;
  consultar_personal: boolean;
  gestionar_asistencia: boolean;
  consultar_asistencia: boolean;
  gestionar_condiciones_trabajo: boolean;
  // Parcelas - usando formato Auth0
  'parcelas:read': boolean;
  'parcelas:update': boolean;
  gestionar_nomina: boolean;
  consultar_nomina: boolean;
  gestionar_productividad: boolean;
  consultar_productividad: boolean;
  gestionar_reportes: boolean;
  consultar_reportes: boolean;
  gestionar_configuracion: boolean;
  consultar_configuracion: boolean;
}

export interface UserRole {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  roles: UserRole[];
  permisos: UserPermissions;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permiso: keyof UserPermissions) => boolean;
  hasRole: (roleName: string) => boolean;
  login: () => Promise<void>;
  logout: () => void;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface CreateEmployeeResponse {
    trabajador: Employee;
    permissions: string[];
}
