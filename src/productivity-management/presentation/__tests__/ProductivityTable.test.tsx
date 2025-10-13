// src/productivity-management/presentation/__tests__/ProductivityTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductivityTable } from '../ProductivityTable';
import { ProductivityRecord } from '../../../domain/entities/Productivity';

describe('ProductivityTable', () => {
  const mockRecords: ProductivityRecord[] = [
    {
      id: '1',
      worker: { id: 'w1', name: 'John Doe', identification: '1234' },
      task: {
        id: 't1',
        name: 'Planting',
        description: '',
        unit: 'kg',
        standardPerformance: 10,
      },
      producedQuantity: 20,
      unit: 'kg',
      date: '2025-10-12',
      calculatedPerformance: 2,
      workingConditions: [],
    },
  ];

  it('renders records', () => {
    render(<ProductivityTable records={mockRecords} onEdit={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Planting')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('2.00')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<ProductivityTable records={mockRecords} onEdit={onEdit} />);

    const editButton = screen.getByLabelText('edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockRecords[0]);
  });

  it('renders delete button (even if not testing its click)', () => {
    render(<ProductivityTable records={mockRecords} onEdit={jest.fn()} />);

    const deleteButton = screen.getByLabelText('delete');
    expect(deleteButton).toBeInTheDocument();
  });
});
