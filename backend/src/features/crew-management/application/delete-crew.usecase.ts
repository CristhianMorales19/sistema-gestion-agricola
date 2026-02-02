import { CrewRepository } from "../domain/crew-repository";

export class DeleteCrewUseCase {
  constructor(private readonly repo: CrewRepository) {}

  async execute(userId: number, crewId: number) {
    const exists = await this.repo.existsById(crewId);
    if (!exists) {
      throw new Error("La cuadrilla no existe");
    }
    await this.repo.delete(crewId, userId);
  }
}
