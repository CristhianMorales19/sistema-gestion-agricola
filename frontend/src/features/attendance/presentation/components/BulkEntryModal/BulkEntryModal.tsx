import React, { useState } from 'react';
import { X, AlertTriangle, AlertCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { LocationParcelSelector, LocationValue, getLocationString, isLocationValid } from '../LocationParcelSelector';
import { useParcelsForAttendance } from '../../../application/hooks/useParcelsForAttendance';
import { getCurrentTimeHHMM } from '../../../application/utils/dateUtils';

interface BulkEntryModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (time: string, location: string) => Promise<void>;
  workersWithEntries?: number; // Number of workers that already have entries
}

export const BulkEntryModal: React.FC<BulkEntryModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onConfirm,
  workersWithEntries = 0,
}) => {
  const [time, setTime] = useState(getCurrentTimeHHMM());
  const [locationValue, setLocationValue] = useState<LocationValue>({ type: 'parcel' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook para obtener parcelas
  const { parcels, loading: loadingParcels } = useParcelsForAttendance();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setError(null);

      if (!time) {
        setError('Por favor ingresa la hora de entrada');
        return;
      }

      // Validar ubicación usando el nuevo selector
      if (!isLocationValid(locationValue, true)) {
        setError('Por favor selecciona o ingresa la ubicación/parcela');
        return;
      }

      const locationFinal = getLocationString(locationValue);

      setLoading(true);
      await onConfirm(time, locationFinal);
      
      // Reset form
      setTime(getCurrentTimeHHMM());
      setLocationValue({ type: 'parcel' });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar entrada';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const workersToRegister = selectedCount - workersWithEntries;
  const hasWarning = workersWithEntries > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 rounded-lg p-2">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Registrar Entrada</h2>
              <p className="text-sm text-gray-400">Seleccionados</p>
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

        {/* Selected Count */}
        <div className="mb-6">
          <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
            <p className="text-sm text-green-300">
              <strong>{selectedCount} trabajador{selectedCount !== 1 ? 'es' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}</strong>
            </p>
            {hasWarning && (
              <p className="text-xs text-yellow-300 mt-2">
                ⚠️ {workersWithEntries} ya {workersWithEntries === 1 ? 'tiene' : 'tienen'} entrada registrada
              </p>
            )}
          </div>
        </div>

        {/* Time Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hora de Entrada <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-green-600 disabled:opacity-50"
          />
        </div>

        {/* Location Selector */}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Info Text */}
        <p className="text-sm text-gray-400 mb-6">
          Se registrará entrada a las <span className="font-mono font-semibold text-green-400">{time}</span>
        </p>

        {/* Buttons */}
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
            disabled={loading || !time || !isLocationValid(locationValue, true)}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Confirmar Entrada'}
          </button>
        </div>
      </div>
    </div>
  );
};
