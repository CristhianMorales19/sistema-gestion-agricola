import { Crew, CreateCrewData } from '../entities/Crew';

export interface CrewRepository {
    getAllCrews(): Promise<Crew[]>;
    getCrewByCodeOrArea(codeOrArea: string): Promise<Crew[]>;
    // createCrew(crewData: CreateCrewData): Promise<Crew>;
    // updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<Crew>;
    // deleteCrew(id: string): Promise<void>;
    // searchCrews(query: string): Promise<Crew[]>;
}