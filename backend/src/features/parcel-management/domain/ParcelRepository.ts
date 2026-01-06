/*
 * Interfaz del Repositorio: Parcelas
 * Define el contrato para acceso a datos de parcelas
 */

import { Parcel, IParcelRecord } from './Parcel';

export interface IParcelRepository {
  create(data: IParcelRecord): Promise<Parcel>;
  findById(parcela_id: number): Promise<Parcel | null>;
  findByNombre(nombre: string): Promise<Parcel | null>;
  findAll(limit?: number, offset?: number): Promise<Parcel[]>;
  findAllActive(): Promise<Parcel[]>;
  update(parcela_id: number, data: Partial<IParcelRecord>): Promise<Parcel>;
  delete(parcela_id: number): Promise<void>;
  softDelete(parcela_id: number): Promise<void>;
  search(query: string): Promise<Parcel[]>;
}
