// src/absence-management/presentation/components/AbsenceTable/AbsenceTable.tsx
import React from "react";
import { TableBody, TableHead } from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { Absence } from "../../../domain/entities/Absence";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
  EmptyRow,
  EmptyTableMessage,
  AddButton,
} from "../../../../../../shared/presentation/styles/Table.styles";

interface AbsenceTableProps {
  absences: Absence[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (absence: Absence) => void;
  showActions?: boolean;
  loading?: boolean;
}

const getStatusColor = (
  estado: string,
): "default" | "success" | "error" | "warning" => {
  switch (estado) {
    case "aprobada":
      return "success";
    case "rechazada":
      return "error";
    case "pendiente":
      return "warning";
    default:
      return "default";
  }
};

const getStatusLabel = (estado: string): string => {
  switch (estado) {
    case "aprobada":
      return "Aprobada";
    case "rechazada":
      return "Rechazada";
    case "pendiente":
      return "Pendiente";
    default:
      return estado;
  }
};

const getStatus = (estado: string): boolean | undefined => {
  switch (estado) {
    case "aprobada":
      return true;
    case "rechazada":
      return false;
    default:
      return undefined;
  }
};

const formatDate = (date: Date | string): string => {
  try {
    return format(new Date(date), "dd MMM yyyy", { locale: es });
  } catch {
    return "Fecha inválida";
  }
};

const getMotivoLabel = (
  motivo: string,
  motivoPersonalizado?: string,
): string => {
  if (motivo === "otro" && motivoPersonalizado) {
    return motivoPersonalizado;
  }

  const motivos: Record<string, string> = {
    enfermedad: "Enfermedad",
    cita_medica: "Cita médica",
    permiso_personal: "Permiso personal",
    emergencia_familiar: "Emergencia familiar",
    incapacidad: "Incapacidad médica",
    duelo: "Duelo",
    matrimonio: "Matrimonio",
    paternidad_maternidad: "Paternidad/Maternidad",
  };

  return motivos[motivo] || motivo;
};

export const AbsenceTable: React.FC<AbsenceTableProps> = ({
  absences,
  onApprove,
  onReject,
  onDelete,
  onView,

  showActions = true,
  loading = false,
}) => {
  return (
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <TableHeadRow>
            <HeaderCell>Trabajador</HeaderCell>
            <HeaderCell>Documento</HeaderCell>
            <HeaderCell>Fecha Ausencia</HeaderCell>
            <HeaderCell>Motivo</HeaderCell>
            <HeaderCell>Estado</HeaderCell>
            <HeaderCell>Supervisor</HeaderCell>
            {showActions && <HeaderCell>Acciones</HeaderCell>}
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {absences.length === 0 ? (
            <EmptyRow>
              <BodyCell colSpan={6}>
                <EmptyTableMessage>
                  No hay ausencias registradas
                </EmptyTableMessage>
              </BodyCell>
            </EmptyRow>
          ) : (
            absences.map((absence) => (
              <StyledTableRow key={absence.id}>
                <BodyCell>{absence.trabajador_nombre}</BodyCell>
                <BodyCell>{absence.trabajador_documento}</BodyCell>
                <BodyCell>{formatDate(absence.fecha_ausencia)}</BodyCell>
                <BodyCell>
                  {getMotivoLabel(absence.motivo, absence.motivo_personalizado)}
                </BodyCell>
                <BodyCell>
                  <StatusChip
                    label={getStatusLabel(absence.estado)}
                    color={getStatusColor(absence.estado)}
                    status={getStatus(absence.estado)}
                    size="small"
                  />
                </BodyCell>
                <BodyCell>
                  {absence.supervisor_nombre || "Sin definir"}
                </BodyCell>
                {showActions && (
                  <BodyCell>
                    <ActionsContainer>
                      {onView && (
                        <AddButton
                          title="Ver detalles"
                          size="small"
                          onClick={() => onView(absence)}
                        >
                          <ViewIcon />
                        </AddButton>
                      )}

                      {onApprove && absence.estado === "pendiente" && (
                        <EditButton
                          title="Aprobar"
                          size="small"
                          onClick={() => onApprove(absence.id)}
                        >
                          <ApproveIcon />
                        </EditButton>
                      )}

                      {onReject && absence.estado === "pendiente" && (
                        <DeleteButton
                          title="Rechazar"
                          size="small"
                          onClick={() => onReject(absence.id)}
                        >
                          <RejectIcon />
                        </DeleteButton>
                      )}

                      {onDelete && absence.estado === "pendiente" && (
                        <DeleteButton
                          title="Eliminar"
                          size="small"
                          onClick={() => onDelete(absence.id)}
                        >
                          <DeleteIcon />
                        </DeleteButton>
                      )}
                    </ActionsContainer>
                  </BodyCell>
                )}
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
