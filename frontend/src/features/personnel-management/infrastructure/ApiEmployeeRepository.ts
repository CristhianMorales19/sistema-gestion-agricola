// src/employee-management/infrastructure/ApiEmployeeRepository.ts
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData } from '../domain/entities/Employee';
import { EmployeeRepository } from '../domain/repositories/EmployeeRepository';
import { apiService } from '../../../services/api.service';
import { safeCall, SafeResult } from '../../../shared/utils/safeCall';

export class ApiEmployeeRepository implements EmployeeRepository {
    private baseUrl = '/trabajadores';

    async getAllEmployees(): Promise<SafeResult<Employee[]>> {
        const result = await safeCall(apiService.get(this.baseUrl));
        console.log("getAllEmployees:", result)
        if (!result.success)
            return { success: false, data: null, error: result.error };

        const trabajadores = result.data?.data as Employee[];
        const mapped = trabajadores.map(this.mapEmployee);
        return { success: true, data: mapped, error: null };
    }

    async getEmployeeById(id: string): Promise<SafeResult<Employee>> {
        const result = await safeCall(apiService.get(`${this.baseUrl}/${id}`));
        if (!result.success)
            return { success: false, data: null, error: result.error };

        const mapped = this.mapEmployee(result.data);
        return { success: true, data: mapped, error: null };
    }

    async createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>> {
        const result = await safeCall(apiService.post(this.baseUrl, data));
        if (!result.success)
            return { success: false, data: null, error: result.error };

        return {
            success: true,
            data: result.data.message ?? 'Empleado creado correctamente',
            error: null
        };
    }

    async updateEmployee(id: string, data: UpdateEmployeeData): Promise<SafeResult<string>> {
        console.log("updateEmployee: ", data);
        const result = await safeCall(apiService.put(`${this.baseUrl}/${id}`, data));
        if (!result.success)
            return { success: false, data: null, error: result.error };

        return {
            success: true,
            data: result.data.message ?? 'Empleado actualizado correctamente',
            error: null
        };
    }

    async deleteEmployee(id: string): Promise<SafeResult<string>> {
        const result = await safeCall(apiService.delete(`${this.baseUrl}/${id}`));
        if (!result.success)
            return { success: false, data: null, error: result.error };

        return {
            success: true,
            data: result.data.message ?? 'Empleado eliminado correctamente',
            error: null
        };
    }

    async searchEmployees(query: string): Promise<SafeResult<Employee[]>> {
        const result = await safeCall(apiService.get(`${this.baseUrl}/search/${encodeURIComponent(query)}`));
        if (!result.success)
            return { success: false, data: null, error: result.error };

        const trabajadores = result.data?.data as Employee[];
        const mapped = trabajadores.map(this.mapEmployee);
        return { success: true, data: mapped, error: null };
    }

    async createLaborInfo(laborInfo: LaborInfoData): Promise<SafeResult<string>> {
        const result = await safeCall(
            apiService.post(`${this.baseUrl}/${laborInfo.trabajador_id}/info-laboral`, laborInfo)
        );
        if (!result.success)
            return { success: false, data: null, error: result.error };

        return {
            success: true,
            data: result.data.message ?? 'Información laboral registrada correctamente',
            error: null
        };
    }

    // ===== Mapeo de datos =====
    private mapEmployee(apiEmp: any): Employee {
        return {
            id: apiEmp.id?.toString() || apiEmp.trabajador_id?.toString() || '',
            name: apiEmp.name || apiEmp.nombre_completo,
            identification: apiEmp.identification || apiEmp.documento_identidad,
            position: apiEmp.cargo || 'Sin definir',
            hireDate: new Date(apiEmp.hireDate || apiEmp.fecha_registro_at),
            status: apiEmp.status ?? true,
            email: apiEmp.email,
            phone: apiEmp.phone || apiEmp.telefono,
            createdAt: new Date(apiEmp.createdAt || apiEmp.created_at),
            updatedAt: new Date(apiEmp.updatedAt || apiEmp.updated_at),
        };
    }
}

export default ApiEmployeeRepository;
