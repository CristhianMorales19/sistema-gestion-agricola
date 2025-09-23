// src/employee-management/index.ts
export { useEmployeeManagement } from './application/hooks/useEmployeeManagement';
export { default as EmployeeService } from './application/services/EmployeeService';
export { default as EmployeeUseCases } from './domain/use-cases/EmployeeUseCases';
export { ApiEmployeeRepository } from './infrastructure/ApiEmployeeRepository';
export type { Employee, CreateEmployeeData, UpdateEmployeeData } from './domain/entities/Employee';

// Importar desde el barrel de components en lugar de rutas específicas
export { EmployeeManagementView, EmployeeTable } from './presentation/components';