import { useState, useCallback, useMemo } from 'react';
import { Crew, CreateCrewData } from '../../domain/entities/Crew';
import { CrewService } from '../services/CrewService';
import { useMessage } from '../../../../app/providers/MessageProvider';

export const UseCrewManagement = () => {
    const [crews, setCrews] = useState<Crew[]>([]);
    const [loading, setLoading] = useState(false);
    const { showMessage } = useMessage();
    const crewService = useMemo(() => new CrewService(), []);

    const fetchCrews = useCallback(async () => {
        setLoading(true);
        const result = await crewService.getAllCrews();
        setLoading(false);
        if (!result.success) {
            showMessage('error', result.error.message);
            return;
        }
        setCrews(result.data);
    }, [showMessage, crewService]);

    const searchCrews = useCallback(async (query: string) => {
        setLoading(true);
        const result = await crewService.getCrewByCodeOrArea(query);
        setLoading(false);
        if (!result.success) {
            showMessage('error', result.error.message);
            return;
        }
        setCrews(result.data);
    }, [showMessage]);

    const createCrew = useCallback(async (crewData: CreateCrewData) => {
        setLoading(true);
        const result = await crewService.createCrew(crewData);
        setLoading(false);
        if (result.success) {
            showMessage('success', result.data);
            await fetchCrews();
            return true;
        }
        showMessage('error', result.error.message);
        return false;
    }, [fetchCrews, showMessage]);

    const updateCrew = useCallback(async (id: string, crewData: Partial<CreateCrewData>) => {
        setLoading(true);
        const result = await crewService.updateCrew(id, crewData);
        setLoading(false);
        if (result.success) {
            showMessage('success', result.data);
            await fetchCrews();
            return true;
        }
        showMessage('error', result.error.message);
        return false;
    }, [fetchCrews, showMessage]);

    const deleteCrew = useCallback(async (id: string) => {
        setLoading(true);
        const result = await crewService.deleteCrew(id);
        setLoading(false);
        if (result.success) {
            showMessage('success', result.data);
            await fetchCrews();
            return true;
        }
        showMessage('error', result.error.message);
        return false;
    }, [fetchCrews, showMessage]);

    return {
        crews,
        loading,
        fetchCrews,
        searchCrews,
        createCrew,
        updateCrew,
        deleteCrew,
    };
};