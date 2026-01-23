import React, { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CheckCircle2, AlertCircle, LogOut, UserX, LogIn } from "lucide-react";
import { Toaster, toast } from "sonner";
import { AttendanceTable } from "../AttendanceTable/AttendanceTable";
import { BulkRegistrationModal } from "../BulkRegistrationModal/BulkRegistrationModal";
import { BulkExitModal } from "../BulkExitModal/BulkExitModal";
import { BulkEntryModal } from "../BulkEntryModal/BulkEntryModal";
import { DateSelector } from "../DateSelector/DateSelector";
import { useAttendanceManagement } from "../../../application/hooks/useAttendanceManagement";
import { RegisterEntryData } from "../../../domain/entities/Attendance";
import {
  getDateString,
  getTodayString,
} from "../../../application/utils/dateUtils";

import { Add as AddIcon } from "@mui/icons-material";

import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../../shared/presentation/styles/LoadingSpinner.styles";

import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";

import { StyledSearchIcon } from "../../../../../shared/presentation/styles/SearchContainer.styles";

import { WorkersStats } from "./WorkersStats";
import { Box, InputAdornment } from "@mui/material";

const API_URL = "http://localhost:3001";

export const AttendanceManagementView: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const {
    workers,
    attendances,
    loading,
    fetchActiveWorkers,
    registerEntry: hookRegisterEntry,
    registerExit: hookRegisterExit,
    fetchAllAttendances,
    deleteAttendance,
    updateAttendance: hookUpdateAttendance,
  } = useAttendanceManagement();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return getTodayString();
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<Set<number>>(
    new Set(),
  );
  const [showBulkExitModal, setShowBulkExitModal] = useState(false);
  const [showBulkEntryModal, setShowBulkEntryModal] = useState(false);

  // States for bulk exit confirmation
  const [showBulkExitConfirmation, setShowBulkExitConfirmation] =
    useState(false);
  const [pendingBulkExitData, setPendingBulkExitData] = useState<{
    registered: typeof workers;
    toUpdate: typeof workers;
    toReject: typeof workers;
    time: string;
    observations: string;
  } | null>(null);

  // States for bulk entry confirmation
  const [showBulkEntryConfirmation, setShowBulkEntryConfirmation] =
    useState(false);
  const [pendingBulkEntryData, setPendingBulkEntryData] = useState<{
    registered: typeof workers;
    toUpdate: typeof workers;
    toReactivate: typeof workers; // Ausentes/eliminados que se van a reactivar
    time: string;
    location: string;
  } | null>(null);

  // Wrapper functions to adapt signatures
  const registerEntry = async (data: RegisterEntryData): Promise<void> => {
    const result = await hookRegisterEntry(data);
    if (!result) {
      throw new Error("Failed to register entry");
    }
  };

  const registerExit = async (
    data: any,
    dateContext?: string,
  ): Promise<void> => {
    // Find the attendance record to get the asistencia_id
    const attendancesArray = Array.isArray(attendances) ? attendances : [];
    const dateToSearch = dateContext || selectedDate;
    const attendance = attendancesArray.find(
      (a) =>
        a.trabajador_id === data.trabajador_id &&
        getDateString(a.fecha_at) === dateToSearch &&
        a.hora_entrada_at,
    );

    if (!attendance) {
      throw new Error(
        "No se puede registrar la hora de salida sin antes registrar la hora de entrada",
      );
    }

    const result = await hookRegisterExit(attendance.asistencia_id, {
      trabajador_id: data.trabajador_id,
      horaSalida: data.horaSalida || data.hora_salida,
      observacion: data.observacion,
    });

    if (!result) {
      throw new Error("Failed to register exit");
    }
  };

  const updateAttendance = async (id: number, data: any): Promise<void> => {
    const result = await hookUpdateAttendance(id, data);
    if (!result) {
      throw new Error("Failed to update attendance");
    }
    // Refresh attendance data after successful update
    await fetchAllAttendances();
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteAttendance(id);
  };

  const handleRefresh = async (): Promise<void> => {
    await fetchAllAttendances();
  };

  useEffect(() => {
    fetchActiveWorkers();
    fetchAllAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar datos cuando cambia la fecha seleccionada
  useEffect(() => {
    // Limpiar selección de trabajadores al cambiar de fecha
    setSelectedWorkerIds(new Set());
    fetchAllAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // ============================================================================
  // FUNCIONES DE SELECCIÓN MÚLTIPLE
  // ============================================================================

  const handleSelectWorker = (workerId: number) => {
    const newSelected = new Set(selectedWorkerIds);
    if (newSelected.has(workerId)) {
      newSelected.delete(workerId);
    } else {
      newSelected.add(workerId);
    }
    setSelectedWorkerIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedWorkerIds.size === workers.length) {
      setSelectedWorkerIds(new Set());
    } else {
      setSelectedWorkerIds(new Set(workers.map((w) => w.trabajador_id)));
    }
  };

  const getSelectedWorkers = () => {
    return workers.filter((w) => selectedWorkerIds.has(w.trabajador_id));
  };

  const handleBulkEntrySelected = async (time: string, location: string) => {
    try {
      const selectedWorkersList = getSelectedWorkers();

      if (selectedWorkersList.length === 0) {
        toast.error("Selecciona al menos un trabajador");
        return;
      }

      const attendancesArray = Array.isArray(attendances) ? attendances : [];
      const dateToCheck = selectedDate; // Usar la fecha seleccionada

      // Separar trabajadores por estado Y pre-resolver asistencia_id para actualizar
      const registered: Array<{
        trabajador_id: number;
        asistenciaId?: number;
      }> = [];
      const toUpdate: Array<{
        trabajador_id: number;
        asistenciaId: number;
        isReactivation: boolean;
      }> = [];

      console.log(
        `📥 ENTRADA - Categorizando ${selectedWorkersList.length} trabajadores para ${dateToCheck}`,
      );
      console.log(`📋 Total registros en sistema: ${attendancesArray.length}`);

      for (const worker of selectedWorkersList) {
        // Buscar TODOS los registros del trabajador para esa fecha (activos Y eliminados)
        const allRecordsForWorker = attendancesArray.filter(
          (a) =>
            a.trabajador_id === worker.trabajador_id &&
            getDateString(a.fecha_at) === dateToCheck,
        );

        console.log(
          `👤 ${worker.nombre_completo}: ${allRecordsForWorker.length} registro(s) encontrado(s)`,
          allRecordsForWorker.map((r) => ({
            id: r.asistencia_id,
            entrada: r.hora_entrada_at,
            deleted: !!r.deleted_at,
          })),
        );

        // Buscar registro activo
        const activeAttendance = allRecordsForWorker.find((a) => !a.deleted_at);

        if (activeAttendance) {
          // Hay registro activo
          if (!activeAttendance.hora_entrada_at) {
            // Registro activo pero sin entrada, se puede registrar
            console.log(`  ✅ Registrar nueva entrada`);
            registered.push({ trabajador_id: worker.trabajador_id });
          } else {
            // Ya tiene entrada activa, puede actualizar (pre-resolver asistencia_id)
            console.log(
              `  🔄 Actualizar entrada existente (ID: ${activeAttendance.asistencia_id})`,
            );
            toUpdate.push({
              trabajador_id: worker.trabajador_id,
              asistenciaId: activeAttendance.asistencia_id,
              isReactivation: false,
            });
          }
        } else if (allRecordsForWorker.length > 0) {
          // Solo hay registros eliminados (ausentes), necesita actualizar para reactivar
          // Usar el primero (debería haber solo uno)
          const deletedRecord = allRecordsForWorker[0];
          console.log(
            `  🔄 Reactivar desde ausencia (ID: ${deletedRecord.asistencia_id})`,
          );
          toUpdate.push({
            trabajador_id: worker.trabajador_id,
            asistenciaId: deletedRecord.asistencia_id,
            isReactivation: true,
          });
        } else {
          // No hay ningún registro, registrar nueva entrada
          console.log(`  ✅ Registrar nueva entrada (sin registro previo)`);
          registered.push({ trabajador_id: worker.trabajador_id });
        }
      }

      console.log(
        `📊 RESUMEN: ${registered.length} nuevas, ${toUpdate.length} actualizaciones`,
      );

      // Si hay que actualizar, mostrar confirmación modal
      if (toUpdate.length > 0) {
        setPendingBulkEntryData({
          registered,
          toUpdate,
          time,
          location,
        });
        setShowBulkEntryConfirmation(true);
      } else {
        // Sin conflictos, procesar directamente
        await processBulkEntry(registered, toUpdate, time, location);
      }

      setShowBulkEntryModal(false);
    } catch (error) {
      console.error("Error en handleBulkEntrySelected:", error);
      toast.error("Error al registrar entrada en lote");
    }
  };

  const processBulkEntry = async (
    registered: typeof workers,
    toUpdate: typeof workers,
    time: string,
    location: string,
  ) => {
    let registeredCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    // Revalidar y refetch los datos ANTES de procesar para asegurar que el estado no ha cambiado
    const attendancesArray = Array.isArray(attendances) ? attendances : [];
    const dateToCheck = selectedDate;

    console.log(
      `📊 [BULK ENTRY] Procesando: ${registered.length} nuevas, ${toUpdate.length} actualizaciones`,
    );
    console.log(`📋 Workers a actualizar:`, toUpdate);

    // Registrar nuevas entradas
    for (const worker of registered) {
      if (!worker) {
        console.error(`❌ Worker inválido`);
        errorCount++;
        continue;
      }

      try {
        console.log(
          `📝 Registrando entrada para ${worker.nombre_completo} a las ${time}`,
        );
        // Registrar la nueva entrada directamente
        // El backend filtra deleted_at IS NULL, así que no hay conflicto
        await registerEntry({
          trabajador_id: worker.trabajador_id,
          fecha: selectedDate,
          horaEntrada: time,
          ubicacion: location,
        });
        registeredCount++;
      } catch (error) {
        console.error(
          `❌ Error registrando ${worker?.nombre_completo}:`,
          error,
        );
        errorCount++;
      }
    }

    // Actualizar entradas existentes - BUSCAR DINÁMICAMENTE
    // Esto incluye tanto actualizar entradas activas como REACTIVAR ausentes (deleted_at)
    for (const worker of toUpdate) {
      if (!worker) {
        console.error(`❌ Worker inválido en toUpdate`);
        errorCount++;
        continue;
      }

      try {
        // Buscar el registro por trabajador_id + fecha (activo O eliminado)
        const allRecords = attendancesArray.filter(
          (a) =>
            a.trabajador_id === worker.trabajador_id &&
            getDateString(a.fecha_at) === dateToCheck,
        );

        if (allRecords.length === 0) {
          console.error(
            `❌ No se encontró registro para ${worker.nombre_completo} en ${dateToCheck}`,
          );
          errorCount++;
          continue;
        }

        // Preferir el registro activo si existe, sino usar el eliminado para reactivar
        const activeRecord = allRecords.find((a) => !a.deleted_at);
        const recordToUpdate = activeRecord || allRecords[0];
        const isReactivation = !activeRecord && allRecords.length > 0;

        const action = isReactivation ? "Reactivando" : "Actualizando";
        console.log(
          `🔄 ${action} entrada para ${worker.nombre_completo} a las ${time} (ID: ${recordToUpdate.asistencia_id})`,
        );

        // Pasar datos especiales para reactivación
        const updateData: any = {
          horaEntrada: time,
          ubicacion: location,
        };

        // Si es reactivación, agregar flag para que el backend lo sepa
        // NO incluir horaSalida ni observaciones_salida para evitar problemas de validación
        if (isReactivation) {
          updateData.deleted_at = null; // Flag de reactivación
        }

        // Usar el asistencia_id que encontramos
        await updateAttendance(recordToUpdate.asistencia_id, updateData);
        updatedCount++;
      } catch (error) {
        console.error(
          `❌ Error actualizando ${worker?.nombre_completo}:`,
          error,
        );
        errorCount++;
      }
    }

    // Actualizar datos DESPUÉS de todas las operaciones
    await fetchAllAttendances();

    // Mensaje final consolidado con estructura mejorada
    const resultParts: string[] = [];

    if (registeredCount > 0) {
      resultParts.push(
        `✅ ${registeredCount} ${registeredCount === 1 ? "entrada registrada" : "entradas registradas"}`,
      );
    }

    if (updatedCount > 0) {
      resultParts.push(
        `🔄 ${updatedCount} ${updatedCount === 1 ? "entrada actualizada" : "entradas actualizadas"}`,
      );
    }

    if (errorCount > 0) {
      resultParts.push(
        `⚠️ ${errorCount} ${errorCount === 1 ? "error" : "errores"}`,
      );
    }

    if (resultParts.length > 0) {
      const finalMessage = resultParts.join(" | ");
      if (registeredCount > 0 || updatedCount > 0) {
        toast.success(finalMessage, { duration: 6000 });
      } else if (errorCount > 0) {
        toast.error(finalMessage, { duration: 6000 });
      }
    } else {
      toast.info("No se realizaron cambios", { duration: 3000 });
    }

    setShowBulkEntryConfirmation(false);
    setPendingBulkEntryData(null);
    setSelectedWorkerIds(new Set());
  };

  const handleBulkExitSelected = async (time: string, observations: string) => {
    try {
      const selectedWorkersList = getSelectedWorkers();

      if (selectedWorkersList.length === 0) {
        toast.error("Selecciona al menos un trabajador");
        return;
      }

      const attendancesArray = Array.isArray(attendances) ? attendances : [];
      const dateToSearch = selectedDate; // Usar la fecha seleccionada, no hoy

      // Separar trabajadores por estado
      const registered: typeof workers = [];
      const toUpdate: typeof workers = [];
      const toReject: typeof workers = [];
      const invalidTime: typeof workers = [];

      for (const worker of selectedWorkersList) {
        const attendance = attendancesArray.find(
          (a) =>
            a.trabajador_id === worker.trabajador_id &&
            getDateString(a.fecha_at) === dateToSearch &&
            a.hora_entrada_at &&
            !a.deleted_at,
        );

        if (!attendance) {
          toReject.push(worker);
        } else if (!attendance.hora_entrada_at) {
          // No hay entrada, rechazar
          toReject.push(worker);
        } else {
          // Validar que la hora de salida sea posterior a la entrada
          // El formato puede ser "HH:mm" o "YYYY-MM-DDTHH:mm:ss"
          let entryTimeHHMM = attendance.hora_entrada_at;

          // Si el formato es ISO timestamp, extraer solo HH:mm
          if (entryTimeHHMM.includes("T")) {
            entryTimeHHMM = entryTimeHHMM.substring(11, 16);
          } else if (entryTimeHHMM.length > 5) {
            // Si es otro formato largo, intentar extraer HH:mm
            entryTimeHHMM = entryTimeHHMM.substring(0, 5);
          }

          // Parsear horas manualmente para evitar problemas
          const [entryH, entryM] = entryTimeHHMM.split(":").map(Number);
          const [exitH, exitM] = time.split(":").map(Number);

          const entryTotalMinutes = entryH * 60 + entryM;
          const exitTotalMinutes = exitH * 60 + exitM;

          if (exitTotalMinutes <= entryTotalMinutes) {
            invalidTime.push(worker);
          } else if (attendance.hora_salida_at) {
            // Actualizar salida existente
            toUpdate.push(worker);
          } else {
            // Registrar nueva salida
            registered.push(worker);
          }
        }
      }

      // Si hay horas inválidas, lanzar error para que el modal lo muestre
      if (invalidTime.length > 0) {
        throw new Error(
          "La hora de salida debe ser mayor a la hora de entrada",
        );
      }

      // Si hay que actualizar, mostrar confirmación modal
      if (toUpdate.length > 0) {
        setPendingBulkExitData({
          registered,
          toUpdate,
          toReject,
          time,
          observations,
        });
        setShowBulkExitConfirmation(true);
        setShowBulkExitModal(false);
        return;
      }

      // Si no hay que actualizar, proceder directamente
      await processBulkExit(registered, toUpdate, toReject, time, observations);
    } catch (error) {
      console.error("Error en handleBulkExitSelected:", error);
      // Re-lanzar el error para que el modal lo capture y lo muestre en el dialog
      throw error;
    }
  };

  const processBulkExit = async (
    registered: typeof workers,
    toUpdate: typeof workers,
    toReject: typeof workers,
    time: string,
    observations: string,
  ) => {
    let registeredCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let rejectedCount = toReject.length; // Los rechazados ya están contados

    const attendancesArray = Array.isArray(attendances) ? attendances : [];
    const dateToCheck = selectedDate;

    console.log(
      `📊 [BULK EXIT] Procesando: ${registered.length} nuevas, ${toUpdate.length} actualizaciones, ${rejectedCount} rechazadas`,
    );

    // Registrar nuevas salidas
    for (const worker of registered) {
      if (!worker) {
        console.error(`❌ Worker inválido`);
        errorCount++;
        continue;
      }

      try {
        console.log(
          `📝 Registrando salida para ${worker.nombre_completo} a las ${time}`,
        );
        await registerExit(
          {
            trabajador_id: worker.trabajador_id,
            horaSalida: time,
            observacion: observations,
          },
          dateToCheck,
        );
        registeredCount++;
      } catch (error) {
        console.error(
          `❌ Error registrando ${worker?.nombre_completo}:`,
          error,
        );
        errorCount++;
      }
    }

    // Actualizar salidas existentes
    for (const worker of toUpdate) {
      if (!worker) {
        console.error(`❌ Worker inválido en toUpdate`);
        errorCount++;
        continue;
      }

      try {
        // Buscar el registro activo del trabajador en esa fecha
        const activeRecord = attendancesArray.find(
          (a) =>
            a.trabajador_id === worker.trabajador_id &&
            getDateString(a.fecha_at) === dateToCheck &&
            a.hora_entrada_at &&
            !a.deleted_at,
        );

        if (!activeRecord) {
          console.error(
            `❌ No se pudo encontrar registro activo para ${worker.nombre_completo}`,
          );
          errorCount++;
          continue;
        }

        console.log(
          `🔄 Actualizando salida para ${worker.nombre_completo} a las ${time} (ID: ${activeRecord.asistencia_id})`,
        );
        await updateAttendance(activeRecord.asistencia_id, {
          horaSalida: time,
          observaciones_salida: observations,
        });
        updatedCount++;
      } catch (error) {
        console.error(
          `❌ Error actualizando ${worker?.nombre_completo}:`,
          error,
        );
        errorCount++;
      }
    }

    // Los rechazados solo se registran, no se procesan
    rejectedCount = toReject.length;

    // Actualizar datos DESPUÉS de todas las operaciones
    await fetchAllAttendances();

    // Mensaje final consolidado
    const resultParts: string[] = [];

    if (registeredCount > 0) {
      resultParts.push(
        `✅ ${registeredCount} ${registeredCount === 1 ? "salida registrada" : "salidas registradas"}`,
      );
    }

    if (updatedCount > 0) {
      resultParts.push(
        `🔄 ${updatedCount} ${updatedCount === 1 ? "salida actualizada" : "salidas actualizadas"}`,
      );
    }

    if (rejectedCount > 0) {
      resultParts.push(
        `❌ ${rejectedCount} ${rejectedCount === 1 ? "salida rechazada" : "salidas rechazadas"} (sin entrada)`,
      );
    }

    if (errorCount > 0) {
      resultParts.push(
        `⚠️ ${errorCount} ${errorCount === 1 ? "error" : "errores"}`,
      );
    }

    if (resultParts.length > 0) {
      const finalMessage = resultParts.join(" | ");
      if (registeredCount > 0 || updatedCount > 0) {
        toast.success(finalMessage, { duration: 6000 });
      } else if (errorCount > 0 || rejectedCount > 0) {
        toast.error(finalMessage, { duration: 6000 });
      }
    } else {
      toast.info("No se realizaron cambios", { duration: 3000 });
    }

    setShowBulkExitModal(false);
    setShowBulkExitConfirmation(false);
    setPendingBulkExitData(null);
    setSelectedWorkerIds(new Set());
  };

  const handleMarkAsAbsent = async () => {
    try {
      const selectedWorkersList = getSelectedWorkers();

      if (selectedWorkersList.length === 0) {
        toast.error("Selecciona al menos un trabajador");
        return;
      }

      console.log(
        "🔵 Marcando ausentes para:",
        selectedWorkersList.map(
          (w) => `${w.nombre_completo} (ID: ${w.trabajador_id})`,
        ),
      );

      // Obtener token UNA SOLA VEZ antes del loop
      const token = await getAccessTokenSilently();
      const dateToCheck = selectedDate;

      let successCount = 0;
      const errors: Array<{ name: string; reason: string }> = [];

      for (const worker of selectedWorkersList) {
        try {
          console.log(
            `📤 Enviando petición para ${worker.nombre_completo} (ID: ${worker.trabajador_id})`,
          );

          // Llamar al nuevo endpoint mark-absent
          const response = await fetch(
            `${API_URL}/api/attendance/mark-absent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                trabajador_id: worker.trabajador_id,
                fecha: dateToCheck,
              }),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error(
              `❌ Error en respuesta para ${worker.nombre_completo}:`,
              errorData,
            );
            throw new Error(errorData.message || `Error ${response.status}`);
          }

          console.log(`✅ Éxito para ${worker.nombre_completo}`);
          successCount++;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";
          console.error(`❌ Error marcando ${worker.nombre_completo}:`, error);
          errors.push({
            name: worker.nombre_completo,
            reason: errorMessage,
          });
        }
      }

      console.log(`🔄 Refrescando datos...`);
      // Refrescar datos UNA SOLA VEZ después de marcar todos
      const result = await fetchAllAttendances();
      console.log(`✅ Datos refrescados. Total registros:`, result?.total);
      console.log(
        `📊 Registros con deleted_at:`,
        result?.data?.filter((r: any) => r.deleted_at).length,
      );
      console.log(`📋 Primeros 5 registros:`, result?.data?.slice(0, 5));

      toast.success(
        `✅ ${successCount} ${successCount === 1 ? "trabajador marcado" : "trabajadores marcados"} como ausente`,
      );

      if (errors.length > 0) {
        const errorMsg = `❌ ${errors.length} ${errors.length === 1 ? "trabajador no pudo ser marcado" : "trabajadores no pudieron ser marcados"} como ausente`;
        toast.error(errorMsg);
      }

      setSelectedWorkerIds(new Set());
    } catch (error) {
      console.error("Error en handleMarkAsAbsent:", error);
      toast.error("Error al marcar como ausentes");
    }
  };

  // Calcular estadísticas
  const totalWorkers = workers.length || 0;

  // Memoized statistics calculation
  const { selectedDateAttendances, entriesCount, exitsCount, absentsCount } =
    useMemo(() => {
      const attendancesForCalc = Array.isArray(attendances) ? attendances : [];
      console.log(
        `📊 useMemo recalculando con ${attendancesForCalc.length} registros para fecha ${selectedDate}`,
      );

      const dateSel = attendancesForCalc.filter(
        (a) => getDateString(a.fecha_at) === selectedDate,
      );
      console.log(`📅 ${dateSel.length} registros para ${selectedDate}`);

      // Separar registros activos y ausentes
      const activeRecords = dateSel.filter((a) => !a.deleted_at);
      const absentRecords = dateSel.filter((a) => a.deleted_at);

      console.log(
        `✅ ${activeRecords.length} activos, ❌ ${absentRecords.length} ausentes`,
      );

      const entryWorkerIds = new Set(
        activeRecords
          .filter((a) => a.hora_entrada_at)
          .map((a) => a.trabajador_id),
      );

      const exitWorkerIds = new Set(
        activeRecords
          .filter((a) => a.hora_salida_at)
          .map((a) => a.trabajador_id),
      );

      // Contar trabajadores ausentes: aquellos que SOLO tienen registros absent (sin registros activos)
      const activeWorkerIds = new Set(
        activeRecords.map((a) => a.trabajador_id),
      );
      const absentWorkerIds = new Set(
        absentRecords
          .map((a) => a.trabajador_id)
          .filter((workerId) => !activeWorkerIds.has(workerId)), // Excluir trabajadores que tienen registros activos
      );

      console.log(
        `📈 Contadores: Entradas=${entryWorkerIds.size}, Salidas=${exitWorkerIds.size}, Ausentes=${absentWorkerIds.size}`,
      );

      return {
        selectedDateAttendances: dateSel,
        entriesCount: entryWorkerIds.size,
        exitsCount: exitWorkerIds.size,
        absentsCount: absentWorkerIds.size,
      };
    }, [attendances, selectedDate, workers]);

  const handleBulkRegister = async (
    type: "entrada" | "salida",
    time: string,
    location?: string,
  ) => {
    const dateToCheck = selectedDate;
    const attendancesArray = Array.isArray(attendances) ? attendances : [];
    const selectedDateAttendances = attendancesArray.filter(
      (a) => getDateString(a.fecha_at) === dateToCheck,
    );

    // 🧠 REGLA BASE: Detectar si existe al menos UN registro con ENTRADA
    const hasAnyEntryInDate = selectedDateAttendances.some(
      (a) => a.hora_entrada_at && !a.deleted_at,
    );

    // Para el flujo de ejecuteBulkRegister
    const registeredWorkers: typeof workers = [];
    const toUpdateWorkers: typeof workers = [];
    const toReactivateWorkers: typeof workers = [];
    const toRejectWorkers: typeof workers = [];

    if (type === "entrada") {
      console.log(`📥 ENTRADA GLOBAL - Categorizando trabajadores...`);
      console.log(`  ¿Existen entradas previas? ${hasAnyEntryInDate}`);

      for (const worker of workers) {
        // Buscar CUALQUIER registro del trabajador en esa fecha (activo O eliminado)
        const allRecords = selectedDateAttendances.filter(
          (a) => a.trabajador_id === worker.trabajador_id,
        );

        // Buscar registro activo
        const activeRecord = allRecords.find((a) => !a.deleted_at);

        if (activeRecord && activeRecord.hora_entrada_at) {
          // Ya tiene entrada activa → actualizar
          console.log(`  🔄 ${worker.nombre_completo}: Actualizar entrada`);
          toUpdateWorkers.push(worker);
        } else if (allRecords.length > 0 && !activeRecord) {
          // Solo tiene registro eliminado (ausente) → reactivar
          console.log(
            `  🔁 ${worker.nombre_completo}: Reactivar desde ausencia`,
          );
          toReactivateWorkers.push(worker);
        } else {
          // Sin registro → crear nuevo
          console.log(`  ✅ ${worker.nombre_completo}: Nueva entrada`);
          registeredWorkers.push(worker);
        }
      }
    } else {
      // 🔴 SALIDA GLOBAL
      console.log(`📤 SALIDA GLOBAL - Categorizando trabajadores...`);
      console.log(`  ¿Existen entradas previas? ${hasAnyEntryInDate}`);

      const invalidTimeWorkers: typeof workers = [];

      for (const worker of workers) {
        // SOLO buscar registros activos (no eliminados)
        const activeRecord = selectedDateAttendances.find(
          (a) =>
            a.trabajador_id === worker.trabajador_id &&
            a.hora_entrada_at &&
            !a.deleted_at,
        );

        // Sin entrada activa, no puede tener salida
        if (!activeRecord) {
          console.log(
            `  ⛔ ${worker.nombre_completo}: Sin entrada (rechazado)`,
          );
          toRejectWorkers.push(worker);
          continue;
        }

        // Validar que hora salida > hora entrada
        const entryTimeHHMM = activeRecord.hora_entrada_at
          ? activeRecord.hora_entrada_at.includes("T")
            ? activeRecord.hora_entrada_at.substring(11, 16)
            : activeRecord.hora_entrada_at.substring(0, 5)
          : "00:00";

        const [entryH, entryM] = entryTimeHHMM.split(":").map(Number);
        const [exitH, exitM] = time.split(":").map(Number);

        if (isNaN(entryH) || isNaN(entryM) || isNaN(exitH) || isNaN(exitM)) {
          console.log(`  ⚠️ ${worker.nombre_completo}: Hora inválida`);
          invalidTimeWorkers.push(worker);
          continue;
        }

        const entryTotalMinutes = entryH * 60 + entryM;
        const exitTotalMinutes = exitH * 60 + exitM;

        if (exitTotalMinutes <= entryTotalMinutes) {
          console.log(
            `  ⚠️ ${worker.nombre_completo}: Salida antes que entrada`,
          );
          invalidTimeWorkers.push(worker);
        } else if (activeRecord.hora_salida_at) {
          // Ya tiene salida → actualizar
          console.log(`  🔄 ${worker.nombre_completo}: Actualizar salida`);
          toUpdateWorkers.push(worker);
        } else {
          // Solo tiene entrada → registrar salida
          console.log(`  ✅ ${worker.nombre_completo}: Nueva salida`);
          registeredWorkers.push(worker);
        }
      }

      // Si hay horas inválidas, mostrar error
      if (invalidTimeWorkers.length > 0) {
        const namesList = invalidTimeWorkers
          .map((w) => `  • ${w.nombre_completo}`)
          .join("\n");
        const errorMessage = `⏰ La hora de salida debe ser posterior a la entrada:\n\n${namesList}`;
        toast.error(errorMessage, { duration: 6000 });
        return;
      }
    }

    // 🧠 REGLA OBLIGATORIA: Si existe entrada EN ESTA FECHA, SIEMPRE mostrar confirmación
    // (independientemente de si necesitamos actualizar o no)
    if (hasAnyEntryInDate) {
      console.log(
        `  📋 MOSTRANDO CONFIRMACIÓN porque existen entradas previas`,
      );
      if (type === "entrada") {
        setPendingBulkEntryData({
          registered: registeredWorkers,
          toUpdate: toUpdateWorkers,
          toReactivate: toReactivateWorkers,
          time,
          location: location || "", // Usar ubicación del modal
        });
        setShowBulkEntryConfirmation(true);
      } else {
        setPendingBulkExitData({
          registered: registeredWorkers,
          toUpdate: toUpdateWorkers,
          toReject: toRejectWorkers,
          time,
          observations: "", // Se pide en el modal de confirmación
        });
        setShowBulkExitConfirmation(true);
      }
      setShowBulkModal(false);
      return;
    }

    // Si NO existen entradas, proceder sin confirmación
    console.log(`  ✨ Procesando directamente (sin entradas previas)`);
    if (type === "entrada") {
      // Combinar actualizaciones + reactivaciones
      const allToUpdate = [...toUpdateWorkers, ...toReactivateWorkers];
      executeBulkRegister(
        registeredWorkers,
        allToUpdate,
        toRejectWorkers,
        type,
        time,
        location || "",
      );
    } else {
      executeBulkRegister(
        registeredWorkers,
        toUpdateWorkers,
        toRejectWorkers,
        type,
        time,
        "",
      );
    }
  };

  const executeBulkRegister = async (
    registered: typeof workers,
    toUpdate: typeof workers,
    toReject: typeof workers,
    type: "entrada" | "salida",
    time: string,
    locationOrObservations: string,
  ) => {
    try {
      let successCount = 0;
      const errors: Array<{ name: string; reason: string }> = [];
      const dateToCheck = selectedDate;
      const attendancesArray = Array.isArray(attendances) ? attendances : [];

      // Registrar nuevos
      for (const worker of registered) {
        try {
          if (type === "entrada") {
            // Registrar entrada (maneja ausentes también)
            await registerEntry({
              trabajador_id: worker.trabajador_id,
              fecha: dateToCheck,
              horaEntrada: time,
              ubicacion: locationOrObservations || "Campo",
            });
            successCount++;
          } else {
            // Registrar salida (solo para los que tienen entrada activa)
            const attendance = attendancesArray.find(
              (a) =>
                a.trabajador_id === worker.trabajador_id &&
                getDateString(a.fecha_at) === dateToCheck &&
                a.hora_entrada_at &&
                !a.deleted_at,
            );

            if (attendance) {
              await registerExit(
                {
                  trabajador_id: worker.trabajador_id,
                  horaSalida: time,
                  observacion: locationOrObservations || "",
                },
                dateToCheck,
              );
              successCount++;
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";
          console.error(
            `❌ Error registrando ${worker.nombre_completo}:`,
            error,
          );
          errors.push({
            name: worker.nombre_completo,
            reason: errorMessage,
          });
        }
      }

      // Actualizar existentes (incluyendo reactivaciones)
      for (const worker of toUpdate) {
        try {
          // Buscar TODOS los registros del trabajador en esa fecha
          const allRecords = attendancesArray.filter(
            (a) =>
              a.trabajador_id === worker.trabajador_id &&
              getDateString(a.fecha_at) === dateToCheck,
          );

          // Buscar registro activo
          const activeRecord = allRecords.find((a) => !a.deleted_at);

          // Buscar registro eliminado (para reactivación)
          const deletedRecord = allRecords.find((a) => a.deleted_at);

          if (type === "entrada") {
            if (activeRecord) {
              // Actualizar registro activo
              await updateAttendance(activeRecord.asistencia_id, {
                horaEntrada: time,
                ubicacion: locationOrObservations || "Campo",
              });
              successCount++;
            } else if (deletedRecord) {
              // Reactivar desde ausencia
              // NO incluir horaSalida ni observaciones_salida para evitar problemas de validación
              // El backend limpiará esos campos automáticamente al reactivar
              await updateAttendance(deletedRecord.asistencia_id, {
                horaEntrada: time,
                ubicacion: locationOrObservations || "Campo",
                deleted_at: null,
              });
              successCount++;
            }
          } else {
            // SALIDA: Solo actualizar si hay registro activo con entrada
            if (activeRecord && activeRecord.hora_entrada_at) {
              await updateAttendance(activeRecord.asistencia_id, {
                horaSalida: time,
                observaciones_salida: locationOrObservations || "",
              });
              successCount++;
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";
          console.error(
            `❌ Error actualizando ${worker.nombre_completo}:`,
            error,
          );
          errors.push({
            name: worker.nombre_completo,
            reason: errorMessage,
          });
        }
      }

      // Actualizar datos DESPUÉS de todas las operaciones
      await fetchAllAttendances();

      // Mostrar resumen
      const typeLabel = type === "entrada" ? "entrada" : "salida";
      const resultParts: string[] = [];

      if (registered.length > 0) {
        resultParts.push(
          `✅ ${registered.length} ${registered.length === 1 ? typeLabel + " registrada" : typeLabel + "s registradas"}`,
        );
      }
      if (toUpdate.length > 0) {
        resultParts.push(
          `🔄 ${toUpdate.length} ${toUpdate.length === 1 ? typeLabel + " actualizada" : typeLabel + "s actualizadas"}`,
        );
      }
      if (toReject.length > 0) {
        const rejectMessage =
          type === "salida"
            ? `❌ ${toReject.length} ${toReject.length === 1 ? "salida rechazada" : "salidas rechazadas"} (sin hora de entrada)`
            : `❌ ${toReject.length} ${toReject.length === 1 ? "entrada rechazada" : "entradas rechazadas"}`;
        resultParts.push(rejectMessage);
      }

      if (resultParts.length > 0) {
        const finalMessage = resultParts.join(" | ");
        if (registered.length > 0 || toUpdate.length > 0) {
          toast.success(finalMessage, { duration: 6000 });
        } else if (toReject.length > 0) {
          toast.error(finalMessage, { duration: 6000 });
        }
      }

      if (errors.length > 0) {
        const errorMsg = `❌ ${errors.length} error${errors.length === 1 ? "" : "es"} durante el registro`;
        toast.error(errorMsg);
      }

      setShowBulkModal(false);
      setShowBulkEntryConfirmation(false);
      setShowBulkExitConfirmation(false);
      setPendingBulkEntryData(null);
      setPendingBulkExitData(null);
    } catch (error) {
      console.error("Error en executeBulkRegister:", error);
      toast.error("Error al registrar en lote");
    }
  };

  const filteredWorkers = searchQuery
    ? workers.filter(
        (w) =>
          w.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.documento_identidad.includes(searchQuery),
      )
    : workers;

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />

      <HeaderGeneric>
        <TextGeneric variant="h5">Gestión de Asistencia</TextGeneric>
      </HeaderGeneric>

      {/* Date Selector */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        maxDate={getTodayString()}
        attendances={attendances}
        workers={workers}
      />

      {/* Main Content */}
      <div className="p-6">
        <WorkersStats
          totalWorkers={totalWorkers}
          entriesCount={entriesCount}
          exitsCount={exitsCount}
          absentsCount={absentsCount}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
            marginBottom: 3,
          }}
        >
          <TextFieldGeneric
            fullWidth
            placeholder="Buscar por nombre o código"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 370 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledSearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <ButtonGeneric
            onClick={() => setShowBulkModal(true)}
            startIcon={<AddIcon />}
          >
            Registro Masivo
          </ButtonGeneric>
        </Box>

        {/* Selected Workers Info and Actions */}
        {selectedWorkerIds.size > 0 && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  {selectedWorkerIds.size} trabajador
                  {selectedWorkerIds.size !== 1 ? "es" : ""} seleccionado
                  {selectedWorkerIds.size !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowBulkEntryModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Registrar Entrada
                </button>
                <button
                  onClick={() => setShowBulkExitModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Registrar Salida
                </button>
                <button
                  onClick={handleMarkAsAbsent}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  Marcar Ausentes
                </button>
                <button
                  onClick={() => setSelectedWorkerIds(new Set())}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Limpiar Selección
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Message */}
        {selectedDateAttendances.length === 0 && (
          <div className="mb-6 p-4 bg-slate-800 border border-slate-700 rounded-lg text-center">
            <p className="text-gray-400 text-sm">
              Sin registros para esta fecha
            </p>
          </div>
        )}

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          <AttendanceTable
            workers={filteredWorkers}
            attendances={attendances}
            selectedDate={selectedDate}
            loading={loading}
            onDelete={handleDelete}
            onRegisterEntry={registerEntry}
            onRegisterExit={registerExit}
            onUpdateAttendance={updateAttendance}
            onRefresh={handleRefresh}
            selectedWorkerIds={selectedWorkerIds}
            onSelectWorker={handleSelectWorker}
            onSelectAll={handleSelectAll}
          />
        )}

        {/* Attendance Table */}

        {/* Bulk Registration Modal */}
        {showBulkModal &&
          (() => {
            const dateToCheck = selectedDate;
            const attendancesArray = Array.isArray(attendances)
              ? attendances
              : [];
            const selectedDateAttendances = attendancesArray.filter(
              (a) => getDateString(a.fecha_at) === dateToCheck,
            );

            // Contar trabajadores únicos con entrada activa en la fecha seleccionada
            const workersWithEntryIds = new Set(
              selectedDateAttendances
                .filter((a) => a.hora_entrada_at && !a.deleted_at)
                .map((a) => a.trabajador_id),
            );
            const workersWithEntryCount = workersWithEntryIds.size;

            // Contar trabajadores únicos con salida activa en la fecha seleccionada
            const workersWithExitIds = new Set(
              selectedDateAttendances
                .filter((a) => a.hora_salida_at && !a.deleted_at)
                .map((a) => a.trabajador_id),
            );
            const workersWithExitCount = workersWithExitIds.size;

            const workersWithoutEntryCount =
              workers.length - workersWithEntryCount;

            return (
              <BulkRegistrationModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                onConfirm={handleBulkRegister}
                totalWorkers={totalWorkers}
                workersWithEntry={workersWithEntryCount}
                workersWithoutEntry={workersWithoutEntryCount}
                workersWithExit={workersWithExitCount}
              />
            );
          })()}

        {/* Bulk Exit Modal */}
        {showBulkExitModal &&
          (() => {
            const selectedWorkers = getSelectedWorkers();
            const attendancesArray = Array.isArray(attendances)
              ? attendances
              : [];

            // Trabajadores SIN entrada activa (no pueden registrar salida)
            const workersWithoutEntry = selectedWorkers.filter(
              (w) =>
                !attendancesArray.some(
                  (a) =>
                    a.trabajador_id === w.trabajador_id &&
                    getDateString(a.fecha_at) === selectedDate &&
                    a.hora_entrada_at &&
                    !a.deleted_at,
                ),
            ).length;

            // Trabajadores con entrada activa pero QUE YA TIENEN salida (no pueden registrar nuevamente sin actualizar)
            const workersWithExit = selectedWorkers.filter((w) =>
              attendancesArray.some(
                (a) =>
                  a.trabajador_id === w.trabajador_id &&
                  getDateString(a.fecha_at) === selectedDate &&
                  a.hora_entrada_at &&
                  a.hora_salida_at &&
                  !a.deleted_at,
              ),
            ).length;

            return (
              <BulkExitModal
                isOpen={showBulkExitModal}
                selectedCount={selectedWorkerIds.size}
                workersWithoutEntry={workersWithoutEntry}
                workersWithExit={workersWithExit}
                onClose={() => setShowBulkExitModal(false)}
                onConfirm={handleBulkExitSelected}
              />
            );
          })()}

        {/* Bulk Entry Modal */}
        {showBulkEntryModal &&
          (() => {
            const selectedWorkers = getSelectedWorkers();
            const attendancesArray = Array.isArray(attendances)
              ? attendances
              : [];
            const workersWithEntry = selectedWorkers.filter((w) =>
              attendancesArray.some(
                (a) =>
                  a.trabajador_id === w.trabajador_id &&
                  getDateString(a.fecha_at) === selectedDate &&
                  a.hora_entrada_at &&
                  !a.deleted_at,
              ),
            ).length;

            return (
              <BulkEntryModal
                isOpen={showBulkEntryModal}
                selectedCount={selectedWorkerIds.size}
                workersWithEntries={workersWithEntry}
                onClose={() => setShowBulkEntryModal(false)}
                onConfirm={handleBulkEntrySelected}
              />
            );
          })()}

        {/* Bulk Exit Confirmation Modal */}
        {showBulkExitConfirmation && pendingBulkExitData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">
                  {pendingBulkExitData?.toUpdate?.length > 0
                    ? "¿Reemplazar salida?"
                    : "¿Registrar salida?"}
                </h2>
              </div>

              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-sm text-yellow-300">
                  {pendingBulkExitData?.registered?.length > 0 &&
                    `✅ ${pendingBulkExitData?.registered?.length} ${pendingBulkExitData?.registered?.length === 1 ? "trabajador" : "trabajadores"} registrará salida`}
                  {pendingBulkExitData?.registered?.length > 0 &&
                    pendingBulkExitData?.toUpdate?.length > 0 &&
                    " | "}
                  {pendingBulkExitData?.toUpdate?.length > 0 &&
                    `🔄 ${pendingBulkExitData?.toUpdate?.length} ${pendingBulkExitData?.toUpdate?.length === 1 ? "trabajador" : "trabajadores"} reemplazará salida`}
                </p>
              </div>

              <p className="text-gray-300 mb-6">
                {pendingBulkExitData?.toUpdate?.length > 0
                  ? `¿Deseas reemplazar la hora de salida registrada con ${pendingBulkExitData?.time}?`
                  : `¿Deseas registrar la hora de salida ${pendingBulkExitData?.time}?`}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBulkExitConfirmation(false);
                    setPendingBulkExitData(null);
                    setShowBulkModal(true);
                  }}
                  className="flex-1 py-2 px-4 bg-[#0f1419] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#151a27] transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (pendingBulkExitData) {
                      processBulkExit(
                        pendingBulkExitData.registered,
                        pendingBulkExitData.toUpdate,
                        pendingBulkExitData.toReject,
                        pendingBulkExitData.time,
                        pendingBulkExitData.observations,
                      );
                    }
                  }}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
                >
                  {pendingBulkExitData?.toUpdate?.length > 0
                    ? "Sí, Reemplazar"
                    : "Sí, Registrar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showBulkEntryConfirmation && pendingBulkEntryData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-md w-full">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">
                  {pendingBulkEntryData?.toUpdate?.length > 0
                    ? "¿Reemplazar entrada?"
                    : "¿Registrar entrada?"}
                </h2>
              </div>

              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <div className="space-y-2 text-sm text-yellow-300">
                  {pendingBulkEntryData?.registered?.length > 0 && (
                    <p>
                      ✅ {pendingBulkEntryData?.registered?.length}{" "}
                      {pendingBulkEntryData?.registered?.length === 1
                        ? "trabajador registrará"
                        : "trabajadores registrarán"}{" "}
                      entrada
                    </p>
                  )}
                  {pendingBulkEntryData?.toUpdate?.length > 0 && (
                    <p>
                      🔄 {pendingBulkEntryData?.toUpdate?.length}{" "}
                      {pendingBulkEntryData?.toUpdate?.length === 1
                        ? "trabajador"
                        : "trabajadores"}{" "}
                      actualizará entrada
                    </p>
                  )}
                  {pendingBulkEntryData?.toReactivate?.length > 0 && (
                    <p>
                      🔁 {pendingBulkEntryData?.toReactivate?.length}{" "}
                      {pendingBulkEntryData?.toReactivate?.length === 1
                        ? "trabajador"
                        : "trabajadores"}{" "}
                      será reactivado
                      {pendingBulkEntryData?.toReactivate?.length === 1
                        ? ""
                        : "s"}{" "}
                      desde ausencia
                    </p>
                  )}
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                {pendingBulkEntryData?.toUpdate?.length > 0
                  ? `¿Deseas reemplazar la hora de entrada con ${pendingBulkEntryData?.time}?`
                  : `¿Deseas registrar la hora de entrada ${pendingBulkEntryData?.time}?`}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBulkEntryConfirmation(false);
                    setPendingBulkEntryData(null);
                    setShowBulkModal(true);
                  }}
                  className="flex-1 py-2 px-4 bg-[#0f1419] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#151a27] transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (pendingBulkEntryData) {
                      // Pasar registrados nuevos aparte, y combinar toUpdate + toReactivate como actualizaciones
                      const allToUpdate = [
                        ...(pendingBulkEntryData.toUpdate || []),
                        ...(pendingBulkEntryData.toReactivate || []),
                      ];
                      processBulkEntry(
                        pendingBulkEntryData.registered || [],
                        allToUpdate,
                        pendingBulkEntryData.time,
                        pendingBulkEntryData.location,
                      );
                    }
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                >
                  {pendingBulkEntryData?.toUpdate?.length > 0
                    ? "Sí, Reemplazar"
                    : "Sí, Registrar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
