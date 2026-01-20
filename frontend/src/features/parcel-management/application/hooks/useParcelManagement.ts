import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Parcel, CreateParcelDTO, UpdateParcelDTO } from '../../domain/entities/Parcel';
import { ParcelService } from '../ParcelService';
import { ParcelRepository } from '../../infrastructure/ParcelRepository';
import { useMessage } from '../../../../app/providers/MessageProvider';

export const useParcelManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [allParcels, setAllParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  const repository = useMemo(
    () => new ParcelRepository(getAccessTokenSilently),
    [getAccessTokenSilently]
  );

  const fetchParcels = useCallback(async (): Promise<Parcel[] | null> => {
    setLoading(true);
    try {
      const data = await repository.getAll();
      console.log('📋 Parcelas cargadas del servidor:', data);
      setAllParcels(data);
      setParcels(data);
      return data;
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Error al cargar parcelas');
      return null;
    } finally {
      setLoading(false);
    }
  }, [repository, showMessage]);

  // Cargar parcelas al montar el componente
  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  const searchParcels = useCallback(
    async (query: string) => {
      const q = (query ?? '').trim().toLowerCase();

      // Si no hay búsqueda, restaurar lista completa
      if (!q) {
        setParcels(allParcels);
        return;
      }

      // Asegurar que tenemos lista base cargada
      let base = allParcels;
      if (base.length === 0) {
        const fetched = await fetchParcels();
        base = fetched ?? [];
      }

      const filtered = base.filter((p) => {
        const nombre = (p.nombre ?? '').toLowerCase();
        const ubicacion = (p.ubicacionDescripcion ?? '').toLowerCase();
        const tipoTerreno = (p.tipoTerrenoEfectivo ?? p.tipoTerreno ?? '').toLowerCase();

        return (
          nombre.includes(q) ||
          ubicacion.includes(q) ||
          tipoTerreno.includes(q)
        );
      });

      setParcels(filtered);
    },
    [allParcels, fetchParcels]
  );

  const createParcel = useCallback(
    async (data: CreateParcelDTO): Promise<boolean> => {
      const validation = ParcelService.validateParcel(data);

      if (!validation.isValid) {
        showMessage('error', validation.errors.join('; '));
        return false;
      }

      setLoading(true);
      try {
        await repository.create(data);
        showMessage('success', 'Parcela creada exitosamente');
        await fetchParcels();
        return true;
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Error al crear parcela');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [repository, fetchParcels, showMessage]
  );

  const updateParcel = useCallback(
    async (id: number, data: UpdateParcelDTO): Promise<boolean> => {
      setLoading(true);
      try {
        await repository.update(id, data);
        showMessage('success', 'Parcela actualizada exitosamente');
        await fetchParcels();
        return true;
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Error al actualizar parcela');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [repository, fetchParcels, showMessage]
  );

  const deleteParcel = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      try {
        await repository.delete(id);
        showMessage('success', 'Parcela eliminada exitosamente');
        await fetchParcels();
        return true;
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Error al eliminar parcela');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [repository, fetchParcels, showMessage]
  );

  const getStats = useCallback(() => {
    return ParcelService.calculateStats(parcels);
  }, [parcels]);

  return {
    parcels,
    loading,
    refreshParcels: fetchParcels,
    searchParcels,
    createParcel,
    updateParcel,
    deleteParcel,
    getStats,
  };
};
