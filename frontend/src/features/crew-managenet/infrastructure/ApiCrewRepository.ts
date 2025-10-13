import { Crew, CreateCrewData, CrewApiResponse, ApiResponseMessage } from '../domain/entities/Crew';
import { CrewRepository } from '../domain/repositories/CrewRepository';
import { apiService } from '../../../services/api.service';
import { safeCall } from '../../../shared/utils/safeCall';

export class ApiCrewRepository implements CrewRepository {
    private baseUrl = '/cuadrillas';

    async getAllCrews(): Promise<Crew[]> {
        const result = await safeCall(apiService.get(this.baseUrl));
        if (!result.success)
            throw result.error.message;
        const crewData = result.data.data as CrewApiResponse[];
        return crewData.map(this.mapCrew);
    }

    async getCrewByCodeOrArea(codeOrArea: string): Promise<Crew[]> {
        const result = await safeCall(apiService.get(`${this.baseUrl}/${encodeURIComponent(codeOrArea)}`));
        if (!result.success) 
            throw result.error.message;
        const crewData = result.data.data as CrewApiResponse[];
        return crewData.map(this.mapCrew);
    }

    async createCrew(crewData: CreateCrewData): Promise<ApiResponseMessage> {
        const result = await safeCall(apiService.post(this.baseUrl, crewData));
        if (!result.success)
            return { success: false, message: result.error.message };
        return {
            success: result.data.success,
            message: result.data.message ?? 'Cuadrilla creada correctamente',
        };
    }

    async updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<ApiResponseMessage> {
        console.log('Updating crew with ID:', id, 'and data:', crewData);
        const result = await safeCall(apiService.patch(`${this.baseUrl}/${id}`, crewData));
        console.log('Update result:', result);
        if (!result.success)
            return { success: false, message: result.error.message };
        return {
            success: result.data.success,
            message: result.data.message ?? 'Cuadrilla actualizada correctamente',
        };
    }

    async deleteCrew(id: string): Promise<ApiResponseMessage> {
        console.log('Deleting crew with ID:', id);
        const result = await safeCall(apiService.delete(`${this.baseUrl}/${id}`));
        console.log('Delete result:', result);
        if (!result.success)
            return { success: false, message: result.error.message };
        return {
            success: result.data.success,
            message: result.data.message ?? 'Cuadrilla eliminada correctamente',
        };
    }

    private mapCrew(apiCrew: CrewApiResponse): Crew {
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