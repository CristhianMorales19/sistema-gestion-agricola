/*
 * Errores del Dominio: Condiciones de Trabajo
 * Errores específicos del módulo de condiciones
 */

export class WorkConditionError extends Error {
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'WorkConditionError';
  }
}

export class WorkConditionNotFoundError extends WorkConditionError {
  constructor(workConditionId?: number) {
    super(
      workConditionId 
        ? `Condición de trabajo con ID ${workConditionId} no encontrada`
        : 'Condición de trabajo no encontrada'
    );
    this.name = 'WorkConditionNotFoundError';
  }
}

export class DuplicateWorkConditionError extends WorkConditionError {
  constructor(fecha: string) {
    super(`Ya existe un registro de condiciones para la fecha ${fecha}`);
    this.name = 'DuplicateWorkConditionError';
  }
}

export class InvalidWorkConditionError extends WorkConditionError {
  constructor(field: string, value: any) {
    super(`Valor inválido para ${field}: ${value}`);
    this.name = 'InvalidWorkConditionError';
  }
}

export class InvalidDateFormatError extends WorkConditionError {
  constructor(fecha: string) {
    super(`Formato de fecha inválido: ${fecha}. Use YYYY-MM-DD`);
    this.name = 'InvalidDateFormatError';
  }
}
