// src/attendance-management/hooks/__tests__/useAsistencia.test.tsx
import React, { ReactNode } from 'react';
import { render, act } from '@testing-library/react';
import { useAsistencia } from '../useAsistencia';
import { AsistenciaService, RegistrarEntradaDTO } from '../../services/AsistenciaService';

// HookWrapper nos permite ejecutar un hook dentro de un componente para testearlo
interface HookWrapperProps {
  hookFn: () => void;
  children?: ReactNode;
}

const HookWrapper: React.FC<HookWrapperProps> = ({ hookFn, children }) => {
  hookFn();
  return <>{children}</>;
};

describe('useAsistencia', () => {
  let mockService: Partial<AsistenciaService>;
  let hookResult: ReturnType<typeof useAsistencia>;

  beforeEach(() => {
    hookResult = {} as any;

    mockService = {
      registrarEntrada: jest.fn().mockResolvedValue({ offline: false, resultado: { id: 1 } }),
      sincronizarPendientes: jest.fn().mockResolvedValue(0),
    };
  });

  it('registra entrada correctamente', async () => {
    render(
      <HookWrapper
        hookFn={() => {
          hookResult = useAsistencia({ service: mockService as AsistenciaService });
        }}
      />
    );

    const dto: RegistrarEntradaDTO = {
      trabajadorId: 1,
      fecha: new Date().toISOString(),
    };

    await act(async () => {
      await hookResult.registrarEntrada(dto);
    });

    expect(mockService.registrarEntrada).toHaveBeenCalledWith(dto);
    expect(hookResult.error).toBeNull();
    expect(hookResult.historial.length).toBeGreaterThanOrEqual(1);
    expect(hookResult.historial[0].tipo).toBe('success');
  });

  it('maneja error al registrar entrada duplicada', async () => {
    mockService.registrarEntrada = jest.fn().mockRejectedValue(new Error('409 conflict'));

    render(
      <HookWrapper
        hookFn={() => {
          hookResult = useAsistencia({ service: mockService as AsistenciaService });
        }}
      />
    );

    const dto: RegistrarEntradaDTO = {
      trabajadorId: 1,
      fecha: new Date().toISOString(),
    };

    await act(async () => {
      await hookResult.registrarEntrada(dto);
    });

    expect(hookResult.error).toMatch(/ya tiene una entrada registrada/i);
    expect(hookResult.historial[0].tipo).toBe('error');
  });

  it('sincroniza entradas pendientes', async () => {
    (mockService.sincronizarPendientes as jest.Mock).mockResolvedValue(3);

    render(
      <HookWrapper
        hookFn={() => {
          hookResult = useAsistencia({ service: mockService as AsistenciaService });
        }}
      />
    );

    await act(async () => {
      await hookResult.sincronizar();
    });

    expect(mockService.sincronizarPendientes).toHaveBeenCalled();
    expect(hookResult.historial[0].mensaje).toMatch(/3 entradas sincronizadas/);
  });
});
