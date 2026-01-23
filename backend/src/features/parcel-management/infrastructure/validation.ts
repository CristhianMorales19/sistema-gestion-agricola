/*
 * Validación: Parcelas
 * Funciones de validación para los datos de entrada
 */

import { TIPOS_TERRENO_CATALOGO } from '../application/ParcelService';

export interface CreateParcelValidation {
  nombre: string;
  ubicacionDescripcion: string;
  areaHectareas: number;
  tipoTerreno?: string | null;
  tipoTerrenoOtro?: string | null;
  descripcion?: string | null;
  observaciones?: string | null;
}

export interface UpdateParcelValidation {
  nombre?: string;
  ubicacionDescripcion?: string;
  areaHectareas?: number;
  tipoTerreno?: string | null;
  tipoTerrenoOtro?: string | null;
  descripcion?: string | null;
  observaciones?: string | null;
  estado?: string;
}

/*
 * Validar datos para crear parcela
 */
export function validateCreateParcel(data: any): CreateParcelValidation {
  const errors: string[] = [];

  // Validar nombre (obligatorio)
  if (!data.nombre) {
    errors.push('nombre es requerido');
  } else if (typeof data.nombre !== 'string') {
    errors.push('nombre debe ser una cadena de texto');
  } else if (data.nombre.trim().length === 0) {
    errors.push('nombre no puede estar vacío');
  } else if (data.nombre.trim().length > 120) {
    errors.push('nombre no puede exceder 120 caracteres');
  }

  // Validar ubicación (obligatorio)
  if (!data.ubicacionDescripcion) {
    errors.push('ubicacionDescripcion es requerida');
  } else if (typeof data.ubicacionDescripcion !== 'string') {
    errors.push('ubicacionDescripcion debe ser una cadena de texto');
  } else if (data.ubicacionDescripcion.trim().length === 0) {
    errors.push('ubicacionDescripcion no puede estar vacía');
  } else if (data.ubicacionDescripcion.trim().length > 250) {
    errors.push('ubicacionDescripcion no puede exceder 250 caracteres');
  }

  // Validar área (obligatorio)
  if (data.areaHectareas === undefined || data.areaHectareas === null) {
    errors.push('areaHectareas es requerida');
  } else if (typeof data.areaHectareas !== 'number' || isNaN(data.areaHectareas)) {
    errors.push('areaHectareas debe ser un número válido');
  } else if (data.areaHectareas <= 0) {
    errors.push('areaHectareas debe ser mayor a 0');
  }

  // Validar tipo de terreno (opcional)
  if (data.tipoTerreno !== undefined && data.tipoTerreno !== null) {
    if (!TIPOS_TERRENO_CATALOGO.includes(data.tipoTerreno)) {
      errors.push(`tipoTerreno debe ser uno de: ${TIPOS_TERRENO_CATALOGO.join(', ')}`);
    }

    // Si es "otro", validar texto personalizado
    if (data.tipoTerreno === 'otro') {
      if (!data.tipoTerrenoOtro || typeof data.tipoTerrenoOtro !== 'string' || data.tipoTerrenoOtro.trim().length === 0) {
        errors.push('tipoTerrenoOtro es requerido cuando tipoTerreno es "otro"');
      } else if (data.tipoTerrenoOtro.trim().length > 80) {
        errors.push('tipoTerrenoOtro no puede exceder 80 caracteres');
      }
    }
  }

  // Validar descripción (opcional)
  if (data.descripcion !== undefined && data.descripcion !== null) {
    if (typeof data.descripcion !== 'string') {
      errors.push('descripcion debe ser una cadena de texto');
    }
  }

  // Validar observaciones (opcional)
  if (data.observaciones !== undefined && data.observaciones !== null) {
    if (typeof data.observaciones !== 'string') {
      errors.push('observaciones debe ser una cadena de texto');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Errores de validación: ${errors.join(', ')}`);
  }

  return {
    nombre: data.nombre.trim(),
    ubicacionDescripcion: data.ubicacionDescripcion.trim(),
    areaHectareas: data.areaHectareas,
    tipoTerreno: data.tipoTerreno || null,
    tipoTerrenoOtro: data.tipoTerreno === 'otro' ? data.tipoTerrenoOtro?.trim() || null : null,
    descripcion: data.descripcion?.trim() || null,
    observaciones: data.observaciones?.trim() || null
  };
}

/*
 * Validar datos para actualizar parcela
 */
export function validateUpdateParcel(data: any): UpdateParcelValidation {
  const errors: string[] = [];
  const validationResult: UpdateParcelValidation = {};

  // Validar nombre (opcional)
  if (data.nombre !== undefined) {
    if (typeof data.nombre !== 'string') {
      errors.push('nombre debe ser una cadena de texto');
    } else if (data.nombre.trim().length === 0) {
      errors.push('nombre no puede estar vacío');
    } else if (data.nombre.trim().length > 120) {
      errors.push('nombre no puede exceder 120 caracteres');
    } else {
      validationResult.nombre = data.nombre.trim();
    }
  }

  // Validar ubicación (opcional)
  if (data.ubicacionDescripcion !== undefined) {
    if (typeof data.ubicacionDescripcion !== 'string') {
      errors.push('ubicacionDescripcion debe ser una cadena de texto');
    } else if (data.ubicacionDescripcion.trim().length === 0) {
      errors.push('ubicacionDescripcion no puede estar vacía');
    } else if (data.ubicacionDescripcion.trim().length > 250) {
      errors.push('ubicacionDescripcion no puede exceder 250 caracteres');
    } else {
      validationResult.ubicacionDescripcion = data.ubicacionDescripcion.trim();
    }
  }

  // Validar área (opcional)
  if (data.areaHectareas !== undefined) {
    if (typeof data.areaHectareas !== 'number' || isNaN(data.areaHectareas)) {
      errors.push('areaHectareas debe ser un número válido');
    } else if (data.areaHectareas <= 0) {
      errors.push('areaHectareas debe ser mayor a 0');
    } else {
      validationResult.areaHectareas = data.areaHectareas;
    }
  }

  // Validar tipo de terreno (opcional)
  if (data.tipoTerreno !== undefined) {
    if (data.tipoTerreno !== null && !TIPOS_TERRENO_CATALOGO.includes(data.tipoTerreno)) {
      errors.push(`tipoTerreno debe ser uno de: ${TIPOS_TERRENO_CATALOGO.join(', ')}`);
    } else {
      validationResult.tipoTerreno = data.tipoTerreno;

      // Si es "otro", validar texto personalizado
      if (data.tipoTerreno === 'otro') {
        if (!data.tipoTerrenoOtro || typeof data.tipoTerrenoOtro !== 'string' || data.tipoTerrenoOtro.trim().length === 0) {
          errors.push('tipoTerrenoOtro es requerido cuando tipoTerreno es "otro"');
        } else if (data.tipoTerrenoOtro.trim().length > 80) {
          errors.push('tipoTerrenoOtro no puede exceder 80 caracteres');
        } else {
          validationResult.tipoTerrenoOtro = data.tipoTerrenoOtro.trim();
        }
      }
    }
  }

  // Validar descripción (opcional)
  if (data.descripcion !== undefined) {
    if (data.descripcion !== null && typeof data.descripcion !== 'string') {
      errors.push('descripcion debe ser una cadena de texto');
    } else {
      validationResult.descripcion = data.descripcion?.trim() || null;
    }
  }

  // Validar observaciones (opcional)
  if (data.observaciones !== undefined) {
    if (data.observaciones !== null && typeof data.observaciones !== 'string') {
      errors.push('observaciones debe ser una cadena de texto');
    } else {
      validationResult.observaciones = data.observaciones?.trim() || null;
    }
  }

  // Validar estado (opcional)
  if (data.estado !== undefined) {
    if (typeof data.estado !== 'string') {
      errors.push('estado debe ser una cadena de texto');
    } else {
      validationResult.estado = data.estado;
    }
  }

  if (errors.length > 0) {
    throw new Error(`Errores de validación: ${errors.join(', ')}`);
  }

  return validationResult;
}

/*
 * Validar parámetros de paginación
 */
export function validatePaginationParams(limit?: any, offset?: any): { limit?: number; offset?: number } {
  const result: { limit?: number; offset?: number } = {};

  if (limit !== undefined) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      result.limit = parsedLimit;
    }
  }

  if (offset !== undefined) {
    const parsedOffset = parseInt(offset, 10);
    if (!isNaN(parsedOffset) && parsedOffset >= 0) {
      result.offset = parsedOffset;
    }
  }

  return result;
}
