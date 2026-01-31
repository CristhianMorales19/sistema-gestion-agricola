import { EmployeeRepository } from "../domain/employee-repository";

export class DeleteEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}

  async execute(id: number) {
    const exists = await this.repo.existsById(id);
    if (!exists) {
      throw new Error("Empleado no encontrado");
    }

    await this.repo.delete(id);
  }
}
