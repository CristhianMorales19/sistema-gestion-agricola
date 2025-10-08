import { Crew, CreateCrewData } from '../entities/Crew';

export interface CrewRepository {
    getAllCrews(): Promise<Crew[]>;
    // getCrewById(id: string): Promise<Crew | null>;
    // createCrew(crewData: CreateCrewData): Promise<Crew>;
    // updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<Crew>;
    // deleteCrew(id: string): Promise<void>;
    // searchCrews(query: string): Promise<Crew[]>;
}