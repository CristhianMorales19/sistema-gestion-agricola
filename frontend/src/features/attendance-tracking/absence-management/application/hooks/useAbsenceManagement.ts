// src/absence-management/application/hooks/useAbsenceManagement.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AbsenceService } from '../services/AbsenceService';
import { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  AbsenceFilters,
  AbsenceStats 
} from '../../domain/entities/Absence';

/**
 * Hook personalizado para gestionar ausencias
 * Proporciona estado y operaciones para componentes React
 */
export const useAbsenceManagement = (initialFilters?: AbsenceFilters) => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<AbsenceStats | null>(null);
  
  const absenceService = useMemo(() => new AbsenceService(), []);

  /**
   * Cargar ausencias con filtros opcionales
   */
  const loadAbsences = useCallback(async (filters?: AbsenceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await absenceService.getAllAbsences(filters || initialFilters);
      setAbsences(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las ausencias');
      console.error('Error loading absences:', err);
    } finally {
      setLoading(false);
    }
  }, [absenceService, initialFilters]);

  /**
   * Cargar estadísticas
   */
  const loadStats = useCallback(async (filters?: AbsenceFilters) => {
    try {
      const data = await absenceService.getStats(filters || initialFilters);
      setStats(data);
    } catch (err: any) {
      console.error('Error loading stats:', err);
    }
  }, [absenceService, initialFilters]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    loadAbsences();
    loadStats();
  }, [loadAbsences, loadStats]);

  /**
   * Registrar nueva ausencia
   */
  const registerAbsence = useCallback(async (data: CreateAbsenceData): Promise<Absence> => {
    try {
      const newAbsence = await absenceService.registerAbsence(data);
      setAbsences(prev => [newAbsence, ...prev]);
      setError(null);
      setSuccessMessage('Ausencia registrada exitosamente');
      loadStats(); // Actualizar estadísticas
      return newAbsence;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al registrar la ausencia';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Error registering absence:', err);
      throw err;
    }
  }, [absenceService, loadStats]);

  /**
   * Actualizar ausencia
   */
  const updateAbsence = useCallback(async (id: string, data: UpdateAbsenceData): Promise<Absence> => {
    try {
      const updatedAbsence = await absenceService.updateAbsence(id, data);
      setAbsences(prev => 
        prev.map(absence => absence.id === id ? updatedAbsence : absence)
      );
      setError(null);
      setSuccessMessage('Ausencia actualizada exitosamente');
      loadStats();
      return updatedAbsence;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar la ausencia';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Error updating absence:', err);
      throw err;
    }
  }, [absenceService, loadStats]);

  /**
   * Eliminar ausencia
   */
  const deleteAbsence = useCallback(async (id: string): Promise<void> => {
    try {
      await absenceService.deleteAbsence(id);
      setAbsences(prev => prev.filter(absence => absence.id !== id));
      setError(null);
      setSuccessMessage('Ausencia eliminada exitosamente');
      loadStats();
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar la ausencia';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Error deleting absence:', err);
      throw err;
    }
  }, [absenceService, loadStats]);

  /**
   * Aprobar ausencia
   */
  const approveAbsence = useCallback(async (
    id: string, 
    supervisorId: number, 
    comentarios?: string
  ): Promise<Absence> => {
    try {
      const approvedAbsence = await absenceService.approveAbsence(id, supervisorId, comentarios);
      setAbsences(prev => 
        prev.map(absence => absence.id === id ? approvedAbsence : absence)
      );
      setError(null);
      setSuccessMessage('Ausencia aprobada exitosamente');
      loadStats();
      return approvedAbsence;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al aprobar la ausencia';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Error approving absence:', err);
      throw err;
    }
  }, [absenceService, loadStats]);

  /**
   * Rechazar ausencia
   */
  const rejectAbsence = useCallback(async (
    id: string, 
    supervisorId: number, 
    comentarios?: string
  ): Promise<Absence> => {
    try {
      const rejectedAbsence = await absenceService.rejectAbsence(id, supervisorId, comentarios);
      setAbsences(prev => 
        prev.map(absence => absence.id === id ? rejectedAbsence : absence)
      );
      setError(null);
      setSuccessMessage('Ausencia rechazada');
      loadStats();
      return rejectedAbsence;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al rechazar la ausencia';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Error rejecting absence:', err);
      throw err;
    }
  }, [absenceService, loadStats]);

  /**
   * Subir documento
   */
  const uploadDocument = useCallback(async (absenceId: string, file: File): Promise<string> => {
    try {
      const url = await absenceService.uploadDocument(absenceId, file);
      setSuccessMessage('Documento subido exitosamente');
      return url;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al subir el documento';
      setError(errorMessage);
      console.error('Error uploading document:', err);
      throw err;
    }
  }, [absenceService]);

  /**
   * Buscar/filtrar ausencias
   */
  const searchAbsences = useCallback(async (filters: AbsenceFilters) => {
    await loadAbsences(filters);
    await loadStats(filters);
  }, [loadAbsences, loadStats]);

  /**
   * Refrescar datos
   */
  const refreshAbsences = useCallback(() => {
    loadAbsences();
    loadStats();
  }, [loadAbsences, loadStats]);

  /**
   * Limpiar mensajes
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    // Estado
    absences,
    loading,
    error,
    successMessage,
    stats,
    
    // Operaciones
    registerAbsence,
    updateAbsence,
    deleteAbsence,
    approveAbsence,
    rejectAbsence,
    uploadDocument,
    searchAbsences,
    refreshAbsences,
    clearMessages
  };
};
