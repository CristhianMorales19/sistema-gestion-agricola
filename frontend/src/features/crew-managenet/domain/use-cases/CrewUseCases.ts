import { Crew, CreateCrewData } from '../entities/Crew';
import { CrewRepository } from '../repositories/CrewRepository';

export class CrewUseCases {
    constructor(private crewRepository: CrewRepository) {}

    async getAllCrews(): Promise<Crew[]> {
        return this.crewRepository.getAllCrews();
    }

    // async getCrewById(id: string): Promise<Crew | null> {
    //     return this.crewRepository.getCrewById(id);
    // }

    // async createCrew(crewData: CreateCrewData): Promise<Crew> {
    //     return this.crewRepository.createCrew(crewData);
    // }

    // async updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<Crew> {
    //     return this.crewRepository.updateCrew(id, crewData);
    // }

    // async deleteCrew(id: string): Promise<void> {
    //     return this.crewRepository.deleteCrew(id);
    // }

    // async searchCrews(query: string): Promise<Crew[]> {
    //     return this.crewRepository.searchCrews(query);
    // }
}