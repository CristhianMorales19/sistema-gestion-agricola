/*
 * Repositorio de Infraestructura: Parcelas (Prisma)
 * Implementa la interfaz del repositorio usando Prisma
 */

import { PrismaClient } from '@prisma/client';
import { Parcel, IParcelRecord } from '../domain/Parcel';
import { IParcelRepository } from '../domain/ParcelRepository';
import { ParcelNotFoundError, DuplicateParcelError } from '../domain/ParcelError';

// Prefijo para identificar tipos de terreno personalizados
const TIPO_TERRENO_OTRO_PREFIX = 'otro:';

export class PrismaParcelRepository implements IParcelRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  /*
   * Codifica el tipo de terreno para almacenamiento
   * Si es "otro", almacena "otro:texto_personalizado"
   */
  private encodeTipoTerreno(tipo_terreno: string | null, tipo_terreno_otro: string | null): string | null {
    if (!tipo_terreno) return null;
    if (tipo_terreno === 'otro' && tipo_terreno_otro) {
      return `${TIPO_TERRENO_OTRO_PREFIX}${tipo_terreno_otro}`;
    }
    return tipo_terreno;
  }

  /*
   * Decodifica el tipo de terreno desde almacenamiento
   */
  private decodeTipoTerreno(valor: string | null): { tipo_terreno: string | null; tipo_terreno_otro: string | null } {
    if (!valor) {
      return { tipo_terreno: null, tipo_terreno_otro: null };
    }
    if (valor.startsWith(TIPO_TERRENO_OTRO_PREFIX)) {
      return {
        tipo_terreno: 'otro',
        tipo_terreno_otro: valor.substring(TIPO_TERRENO_OTRO_PREFIX.length)
      };
    }
    return { tipo_terreno: valor, tipo_terreno_otro: null };
  }

  async create(record: IParcelRecord): Promise<Parcel> {
    try {
      const tipoTerrenoEncoded = this.encodeTipoTerreno(record.tipo_terreno || null, record.tipo_terreno_otro || null);

      const parcelData = await this.prismaClient.mom_parcela.create({
        data: {
          nombre: record.nombre,
          ubicacion_descripcion: record.ubicacion_descripcion,
          area_hectareas: record.area_hectareas,
          tipo_terreno: tipoTerrenoEncoded,
          descripcion: record.descripcion || null,
          observaciones: record.observaciones || null,
          estado: record.estado || 'disponible',
          is_activa: record.is_activa ?? true,
          created_at: record.created_at || new Date(),
          updated_at: record.updated_at || new Date(),
          created_by: record.created_by,
          updated_by: record.updated_by || null
        }
      });

      return this.toDomain(parcelData);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DuplicateParcelError(record.nombre);
      }
      throw error;
    }
  }

  async findById(parcela_id: number): Promise<Parcel | null> {
    try {
      const parcelData = await this.prismaClient.mom_parcela.findUnique({
        where: { parcela_id }
      });

      if (!parcelData) {
        return null;
      }

      return this.toDomain(parcelData);
    } catch (error: any) {
      throw error;
    }
  }

  async findByNombre(nombre: string): Promise<Parcel | null> {
    try {
      const parcelData = await this.prismaClient.mom_parcela.findFirst({
        where: {
          nombre: nombre,
          deleted_at: null
        }
      });

      if (!parcelData) {
        return null;
      }

      return this.toDomain(parcelData);
    } catch (error: any) {
      throw error;
    }
  }

  async findAll(limit?: number, offset?: number): Promise<Parcel[]> {
    try {
      const parcelsData = await this.prismaClient.mom_parcela.findMany({
        where: { deleted_at: null },
        orderBy: { nombre: 'asc' },
        take: limit,
        skip: offset
      });

      return parcelsData.map(p => this.toDomain(p));
    } catch (error: any) {
      throw error;
    }
  }

  async findAllActive(): Promise<Parcel[]> {
    try {
      const parcelsData = await this.prismaClient.mom_parcela.findMany({
        where: {
          deleted_at: null,
          is_activa: true
        },
        orderBy: { nombre: 'asc' }
      });

      return parcelsData.map(p => this.toDomain(p));
    } catch (error: any) {
      throw error;
    }
  }

  async update(parcela_id: number, data: Partial<IParcelRecord>): Promise<Parcel> {
    try {
      const existingRecord = await this.prismaClient.mom_parcela.findUnique({
        where: { parcela_id }
      });

      if (!existingRecord) {
        throw new ParcelNotFoundError(parcela_id);
      }

      const updateData: any = {
        updated_at: data.updated_at || new Date()
      };

      if (data.nombre !== undefined) updateData.nombre = data.nombre;
      if (data.ubicacion_descripcion !== undefined) updateData.ubicacion_descripcion = data.ubicacion_descripcion;
      if (data.area_hectareas !== undefined) updateData.area_hectareas = data.area_hectareas;
      if (data.tipo_terreno !== undefined) {
        updateData.tipo_terreno = this.encodeTipoTerreno(data.tipo_terreno, data.tipo_terreno_otro || null);
      }
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
      if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;
      if (data.estado !== undefined) updateData.estado = data.estado;
      if (data.is_activa !== undefined) updateData.is_activa = data.is_activa;
      if (data.updated_by !== undefined) updateData.updated_by = data.updated_by;

      const updatedData = await this.prismaClient.mom_parcela.update({
        where: { parcela_id },
        data: updateData
      });

      return this.toDomain(updatedData);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new DuplicateParcelError(data.nombre || '');
      }
      throw error;
    }
  }

  async delete(parcela_id: number): Promise<void> {
    try {
      const existingRecord = await this.prismaClient.mom_parcela.findUnique({
        where: { parcela_id }
      });

      if (!existingRecord) {
        throw new ParcelNotFoundError(parcela_id);
      }

      await this.prismaClient.mom_parcela.delete({
        where: { parcela_id }
      });
    } catch (error: any) {
      throw error;
    }
  }

  async softDelete(parcela_id: number): Promise<void> {
    try {
      const existingRecord = await this.prismaClient.mom_parcela.findUnique({
        where: { parcela_id }
      });

      if (!existingRecord) {
        throw new ParcelNotFoundError(parcela_id);
      }

      await this.prismaClient.mom_parcela.update({
        where: { parcela_id },
        data: {
          deleted_at: new Date(),
          is_activa: false
        }
      });
    } catch (error: any) {
      throw error;
    }
  }

  async search(query: string): Promise<Parcel[]> {
    try {
      const parcelsData = await this.prismaClient.mom_parcela.findMany({
        where: {
          deleted_at: null,
          OR: [
            { nombre: { contains: query } },
            { ubicacion_descripcion: { contains: query } },
            { tipo_terreno: { contains: query } },
            { descripcion: { contains: query } }
          ]
        },
        orderBy: { nombre: 'asc' }
      });

      return parcelsData.map(p => this.toDomain(p));
    } catch (error: any) {
      throw error;
    }
  }

  /*
   * Mapear datos de BD a Dominio
   */
  private toDomain(data: any): Parcel {
    const { tipo_terreno, tipo_terreno_otro } = this.decodeTipoTerreno(data.tipo_terreno);

    const parcel = new Parcel(
      data.parcela_id,
      data.nombre,
      data.ubicacion_descripcion || '',
      data.area_hectareas ? Number(data.area_hectareas) : 0,
      tipo_terreno,
      tipo_terreno_otro,
      data.descripcion,
      data.observaciones || null,
      data.estado,
      data.is_activa,
      data.created_at,
      data.updated_at,
      data.created_by,
      data.updated_by,
      data.deleted_at
    );

    return parcel;
  }
}
