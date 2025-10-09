// Entidad de dominio Asistencia siguiendo principios de modelo anémico mínimo.
// No depende de infraestructura. Puede evolucionar hacia un objeto rico si se agregan invariantes.

export interface AsistenciaProps {
  id?: number;
  trabajadorId: number;
  fecha: string; // formato ISO YYYY-MM-DD
  horaEntrada?: string; // HH:mm:ss (se autogenera si no se provee)
  ubicacion?: string | null;
  creadoEn?: Date;
}

export class Asistencia {
  public readonly id?: number;
  public readonly trabajadorId: number;
  public readonly fecha: string;
  public readonly horaEntrada: string; // siempre definido tras construcción
  public readonly ubicacion?: string | null;
  public readonly creadoEn: Date;

  private constructor(props: Required<Omit<AsistenciaProps, 'id'>> & { id?: number }) {
    this.id = props.id;
    this.trabajadorId = props.trabajadorId;
    this.fecha = props.fecha;
    this.horaEntrada = props.horaEntrada;
    this.ubicacion = props.ubicacion;
    this.creadoEn = props.creadoEn;
  }

  static crear(props: AsistenciaProps): Asistencia {
    const ahora = new Date();
    const fecha = props.fecha ?? ahora.toISOString().substring(0, 10);
    const hora = props.horaEntrada ?? ahora.toISOString().substring(11, 19); // HH:mm:ss
    return new Asistencia({
      id: props.id,
      trabajadorId: props.trabajadorId,
      fecha,
      horaEntrada: hora,
      ubicacion: props.ubicacion ?? null,
      creadoEn: props.creadoEn ?? ahora,
    });
  }
}
