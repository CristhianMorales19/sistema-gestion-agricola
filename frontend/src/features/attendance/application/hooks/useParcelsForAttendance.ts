import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Representación simplificada de una parcela para el módulo de asistencia
 */
export interface ParcelOption {
  id: number;
  nombre: string;
  ubicacionDescripcion: string;
}

/**
 * Hook para obtener la lista de parcelas disponibles para usar en el módulo de asistencia.
 * No afecta la lógica de cuadrillas ni valida disponibilidad.
 */
export const useParcelsForAttendance = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [parcels, setParcels] = useState<ParcelOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useMemo(() => 
    process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    []
  );

  const fetchParcels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${baseUrl}/parcelas`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar parcelas');
      }

      const result = await response.json();
      
      // Mapear datos del servidor al formato simplificado
      const parcelOptions: ParcelOption[] = (result.data || []).map((p: any) => ({
        id: p.parcela_id,
        nombre: p.nombre,
        ubicacionDescripcion: p.ubicacion_descripcion || '',
      }));

      setParcels(parcelOptions);
    } catch (err) {
      console.error('Error fetching parcels for attendance:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar parcelas');
      setParcels([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, baseUrl]);

  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  return {
    parcels,
    loading,
    error,
    refresh: fetchParcels,
  };
};
