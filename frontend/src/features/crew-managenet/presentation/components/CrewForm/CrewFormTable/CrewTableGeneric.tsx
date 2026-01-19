import { Employee } from "@features/personnel-management";

import {
  StyledTableContainer,
  StyledTable,
  TableHeadRow,
  HeaderCell,
  BodyCell,
  EmptyRow,
  EmptyTableMessage,
} from "../../../../../../shared/presentation/styles/Table.styles";
import { Box, TableBody, TableHead } from "@mui/material";
import { CrewTableRow } from "./CrewTableRow";

interface CrewTableGenericProps {
  employees: Employee[];
  emptyMessage: string;
  action: "add" | "remove";
  onAction: (worker: Employee) => void;
}

export const CrewTableGeneric = ({
  employees,
  emptyMessage,
  action,
  onAction,
}: CrewTableGenericProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <StyledTableContainer>
        <StyledTable size="small">
          <TableHead>
            <TableHeadRow>
              <HeaderCell>Empleado</HeaderCell>
              <HeaderCell>Cédula</HeaderCell>
              <HeaderCell>Cargo</HeaderCell>
              <HeaderCell>Acción</HeaderCell>
            </TableHeadRow>
          </TableHead>

          <TableBody>
            {employees.length === 0 ? (
              <EmptyRow>
                <BodyCell colSpan={4}>
                  <EmptyTableMessage>{emptyMessage}</EmptyTableMessage>
                </BodyCell>
              </EmptyRow>
            ) : (
              employees.map((employee) => (
                <CrewTableRow
                  key={employee.id}
                  employee={employee}
                  action={action}
                  onAction={onAction}
                />
              ))
            )}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
};
