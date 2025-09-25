// src/employee-management/application/services/EmployeeService.ts
import { EmployeeUseCases } from '../../domain/use-cases/EmployeeUseCases';
import { ApiEmployeeRepository } from '../../infrastructure/ApiEmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData, CreateLaborInfoResponse } from '../../domain/entities/Employee';

export class EmployeeService {
  private employeeUseCases: EmployeeUseCases;

  constructor() {
    const repository = new ApiEmployeeRepository();
    this.employeeUseCases = new EmployeeUseCases(repository);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeUseCases.getAllEmployees();
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeUseCases.getEmployeeById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    return this.employeeUseCases.createEmployee(data);
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    return this.employeeUseCases.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.employeeUseCases.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    if (!query || query.trim().length < 2) {
      throw new Error('La búsqueda debe tener al menos 2 caracteres');
    }
    return this.employeeUseCases.searchEmployees(query.trim());
  }

  async createLaborInfo(data: LaborInfoData): Promise<CreateLaborInfoResponse> {
    return this.employeeUseCases.createLaborInfo(data);
  }
}

export default EmployeeService;