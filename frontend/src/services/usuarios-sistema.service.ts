/**
 * Servicio para gestión de usuarios del sistema
 * Conecta con los endpoints del backend que manejan mot_usuario y mom_rol
 * (NO roles de Auth0, sino roles locales de la BD remota)
 */

export interface CrearUsuarioHibridoData {
  email: string;
  nombre: string;
  password: string;
  rol_id: number;
  telefono?: string;
  documento_identidad?: string;
}

export interface UsuarioHibridoCreado {
  usuario_id: number;
  username: string;
  email: string;
  auth0_id: string;
  estado: string;
  rol: {
    rol_id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
  };
  trabajador?: {
    trabajador_id: number;
    documento_identidad: string;
    nombre_completo: string;
  } | null;
  created_at: string;
}

export interface RolDisponible {
  rol_id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  is_critico: boolean;
  usuarios_asignados?: number;
  permisos?: Permiso[];
}

export interface Permiso {
  permiso_id: number;
  codigo: string;
  nombre: string;
  categoria: string | null;
  descripcion?: string | null;
}

export interface UsuarioSistema {
  usuario_id: number;
  auth0_id: string;
  username: string;
  email: string;
  estado: 'activo' | 'inactivo' | 'ACTIVO' | 'INACTIVO';
  auth_provider: string | null;
  email_verified: boolean | null;
  last_login_at: Date | null;
  
  // Rol local (mom_rol)
  rol: {
    rol_id: number;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    is_critico: boolean;
  };
  
  // Permisos del rol
  permisos?: Permiso[];
  
  // Datos del trabajador vinculado (si existe)
  trabajador: {
    trabajador_id: number;
    documento_identidad: string;
    nombre_completo: string;
    email: string | null;
  } | null;
  
  created_at: Date;
  updated_at: Date | null;
}

export interface UsuariosSistemaFilters {
  buscar?: string;
  estado?: 'activo' | 'inactivo' | 'ACTIVO' | 'INACTIVO';
  rol_id?: number;
}

export interface RolesDisponiblesResponse {
  success: boolean;
  data: RolDisponible[];
}

export interface UsuariosListResponse {
  success: boolean;
  data: UsuarioSistema[];
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class UsuariosSistemaService {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de usuarios del sistema
   * @param filters - Filtros opcionales (buscar, estado, rol_id)
   */
  async getUsuarios(filters?: UsuariosSistemaFilters): Promise<UsuariosListResponse> {
    const searchParams = new URLSearchParams();
    
    if (filters?.buscar) searchParams.append('buscar', filters.buscar);
    if (filters?.estado) searchParams.append('estado', filters.estado);
    if (filters?.rol_id) searchParams.append('rol_id', filters.rol_id.toString());

    const queryString = searchParams.toString();
    const endpoint = `/usuarios-sistema${queryString ? `?${queryString}` : ''}`;
    
    return this.request<UsuariosListResponse>(endpoint);
  }

  /**
   * Obtener detalles completos de un usuario
   */
  async getUsuarioById(id: number): Promise<{ success: boolean; data: UsuarioSistema }> {
    return this.request<{ success: boolean; data: UsuarioSistema }>(`/usuarios-sistema/${id}`);
  }

  /**
   * Obtener lista de roles disponibles en el sistema
   * Roles de la BD remota (mom_rol): ADMIN_AGROMANO, GERENTE_RRHH, etc.
   */
  async getRolesDisponibles(): Promise<RolesDisponiblesResponse> {
    return this.request<RolesDisponiblesResponse>('/usuarios-sistema/roles-disponibles');
  }

  /**
   * Asignar rol a un usuario
   * Actualiza mot_usuario.rol_id en la BD remota
   */
  async asignarRol(
    usuarioId: number,
    rolId: number
  ): Promise<{ 
    success: boolean; 
    message: string; 
    data: {
      usuario_id: number;
      username: string;
      rol_anterior: string;
      rol_nuevo: string;
    }
  }> {
    return this.request(`/usuarios-sistema/${usuarioId}/asignar-rol`, {
      method: 'PUT',
      body: JSON.stringify({ rol_id: rolId }),
    });
  }

  /**
   * Cambiar estado de un usuario (activar/desactivar)
   */
  async cambiarEstado(
    usuarioId: number,
    estado: 'activo' | 'inactivo' | 'ACTIVO' | 'INACTIVO'
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/usuarios-sistema/${usuarioId}/cambiar-estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  }

  /**
   * Crear usuario híbrido (Auth0 + BD remota)
   */
  async crearUsuarioHibrido(
    datos: CrearUsuarioHibridoData
  ): Promise<{ 
    success: boolean; 
    message: string; 
    data: UsuarioHibridoCreado;
  }> {
    return this.request('/usuarios-sistema/crear-hibrido', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  }

  /**
   * Sincronizar usuarios de Auth0 con BD local
   * (Normalmente no es necesario porque la sincronización es automática en cada login)
   */
  async sincronizarAuth0(): Promise<{ success: boolean; message: string; nota: string }> {
    return this.request('/usuarios-sistema/sincronizar-auth0', {
      method: 'POST',
    });
  }
}

export default UsuariosSistemaService;
