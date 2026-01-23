import { EmployeeRepository } from "../repositories/employee.repository";
import {
  Employee,
  CreateEmployeeData,
  EditEmployeeData,
} from "../entities/employee";
import { LaborInfoData } from "../entities/labor-info-employee";
import { SafeResult } from "@shared/utils/safeCall";

export class EmployeeUseCases {
  constructor(private employeeRepository: EmployeeRepository) {}

  async getAllEmployees(): Promise<SafeResult<Employee[]>> {
    return this.employeeRepository.getAllEmployees();
  }

  async getEmployeeById(id: number): Promise<SafeResult<EditEmployeeData>> {
    return this.employeeRepository.getEmployeeById(id);
  }

  async createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>> {
    return this.employeeRepository.createEmployee(data);
  }

  async updateEmployee(
    id: number,
    data: EditEmployeeData,
  ): Promise<SafeResult<string>> {
    return this.employeeRepository.updateEmployee(id, data);
  }

  async deleteEmployee(id: number): Promise<SafeResult<string>> {
    return this.employeeRepository.deleteEmployee(id);
  }

  async searchEmployees(query: string): Promise<SafeResult<Employee[]>> {
    return this.employeeRepository.searchEmployees(query);
  }

  async createLaborInfo(
    id: number,
    data: LaborInfoData,
  ): Promise<SafeResult<string>> {
    return this.employeeRepository.createLaborInfo(id, data);
  }

  async getAllEmployeesWithoutCrew(): Promise<SafeResult<Employee[]>> {
    return this.employeeRepository.getAllEmployeesWithoutCrew();
  }
}

export default EmployeeUseCases;
