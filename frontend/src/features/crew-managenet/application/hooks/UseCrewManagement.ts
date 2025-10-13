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
        const result = await safeCall(crewService.getAllCrews());
        if (result.success) 
            setCrews(result.data);
        else 
            showMessage('error', result.error.message);
        setLoading(false);
    }, [showMessage]);

    const searchCrews = useCallback(async (query: string) => {
        setLoading(true);
        const result = await safeCall(crewService.getCrewByCodeOrArea(query));
        if (result.success) 
            setCrews(result.data);
        else 
            showMessage('error', result.error.message);
        setLoading(false);
    }, [showMessage]);

    const createCrew = useCallback(async (crewData: CreateCrewData) => {
        setLoading(true);
        const result = await safeCall(crewService.createCrew(crewData));

        if (result.success) {
            const response = result.data; // ApiResponseMessage
            if (response.success) {
                showMessage('success', response.message);
                await fetchCrews(); // refresca la lista
                setLoading(false);
                return true;
            } else 
                showMessage('error', response.message);
        } else 
            showMessage('error', result.error.message || 'Error al crear cuadrilla');

        setLoading(false);
        return false;
    }, [fetchCrews, showMessage]);

    const updateCrew = useCallback(async (id: string, crewData: Partial<CreateCrewData>) => {
        setLoading(true);
        const result = await safeCall(crewService.updateCrew(id,  crewData));

        if (result.success) {
            const response = result.data; // ApiResponseMessage
            if (response.success) {
                showMessage('success', response.message);
                await fetchCrews(); // refresca la lista
                setLoading(false);
                return true;
            } else 
                showMessage('error', response.message);
        } else 
            showMessage('error', result.error.message || 'Error al crear cuadrilla');

        setLoading(false);
        return false;
    }, [fetchCrews, showMessage]);

    const deleteCrew = useCallback(async (id: string) => {
        setLoading(true);
        const result = await safeCall(crewService.deleteCrew(id));

        if (result.success) {
            const response = result.data; // ApiResponseMessage
            if (response.success) {
                showMessage('success', response.message);
                await fetchCrews(); // refresca la lista
                setLoading(false);
                return true;
            } else 
                showMessage('error', response.message);
        } else 
            showMessage('error', result.error.message || 'Error al crear cuadrilla');

        setLoading(false);
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