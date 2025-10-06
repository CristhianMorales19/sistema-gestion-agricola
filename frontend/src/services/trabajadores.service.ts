/**
 * Servicio para gestión de trabajadores
 * Conecta con los endpoints del backend que manejan mom_trabajador
 */

export interface Trabajador {
  trabajador_id: number;
  documento_identidad: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  telefono?: string;
  email?: string;
  fecha_ingreso?: string;
  estado: 'activo' | 'inactivo';
  cargo?: string;
  departamento?: string;
  created_at: Date;
  updated_at?: Date;
  
  // Relación con usuario del sistema
  usuario?: {
    usuario_id: number;
    auth0_id: string;
    username: string;
    email: string;
    estado: string;
    rol?: {
      rol_id: number;
      codigo: string;
      nombre: string;
    };
  } | null;
}

export interface CreateTrabajadorData {
  documento_identidad: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  telefono?: string;
  email?: string;
  fecha_ingreso?: string;
  cargo?: string;
  departamento?: string;
}

export interface UpdateTrabajadorData {
  nombre_completo?: string;
  telefono?: string;
  email?: string;
  cargo?: string;
  departamento?: string;
  estado?: 'activo' | 'inactivo';
}

export interface TrabajadorListResponse {
  success: boolean;
  data: Trabajador[];
  total: number;
  page: number;
  limit: number;
}

export interface InvitarAuth0Response {
  success: boolean;
  message: string;
  data: {
    auth0_user_id: string;
    email: string;
    ticket_url?: string;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export class TrabajadoresService {
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
   * Obtener lista de trabajadores
   * @param filters - Filtros opcionales (buscar, estado, conUsuario)
   */
  async getTrabajadores(filters?: {
    buscar?: string;
    estado?: 'activo' | 'inactivo';
    conUsuario?: boolean;
    page?: number;
    limit?: number;
  }): Promise<TrabajadorListResponse> {
    const searchParams = new URLSearchParams();
    
    if (filters?.buscar) searchParams.append('buscar', filters.buscar);
    if (filters?.estado) searchParams.append('estado', filters.estado);
    if (filters?.conUsuario !== undefined) searchParams.append('conUsuario', filters.conUsuario.toString());
    if (filters?.page) searchParams.append('page', filters.page.toString());
    if (filters?.limit) searchParams.append('limit', filters.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/trabajadores${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TrabajadorListResponse>(endpoint);
  }

  /**
   * Obtener un trabajador por ID
   */
  async getTrabajadorById(id: number): Promise<{ success: boolean; data: Trabajador }> {
    return this.request<{ success: boolean; data: Trabajador }>(`/trabajadores/${id}`);
  }

  /**
   * Crear nuevo trabajador (solo datos personales)
   * El trabajador se crea en mom_trabajador pero NO tiene usuario todavía
   */
  async crearTrabajador(data: CreateTrabajadorData): Promise<{ success: boolean; data: Trabajador; message: string }> {
    return this.request<{ success: boolean; data: Trabajador; message: string }>('/trabajadores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Actualizar datos de trabajador
   */
  async actualizarTrabajador(
    id: number, 
    data: UpdateTrabajadorData
  ): Promise<{ success: boolean; data: Trabajador; message: string }> {
    return this.request<{ success: boolean; data: Trabajador; message: string }>(`/trabajadores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Invitar trabajador a Auth0
   * Crea usuario en Auth0 y envía email con link para crear contraseña
   */
  async invitarAuth0(
    trabajadorId: number
  ): Promise<InvitarAuth0Response> {
    return this.request<InvitarAuth0Response>(`/trabajadores/${trabajadorId}/invitar-auth0`, {
      method: 'POST',
    });
  }

  /**
   * Vincular trabajador con usuario del sistema
   * Usado después del primer login para conectar mom_trabajador con mot_usuario
   */
  async vincularUsuario(
    trabajadorId: number,
    usuarioId: number
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/trabajadores/${trabajadorId}/vincular-usuario`,
      {
        method: 'PUT',
        body: JSON.stringify({ usuario_id: usuarioId }),
      }
    );
  }

  /**
   * Eliminar trabajador (soft delete)
   */
  async eliminarTrabajador(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/trabajadores/${id}`, {
      method: 'DELETE',
    });
  }
}

export default TrabajadoresService;
