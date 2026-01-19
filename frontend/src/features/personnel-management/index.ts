// src/employee-management/index.ts
export { useEmployeeManagement } from "./application/hooks/use-employee-management";
export { default as EmployeeService } from "./application/services/employee.service";
export { default as EmployeeUseCases } from "./domain/use-cases/employee-use-cases";
export { ApiEmployeeRepository } from "./infrastructure/api-employee.repository";
export type { Employee, CreateEmployeeData } from "./domain/entities/employee";

// Importar desde el barrel de components en lugar de rutas específicas
export { EmployeeManagementView } from "./presentation/components/EmployeeManagementView";
export { EmployeeTable } from "./presentation/components/EmployeeTable/EmployeeTable";
