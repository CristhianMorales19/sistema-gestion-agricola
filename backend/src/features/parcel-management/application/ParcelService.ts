/*
 * Servicio de Aplicación: Parcelas
 * Orquesta las operaciones de parcelas del dominio
 */

import { Parcel, IParcelRecord } from '../domain/Parcel';
import { IParcelRepository } from '../domain/ParcelRepository';
import {
  ParcelNotFoundError,
  DuplicateParcelError,
  InvalidParcelError,
  ParcelValidationError
} from '../domain/ParcelError';

// Tipos de terreno válidos del catálogo
export const TIPOS_TERRENO_CATALOGO = ['plano', 'inclinado', 'mixto', 'otro'] as const;
export type TipoTerreno = typeof TIPOS_TERRENO_CATALOGO[number];

export class ParcelService {
  constructor(private readonly parcelRepository: IParcelRepository) {}

  /*
   * Crear nueva parcela
   * Valida unicidad del nombre y datos de entrada
   */
  async createParcel(
    nombre: string,
    ubicacion_descripcion: string,
    area_hectareas: number,
    tipo_terreno: string | null,
    tipo_terreno_otro: string | null,
    descripcion: string | null,
    created_by: number
  ): Promise<Parcel> {
    // Validar nombre único
    const existingParcel = await this.parcelRepository.findByNombre(nombre.trim());
    if (existingParcel) {
      throw new DuplicateParcelError(nombre);
    }

    // Validar tipo de terreno
    if (tipo_terreno && !TIPOS_TERRENO_CATALOGO.includes(tipo_terreno as TipoTerreno)) {
      throw new InvalidParcelError('tipo_terreno', tipo_terreno);
    }

    // Validar que si es "otro" debe tener texto personalizado
    if (tipo_terreno === 'otro' && !tipo_terreno_otro?.trim()) {
      throw new InvalidParcelError('tipo_terreno_otro', 'Se requiere especificar el tipo de terreno cuando selecciona "Otro"');
    }

    // Validar área
    if (area_hectareas <= 0) {
      throw new InvalidParcelError('area_hectareas', 'El área debe ser mayor a 0');
    }

    // Crear el registro
    const record: IParcelRecord = {
      nombre: nombre.trim(),
      ubicacion_descripcion: ubicacion_descripcion.trim(),
      area_hectareas,
      tipo_terreno: tipo_terreno || null,
      tipo_terreno_otro: tipo_terreno === 'otro' ? tipo_terreno_otro?.trim() || null : null,
      descripcion: descripcion?.trim() || null,
      estado: 'disponible',
      is_activa: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by
    };

    return this.parcelRepository.create(record);
  }

  /*
   * Obtener parcela por ID
   */
  async getParcelById(parcela_id: number): Promise<Parcel> {
    const parcel = await this.parcelRepository.findById(parcela_id);

    if (!parcel) {
      throw new ParcelNotFoundError(parcela_id);
    }

    return parcel;
  }

  /*
   * Obtener parcela por nombre
   */
  async getParcelByNombre(nombre: string): Promise<Parcel | null> {
    return this.parcelRepository.findByNombre(nombre);
  }

  /*
   * Obtener todas las parcelas
   */
  async getAllParcels(limit?: number, offset?: number): Promise<Parcel[]> {
    return this.parcelRepository.findAll(limit, offset);
  }

  /*
   * Obtener todas las parcelas activas
   */
  async getActiveParcels(): Promise<Parcel[]> {
    return this.parcelRepository.findAllActive();
  }

  /*
   * Actualizar parcela
   */
  async updateParcel(
    parcela_id: number,
    data: {
      nombre?: string;
      ubicacion_descripcion?: string;
      area_hectareas?: number;
      tipo_terreno?: string | null;
      tipo_terreno_otro?: string | null;
      descripcion?: string | null;
      observaciones?: string | null;
      estado?: string;
      updated_by?: number;
    }
  ): Promise<Parcel> {
    // Validar que existe
    const existing = await this.getParcelById(parcela_id);

    // Si se intenta cambiar el nombre, validar que no exista otro con ese nombre
    if (data.nombre && data.nombre.trim() !== existing.nombre) {
      const existingWithName = await this.parcelRepository.findByNombre(data.nombre.trim());
      if (existingWithName && existingWithName.parcela_id !== parcela_id) {
        throw new DuplicateParcelError(data.nombre);
      }
    }

    // Validar tipo de terreno si se proporciona
    if (data.tipo_terreno !== undefined) {
      if (data.tipo_terreno && !TIPOS_TERRENO_CATALOGO.includes(data.tipo_terreno as TipoTerreno)) {
        throw new InvalidParcelError('tipo_terreno', data.tipo_terreno);
      }

      // Validar texto personalizado si es "otro"
      if (data.tipo_terreno === 'otro' && !data.tipo_terreno_otro?.trim()) {
        throw new InvalidParcelError('tipo_terreno_otro', 'Se requiere especificar el tipo de terreno cuando selecciona "Otro"');
      }
    }

    // Validar área si se proporciona
    if (data.area_hectareas !== undefined && data.area_hectareas <= 0) {
      throw new InvalidParcelError('area_hectareas', 'El área debe ser mayor a 0');
    }

    const updateData: Partial<IParcelRecord> = {
      updated_at: new Date()
    };

    if (data.nombre) updateData.nombre = data.nombre.trim();
    if (data.ubicacion_descripcion) updateData.ubicacion_descripcion = data.ubicacion_descripcion.trim();
    if (data.area_hectareas !== undefined) updateData.area_hectareas = data.area_hectareas;
    if (data.tipo_terreno !== undefined) updateData.tipo_terreno = data.tipo_terreno;
    if (data.tipo_terreno !== undefined) {
      updateData.tipo_terreno_otro = data.tipo_terreno === 'otro' ? data.tipo_terreno_otro?.trim() || null : null;
    }
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion?.trim() || null;
    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones?.trim() || null;
    if (data.estado) updateData.estado = data.estado;
    if (data.updated_by) updateData.updated_by = data.updated_by;

    return this.parcelRepository.update(parcela_id, updateData);
  }

  /*
   * Eliminar parcela (soft delete)
   */
  async deleteParcel(parcela_id: number): Promise<void> {
    // Validar que existe
    await this.getParcelById(parcela_id);
    
    return this.parcelRepository.softDelete(parcela_id);
  }

  /*
   * Buscar parcelas
   */
  async searchParcels(query: string): Promise<Parcel[]> {
    if (!query.trim()) {
      return this.getAllParcels();
    }
    return this.parcelRepository.search(query.trim());
  }
}
