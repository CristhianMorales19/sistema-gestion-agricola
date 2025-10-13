import { Crew, CreateCrewData, ApiResponseMessage } from '../entities/Crew';

export interface CrewRepository {
    getAllCrews(): Promise<Crew[]>;
    getCrewByCodeOrArea(codeOrArea: string): Promise<Crew[]>;
    createCrew(crewData: CreateCrewData) : Promise<ApiResponseMessage>;
    updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<ApiResponseMessage>;
    deleteCrew(id: string): Promise<ApiResponseMessage>;
}