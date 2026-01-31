import { EmployeeRepository } from "../domain/employee-repository";

export class SearchEmployeesUseCase {
  constructor(private repo: EmployeeRepository) {}

  async execute(query: string) {
    return this.repo.search(query.trim());
  }
}
