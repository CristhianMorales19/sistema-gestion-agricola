/*
 * Entidad de Dominio: Parcela
 * Representa una parcela de trabajo en el sistema agrícola
 * Usa campos de la tabla mom_parcela existente
 */

export interface IParcelRecord {
  parcela_id?: number;
  nombre: string;
  ubicacion_descripcion: string;
  area_hectareas: number;
  tipo_terreno?: string | null;
  tipo_terreno_otro?: string | null;
  descripcion?: string | null;
  observaciones?: string | null;
  estado?: string;
  is_activa?: boolean;
  created_at?: Date;
  updated_at?: Date | null;
  created_by: number;
  updated_by?: number | null;
  deleted_at?: Date | null;
}

export class Parcel {
  private _parcela_id: number;
  private _nombre: string;
  private _ubicacion_descripcion: string;
  private _area_hectareas: number;
  private _tipo_terreno: string | null;
  private _tipo_terreno_otro: string | null;
  private _descripcion: string | null;
  private _observaciones: string | null;
  private _estado: string;
  private _is_activa: boolean;
  private _created_at: Date;
  private _updated_at: Date | null;
  private _created_by: number;
  private _updated_by: number | null;
  private _deleted_at: Date | null;

  constructor(
    parcela_id: number,
    nombre: string,
    ubicacion_descripcion: string,
    area_hectareas: number,
    tipo_terreno: string | null,
    tipo_terreno_otro: string | null,
    descripcion: string | null,
    observaciones: string | null,
    estado: string = 'disponible',
    is_activa: boolean = true,
    created_at: Date = new Date(),
    updated_at: Date | null = null,
    created_by: number = 0,
    updated_by: number | null = null,
    deleted_at: Date | null = null
  ) {
    this._parcela_id = parcela_id;
    this._nombre = nombre;
    this._ubicacion_descripcion = ubicacion_descripcion;
    this._area_hectareas = area_hectareas;
    this._tipo_terreno = tipo_terreno;
    this._tipo_terreno_otro = tipo_terreno_otro;
    this._descripcion = descripcion;
    this._observaciones = observaciones;
    this._estado = estado;
    this._is_activa = is_activa;
    this._created_at = created_at;
    this._updated_at = updated_at;
    this._created_by = created_by;
    this._updated_by = updated_by;
    this._deleted_at = deleted_at;
  }

  // Getters
  get parcela_id(): number {
    return this._parcela_id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get ubicacion_descripcion(): string {
    return this._ubicacion_descripcion;
  }

  get area_hectareas(): number {
    return this._area_hectareas;
  }

  get tipo_terreno(): string | null {
    return this._tipo_terreno;
  }

  get tipo_terreno_otro(): string | null {
    return this._tipo_terreno_otro;
  }

  get descripcion(): string | null {
    return this._descripcion;
  }

  get observaciones(): string | null {
    return this._observaciones;
  }

  get estado(): string {
    return this._estado;
  }

  get is_activa(): boolean {
    return this._is_activa;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date | null {
    return this._updated_at;
  }

  get created_by(): number {
    return this._created_by;
  }

  get updated_by(): number | null {
    return this._updated_by;
  }

  get deleted_at(): Date | null {
    return this._deleted_at;
  }

  /*
   * Obtener el tipo de terreno efectivo (catálogo o personalizado)
   */
  get tipoTerrenoEfectivo(): string | null {
    if (this._tipo_terreno === 'otro' && this._tipo_terreno_otro) {
      return this._tipo_terreno_otro;
    }
    return this._tipo_terreno;
  }

  /*
   * Verificar si usa tipo de terreno personalizado
   */
  get usaTipoTerrenoPersonalizado(): boolean {
    return this._tipo_terreno === 'otro';
  }

  /*
   * Convertir a JSON para respuestas API
   */
  toJSON(): object {
    return {
      parcela_id: this._parcela_id,
      nombre: this._nombre,
      ubicacion_descripcion: this._ubicacion_descripcion,
      area_hectareas: this._area_hectareas,
      tipo_terreno: this._tipo_terreno,
      tipo_terreno_otro: this._tipo_terreno_otro,
      tipo_terreno_efectivo: this.tipoTerrenoEfectivo,
      descripcion: this._descripcion,
      observaciones: this._observaciones,
      estado: this._estado,
      is_activa: this._is_activa,
      created_at: this._created_at,
      updated_at: this._updated_at,
      created_by: this._created_by,
      updated_by: this._updated_by
    };
  }
}
