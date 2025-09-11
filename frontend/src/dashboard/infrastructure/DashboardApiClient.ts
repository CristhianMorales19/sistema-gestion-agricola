import { useAuth0 } from '@auth0/auth0-react';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Tipos para las respuestas de la API
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: {
    estadisticas: {
      trabajadores: { valor: number; cambio: string; tendencia: string };
      usuarios: { valor: number; cambio: string; tendencia: string };
      roles: { valor: number; cambio: string; tendencia: string };
      permisos: { valor: number; cambio: string; tendencia: string };
      alertas: { valor: number; cambio: string; tendencia: string };
    };
    actividadReciente: Array<{
      id: string;
      tipo: string;
      mensaje: string;
      timestamp: string;
      prioridad: string;
    }>;
    condicionesClimaticas: {
      temperatura: string;
      humedad: string;
      lluvia: string;
      viento: string;
      ubicacion: string;
      ultimaActualizacion: string;
    };
    permisos: {
      nivel: string;
      total: number;
    };
    timestamp: string;
  };
}

export interface ClimaApiResponse {
  success: boolean;
  message: string;
  data: {
    temperatura: string;
    humedad: string;
    precipitacion: string;
    velocidadViento: string;
    presion: string;
    visibilidad: string;
    indiceUV: string;
    estacion: string;
    coordenadas: {
      latitud: number;
      longitud: number;
    };
    pronostico: Array<{
      dia: string;
      temp_max: number;
      temp_min: number;
      condicion: string;
    }>;
    ultimaActualizacion: string;
  };
}

export interface StatsRealTimeApiResponse {
  success: boolean;
  message: string;
  data: {
    trabajadoresPresentes: number;
    maquinariaActiva: number;
    sistemasRiego: {
      activos: number;
      programados: number;
    };
    alertasNuevas: number;
    ultimaActualizacion: string;
  };
}

export class DashboardApiClient {
  private getAuthToken: () => Promise<string>;

  constructor(getAccessToken: () => Promise<string>) {
    this.getAuthToken = getAccessToken;
  }

  /**
   * Obtener datos generales del dashboard
   */
  async getDashboardData(): Promise<DashboardApiResponse> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/agromano/dashboard/general`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo datos del dashboard');
      }

      return data;
    } catch (error) {
      console.error('Error en getDashboardData:', error);
      throw new Error(`Error conectando con el servidor: ${(error as Error).message}`);
    }
  }

  /**
   * Obtener condiciones climáticas
   */
  async getClimateData(): Promise<ClimaApiResponse> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/agromano/dashboard/clima`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo datos climáticos');
      }

      return data;
    } catch (error) {
      console.error('Error en getClimateData:', error);
      throw new Error(`Error obteniendo clima: ${(error as Error).message}`);
    }
  }

  /**
   * Obtener estadísticas en tiempo real
   */
  async getRealTimeStats(): Promise<StatsRealTimeApiResponse> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/agromano/dashboard/stats/tiempo-real`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo estadísticas en tiempo real');
      }

      return data;
    } catch (error) {
      console.error('Error en getRealTimeStats:', error);
      throw new Error(`Error obteniendo stats: ${(error as Error).message}`);
    }
  }
}

/**
 * Hook personalizado para usar el cliente de Dashboard API
 */
export const useDashboardApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  
  const dashboardClient = new DashboardApiClient(getAccessTokenSilently);
  
  return {
    getDashboardData: () => dashboardClient.getDashboardData(),
    getClimateData: () => dashboardClient.getClimateData(),
    getRealTimeStats: () => dashboardClient.getRealTimeStats(),
  };
};
