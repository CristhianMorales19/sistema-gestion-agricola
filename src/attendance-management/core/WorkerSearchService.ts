import TrabajadoresService, { Trabajador, TrabajadorListResponse } from '../../../services/trabajadores.service';

// Abstracción para principio de inversión de dependencias.
export interface WorkerSearchService {
  search(query: string): Promise<Trabajador[]>;
  getById(id: number): Promise<Trabajador | null>;
}

export class ApiWorkerSearchService implements WorkerSearchService {
  constructor(private readonly svc: TrabajadoresService) {}

  async search(query: string): Promise<Trabajador[]> {
    const resp: TrabajadorListResponse = await this.svc.getTrabajadores({ buscar: query || undefined, estado: 'activo', limit: 50 });
    return resp.data || [];
  }

  async getById(id: number): Promise<Trabajador | null> {
    try {
      const resp = await this.svc.getTrabajadorById(id);
      return resp.data;
    } catch {
      return null;
    }
  }
}

// Adaptador alternativo sin depender del TrabajadoresService global (no lo modifica).
// Usa el mismo backend origin que asistencia para evitar discrepancias de puertos.
export class DirectFetchWorkerSearchService implements WorkerSearchService {
  constructor(private readonly getToken: () => Promise<string | null>, private readonly origin: string) {}

  private base(): string { return `${this.origin.replace(/\/$/, '')}/api/trabajadores`; }

  async search(query: string): Promise<Trabajador[]> {
    const token = await this.getToken();
    const url = new URL(this.base());
    // El endpoint real admite page/limit y filtros diferentes; usamos limit alto.
    url.searchParams.set('limit', '50');
    if (query) {
      // El endpoint actual no define 'buscar', así que hacemos filtrado client-side luego.
    }
    const resp = await fetch(url.toString(), { headers: { 'Authorization': token ? `Bearer ${token}` : '' } });
    if (!resp.ok) {
      console.warn('[DirectFetchWorkerSearchService] HTTP', resp.status);
      return [];
    }
    try {
      const json: any = await resp.json();
      let lista: any[] = [];
      if (Array.isArray(json?.data)) lista = json.data;
      else if (Array.isArray(json?.trabajadores)) lista = json.trabajadores;
      // Filtrado opcional por query en cliente
      if (query) {
        const qLower = query.toLowerCase();
        lista = lista.filter(t => (
          t.nombre_completo?.toLowerCase().includes(qLower) ||
          String(t.trabajador_id).includes(qLower) ||
          t.documento_identidad?.toLowerCase().includes(qLower)
        ));
      }
      return lista as Trabajador[];
    } catch (e) {
      console.warn('[DirectFetchWorkerSearchService] parse error', e);
      return [];
    }
  }

  async getById(id: number): Promise<Trabajador | null> {
    const token = await this.getToken();
    const resp = await fetch(`${this.base()}/${id}`, { headers: { 'Authorization': token ? `Bearer ${token}` : '' } });
    if (!resp.ok) return null;
    try {
      const json: any = await resp.json();
      return (json?.data as Trabajador) || null;
    } catch {
      return null;
    }
  }
}

export type { Trabajador };
