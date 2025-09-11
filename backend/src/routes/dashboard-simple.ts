import { Router } from 'express';
import { checkJwt } from '../config/auth0-simple.config';

const router = Router();

/**
 * @route GET /api/dashboard-simple/test
 * @desc Test simple sin middleware complejo y sin base de datos
 * @access Solo requiere token Auth0
 */
router.get('/test', 
    checkJwt,
    async (req, res) => {
        try {
            console.log('🧪 Dashboard simple - usuario autenticado:', (req.user as any)?.sub);
            console.log('🟢 Sin conexión a BD - usando datos mock para producción');
            
            res.json({
                success: true,
                message: 'Dashboard simple funcionando',
                data: {
                    estadisticas: {
                        granjas: { valor: 8, cambio: '+2 desde ayer', tendencia: 'positiva' },
                        trabajadores: { valor: 124, cambio: '+8 desde ayer', tendencia: 'positiva' },
                        cultivos: { valor: 890, cambio: '+156 desde ayer', tendencia: 'positiva' },
                        alertas: { valor: 12, cambio: '-5 desde ayer', tendencia: 'negativa' }
                    },
                    actividadReciente: [
                        {
                            id: 'act-1',
                            tipo: 'sistema',
                            mensaje: 'Sistema funcionando correctamente',
                            timestamp: new Date().toISOString(),
                            prioridad: 'alta'
                        }
                    ],
                    condicionesClimaticas: {
                        temperatura: '24°C',
                        humedad: '65%',
                        lluvia: '5mm',
                        viento: '12km/h',
                        ubicacion: 'Estación Test',
                        ultimaActualizacion: new Date().toISOString()
                    },
                    permisos: {
                        nivel: 'basico',
                        total: 1
                    },
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            console.error('❌ Error en dashboard simple:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    }
);

export default router;
