import React from "react";
import { TableBody, TableHead } from "@mui/material";
import { ProductivityRecord } from "../../../domain/entities/Productivity";

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

interface ProductivityTableProps {
  records: ProductivityRecord[];
  onEdit: (record: ProductivityRecord) => void;
  // onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProductivityRow = React.memo<{
  record: ProductivityRecord;
  onEdit: (record: ProductivityRecord) => void;
  // onDelete: (id: string) => void;
}>(({ record, onEdit }) => {
  const handleEditClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(record);
    },
    [record, onEdit],
  );

  // const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onDelete(record.id);
  // }, [record.id, onDelete]);

  return (
    <StyledTableRow>
      <BodyCell component="th" scope="row">
        {record.worker.name}
      </BodyCell>
      <BodyCell>{record.task.name}</BodyCell>
      <BodyCell>{record.producedQuantity}</BodyCell>
      <BodyCell>{record.unit}</BodyCell>
      <BodyCell>{formatDate(record.date)}</BodyCell>
      <BodyCell>
        <StatusChip
          label={`${record.calculatedPerformance?.toFixed(2) ?? 0}`}
          status={record.calculatedPerformance > 0 ? true : false}
          size="small"
        />
      </BodyCell>
      <BodyCell>
        <ActionsContainer>
          <EditButton size="small" onClick={handleEditClick}>
            <StyledEditIcon />
          </EditButton>
          <DeleteButton
            size="small"
            // onClick={handleDeleteClick}
          >
            <StyledDeleteIcon />
          </DeleteButton>
        </ActionsContainer>
      </BodyCell>
    </StyledTableRow>
  );
});

ProductivityRow.displayName = "ProductivityRow";

export const ProductivityTable: React.FC<ProductivityTableProps> = ({
  records,
  onEdit,
}) => {
  console.log("Datos recibidos por ProductivityTable:", records);
  return (
    <StyledTableContainer>
      <StyledTable sx={{ minWidth: 800 }} aria-label="productivity table">
        <TableHead>
          <TableHeadRow>
            <HeaderCell>Trabajador</HeaderCell>
            <HeaderCell>Tarea</HeaderCell>
            <HeaderCell>Cantidad</HeaderCell>
            <HeaderCell>Unidad</HeaderCell>
            <HeaderCell>Fecha</HeaderCell>
            <HeaderCell>Rendimiento</HeaderCell>
            <HeaderCell>Acciones</HeaderCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <EmptyRow>
              <BodyCell colSpan={7}>
                <EmptyTableMessage>
                  No hay registros de productividad
                </EmptyTableMessage>
              </BodyCell>
            </EmptyRow>
          ) : (
            records.map((record) => (
              <ProductivityRow
                key={record.id}
                record={record}
                onEdit={onEdit}
                // onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
