import { Crew, CreateCrewData } from '../domain/entities/Crew';
import { CrewRepository } from '../domain/repositories/CrewRepository';
import { apiService } from '../../../services/api.service';
import { safeCall, SafeResult } from '../../../shared/utils/safeCall';

export class ApiCrewRepository implements CrewRepository {
    private baseUrl = '/cuadrillas';

    async getAllCrews(): Promise<SafeResult<Crew[]>> {
        const result = await safeCall(apiService.get(this.baseUrl));
        if (!result.success)
            return { success: false, data: null, error: result.error };
        const crewData = result.data?.data as Crew[];
        const mapped = crewData.map(this.mapCrew);
        return { success: true, data: mapped, error: null}
    }

    async getCrewByCodeOrArea(codeOrArea: string): Promise<SafeResult<Crew[]>> {
        const result = await safeCall(apiService.get(`${this.baseUrl}/${encodeURIComponent(codeOrArea)}`));
        if (!result.success)
            return { success: false, data: null, error: result.error };
        const crewData = result.data?.data as Crew[];
        const mapped = crewData.map(this.mapCrew);
        return { success: true, data: mapped, error: null}
    }

    async createCrew(crewData: CreateCrewData): Promise<SafeResult<string>> {
        const result = await safeCall(apiService.post(this.baseUrl, crewData));
        if (!result.success)
            return { success: false, data: null, error: result.error };
        return { 
            success: true, 
            data: result.data.message ?? 'Cuadrilla creada correctamente',
            error: null 
        };
    }

    async updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<SafeResult<string>> {
        const result = await safeCall(apiService.patch(`${this.baseUrl}/${id}`, crewData));
        if (!result.success)
            return { success: false, data: null, error: result.error };
        return {
            success: true, 
            data: result.data.message ?? 'Cuadrilla actualizada correctamente',
            error: null 
        };
    }

    async deleteCrew(id: string): Promise<SafeResult<string>> {
        const result = await safeCall(apiService.delete(`${this.baseUrl}/${id}`));
        if (!result.success)
            return { success: false, data: null, error: result.error };
        return {
            success: true, 
            data: result.data.message ?? 'Cuadrilla eliminada correctamente',
            error: null 
        };
    }

    private mapCrew(apiCrew: Crew): Crew {
        return {
            id: apiCrew.id,
            code: apiCrew.code,
            description: apiCrew.description,
            workArea: apiCrew.workArea,
            active: apiCrew.active,
            workers: apiCrew.workers.map((w) => ({
                id: w.id,
                name: w.name,
                identification: w.identification,
            })),
        };
    }
}