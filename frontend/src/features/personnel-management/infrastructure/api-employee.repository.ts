// src/employee-management/infrastructure/ApiEmployeeRepository.ts
import {
  Employee,
  CreateEmployeeData,
  EditEmployeeData,
} from "../domain/entities/employee";
import { LaborInfoData } from "../domain/entities/laborInfoEmployee";
import { EmployeeRepository } from "../domain/repositories/employee.repository";
import { apiService } from "../../../services/api.service";
import { safeCall, SafeResult } from "../../../shared/utils/safeCall";
import { normalizeDate } from "../../../shared/utils/normalizeDate";

export class ApiEmployeeRepository implements EmployeeRepository {
  private baseUrl = "/trabajadores";

  async getAllEmployees(): Promise<SafeResult<Employee[]>> {
    const result = await safeCall(apiService.get(this.baseUrl));
    console.log("getAllEmployees:", result);
    if (!result.success)
      return { success: false, data: null, error: result.error };

    const employees = result.data?.data as Employee[];
    const mapped = employees.map(this.mapEmployee);
    return { success: true, data: mapped, error: null };
  }

  async getEmployeeById(id: number): Promise<SafeResult<EditEmployeeData>> {
    const result = await safeCall(apiService.get(`${this.baseUrl}/${id}`));
    if (!result.success)
      return { success: false, data: null, error: result.error };

    const data = result.data?.data as EditEmployeeData;
    return {
      success: true,
      data: {
        employee: this.mapEmployee(data.employee),
        laborInfo: data.laborInfo,
      },
      error: null,
    };
  }

  async createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>> {
    const result = await safeCall(apiService.post(this.baseUrl, data));
    if (!result.success)
      return { success: false, data: null, error: result.error };

    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  async updateEmployee(
    id: number,
    data: EditEmployeeData,
  ): Promise<SafeResult<string>> {
    console.log("updateEmployee: ", data);
    const result = await safeCall(
      apiService.put(`${this.baseUrl}/${id}`, data),
    );
    if (!result.success)
      return { success: false, data: null, error: result.error };

    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  async deleteEmployee(id: number): Promise<SafeResult<string>> {
    const result = await safeCall(apiService.delete(`${this.baseUrl}/${id}`));
    if (!result.success)
      return { success: false, data: null, error: result.error };

    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  async searchEmployees(query: string): Promise<SafeResult<Employee[]>> {
    const result = await safeCall(
      apiService.get(`${this.baseUrl}/search/${encodeURIComponent(query)}`),
    );
    if (!result.success)
      return { success: false, data: null, error: result.error };

    const employees = result.data?.data as Employee[];
    const mapped = employees.map(this.mapEmployee);
    return { success: true, data: mapped, error: null };
  }

  async createLaborInfo(
    id: number,
    laborInfo: LaborInfoData,
  ): Promise<SafeResult<string>> {
    const result = await safeCall(
      apiService.post(`${this.baseUrl}/${id}/info-laboral`, laborInfo),
    );
    if (!result.success)
      return { success: false, data: null, error: result.error };

    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  async getAllEmployeesWithoutCrew(): Promise<SafeResult<Employee[]>> {
    const result = await safeCall(
      apiService.get(`${this.baseUrl}/sin-cuadrilla`),
    );
    if (!result.success)
      return { success: false, data: null, error: result.error };

    const employees = result.data?.data as Employee[];
    const mapped = employees.map(this.mapEmployee);
    return { success: true, data: mapped, error: null };
  }

  private mapEmployee = (employee: Employee): Employee => {
    return {
      ...employee,
      hireDate: normalizeDate(employee.hireDate),
      birthDate: normalizeDate(employee.birthDate),
    };
  };
}

export default ApiEmployeeRepository;
