import { Crew, CreateCrewData } from "../entities/crew";
import { SafeResult } from "@shared/utils/safeCall";

export interface CrewRepository {
  getAllCrews(): Promise<SafeResult<Crew[]>>;
  getCrewByCodeOrArea(codeOrArea: string): Promise<SafeResult<Crew[]>>;
  createCrew(crewData: CreateCrewData): Promise<SafeResult<string>>;
  updateCrew(
    id: number,
    crewData: Partial<CreateCrewData>,
  ): Promise<SafeResult<string>>;
  deleteCrew(id: number): Promise<SafeResult<string>>;
}
