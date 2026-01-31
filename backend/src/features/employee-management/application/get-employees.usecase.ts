import { EmployeeRepository } from "../domain/employee-repository";

export class GetEmployeesUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  execute() {
    return this.employeeRepo.findAll();
  }
}
