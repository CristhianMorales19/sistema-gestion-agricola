/*
 * Servicio de Aplicación: Condiciones de Trabajo
 * Orquesta las operaciones de condiciones del dominio
 */

import { WorkCondition, IWorkConditionRecord } from '../domain/WorkCondition';
import { IWorkConditionRepository } from '../domain/WorkConditionRepository';
import {
  WorkConditionNotFoundError,
  DuplicateWorkConditionError,
  InvalidWorkConditionError,
  InvalidDateFormatError
} from '../domain/WorkConditionError';

export class WorkConditionService {
  constructor(private readonly workConditionRepository: IWorkConditionRepository) {}

  /*
   * Crear nueva condición de trabajo
   * Si ya existe un registro para esa fecha, lo actualiza en su lugar
   */
  async createWorkCondition(
    fecha_at: Date,
    condicion_general: string,
    nivel_dificultad: string,
    observaciones: string | null,
    usuario_registro: number,
    created_by: number
  ): Promise<{ workCondition: WorkCondition; isUpdate: boolean }> {
    // Validar condición general
    const validCondiciones = ['despejado', 'lluvioso', 'muy_caluroso', 'nublado'];
    if (!validCondiciones.includes(condicion_general)) {
      throw new InvalidWorkConditionError('condicion_general', condicion_general);
    }

    // Validar nivel de dificultad
    const validNiveles = ['normal', 'dificil', 'muy_dificil'];
    if (!validNiveles.includes(nivel_dificultad)) {
      throw new InvalidWorkConditionError('nivel_dificultad', nivel_dificultad);
    }

    // Verificar si ya existe un registro para esa fecha
    const existingRecord = await this.workConditionRepository.findByDate(fecha_at);
    
    if (existingRecord) {
      // Actualizar el registro existente en lugar de lanzar error
      const updateData: Partial<IWorkConditionRecord> = {
        condicion_general,
        nivel_dificultad,
        observaciones: observaciones || null,
        updated_at: new Date()
      };
      
      const updatedWorkCondition = await this.workConditionRepository.update(
        existingRecord.condicion_id,
        updateData
      );
      
      return {
        workCondition: updatedWorkCondition,
        isUpdate: true // Bandera para saber que fue actualización
      };
    }

    // Crear el registro si no existe
    const record: IWorkConditionRecord = {
      fecha_at,
      condicion_general,
      nivel_dificultad,
      observaciones: observaciones || null,
      usuario_registro,
      created_at: new Date(),
      updated_at: new Date(),
      created_by
    };

    const newWorkCondition = await this.workConditionRepository.create(record);
    
    return {
      workCondition: newWorkCondition,
      isUpdate: false // Bandera para saber que fue creación
    };
  }

  /*
   * Obtener condición por ID
   */
  async getWorkConditionById(condicion_id: number): Promise<WorkCondition> {
    const workCondition = await this.workConditionRepository.findById(condicion_id);

    if (!workCondition) {
      throw new WorkConditionNotFoundError(condicion_id);
    }

    return workCondition;
  }

  /*
   * Obtener condición por fecha
   */
  async getWorkConditionByDate(fecha_at: Date): Promise<WorkCondition | null> {
    return this.workConditionRepository.findByDate(fecha_at);
  }

  /*
   * Obtener condiciones por mes
   */
  async getWorkConditionsByMonth(year: number, month: number): Promise<WorkCondition[]> {
    if (month < 1 || month > 12) {
      throw new InvalidWorkConditionError('month', month);
    }

    if (year < 2000 || year > 2100) {
      throw new InvalidWorkConditionError('year', year);
    }

    return this.workConditionRepository.findByMonth(year, month);
  }

  /*
   * Obtener todas las condiciones
   */
  async getAllWorkConditions(limit?: number, offset?: number): Promise<WorkCondition[]> {
    return this.workConditionRepository.findAll(limit, offset);
  }

  /*
   * Actualizar condición
   */
  async updateWorkCondition(
    condicion_id: number,
    data: {
      condicion_general?: string;
      nivel_dificultad?: string;
      observaciones?: string | null;
      updated_by?: number;
    }
  ): Promise<WorkCondition> {
    // Validar que existe
    const existing = await this.getWorkConditionById(condicion_id);

    // Validar datos si se proporcionan
    if (data.condicion_general) {
      const validCondiciones = ['despejado', 'lluvioso', 'muy_caluroso', 'nublado'];
      if (!validCondiciones.includes(data.condicion_general)) {
        throw new InvalidWorkConditionError('condicion_general', data.condicion_general);
      }
    }

    if (data.nivel_dificultad) {
      const validNiveles = ['normal', 'dificil', 'muy_dificil'];
      if (!validNiveles.includes(data.nivel_dificultad)) {
        throw new InvalidWorkConditionError('nivel_dificultad', data.nivel_dificultad);
      }
    }

    // Actualizar
    const updateData: Partial<IWorkConditionRecord> = {
      ...data,
      updated_at: new Date()
    };

    return this.workConditionRepository.update(condicion_id, updateData);
  }

  /*
   * Eliminar condición (soft delete)
   */
  async deleteWorkCondition(condicion_id: number): Promise<void> {
    // Validar que existe
    await this.getWorkConditionById(condicion_id);

    // Realizar soft delete
    await this.workConditionRepository.softDelete(condicion_id);
  }
}
