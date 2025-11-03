import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData } from '../entities/Employee';
import { SafeResult } from '@shared/utils/safeCall';

export class EmployeeUseCases {
  constructor(private employeeRepository: EmployeeRepository) {}

  async getAllEmployees(): Promise<SafeResult<Employee[]>> {
    return this.employeeRepository.getAllEmployees();
  }

  async getEmployeeById(id: string): Promise<SafeResult<Employee>> {
    return this.employeeRepository.getEmployeeById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>> {
    return this.employeeRepository.createEmployee(data);
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<SafeResult<string>> {
    return this.employeeRepository.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<SafeResult<string>> {
    return this.employeeRepository.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<SafeResult<Employee[]>> {
    return this.employeeRepository.searchEmployees(query);
  }

  async createLaborInfo(data: LaborInfoData): Promise<SafeResult<string>> {
    return this.employeeRepository.createLaborInfo(data);
  }
}

export default EmployeeUseCases;
