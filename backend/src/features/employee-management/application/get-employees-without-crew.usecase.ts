import { EmployeeRepository } from "../domain/employee-repository";

export class GetEmployeesWithoutCrewUseCase {
  constructor(private repo: EmployeeRepository) {}

  async execute() {
    return this.repo.findWithoutCrew();
  }
}
