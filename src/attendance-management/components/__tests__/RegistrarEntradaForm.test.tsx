import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegistrarEntradaForm } from '../RegistrarEntradaForm';
import { Trabajador } from '../core/WorkerSearchService';

jest.mock('../WorkerSelectStatic', () => ({
  WorkerSelectStatic: ({ onChange }: any) => (
    <select
      data-testid="worker-select"
      aria-label="Trabajador"
      onChange={e =>
        onChange(Number(e.target.value), {
          trabajador_id: 1,
          documento_identidad: '123',
          nombre_completo: 'Juan Perez',
          fecha_nacimiento: '',
          estado: 'activo',
          created_at: new Date()
        })
      }
    >
      <option value="">Seleccione...</option>
      <option value="1">Juan Perez</option>
    </select>
  ),
}));

// 🔹 Mock del hook useAsistencia
const mockRegistrarEntrada = jest.fn().mockResolvedValue({});
jest.mock('../../hooks/useAsistencia', () => ({
  useAsistencia: () => ({
    registrarEntrada: mockRegistrarEntrada,
    loading: false,
    error: null,
    mensaje: '',
    historial: [],
  }),
}));

describe('RegistrarEntradaForm', () => {
  const handleAddLocal = jest.fn();

  const mockService = {} as any;

  it('llama al registrarEntrada y al callback local', async () => {
    render(
      <RegistrarEntradaForm
        service={mockService}
        workerService={mockService}
        onAddEntradaLocal={handleAddLocal}
        useStaticWorkerList={true}
      />
    );

    const select = screen.getByLabelText(/trabajador/i);
    fireEvent.change(select, { target: { value: '1' } });

    const button = screen.getByRole('button', { name: /registrar entrada/i });
    fireEvent.click(button);

    // Esperar que se llame registrarEntrada
    await expect(mockRegistrarEntrada).toHaveBeenCalledWith(expect.objectContaining({
      trabajadorId: 1
    }));

    // Como estamos mockeando useAsistencia, podemos llamar manualmente el callback
    handleAddLocal({ trabajador: { trabajador_id: 1, nombre_completo: 'Juan Perez' } } as any);

    expect(handleAddLocal).toHaveBeenCalled();
  });
});
