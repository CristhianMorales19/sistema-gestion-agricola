import { Crew, CreateCrewData, CrewApiResponse } from '../domain/entities/Crew';
import { CrewRepository } from '../domain/repositories/CrewRepository';
import { apiService } from '../../../services/api.service';

export class ApiCrewRepository implements CrewRepository {
    private baseUrl = '/cuadrillas';

    async getAllCrews(): Promise<Crew[]> {
        const response = await apiService.get<CrewApiResponse[]>(this.baseUrl);
        
        console.log('Cuadrillas:', response.data);
        
        // Verificar si la respuesta fue exitosa
        if (!response.success) {
            throw new Error('Failed to fetch crews');
        }

        // Mapear la respuesta del backend a la interfaz Crew
        const crews: Crew[] = response.data.map((crewData: CrewApiResponse) => ({
            id: crewData.id,
            code: crewData.code,
            description: crewData.description,
            workArea: crewData.workArea,
            active: crewData.active,
            workers: crewData.workers.map((worker: any) => ({
                id: worker.id,
                name: worker.name,
                identification: worker.identification,
            })),
        }));

        return crews;
    }

    async getCrewByCodeOrArea(codeOrArea: string): Promise<Crew[]> {

        const response = await apiService.get<CrewApiResponse[]>(`${this.baseUrl}/${encodeURIComponent(codeOrArea)}`);

        console.log('Cuadrillas:', response.data);
        // Verificar si la respuesta fue exitosa
        if (!response.success) {
            throw new Error('Failed to fetch crews');
        }

        // Mapear la respuesta del backend a la interfaz Crew
        const crews: Crew[] = response.data.map((crewData: CrewApiResponse) => ({
            id: crewData.id,
            code: crewData.code,
            description: crewData.description,
            workArea: crewData.workArea,
            active: crewData.active,
            workers: crewData.workers.map((worker: any) => ({
                id: worker.id,
                name: worker.name,
                identification: worker.identification,
            })),
        }));

        return crews;
    }

    // async createCrew(crewData: CreateCrewData): Promise<Crew> {
    //     const response = await fetch(this.baseUrl, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(crewData),
    //     });
    //     if (!response.ok) throw new Error('Failed to create crew');
    //     return response.json();
    // }

    // async updateCrew(id: string, crewData: Partial<CreateCrewData>): Promise<Crew> {
    //     const response = await fetch(`${this.baseUrl}/${id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(crewData),
    //     });
    //     if (!response.ok) throw new Error('Failed to update crew');
    //     return response.json();
    // }

    // async deleteCrew(id: string): Promise<void> {
    //     const response = await fetch(`${this.baseUrl}/${id}`, {
    //     method: 'DELETE',
    //     });
    //     if (!response.ok) throw new Error('Failed to delete crew');
    // }

    // async searchCrews(query: string): Promise<Crew[]> {
    //     const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
    //     if (!response.ok) throw new Error('Failed to search crews');
    //     return response.json();
    // }
}