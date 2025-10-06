// src/employee-management/application/services/EmployeeService.ts
import { EmployeeUseCases } from '../../domain/use-cases/EmployeeUseCases';
import { ApiEmployeeRepository } from '../../infrastructure/ApiEmployeeRepository';
import { Employee, CreateEmployeeData, LaborInfoData, Response } from '../../domain/entities/Employee';

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

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Response> {
    return this.employeeUseCases.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.employeeUseCases.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    return this.employeeUseCases.searchEmployees(query.trim());
  }

  async createLaborInfo(data: LaborInfoData): Promise<Response> {
    return this.employeeUseCases.createLaborInfo(data);
  }
}

export default EmployeeService;