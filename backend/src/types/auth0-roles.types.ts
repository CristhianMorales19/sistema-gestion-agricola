// Types for Auth0 User and Role management

export interface Auth0User {
  user_id?: string;
  email?: string;
  email_verified?: boolean;
  username?: string;
  phone_number?: string;
  phone_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  identities?: Array<{
    connection: string;
    user_id: string;
    provider: string;
    isSocial: boolean;
  }>;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  picture?: string;
  name?: string;
  nickname?: string;
  multifactor?: string[];
  last_ip?: string;
  last_login?: string;
  logins_count?: number;
  blocked?: boolean;
  given_name?: string;
  family_name?: string;
}

export interface Auth0Role {
  id?: string;
  name?: string;
  description?: string;
}

export interface LocalUserData {
  usuario_id: number;
  username?: string;
  email?: string;
  rol_id?: number;
  estado: string;
  trabajador_id?: number | null;
  mom_rol?: {
    codigo?: string;
    nombre?: string;
    descripcion?: string;
  };
}

export interface UserWithRoles {
  user: Auth0User;
  roles: Auth0Role[];
  localUserData?: LocalUserData;
}

export interface UsersListResponse {
  users: UserWithRoles[];
  total: number;
  start?: number;
  limit?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
}

export interface RolesListResponse {
  roles: Auth0Role[];
  total: number;
}

export interface RoleAssignmentRequest {
  roles: string[];
  roleIds?: string[];
  reason?: string;
}

export interface UserSearchFilters {
  page?: string | number;
  perPage?: string | number;
  email?: string;
  name?: string;
  role?: string;
  hasRole?: string;
}

export interface RoleWithPermissions extends Auth0Role {
  permissions?: Array<{
    permission_name: string;
    description?: string;
    resource_server_name?: string;
  }>;
}
