import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../config/auth0.config';
<<<<<<< HEAD
import toast from 'react-hot-toast';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
=======

// Tipos para las respuestas de la API
export interface ApiResponse<T = unknown> {
>>>>>>> 5a7c7fa (Primer commit)
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
<<<<<<< HEAD
      toast.error('Error de conexión. Verifique su conexión a internet.');
=======
      console.error('Error de conexión. Verifique su conexión a internet.');
>>>>>>> 5a7c7fa (Primer commit)
      return;
    }

    switch (response.status) {
      case 401:
<<<<<<< HEAD
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
=======
        console.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        // Aquí podrías disparar un evento para hacer logout
        break;
      case 403:
        console.error('No tiene permisos para realizar esta acción.');
        break;
      case 404:
        console.error('Recurso no encontrado.');
        break;
      case 422:
        const validationErrors = response.data && typeof response.data === 'object' && 'errors' in response.data ? response.data.errors : null;
        if (validationErrors && Array.isArray(validationErrors)) {
          validationErrors.forEach((err: string) => console.error(err));
        } else {
          console.error('Datos inválidos. Verifique la información ingresada.');
        }
        break;
      case 500:
        console.error('Error interno del servidor. Intente nuevamente más tarde.');
        break;
      default:
        const message = response.data && typeof response.data === 'object' && 'message' in response.data && typeof response.data.message === 'string' ? response.data.message : 'Error desconocido.';
        console.error(message);
>>>>>>> 5a7c7fa (Primer commit)
    }
  }

  // Métodos HTTP básicos
<<<<<<< HEAD
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
=======
  async get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }

<<<<<<< HEAD
  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
=======
  async post<T = unknown>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

<<<<<<< HEAD
  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
=======
  async put<T = unknown>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.put(url, data);
    return response.data;
  }

<<<<<<< HEAD
  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
=======
  async patch<T = unknown>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.patch(url, data);
    return response.data;
  }

<<<<<<< HEAD
  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
=======
  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }

  // Métodos específicos para la API

  // Autenticación
  async getProfile() {
    return this.get('/auth/profile');
  }

<<<<<<< HEAD
  async updateProfile(data: any) {
    return this.put('/auth/profile', data);
  }

  async updateLaborInfoEmployee(id: number, data: any) {
=======
  async updateProfile(data: Record<string, unknown>) {
    return this.put('/auth/profile', data);
  }

  async updateLaborInfoEmployee(id: number, data: Record<string, unknown>) {
>>>>>>> 5a7c7fa (Primer commit)
    return this.put(`/trabajadores/${id}`, data);
  }

  // Empleados
<<<<<<< HEAD
  async getEmpleados(params?: any): Promise<PaginatedResponse<any>> {
=======
  async getEmpleados(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.get('/trabajadores', { params });
    return response.data;
  }

  async getEmpleado(id: number) {
    return this.get(`/trabajadores/${id}`);
  }

<<<<<<< HEAD
  async createEmpleado(data: any) {
    return this.post('/trabajadores', data);
  }

  async updateEmpleado(id: number, data: any) {
=======
  async createEmpleado(data: Record<string, unknown>) {
    return this.post('/trabajadores', data);
  }

  async updateEmpleado(id: number, data: Record<string, unknown>) {
>>>>>>> 5a7c7fa (Primer commit)
    return this.put(`/trabajadores/${id}`, data);
  }

  async deleteEmpleado(id: number) {
    return this.delete(`/trabajadores/${id}`);
  }

<<<<<<< HEAD
  async createLaborInfo(trabajadorId: number, data: any): Promise<ApiResponse<any>> {
=======
  async createLaborInfo(trabajadorId: number, data: Record<string, unknown>): Promise<ApiResponse<unknown>> {
>>>>>>> 5a7c7fa (Primer commit)
    return this.post(`/trabajadores/${trabajadorId}/info-laboral`, data);
  }

  // Asistencias
<<<<<<< HEAD
  async getAsistencias(params?: any): Promise<PaginatedResponse<any>> {
=======
  async getAsistencias(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.get('/asistencias', { params });
    return response.data;
  }

<<<<<<< HEAD
  async createAsistencia(data: any) {
    return this.post('/asistencias', data);
  }

  async updateAsistencia(id: number, data: any) {
    return this.put(`/asistencias/${id}`, data);
  }

  // Nóminas
  async getNominas(params?: any): Promise<PaginatedResponse<any>> {
=======
  async createAsistencia(data: Record<string, unknown>) {
    return this.post('/asistencias', data);
  }

  async updateAsistencia(id: number, data: Record<string, unknown>) {
    return this.put(`/asistencias/${id}`, data);
  }

  // Cuadrillas
  async getCuadrillas(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
    const response = await this.axiosInstance.get('/cuadrillas', { params });
    return response.data;
  }

  // Nóminas
  async getNominas(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.get('/nominas', { params });
    return response.data;
  }

  async getNomina(id: number) {
    return this.get(`/nominas/${id}`);
  }

<<<<<<< HEAD
  async procesarNomina(data: any) {
=======
  async procesarNomina(data: Record<string, unknown>) {
>>>>>>> 5a7c7fa (Primer commit)
    return this.post('/nominas/procesar', data);
  }

  async aprobarNomina(id: number) {
    return this.post(`/nominas/${id}/aprobar`);
  }

  // Productividad
<<<<<<< HEAD
  async getTareasProductividad(params?: any): Promise<PaginatedResponse<any>> {
=======
  async getTareasProductividad(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
>>>>>>> 5a7c7fa (Primer commit)
    const response = await this.axiosInstance.get('/productividad/tareas', { params });
    return response.data;
  }

<<<<<<< HEAD
  async createTareaProductividad(data: any) {
    return this.post('/productividad/tareas', data);
  }

  async updateTareaProductividad(id: number, data: any) {
=======
  async createTareaProductividad(data: Record<string, unknown>) {
    return this.post('/productividad/tareas', data);
  }

  async updateTareaProductividad(id: number, data: Record<string, unknown>) {
>>>>>>> 5a7c7fa (Primer commit)
    return this.put(`/productividad/tareas/${id}`, data);
  }

  // Reportes
<<<<<<< HEAD
  async getReportes(tipo: string, params?: any) {
    return this.get(`/reportes/${tipo}`, params);
  }

  async generateReporte(tipo: string, filtros: any) {
=======
  async getReportes(tipo: string, params?: Record<string, unknown>) {
    return this.get(`/reportes/${tipo}`, params);
  }

  async generateReporte(tipo: string, filtros: Record<string, unknown>) {
>>>>>>> 5a7c7fa (Primer commit)
    return this.post(`/reportes/${tipo}/generar`, filtros);
  }

  // Configuración
  async getConfiguracion() {
    return this.get('/configuracion');
  }

<<<<<<< HEAD
  async updateConfiguracion(data: any) {
=======
  async updateConfiguracion(data: Record<string, unknown>) {
>>>>>>> 5a7c7fa (Primer commit)
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

<<<<<<< HEAD
export default apiService;
=======
export default apiService;
>>>>>>> 5a7c7fa (Primer commit)
