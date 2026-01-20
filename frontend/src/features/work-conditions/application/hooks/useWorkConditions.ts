import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { WorkCondition, CreateWorkConditionDTO, UpdateWorkConditionDTO } from '../../domain/entities/WorkCondition';
import { WorkConditionsService } from '../WorkConditionsService';
import { WorkConditionsRepository } from '../../infrastructure/WorkConditionsRepository';

export const useWorkConditions = (initialConditions: WorkCondition[] = []) => {
  const { getAccessTokenSilently } = useAuth0();
  const [conditions, setConditions] = useState<WorkCondition[]>(initialConditions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const repository = useMemo(() => new WorkConditionsRepository(getAccessTokenSilently), [getAccessTokenSilently]);

  // Cargar todas las condiciones al montar el componente
  useEffect(() => {
    const loadConditions = async () => {
      try {
        setLoading(true);
        const data = await repository.getAll();
        console.log('📋 Condiciones cargadas del servidor:', data);
        setConditions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar condiciones');
      } finally {
        setLoading(false);
      }
    };

    loadConditions();
  }, [repository]);

  const addCondition = useCallback(
    async (newCondition: CreateWorkConditionDTO) => {
      const validation = WorkConditionsService.validateWorkCondition(newCondition);

      if (!validation.isValid) {
        setError(validation.errors.join('; '));
        return false;
      }

      try {
        setLoading(true);
        const created = await repository.create(newCondition);
        
        // Verificar si es una actualización (buscar si ya existe con la misma fecha)
        const existingIndex = conditions.findIndex(c => c.fecha === newCondition.fecha);
        
        if (existingIndex >= 0) {
          // Actualizar el existente
          setConditions((prev) => [
            ...prev.slice(0, existingIndex),
            created,
            ...prev.slice(existingIndex + 1)
          ]);
        } else {
          // Agregar nuevo
          setConditions((prev) => [...prev, created]);
        }
        
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear condición');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [repository, conditions]
  );

  const updateCondition = useCallback(
    async (id: number, updates: UpdateWorkConditionDTO) => {
      try {
        setLoading(true);
        const updated = await repository.update(id, updates);
        setConditions((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar condición');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [repository]
  );

  const removeCondition = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await repository.delete(id);
        setConditions((prev) => prev.filter((c) => c.id !== id));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar condición');
      } finally {
        setLoading(false);
      }
    },
    [repository]
  );

  const getConditionsByMonth = useCallback(
    async (month: number, year: number) => {
      try {
        setLoading(true);
        const data = await repository.getByMonth(month, year);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al obtener condiciones');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [repository]
  );

  const getStats = useCallback(() => {
    return WorkConditionsService.calculateStats(conditions);
  }, [conditions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    conditions,
    loading,
    error,
    addCondition,
    updateCondition,
    removeCondition,
    getConditionsByMonth,
    getStats,
    clearError,
  };
};
