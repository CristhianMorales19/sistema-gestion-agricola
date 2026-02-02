import { EmployeeRepository } from "../domain/employee-repository";
import { UpdateEmployeeDTO } from "../presentation/dto/update-employee.dto";

export class UpdateEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}

  async execute(employeeId: number, dto: UpdateEmployeeDTO, userId: number) {
    const existing = await this.repo.existsById(employeeId);
    if (!existing) throw new Error("Empleado no encontrado");
    await this.repo.updateEmployee(
      employeeId,
      {
        employee: {
          ...dto.employee,
          hireDate: new Date(dto.employee.hireDate),
          birthDate: new Date(dto.employee.birthDate),
        },
        laborInfo: dto.laborInfo,
      },
      userId,
    );
  }
}
