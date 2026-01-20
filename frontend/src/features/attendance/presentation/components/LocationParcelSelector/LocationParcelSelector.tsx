import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, AlertTriangle } from 'lucide-react';

/**
 * Representación simplificada de una parcela para el selector
 */
export interface ParcelOption {
  id: number;
  nombre: string;
  ubicacionDescripcion: string;
}

/**
 * Tipos de selección de ubicación disponibles
 */
export type LocationType = 'parcel' | 'not-applicable' | 'other';

export interface LocationValue {
  type: LocationType;
  parcelId?: number;
  parcelName?: string;
  customText?: string;
}

interface LocationParcelSelectorProps {
  parcels: ParcelOption[];
  loadingParcels?: boolean;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Selector híbrido de ubicación/parcela para el módulo de asistencia.
 * 
 * Permite:
 * - Seleccionar una parcela existente del catálogo
 * - Indicar "No aplica" para no especificar ubicación
 * - Seleccionar "Otro" para ingresar texto libre
 */
export const LocationParcelSelector: React.FC<LocationParcelSelectorProps> = ({
  parcels,
  loadingParcels = false,
  value,
  onChange,
  error,
  disabled = false,
  required = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-selector-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleTypeSelect = (type: LocationType, parcel?: ParcelOption) => {
    if (type === 'parcel' && parcel) {
      onChange({
        type: 'parcel',
        parcelId: parcel.id,
        parcelName: parcel.nombre,
        customText: undefined,
      });
    } else if (type === 'not-applicable') {
      onChange({
        type: 'not-applicable',
        parcelId: undefined,
        parcelName: undefined,
        customText: undefined,
      });
    } else if (type === 'other') {
      onChange({
        type: 'other',
        parcelId: undefined,
        parcelName: undefined,
        customText: value.customText || '',
      });
    }
    setIsDropdownOpen(false);
  };

  const handleCustomTextChange = (text: string) => {
    onChange({
      ...value,
      type: 'other',
      customText: text,
    });
  };

  /**
   * Obtiene el texto a mostrar en el selector según el valor actual
   */
  const getDisplayText = (): string => {
    if (value.type === 'parcel' && value.parcelName) {
      return value.parcelName;
    }
    if (value.type === 'not-applicable') {
      return 'No aplica';
    }
    if (value.type === 'other') {
      return 'Otro (texto libre)';
    }
    return 'Seleccionar ubicación...';
  };

  /**
   * Obtiene el valor final para enviar al backend
   */
  const getFinalValue = (): string => {
    if (value.type === 'parcel' && value.parcelName) {
      return value.parcelName;
    }
    if (value.type === 'not-applicable') {
      return 'N/A';
    }
    if (value.type === 'other' && value.customText) {
      return value.customText.trim();
    }
    return '';
  };

  const isValid = (): boolean => {
    if (!required) return true;
    
    if (value.type === 'parcel') {
      return !!value.parcelId;
    }
    if (value.type === 'not-applicable') {
      return true;
    }
    if (value.type === 'other') {
      return !!value.customText?.trim();
    }
    return false;
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300">
        Ubicación / Parcela {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selector principal */}
      <div className="location-selector-dropdown relative">
        <button
          type="button"
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 bg-[#0f1419] border rounded-lg flex items-center justify-between transition-colors ${
            error
              ? 'border-red-500'
              : isDropdownOpen
              ? 'border-blue-500'
              : 'border-gray-700 hover:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className={value.type ? 'text-white' : 'text-gray-500'}>
              {loadingParcels ? 'Cargando parcelas...' : getDisplayText()}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1f2e] border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            {/* Sección: Parcelas */}
            {parcels.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-700">
                  Parcelas disponibles
                </div>
                {parcels.map((parcel) => (
                  <button
                    key={parcel.id}
                    type="button"
                    onClick={() => handleTypeSelect('parcel', parcel)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-[#252d3d] transition-colors flex items-center gap-2 ${
                      value.type === 'parcel' && value.parcelId === parcel.id
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{parcel.nombre}</div>
                      {parcel.ubicacionDescripcion && (
                        <div className="text-xs text-gray-400 truncate">
                          {parcel.ubicacionDescripcion}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Separador si hay parcelas */}
            {parcels.length > 0 && <div className="border-t border-gray-700" />}

            {/* Opciones especiales */}
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-700">
              Otras opciones
            </div>

            {/* No aplica */}
            <button
              type="button"
              onClick={() => handleTypeSelect('not-applicable')}
              className={`w-full px-4 py-2.5 text-left hover:bg-[#252d3d] transition-colors flex items-center gap-2 ${
                value.type === 'not-applicable'
                  ? 'bg-gray-900/50 text-gray-300'
                  : 'text-gray-400'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center text-gray-500">—</span>
              <span>No aplica</span>
            </button>

            {/* Otro (texto libre) */}
            <button
              type="button"
              onClick={() => handleTypeSelect('other')}
              className={`w-full px-4 py-2.5 text-left hover:bg-[#252d3d] transition-colors flex items-center gap-2 ${
                value.type === 'other'
                  ? 'bg-yellow-900/30 text-yellow-300'
                  : 'text-gray-400'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center text-yellow-500">✎</span>
              <span>Otro (texto libre)</span>
            </button>
          </div>
        )}
      </div>

      {/* Campo de texto libre (solo si se selecciona "Otro") */}
      {value.type === 'other' && (
        <div className="mt-3">
          <input
            type="text"
            value={value.customText || ''}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder="Ej: Invernadero 3, Bodega principal..."
            disabled={disabled}
            className={`w-full px-4 py-2 bg-[#0f1419] border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
              error && !value.customText?.trim()
                ? 'border-red-500'
                : 'border-gray-700 focus:border-yellow-500'
            } ${disabled ? 'opacity-50' : ''}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa una ubicación personalizada
          </p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Mensaje informativo si no hay parcelas */}
      {!loadingParcels && parcels.length === 0 && (
        <p className="text-xs text-yellow-400 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          No hay parcelas registradas. Puede usar "Otro" para ingresar ubicación manual.
        </p>
      )}
    </div>
  );
};

/**
 * Función auxiliar para obtener el string final de ubicación
 */
export const getLocationString = (value: LocationValue): string => {
  if (value.type === 'parcel' && value.parcelName) {
    return value.parcelName;
  }
  if (value.type === 'not-applicable') {
    return 'N/A';
  }
  if (value.type === 'other' && value.customText) {
    return value.customText.trim();
  }
  return '';
};

/**
 * Función auxiliar para validar el valor de ubicación
 */
export const isLocationValid = (value: LocationValue, required: boolean = true): boolean => {
  if (!required) return true;

  if (value.type === 'parcel') {
    return !!value.parcelId;
  }
  if (value.type === 'not-applicable') {
    return true;
  }
  if (value.type === 'other') {
    return !!value.customText?.trim();
  }
  return false;
};

export default LocationParcelSelector;
