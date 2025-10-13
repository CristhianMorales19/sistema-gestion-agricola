// src/employee-management/application/services/EmployeeService.ts
import { CrewUseCases } from '../../domain/use-cases/CrewUseCases';
import { ApiCrewRepository } from '../../infrastructure/ApiCrewRepository';
import { Crew, ApiResponseMessage } from '../../domain/entities/Crew';

export class CrewService {
    private crewUseCases: CrewUseCases;

    constructor() {
        const repository = new ApiCrewRepository();
        this.crewUseCases = new CrewUseCases(repository);
    }

    async getAllCrews(): Promise<Crew[]> {
        return this.crewUseCases.getAllCrews();
    }

    async getCrewByCodeOrArea(codeOrArea: string): Promise<Crew[]> {
        return this.crewUseCases.getCrewByCodeOrArea(codeOrArea);
    }
    
    async createCrew(crewData: any): Promise<any> {
        return this.crewUseCases.createCrew(crewData);
    }

    async updateCrew(id: string, crewData: Partial<any>) : Promise<ApiResponseMessage> {
        return this.crewUseCases.updateCrew(id, crewData);
    }

    async deleteCrew(id: string): Promise<ApiResponseMessage> {
        return this.crewUseCases.deleteCrew(id);
    } 
}