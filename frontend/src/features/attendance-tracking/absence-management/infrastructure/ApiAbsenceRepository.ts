// src/absence-management/infrastructure/ApiAbsenceRepository.ts
import { AbsenceRepository } from '../domain/repositories/AbsenceRepository';
import { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  AbsenceFilters,
  AbsenceStats 
} from '../domain/entities/Absence';
import { apiService } from '../../../../services/api.service';

// Interfaces para las respuestas de la API
interface AbsencesListResponse {
  ausencias?: any[];
  [key: string]: any;
}

interface AbsenceItemResponse {
  ausencia?: any;
  data?: any;
  [key: string]: any;
}

interface StatsResponse {
  stats?: any;
  [key: string]: any;
}

interface ExistsResponse {
  exists?: boolean;
}

interface DocumentResponse {
  url?: string;
  documentacion_respaldo?: string;
}

/**
 * Implementación del repositorio de ausencias usando API REST
 */
export class ApiAbsenceRepository implements AbsenceRepository {
  private readonly baseUrl = '/ausencias';

  /**
   * Mapear respuesta de API a entidad Absence
   */
  private mapToAbsence(data: any): Absence {
    return {
      id: data.id || data.ausencia_id,
      trabajador_id: data.trabajador_id,
      trabajador_nombre: data.trabajador_nombre || data.nombre_trabajador,
      trabajador_documento: data.trabajador_documento || data.documento_trabajador,
      fecha_ausencia: data.fecha_ausencia,
      motivo: data.motivo,
      motivo_personalizado: data.motivo_personalizado,
      documentacion_respaldo: data.documentacion_respaldo,
      estado: data.estado || 'pendiente',
      supervisor_id: data.supervisor_id,
      supervisor_nombre: data.supervisor_nombre || data.nombre_supervisor,
      fecha_registro: data.fecha_registro || data.created_at,
      fecha_aprobacion: data.fecha_aprobacion,
      comentarios: data.comentarios,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  /**
   * Construir query string desde filtros
   */
  private buildQueryString(filters?: AbsenceFilters): string {
    if (!filters) return '';
    
    const params = new URLSearchParams();
    
    if (filters.trabajador_id) params.append('trabajador_id', filters.trabajador_id);
    if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.motivo) params.append('motivo', filters.motivo);
    
    return params.toString();
  }

  /**
   * Obtener todas las ausencias
   */
  async getAll(filters?: AbsenceFilters): Promise<Absence[]> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
      
      const response = await apiService.get<AbsencesListResponse>(url);
      
      if (response.data.ausencias) {
        return response.data.ausencias.map((item: any) => this.mapToAbsence(item));
      }
      
      if (Array.isArray(response.data)) {
        return (response.data as any[]).map((item: any) => this.mapToAbsence(item));
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching absences:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las ausencias');
    }
  }

  /**
   * Obtener ausencia por ID
   */
  async getById(id: string): Promise<Absence> {
    try {
      const response = await apiService.get<AbsenceItemResponse>(`${this.baseUrl}/${id}`);
      return this.mapToAbsence(response.data.ausencia || response.data);
    } catch (error: any) {
      console.error('Error fetching absence:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener la ausencia');
    }
  }

  /**
   * Obtener ausencias de un trabajador
   */
  async getByEmployeeId(trabajadorId: string): Promise<Absence[]> {
    try {
      const response = await apiService.get<AbsencesListResponse>(`${this.baseUrl}/trabajador/${trabajadorId}`);
      
      if (response.data.ausencias) {
        return response.data.ausencias.map((item: any) => this.mapToAbsence(item));
      }
      
      if (Array.isArray(response.data)) {
        return (response.data as any[]).map((item: any) => this.mapToAbsence(item));
      }
      
      return [];
    } catch (error: any) {
      console.error('Error fetching employee absences:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener las ausencias del trabajador');
    }
  }

  /**
   * Crear nueva ausencia
   */
  async create(data: CreateAbsenceData): Promise<Absence> {
    try {
      const response = await apiService.post<AbsenceItemResponse>(this.baseUrl, data as any);
      return this.mapToAbsence(response.data.ausencia || response.data.data || response.data);
    } catch (error: any) {
      console.error('Error creating absence:', error);
      const message = error.response?.data?.message || 'Error al crear la ausencia';
      throw new Error(message);
    }
  }

  /**
   * Actualizar ausencia
   */
  async update(id: string, data: UpdateAbsenceData): Promise<Absence> {
    try {
      const response = await apiService.put<AbsenceItemResponse>(`${this.baseUrl}/${id}`, data as any);
      return this.mapToAbsence(response.data.ausencia || response.data.data || response.data);
    } catch (error: any) {
      console.error('Error updating absence:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar la ausencia');
    }
  }

  /**
   * Eliminar ausencia
   */
  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Error deleting absence:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar la ausencia');
    }
  }

  /**
   * Aprobar ausencia
   */
  async approve(id: string, supervisorId: number, comentarios?: string): Promise<Absence> {
    try {
      const response = await apiService.post<AbsenceItemResponse>(`${this.baseUrl}/${id}/aprobar`, {
        supervisor_id: supervisorId,
        comentarios
      });
      return this.mapToAbsence(response.data.ausencia || response.data.data || response.data);
    } catch (error: any) {
      console.error('Error approving absence:', error);
      throw new Error(error.response?.data?.message || 'Error al aprobar la ausencia');
    }
  }

  /**
   * Rechazar ausencia
   */
  async reject(id: string, supervisorId: number, comentarios?: string): Promise<Absence> {
    try {
      const response = await apiService.post<AbsenceItemResponse>(`${this.baseUrl}/${id}/rechazar`, {
        supervisor_id: supervisorId,
        comentarios
      });
      return this.mapToAbsence(response.data.ausencia || response.data.data || response.data);
    } catch (error: any) {
      console.error('Error rejecting absence:', error);
      throw new Error(error.response?.data?.message || 'Error al rechazar la ausencia');
    }
  }

  /**
   * Obtener estadísticas
   */
  async getStats(filters?: AbsenceFilters): Promise<AbsenceStats> {
    try {
      const queryString = this.buildQueryString(filters);
      const url = queryString ? `${this.baseUrl}/estadisticas?${queryString}` : `${this.baseUrl}/estadisticas`;
      
      const response = await apiService.get<StatsResponse>(url);
      return response.data.stats || response.data as any;
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }

  /**
   * Verificar si existe ausencia para una fecha
   */
  async existsForDate(trabajadorId: string, fecha: string): Promise<boolean> {
    try {
      const response = await apiService.get<ExistsResponse>(`${this.baseUrl}/verificar`, {
        params: {
          trabajador_id: trabajadorId,
          fecha_ausencia: fecha
        }
      } as any);
      return response.data.exists || false;
    } catch (error: any) {
      console.error('Error checking absence existence:', error);
      return false;
    }
  }

  /**
   * Subir documento de respaldo
   */
  async uploadDocument(absenceId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('documento', file);
      
      const response = await apiService.post<DocumentResponse>(
        `${this.baseUrl}/${absenceId}/documento`,
        formData as any
      );
      
      return response.data.url || response.data.documentacion_respaldo || '';
    } catch (error: any) {
      console.error('Error uploading document:', error);
      throw new Error(error.response?.data?.message || 'Error al subir el documento');
    }
  }
}
