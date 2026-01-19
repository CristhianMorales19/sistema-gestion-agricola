// src/employee-management/application/services/EmployeeService.ts
import { CrewUseCases } from "../../domain/use-cases/crew-use-cases";
import { ApiCrewRepository } from "../../infrastructure/api-crew.repository";
import { Crew } from "../../domain/entities/crew";
import { SafeResult } from "@shared/utils/safeCall";

export class CrewService {
  private crewUseCases: CrewUseCases;

  constructor() {
    const repository = new ApiCrewRepository();
    this.crewUseCases = new CrewUseCases(repository);
  }

  async getAllCrews(): Promise<SafeResult<Crew[]>> {
    return this.crewUseCases.getAllCrews();
  }

  async getCrewByCodeOrArea(codeOrArea: string): Promise<SafeResult<Crew[]>> {
    return this.crewUseCases.getCrewByCodeOrArea(codeOrArea);
  }

  async createCrew(crewData: any): Promise<SafeResult<string>> {
    return this.crewUseCases.createCrew(crewData);
  }

  async updateCrew(
    id: number,
    crewData: Partial<any>,
  ): Promise<SafeResult<string>> {
    return this.crewUseCases.updateCrew(id, crewData);
  }

  async deleteCrew(id: number): Promise<SafeResult<string>> {
    return this.crewUseCases.deleteCrew(id);
  }
}
