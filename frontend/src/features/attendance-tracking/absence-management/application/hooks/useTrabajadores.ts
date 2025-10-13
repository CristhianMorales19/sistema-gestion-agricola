// Hook para obtener lista de trabajadores
import { useState, useEffect } from 'react';
import { apiService } from '../../../../../services/api.service';

interface Trabajador {
  trabajador_id: number;
  documento_identidad: string;
  nombre_completo: string;
  email: string | null;
  is_activo: boolean;
}

export const useTrabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrabajadores = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Cargando trabajadores...');
      const response = await apiService.get('/trabajadores');
      
      console.log('📦 Respuesta completa:', response);
      console.log('✅ response.data:', response.data);
      
      // La respuesta puede venir en diferentes formatos según el endpoint
      let trabajadoresData: any[] = [];
      const data: any = response.data;
      
      // Formato 1: { trabajadores: [...], permissions: [...], scope: '...' }
      if (data.trabajadores && Array.isArray(data.trabajadores)) {
        trabajadoresData = data.trabajadores;
        console.log('📋 Formato 1 detectado - trabajadores:', trabajadoresData.length);
      }
      // Formato 2: { success: true, data: [...], message: '...' }
      else if (data.success && data.data && Array.isArray(data.data)) {
        trabajadoresData = data.data;
        console.log('📋 Formato 2 detectado - data:', trabajadoresData.length);
      }
      // Formato 3: Array directo
      else if (Array.isArray(data)) {
        trabajadoresData = data;
        console.log('📋 Formato 3 detectado - array directo:', trabajadoresData.length);
      }
      
      console.log('📋 trabajadores raw:', trabajadoresData);
      
      if (trabajadoresData.length > 0) {
        // Log detallado del primer trabajador para ver la estructura exacta
        console.log('🔬 Estructura del primer trabajador:', JSON.stringify(trabajadoresData[0], null, 2));
        
        // Mapear campos según la estructura del backend
        const trabajadoresActivos = trabajadoresData
          .filter(t => {
            // Aceptar: true, 1, "1", "true", "activo"
            const isActive = t.is_activo === true || 
                           t.is_activo === 1 || 
                           t.is_activo === '1' ||
                           t.is_activo === 'activo' ||
                           t.status === true || 
                           t.status === 1 ||
                           t.status === '1' ||
                           t.status === 'activo';
            console.log('🔎 Filtrando trabajador:', t.nombre_completo || t.name, 
              'is_activo:', t.is_activo, 
              'status:', t.status,
              'tipo is_activo:', typeof t.is_activo,
              'tipo status:', typeof t.status,
              'evaluación:', isActive);
            return isActive;
          })
          .map(t => {
            // Detectar formato del backend y mapear apropiadamente
            if (t.trabajador_id !== undefined) {
              // Formato: { trabajador_id, nombre_completo, documento_identidad, is_activo }
              return {
                trabajador_id: t.trabajador_id,
                nombre_completo: t.nombre_completo,
                documento_identidad: t.documento_identidad,
                email: t.email,
                is_activo: t.is_activo === true || t.is_activo === 1 || t.is_activo === 'activo'
              };
            } else {
              // Formato: { id, name, identification, status }
              const isActive = t.status === true || t.status === 1 || t.status === 'activo';
              return {
                trabajador_id: parseInt(t.id, 10),
                nombre_completo: t.name,
                documento_identidad: t.identification,
                email: t.email,
                is_activo: isActive
              };
            }
          });
        
        console.log('✨ Total trabajadores activos:', trabajadoresActivos.length);
        console.log('📊 Trabajadores finales:', trabajadoresActivos);
        setTrabajadores(trabajadoresActivos);
      } else {
        console.warn('⚠️ No se encontraron trabajadores');
        console.log('response.data:', data);
        setTrabajadores([]);
      }
    } catch (err: any) {
      console.error('❌ Error al cargar trabajadores:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      setError(err.message || 'Error al cargar la lista de trabajadores');
      setTrabajadores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  return {
    trabajadores,
    loading,
    error,
    refetch: fetchTrabajadores
  };
};
