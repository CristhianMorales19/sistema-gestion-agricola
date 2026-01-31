import { UpdateEmployee } from "../domain/employee";
import { EmployeeRepository } from "../domain/employee-repository";

export class UpdateEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}

  async execute(employeeId: number, dto: UpdateEmployee, userId: number) {
    const existing = await this.repo.existsById(employeeId);
    if (!existing) throw new Error("Empleado no encontrado");
    await this.repo.updateEmployee(employeeId, dto, userId);
  }
}
