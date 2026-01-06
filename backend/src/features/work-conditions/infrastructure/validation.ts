/*
 * Validación: Condiciones de Trabajo
 * Funciones de validación para los datos de entrada
 */

export interface CreateWorkConditionValidation {
  fecha: string;
  condicionGeneral: string;
  nivelDificultad: string;
  observaciones?: string;
}

export interface UpdateWorkConditionValidation {
  condicionGeneral?: string;
  nivelDificultad?: string;
  observaciones?: string;
}

/*
 * Validar datos para crear condición
 */
export function validateCreateWorkCondition(data: any): CreateWorkConditionValidation {
  const errors: string[] = [];

  // Validar fecha
  if (!data.fecha) {
    errors.push('fecha es requerida');
  } else if (typeof data.fecha !== 'string') {
    errors.push('fecha debe ser una cadena de texto');
  } else if (!isValidDateFormat(data.fecha)) {
    errors.push('fecha debe estar en formato YYYY-MM-DD');
  }

  // Validar condición general
  if (!data.condicionGeneral) {
    errors.push('condicionGeneral es requerida');
  } else if (!['despejado', 'lluvioso', 'muy_caluroso', 'nublado'].includes(data.condicionGeneral)) {
    errors.push('condicionGeneral debe ser: despejado, lluvioso, muy_caluroso o nublado');
  }

  // Validar nivel de dificultad
  if (!data.nivelDificultad) {
    errors.push('nivelDificultad es requerida');
  } else if (!['normal', 'dificil', 'muy_dificil'].includes(data.nivelDificultad)) {
    errors.push('nivelDificultad debe ser: normal, dificil o muy_dificil');
  }

  // Validar observación (opcional)
  if (data.observaciones && typeof data.observaciones !== 'string') {
    errors.push('observaciones debe ser una cadena de texto');
  }

  if (errors.length > 0) {
    throw new Error(`Errores de validación: ${errors.join(', ')}`);
  }

  return {
    fecha: data.fecha,
    condicionGeneral: data.condicionGeneral,
    nivelDificultad: data.nivelDificultad,
    observaciones: data.observaciones || undefined
  };
}

/*
 * Validar datos para actualizar condición
 */
export function validateUpdateWorkCondition(data: any): UpdateWorkConditionValidation {
  const errors: string[] = [];
  const validationResult: UpdateWorkConditionValidation = {};

  // Validar condición general (opcional)
  if (data.condicionGeneral !== undefined) {
    if (!['desplejado', 'lluvioso', 'muy_caluroso', 'nublado'].includes(data.condicionGeneral)) {
      errors.push('condicionGeneral debe ser: despejado, lluvioso, muy_caluroso o nublado');
    } else {
      validationResult.condicionGeneral = data.condicionGeneral;
    }
  }

  // Validar nivel de dificultad (opcional)
  if (data.nivelDificultad !== undefined) {
    if (!['normal', 'dificil', 'muy_dificil'].includes(data.nivelDificultad)) {
      errors.push('nivelDificultad debe ser: normal, dificil o muy_dificil');
    } else {
      validationResult.nivelDificultad = data.nivelDificultad;
    }
  }

  // Validar observación (opcional)
  if (data.observaciones !== undefined && typeof data.observaciones !== 'string') {
    errors.push('observaciones debe ser una cadena de texto');
  } else if (data.observaciones !== undefined) {
    validationResult.observaciones = data.observaciones;
  }

  if (errors.length > 0) {
    throw new Error(`Errores de validación: ${errors.join(', ')}`);
  }

  return validationResult;
}

/*
 * Validar formato de fecha YYYY-MM-DD
 */
function isValidDateFormat(fecha: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) {
    return false;
  }

  const [year, month, day] = fecha.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/*
 * Validar parámetros de paginación
 */
export function validatePaginationParams(limit?: any, offset?: any): { limit?: number; offset?: number } {
  const result: { limit?: number; offset?: number } = {};

  if (limit !== undefined) {
    let parsedLimit: any;
    if (Array.isArray(limit)) {
      parsedLimit = parseInt(limit[0], 10);
    } else {
      parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    }
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      throw new Error('limit debe ser un número mayor a 0');
    }
    result.limit = parsedLimit;
  }

  if (offset !== undefined) {
    let parsedOffset: any;
    if (Array.isArray(offset)) {
      parsedOffset = parseInt(offset[0], 10);
    } else {
      parsedOffset = typeof offset === 'string' ? parseInt(offset, 10) : offset;
    }
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      throw new Error('offset debe ser un número mayor o igual a 0');
    }
    result.offset = parsedOffset;
  }

  return result;
}
