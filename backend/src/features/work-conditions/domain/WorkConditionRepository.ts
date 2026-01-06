/*
 * Interfaz del Repositorio: Condiciones de Trabajo
 * Define el contrato para acceso a datos
 */

import { WorkCondition, IWorkConditionRecord } from './WorkCondition';

export interface IWorkConditionRepository {
  create(data: IWorkConditionRecord): Promise<WorkCondition>;
  findById(condicion_id: number): Promise<WorkCondition | null>;
  findByDate(fecha_at: Date): Promise<WorkCondition | null>;
  findByMonth(year: number, month: number): Promise<WorkCondition[]>;
  findAll(limit?: number, offset?: number): Promise<WorkCondition[]>;
  update(condicion_id: number, data: Partial<IWorkConditionRecord>): Promise<WorkCondition>;
  delete(condicion_id: number): Promise<void>;
  softDelete(condicion_id: number): Promise<void>;
}

