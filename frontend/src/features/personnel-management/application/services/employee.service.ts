import { EmployeeUseCases } from "../../domain/use-cases/employee-use-cases";
import { ApiEmployeeRepository } from "../../infrastructure/api-employee.repository";
import {
  Employee,
  CreateEmployeeData,
  EditEmployeeData,
} from "../../domain/entities/employee";
import { LaborInfoData } from "@features/personnel-management/domain/entities/laborInfoEmployee";
import { SafeResult } from "@shared/utils/safeCall";

export class EmployeeService {
  private employeeUseCases: EmployeeUseCases;

  constructor() {
    const repository = new ApiEmployeeRepository();
    this.employeeUseCases = new EmployeeUseCases(repository);
  }

  async getAllEmployees(): Promise<SafeResult<Employee[]>> {
    return this.employeeUseCases.getAllEmployees();
  }

  async getEmployeeById(id: number): Promise<SafeResult<EditEmployeeData>> {
    return this.employeeUseCases.getEmployeeById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>> {
    return this.employeeUseCases.createEmployee(data);
  }

  async updateEmployee(
    id: number,
    data: EditEmployeeData,
  ): Promise<SafeResult<string>> {
    return this.employeeUseCases.updateEmployee(id, data);
  }

  async deleteEmployee(id: number): Promise<SafeResult<string>> {
    return this.employeeUseCases.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<SafeResult<Employee[]>> {
    return this.employeeUseCases.searchEmployees(query.trim());
  }

  async createLaborInfo(
    id: number,
    data: LaborInfoData,
  ): Promise<SafeResult<string>> {
    return this.employeeUseCases.createLaborInfo(id, data);
  }

  async getAllEmployeesWithoutCrew(): Promise<SafeResult<Employee[]>> {
    return this.employeeUseCases.getAllEmployeesWithoutCrew();
  }
}

export default EmployeeService;
