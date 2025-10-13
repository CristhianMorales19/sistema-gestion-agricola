import { useState, useCallback } from 'react';
import { Crew, CreateCrewData } from '../domain/entities/Crew';
import { CrewUseCases } from '../use-cases/CrewUseCases';
import { ApiCrewRepository } from '../infrastructure/ApiCrewRepository';

const crewRepository = new ApiCrewRepository();
const crewUseCases = new CrewUseCases(crewRepository);

export const UseCrewManagement = (crewUseCasesInstance?: CrewUseCases) => {
    const crewUseCases = crewUseCasesInstance ?? new CrewUseCases(new ApiCrewRepository());
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
    }, [crewUseCases]);

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
    }, [crewUseCases]);

    return { crews, loading, error, fetchCrews, searchCrews };
};
