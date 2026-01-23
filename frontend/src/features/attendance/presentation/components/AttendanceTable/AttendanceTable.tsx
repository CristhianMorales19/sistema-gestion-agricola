import React, { useState } from "react";
import { toast } from "sonner";
import {
  AttendanceRecord,
  Worker,
  RegisterEntryData,
  RegisterExitData,
} from "../../../domain/entities/Attendance";
import { IndividualRegistrationModal } from "../IndividualRegistrationModal/IndividualRegistrationModal";
import { calculateHours } from "../../../application/utils/calculateHours";
import {
  getDateString,
  getTodayString,
} from "../../../application/utils/dateUtils";
import { CheckCircle2 } from "lucide-react";

import {
  StyledTableContainer,
  StyledTable,
  TableHeadRow,
  HeaderCell,
  StyledTableRow,
  BodyCell,
  StatusChip,
  ActionsContainer,
  EmptyRow,
  EmptyTableMessage,
  AddButton,
} from "../../../../../shared/presentation/styles/Table.styles";

import { Add } from "@mui/icons-material";
import { TableBody, TableHead } from "@mui/material";

interface AttendanceTableProps {
  workers: Worker[];
  attendances: AttendanceRecord[];
  loading: boolean;
  selectedDate?: string; // YYYY-MM-DD
  onDelete: (id: number) => Promise<void>;
  onRegisterEntry: (data: RegisterEntryData) => Promise<void>;
  onRegisterExit: (data: RegisterExitData) => Promise<void>;
  onUpdateAttendance: (id: number, data: any) => Promise<void>;
  onRefresh: () => Promise<void>;
  selectedWorkerIds?: Set<number>;
  onSelectWorker?: (workerId: number) => void;
  onSelectAll?: () => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  workers,
  attendances,
  loading,
  selectedDate,
  onDelete,
  onRegisterEntry,
  onRegisterExit,
  onUpdateAttendance,
  onRefresh,
  selectedWorkerIds = new Set(),
  onSelectWorker,
  onSelectAll,
}) => {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const attendancesArray = Array.isArray(attendances) ? attendances : [];
  const dateToUse = selectedDate || getTodayString();

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5);
  };

  // const getWorkerStatus = (workerId: number) => {
  //   const todayAttendances = attendancesArray.filter(
  //     (a) => a.trabajador_id === workerId && getDateString(a.fecha_at) === dateToUse
  //   );

  //   const latestAttendance = todayAttendances.sort(
  //     (a, b) => new Date(b.fecha_at).getTime() - new Date(a.fecha_at).getTime()
  //   )[0];

  //   // Si no hay registro, estado pendiente (sin estado)
  //   if (!latestAttendance) {
  //     return { label: 'Sin estado', color: 'bg-gray-600' };
  //   }

  //   // Si está marcado como ausente explícitamente
  //   if (latestAttendance.deleted_at) {
  //     return { label: 'Ausente', color: 'bg-gray-500' };
  //   }

  //   // Si tiene entrada pero no salida
  //   if (latestAttendance.hora_entrada_at && !latestAttendance.hora_salida_at) {
  //     return { label: 'Entrada', color: 'bg-blue-500' };
  //   }

  //   // Si tiene entrada y salida
  //   if (latestAttendance.hora_entrada_at && latestAttendance.hora_salida_at) {
  //     return { label: 'Completo', color: 'bg-green-500' };
  //   }

  //   // Fallback
  //   return { label: 'Sin estado', color: 'bg-gray-600' };
  // };

  const getStatus = (workerId: number) => {
    const todayAttendances = attendancesArray.filter(
      (a) =>
        a.trabajador_id === workerId && getDateString(a.fecha_at) === dateToUse,
    );

    const latestAttendance = todayAttendances.sort(
      (a, b) => new Date(b.fecha_at).getTime() - new Date(a.fecha_at).getTime(),
    )[0];

    // Si no hay registro, estado pendiente (sin estado)
    if (!latestAttendance) {
      return { label: "Sin estado", color: undefined };
    }

    // Si está marcado como ausente explícitamente
    if (latestAttendance.deleted_at) {
      return { label: "Ausente", color: false };
    }

    // Si tiene entrada pero no salida
    if (latestAttendance.hora_entrada_at && !latestAttendance.hora_salida_at) {
      return { label: "Entrada", color: undefined };
    }

    // Si tiene entrada y salida
    if (latestAttendance.hora_entrada_at && latestAttendance.hora_salida_at) {
      return { label: "Completo", color: true };
    }

    // Fallback
    return { label: "Sin estado", color: false };
  };

  const getWorkerTodayTimes = (workerId: number) => {
    const todayAttendance = attendancesArray.find(
      (a) =>
        a.trabajador_id === workerId && getDateString(a.fecha_at) === dateToUse,
    );

    // Si está marcado como ausente (deleted_at no null), no mostrar horas
    if (todayAttendance && todayAttendance.deleted_at) {
      return { entrada: "-", salida: "-" };
    }

    return todayAttendance
      ? {
          entrada: formatTime(todayAttendance.hora_entrada_at),
          salida: formatTime(todayAttendance.hora_salida_at),
        }
      : { entrada: "-", salida: "-" };
  };

  const handleRegisterClick = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowIndividualModal(true);
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      await onDelete(id);
      toast.success("Registro eliminado correctamente");
      setDeleteConfirmId(null);
      await onRefresh();
    } catch (error) {
      toast.error("Error al eliminar el registro");
    }
  };

  return (
    <>
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableHeadRow>
              <HeaderCell />
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Nombre</HeaderCell>
              <HeaderCell>Estado</HeaderCell>
              <HeaderCell>Hora Entrada</HeaderCell>
              <HeaderCell>Hora Salida</HeaderCell>
              <HeaderCell>Horas Trabajadas</HeaderCell>
              <HeaderCell>Observaciones</HeaderCell>
              <HeaderCell>Acciones</HeaderCell>
            </TableHeadRow>
          </TableHead>

          <TableBody>
            {workers.length === 0 ? (
              <EmptyRow>
                <BodyCell colSpan={9}>
                  <EmptyTableMessage>
                    No hay trabajadores disponibles
                  </EmptyTableMessage>
                </BodyCell>
              </EmptyRow>
            ) : (
              workers.map((worker) => {
                const status = getStatus(worker.trabajador_id);
                const times = getWorkerTodayTimes(worker.trabajador_id);
                const todayAttendance = attendancesArray.find(
                  (a) =>
                    a.trabajador_id === worker.trabajador_id &&
                    getDateString(a.fecha_at) === dateToUse,
                );

                const horasTrabajadas =
                  todayAttendance && !todayAttendance.deleted_at
                    ? calculateHours(
                        todayAttendance.hora_entrada_at,
                        todayAttendance.hora_salida_at,
                      )
                    : "—";

                const isSelected = selectedWorkerIds.has(worker.trabajador_id);

                return (
                  <StyledTableRow
                    key={worker.trabajador_id}
                    isSelected={isSelected}
                    hover
                  >
                    {/* Checkbox */}
                    <BodyCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectWorker?.(worker.trabajador_id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </BodyCell>

                    {/* ID */}
                    <BodyCell>
                      <code>{worker.documento_identidad}</code>
                    </BodyCell>

                    {/* Nombre */}
                    <BodyCell>
                      <strong>{worker.nombre_completo}</strong>
                    </BodyCell>

                    {/* Estado */}
                    <BodyCell>
                      <StatusChip
                        label={status.label}
                        status={status.color}
                        size="small"
                      />
                    </BodyCell>

                    {/* Hora entrada */}
                    <BodyCell>
                      <span>{times.entrada}</span>
                    </BodyCell>

                    {/* Hora salida */}
                    <BodyCell>
                      <span>{times.salida}</span>
                    </BodyCell>

                    {/* Horas trabajadas */}
                    <BodyCell>
                      <strong>{horasTrabajadas}</strong>
                    </BodyCell>

                    {/* Observaciones */}
                    <BodyCell>
                      {todayAttendance?.observaciones_salida || "-"}
                    </BodyCell>

                    {/* Acciones */}
                    <BodyCell>
                      <ActionsContainer>
                        <AddButton
                          size="small"
                          onClick={() => handleRegisterClick(worker)}
                        >
                          <Add />
                        </AddButton>
                      </ActionsContainer>
                    </BodyCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Individual Registration Modal */}
      {showIndividualModal &&
        selectedWorker &&
        (() => {
          // Find the selected date's attendance for this worker
          const todayAttendance = attendancesArray.find(
            (a) =>
              a.trabajador_id === selectedWorker.trabajador_id &&
              getDateString(a.fecha_at) === dateToUse,
          );

          // Distinguir entre activos (no deleted_at) y ausentes (deleted_at)
          const activeAttendance =
            todayAttendance && !todayAttendance.deleted_at
              ? todayAttendance
              : null;
          const absentAttendance =
            todayAttendance && todayAttendance.deleted_at
              ? todayAttendance
              : null;

          // Para el modal, usar activeAttendance si existe, o absentAttendance para poder reactivar
          const attendanceForModal = activeAttendance || absentAttendance;

          return (
            <IndividualRegistrationModal
              isOpen={showIndividualModal}
              worker={selectedWorker}
              selectedDate={dateToUse}
              onClose={() => {
                setShowIndividualModal(false);
                setSelectedWorker(null);
              }}
              onRegisterEntry={onRegisterEntry}
              onRegisterExit={onRegisterExit}
              onUpdateAttendance={onUpdateAttendance}
              hasActiveEntry={
                !!activeAttendance && !!activeAttendance.hora_entrada_at
              }
              entryTime={activeAttendance?.hora_entrada_at || undefined}
              existingEntryTime={
                activeAttendance?.hora_entrada_at
                  ? activeAttendance.hora_entrada_at
                  : undefined
              }
              existingExitTime={
                activeAttendance?.hora_salida_at
                  ? activeAttendance.hora_salida_at
                  : undefined
              }
              existingAttendanceId={
                attendanceForModal?.asistencia_id || undefined
              }
              isAbsent={!!absentAttendance}
              onSuccess={() => {
                setShowIndividualModal(false);
                onRefresh();
              }}
            />
          );
        })()}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold text-white mb-4">
              ¿Confirmar eliminación?
            </h3>
            <p className="text-gray-400 mb-6">
              ¿Está seguro que desea eliminar este registro de asistencia?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-4 bg-[#0f1419] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#151a27] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete(deleteConfirmId);
                }}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
