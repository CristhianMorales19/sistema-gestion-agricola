import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaAsistenciaRepository } from './PrismaAsistenciaRepository';
import { RegistrarEntrada } from '../application/RegistrarEntrada';

const router = Router();

// Dependencias simples instanciadas aquí; en un futuro podría extraerse a un contenedor.
const prisma = new PrismaClient();
const repo = new PrismaAsistenciaRepository(prisma);
const registrarEntrada = new RegistrarEntrada(repo);

// Health check simple para permitir que el frontend valide el endpoint y detectar puertos.
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Listado mínimo de trabajadores activos (no invade módulo de gestión de personal).
// Se expone dentro del contexto de asistencia para cumplir Demeter y Open/Closed.
router.get('/trabajadores-activos', async (_req: Request, res: Response) => {
  try {
    const trabajadores = await prisma.mom_trabajador.findMany({
      where: { is_activo: true },
      select: {
        trabajador_id: true,
        documento_identidad: true,
        nombre_completo: true
      },
      orderBy: { nombre_completo: 'asc' }
    });
    const data = trabajadores.map(t => ({
      value: t.trabajador_id,
      label: `${t.documento_identidad} - ${t.nombre_completo}`,
      trabajador_id: t.trabajador_id,
      documento_identidad: t.documento_identidad,
      nombre_completo: t.nombre_completo
    }));
    res.json({ success: true, total: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Error obteniendo trabajadores activos', detalle: err.message });
  }
});

// Entradas registradas hoy (para log en vivo). Solo lectura ligera.
router.get('/entradas-hoy', async (_req: Request, res: Response) => {
  try {
    const hoy = new Date();
    const inicio = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
    const fin = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
    const entradas = await prisma.mot_asistencia.findMany({
      where: { fecha_at: { gte: inicio, lt: fin } },
      orderBy: { created_at: 'desc' },
      take: 100,
      select: {
        asistencia_id: true,
        trabajador_id: true,
        fecha_at: true,
        hora_entrada_at: true,
        hora_salida_at: true,
        horas_trabajadas: true,
        ubicacion_entrada: true,
        created_at: true
      }
    });
    const trabajadorIds = Array.from(new Set(entradas.map(e => e.trabajador_id)));
    const trabajadores = await prisma.mom_trabajador.findMany({
      where: { trabajador_id: { in: trabajadorIds } },
      select: { trabajador_id: true, documento_identidad: true, nombre_completo: true }
    });
    const mapaTrab = new Map(trabajadores.map(t => [t.trabajador_id, t]));
    const data = entradas.map(e => {
      const t = mapaTrab.get(e.trabajador_id);
      return {
        id: e.asistencia_id,
        trabajadorId: e.trabajador_id,
        documento_identidad: t?.documento_identidad || '',
        nombre_completo: t?.nombre_completo || '',
        fecha: e.fecha_at.toISOString().slice(0,10),
        horaEntrada: e.hora_entrada_at?.toISOString().substring(11,19),
        horaSalida: e.hora_salida_at ? e.hora_salida_at.toISOString().substring(11,19) : null,
        horasTrabajadas: e.horas_trabajadas ? Number(e.horas_trabajadas) : null,
        ubicacion: e.ubicacion_entrada,
        creadoEn: e.created_at
      };
    });
    res.json({ success: true, total: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Error obteniendo entradas de hoy', detalle: err.message });
  }
});

// Asistencias del día sin salida registrada
router.get('/pendientes-salida', async (_req: Request, res: Response) => {
  try {
    const hoy = new Date();
    const inicio = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
    const fin = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
    const pendientes = await prisma.mot_asistencia.findMany({
      where: { fecha_at: { gte: inicio, lt: fin }, hora_salida_at: null },
      orderBy: { hora_entrada_at: 'asc' },
      select: { asistencia_id: true, trabajador_id: true, hora_entrada_at: true }
    });
    const trabajadorIds = Array.from(new Set(pendientes.map(p => p.trabajador_id)));
    const trabajadores = await prisma.mom_trabajador.findMany({
      where: { trabajador_id: { in: trabajadorIds } },
      select: { trabajador_id: true, documento_identidad: true, nombre_completo: true }
    });
    const mapa = new Map(trabajadores.map(t => [t.trabajador_id, t]));
    const data = pendientes.map(p => {
      const t = mapa.get(p.trabajador_id);
      return {
        asistenciaId: p.asistencia_id,
        trabajadorId: p.trabajador_id,
        documento_identidad: t?.documento_identidad || '',
        nombre_completo: t?.nombre_completo || '',
        horaEntrada: p.hora_entrada_at.toISOString().substring(11,19)
      };
    });
    res.json({ success: true, total: data.length, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Error obteniendo pendientes de salida', detalle: err.message });
  }
});

interface RegistrarSalidaBody { trabajadorId: number; horaSalida?: string; observacion?: string }
// Registrar salida para asistencia de hoy sin salida previa
router.post('/salida', async (req: Request, res: Response) => {
  try {
    const { trabajadorId, horaSalida, observacion }: RegistrarSalidaBody = req.body || {};
    if (!trabajadorId) return res.status(400).json({ error: 'trabajadorId es obligatorio' });

    const hoy = new Date();
    const fechaInicio = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
    const fechaFin = new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000);

    console.log('[ASISTENCIA][SALIDA] Request =>', { trabajadorId, horaSalida, observacion, fechaInicio, fechaFin });

    // Buscar asistencia del día (solo sin salida para reducir ambigüedad)
    const asistencia = await prisma.mot_asistencia.findFirst({
      where: { trabajador_id: trabajadorId, fecha_at: { gte: fechaInicio, lt: fechaFin }, hora_salida_at: null },
    });

    if (!asistencia) {
      console.warn('[ASISTENCIA][SALIDA] No encontrada asistencia abierta', { trabajadorId });
      return res.status(404).json({ error: 'No existe registro de entrada pendiente de salida para hoy' });
    }
    if (asistencia.hora_salida_at) {
      console.warn('[ASISTENCIA][SALIDA] Ya tenía hora_salida_at', asistencia.asistencia_id);
      return res.status(409).json({ error: 'Ya se registró la salida para este trabajador hoy' });
    }

    const baseFecha = asistencia.fecha_at.toISOString().slice(0, 10);
    const horaSalidaDate = horaSalida
      ? new Date(`${baseFecha}T${horaSalida.length === 5 ? horaSalida + ':00' : horaSalida}`)
      : new Date();

    if (horaSalidaDate < asistencia.hora_entrada_at) {
      console.warn('[ASISTENCIA][SALIDA] Hora salida anterior a entrada', { horaSalidaDate, horaEntrada: asistencia.hora_entrada_at });
      return res.status(400).json({ error: 'La hora de salida no puede ser anterior a la hora de entrada' });
    }

    const diffMs = horaSalidaDate.getTime() - asistencia.hora_entrada_at.getTime();
    const horasTrab = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // 2 decimales

    console.log('[ASISTENCIA][SALIDA] Calculado =>', { asistenciaId: asistencia.asistencia_id, horasTrab, diffMs, horaEntrada: asistencia.hora_entrada_at, horaSalidaDate });

    const actualizado = await prisma.mot_asistencia.update({
      where: { asistencia_id: asistencia.asistencia_id },
      data: {
        hora_salida_at: horaSalidaDate,
        horas_trabajadas: horasTrab,
        observaciones_salida: observacion || null,
        estado: 'completa', // Cambiar estado a completa cuando se registra salida
        updated_at: new Date(),
        updated_by: 1, // ajustar según lógica de auditoría
      },
    });

    console.log('[ASISTENCIA][SALIDA] Update result =>', {
      asistencia_id: actualizado.asistencia_id,
      hora_salida_at: actualizado.hora_salida_at,
      horas_trabajadas: actualizado.horas_trabajadas,
      observaciones_salida: actualizado.observaciones_salida,
    });

    res.json({
      id: actualizado.asistencia_id,
      trabajadorId: actualizado.trabajador_id,
      fecha: actualizado.fecha_at.toISOString().slice(0, 10),
      horaEntrada: actualizado.hora_entrada_at.toISOString().substring(11, 19),
      horaSalida: actualizado.hora_salida_at?.toISOString().substring(11, 19),
      horasTrabajadas: actualizado.horas_trabajadas,
      observacion: actualizado.observaciones_salida,
    });
  } catch (err: any) {
    console.error('[ASISTENCIA][SALIDA] Error =>', err);
    if (err.message?.includes('No existe')) return res.status(404).json({ error: err.message });
    res.status(500).json({ error: 'Error al registrar salida', detalle: err.message });
  }
});

router.post('/entrada', async (req: Request, res: Response) => {
  try {
    console.log('[ASISTENCIA][ENTRADA] Request body =>', req.body);
    const { trabajadorId, fecha, horaEntrada, ubicacion } = req.body ?? {};
    
    if (!trabajadorId) {
      console.warn('[ASISTENCIA][ENTRADA] Falta trabajadorId');
      return res.status(400).json({ error: 'trabajadorId es obligatorio' });
    }

    console.log('[ASISTENCIA][ENTRADA] Ejecutando registrarEntrada =>', {
      trabajadorId: Number(trabajadorId),
      fecha,
      horaEntrada,
      ubicacion,
    });

    const asistencia = await registrarEntrada.execute({
      trabajadorId: Number(trabajadorId),
      fecha,
      horaEntrada,
      ubicacion,
    });

    console.log('[ASISTENCIA][ENTRADA] Entrada registrada exitosamente =>', asistencia);

    res.status(201).json({
      id: asistencia.id,
      trabajadorId: asistencia.trabajadorId,
      fecha: asistencia.fecha,
      horaEntrada: asistencia.horaEntrada,
      ubicacion: asistencia.ubicacion,
      creadoEn: asistencia.creadoEn,
    });
  } catch (err: any) {
    console.error('[ASISTENCIA][ENTRADA] Error =>', err);
    console.error('[ASISTENCIA][ENTRADA] Stack =>', err.stack);
    if (err.message?.includes('Ya existe')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al registrar entrada', detalle: err.message, stack: err.stack });
  }
});

export const asistenciaRouter = router;
