import { EmployeeUseCases } from '../../domain/use-cases/EmployeeUseCases';
import { ApiEmployeeRepository } from '../../infrastructure/ApiEmployeeRepository';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData } from '../../domain/entities/Employee';
import { SafeResult } from '@shared/utils/safeCall';

export class EmployeeService {
  private employeeUseCases: EmployeeUseCases;

  constructor() {
    const repository = new ApiEmployeeRepository();
    this.employeeUseCases = new EmployeeUseCases(repository);
  }

  async getAllEmployees(): Promise<SafeResult<Employee[]>> {
    return this.employeeUseCases.getAllEmployees();
  }

  async getEmployeeById(id: string): Promise<SafeResult<Employee>> {
    return this.employeeUseCases.getEmployeeById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>> {
    return this.employeeUseCases.createEmployee(data);
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<SafeResult<string>> {
    return this.employeeUseCases.updateEmployee(id, data);
  }

  async deleteEmployee(id: string): Promise<SafeResult<string>> {
    return this.employeeUseCases.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<SafeResult<Employee[]>> {
    return this.employeeUseCases.searchEmployees(query.trim());
  }

  async createLaborInfo(data: LaborInfoData): Promise<SafeResult<string>> {
    return this.employeeUseCases.createLaborInfo(data);
  }
}

export default EmployeeService;
