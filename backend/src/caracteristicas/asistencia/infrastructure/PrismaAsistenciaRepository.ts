import { PrismaClient } from '@prisma/client';
import { Asistencia } from '../domain/Asistencia';
import { AsistenciaRepository } from '../domain/AsistenciaRepository';

export class PrismaAsistenciaRepository implements AsistenciaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existeEntradaHoy(trabajadorId: number, fechaISO: string): Promise<boolean> {
    const fecha = new Date(fechaISO);
    const count = await this.prisma.mot_asistencia.count({
      where: {
        trabajador_id: trabajadorId,
        fecha_at: fecha,
      },
    });
    return count > 0;
  }

  async registrarEntrada(data: Asistencia): Promise<Asistencia> {
    const createData = {
      trabajador_id: data.trabajadorId,
      fecha_at: new Date(data.fecha),
      hora_entrada_at: data.horaEntrada
        ? new Date(`${data.fecha}T${data.horaEntrada}`)
        : new Date(), // si no se pasa, usa la hora actual
      ubicacion_entrada: data.ubicacion ?? null,
      hora_salida_at: null,
      horas_trabajadas: null,
      observaciones_salida: null,
      estado: 'incompleta', // Estado inicial, cambiará a 'completa' cuando registre salida
      created_at: new Date(),
      created_by: 1, // ajusta según tu lógica de auditoría
      updated_at: null,
      updated_by: null,
      deleted_at: null,
    };
    
    console.log('[PrismaAsistenciaRepository] Datos a insertar =>', createData);
    
    const creado = await this.prisma.mot_asistencia.create({
      data: createData,
    });

    console.log('[PrismaAsistenciaRepository] Registro creado =>', creado);

    return {
      id: creado.asistencia_id,
      trabajadorId: creado.trabajador_id,
      fecha: creado.fecha_at.toISOString().slice(0, 10), // YYYY-MM-DD
      horaEntrada: creado.hora_entrada_at.toISOString().substring(11, 19), // HH:mm:ss
      ubicacion: creado.ubicacion_entrada ?? null,
      creadoEn: creado.created_at,
    };
  }
}
