import { useCallback, useEffect, useState } from 'react';
import { AsistenciaService, RegistrarEntradaDTO } from '../services/AsistenciaService';

export interface EntradaHoyItem {
  id: number | string;
  trabajadorId: number;
  documento_identidad: string;
  nombre_completo: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string | null;
  horasTrabajadas?: number | null;
  ubicacion: string | null;
  offline?: boolean;
}

export function useEntradasHoy(service: AsistenciaService) {
  const [items, setItems] = useState<EntradaHoyItem[]>([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.listarEntradasHoy();
  setItems(data.map((d:any) => ({ ...d, offline: false })));
    } finally {
      setLoading(false);
    }
  }, [service]);

  const agregarLocal = useCallback((payload: { trabajador: { documento_identidad: string; nombre_completo: string; trabajador_id: number }; dto: RegistrarEntradaDTO; offline: boolean; resultado?: any }) => {
    const ahora = new Date();
    const fecha = payload.dto.fecha || ahora.toISOString().slice(0,10);
    const hora = payload.dto.horaEntrada || ahora.toISOString().substring(11,19);
    setItems(prev => [
      {
        id: payload.resultado?.id || `tmp-${Date.now()}`,
        trabajadorId: payload.trabajador.trabajador_id,
        documento_identidad: payload.trabajador.documento_identidad,
        nombre_completo: payload.trabajador.nombre_completo,
        fecha,
        horaEntrada: hora,
        ubicacion: payload.dto.ubicacion || null,
        offline: payload.offline
      },
      ...prev
    ]);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const actualizarSalida = useCallback((trabajadorId: number, horaSalida: string, horasTrabajadas: number | null) => {
    setItems(prev => prev.map(it => it.trabajadorId === trabajadorId ? { ...it, horaSalida, horasTrabajadas } : it));
  }, []);

  return { items, loading, recargar: cargar, agregarLocal, actualizarSalida };
}
