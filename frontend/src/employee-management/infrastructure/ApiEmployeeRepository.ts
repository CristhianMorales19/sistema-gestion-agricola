// src/employee-management/infrastructure/ApiEmployeeRepository.ts
import { EmployeeRepository } from '../domain/repositories/EmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData, CreateLaborInfoResponse } from '../domain/entities/Employee';
import { apiService } from '../../services/api.service';

export class ApiEmployeeRepository implements EmployeeRepository {

  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiService.get('/trabajadores');

    console.log('Trabajadores:', response.data?.trabajadores);
    
    const trabajadores = response.data?.trabajadores || [];

    return trabajadores.map((item: any) => ({
      id: item.id || item.trabajador_id?.toString(),
      name: item.name || item.nombre_completo,
      identification: item.identification || item.documento_identidad,
      cargo: item.cargo || 'Sin definir',
      department: item.department || 'Sin definir',
      hireDate: new Date(item.hireDate || item.fecha_registro_at),
      status: item.status || (item.is_activo ? 'active' : 'inactive'),
      email: item.email,
      phone: item.telefono,
      createdAt: new Date(item.createdAt || item.created_at),
      updatedAt: new Date(item.updatedAt || item.updated_at),
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
      
      const employeeData = response.data.trabajador;
      
      const convertedData = {
        ...employeeData,
        fecha_nacimiento: new Date(employeeData.fecha_nacimiento),
        fecha_registro_at: new Date(employeeData.fecha_registro_at),
        created_at: new Date(employeeData.created_at),
        updated_at: employeeData.updated_at ? new Date(employeeData.updated_at) : undefined,
        deleted_at: employeeData.deleted_at ? new Date(employeeData.deleted_at) : undefined,
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
    const response = await apiService.put(`/trabajadores/${id}`, data);
    return {
      ...response.data,
      hireDate: new Date(response.data.hireDate),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
    };
  }

  async deleteEmployee(id: string): Promise<void> {
    await apiService.delete(`/empleados/${id}`);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const response = await apiService.get(`/trabajadores/search/${encodeURIComponent(query)}`);
    
    const trabajadores = response.data?.trabajadores || [];
    
    return trabajadores.map((item: any) => ({
      id: item.id.toString(),
      name: item.name || item.nombre_completo,
      identification: item.identification || item.documento_identidad,
      position: item.position || 'Sin definir',
      department: item.department || 'Sin definir',
      hireDate: new Date(item.hireDate || item.fecha_registro_at),
      status: item.status || (item.is_activo ? 'active' : 'inactive'),
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