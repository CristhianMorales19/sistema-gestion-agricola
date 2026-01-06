export type TipoTerreno = 'plano' | 'inclinado' | 'mixto' | 'otro';

export interface Parcel {
  id?: number;
  nombre: string;
  ubicacionDescripcion: string;
  areaHectareas: number;
  tipoTerreno?: TipoTerreno | null;
  tipoTerrenoOtro?: string | null;
  tipoTerrenoEfectivo?: string | null;
  descripcion?: string | null;
  observaciones?: string | null;
  estado?: string;
  isActiva?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateParcelDTO {
  nombre: string;
  ubicacionDescripcion: string;
  areaHectareas: number;
  tipoTerreno?: TipoTerreno | null;
  tipoTerrenoOtro?: string | null;
  descripcion?: string | null;
}

export interface UpdateParcelDTO {
  nombre?: string;
  ubicacionDescripcion?: string;
  areaHectareas?: number;
  tipoTerreno?: TipoTerreno | null;
  tipoTerrenoOtro?: string | null;
  descripcion?: string | null;
  estado?: string;
}

export interface ParcelResponse {
  success: boolean;
  data?: Parcel;
  message?: string;
}

export interface ParcelsListResponse {
  success: boolean;
  data?: Parcel[];
  total?: number;
  message?: string;
}

// Catálogo de tipos de terreno para el frontend
export const TIPOS_TERRENO_CATALOGO: { value: TipoTerreno; label: string }[] = [
  { value: 'plano', label: 'Plano' },
  { value: 'inclinado', label: 'Inclinado' },
  { value: 'mixto', label: 'Mixto' },
  { value: 'otro', label: 'Otro' }
];
