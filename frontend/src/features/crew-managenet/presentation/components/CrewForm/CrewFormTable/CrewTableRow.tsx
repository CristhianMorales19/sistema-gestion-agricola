import { Employee } from "@features/personnel-management";
import React, { useCallback } from "react";

import {
  StyledTableRow,
  BodyCell,
  ActionsContainer,
  DeleteButton,
  StyledDeleteIcon,
  AddButton,
  StyledAddIcon,
} from "../../../../../../shared/presentation/styles/Table.styles";

interface CrewTableRowProps {
  employee: Employee;
  action: "add" | "remove";
  onAction: (worker: Employee) => void;
}

export const CrewTableRow = React.memo(
  ({ employee, action, onAction }: CrewTableRowProps) => {
    const handleActionClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onAction(employee);
      },
      [employee, onAction],
    );

    return (
      <StyledTableRow hover>
        <BodyCell component="th" scope="row">
          <strong>{employee.name}</strong>
        </BodyCell>
        <BodyCell>{employee.identification}</BodyCell>
        <BodyCell>{employee.position || "Sin cargo"}</BodyCell>
        <BodyCell>
          <ActionsContainer>
            {action === "add" ? (
              <AddButton size="small" onClick={handleActionClick}>
                <StyledAddIcon />
              </AddButton>
            ) : (
              <DeleteButton size="small" onClick={handleActionClick}>
                <StyledDeleteIcon />
              </DeleteButton>
            )}
          </ActionsContainer>
        </BodyCell>
      </StyledTableRow>
    );
  },
);
