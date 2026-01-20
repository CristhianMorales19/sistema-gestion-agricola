/*
 * Repositorio de Infraestructura: Condiciones de Trabajo (Prisma)
 * Implementa la interfaz del repositorio usando Prisma
 */

import { PrismaClient } from '@prisma/client';
import { WorkCondition, IWorkConditionRecord } from '../domain/WorkCondition';
import { IWorkConditionRepository } from '../domain/WorkConditionRepository';
import { WorkConditionNotFoundError } from '../domain/WorkConditionError';

export class PrismaWorkConditionRepository implements IWorkConditionRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async create(record: IWorkConditionRecord): Promise<WorkCondition> {
    try {
      const workConditionData = await this.prismaClient.mot_condiciones_trabajo.create({
        data: {
          fecha_at: record.fecha_at,
          condicion_general: record.condicion_general,
          nivel_dificultad: record.nivel_dificultad,
          observaciones: record.observaciones || null,
          usuario_registro: record.usuario_registro,
          created_at: record.created_at || new Date(),
          updated_at: record.updated_at || new Date(),
          created_by: record.created_by,
          updated_by: record.updated_by || null
        }
      });

      return this.toDomain(workConditionData);
    } catch (error: any) {
      throw error;
    }
  }

  async findById(condicion_id: number): Promise<WorkCondition | null> {
    try {
      const workConditionData = await this.prismaClient.mot_condiciones_trabajo.findUnique({
        where: { condicion_id }
      });

      if (!workConditionData) {
        return null;
      }

      return this.toDomain(workConditionData);
    } catch (error: any) {
      throw error;
    }
  }

  async findByDate(fecha_at: Date): Promise<WorkCondition | null> {
    try {
      const workConditionData = await this.prismaClient.mot_condiciones_trabajo.findFirst({
        where: {
          fecha_at,
          deleted_at: null
        }
      });

      if (!workConditionData) {
        return null;
      }

      return this.toDomain(workConditionData);
    } catch (error: any) {
      throw error;
    }
  }

  async findByMonth(year: number, month: number): Promise<WorkCondition[]> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const workConditionsData = await this.prismaClient.mot_condiciones_trabajo.findMany({
        where: {
          fecha_at: {
            gte: startDate,
            lte: endDate
          },
          deleted_at: null
        },
        orderBy: { fecha_at: 'asc' }
      });

      return workConditionsData.map(wc => this.toDomain(wc));
    } catch (error: any) {
      throw error;
    }
  }

  async findAll(limit?: number, offset?: number): Promise<WorkCondition[]> {
    try {
      const workConditionsData = await this.prismaClient.mot_condiciones_trabajo.findMany({
        where: { deleted_at: null },
        orderBy: { fecha_at: 'desc' },
        take: limit,
        skip: offset
      });

      return workConditionsData.map(wc => this.toDomain(wc));
    } catch (error: any) {
      throw error;
    }
  }

  async update(condicion_id: number, data: Partial<IWorkConditionRecord>): Promise<WorkCondition> {
    try {
      const existingRecord = await this.prismaClient.mot_condiciones_trabajo.findUnique({
        where: { condicion_id }
      });

      if (!existingRecord) {
        throw new WorkConditionNotFoundError(condicion_id);
      }

      const updateData: any = {
        updated_at: data.updated_at || new Date()
      };

      if (data.condicion_general) updateData.condicion_general = data.condicion_general;
      if (data.nivel_dificultad) updateData.nivel_dificultad = data.nivel_dificultad;
      if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;

      const updatedData = await this.prismaClient.mot_condiciones_trabajo.update({
        where: { condicion_id },
        data: updateData
      });

      return this.toDomain(updatedData);
    } catch (error: any) {
      throw error;
    }
  }

  async delete(condicion_id: number): Promise<void> {
    try {
      const existingRecord = await this.prismaClient.mot_condiciones_trabajo.findUnique({
        where: { condicion_id }
      });

      if (!existingRecord) {
        throw new WorkConditionNotFoundError(condicion_id);
      }

      await this.prismaClient.mot_condiciones_trabajo.delete({
        where: { condicion_id }
      });
    } catch (error: any) {
      throw error;
    }
  }

  async softDelete(condicion_id: number): Promise<void> {
    try {
      const existingRecord = await this.prismaClient.mot_condiciones_trabajo.findUnique({
        where: { condicion_id }
      });

      if (!existingRecord) {
        throw new WorkConditionNotFoundError(condicion_id);
      }

      await this.prismaClient.mot_condiciones_trabajo.update({
        where: { condicion_id },
        data: { deleted_at: new Date() }
      });
    } catch (error: any) {
      throw error;
    }
  }

  /*
   * Mapear datos de BD a Dominio
   */
  private toDomain(data: any): WorkCondition {
    const workCondition = new WorkCondition(
      data.condicion_id,
      data.fecha_at,
      data.condicion_general,
      data.nivel_dificultad,
      data.observaciones,
      data.usuario_registro,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by,
      data.deleted_at
    );

    return workCondition;
  }
}
