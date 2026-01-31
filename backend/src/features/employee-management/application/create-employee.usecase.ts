import { EmployeeRepository } from "../domain/employee-repository";
import { CreateEmployeeDTO } from "../presentation/dto/create-employee.dto";

export class CreateEmployeeUseCase {
  constructor(private repo: EmployeeRepository) {}

  async execute(data: CreateEmployeeDTO, userId: number) {
    const birth = new Date(data.birthDate);
    const hire = new Date(data.hireDate);
    const today = new Date();

    if (birth > today) {
      throw new Error("La fecha de nacimiento no puede ser futura");
    }

    if (hire > today) {
      throw new Error("La fecha de contratación no puede ser futura");
    }

    if (hire < birth) {
      throw new Error(
        "La fecha de contratación no puede ser menor a la de nacimiento",
      );
    }

    const exists = await this.repo.existsByIdentification(data.identification);

    if (exists) {
      throw new Error("Ya existe un trabajador con esta cédula");
    }

    await this.repo.create(
      {
        identification: data.identification,
        name: data.name,
        birthDate: birth,
        hireDate: hire,
        phone: data.phone,
        email: data.email,
        status: true,
      },
      userId,
    );
  }
}
