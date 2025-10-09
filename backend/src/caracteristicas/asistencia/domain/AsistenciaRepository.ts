import { Asistencia } from './Asistencia';

// Interfaz de repositorio desacoplada de la implementación concreta (Prisma, etc.)
export interface AsistenciaRepository {
  registrarEntrada(data: Asistencia): Promise<Asistencia>;
  existeEntradaHoy(trabajadorId: number, fechaISO: string): Promise<boolean>;
}
