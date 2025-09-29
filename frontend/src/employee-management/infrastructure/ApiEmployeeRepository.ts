// src/employee-management/infrastructure/ApiEmployeeRepository.ts
import { EmployeeRepository } from '../domain/repositories/EmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData, Response } from '../domain/entities/Employee';
import { apiService } from '../../services/api.service';

export class ApiEmployeeRepository implements EmployeeRepository {

  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiService.get('/trabajadores');

    console.log('Trabajadores:', response.data?.trabajadores);
    
    const trabajadores = response.data?.trabajadores || [];

    return trabajadores.map((item: any) => ({
      id: item.id || item.trabajador_id?.toString(),
      name: item.name || item.nombre_completo,
      identification: item.identification,
      role: item.role || 'Sin definir',
      department: item.department || 'Sin definir',
      entryDate: item.entryDate,
      status: (item.status ? 'activo' : 'inactivo'),
      email: item.email,
      phone: item.phone,
      contractType: item.contractType,
      baseSalary: item.baseSalary,
      birthDate: item.birthDate
    }));
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const response = await apiService.get(`/trabajadores/${id}`);
    return {
      ...response.data,
      hireDate: new Date(response.data.hireDate),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    console.log('Datos a enviar:', data);

    const cleanedData = {
      ...data,
      birthDate: data.birthDate.toString(),
      phone: data.phone?.trim(),
      email: data.email?.trim(),
    };

    try {
      const response = await apiService.post('/trabajadores', cleanedData);

      if (!response || response.success !== true) {
        console.log('3. Success es false');
        throw new Error(response?.message || 'Error al crear empleado');
      }

      console.log('Respuesta:', response);
      
      const employeeData = response.data.trabajador;
      
      const convertedData = {
        ...employeeData,
        birthDate: new Date(employeeData.birthDate).toLocaleDateString('es-ES')
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

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Response> {
    console.log('Enviando datos al backend:', data);

    try {
      const response = await apiService.put(`/trabajadores/${id}`, data);

      console.log('Respuesta del backend 1:', response);

      return {
        success: true,
        message: response.message ?? '',
      };

    } catch(error: any) {
      console.error('Respuesta del backend 1', error);

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

  async deleteEmployee(id: string): Promise<void> {
    await apiService.delete(`/trabajadores/${id}`);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const response = await apiService.get(`/trabajadores/search/${encodeURIComponent(query)}`);
    
    const trabajadores = response.data?.trabajadores || [];
    
    return trabajadores.map((item: any) => ({
      id: item.id.toString(),
      name: item.name || item.nombre_completo,
      identification: item.identification || item.documento_identidad,
      cargo: item.cargo || 'Sin definir',
      department: item.department || 'Sin definir',
      hireDate: new Date(item.hireDate || item.fecha_registro_at),
      status: item.status || (item.is_activo ? 'active' : 'inactive'),
      email: item.email,
      phone: item.phone || item.telefono
    }));
  }

  // Método para crear información laboral
  async createLaborInfo(laborInfo: LaborInfoData): Promise<Response> {
    try {
      console.log('Enviando datos al backend:', laborInfo);

      const response = await apiService.post(`/trabajadores/${laborInfo.employeeId}/info-laboral`, {
        role: laborInfo.role,
        department: laborInfo.department,
        baseSalary: laborInfo.baseSalary,
        contractType: laborInfo.contractType,
        entryDate: laborInfo.entryDate
      });

      console.log('Respuesta del backend:', response);

      return {
        success: true,
        message: response.message ?? '',
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