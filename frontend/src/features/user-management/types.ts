// Types for User Management feature
// These align with backend auth0-roles.types.ts

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

export interface Role {
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
  roles: Role[];
  localUserData?: LocalUserData;
}

export interface UserListResponse {
  users: UserWithRoles[];
  total: number;
  start?: number;
  limit?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  name?: string;
  role?: string;
  hasRole?: boolean;
}
