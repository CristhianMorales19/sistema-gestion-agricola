// src/employee-management/infrastructure/ApiEmployeeRepository.ts
import { EmployeeRepository } from '../domain/repositories/EmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData } from '../domain/entities/Employee';
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
      position: item.position || 'Sin definir',
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
        throw new Error('Ya existe un empleado con esta cédula');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Error al crear el empleado');
    }
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    const response = await apiService.put(`/empleados/${id}`, data);
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
}

export default ApiEmployeeRepository;