// src/employee-management/application/services/EmployeeService.ts
import { CrewUseCases } from '../../domain/use-cases/CrewUseCases';
import { ApiCrewRepository } from '../../infrastructure/ApiCrewRepository';
import { Crew } from '../../domain/entities/Crew';
import { SafeResult } from '@shared/utils/safeCall';

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

    async updateCrew(id: string, crewData: Partial<any>) : Promise<SafeResult<string>> {
        return this.crewUseCases.updateCrew(id, crewData);
    }

    async deleteCrew(id: string): Promise<SafeResult<string>> {
        return this.crewUseCases.deleteCrew(id);
    }
}