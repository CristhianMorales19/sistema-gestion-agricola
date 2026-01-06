// src/features/parcel-management/index.ts
export { useParcelManagement } from './application/hooks/useParcelManagement';
export { ParcelService } from './application/ParcelService';
export { ParcelRepository } from './infrastructure/ParcelRepository';
export type { Parcel, CreateParcelDTO, UpdateParcelDTO, TipoTerreno } from './domain/entities/Parcel';
export { TIPOS_TERRENO_CATALOGO } from './domain/entities/Parcel';

// Exportar desde el barrel de components
export { ParcelManagementView, ParcelTable, NewParcelForm } from './presentation/components';

// Exportar página
export { ParcelManagementPage } from './pages';
