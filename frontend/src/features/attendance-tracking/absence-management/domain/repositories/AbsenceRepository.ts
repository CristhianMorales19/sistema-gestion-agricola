// src/absence-management/domain/repositories/AbsenceRepository.ts
import { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  AbsenceFilters,
  AbsenceStats 
} from '../entities/Absence';

/**
 * Contrato del repositorio de ausencias
 * Define las operaciones necesarias para gestionar ausencias
 */
export interface AbsenceRepository {
  /**
   * Obtener todas las ausencias con filtros opcionales
   */
  getAll(filters?: AbsenceFilters): Promise<Absence[]>;

  /**
   * Obtener una ausencia por ID
   */
  getById(id: string): Promise<Absence>;

  /**
   * Obtener ausencias de un trabajador específico
   */
  getByEmployeeId(trabajadorId: string): Promise<Absence[]>;

  /**
   * Crear una nueva ausencia justificada
   */
  create(data: CreateAbsenceData): Promise<Absence>;

  /**
   * Actualizar una ausencia existente
   */
  update(id: string, data: UpdateAbsenceData): Promise<Absence>;

  /**
   * Eliminar una ausencia
   */
  delete(id: string): Promise<void>;

  /**
   * Aprobar una ausencia
   */
  approve(id: string, supervisorId: number, comentarios?: string): Promise<Absence>;

  /**
   * Rechazar una ausencia
   */
  reject(id: string, supervisorId: number, comentarios?: string): Promise<Absence>;

  /**
   * Obtener estadísticas de ausencias
   */
  getStats(filters?: AbsenceFilters): Promise<AbsenceStats>;

  /**
   * Verificar si existe una ausencia para un trabajador en una fecha específica
   */
  existsForDate(trabajadorId: number, fecha: string): Promise<boolean>;

  /**
   * Subir documentación de respaldo
   */
  uploadDocument(absenceId: string, file: File): Promise<string>;
}
