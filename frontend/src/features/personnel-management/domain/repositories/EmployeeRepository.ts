import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData } from '../entities/Employee';
import { SafeResult } from '@shared/utils/safeCall';

export interface EmployeeRepository {
    getAllEmployees(): Promise<SafeResult<Employee[]>>;
    getEmployeeById(id: string): Promise<SafeResult<Employee>>;
    createEmployee(data: CreateEmployeeData): Promise<SafeResult<string>>;
    updateEmployee(id: string, data: UpdateEmployeeData): Promise<SafeResult<string>>;
    deleteEmployee(id: string): Promise<SafeResult<string>>;
    searchEmployees(query: string): Promise<SafeResult<Employee[]>>;
    createLaborInfo(laborInfo: LaborInfoData): Promise<SafeResult<string>>;
}
