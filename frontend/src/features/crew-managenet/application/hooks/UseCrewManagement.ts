import { useState, useCallback } from 'react';
import { Crew, CreateCrewData } from '../../domain/entities/Crew';
import { CrewUseCases } from '../../domain/use-cases/CrewUseCases';
import { ApiCrewRepository } from '../../infrastructure/ApiCrewRepository';

const crewRepository = new ApiCrewRepository();
const crewUseCases = new CrewUseCases(crewRepository);

export const UseCrewManagement = () => {
    const [crews, setCrews] = useState<Crew[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCrews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const crewsData = await crewUseCases.getAllCrews();
            setCrews(crewsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch crews');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCrews = useCallback(async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const searchResults = await crewUseCases.getCrewByCodeOrArea(query);
            setCrews(searchResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search crews');
        } finally {
            setLoading(false);
        }
    }, []);

    // const createCrew = useCallback(async (crewData: CreateCrewData): Promise<Crew> => {
    //     setError(null);
    //     try {
    //     const newCrew = await crewUseCases.createCrew(crewData);
    //     await fetchCrews(); // Refresh the list
    //     return newCrew;
    //     } catch (err) {
    //     const errorMessage = err instanceof Error ? err.message : 'Failed to create crew';
    //     setError(errorMessage);
    //     throw new Error(errorMessage);
    //     }
    // }, [fetchCrews]);

    // const updateCrew = useCallback(async (id: string, crewData: Partial<CreateCrewData>): Promise<Crew> => {
    //     setError(null);
    //     try {
    //     const updatedCrew = await crewUseCases.updateCrew(id, crewData);
    //     await fetchCrews(); // Refresh the list
    //     return updatedCrew;
    //     } catch (err) {
    //     const errorMessage = err instanceof Error ? err.message : 'Failed to update crew';
    //     setError(errorMessage);
    //     throw new Error(errorMessage);
    //     }
    // }, [fetchCrews]);

    // const deleteCrew = useCallback(async (id: string) => {
    //     setError(null);
    //     try {
    //     await crewUseCases.deleteCrew(id);
    //     await fetchCrews(); // Refresh the list
    //     } catch (err) {
    //     const errorMessage = err instanceof Error ? err.message : 'Failed to delete crew';
    //     setError(errorMessage);
    //     throw new Error(errorMessage);
    //     }
    // }, [fetchCrews]);

    return {
        crews,
        loading,
        error,
        fetchCrews,
        searchCrews,
        // createCrew,
        // updateCrew,
        // deleteCrew,
    };
};