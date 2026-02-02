import { CrewRepository } from "../domain/crew-repository";

export class GetCrewsUseCase {
  constructor(private crewRepo: CrewRepository) {}

  async execute() {
    return this.crewRepo.findAll();
  }
}
