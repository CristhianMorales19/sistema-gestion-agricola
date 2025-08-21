import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    token: string;
    usuario: {
      id: number;
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
      empleado?: any;
    };
  };
}

interface VerifyResponse {
  message: string;
  user: {
    id: number;
    email: string;
    rol: string;
  };
}

export class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Interceptor para agregar token a las peticiones
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores de autenticación
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', credentials);
      
      // Guardar token y usuario en localStorage
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Llamar al endpoint de logout para invalidar el token
        await this.api.post('/auth/logout');
      }
    } catch (error) {
      // Continuar con el logout local incluso si falla el servidor
      console.error('Error al hacer logout en el servidor:', error);
    } finally {
      // Limpiar el estado local siempre
      this.clearLocalAuth();
    }
  }

  async verifyToken(): Promise<VerifyResponse | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await this.api.get<VerifyResponse>('/auth/verify');
      return response.data;
    } catch (error) {
      this.clearLocalAuth();
      return null;
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private clearLocalAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}