import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmReplaceTimeModalProps {
  isOpen: boolean;
  type: 'entrada' | 'salida';
  currentTime: string;
  newTime: string;
  workerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmReplaceTimeModal: React.FC<ConfirmReplaceTimeModalProps> = ({
  isOpen,
  type,
  currentTime,
  newTime,
  workerName,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  const typeLabel = type === 'entrada' ? 'entrada' : 'salida';
  const typeLabelCapitalized = type === 'entrada' ? 'Entrada' : 'Salida';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] border border-yellow-600/50 rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-bold text-white">¿Reemplazar {typeLabel}?</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-3">
          <p className="text-gray-300">
            <strong>{workerName}</strong> ya tiene una {typeLabel} registrada.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Current Time */}
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Hora actual</p>
              <p className="text-lg font-mono text-red-400 font-bold">{currentTime}</p>
            </div>

            {/* New Time */}
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Hora nueva</p>
              <p className="text-lg font-mono text-green-400 font-bold">{newTime}</p>
            </div>
          </div>

          <p className="text-sm text-yellow-300 bg-yellow-900/20 border border-yellow-600/30 rounded p-2">
            ⚠️ Esta acción reemplazará la {typeLabel} existente. ¿Estás seguro?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-[#0f1419] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#151a27] transition-colors font-semibold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? 'Reemplazando...' : 'Sí, Reemplazar'}
          </button>
        </div>
      </div>
    </div>
  );
};
