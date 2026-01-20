import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Worker, RegisterEntryData, RegisterExitData } from '../../../domain/entities/Attendance';
import { calculateHours, validateExitTime, extractTimeHHMM } from '../../../application/utils/calculateHours';
import { ConfirmReplaceTimeModal } from '../ConfirmReplaceTimeModal/ConfirmReplaceTimeModal';
import { LocationParcelSelector, LocationValue, getLocationString, isLocationValid } from '../LocationParcelSelector';
import { useParcelsForAttendance } from '../../../application/hooks/useParcelsForAttendance';
import { getCurrentTimeHHMM } from '../../../application/utils/dateUtils';

interface IndividualRegistrationModalProps {
  isOpen: boolean;
  worker: Worker;
  onClose: () => void;
  onRegisterEntry: (data: RegisterEntryData) => Promise<void>;
  onRegisterExit: (data: RegisterExitData) => Promise<void>;
  onUpdateAttendance: (id: number, data: any) => Promise<void>;
  hasActiveEntry: boolean;
  entryTime?: string;
  existingEntryTime?: string;
  existingExitTime?: string;
  existingAttendanceId?: number;
  onSuccess: () => void;
  selectedDate?: string; // YYYY-MM-DD
  isAbsent?: boolean; // Flag para indicar si el trabajador está marcado como ausente
}

export const IndividualRegistrationModal: React.FC<IndividualRegistrationModalProps> = ({
  isOpen,
  worker,
  onClose,
  onRegisterEntry,
  onRegisterExit,
  onUpdateAttendance,
  hasActiveEntry,
  entryTime,
  existingEntryTime,
  existingExitTime,
  existingAttendanceId,
  onSuccess,
  selectedDate,
  isAbsent = false,
}) => {
  // Determinar tipo inicial: si hay entrada pero no salida, pre-seleccionar salida
  // Si hay entrada y salida, permitir cambiar (no forzar salida)
  // Si no hay entrada, empezar con entrada
  const hasExitTime = !!existingExitTime;
  const initialType = hasActiveEntry && !hasExitTime ? 'salida' : 'entrada';
  
  const [type, setType] = useState<'entrada' | 'salida'>(initialType);
  const [time, setTime] = useState(getCurrentTimeHHMM());
  const [locationValue, setLocationValue] = useState<LocationValue>({ type: 'parcel' });
  const [observations, setObservations] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'entrada' | 'salida'; time: string } | null>(null);

  // Hook para obtener parcelas
  const { parcels, loading: loadingParcels } = useParcelsForAttendance();

  const handleConfirm = async () => {
    try {
      setError(null);

      // Validar hora
      if (!time) {
        setError('Por favor ingresa una hora');
        return;
      }

      // Si es salida, OBLIGATORIAMENTE debe haber entrada activa
      if (type === 'salida') {
        // Si está marcado como ausente, no puede registrar salida
        if (isAbsent) {
          setError('❌ Este trabajador está marcado como AUSENTE.\n\nPrimero debe registrar una ENTRADA para poder registrar salida.');
          return;
        }

        // Si no hay entrada activa, no puede registrar salida
        if (!hasActiveEntry || !entryTime) {
          setError('⏰ No hay entrada registrada.\n\nDebe registrar una entrada antes de poder registrar la salida.');
          return;
        }

        // Validar que hora de salida >= hora de entrada
        const entryTimeHHMM = extractTimeHHMM(entryTime);
        console.log(`🔍 VALIDANDO SALIDA - entryTime: "${entryTime}" -> entryTimeHHMM: "${entryTimeHHMM}"`);
        console.log(`🔍 VALIDANDO SALIDA - time (input): "${time}"`);
        
        const isValid = validateExitTime(entryTimeHHMM || '', time);
        console.log(`🔍 VALIDANDO SALIDA - Resultado: ${isValid}`);
        
        if (!isValid) {
          console.log(`❌ VALIDACIÓN FALLÓ - Mostrando error`);
          setError('La hora de salida debe ser mayor a la hora de entrada');
          return;
        }
        console.log(`✅ VALIDACIÓN PASÓ`);
      }

      // Validar si intenta cambiar entrada existente
      if (type === 'entrada' && existingEntryTime) {
        setPendingAction({ type: 'entrada', time });
        setShowConfirmReplace(true);
        return;
      }

      // Validar si intenta cambiar salida existente
      if (type === 'salida' && existingExitTime) {
        setPendingAction({ type: 'salida', time });
        setShowConfirmReplace(true);
        return;
      }

      // Si todo está validado, proceder con el registro
      await performRegistration(type, time);
    } catch (error) {
      toast.error('Error al registrar');
    }
  };

  const performRegistration = async (regType: 'entrada' | 'salida', regTime: string) => {
    try {
      setLoading(true);
      console.log(`🔍 performRegistration - Type: ${regType}, Time: ${regTime}, existingAttendanceId: ${existingAttendanceId}, isAbsent: ${isAbsent}`);

      if (regType === 'entrada') {
        // Validar ubicación usando el nuevo selector
        if (!isLocationValid(locationValue, true)) {
          setError('Por favor selecciona o ingresa la ubicación/parcela');
          setLoading(false);
          return;
        }

        const ubicacionFinal = getLocationString(locationValue);

        // Si el trabajador está ausente, necesita reactivación
        if (isAbsent && existingAttendanceId) {
          console.log('🔄 Reactivando entrada para trabajador ausente:', { 
            attendanceId: existingAttendanceId, 
            newTime: regTime, 
            ubicacion: ubicacionFinal 
          });
          await onUpdateAttendance(existingAttendanceId, {
            horaEntrada: regTime,
            ubicacion: ubicacionFinal,
            deleted_at: null, // Limpiar el deleted_at para reactivar
          });
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success(`Entrada reactivada para ${worker.nombre_completo}`);
        } else if (existingEntryTime && existingAttendanceId) {
          console.log('🔄 Actualizando entrada:', { 
            attendanceId: existingAttendanceId, 
            newTime: regTime, 
            ubicacion: ubicacionFinal 
          });
          await onUpdateAttendance(existingAttendanceId, {
            horaEntrada: regTime,
            ubicacion: ubicacionFinal,
          });
          // Wait for state to update
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success(`Entrada actualizada para ${worker.nombre_completo}`);
        } else {
          console.log('➕ Registrando nueva entrada:', { 
            trabajador_id: worker.trabajador_id, 
            fecha: selectedDate,
            horaEntrada: regTime, 
            ubicacion: ubicacionFinal 
          });
          await onRegisterEntry({
            trabajador_id: worker.trabajador_id,
            fecha: selectedDate, // Usar la fecha seleccionada
            horaEntrada: regTime,
            ubicacion: ubicacionFinal,
          });
          toast.success(`Entrada registrada para ${worker.nombre_completo}`);
        }
      } else {
        // Validación de salida ya se hizo en handleConfirm, así que aquí solo registrar
        // Si hay una salida existente, actualizar en lugar de crear
        if (existingExitTime && existingAttendanceId) {
          console.log('🔄 Actualizando salida:', { 
            attendanceId: existingAttendanceId, 
            newTime: regTime, 
            observaciones: observations.trim() 
          });
          await onUpdateAttendance(existingAttendanceId, {
            horaSalida: regTime,
            observaciones_salida: observations.trim(),
          });
          // Wait for state to update
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success(`Salida actualizada para ${worker.nombre_completo}`);
        } else {
          console.log('➕ Registrando nueva salida:', { 
            trabajador_id: worker.trabajador_id, 
            horaSalida: regTime, 
            observacion: observations.trim() 
          });
          await onRegisterExit({
            trabajador_id: worker.trabajador_id,
            horaSalida: regTime,
            observacion: observations.trim(),
          });
          toast.success(`Salida registrada para ${worker.nombre_completo}`);
        }
      }

      setLocationValue({ type: 'parcel' });
      setObservations('');
      setPendingAction(null);
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReplace = async () => {
    if (!pendingAction) return;
    
    await performRegistration(pendingAction.type, pendingAction.time);
    setShowConfirmReplace(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Registrar Asistencia</h2>
            <p className="text-sm text-gray-400 mt-1">{worker.nombre_completo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Tipo de Registro</label>
          <div className="flex gap-3">
            <button
              onClick={() => setType('entrada')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                type === 'entrada'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0f1419] border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              Entrada
            </button>
            <button
              onClick={() => {
                if (!hasActiveEntry && !isAbsent) {
                  setError('⏰ Debe registrar una entrada primero antes de poder registrar salida');
                  return;
                }
                setType('salida');
                setError(null);
              }}
              disabled={!hasActiveEntry && !isAbsent}
              title={!hasActiveEntry && !isAbsent ? 'Debe registrar una entrada primero' : ''}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                type === 'salida'
                  ? 'bg-purple-600 text-white'
                  : !hasActiveEntry && !isAbsent
                  ? 'bg-[#0f1419] border border-gray-700 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-[#0f1419] border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              Salida
            </button>
          </div>
          {!hasActiveEntry && !isAbsent && type === 'salida' && (
            <p className="text-xs text-yellow-400 mt-2">⚠️ No hay entrada registrada</p>
          )}
        </div>

        {/* Time Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600"
          />
          {entryTime && type === 'salida' && (
            <p className="text-xs text-gray-400 mt-2">
              Entrada: {extractTimeHHMM(entryTime) || entryTime}
            </p>
          )}
        </div>

        {/* Ubicación - Only show for entry */}
        {type === 'entrada' && (
          <div className="mb-6">
            <LocationParcelSelector
              parcels={parcels}
              loadingParcels={loadingParcels}
              value={locationValue}
              onChange={setLocationValue}
              disabled={loading}
              required={true}
            />
          </div>
        )}

        {/* Observations - Only show for exit */}
        {type === 'salida' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Observaciones</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Notas adicionales (opcional)"
              className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 resize-none h-20"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-600 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-200 whitespace-pre-line">{error}</div>
            </div>
          </div>
        )}

        {/* Info Text */}
        <p className="text-sm text-gray-400 mb-6">
          Se registrará {type === 'entrada' ? 'entrada' : 'salida'} a las {time}
          {type === 'salida' && entryTime && ` (${calculateHours(entryTime, time)} de trabajo)`}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-[#0f1419] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#151a27] transition-colors font-semibold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 ${
              type === 'entrada' ? 'bg-blue-600' : 'bg-purple-600'
            }`}
          >
            {loading ? 'Registrando...' : 'Confirmar'}
          </button>
        </div>

        {/* Confirm Replace Modal */}
        {pendingAction && (
          <ConfirmReplaceTimeModal
            isOpen={showConfirmReplace}
            type={pendingAction.type}
            currentTime={
              pendingAction.type === 'entrada'
                ? (existingEntryTime || '-')
                : (existingExitTime || '-')
            }
            newTime={pendingAction.time}
            workerName={worker.nombre_completo}
            onConfirm={handleConfirmReplace}
            onCancel={() => {
              setShowConfirmReplace(false);
              setPendingAction(null);
            }}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
