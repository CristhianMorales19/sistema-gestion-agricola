import React, { useState } from 'react';
import { X, AlertTriangle, AlertCircle, LogOut } from 'lucide-react';
import { getCurrentTimeHHMM } from '../../../application/utils/dateUtils';

interface BulkExitModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: (time: string, observations: string) => Promise<void>;
  workersWithoutEntry?: number; // Number of workers without entry
  workersWithExit?: number; // Number of workers with exit already registered
}

export const BulkExitModal: React.FC<BulkExitModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onConfirm,
  workersWithoutEntry = 0,
  workersWithExit = 0,
}) => {
  const [time, setTime] = useState(getCurrentTimeHHMM());
  const [observations, setObservations] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setError(null);

      if (!time) {
        setError('Por favor ingresa la hora de salida');
        return;
      }

      setLoading(true);
      await onConfirm(time, observations.trim());
      
      // Reset form
      setTime(getCurrentTimeHHMM());
      setObservations('');
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar salida';
      setError(errorMessage);
      // No usar toast, mostrar solo en el dialog
    } finally {
      setLoading(false);
    }
  };

  const workersCanExit = selectedCount - workersWithoutEntry;
  const hasWarning = workersWithoutEntry > 0 || workersWithExit > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Registrar Salida</h2>
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
          <div className="p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
            <p className="text-sm text-purple-300 mb-3">
              <strong>{selectedCount} trabajador{selectedCount !== 1 ? 'es' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}</strong>
            </p>
            
            {/* Resumen de estado */}
            <div className="space-y-2 text-xs">
              {(selectedCount - workersWithoutEntry - workersWithExit) > 0 && (
                <p className="text-green-300">
                  ✔ {(selectedCount - workersWithoutEntry - workersWithExit)} {(selectedCount - workersWithoutEntry - workersWithExit) === 1 ? 'puede registrar' : 'pueden registrar'} salida (nueva)
                </p>
              )}
              
              {workersWithExit > 0 && (
                <p className="text-blue-300">
                  🔄 {workersWithExit} {workersWithExit === 1 ? 'puede actualizar' : 'pueden actualizar'} salida (existente)
                </p>
              )}
              
              {workersWithoutEntry > 0 && (
                <p className="text-red-400">
                  ❌ {workersWithoutEntry} {workersWithoutEntry === 1 ? 'no tiene' : 'no tienen'} entrada registrada
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Time Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hora de Salida <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-purple-600 disabled:opacity-50"
          />
        </div>

        {/* Observations Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Observaciones
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Notas adicionales (opcional)"
            disabled={loading}
            className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-purple-600 disabled:opacity-50 resize-none h-20"
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
          Se registrará salida a las <span className="font-mono font-semibold text-purple-400">{time}</span>
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
            disabled={loading || !time}
            className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Confirmar Salida'}
          </button>
        </div>
      </div>
    </div>
  );
};
