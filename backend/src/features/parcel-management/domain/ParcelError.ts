/*
 * Errores del Dominio: Parcelas
 * Errores específicos del módulo de gestión de parcelas
 */

export class ParcelError extends Error {
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ParcelError';
  }
}

export class ParcelNotFoundError extends ParcelError {
  constructor(parcelId?: number) {
    super(
      parcelId 
        ? `Parcela con ID ${parcelId} no encontrada`
        : 'Parcela no encontrada'
    );
    this.name = 'ParcelNotFoundError';
  }
}

export class DuplicateParcelError extends ParcelError {
  constructor(nombre: string) {
    super(`Ya existe una parcela con el nombre "${nombre}"`);
    this.name = 'DuplicateParcelError';
  }
}

export class InvalidParcelError extends ParcelError {
  constructor(field: string, value: any) {
    super(`Valor inválido para ${field}: ${value}`);
    this.name = 'InvalidParcelError';
  }
}

export class ParcelValidationError extends ParcelError {
  constructor(errors: string[]) {
    super(`Errores de validación: ${errors.join(', ')}`);
    this.name = 'ParcelValidationError';
  }
}
