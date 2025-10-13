import { Crew, CreateCrewData, ApiResponseMessage } from '../entities/Crew';
import { CrewRepository } from '../repositories/CrewRepository';

export class CrewUseCases {
    constructor(private crewRepository: CrewRepository) {}

    async getAllCrews(): Promise<Crew[]> {
        return this.crewRepository.getAllCrews();
    }

    async getCrewByCodeOrArea(codeOrArea: string): Promise<Crew[]> {
        return this.crewRepository.getCrewByCodeOrArea(codeOrArea);
    }

    async createCrew(crewData: CreateCrewData): Promise<ApiResponseMessage> {
        return this.crewRepository.createCrew(crewData);
    }

    async updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<ApiResponseMessage> {
        return this.crewRepository.updateCrew(id, crewData);
    }

    async deleteCrew(id: string): Promise<ApiResponseMessage> {
        return this.crewRepository.deleteCrew(id);
    }
}