import { CrewRepository } from "../domain/crew-repository";
import { UpdateCrewDTO } from "../presentation/dto/update-crew.dto";

export class UpdateCrewUseCase {
  constructor(private repo: CrewRepository) {}

  async execute(data: UpdateCrewDTO, userId: number, crewId: number) {
    const exists = await this.repo.existsById(crewId);
    if (!exists) {
      throw new Error("La cuadrilla no existe");
    }

    if (data.workers?.length) {
      const existingIds = await this.repo.workersExist(data.workers);
      const notFound = data.workers.filter((id) => !existingIds.includes(id));

      if (notFound.length > 0) {
        throw new Error(`Empleados no existen: ${notFound.join(", ")}`);
      }
    }

    await this.repo.update(data, userId, crewId);
  }
}
