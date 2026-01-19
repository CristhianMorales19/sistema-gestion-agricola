import { Crew, CreateCrewData } from "../domain/entities/crew";
import { CrewRepository } from "../domain/repositories/crew.repository";
import { apiService } from "../../../services/api.service";
import { safeCall, SafeResult } from "../../../shared/utils/safeCall";
import { Employee } from "@features/personnel-management";

export class ApiCrewRepository implements CrewRepository {
  private baseUrl = "/cuadrillas";

  async getAllCrews(): Promise<SafeResult<Crew[]>> {
    const result = await safeCall(apiService.get(this.baseUrl));
    if (!result.success)
      return { success: false, data: null, error: result.error };
    const crewData = result.data?.data as Crew[];
    return { success: true, data: crewData, error: null };
  }

  async getCrewByCodeOrArea(codeOrArea: string): Promise<SafeResult<Crew[]>> {
    const result = await safeCall(
      apiService.get(`${this.baseUrl}/${encodeURIComponent(codeOrArea)}`),
    );
    if (!result.success)
      return { success: false, data: null, error: result.error };
    const crewData = result.data?.data as Crew[];
    return { success: true, data: crewData, error: null };
  }

  async createCrew(crewData: CreateCrewData): Promise<SafeResult<string>> {
    const mappedCrew = this.mapCrew(crewData);
    const result = await safeCall(apiService.post(this.baseUrl, mappedCrew));
    if (!result.success)
      return { success: false, data: null, error: result.error };
    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  async updateCrew(
    id: number,
    crewData: Partial<CreateCrewData>,
  ): Promise<SafeResult<string>> {
    const mappedCrew = this.mapCrew(crewData);
    const result = await safeCall(
      apiService.patch(`${this.baseUrl}/${id}`, mappedCrew),
    );
    if (!result.success)
      return { success: false, data: null, error: result.error };
    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  async deleteCrew(id: number): Promise<SafeResult<string>> {
    const result = await safeCall(apiService.delete(`${this.baseUrl}/${id}`));
    if (!result.success)
      return { success: false, data: null, error: result.error };
    return {
      success: true,
      data: result.data.message!,
      error: null,
    };
  }

  private mapCrew(apiCrew: any) {
    const workerIds = apiCrew.workers.map((w: Employee) => w.id);
    return {
      ...apiCrew,
      workers: workerIds,
    };
  }
}
