import {
  Employee,
  CreateEmployeeData,
  EditEmployeeData,
} from "../entities/employee";
import { LaborInfoData } from "../entities/labor-info-employee";
import { SafeResult } from "@shared/utils/safeCall";

export interface EmployeeRepository {
  getAllEmployees(): Promise<SafeResult<Employee[]>>;
  getEmployeeById(id: number): Promise<SafeResult<EditEmployeeData>>;
  createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>>;
  updateEmployee(
    id: number,
    data: EditEmployeeData,
  ): Promise<SafeResult<string>>;
  deleteEmployee(id: number): Promise<SafeResult<string>>;
  searchEmployees(query: string): Promise<SafeResult<Employee[]>>;
  createLaborInfo(
    id: number,
    laborInfo: LaborInfoData,
  ): Promise<SafeResult<string>>;
  getAllEmployeesWithoutCrew(): Promise<SafeResult<Employee[]>>;
}
