// src/absence-management/application/services/AbsenceService.ts
import { AbsenceUseCases } from '../use-cases/AbsenceUseCases';
import { ApiAbsenceRepository } from '../infrastructure/ApiAbsenceRepository';
import { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  AbsenceFilters,
  AbsenceStats 
} from '../../domain/entities/Absence';

/**
 * Servicio de aplicación para ausencias
 * Orquesta los casos de uso y maneja la lógica de aplicación
 */
export class AbsenceService {
  private useCases: AbsenceUseCases;

  constructor() {
    const repository = new ApiAbsenceRepository();
    this.useCases = new AbsenceUseCases(repository);
  }

  /**
   * Obtener todas las ausencias
   */
  async getAllAbsences(filters?: AbsenceFilters): Promise<Absence[]> {
    try {
      return await this.useCases.getAllAbsences(filters);
    } catch (error: any) {
      console.error('Error al obtener ausencias:', error);
      throw new Error(error.message || 'Error al cargar las ausencias');
    }
  }

  /**
   * Obtener ausencia por ID
   */
  async getAbsenceById(id: string): Promise<Absence> {
    try {
      return await this.useCases.getAbsenceById(id);
    } catch (error: any) {
      console.error('Error al obtener ausencia:', error);
      throw new Error(error.message || 'Error al cargar la ausencia');
    }
  }

  /**
   * Obtener ausencias de un trabajador
   */
  async getEmployeeAbsences(trabajadorId: string): Promise<Absence[]> {
    try {
      return await this.useCases.getEmployeeAbsences(trabajadorId);
    } catch (error: any) {
      console.error('Error al obtener ausencias del trabajador:', error);
      throw new Error(error.message || 'Error al cargar las ausencias del trabajador');
    }
  }

  /**
   * Registrar nueva ausencia
   */
  async registerAbsence(data: CreateAbsenceData): Promise<Absence> {
    try {
      return await this.useCases.registerAbsence(data);
    } catch (error: any) {
      console.error('Error al registrar ausencia:', error);
      throw new Error(error.message || 'Error al registrar la ausencia');
    }
  }

  /**
   * Actualizar ausencia
   */
  async updateAbsence(id: string, data: UpdateAbsenceData): Promise<Absence> {
    try {
      return await this.useCases.updateAbsence(id, data);
    } catch (error: any) {
      console.error('Error al actualizar ausencia:', error);
      throw new Error(error.message || 'Error al actualizar la ausencia');
    }
  }

  /**
   * Eliminar ausencia
   */
  async deleteAbsence(id: string): Promise<void> {
    try {
      await this.useCases.deleteAbsence(id);
    } catch (error: any) {
      console.error('Error al eliminar ausencia:', error);
      throw new Error(error.message || 'Error al eliminar la ausencia');
    }
  }

  /**
   * Aprobar ausencia
   */
  async approveAbsence(
    id: string, 
    supervisorId: number, 
    comentarios?: string
  ): Promise<Absence> {
    try {
      return await this.useCases.approveAbsence(id, supervisorId, comentarios);
    } catch (error: any) {
      console.error('Error al aprobar ausencia:', error);
      throw new Error(error.message || 'Error al aprobar la ausencia');
    }
  }

  /**
   * Rechazar ausencia
   */
  async rejectAbsence(
    id: string, 
    supervisorId: number, 
    comentarios?: string
  ): Promise<Absence> {
    try {
      return await this.useCases.rejectAbsence(id, supervisorId, comentarios);
    } catch (error: any) {
      console.error('Error al rechazar ausencia:', error);
      throw new Error(error.message || 'Error al rechazar la ausencia');
    }
  }

  /**
   * Obtener estadísticas
   */
  async getStats(filters?: AbsenceFilters): Promise<AbsenceStats> {
    try {
      return await this.useCases.getAbsenceStats(filters);
    } catch (error: any) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error(error.message || 'Error al cargar las estadísticas');
    }
  }

  /**
   * Subir documento de respaldo
   */
  async uploadDocument(absenceId: string, file: File): Promise<string> {
    try {
      return await this.useCases.uploadSupportDocument(absenceId, file);
    } catch (error: any) {
      console.error('Error al subir documento:', error);
      throw new Error(error.message || 'Error al subir el documento');
    }
  }
}

export default AbsenceService;
