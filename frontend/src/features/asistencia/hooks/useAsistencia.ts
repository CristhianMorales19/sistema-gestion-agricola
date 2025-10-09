import { useCallback, useEffect, useRef, useState } from 'react';
import { AsistenciaService, RegistrarEntradaDTO } from '../services/AsistenciaService';

interface UseAsistenciaOptions {
  service: AsistenciaService;
  autoSyncIntervalMs?: number;
  /** Callback opcional tras registro exitoso u offline para enriquecer historial */
  onAfterRegistro?: (context: { offline: boolean; data: RegistrarEntradaDTO; resultado?: any }) => Array<{ tipo: 'success'|'error'|'info'; mensaje: string }> | void;
}

export function useAsistencia({ service, autoSyncIntervalMs = 15000, onAfterRegistro }: UseAsistenciaOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const intervalRef = useRef<any>(null);
  const [historial, setHistorial] = useState<Array<{ tipo: 'success'|'error'|'info'; mensaje: string; ts: number }>>([]);

  const registrarEntrada = useCallback(async (data: RegistrarEntradaDTO) => {
    setLoading(true);
    setError(null);
    setMensaje(null);
    try {
      const res = await service.registrarEntrada(data);
      if (res.offline) {
        const m = 'Entrada guardada offline. Se sincronizará automáticamente.';
        setMensaje(m);
        setHistorial(h => [{ tipo:'info' as const, mensaje: m, ts: Date.now() }, ...h].slice(0,20));
        if (onAfterRegistro) {
          const extra = onAfterRegistro({ offline: true, data, resultado: res.resultado });
          if (Array.isArray(extra) && extra.length) {
            setHistorial(h => [...extra.map(e => ({ ...e, ts: Date.now() })), ...h].slice(0,20));
          }
        }
      } else {
        const m = '✔️ Entrada registrada correctamente';
        setMensaje(m);
        setHistorial(h => [{ tipo:'success' as const, mensaje: m, ts: Date.now() }, ...h].slice(0,20));
        if (onAfterRegistro) {
          const extra = onAfterRegistro({ offline: false, data, resultado: res.resultado });
          if (Array.isArray(extra) && extra.length) {
            setHistorial(h => [...extra.map(e => ({ ...e, ts: Date.now() })), ...h].slice(0,20));
          }
        }
      }
    } catch (e: any) {
      let msg = e.message || 'Error desconocido';
      if (/409/.test(msg) || /Ya existe/.test(msg)) {
        msg = '⚠️ Este trabajador ya tiene una entrada registrada para hoy';
      }
      setError(msg);
      setHistorial(h => [{ tipo:'error' as const, mensaje: msg, ts: Date.now() }, ...h].slice(0,20));
    } finally {
      setLoading(false);
    }
  }, [service, onAfterRegistro]);

  const sincronizar = useCallback(async () => {
    try {
      const enviados = await service.sincronizarPendientes();
      if (enviados > 0) {
        const m = `${enviados} entradas sincronizadas.`;
        setMensaje(m);
  setHistorial(h => [{ tipo:'success' as const, mensaje: m, ts: Date.now() }, ...h].slice(0,20));
      }
    } catch (_) {
      // ignorar
    }
  }, [service]);

  useEffect(() => {
    // Intentos periódicos de sincronización
    intervalRef.current = setInterval(() => {
      if (navigator.onLine) sincronizar();
    }, autoSyncIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sincronizar, autoSyncIntervalMs]);

  useEffect(() => {
    const handler = () => {
      if (navigator.onLine) sincronizar();
    };
    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
  }, [sincronizar]);

  return { registrarEntrada, sincronizar, loading, error, mensaje, historial };
}
