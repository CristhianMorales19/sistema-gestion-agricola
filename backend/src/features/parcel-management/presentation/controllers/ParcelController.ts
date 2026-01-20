/*
 * Controlador: Parcelas
 * Maneja las solicitudes HTTP para operaciones de parcelas
 */

import { Request, Response, NextFunction } from 'express';
import { ParcelService } from '../../application/ParcelService';
import {
  validateCreateParcel,
  validateUpdateParcel,
  validatePaginationParams
} from '../../infrastructure/validation';
import {
  ParcelNotFoundError,
  DuplicateParcelError,
  InvalidParcelError,
  ParcelValidationError,
  ParcelError
} from '../../domain/ParcelError';

export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}

  /*
   * Health check
   */
  async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({ message: 'parcel-management service is running' });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Crear nueva parcela
   * POST /parcelas
   */
  async createParcel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('📨 Body recibido:', JSON.stringify(req.body, null, 2));
      const validatedData = validateCreateParcel(req.body);
      console.log('✅ Datos validados:', JSON.stringify(validatedData, null, 2));
      
      const createdBy = (req.user as any)?.usuario_id;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      const parcel = await this.parcelService.createParcel(
        validatedData.nombre,
        validatedData.ubicacionDescripcion,
        validatedData.areaHectareas,
        validatedData.tipoTerreno || null,
        validatedData.tipoTerrenoOtro || null,
        validatedData.descripcion || null,
        createdBy
      );

      console.log('💾 Parcela creada:', parcel.toJSON());

      res.status(201).json({
        success: true,
        message: 'Parcela creada exitosamente',
        data: parcel.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Obtener parcela por ID
   * GET /parcelas/:parcelId
   */
  async getParcelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { parcelId } = req.params;
      const id = parseInt(parcelId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'parcelId debe ser un número válido'
        });
        return;
      }

      const parcel = await this.parcelService.getParcelById(id);

      res.status(200).json({
        success: true,
        data: parcel.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Obtener todas las parcelas
   * GET /parcelas
   */
  async getAllParcels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit, offset, activas } = req.query as any;
      const paginationParams = validatePaginationParams(limit, offset);

      let parcels;
      if (activas === 'true') {
        parcels = await this.parcelService.getActiveParcels();
      } else {
        parcels = await this.parcelService.getAllParcels(
          paginationParams.limit,
          paginationParams.offset
        );
      }

      res.status(200).json({
        success: true,
        data: parcels.map(p => p.toJSON()),
        total: parcels.length
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Buscar parcelas
   * GET /parcelas/search/:query
   */
  async searchParcels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.params;

      const parcels = await this.parcelService.searchParcels(query || '');

      res.status(200).json({
        success: true,
        data: parcels.map(p => p.toJSON()),
        total: parcels.length
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Actualizar parcela
   * PUT /parcelas/:parcelId
   */
  async updateParcel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { parcelId } = req.params;
      const id = parseInt(parcelId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'parcelId debe ser un número válido'
        });
        return;
      }

      console.log('📨 Body recibido para actualizar:', JSON.stringify(req.body, null, 2));
      const updatedBy = (req.user as any)?.usuario_id;
      const validatedData = validateUpdateParcel(req.body);
      console.log('✅ Datos validados:', JSON.stringify(validatedData, null, 2));

      // Mapear camelCase a snake_case para el service
      const serviceData: any = {
        updated_by: updatedBy
      };
      
      if (validatedData.nombre !== undefined) serviceData.nombre = validatedData.nombre;
      if (validatedData.ubicacionDescripcion !== undefined) serviceData.ubicacion_descripcion = validatedData.ubicacionDescripcion;
      if (validatedData.areaHectareas !== undefined) serviceData.area_hectareas = validatedData.areaHectareas;
      if (validatedData.tipoTerreno !== undefined) serviceData.tipo_terreno = validatedData.tipoTerreno;
      if (validatedData.tipoTerrenoOtro !== undefined) serviceData.tipo_terreno_otro = validatedData.tipoTerrenoOtro;
      if (validatedData.descripcion !== undefined) serviceData.descripcion = validatedData.descripcion;
      if (validatedData.observaciones !== undefined) serviceData.observaciones = validatedData.observaciones;
      if (validatedData.estado !== undefined) serviceData.estado = validatedData.estado;

      console.log('📤 Datos para el service:', JSON.stringify(serviceData, null, 2));
      
      const parcel = await this.parcelService.updateParcel(id, serviceData);

      res.status(200).json({
        success: true,
        message: 'Parcela actualizada exitosamente',
        data: parcel.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Eliminar parcela (soft delete)
   * DELETE /parcelas/:parcelId
   */
  async deleteParcel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { parcelId } = req.params;
      const id = parseInt(parcelId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'parcelId debe ser un número válido'
        });
        return;
      }

      await this.parcelService.deleteParcel(id);

      res.status(200).json({
        success: true,
        message: 'Parcela eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Manejador de errores del módulo
   */
  handleError(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('❌ Error en ParcelController:', error);

    if (error instanceof ParcelNotFoundError) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: error.message
      });
      return;
    }

    if (error instanceof DuplicateParcelError) {
      res.status(409).json({
        success: false,
        error: 'DUPLICATE',
        message: error.message
      });
      return;
    }

    if (error instanceof InvalidParcelError || error instanceof ParcelValidationError) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.message
      });
      return;
    }

    if (error.message.startsWith('Errores de validación:')) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Error interno del servidor'
    });
  }
}
