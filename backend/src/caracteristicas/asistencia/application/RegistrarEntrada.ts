import { Asistencia } from '../domain/Asistencia';
import { AsistenciaRepository } from '../domain/AsistenciaRepository';

export interface RegistrarEntradaInput {
  trabajadorId: number;
  fecha?: string; // YYYY-MM-DD
  horaEntrada?: string; // HH:mm:ss
  ubicacion?: string | null;
}

export class RegistrarEntrada {
  constructor(private readonly repo: AsistenciaRepository) {}

  async execute(input: RegistrarEntradaInput): Promise<Asistencia> {
    if (!input.trabajadorId || input.trabajadorId <= 0) {
      throw new Error('trabajadorId inválido');
    }

    const ahora = new Date();
    const fecha = input.fecha ?? ahora.toISOString().substring(0, 10);

    const existe = await this.repo.existeEntradaHoy(input.trabajadorId, fecha);
    if (existe) {
      throw new Error('Ya existe una entrada registrada hoy para este trabajador');
    }

    const asistencia = Asistencia.crear({
      trabajadorId: input.trabajadorId,
      fecha,
      horaEntrada: input.horaEntrada,
      ubicacion: input.ubicacion ?? null,
    });

    return this.repo.registrarEntrada(asistencia);
  }
}
