import { Parcel, CreateParcelDTO, TIPOS_TERRENO_CATALOGO } from '../domain/entities/Parcel';

export class ParcelService {
  /**
   * Valida que una parcela sea válida
   */
  static validateParcel(data: Partial<CreateParcelDTO>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.nombre) {
      errors.push('El nombre es obligatorio');
    } else if (data.nombre.trim().length === 0) {
      errors.push('El nombre no puede estar vacío');
    } else if (data.nombre.trim().length > 120) {
      errors.push('El nombre no puede exceder 120 caracteres');
    }

    if (!data.ubicacionDescripcion) {
      errors.push('La ubicación es obligatoria');
    } else if (data.ubicacionDescripcion.trim().length === 0) {
      errors.push('La ubicación no puede estar vacía');
    } else if (data.ubicacionDescripcion.trim().length > 250) {
      errors.push('La ubicación no puede exceder 250 caracteres');
    }

    if (data.areaHectareas === undefined || data.areaHectareas === null) {
      errors.push('El área es obligatoria');
    } else if (isNaN(data.areaHectareas) || data.areaHectareas <= 0) {
      errors.push('El área debe ser un número mayor a 0');
    }

    // Validar tipo de terreno
    if (data.tipoTerreno) {
      const tiposValidos = TIPOS_TERRENO_CATALOGO.map(t => t.value);
      if (!tiposValidos.includes(data.tipoTerreno)) {
        errors.push('Tipo de terreno inválido');
      }

      // Si es "otro", validar texto personalizado
      if (data.tipoTerreno === 'otro') {
        if (!data.tipoTerrenoOtro || data.tipoTerrenoOtro.trim().length === 0) {
          errors.push('Debe especificar el tipo de terreno cuando selecciona "Otro"');
        } else if (data.tipoTerrenoOtro.trim().length > 80) {
          errors.push('El tipo de terreno personalizado no puede exceder 80 caracteres');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Obtiene la etiqueta del tipo de terreno
   */
  static getTipoTerrenoLabel(tipoTerreno: string | null | undefined, tipoTerrenoOtro?: string | null): string {
    if (!tipoTerreno) return 'No especificado';
    
    if (tipoTerreno === 'otro' && tipoTerrenoOtro) {
      return tipoTerrenoOtro;
    }

    const found = TIPOS_TERRENO_CATALOGO.find(t => t.value === tipoTerreno);
    return found?.label || tipoTerreno;
  }

  /**
   * Obtiene el color del estado
   */
  static getEstadoColor(estado: string | undefined): string {
    const colors: Record<string, string> = {
      disponible: '#10b981',
      ocupada: '#f97316',
      mantenimiento: '#eab308',
      inactiva: '#6b7280',
    };
    return colors[estado || 'disponible'] || '#6b7280';
  }

  /**
   * Obtiene la etiqueta del estado
   */
  static getEstadoLabel(estado: string | undefined): string {
    const labels: Record<string, string> = {
      disponible: 'Disponible',
      ocupada: 'Ocupada',
      mantenimiento: 'En Mantenimiento',
      inactiva: 'Inactiva',
    };
    return labels[estado || 'disponible'] || estado || 'Sin estado';
  }

  /**
   * Formatea el área en hectáreas
   */
  static formatArea(areaHectareas: number | undefined): string {
    if (areaHectareas === undefined || areaHectareas === null) return 'N/A';
    return `${areaHectareas.toFixed(2)} ha`;
  }

  /**
   * Calcula estadísticas de parcelas
   */
  static calculateStats(parcels: Parcel[]): {
    totalParcelas: number;
    areaTotal: number;
    porEstado: Record<string, number>;
    porTipoTerreno: Record<string, number>;
  } {
    if (parcels.length === 0) {
      return {
        totalParcelas: 0,
        areaTotal: 0,
        porEstado: {},
        porTipoTerreno: {},
      };
    }

    const porEstado: Record<string, number> = {};
    const porTipoTerreno: Record<string, number> = {};
    let areaTotal = 0;

    parcels.forEach((parcel) => {
      // Conteo por estado
      const estado = parcel.estado || 'disponible';
      porEstado[estado] = (porEstado[estado] || 0) + 1;

      // Conteo por tipo de terreno
      const tipoTerreno = parcel.tipoTerreno || 'sin_especificar';
      porTipoTerreno[tipoTerreno] = (porTipoTerreno[tipoTerreno] || 0) + 1;

      // Sumar área
      areaTotal += parcel.areaHectareas || 0;
    });

    return {
      totalParcelas: parcels.length,
      areaTotal,
      porEstado,
      porTipoTerreno,
    };
  }
}
