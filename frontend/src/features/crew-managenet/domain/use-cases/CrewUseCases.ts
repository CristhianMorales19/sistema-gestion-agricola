import { Crew, CreateCrewData } from '../entities/Crew';
import { CrewRepository } from '../repositories/CrewRepository';
import { SafeResult } from '@shared/utils/safeCall';

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

    async updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<SafeResult<string>> {
        return this.crewRepository.updateCrew(id, crewData);
    }

    async deleteCrew(id: string): Promise<SafeResult<string>> {
        return this.crewRepository.deleteCrew(id);
    }
}