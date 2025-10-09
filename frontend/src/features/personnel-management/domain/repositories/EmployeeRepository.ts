// src/employee-management/domain/repositories/EmployeeRepository.ts
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData, CreateLaborInfoResponse } from '../entities/Employee';

export interface EmployeeRepository {
    getAllEmployees(): Promise<Employee[]>;
    getEmployeeById(id: string): Promise<Employee | null>;
    createEmployee(data: CreateEmployeeData): Promise<Employee>;
    updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee>;
    deleteEmployee(id: string): Promise<void>;
    searchEmployees(query: string): Promise<Employee[]>;
    createLaborInfo(laborInfo: LaborInfoData): Promise<CreateLaborInfoResponse>;
}