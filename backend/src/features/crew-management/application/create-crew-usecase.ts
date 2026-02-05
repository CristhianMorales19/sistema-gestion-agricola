import { CrewRepository } from "../domain/crew-repository";
import { CreateCrewDTO } from "../presentation/dto/create-crew.dto";

export class CreateCrewUseCase {
  constructor(private readonly repo: CrewRepository) {}

  async execute(data: CreateCrewDTO, userId: number) {
    const existsCrew = await this.repo.existsByCode(data.code);
    if (existsCrew) {
      throw new Error("Código no disponible");
    }

    if (data.workers?.length) {
      const existingIds = await this.repo.workersExist(data.workers);
      const notFound = data.workers.filter((id) => !existingIds.includes(id));

      if (notFound.length > 0) {
        throw new Error(`Empleados no existen: ${notFound.join(", ")}`);
      }
    }

    await this.repo.create(data, userId);
  }
}
