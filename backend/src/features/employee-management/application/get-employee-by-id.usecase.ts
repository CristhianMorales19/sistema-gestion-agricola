import { EmployeeRepository } from "../domain/employee-repository";

export class GetEmployeeByIdUseCase {
  constructor(private employeeRepo: EmployeeRepository) {}

  async execute(id: number) {
    return this.employeeRepo.findById(id);
  }
}
