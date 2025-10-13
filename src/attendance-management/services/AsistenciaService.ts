// Servicio de acceso a la API de asistencia.
// Maneja token Auth0 (inyectado) y soporta modo offline con cola en localStorage.

export interface RegistrarEntradaDTO {
  trabajadorId: number;
  fecha?: string; // YYYY-MM-DD
  horaEntrada?: string; // HH:mm:ss
  ubicacion?: string | null;
}

export interface RegistrarSalidaDTO {
  trabajadorId: number;
  horaSalida?: string; // HH:mm:ss
  observacion?: string;
}

interface AsistenciaServiceOptions {
  /** Base URL inicial preferida. Puede ser relativa (ej: /api/asistencia) o absoluta. */
  baseUrl?: string;
  getToken: () => Promise<string | null>;
  storageKey?: string;
  /**
   * Endpoints alternativos absolutos para fallback.
   * Ej: ["http://localhost:3000/api/asistencia","http://127.0.0.1:3000/api/asistencia"]
   */
  fallbackBaseUrls?: string[];
  /** Forzar re-probing (tests / depuración) */
  reprobe?: boolean;
}

export class AsistenciaService {
  private readonly colaKey: string;
  private resolvedBaseUrl: string | null = null;
  private probingPromise: Promise<string> | null = null;

  constructor(private readonly options: AsistenciaServiceOptions) {
    this.colaKey = options.storageKey ?? 'asistencia_offline_queue';
  }

  private buildCandidateBaseUrls(): string[] {
    const envUrl = (process.env.REACT_APP_API_ASISTENCIA_BASE || '').trim();
    const explicita = this.options.baseUrl?.trim();
    const fallbacks = this.options.fallbackBaseUrls || [];

    const sameOrigin = `${window.location.origin}/api/asistencia`;
    // Posibles hosts locales comunes
    const localHost3000 = 'http://localhost:3000/api/asistencia';
    const local127 = 'http://127.0.0.1:3000/api/asistencia';

    const lista = [envUrl, explicita, sameOrigin, localHost3000, local127, ...fallbacks]
      .filter(Boolean)
      // normalizar doble slash final
      .map(u => u!.replace(/\/$/, ''));
    // eliminar duplicados manteniendo orden
    return Array.from(new Set(lista));
  }

  private async probeBaseUrl(): Promise<string> {
    if (this.resolvedBaseUrl && !this.options.reprobe) return this.resolvedBaseUrl;
    if (this.probingPromise && !this.options.reprobe) return this.probingPromise;
    const candidates = this.buildCandidateBaseUrls();
    if (candidates.length === 0) {
      throw new Error('No hay candidatos de baseUrl para asistencia');
    }
    console.debug('[AsistenciaService] Probando baseUrls', candidates);
    this.probingPromise = (async () => {
      for (const base of candidates) {
        try {
          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), 2500);
          const resp = await fetch(`${base}/health`, { signal: controller.signal });
          clearTimeout(t);
          if (resp.ok) {
            console.debug('[AsistenciaService] baseUrl resuelta =>', base);
            this.resolvedBaseUrl = base;
            return base;
          }
        } catch (e) {
          // continuar
        }
      }
      // si ninguna responde ok, usar primera igualmente (permitir 404 y reportar)
      const fallback = candidates[0];
      console.warn('[AsistenciaService] Ningún health respondió ok, usando fallback', fallback);
      this.resolvedBaseUrl = fallback;
      return fallback;
    })();
    return this.probingPromise;
  }

  private async ensureBaseUrl(): Promise<string> {
    return this.probeBaseUrl();
  }

  async registrarEntrada(data: RegistrarEntradaDTO): Promise<{ offline: boolean; resultado?: any }> {
    // Si no hay conexión, guardar en cola
    if (!navigator.onLine) {
      this.agregarACola({ ...data, _ts: Date.now() });
      return { offline: true };
    }

    const base = await this.ensureBaseUrl();
    const url = `${base}/entrada`;
    const token = await this.options.getToken();
    console.debug('[AsistenciaService] registrarEntrada ->', url, data);
    const inicio = performance.now();
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      // Si falla por red, guardar offline
      if (resp.status === 0) {
        this.agregarACola({ ...data, _ts: Date.now() });
        return { offline: true };
      }
      let detalle: any = null;
      try { detalle = await resp.json(); } catch (_) { /* ignore */ }
      const baseMsg = detalle?.error || detalle?.message || 'Error al registrar entrada';
      const enriched = `${baseMsg} (status ${resp.status}) -> ${url}`;
      throw new Error(enriched);
    }
    const dur = (performance.now() - inicio).toFixed(0);
    const json = await resp.json();
    console.debug('[AsistenciaService] registro OK en', dur, 'ms id=', json?.id);
    return { offline: false, resultado: json };
  }

  async sincronizarPendientes(): Promise<number> {
    if (!navigator.onLine) return 0;
    const pendientes = this.obtenerCola();
    if (pendientes.length === 0) return 0;
  const base = await this.ensureBaseUrl();
  const token = await this.options.getToken();

    let enviados = 0;
    for (const item of pendientes) {
      try {
        const resp = await fetch(`${base}/entrada`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(item),
        });
        if (resp.ok) {
          enviados++;
        }
      } catch (_) {
        // si falla, mantenemos en cola restante
        break;
      }
    }

    // eliminar los primeros enviados
    if (enviados > 0) {
      const restantes = pendientes.slice(enviados);
      localStorage.setItem(this.colaKey, JSON.stringify(restantes));
    }

    return enviados;
  }

  private agregarACola(item: any) {
    const cola = this.obtenerCola();
    cola.push(item);
    localStorage.setItem(this.colaKey, JSON.stringify(cola));
  }

  private obtenerCola(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.colaKey) || '[]');
    } catch {
      return [];
    }
  }

  // Obtiene lista mínima de trabajadores activos desde el endpoint expuesto por el módulo de asistencia.
  async listarTrabajadoresActivos(): Promise<Array<{ value: number; label: string; trabajador_id: number; documento_identidad: string; nombre_completo: string }>> {
    try {
      const base = await this.ensureBaseUrl();
      const token = await this.options.getToken();
      const resp = await fetch(`${base}/trabajadores-activos`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!resp.ok) return [];
      const json: any = await resp.json();
      if (Array.isArray(json?.data)) return json.data;
      return [];
    } catch (_) {
      return [];
    }
  }

  async listarEntradasHoy(): Promise<Array<{ id: number; trabajadorId: number; documento_identidad: string; nombre_completo: string; fecha: string; horaEntrada: string; ubicacion: string | null }>> {
    try {
      const base = await this.ensureBaseUrl();
      const token = await this.options.getToken();
      const resp = await fetch(`${base}/entradas-hoy`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!resp.ok) return [];
      const json: any = await resp.json();
      if (Array.isArray(json?.data)) return json.data;
      return [];
    } catch (_) {
      return [];
    }
  }

  async listarPendientesSalida(): Promise<Array<{ asistenciaId: number; trabajadorId: number; documento_identidad: string; nombre_completo: string; horaEntrada: string }>> {
    try {
      const base = await this.ensureBaseUrl();
      const token = await this.options.getToken();
      const resp = await fetch(`${base}/pendientes-salida`, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      if (!resp.ok) return [];
      const json: any = await resp.json();
      if (Array.isArray(json?.data)) return json.data;
      return [];
    } catch { return []; }
  }

  async registrarSalida(data: RegistrarSalidaDTO): Promise<{ offline: boolean; resultado?: any }> {
    if (!navigator.onLine) {
      // No soportamos cola offline para salidas por ahora (requerir confirmación), se podría encolar similar a entradas.
      throw new Error('Sin conexión: no se puede registrar salida offline');
    }
    const base = await this.ensureBaseUrl();
    const token = await this.options.getToken();
    const resp = await fetch(`${base}/salida`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    if (!resp.ok) {
      let detalle: any = null; try { detalle = await resp.json(); } catch {}
      throw new Error(detalle?.error || 'Error al registrar salida');
    }
    const json = await resp.json();
    return { offline: false, resultado: json };
  }
}
