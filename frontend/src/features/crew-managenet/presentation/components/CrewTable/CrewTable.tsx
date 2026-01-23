import React from "react";
import { TableBody, TableHead } from "@mui/material";
import {
  StyledTableContainer,
  StyledTable,
  TableHeadRow,
  HeaderCell,
  StyledTableRow,
  BodyCell,
  ActionsContainer,
  EditButton,
  DeleteButton,
  StyledEditIcon,
  StyledDeleteIcon,
  EmptyRow,
  EmptyTableMessage,
  StatusChip,
} from "../../../../../shared/presentation/styles/Table.styles";
import { memo, useCallback } from "react";
import { Crew } from "@features/crew-managenet/domain/entities/crew";

interface CrewTableProps {
  crews: Crew[];
  onEdit: (crew: Crew) => void;
  onDelete: (id: number, label?: string) => void;
}

interface CrewRowProps {
  crew: Crew;
  onEdit: (crew: Crew) => void;
  onDelete: (id: number, label?: string) => void;
}

const getMemberCountText = (count: number) => {
  return `${count}`;
};

const CrewRow = memo(({ crew, onEdit, onDelete }: CrewRowProps) => {
  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(crew);
    },
    [crew, onEdit],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(crew.id, `${crew.code} - ${crew.description}`);
    },
    [crew.id, crew.code, crew.description, onDelete],
  );

  const statusLabel = crew.active ? "Activa" : "Inactiva";

  return (
    <StyledTableRow hover>
      <BodyCell component="th" scope="row">
        {crew.code}
      </BodyCell>
      <BodyCell>{crew.description}</BodyCell>
      <BodyCell>{getMemberCountText(crew.workers.length)}</BodyCell>
      <BodyCell>{crew.workArea}</BodyCell>
      <BodyCell>
        <StatusChip label={statusLabel} status={crew.active} size="small" />
      </BodyCell>
      <BodyCell>
        <ActionsContainer>
          <EditButton size="small" onClick={handleEditClick}>
            <StyledEditIcon />
          </EditButton>
          <DeleteButton size="small" onClick={handleDeleteClick}>
            <StyledDeleteIcon />
          </DeleteButton>
        </ActionsContainer>
      </BodyCell>
    </StyledTableRow>
  );
});

CrewRow.displayName = "CrewRow";

export const CrewTable = ({ crews, onEdit, onDelete }: CrewTableProps) => {
  return (
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <TableHeadRow>
            <HeaderCell>Codigo</HeaderCell>
            <HeaderCell>Descripción</HeaderCell>
            <HeaderCell>Miembros</HeaderCell>
            <HeaderCell>Área</HeaderCell>
            <HeaderCell>Estado</HeaderCell>
            <HeaderCell>Acciones</HeaderCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {crews.length === 0 ? (
            <EmptyRow>
              <BodyCell colSpan={6}>
                <EmptyTableMessage>
                  No hay cuadrillas registradas
                </EmptyTableMessage>
              </BodyCell>
            </EmptyRow>
          ) : (
            crews.map((crew) => (
              <CrewRow
                key={crew.id}
                crew={crew}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
