// src/productivity-management/presentation/__tests__/ProductivityTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductivityTable } from '../../presentation/ProductivityTable';
import { ProductivityRecord } from '../../../domain/entities/Productivity';

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

describe('ProductivityTable', () => {
  it('renders records', () => {
    render(<ProductivityTable records={mockRecords} onEdit={jest.fn()} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Planting')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<ProductivityTable records={mockRecords} onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(mockRecords[0]);
  });
});
