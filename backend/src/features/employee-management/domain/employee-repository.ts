import {
  CreateEmployee,
  Employee,
  EmployeeWithLabor,
  UpdateEmployee,
} from "./employee";

export interface EmployeeRepository {
  findAll(): Promise<Employee[]>;
  findById(id: number): Promise<EmployeeWithLabor | null>;
  existsByIdentification(identification: string): Promise<boolean>;
  existsById(id: number): Promise<boolean>;
  create(employee: CreateEmployee, userId: number): Promise<void>;
  delete(id: number): Promise<void>;
  search(query: string): Promise<Employee[]>;
  findWithoutCrew(): Promise<Employee[]>;
  updateEmployee(
    id: number,
    data: UpdateEmployee,
    userId: number,
  ): Promise<void>;
}
