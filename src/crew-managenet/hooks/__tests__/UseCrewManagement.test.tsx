// src/crew-managenet/hooks/__tests__/UseCrewManagement.test.tsx
import { renderHook, act } from '@testing-library/react';
import { UseCrewManagement } from '../UseCrewManagement';
import { Crew } from '../../domain/entities/Crew';

// Creamos los datos mock
const mockCrews: Crew[] = [
  { id: '1', code: 'C001', area: 'Area1' },
  { id: '2', code: 'C002', area: 'Area2' },
];

// Creamos un mock de CrewUseCases
const mockCrewUseCases = {
  getAllCrews: jest.fn(),
  getCrewByCodeOrArea: jest.fn(),
};

describe('UseCrewManagement hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchCrews carga las cuadrillas correctamente', async () => {
    mockCrewUseCases.getAllCrews.mockResolvedValue(mockCrews);

    const { result } = renderHook(() => UseCrewManagement(mockCrewUseCases as any));

    await act(async () => {
      await result.current.fetchCrews();
    });

    expect(mockCrewUseCases.getAllCrews).toHaveBeenCalled();
    expect(result.current.crews).toEqual(mockCrews);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('searchCrews filtra las cuadrillas correctamente', async () => {
    mockCrewUseCases.getCrewByCodeOrArea.mockResolvedValue([mockCrews[0]]);

    const { result } = renderHook(() => UseCrewManagement(mockCrewUseCases as any));

    await act(async () => {
      await result.current.searchCrews('C001');
    });

    expect(mockCrewUseCases.getCrewByCodeOrArea).toHaveBeenCalledWith('C001');
    expect(result.current.crews).toEqual([mockCrews[0]]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('maneja errores correctamente en fetchCrews', async () => {
    const errorMessage = 'Error de prueba';
    mockCrewUseCases.getAllCrews.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => UseCrewManagement(mockCrewUseCases as any));

    await act(async () => {
      await result.current.fetchCrews();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('maneja errores correctamente en searchCrews', async () => {
    const errorMessage = 'Error de prueba';
    mockCrewUseCases.getCrewByCodeOrArea.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => UseCrewManagement(mockCrewUseCases as any));

    await act(async () => {
      await result.current.searchCrews('C001');
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });
});
