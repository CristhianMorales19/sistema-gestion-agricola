/*
 * Entidad de Dominio: Condición de Trabajo
 * Representa una condición de trabajo registrada para un día específico
 * Usa campos de la tabla mot_condiciones_trabajo existente
 */

export interface IWorkConditionRecord {
  condicion_id?: number;
  fecha_at: Date;
  condicion_general: string;
  nivel_dificultad: string;
  observaciones?: string | null;
  usuario_registro: number;
  created_at?: Date;
  updated_at?: Date | null;
  created_by: number;
  updated_by?: number | null;
  deleted_at?: Date | null;
}

export class WorkCondition {
  private _condicion_id: number;
  private _fecha_at: Date;
  private _condicion_general: string;
  private _nivel_dificultad: string;
  private _observaciones: string | null;
  private _usuario_registro: number;
  private _created_at: Date;
  private _updated_at: Date | null;
  private _created_by?: number;
  private _updated_by?: number | null;
  private _deleted_at?: Date | null;

  constructor(
    condicion_id: number,
    fecha_at: Date,
    condicion_general: string,
    nivel_dificultad: string,
    observaciones: string | null,
    usuario_registro: number,
    created_at: Date = new Date(),
    updated_at: Date | null = null,
    created_by?: number,
    updated_by?: number | null,
    deleted_at?: Date | null
  ) {
    this._condicion_id = condicion_id;
    this._fecha_at = fecha_at;
    this._condicion_general = condicion_general;
    this._nivel_dificultad = nivel_dificultad;
    this._observaciones = observaciones;
    this._usuario_registro = usuario_registro;
    this._created_at = created_at;
    this._updated_at = updated_at;
    this._created_by = created_by;
    this._updated_by = updated_by;
    this._deleted_at = deleted_at;
  }

  // Getters
  get condicion_id(): number {
    return this._condicion_id;
  }

  get fecha_at(): Date {
    return this._fecha_at;
  }

  get condicion_general(): string {
    return this._condicion_general;
  }

  get nivel_dificultad(): string {
    return this._nivel_dificultad;
  }

  get observaciones(): string | null {
    return this._observaciones;
  }

  get usuario_registro(): number {
    return this._usuario_registro;
  }

  get created_at(): Date {
    return this._created_at;
  }

  get updated_at(): Date | null {
    return this._updated_at;
  }

  get created_by(): number | undefined {
    return this._created_by;
  }

  get updated_by(): number | null | undefined {
    return this._updated_by;
  }

  get deleted_at(): Date | null | undefined {
    return this._deleted_at;
  }

  // Setters
  set condicion_general(value: string) {
    this._condicion_general = value;
  }

  set nivel_dificultad(value: string) {
    this._nivel_dificultad = value;
  }

  set observaciones(value: string | null) {
    this._observaciones = value;
  }

  set updated_at(value: Date | null) {
    this._updated_at = value;
  }

  set updated_by(value: number | null | undefined) {
    this._updated_by = value;
  }

  // Serialización
  toJSON() {
    return {
      condicion_id: this._condicion_id,
      fecha_at: this._fecha_at,
      condicion_general: this._condicion_general,
      nivel_dificultad: this._nivel_dificultad,
      observaciones: this._observaciones,
      usuario_registro: this._usuario_registro,
      created_at: this._created_at,
      updated_at: this._updated_at,
      created_by: this._created_by,
      updated_by: this._updated_by,
      deleted_at: this._deleted_at
    };
  }
}
