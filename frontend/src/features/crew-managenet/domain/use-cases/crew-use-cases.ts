import { Crew, CreateCrewData } from "../entities/crew";
import { CrewRepository } from "../repositories/crew.repository";
import { SafeResult } from "@shared/utils/safeCall";

export class CrewUseCases {
  constructor(private crewRepository: CrewRepository) {}

  async getAllCrews(): Promise<SafeResult<Crew[]>> {
    return this.crewRepository.getAllCrews();
  }

  async getCrewByCodeOrArea(codeOrArea: string): Promise<SafeResult<Crew[]>> {
    return this.crewRepository.getCrewByCodeOrArea(codeOrArea);
  }

  async createCrew(crewData: CreateCrewData): Promise<SafeResult<string>> {
    return this.crewRepository.createCrew(crewData);
  }

  async updateCrew(
    id: number,
    crewData: Partial<CreateCrewData>,
  ): Promise<SafeResult<string>> {
    return this.crewRepository.updateCrew(id, crewData);
  }

  async deleteCrew(id: number): Promise<SafeResult<string>> {
    return this.crewRepository.deleteCrew(id);
  }
}
