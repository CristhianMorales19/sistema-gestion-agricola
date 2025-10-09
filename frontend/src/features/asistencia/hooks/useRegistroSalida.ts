import { useCallback, useEffect, useState } from 'react';
import { AsistenciaService, RegistrarSalidaDTO } from '../services/AsistenciaService';

interface PendienteSalida { asistenciaId: number; trabajadorId: number; documento_identidad: string; nombre_completo: string; horaEntrada: string }

export function useRegistroSalida(service: AsistenciaService) {
  const [pendientes, setPendientes] = useState<PendienteSalida[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await service.listarPendientesSalida();
      setPendientes(data);
    } catch (e:any) {
      setError(e.message || 'Error cargando pendientes');
    } finally { setLoading(false); }
  }, [service]);

  useEffect(() => { cargar(); }, [cargar]);

  const registrarSalida = useCallback(async (dto: RegistrarSalidaDTO) => {
    setLoading(true); setError(null); setMensaje(null);
    try {
      const res = await service.registrarSalida(dto);
      setMensaje('✔️ Salida registrada correctamente');
      // Actualizar lista de pendientes removiendo trabajador
      setPendientes(prev => prev.filter(p => p.trabajadorId !== dto.trabajadorId));
      return res.resultado;
    } catch (e:any) {
      let msg = e.message || 'Error desconocido';
      if (/Ya se registró/.test(msg)) msg = '⚠️ Ya tiene salida registrada hoy';
      if (/anterior a la hora de entrada/i.test(msg)) msg = '⚠️ La hora de salida no puede ser anterior a la hora de entrada';
      setError(msg);
      throw e;
    } finally { setLoading(false); }
  }, [service]);

  return { pendientes, cargar, registrarSalida, loading, error, mensaje };
}
