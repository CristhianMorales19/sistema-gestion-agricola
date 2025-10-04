// src/employee-management/infrastructure/ApiEmployeeRepository.ts
import { EmployeeRepository } from '../domain/repositories/EmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData, CreateLaborInfoResponse } from '../domain/entities/Employee';
import { apiService } from '../../services/api.service';

// Definir interfaces para las respuestas de la API
interface ApiTrabajadorResponse {
  id: string | number;
  trabajador_id?: number;
  nombre_completo: string;
  name?: string;
  documento_identidad: string;
  identification?: string;
  cargo?: string;
  department?: string;
  fecha_registro_at: string;
  hireDate?: string;
  is_activo?: boolean;
  status?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
  fecha_nacimiento?: string;
  deleted_at?: string;
}

interface ApiTrabajadoresListResponse {
  trabajadores: ApiTrabajadorResponse[];
  [key: string]: any;
}

interface ApiTrabajadorDetailResponse extends ApiTrabajadorResponse {
  [key: string]: any;
}

interface ApiCreateTrabajadorResponse {
  success: boolean;
  message?: string;
  data: {
    trabajador: ApiTrabajadorResponse;
  };
}

// Helper function to normalize status
const normalizeStatus = (status?: string, isActivo?: boolean): 'activo' | 'inactivo' => {
  if (status) {
    const normalized = status.toLowerCase();
    if (normalized === 'active' || normalized === 'activo') return 'activo';
    if (normalized === 'inactive' || normalized === 'inactivo') return 'inactivo';
  }
  return isActivo ? 'activo' : 'inactivo';
};

export class ApiEmployeeRepository implements EmployeeRepository {

  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiService.get('/trabajadores');

    console.log('Trabajadores:', (response.data as ApiTrabajadoresListResponse)?.trabajadores);
    
    const trabajadores = (response.data as ApiTrabajadoresListResponse)?.trabajadores || [];

    return trabajadores.map((item: ApiTrabajadorResponse) => ({
      id: item.id?.toString() || item.trabajador_id?.toString() || '',
      name: item.name || item.nombre_completo,
      identification: item.identification || item.documento_identidad,
      position: item.cargo || 'Sin definir',
      cargo: item.cargo || 'Sin definir',
      department: item.department || 'Sin definir',
      hireDate: new Date(item.hireDate || item.fecha_registro_at),
      status: normalizeStatus(item.status, item.is_activo),
      email: item.email,
      phone: item.telefono,
      createdAt: new Date(item.createdAt || item.created_at),
      updatedAt: new Date(item.updatedAt || item.updated_at),
    }));
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const response = await apiService.get(`/trabajadores/${id}`);
    const data = response.data as ApiTrabajadorDetailResponse;
    return {
      id: data.id?.toString() || '',
      name: data.name || data.nombre_completo,
      identification: data.identification || data.documento_identidad,
      position: data.cargo || 'Sin definir',
      cargo: data.cargo,
      department: data.department,
      hireDate: new Date(data.hireDate || data.fecha_registro_at),
      status: normalizeStatus(data.status, data.is_activo),
      email: data.email,
      phone: data.phone || data.telefono,
      createdAt: new Date(data.createdAt || data.created_at),
      updatedAt: new Date(data.updatedAt || data.updated_at),
    } as Employee;
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    console.log('Datos a enviar:', data);

    const cleanedData = {
      ...data,
      fecha_nacimiento: new Date(data.fecha_nacimiento).toISOString(),
      fecha_registro_at: new Date(data.fecha_registro_at).toISOString(),
      telefono: data.telefono?.trim(),
      email: data.email?.trim(),
    };

    try {
      const response = await apiService.post('/trabajadores', cleanedData);

      if (!response || response.success !== true) {
        console.log('3. Success es false');
        throw new Error(response?.message || 'Error al crear empleado');
      }

      console.log('Respuesta:', response);
      
      const employeeData = (response as ApiCreateTrabajadorResponse).data.trabajador;
      
      const convertedData: Employee = {
        id: employeeData.id?.toString() || employeeData.trabajador_id?.toString() || '',
        name: employeeData.name || employeeData.nombre_completo,
        identification: employeeData.identification || employeeData.documento_identidad,
        position: employeeData.cargo || 'Sin definir',
        hireDate: new Date(employeeData.fecha_registro_at || employeeData.hireDate || new Date()),
        status: normalizeStatus(employeeData.status, employeeData.is_activo),
        email: employeeData.email,
        phone: employeeData.telefono || employeeData.phone,
        cargo: employeeData.cargo,
        createdAt: new Date(employeeData.created_at || employeeData.createdAt || new Date()),
        updatedAt: new Date(employeeData.updated_at || employeeData.updatedAt || new Date()),
      };
      
      return convertedData;
      
    } catch (error: any) {
      console.error('ERROR COMPLETO en createEmployee:', {
        error: error,
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      if (error.response?.status === 409) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Error al crear el empleado');
    }
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    const response = await apiService.put(`/trabajadores/${id}`, data as Record<string, unknown>);
    const responseData = response.data as ApiTrabajadorDetailResponse;
    return {
      id: responseData.id?.toString() || '',
      name: responseData.name || responseData.nombre_completo,
      identification: responseData.identification || responseData.documento_identidad,
      position: responseData.cargo || 'Sin definir',
      cargo: responseData.cargo,
      department: responseData.department,
      hireDate: new Date(responseData.hireDate || responseData.fecha_registro_at),
      status: normalizeStatus(responseData.status, responseData.is_activo),
      email: responseData.email,
      phone: responseData.phone || responseData.telefono,
      createdAt: new Date(responseData.createdAt || responseData.created_at),
      updatedAt: new Date(responseData.updatedAt || responseData.updated_at),
    } as Employee;
  }

  async deleteEmployee(id: string): Promise<void> {
    await apiService.delete(`/empleados/${id}`);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const response = await apiService.get(`/trabajadores/search/${encodeURIComponent(query)}`);
    
    const trabajadores = (response.data as ApiTrabajadoresListResponse)?.trabajadores || [];
    
    return trabajadores.map((item: ApiTrabajadorResponse): Employee => ({
      id: item.id.toString(),
      name: item.name || item.nombre_completo,
      identification: item.identification || item.documento_identidad,
      position: item.cargo || 'Sin definir',
      hireDate: new Date(item.hireDate || item.fecha_registro_at),
      status: normalizeStatus(item.status, item.is_activo),
      email: item.email,
      phone: item.phone || item.telefono,
      createdAt: new Date(item.createdAt || item.created_at),
      updatedAt: new Date(item.updatedAt || item.updated_at),
    }));
  }

  // Método para crear información laboral
  async createLaborInfo(laborInfo: LaborInfoData): Promise<CreateLaborInfoResponse> {
    try {
      console.log('Enviando datos al backend:', laborInfo);

      const response = await apiService.post(`/trabajadores/${laborInfo.trabajador_id}/info-laboral`, {
        cargo: laborInfo.cargo,
        departamento: laborInfo.departamento,
        salario_base: laborInfo.salario_base,
        tipo_contrato: laborInfo.tipo_contrato,
        fecha_ingreso: laborInfo.fecha_ingreso
      });

      console.log('Respuesta del backend:', response);

      return {
        success: true,
        message: response.message ?? '',
        data: response.data
      };
    } catch (error: any) {
      console.error('Error creating labor infoooooo:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      
      return {
        success: false,
        message: 'Error de conexión al servidor'
      };
    }
  }
}

export default ApiEmployeeRepository;