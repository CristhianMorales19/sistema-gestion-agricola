// src/absence-management/domain/use-cases/AbsenceUseCases.ts
import { AbsenceRepository } from '../repositories/AbsenceRepository';
import { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  AbsenceFilters,
  AbsenceStats 
} from '../entities/Absence';

/**
 * Casos de uso para la gestión de ausencias
 * Contiene la lógica de negocio independiente de frameworks
 */
export class AbsenceUseCases {
  constructor(private repository: AbsenceRepository) {}

  /**
   * Obtener todas las ausencias con filtros
   */
  async getAllAbsences(filters?: AbsenceFilters): Promise<Absence[]> {
    return this.repository.getAll(filters);
  }

  /**
   * Obtener ausencia por ID
   */
  async getAbsenceById(id: string): Promise<Absence> {
    return this.repository.getById(id);
  }

  /**
   * Obtener ausencias de un trabajador
   */
  async getEmployeeAbsences(trabajadorId: string): Promise<Absence[]> {
    return this.repository.getByEmployeeId(trabajadorId);
  }

  /**
   * Registrar nueva ausencia justificada
   * Valida que no exista duplicado para la misma fecha
   */
  async registerAbsence(data: CreateAbsenceData): Promise<Absence> {
    // Validaciones de negocio
    this.validateAbsenceData(data);

    // Verificar si ya existe ausencia para esa fecha
    const exists = await this.repository.existsForDate(
      String(data.trabajador_id),
      data.fecha_ausencia
    );

    if (exists) {
      throw new Error('Ya existe un registro de ausencia para esta fecha y trabajador');
    }

    // Crear la ausencia
    return this.repository.create(data);
  }

  /**
   * Actualizar ausencia existente
   */
  async updateAbsence(id: string, data: UpdateAbsenceData): Promise<Absence> {
    return this.repository.update(id, data);
  }

  /**
   * Eliminar ausencia
   */
  async deleteAbsence(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  /**
   * Aprobar ausencia (solo supervisores)
   */
  async approveAbsence(
    id: string, 
    supervisorId: number, 
    comentarios?: string
  ): Promise<Absence> {
    return this.repository.approve(id, supervisorId, comentarios);
  }

  /**
   * Rechazar ausencia (solo supervisores)
   */
  async rejectAbsence(
    id: string, 
    supervisorId: number, 
    comentarios?: string
  ): Promise<Absence> {
    return this.repository.reject(id, supervisorId, comentarios);
  }

  /**
   * Obtener estadísticas de ausencias
   */
  async getAbsenceStats(filters?: AbsenceFilters): Promise<AbsenceStats> {
    return this.repository.getStats(filters);
  }

  /**
   * Subir documento de respaldo
   */
  async uploadSupportDocument(absenceId: string, file: File): Promise<string> {
    this.validateDocument(file);
    return this.repository.uploadDocument(absenceId, file);
  }

  /**
   * Validaciones de datos de ausencia
   */
  private validateAbsenceData(data: CreateAbsenceData): void {
    if (!data.trabajador_id) {
      throw new Error('El ID del trabajador es requerido');
    }

    if (!data.fecha_ausencia) {
      throw new Error('La fecha de ausencia es requerida');
    }

    if (!data.motivo) {
      throw new Error('El motivo de la ausencia es requerido');
    }

    // Validar que la fecha no sea futura (más de 7 días)
    const fechaAusencia = new Date(data.fecha_ausencia);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy.getTime() - fechaAusencia.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0 && Math.abs(diferenciaDias) > 7) {
      throw new Error('No se puede registrar una ausencia con más de 7 días de anticipación');
    }

    // Si el motivo es "otro", requiere especificación
    if (data.motivo === 'otro' && !data.motivo_personalizado) {
      throw new Error('Debe especificar el motivo cuando selecciona "Otro"');
    }
  }

  /**
   * Validar documento de respaldo
   */
  private validateDocument(file: File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    if (file.size > maxSize) {
      throw new Error('El archivo no debe superar los 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Solo se permiten archivos PDF, JPG y PNG');
    }
  }
}

export default AbsenceUseCases;
