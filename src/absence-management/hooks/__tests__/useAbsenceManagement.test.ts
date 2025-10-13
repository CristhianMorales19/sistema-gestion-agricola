import { renderHook, act } from '@testing-library/react';
import { useAbsenceManagement } from '../useAbsenceManagement';
import { AbsenceService } from '../../services/AbsenceService';

jest.mock('../../services/AbsenceService');

// Mock de ausencias
const mockAbsences = [
  { id: '1', trabajador_id: 'T1', fecha_ausencia: '2025-01-01', motivo: 'enfermedad', estado: 'pendiente' }
];

describe('useAbsenceManagement', () => {
  let mockService: jest.Mocked<AbsenceService>;

  beforeEach(() => {
    mockService = new AbsenceService() as jest.Mocked<AbsenceService>;
    (AbsenceService as jest.Mock).mockReturnValue(mockService);
  });

  it('debe cargar ausencias al iniciar', async () => {
    mockService.getAllAbsences.mockResolvedValue(mockAbsences);
    mockService.getStats.mockResolvedValue({ total: 1, pendientes: 1, aprobadas: 0, rechazadas: 0, por_motivo: {} });

    const { result } = renderHook(() => useAbsenceManagement());

    // Esperamos a que el efecto inicial se complete
    await act(async () => {});

    expect(result.current.absences).toHaveLength(1);
    expect(result.current.absences[0].motivo).toBe('enfermedad');
    expect(result.current.loading).toBe(false);
  });

  it('debe manejar errores al cargar ausencias', async () => {
    mockService.getAllAbsences.mockRejectedValue(new Error('Error de red'));

    const { result } = renderHook(() => useAbsenceManagement());

    await act(async () => {});

    expect(result.current.error).toBe('Error de red');
  });

  it('debe registrar una nueva ausencia', async () => {
    mockService.getAllAbsences.mockResolvedValue([]);
    mockService.getStats.mockResolvedValue({ total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0, por_motivo: {} });
    mockService.registerAbsence.mockResolvedValue(mockAbsences[0]);

    const { result } = renderHook(() => useAbsenceManagement());

    await act(async () => {});
    await act(async () => {
      await result.current.registerAbsence({
        trabajador_id: 'T1',
        fecha_ausencia: '2025-01-01',
        motivo: 'enfermedad'
      });
    });

    expect(result.current.absences).toHaveLength(1);
    expect(result.current.successMessage).toBe('Ausencia registrada exitosamente');
  });
});
