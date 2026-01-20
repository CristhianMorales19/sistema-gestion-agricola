/*
 * Controlador: Condiciones de Trabajo
 * Maneja las solicitudes HTTP para operaciones de condiciones de trabajo
 */

import { Request, Response, NextFunction } from 'express';
import { WorkConditionService } from '../../application/WorkConditionService';
import {
  validateCreateWorkCondition,
  validateUpdateWorkCondition,
  validatePaginationParams
} from '../../infrastructure/validation';
import {
  WorkConditionNotFoundError,
  DuplicateWorkConditionError,
  InvalidWorkConditionError,
  InvalidDateFormatError,
  WorkConditionError
} from '../../domain/WorkConditionError';

export class WorkConditionController {
  constructor(private readonly workConditionService: WorkConditionService) {}

  /*
   * Health check
   */
  async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({ message: 'work-conditions service is running' });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Crear nueva condición de trabajo
   * POST /work-conditions
   * Si ya existe registro para esa fecha, lo actualiza y retorna advertencia
   */
  async createWorkCondition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('📨 Body recibido:', JSON.stringify(req.body, null, 2));
      const validatedData = validateCreateWorkCondition(req.body);
      console.log('✅ Datos validados:', JSON.stringify(validatedData, null, 2));
      const createdBy = (req.user as any)?.usuario_id;

      if (!createdBy) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
        return;
      }

      // Convertir fecha string a Date
      const fechaDate = new Date(validatedData.fecha + 'T00:00:00Z');

      const result = await this.workConditionService.createWorkCondition(
        fechaDate,
        validatedData.condicionGeneral as any,
        validatedData.nivelDificultad as any,
        validatedData.observaciones || null,
        createdBy,
        createdBy
      );
      
      console.log('💾 Resultado de servicio:', {
        isUpdate: result.isUpdate,
        workCondition: result.workCondition.toJSON()
      });

      if (result.isUpdate) {
        // Era una actualización
        res.status(200).json({
          success: true,
          message: 'Condición de trabajo actualizada',
          warning: `⚠️ Ya existía un registro para esta fecha. Se ha actualizado el registro existente.`,
          data: result.workCondition.toJSON(),
          action: 'update'
        });
      } else {
        // Era una creación
        res.status(201).json({
          success: true,
          message: 'Condición de trabajo creada exitosamente',
          data: result.workCondition.toJSON(),
          action: 'create'
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /*
   * Obtener condición por ID
   * GET /work-conditions/:workConditionId
   */
  async getWorkConditionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workConditionId } = req.params;
      const id = parseInt(workConditionId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'workConditionId debe ser un número válido'
        });
        return;
      }

      const workCondition = await this.workConditionService.getWorkConditionById(id);

      res.status(200).json({
        success: true,
        data: workCondition.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Obtener condición por fecha
   * GET /work-conditions/date/:fecha
   */
  async getWorkConditionByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fecha } = req.params;

      // Convertir fecha string a Date
      const fechaDate = new Date(fecha + 'T00:00:00Z');

      const workCondition = await this.workConditionService.getWorkConditionByDate(fechaDate);

      if (!workCondition) {
        res.status(404).json({
          success: false,
          message: `No hay condición de trabajo registrada para la fecha ${fecha}`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: workCondition.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Obtener condiciones de un mes
   * GET /work-conditions/month/:year/:month
   */
  async getWorkConditionsByMonth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { year, month } = req.params;
      const parsedYear = parseInt(year, 10);
      const parsedMonth = parseInt(month, 10);

      if (isNaN(parsedYear) || isNaN(parsedMonth)) {
        res.status(400).json({
          success: false,
          message: 'year y month deben ser números válidos'
        });
        return;
      }

      const workConditions = await this.workConditionService.getWorkConditionsByMonth(
        parsedYear,
        parsedMonth
      );

      res.status(200).json({
        success: true,
        data: workConditions.map(wc => wc.toJSON())
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Obtener todas las condiciones
   * GET /work-conditions
   */
  async getAllWorkConditions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit, offset } = req.query as any;
      const paginationParams = validatePaginationParams(limit, offset);

      const workConditions = await this.workConditionService.getAllWorkConditions(
        paginationParams.limit,
        paginationParams.offset
      );

      res.status(200).json({
        success: true,
        data: workConditions.map(wc => wc.toJSON())
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Actualizar condición
   * PUT /work-conditions/:workConditionId
   */
  async updateWorkCondition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workConditionId } = req.params;
      const id = parseInt(workConditionId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'workConditionId debe ser un número válido'
        });
        return;
      }

      const validatedData = validateUpdateWorkCondition(req.body);

      const updatedWorkCondition = await this.workConditionService.updateWorkCondition(
        id,
        validatedData as any
      );

      res.status(200).json({
        success: true,
        message: 'Condición de trabajo actualizada exitosamente',
        data: updatedWorkCondition.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  /*
   * Eliminar condición
   * DELETE /work-conditions/:workConditionId
   */
  async deleteWorkCondition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workConditionId } = req.params;
      const id = parseInt(workConditionId, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'workConditionId debe ser un número válido'
        });
        return;
      }

      await this.workConditionService.deleteWorkCondition(id);

      res.status(200).json({
        success: true,
        message: 'Condición de trabajo eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}
