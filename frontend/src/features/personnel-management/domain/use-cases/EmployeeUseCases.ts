// src/employee-management/domain/use-cases/EmployeeUseCases.ts
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { Employee, CreateEmployeeData, LaborInfoData, CreateLaborInfoResponse, UpdateEmployeeData } from '../entities/Employee';

export class EmployeeUseCases {
  constructor(private employeeRepository: EmployeeRepository) {}

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.getAllEmployees();
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return this.employeeRepository.getEmployeeById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    return this.employeeRepository.createEmployee(data);
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    return this.employeeRepository.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.employeeRepository.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    return this.employeeRepository.searchEmployees(query);
  }

  async createLaborInfo(data: LaborInfoData): Promise<CreateLaborInfoResponse> {
    return this.employeeRepository.createLaborInfo(data);
  }
}

export default EmployeeUseCases;