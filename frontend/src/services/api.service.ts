import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { apiConfig } from "../config/auth0.config";

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

class ApiService {
  private axiosInstance: AxiosInstance;
  private getAccessToken: (() => Promise<string>) | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: {
        "Content-Type": "application/json",
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
            console.error("Error al obtener el token:", error);
            // No agregar el token si hay error
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Interceptor de response para manejar errores globalmente
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  private handleError(error: AxiosError) {
    const response = error.response;

    if (!response) {
      console.error("Error de conexión. Verifique su conexión a internet.");
      return;
    }

    switch (response.status) {
      case 401:
        console.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        // Aquí podrías disparar un evento para hacer logout
        break;
      case 403:
        console.error("No tiene permisos para realizar esta acción.");
        break;
      case 404:
        console.error("Recurso no encontrado.");
        break;
      case 422:
        const validationErrors =
          response.data &&
          typeof response.data === "object" &&
          "errors" in response.data
            ? response.data.errors
            : null;
        if (validationErrors && Array.isArray(validationErrors)) {
          validationErrors.forEach((err: string) => console.error(err));
        } else {
          console.error("Datos inválidos. Verifique la información ingresada.");
        }
        break;
      case 500:
        console.error(
          "Error interno del servidor. Intente nuevamente más tarde.",
        );
        break;
      default:
        const message =
          response.data &&
          typeof response.data === "object" &&
          "message" in response.data &&
          typeof response.data.message === "string"
            ? response.data.message
            : "Error desconocido.";
        console.error(message);
    }
  }

  // Métodos HTTP básicos
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }

  async post<T = unknown>(
    url: string,
    data?: Record<string, unknown> | FormData,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  async postFormData<T = unknown>(
    url: string,
    formData: FormData,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data);
    return response.data;
  }

  async patch<T = unknown, D = any>(
    url: string,
    data?: D,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T = unknown>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }

  // Métodos específicos para la API

  // Autenticación
  async getProfile() {
    return this.get("/auth/profile");
  }

  async updateProfile(data: Record<string, unknown>) {
    return this.put("/auth/profile", data);
  }

  // async updateLaborInfoEmployee(id: number, data: Record<string, unknown>) {
  //   return this.put(`/trabajadores/${id}`, data);
  // }

  // // Empleados
  // async getEmpleados(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
  //   const response = await this.axiosInstance.get('/trabajadores', { params });
  //   return response.data;
  // }

  // async getEmpleado(id: number) {
  //   return this.get(`/trabajadores/${id}`);
  // }

  // async createEmpleado(data: Record<string, unknown>) {
  //   return this.post('/trabajadores', data);
  // }

  // async updateEmpleado(id: number, data: Record<string, unknown>) {
  //   return this.put(`/trabajadores/${id}`, data);
  // }

  // async deleteEmpleado(id: number) {
  //   return this.delete(`/trabajadores/${id}`);
  // }

  // async createLaborInfo(trabajadorId: number, data: Record<string, unknown>): Promise<ApiResponse<unknown>> {
  //   return this.post(`/trabajadores/${trabajadorId}/info-laboral`, data);
  // }

  // Asistencias
  async getAsistencias(
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<unknown>> {
    const response = await this.axiosInstance.get("/asistencias", { params });
    return response.data;
  }

  async createAsistencia(data: Record<string, unknown>) {
    return this.post("/asistencias", data);
  }

  async updateAsistencia(id: number, data: Record<string, unknown>) {
    return this.put(`/asistencias/${id}`, data);
  }

  // Nóminas
  async getNominas(
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<unknown>> {
    const response = await this.axiosInstance.get("/nominas", { params });
    return response.data;
  }

  async getNomina(id: number) {
    return this.get(`/nominas/${id}`);
  }

  async procesarNomina(data: Record<string, unknown>) {
    return this.post("/nominas/procesar", data);
  }

  async aprobarNomina(id: number) {
    return this.post(`/nominas/${id}/aprobar`);
  }

  // Productividad
  async getTareasProductividad(
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<unknown>> {
    const response = await this.axiosInstance.get("/productividad/tareas", {
      params,
    });
    return response.data;
  }

  async createTareaProductividad(data: Record<string, unknown>) {
    return this.post("/productividad/tareas", data);
  }

  async updateTareaProductividad(id: number, data: Record<string, unknown>) {
    return this.put(`/productividad/tareas/${id}`, data);
  }

  // Reportes
  async getReportes(tipo: string, params?: Record<string, unknown>) {
    return this.get(`/reportes/${tipo}`, params);
  }

  async generateReporte(tipo: string, filtros: Record<string, unknown>) {
    return this.post(`/reportes/${tipo}/generar`, filtros);
  }

  // Configuración
  async getConfiguracion() {
    return this.get("/configuracion");
  }

  async updateConfiguracion(data: Record<string, unknown>) {
    return this.put("/configuracion", data);
  }

  // Departamentos y Cargos
  async getDepartamentos() {
    return this.get("/departamentos");
  }

  async getCargos(departamentoId?: number) {
    const params = departamentoId ? { departamentoId } : undefined;
    return this.get("/cargos", params);
  }

  // Dashboard
  async getDashboardData() {
    return this.get("/dashboard");
  }

  async getEstadisticas(periodo?: string) {
    const params = periodo ? { periodo } : undefined;
    return this.get("/dashboard/estadisticas", params);
  }
}

// Instancia global del servicio
export const apiService = new ApiService();

export default apiService;
