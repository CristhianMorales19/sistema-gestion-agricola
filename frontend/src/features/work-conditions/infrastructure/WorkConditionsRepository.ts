import { WorkCondition, CreateWorkConditionDTO, UpdateWorkConditionDTO } from '../domain/entities/WorkCondition';

/**
 * Interfaz para el cliente API de Condiciones de Trabajo
 * Esta será implementada con llamadas HTTP al backend
 */
export interface IWorkConditionsRepository {
  create(data: CreateWorkConditionDTO): Promise<WorkCondition>;
  getById(id: number): Promise<WorkCondition>;
  getByDate(fecha: string): Promise<WorkCondition | null>;
  getByMonth(month: number, year: number): Promise<WorkCondition[]>;
  getAll(): Promise<WorkCondition[]>;
  update(id: number, data: UpdateWorkConditionDTO): Promise<WorkCondition>;
  delete(id: number): Promise<void>;
}

/**
 * Implementación base del repositorio (para desarrollo local)
 * En producción, esto hará llamadas HTTP al backend
 */
export class WorkConditionsRepository implements IWorkConditionsRepository {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  private endpoint = '/work-conditions';

  constructor(private getAccessToken?: () => Promise<string>) {}

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.getAccessToken) {
      try {
        const token = await this.getAccessToken();
        (headers as any)['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.warn('Could not get access token:', error);
      }
    }

    return headers;
  }

  /**
   * Mapea los datos del servidor (snake_case) al formato esperado por el frontend (camelCase)
   */
  private mapFromServer(data: any): WorkCondition {
    return {
      id: data.condicion_id,
      fecha: data.fecha_at ? data.fecha_at.split('T')[0] : data.fecha,
      condicionGeneral: data.condicion_general || data.condicionGeneral,
      nivelDificultad: data.nivel_dificultad || data.nivelDificultad,
      observaciones: data.observaciones || data.observacion,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  /**
   * Mapea los datos del frontend (camelCase) al formato esperado por el servidor (snake_case)
   */
  private mapToServer(data: CreateWorkConditionDTO): any {
    return {
      fecha: data.fecha,
      condicionGeneral: data.condicionGeneral,
      nivelDificultad: data.nivelDificultad,
      observaciones: data.observaciones,
    };
  }

  async create(data: CreateWorkConditionDTO): Promise<WorkCondition> {
    try {
      const headers = await this.getHeaders();
      const payload = this.mapToServer(data);
      console.log('📤 Payload enviado al servidor:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error creating work condition: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('📥 Respuesta del servidor:', JSON.stringify(responseData, null, 2));
      
      // Mapear la respuesta del servidor al formato esperado por el frontend
      const mapped = this.mapFromServer(responseData.data || responseData);
      console.log('✅ Datos mapeados al frontend:', JSON.stringify(mapped, null, 2));
      return mapped;
    } catch (error) {
      console.error('Error creating work condition:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<WorkCondition> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error fetching work condition: ${response.statusText}`);
      }

      const responseData = await response.json();
      return this.mapFromServer(responseData.data || responseData);
    } catch (error) {
      console.error('Error fetching work condition:', error);
      throw error;
    }
  }

  async getByDate(fecha: string): Promise<WorkCondition | null> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${this.baseUrl}${this.endpoint}/date/${fecha}`,
        {
          headers,
        }
      );

      if (!response.ok && response.status !== 404) {
        throw new Error(`Error fetching work condition: ${response.statusText}`);
      }

      if (response.status === 404) {
        return null;
      }

      const responseData = await response.json();
      return this.mapFromServer(responseData.data || responseData);
    } catch (error) {
      console.error('Error fetching work condition:', error);
      throw error;
    }
  }

  async getByMonth(month: number, year: number): Promise<WorkCondition[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${this.baseUrl}${this.endpoint}/month/${year}/${month}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching work conditions: ${response.statusText}`);
      }

      const responseData = await response.json();
      const data = Array.isArray(responseData) ? responseData : (responseData.data || []);
      return data.map((item: any) => this.mapFromServer(item));
    } catch (error) {
      console.error('Error fetching work conditions:', error);
      throw error;
    }
  }

  async getAll(): Promise<WorkCondition[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error fetching work conditions: ${response.statusText}`);
      }

      const responseData = await response.json();
      const data = Array.isArray(responseData) ? responseData : (responseData.data || []);
      return data.map((item: any) => this.mapFromServer(item));
    } catch (error) {
      console.error('Error fetching work conditions:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateWorkConditionDTO): Promise<WorkCondition> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(this.mapToServer(data as any)),
      });

      if (!response.ok) {
        throw new Error(`Error updating work condition: ${response.statusText}`);
      }

      const responseData = await response.json();
      return this.mapFromServer(responseData.data || responseData);
    } catch (error) {
      console.error('Error updating work condition:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error deleting work condition: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting work condition:', error);
      throw error;
    }
  }
}
