import { render, screen } from '@testing-library/react';
import { ActionLogEntradas } from '../ActionLogEntradas';

describe('ActionLogEntradas', () => {
  it('muestra "Sin registros hoy" si no hay items', () => {
    render(<ActionLogEntradas items={[]} />);
    expect(screen.getByText('Sin registros hoy')).toBeInTheDocument();
  });

  it('muestra entradas correctamente', () => {
    render(<ActionLogEntradas items={[{
      id: 1,
      trabajadorId: 1,
      documento_identidad: '123',
      nombre_completo: 'Juan Perez',
      fecha: '2025-10-12',
      horaEntrada: '08:00:00',
      ubicacion: null
    }]} />);
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});
