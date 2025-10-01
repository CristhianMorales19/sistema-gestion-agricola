import { UserWithRoles, UserListResponse, AssignRolesRequest, UserFilters, Role } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class UserManagementService {
  constructor(private getAccessToken: () => Promise<string>) {}

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();
    
    if (filters.role) searchParams.append('role', filters.role);
    if (filters.hasRole !== undefined) searchParams.append('hasRole', filters.hasRole.toString());
    if (filters.name) searchParams.append('name', filters.name);
    if (filters.page !== undefined) searchParams.append('page', filters.page.toString());
    if (filters.limit) searchParams.append('limit', filters.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/test/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<any>(endpoint);
    // El backend devuelve { success: true, data: UserListResponse, message: string }
    return response.data || response;
  }

  async getUserById(userId: string): Promise<UserWithRoles> {
    const response = await this.request<any>(`/test/users/${userId}`);
    return response.data || response;
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<UserWithRoles> {
    const response = await this.request<any>(`/test/users/${userId}/roles`, {
      method: 'PUT',
      body: JSON.stringify({ roleIds }),
    });
    return response.data || response;
  }

  async removeRole(userId: string, roleId: string): Promise<UserWithRoles> {
    const response = await this.request<any>(`/test/users/${userId}/roles/${roleId}`, {
      method: 'DELETE',
    });
    return response.data || response;
  }

  async syncUsers(): Promise<{ message: string }> {
    const response = await this.request<any>('/test/users/sync', {
      method: 'POST',
    });
    return response.data || response;
  }

  async getRoles(): Promise<Role[]> {
    const response = await this.request<any>('/test/roles');
    // El backend devuelve { success: true, data: { roles: Role[], total: number }, message: string }
    if (response.data && response.data.roles) {
      return response.data.roles;
    }
    return response.data || response;
  }
}