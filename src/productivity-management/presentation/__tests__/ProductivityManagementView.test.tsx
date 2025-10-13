// src/productivity-management/presentation/__tests__/ProductivityManagementView.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductivityManagementView } from '../ProductivityManagementView';
import { ProductivityRecord } from '../../../domain/entities/Productivity';
import { UseProductivityManagement } from '../../hooks/UseProductivityManagement';

jest.mock('../../hooks/UseProductivityManagement');

const mockRecords: ProductivityRecord[] = [
  {
    id: '1',
    worker: { id: 'w1', name: 'John Doe', identification: '1234' },
    task: { id: 't1', name: 'Planting', description: '', unit: 'kg', standardPerformance: 10 },
    producedQuantity: 20,
    unit: 'kg',
    date: '2025-10-12',
    calculatedPerformance: 2,
    workingConditions: [],
  },
];

describe('ProductivityManagementView', () => {
  beforeEach(() => {
    // @ts-ignore
    UseProductivityManagement.mockReturnValue({
      productivityRecords: mockRecords,
      loading: false,
      error: null,
      fetchProductivity: jest.fn(),
    });
  });

  it('renders table with productivity records', () => {
    render(<ProductivityManagementView />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Planting')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('opens new record form when clicking "Nuevo Registro"', async () => {
    render(<ProductivityManagementView />);

    // Abrimos el modal
    fireEvent.click(screen.getByText(/Nuevo Registro/i));

    const guardarButton = await screen.findByTestId('guardar-button');
  expect(guardarButton).toBeInTheDocument();
  });

  it('shows loading state', () => {
    // @ts-ignore
    UseProductivityManagement.mockReturnValue({
      productivityRecords: [],
      loading: true,
      error: null,
      fetchProductivity: jest.fn(),
    });
    render(<ProductivityManagementView />);
    expect(screen.getByText('Cargando registros de productividad...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    // @ts-ignore
    UseProductivityManagement.mockReturnValue({
      productivityRecords: [],
      loading: false,
      error: 'Error al cargar',
      fetchProductivity: jest.fn(),
    });
    render(<ProductivityManagementView />);
    expect(screen.getByText('Error al cargar')).toBeInTheDocument();
  });
});
