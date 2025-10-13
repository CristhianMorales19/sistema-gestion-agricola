import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkJwt } from '../../../../shared/infrastructure/config/auth0-simple.config';
import { agroManoAuthMiddleware as hybridAuthMiddleware } from '../../../authentication/infrastructure/middleware/agromano-auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', checkJwt, hybridAuthMiddleware, async (req, res) => {
  try {
    const productividad = await prisma.mot_registro_productividad.findMany({
      include: {
        mom_trabajador: {
          select: {
            trabajador_id: true,
            nombre_completo: true,
            documento_identidad: true,
          },
        },
        mom_tarea: {
          select: {
            tarea_id: true,
            nombre: true,
            descripcion: true,
            unidad_medicion: true,
            rendimiento_estandar: true,
          },
        },
      },
    });

    const response = productividad.map(p => ({
      id: p.productividad_id,
      worker: {
        id: p.mom_trabajador.trabajador_id,
        name: p.mom_trabajador.nombre_completo,
        identification: p.mom_trabajador.documento_identidad,
      },
      task: {
        id: p.mom_tarea.tarea_id,
        name: p.mom_tarea.nombre,
        description: p.mom_tarea.descripcion,
        unit: p.mom_tarea.unidad_medicion,
        standardPerformance: p.mom_tarea.rendimiento_estandar,
      },
      producedQuantity: p.cantidad_producida,
      unit: p.unidad_medida,
      date: p.fecha_at,
      calculatedPerformance: p.rendimiento_calculado,
    }));

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener registros de productividad',
    });
  }
});

export default router;