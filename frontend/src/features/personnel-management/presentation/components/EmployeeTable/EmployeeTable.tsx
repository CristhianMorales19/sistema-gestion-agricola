// src/employee-management/presentation/components/EmployeeTable/EmployeeTable.tsx
import React, { useCallback, memo } from "react";
import { TableBody, TableHead } from "@mui/material";
import { Employee } from "../../../domain/entities/employee";

import {
  StyledTableContainer,
  StyledTable,
  TableHeadRow,
  HeaderCell,
  StyledTableRow,
  BodyCell,
  StatusChip,
  ActionsContainer,
  EditButton,
  DeleteButton,
  StyledEditIcon,
  StyledDeleteIcon,
  EmptyRow,
  EmptyTableMessage,
} from "../../../../../shared/presentation/styles/Table.styles";

interface EmployeeTableProps {
  employees: Employee[];
  selectedEmployeeId?: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onSelect: (employee: Employee) => void;
}

interface EmployeeRowProps {
  employee: Employee;
  isSelected: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onSelect: (employee: Employee) => void;
}

const EmployeeRow = memo(
  ({ employee, isSelected, onEdit, onDelete, onSelect }: EmployeeRowProps) => {
    const handleRowClick = useCallback(() => {
      onSelect(employee);
    }, [employee, onSelect]);

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(employee);
      },
      [employee, onEdit],
    );

    const handleDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(employee);
      },
      [onDelete, employee],
    );

    const statusLabel = employee.status ? "Activo" : "Inactivo";

    return (
      <StyledTableRow onClick={handleRowClick} isSelected={isSelected} hover>
        <BodyCell component="th" scope="row">
          <strong>{employee.name}</strong>
        </BodyCell>
        <BodyCell>{employee.identification}</BodyCell>
        <BodyCell>
          <span>{employee.position}</span>
        </BodyCell>
        <BodyCell>{employee.hireDate}</BodyCell>
        <BodyCell>
          <StatusChip
            label={statusLabel}
            status={employee.status}
            size="small"
          />
        </BodyCell>
        <BodyCell>
          <ActionsContainer>
            <EditButton
              size="small"
              onClick={handleEditClick}
              title="Editar empleado"
            >
              <StyledEditIcon />
            </EditButton>
            <DeleteButton
              size="small"
              onClick={handleDeleteClick}
              title="Eliminar empleado"
            >
              <StyledDeleteIcon />
            </DeleteButton>
          </ActionsContainer>
        </BodyCell>
      </StyledTableRow>
    );
  },
);

EmployeeRow.displayName = "EmployeeRow";

export const EmployeeTable = ({
  employees,
  selectedEmployeeId,
  onEdit,
  onDelete,
  onSelect,
}: EmployeeTableProps) => {
  console.log("Employees in table:", employees);

  return (
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <TableHeadRow>
            <HeaderCell>Empleado</HeaderCell>
            <HeaderCell>Cédula</HeaderCell>
            <HeaderCell>Cargo</HeaderCell>
            <HeaderCell>Fecha Ingreso</HeaderCell>
            <HeaderCell>Estado</HeaderCell>
            <HeaderCell>Acciones</HeaderCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {employees.length === 0 ? (
            <EmptyRow>
              <BodyCell colSpan={6}>
                <EmptyTableMessage>
                  No hay empleados registrados
                </EmptyTableMessage>
              </BodyCell>
            </EmptyRow>
          ) : (
            employees.map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                isSelected={selectedEmployeeId === employee.id}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={onSelect}
              />
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
