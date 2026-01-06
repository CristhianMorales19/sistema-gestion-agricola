import React, { useState } from 'react';
import { toast } from 'sonner';
import { AttendanceRecord, Worker, RegisterEntryData, RegisterExitData } from '../../../domain/entities/Attendance';
import { IndividualRegistrationModal } from '../IndividualRegistrationModal/IndividualRegistrationModal';
import { calculateHours } from '../../../application/utils/calculateHours';
import { getDateString, getTodayString } from '../../../application/utils/dateUtils';
import { CheckCircle2 } from 'lucide-react';

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
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const getWorkerStatus = (workerId: number) => {
    const todayAttendances = attendancesArray.filter(
      (a) => a.trabajador_id === workerId && getDateString(a.fecha_at) === dateToUse
    );
    
    const latestAttendance = todayAttendances.sort(
      (a, b) => new Date(b.fecha_at).getTime() - new Date(a.fecha_at).getTime()
    )[0];

    // Si no hay registro, estado pendiente (sin estado)
    if (!latestAttendance) {
      return { label: 'Sin estado', color: 'bg-gray-600' };
    }

    // Si está marcado como ausente explícitamente
    if (latestAttendance.deleted_at) {
      return { label: 'Ausente', color: 'bg-gray-500' };
    }

    // Si tiene entrada pero no salida
    if (latestAttendance.hora_entrada_at && !latestAttendance.hora_salida_at) {
      return { label: 'Entrada', color: 'bg-blue-500' };
    }

    // Si tiene entrada y salida
    if (latestAttendance.hora_entrada_at && latestAttendance.hora_salida_at) {
      return { label: 'Completo', color: 'bg-green-500' };
    }

    // Fallback
    return { label: 'Sin estado', color: 'bg-gray-600' };
  };

  const getWorkerTodayTimes = (workerId: number) => {
    const todayAttendance = attendancesArray.find(
      (a) => a.trabajador_id === workerId && getDateString(a.fecha_at) === dateToUse
    );
    
    // Si está marcado como ausente (deleted_at no null), no mostrar horas
    if (todayAttendance && todayAttendance.deleted_at) {
      return { entrada: '-', salida: '-' };
    }
    
    return todayAttendance
      ? { entrada: formatTime(todayAttendance.hora_entrada_at), salida: formatTime(todayAttendance.hora_salida_at) }
      : { entrada: '-', salida: '-' };
  };

  const handleRegisterClick = (worker: Worker) => {
    setSelectedWorker(worker);
    setShowIndividualModal(true);
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      await onDelete(id);
      toast.success('Registro eliminado correctamente');
      setDeleteConfirmId(null);
      await onRefresh();
    } catch (error) {
      toast.error('Error al eliminar el registro');
    }
  };

  if (loading) {
    return (
      <div className="border border-slate-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">Cargando trabajadores...</p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-950">
                <th className="px-4 py-4 text-left"></th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Nombre</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Hora Entrada</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Hora Salida</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Horas Trabajadas</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Observaciones</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    No hay trabajadores disponibles
                  </td>
                </tr>
              ) : (
                workers.map((worker) => {
                  const status = getWorkerStatus(worker.trabajador_id);
                  const times = getWorkerTodayTimes(worker.trabajador_id);
                  const todayAttendance = attendancesArray.find(
                    (a) => a.trabajador_id === worker.trabajador_id && getDateString(a.fecha_at) === dateToUse
                  );
                  // Si está marcado como ausente, no mostrar horas trabajadas
                  const horasTrabajadas = (todayAttendance && !todayAttendance.deleted_at)
                    ? calculateHours(todayAttendance.hora_entrada_at, todayAttendance.hora_salida_at)
                    : '—';
                  const isSelected = selectedWorkerIds.has(worker.trabajador_id);

                  return (
                    <tr 
                      key={worker.trabajador_id} 
                      className={`border-b border-slate-700 transition-colors ${
                        isSelected 
                          ? 'bg-blue-900/30' 
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectWorker?.(worker.trabajador_id)}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-300">{worker.documento_identidad}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{worker.nombre_completo}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-gray-300">{times.entrada}</td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-gray-300">{times.salida}</td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-gray-300 font-semibold text-blue-400">{horasTrabajadas}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-400">{todayAttendance?.observaciones_salida || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleRegisterClick(worker)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          Registrar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Registration Modal */}
      {showIndividualModal && selectedWorker && (() => {
        // Find the selected date's attendance for this worker
        const todayAttendance = attendancesArray.find(
          (a) => a.trabajador_id === selectedWorker.trabajador_id && 
                 getDateString(a.fecha_at) === dateToUse
        );
        
        // Distinguir entre activos (no deleted_at) y ausentes (deleted_at)
        const activeAttendance = todayAttendance && !todayAttendance.deleted_at ? todayAttendance : null;
        const absentAttendance = todayAttendance && todayAttendance.deleted_at ? todayAttendance : null;
        
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
            hasActiveEntry={!!activeAttendance && !!activeAttendance.hora_entrada_at}
            entryTime={activeAttendance?.hora_entrada_at || undefined}
            existingEntryTime={activeAttendance?.hora_entrada_at ? activeAttendance.hora_entrada_at : undefined}
            existingExitTime={activeAttendance?.hora_salida_at ? activeAttendance.hora_salida_at : undefined}
            existingAttendanceId={attendanceForModal?.asistencia_id || undefined}
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
            <h3 className="text-lg font-bold text-white mb-4">¿Confirmar eliminación?</h3>
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
