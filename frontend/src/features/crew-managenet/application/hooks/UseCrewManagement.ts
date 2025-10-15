import { useState, useCallback } from 'react';
import { Crew, CreateCrewData } from '../../domain/entities/Crew';
import { CrewService } from '../services/CrewService';
import { useMessage } from '../../../../app/providers/MessageProvider';
import { safeCall } from '../../../../shared/utils/safeCall';
const crewService = new CrewService();

export const UseCrewManagement = () => {
    const [crews, setCrews] = useState<Crew[]>([]);
    const [loading, setLoading] = useState(false);
    const { showMessage } = useMessage();

    const fetchCrews = useCallback(async () => {
        setLoading(true);
        const result = await crewService.getAllCrews();
        setLoading(false);
        if (!result.success) {
            showMessage('error', result.error.message || 'Error al cargar cuadrillas');
            return;
        }
        setCrews(result.data);
    }, [showMessage]);

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