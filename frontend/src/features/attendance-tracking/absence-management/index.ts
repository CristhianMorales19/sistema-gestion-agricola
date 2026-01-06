// src/absence-management/index.ts
export { useAbsenceManagement } from './application/hooks/useAbsenceManagement';
export { default as AbsenceService } from './application/services/AbsenceService';
export { default as AbsenceUseCases } from './domain/use-cases/AbsenceUseCases';
export { ApiAbsenceRepository } from './infrastructure/ApiAbsenceRepository';
export type { 
  Absence, 
  CreateAbsenceData, 
  UpdateAbsenceData, 
  AbsenceFilters,
  AbsenceStats,
  AbsenceResponse
} from './domain/entities/Absence';
export { ABSENCE_REASONS } from './domain/entities/Absence';

// Componentes de presentación
export { 
  AbsenceManagementView, 
  AbsenceTable, 
  RegistrarAusencia 
} from './presentation/components';
export type { RegistrarAusenciaFormData } from './presentation/components';
