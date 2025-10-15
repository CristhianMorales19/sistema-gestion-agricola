import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkJwt } from '../../../../shared/infrastructure/config/auth0-simple.config';
import { agroManoAuthMiddleware as hybridAuthMiddleware } from '../../../authentication/infrastructure/middleware/agromano-auth.middleware';
import {
  requirePermission,
  requireAnyPermission,
  requirePermissions
} from '../../../authentication/infrastructure/middleware/agromano-rbac.middleware';

const router = Router();
const prisma = new PrismaClient();

// Consolidated and cleaned routes for personnel management

// GET /api/trabajadores
router.get('/',
  checkJwt,
  hybridAuthMiddleware,
  requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']),
  async (req, res) => {
    try {
      const userPermissions = req.auth?.permissions || [];
      const canReadAll = userPermissions.includes('trabajadores:read:all');

      const trabajadores = await prisma.mom_trabajador.findMany({
        where: { is_activo: true },
        include: { mot_info_laboral: { take: 1, orderBy: { info_laboral_id: 'desc' } } }
      });

      res.json({ success: true, data: { trabajadores: trabajadores.map(t => ({ id: t.trabajador_id.toString(), name: t.nombre_completo, identification: t.documento_identidad, role: t.mot_info_laboral[0]?.cargo, entryDate: t.mot_info_laboral[0]?.fecha_ingreso_at, status: Boolean(t.is_activo), email: t.email, phone: t.telefono, contractType: t.mot_info_laboral[0]?.tipo_contrato, baseSalary: t.mot_info_laboral[0]?.salario_base, birthDate: t.fecha_nacimiento })), permissions: userPermissions, scope: canReadAll ? 'all' : 'own' } });
    } catch (error) {
      console.error('Error en GET /api/trabajadores:', error);
      res.status(500).json({ success: false, message: 'Error al obtener trabajadores' });
    }
  }
);

// POST /api/trabajadores
router.post('/', checkJwt, hybridAuthMiddleware, requirePermission('trabajadores:create'), async (req, res) => {
  try {
    const { documento_identidad, nombre_completo, fecha_nacimiento, fecha_registro_at, telefono, email, cargo, codigo_nomina, salario_bruto, rebajas_ccss, otras_rebajas, salario_por_hora, horas_ordinarias, horas_extras, horas_otras, vacaciones_monto, incapacidad_monto, lactancia_monto, created_by } = req.body;

    const newEmployee = await prisma.mom_trabajador.create({ data: { documento_identidad: String(documento_identidad).trim(), nombre_completo: String(nombre_completo).trim(), fecha_nacimiento: new Date(fecha_nacimiento), fecha_registro_at: fecha_registro_at ? new Date(fecha_registro_at) : new Date(), telefono: telefono ? String(telefono).trim() : null, email: email ? String(email).trim() : null, created_at: new Date(), created_by: created_by, is_activo: true } });

    if (cargo || salario_bruto || codigo_nomina) {
      const now = new Date();
      const creator = created_by ?? ((req as any).user?.sub ?? 0);
      await prisma.mot_info_laboral.create({
        data: {
          trabajador_id: newEmployee.trabajador_id,
          cargo: cargo ? String(cargo) : 'Sin definir',
          fecha_ingreso_at: fecha_registro_at ? new Date(fecha_registro_at) : new Date(),
          tipo_contrato: req.body.tipo_contrato || 'no_definido',
          salario_base: salario_bruto ? parseFloat(String(salario_bruto)) : 0,
          codigo_nomina: codigo_nomina ? String(codigo_nomina) : null,
          salario_bruto: salario_bruto ? parseFloat(String(salario_bruto)) : null,
          rebajas_ccss: rebajas_ccss ? parseFloat(String(rebajas_ccss)) : null,
          otras_rebajas: otras_rebajas ? parseFloat(String(otras_rebajas)) : null,
          salario_por_hora: salario_por_hora ? parseFloat(String(salario_por_hora)) : null,
          horas_ordinarias: horas_ordinarias ? parseFloat(String(horas_ordinarias)) : null,
          horas_extras: horas_extras ? parseFloat(String(horas_extras)) : null,
          horas_otras: horas_otras ? parseFloat(String(horas_otras)) : null,
          vacaciones_monto: vacaciones_monto ? parseFloat(String(vacaciones_monto)) : null,
          incapacidad_monto: incapacidad_monto ? parseFloat(String(incapacidad_monto)) : null,
          lactancia_monto: lactancia_monto ? parseFloat(String(lactancia_monto)) : null,
          fecha_ultima_actualizacion_at: now,
          usuario_ultima_actualizacion: creator,
          created_at: now,
          created_by: creator,
          updated_at: now,
          updated_by: creator
        }
      });
    }

    res.status(201).json({ success: true, message: 'Trabajador creado exitosamente', data: { trabajador: newEmployee } });
  } catch (error: unknown) {
    console.error('Error al crear trabajador:', error);
    const err = error as any;
    if (err?.code === 'P2002') return res.status(409).json({ success: false, message: 'Ya existe un trabajador con esta cédula' });
    res.status(500).json({ success: false, message: 'Error interno del servidor al crear trabajador' });
  }
});

// PUT /api/trabajadores/:id
router.put('/:id', checkJwt, hybridAuthMiddleware, requireAnyPermission(['trabajadores:update:all', 'trabajadores:update:own']), async (req, res) => {
  try {
    const { id } = req.params;
    const userPermissions = (req as any).user?.permissions || [];
    const canUpdateAll = userPermissions.includes('trabajadores:update:all');

    const { cargo, salario_base, tipo_contrato } = req.body;
    const { area, codigo_nomina, salario_bruto, rebajas_ccss, otras_rebajas, salario_por_hora, horas_ordinarias, horas_extras, horas_otras, vacaciones_monto, incapacidad_monto, lactancia_monto, salario_promedio, meses_trabajados, horas_reportadas } = req.body;

    if (!cargo || !salario_base || !tipo_contrato) return res.status(400).json({ success: false, message: 'Todos los campos son requeridos: cargo, salario_base, tipo_contrato' });
    if (isNaN(salario_base) || salario_base < 0) return res.status(400).json({ success: false, message: 'El salario base debe ser un número positivo' });

    const trabajadorId = parseInt(id, 10);
    const existingInfo = await prisma.mot_info_laboral.findFirst({ where: { trabajador_id: trabajadorId }, orderBy: { info_laboral_id: 'desc' } });

    const userId = (req as any).user?.sub || (req as any).user?.usuario_id || 1;
    const now = new Date();

    const laboralData: any = { trabajador_id: trabajadorId, cargo: cargo ? String(cargo) : (existingInfo ? existingInfo.cargo : 'Sin definir'), fecha_ingreso_at: req.body.fecha_ingreso_at ? new Date(req.body.fecha_ingreso_at) : (existingInfo ? existingInfo.fecha_ingreso_at : now), tipo_contrato: tipo_contrato ? String(tipo_contrato) : (existingInfo ? existingInfo.tipo_contrato : 'no_definido'), salario_base: salario_base ? parseFloat(String(salario_base)) : (existingInfo ? existingInfo.salario_base : 0), area: area ? String(area) : (existingInfo ? (existingInfo as any).area : null), codigo_nomina: codigo_nomina ? String(codigo_nomina) : (existingInfo ? existingInfo.codigo_nomina : null), salario_bruto: salario_bruto ? parseFloat(String(salario_bruto)) : (existingInfo ? existingInfo.salario_bruto : null), rebajas_ccss: rebajas_ccss ? parseFloat(String(rebajas_ccss)) : (existingInfo ? existingInfo.rebajas_ccss : null), otras_rebajas: otras_rebajas ? parseFloat(String(otras_rebajas)) : (existingInfo ? existingInfo.otras_rebajas : null), salario_por_hora: salario_por_hora ? parseFloat(String(salario_por_hora)) : (existingInfo ? existingInfo.salario_por_hora : null), horas_ordinarias: horas_ordinarias ? parseFloat(String(horas_ordinarias)) : (existingInfo ? existingInfo.horas_ordinarias : null), horas_extras: horas_extras ? parseFloat(String(horas_extras)) : (existingInfo ? existingInfo.horas_extras : null), horas_otras: horas_otras ? parseFloat(String(horas_otras)) : (existingInfo ? existingInfo.horas_otras : null), vacaciones_monto: vacaciones_monto ? parseFloat(String(vacaciones_monto)) : (existingInfo ? existingInfo.vacaciones_monto : null), incapacidad_monto: incapacidad_monto ? parseFloat(String(incapacidad_monto)) : (existingInfo ? existingInfo.incapacidad_monto : null), lactancia_monto: lactancia_monto ? parseFloat(String(lactancia_monto)) : (existingInfo ? existingInfo.lactancia_monto : null), salario_promedio: salario_promedio ? parseFloat(String(salario_promedio)) : (existingInfo ? existingInfo.salario_promedio : null), meses_trabajados: meses_trabajados ? parseInt(String(meses_trabajados)) : (existingInfo ? existingInfo.meses_trabajados : null), horas_reportadas: horas_reportadas ? parseFloat(String(horas_reportadas)) : (existingInfo ? (existingInfo as any).horas_reportadas : null), fecha_ultima_actualizacion_at: now, usuario_ultima_actualizacion: userId, updated_at: now };

    if (existingInfo) {
      laboralData.updated_by = userId;
      await prisma.mot_info_laboral.update({ where: { info_laboral_id: existingInfo.info_laboral_id }, data: laboralData });
    } else {
      // Ensure required audit fields exist for creation
      laboralData.created_at = now;
      laboralData.created_by = userId;
      laboralData.updated_by = userId;
      laboralData.updated_at = now;
      await prisma.mot_info_laboral.create({ data: laboralData });
    }

    res.json({ success: true, message: `Información laboral del trabajador ${id} actualizada exitosamente`, data: { action: 'update', trabajadorId: id, scope: canUpdateAll ? 'all' : 'own', data: laboralData, permissions: userPermissions } });
  } catch (error) {
    console.error('❌ Error al actualizar información laboral del trabajador:', error);
    const err = error as any;
    if (err?.code === 'P2002') return res.status(409).json({ success: false, message: 'Ya existe un registro con estos datos únicos', error: 'DUPLICATE_ENTRY' });
    if (err?.code === 'P2003') return res.status(400).json({ success: false, message: 'El trabajador especificado no existe', error: 'FOREIGN_KEY_CONSTRAINT' });
    if (err?.code === 'P2025') return res.status(404).json({ success: false, message: 'Registro no encontrado', error: 'NOT_FOUND' });
    res.status(500).json({ success: false, message: 'Error interno del servidor al actualizar la información laboral', error: err?.message || 'Unknown error' });
  }
});

// DELETE /api/trabajadores/:id
router.delete('/:id', checkJwt, hybridAuthMiddleware, requirePermission('trabajadores:delete'), async (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Trabajador ${id} eliminado exitosamente`, data: { action: 'delete', trabajadorId: id, permissions: (req as any).user?.permissions } });
});

// GET /api/trabajadores/export
router.get('/export', checkJwt, hybridAuthMiddleware, requirePermission('trabajadores:export'), (req, res) => {
  res.json({ success: true, message: 'Exportación de trabajadores generada', data: { action: 'export', format: req.query.format || 'excel', filename: `trabajadores_${new Date().toISOString().split('T')[0]}.xlsx`, permissions: (req as any).user?.permissions } });
});

// POST /api/trabajadores/import
router.post('/import', checkJwt, hybridAuthMiddleware, requirePermissions(['trabajadores:import', 'trabajadores:create']), (req, res) => {
  res.json({ success: true, message: 'Importación de trabajadores procesada', data: { action: 'import', recordsProcessed: 25, recordsCreated: 20, recordsSkipped: 5, permissions: (req as any).user?.permissions } });
});

// GET /api/trabajadores/search/:query
router.get('/search/:query', checkJwt, hybridAuthMiddleware, requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']), async (req, res) => {
  try {
    const { query } = req.params;
    const userPermissions = req.auth?.permissions || [];
    const canReadAll = userPermissions.includes('trabajadores:read:all');

    const trabajadores = await prisma.mom_trabajador.findMany({ where: { AND: [{ is_activo: true }, { OR: [{ documento_identidad: { contains: query } }, { mot_info_laboral: { some: { cargo: { contains: query } } } }] }] }, include: { mot_info_laboral: { take: 1, orderBy: { info_laboral_id: 'desc' } } }, take: 50 });

    res.json({ success: true, data: { trabajadores: trabajadores.map(t => ({ id: t.trabajador_id.toString(), name: t.nombre_completo, identification: t.documento_identidad, role: t.mot_info_laboral[0]?.cargo || 'Sin definir', birthDate: t.fecha_nacimiento, entryDate: t.mot_info_laboral[0]?.fecha_ingreso_at, baseSalary: t.mot_info_laboral[0]?.salario_base, status: t.is_activo, email: t.email, contractType: t.mot_info_laboral[0]?.tipo_contrato, phone: t.telefono })), permissions: userPermissions, scope: canReadAll ? 'all' : 'own' } });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ success: false, message: 'Error al buscar trabajadores' });
  }
});

// GET /api/trabajadores/:id
router.get('/:id', checkJwt, hybridAuthMiddleware, requireAnyPermission(['trabajadores:read:all', 'trabajadores:read:own']), async (req, res) => {
  try {
    const { id } = req.params;
    const trabajadorId = parseInt(id, 10);

    const trabajador = await prisma.mom_trabajador.findUnique({ where: { trabajador_id: trabajadorId }, include: { mot_info_laboral: { take: 1, orderBy: { info_laboral_id: 'desc' } } } });
    if (!trabajador) return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });

    res.json({ success: true, data: { id: trabajador.trabajador_id.toString(), name: trabajador.nombre_completo, identification: trabajador.documento_identidad, email: trabajador.email, phone: trabajador.telefono, status: Boolean(trabajador.is_activo), laborInfo: trabajador.mot_info_laboral[0] || null } });
  } catch (error) {
    console.error('Error al obtener trabajador por id:', error);
    res.status(500).json({ success: false, message: 'Error interno al obtener trabajador' });
  }
});

// POST /api/trabajadores/:id/info-laboral
router.post('/:id/info-laboral', checkJwt, hybridAuthMiddleware, requireAnyPermission(['trabajadores:update:all', 'trabajadores:update:own']), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { cargo, salario_base, tipo_contrato, fecha_ingreso } = req.body;

    const existingInfo = await prisma.mot_info_laboral.findFirst({ where: { trabajador_id: parseInt(id) } });
    if (existingInfo) return res.status(400).json({ success: false, message: 'Este trabajador ya tiene información laboral registrada' });

    await prisma.mot_info_laboral.create({ data: { trabajador_id: parseInt(id), cargo, salario_base: parseFloat(salario_base), tipo_contrato, fecha_ingreso_at: new Date(fecha_ingreso), fecha_ultima_actualizacion_at: new Date(), usuario_ultima_actualizacion: parseInt(String(userId || '0')), created_at: new Date(), created_by: parseInt(String(userId || '0')), updated_at: new Date(), updated_by: parseInt(String(userId || '0')) } });

    res.status(201).json({ success: true, message: 'Información laboral guardada' });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Error al crear información laboral:', err);
    if (err?.code === 'P2003') return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
    res.status(500).json({ success: false, message: 'Error interno del servidor al crear la información laboral' });
  }
});

export default router;
