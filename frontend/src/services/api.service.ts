import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../config/auth0.config';
import toast from 'react-hot-toast';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
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

class ApiService {
  private axiosInstance: AxiosInstance;
  private getAccessToken: (() => Promise<string>) | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Configurar el método para obtener el token
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
            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            console.error('Error al obtener el token:', error);
            // No agregar el token si hay error
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response para manejar errores globalmente
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError) {
    const response = error.response;
    
    if (!response) {
      toast.error('Error de conexión. Verifique su conexión a internet.');
      return;
    }

    switch (response.status) {
      case 401:
        toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        // Aquí podrías disparar un evento para hacer logout
        break;
      case 403:
        toast.error('No tiene permisos para realizar esta acción.');
        break;
      case 404:
        toast.error('Recurso no encontrado.');
        break;
      case 422:
        const validationErrors = (response.data as any)?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          validationErrors.forEach((err: string) => toast.error(err));
        } else {
          toast.error('Datos inválidos. Verifique la información ingresada.');
        }
        break;
      case 500:
        toast.error('Error interno del servidor. Intente nuevamente más tarde.');
        break;
      default:
        const message = (response.data as any)?.message || 'Error desconocido.';
        toast.error(message);
    }
  }

  // Métodos HTTP básicos
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data);
    return response.data;
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }

  // Métodos específicos para la API

  // Autenticación
  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.put('/auth/profile', data);
  }

  async updateLaborInfoEmployee(id: number, data: any) {
    return this.put(`/trabajadores/${id}`, data);
  }

  // Empleados
  async getEmpleados(params?: any): Promise<PaginatedResponse<any>> {
    const response = await this.axiosInstance.get('/trabajadores', { params });
    return response.data;
  }

  async getEmpleado(id: number) {
    return this.get(`/trabajadores/${id}`);
  }

  async createEmpleado(data: any) {
    return this.post('/trabajadores', data);
  }

  async updateEmpleado(id: number, data: any) {
    return this.put(`/trabajadores/${id}`, data);
  }

  async deleteEmpleado(id: number) {
    return this.delete(`/trabajadores/${id}`);
  }

  async createLaborInfo(trabajadorId: number, data: any): Promise<ApiResponse<any>> {
    return this.post(`/trabajadores/${trabajadorId}/info-laboral`, data);
  }

  // Asistencias
  async getAsistencias(params?: any): Promise<PaginatedResponse<any>> {
    const response = await this.axiosInstance.get('/asistencias', { params });
    return response.data;
  }

  async createAsistencia(data: any) {
    return this.post('/asistencias', data);
  }

  async updateAsistencia(id: number, data: any) {
    return this.put(`/asistencias/${id}`, data);
  }

  // Nóminas
  async getNominas(params?: any): Promise<PaginatedResponse<any>> {
    const response = await this.axiosInstance.get('/nominas', { params });
    return response.data;
  }

  async getNomina(id: number) {
    return this.get(`/nominas/${id}`);
  }

  async procesarNomina(data: any) {
    return this.post('/nominas/procesar', data);
  }

  async aprobarNomina(id: number) {
    return this.post(`/nominas/${id}/aprobar`);
  }

  // Productividad
  async getTareasProductividad(params?: any): Promise<PaginatedResponse<any>> {
    const response = await this.axiosInstance.get('/productividad/tareas', { params });
    return response.data;
  }

  async createTareaProductividad(data: any) {
    return this.post('/productividad/tareas', data);
  }

  async updateTareaProductividad(id: number, data: any) {
    return this.put(`/productividad/tareas/${id}`, data);
  }

  // Reportes
  async getReportes(tipo: string, params?: any) {
    return this.get(`/reportes/${tipo}`, params);
  }

  async generateReporte(tipo: string, filtros: any) {
    return this.post(`/reportes/${tipo}/generar`, filtros);
  }

  // Configuración
  async getConfiguracion() {
    return this.get('/configuracion');
  }

  async updateConfiguracion(data: any) {
    return this.put('/configuracion', data);
  }

  // Departamentos y Cargos
  async getDepartamentos() {
    return this.get('/departamentos');
  }

  async getCargos(departamentoId?: number) {
    const params = departamentoId ? { departamentoId } : undefined;
    return this.get('/cargos', params);
  }

  // Dashboard
  async getDashboardData() {
    return this.get('/dashboard');
  }

  async getEstadisticas(periodo?: string) {
    const params = periodo ? { periodo } : undefined;
    return this.get('/dashboard/estadisticas', params);
  }
}

// Instancia global del servicio
export const apiService = new ApiService();

export default apiService;
