import { Parcel, CreateParcelDTO, UpdateParcelDTO } from '../domain/entities/Parcel';

/**
 * Interfaz para el cliente API de Parcelas
 */
export interface IParcelRepository {
  create(data: CreateParcelDTO): Promise<Parcel>;
  getById(id: number): Promise<Parcel>;
  getAll(activas?: boolean): Promise<Parcel[]>;
  search(query: string): Promise<Parcel[]>;
  update(id: number, data: UpdateParcelDTO): Promise<Parcel>;
  delete(id: number): Promise<void>;
}

/**
 * Implementación del repositorio de Parcelas
 * Hace llamadas HTTP al backend
 */
export class ParcelRepository implements IParcelRepository {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  private endpoint = '/parcelas';

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
  private mapFromServer(data: any): Parcel {
    return {
      id: data.parcela_id,
      nombre: data.nombre,
      ubicacionDescripcion: data.ubicacion_descripcion,
      areaHectareas: data.area_hectareas ? Number(data.area_hectareas) : 0,
      tipoTerreno: data.tipo_terreno,
      tipoTerrenoOtro: data.tipo_terreno_otro,
      tipoTerrenoEfectivo: data.tipo_terreno_efectivo,
      descripcion: data.descripcion,
      observaciones: data.observaciones,
      estado: data.estado,
      isActiva: data.is_activa,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  /**
   * Mapea los datos del frontend (camelCase) al formato esperado por el servidor
   */
  private mapToServer(data: CreateParcelDTO | UpdateParcelDTO): any {
    return {
      nombre: (data as any).nombre,
      ubicacionDescripcion: (data as any).ubicacionDescripcion,
      areaHectareas: (data as any).areaHectareas,
      tipoTerreno: (data as any).tipoTerreno,
      tipoTerrenoOtro: (data as any).tipoTerrenoOtro,
      descripcion: (data as any).descripcion,
      observaciones: (data as any).observaciones,
      estado: (data as any).estado,
    };
  }

  async create(data: CreateParcelDTO): Promise<Parcel> {
    try {
      const headers = await this.getHeaders();
      const payload = this.mapToServer(data);
      console.log('📤 Payload enviado al servidor:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error creating parcel: ${response.statusText}`);
      }

      console.log('📥 Respuesta del servidor:', JSON.stringify(responseData, null, 2));
      
      const mapped = this.mapFromServer(responseData.data || responseData);
      console.log('✅ Datos mapeados al frontend:', JSON.stringify(mapped, null, 2));
      return mapped;
    } catch (error) {
      console.error('Error creating parcel:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Parcel> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error fetching parcel: ${response.statusText}`);
      }

      return this.mapFromServer(responseData.data || responseData);
    } catch (error) {
      console.error('Error fetching parcel:', error);
      throw error;
    }
  }

  async getAll(activas?: boolean): Promise<Parcel[]> {
    try {
      const headers = await this.getHeaders();
      const url = activas !== undefined
        ? `${this.baseUrl}${this.endpoint}?activas=${activas}`
        : `${this.baseUrl}${this.endpoint}`;

      const response = await fetch(url, {
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error fetching parcels: ${response.statusText}`);
      }

      const data = Array.isArray(responseData) ? responseData : (responseData.data || []);
      return data.map((item: any) => this.mapFromServer(item));
    } catch (error) {
      console.error('Error fetching parcels:', error);
      throw error;
    }
  }

  async search(query: string): Promise<Parcel[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(
        `${this.baseUrl}${this.endpoint}/search/${encodeURIComponent(query)}`,
        {
          headers,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error searching parcels: ${response.statusText}`);
      }

      const data = Array.isArray(responseData) ? responseData : (responseData.data || []);
      return data.map((item: any) => this.mapFromServer(item));
    } catch (error) {
      console.error('Error searching parcels:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateParcelDTO): Promise<Parcel> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(this.mapToServer(data)),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Error updating parcel: ${response.statusText}`);
      }

      return this.mapFromServer(responseData.data || responseData);
    } catch (error) {
      console.error('Error updating parcel:', error);
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
        const responseData = await response.json();
        throw new Error(responseData.message || `Error deleting parcel: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting parcel:', error);
      throw error;
    }
  }
}
