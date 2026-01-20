import React, { useState } from 'react';
import { X, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { LocationParcelSelector, LocationValue, getLocationString, isLocationValid } from '../LocationParcelSelector';
import { useParcelsForAttendance } from '../../../application/hooks/useParcelsForAttendance';
import { getCurrentTimeHHMM } from '../../../application/utils/dateUtils';

interface BulkRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: 'entrada' | 'salida', time: string, location?: string) => Promise<void>;
  totalWorkers: number;
  workersWithEntry?: number;
  workersWithoutEntry?: number;
  workersWithExit?: number;
}

export const BulkRegistrationModal: React.FC<BulkRegistrationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalWorkers,
  workersWithEntry = 0,
  workersWithoutEntry = 0,
  workersWithExit = 0,
}) => {
  const [type, setType] = useState<'entrada' | 'salida'>('entrada');
  const [time, setTime] = useState(getCurrentTimeHHMM());
  const [locationValue, setLocationValue] = useState<LocationValue>({ type: 'parcel' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook para obtener parcelas
  const { parcels, loading: loadingParcels } = useParcelsForAttendance();

  const handleConfirm = async () => {
    try {
      setError(null);

      if (!time) {
        setError('Por favor ingresa la hora');
        return;
      }

      // Validar ubicación solo para entrada
      if (type === 'entrada' && !isLocationValid(locationValue, true)) {
        setError('Por favor selecciona o ingresa la ubicación/parcela');
        return;
      }

      const locationFinal = type === 'entrada' ? getLocationString(locationValue) : undefined;

      setLoading(true);
      await Promise.resolve(onConfirm(type, time, locationFinal));
      
      // Reset
      setTime(getCurrentTimeHHMM());
      setLocationValue({ type: 'parcel' });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const hasWarning = type === 'entrada' ? workersWithEntry > 0 : workersWithExit > 0;
  const noEntryWarning = type === 'salida' ? workersWithoutEntry > 0 : false;
  
  const warningMessage = type === 'entrada' 
    ? `${workersWithEntry} ya ${workersWithEntry === 1 ? 'tiene' : 'tienen'} entrada registrada`
    : `${workersWithExit} ya ${workersWithExit === 1 ? 'tiene' : 'tienen'} salida registrada`;
  
  const noEntryMessage = `${workersWithoutEntry} ${workersWithoutEntry === 1 ? 'no tiene' : 'no tienen'} entrada registrada (no se registrará salida)`;
  
  const workersToProcess = type === 'entrada' 
    ? totalWorkers - workersWithEntry 
    : totalWorkers - workersWithExit;

  // Validar si el botón de confirmar debe estar habilitado
  const isConfirmDisabled = loading || !time || (type === 'entrada' && !isLocationValid(locationValue, true));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Registro Masivo</h2>
              <p className="text-sm text-gray-400">Todos los trabajadores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Total Count */}
        <div className="mb-6">
          <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>{totalWorkers} trabajador{totalWorkers !== 1 ? 'es' : ''} total</strong>
            </p>
            {hasWarning && (
              <p className="text-xs text-yellow-300 mt-2">
                ⚠️ {warningMessage}
              </p>
            )}
            {noEntryWarning && (
              <p className="text-xs text-red-300 mt-2">
                ❌ {noEntryMessage}
              </p>
            )}
          </div>
        </div>

        {/* Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Tipo de Registro</label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setType('entrada');
                setError(null);
              }}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                type === 'entrada'
                  ? 'bg-green-600 text-white'
                  : 'bg-[#0f1419] border border-gray-700 text-gray-400 hover:border-gray-600'
              } disabled:opacity-50`}
            >
              Entrada
            </button>
            <button
              onClick={() => {
                setType('salida');
                setError(null);
              }}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                type === 'salida'
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#0f1419] border border-gray-700 text-gray-400 hover:border-gray-600'
              } disabled:opacity-50`}
            >
              Salida
            </button>
          </div>
        </div>

        {/* Time Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hora <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-blue-600 disabled:opacity-50"
          />
        </div>

        {/* Location Selector - Only show for entry */}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Info Text */}
        <p className="text-sm text-gray-400 mb-6">
          Se registrará {type === 'entrada' ? 'entrada' : 'salida'} a las <span className="font-mono font-semibold" style={{color: type === 'entrada' ? '#4ade80' : '#c084fc'}}>{time}</span>
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
            disabled={isConfirmDisabled}
            className={`flex-1 py-2 px-4 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              type === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Registrando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
