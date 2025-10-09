// src/employee-management/application/services/EmployeeService.ts
import { CrewUseCases } from '../../domain/use-cases/CrewUseCases';
import { ApiCrewRepository } from '../../infrastructure/ApiCrewRepository';
import { Crew } from '../../domain/entities/Crew';

export class CrewService {
    private crewUseCases: CrewUseCases;

    constructor() {
        const repository = new ApiCrewRepository();
        this.crewUseCases = new CrewUseCases(repository);
    }

    async getAllCrews(): Promise<Crew[]> {
        return this.crewUseCases.getAllCrews();
    }
}