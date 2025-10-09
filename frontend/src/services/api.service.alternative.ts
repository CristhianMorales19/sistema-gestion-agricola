// Versión alternativa del ApiService usando require para axios
let axios: any;

try {
  // Intentar importar axios de diferentes maneras
  axios = require('axios');
  if (!axios.create && axios.default) {
    axios = axios.default;
  }
} catch (error) {
  console.error('Error al cargar axios con require:', error);
}

import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../config/auth0.config';

// Tipos para las respuestas de la API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiServiceAlternative {
  private axiosInstance: AxiosInstance;
  private getAccessToken: (() => Promise<string>) | null = null;

  constructor() {
    console.log('Inicializando ApiServiceAlternative...');
    console.log('Axios cargado:', axios);
    console.log('Tipo de axios:', typeof axios);
    
    if (!axios || typeof axios.create !== 'function') {
      throw new Error(`Axios no disponible. Tipo: ${typeof axios}, create: ${typeof axios?.create}`);
    }

    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setTokenProvider(getAccessToken: () => Promise<string>) {
    this.getAccessToken = getAccessToken;
  }

  private setupInterceptors() {
    // Interceptor de request para agregar el token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (this.getAccessToken) {
          try {
            const token = await this.getAccessToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Error al obtener token de acceso:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response para manejar errores
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        console.error('Error en la respuesta de la API:', error);
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, params?: Record<string, unknown>) {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error en GET:', error);
      throw error;
    }
  }

  async post(url: string, data?: Record<string, unknown>) {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Error en POST:', error);
      throw error;
    }
  }

  async put(url: string, data?: Record<string, unknown>) {
    try {
      const response = await this.axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error en PUT:', error);
      throw error;
    }
  }

  async delete(url: string) {
    try {
      const response = await this.axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error en DELETE:', error);
      throw error;
    }
  }
}

export { ApiServiceAlternative };