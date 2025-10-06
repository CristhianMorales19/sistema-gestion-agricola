import { Router } from 'express';
import { checkJwt } from '../../infrastructure/config/auth0-simple.config';
import { flexibleAuth } from '../../infrastructure/config/flexible-auth.config';
import { agroManoAuthMiddleware as hybridAuthMiddleware } from '../../../features/authentication/infrastructure/middleware/agromano-auth.middleware';
import { 
    requirePermission, 
    requireAnyPermission 
} from '../../../features/authentication/infrastructure/middleware/agromano-rbac.middleware';

const router = Router();

/**
 * @route GET /api/dashboard/general  
 * @desc Obtener datos generales del dashboard principal (versión simplificada)
 * @access Solo requiere estar autenticado con Auth0
 */
/**
 * @swagger
 * /api/dashboard/general:
 *   get:
 *     summary: Obtener datos generales del dashboard principal
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Datos generales del dashboard
 */
router.get('/general', 
    // flexibleAuth accepts server-signed tokens (HS256) or Auth0 (RS256)
    flexibleAuth,
    hybridAuthMiddleware,
    requireAnyPermission(['dashboard:view:basic', 'dashboard:view:advanced']),
    async (req, res) => {
        try {
            console.log('📊 ===== DASHBOARD GENERAL REQUEST =====');
            console.log('⏰ Timestamp:', new Date().toISOString());
            console.log('🔍 Headers recibidos:', {
                authorization: req.headers.authorization ? '✅ Presente' : '❌ Ausente',
                'content-type': req.headers['content-type'],
                origin: req.headers.origin
            });
            
            console.log('👤 Usuario Auth0 después de checkJwt:', req.user?.auth0_id);
            console.log('📧 Email usuario:', req.user?.email);
            console.log('📊 Estado después de hybridAuthMiddleware:');
            console.log('   - dbUser:', req.user?.dbUser ? '✅ Encontrado' : '❌ No encontrado');
            console.log('   - permissions length:', (req.user?.permissions || req.user?.permisos || []).length);
            
            const userPermissions = req.user?.permissions || req.user?.permisos || [];
            console.log('🎭 Permisos completos del usuario:', userPermissions);
            const isAdvanced = userPermissions.includes('dashboard:view:advanced');
            
            // 📊 DATOS REALES DE LA BASE DE DATOS - Sin hardcodeo
            console.log('📊 Obteniendo datos REALES de la base de datos...');
            
            let generalStats;
            
            try {
                // Importar Prisma dinámicamente
                const { PrismaClient } = require('@prisma/client');
                const prisma = new PrismaClient();
                
                console.log('🔄 Intentando conectar con Prisma...');
                
                // Consultas reales a la BD con manejo de errores individual
                console.log('📊 Consultando trabajadores...');
                // En el modelo `mom_trabajador` el campo es `is_activo` (boolean), no `estado`.
                const totalTrabajadores = await prisma.mom_trabajador.count({
                    where: {
                        is_activo: true
                    }
                }).catch((err: Error) => {
                    console.log('⚠️ Error consultando trabajadores:', err.message);
                    return 0;
                });
                
                console.log('👥 Consultando usuarios...');
                const totalUsuarios = await prisma.mot_usuario.count({
                    where: {
                        OR: [
                            { estado: 'ACTIVO' },
                            { estado: 'activo' }
                        ]
                    }
                }).catch((err: Error) => {
                    console.log('⚠️ Error consultando usuarios:', err.message);
                    return 0;
                });
                
                console.log('👑 Consultando roles...');
                // is_activo es boolean en el modelo
                const totalRoles = await prisma.mom_rol.count({
                    where: {
                        is_activo: true
                    }
                }).catch((err: Error) => {
                    console.log('⚠️ Error consultando roles:', err.message);
                    return 0;
                });
                
                console.log('🔐 Consultando permisos...');
                const totalPermisos = await prisma.mom_permiso.count({
                    where: {
                        is_activo: 1
                    }
                }).catch((err: Error) => {
                    console.log('⚠️ Error consultando permisos:', err.message);
                    return 0;
                });
                
                console.log('✅ Datos reales obtenidos:');
                console.log(`   - Trabajadores activos: ${totalTrabajadores}`);
                console.log(`   - Usuarios activos: ${totalUsuarios}`);
                console.log(`   - Roles activos: ${totalRoles}`);
                console.log(`   - Permisos activos: ${totalPermisos}`);
                
                generalStats = {
                    totalTrabajadores: totalTrabajadores,
                    totalUsuarios: totalUsuarios, 
                    totalRoles: totalRoles,
                    totalPermisos: totalPermisos,
                    alertasPendientes: 0 // Por ahora 0 hasta que tengamos tabla de alertas
                };
                
                try {
                    await prisma.$disconnect();
                } catch (dErr) {
                    console.warn('⚠️ Error al desconectar Prisma:', dErr);
                }
                
            } catch (error) {
                console.error('❌ Error obteniendo datos de la BD:', error);
                console.error('🔄 Usando datos por defecto...');
                
                // Fallback a datos por defecto si hay error
                generalStats = {
                    totalTrabajadores: 0,
                    totalUsuarios: 0,
                    totalRoles: 0,
                    totalPermisos: 0,
                    alertasPendientes: 0
                };
            }

            // 📋 Actividades basadas en datos reales de la BD
            const recentActivities = [
                {
                    id: 'bd-1',
                    tipo: 'sistema',
                    mensaje: `Sistema conectado a BD MySQL - ${generalStats.totalTrabajadores} trabajadores registrados`,
                    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
                    prioridad: 'info'
                },
                {
                    id: 'bd-2',
                    tipo: 'auth',
                    mensaje: `Autenticación Auth0 activa - ${generalStats.totalUsuarios} usuarios en el sistema`,
                    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
                    prioridad: 'info'
                },
                {
                    id: 'bd-3',
                    tipo: 'seguridad',
                    mensaje: `Sistema RBAC configurado - ${generalStats.totalRoles} roles y ${generalStats.totalPermisos} permisos activos`,
                    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
                    prioridad: 'alta'
                },
                {
                    id: 'bd-4',
                    tipo: 'dashboard',
                    mensaje: isAdvanced ? 'Dashboard avanzado cargado - Acceso completo' : 'Dashboard básico cargado - Acceso limitado',
                    timestamp: new Date().toISOString(),
                    prioridad: 'media'
                }
            ];

            const condicionesActuales = {
                temperatura: '26°C',
                humedad: '68%',
                lluvia: '5mm',
                viento: '12km/h',
                ubicacion: 'Estación Meteorológica Central',
                ultimaActualizacion: new Date().toISOString()
            };

            const responseData = {
                success: true,
                message: 'Datos del dashboard obtenidos exitosamente',
                data: {
                    estadisticas: {
                        trabajadores: {
                            valor: generalStats.totalTrabajadores,
                            cambio: 'Datos reales de BD',
                            tendencia: 'real'
                        },
                        usuarios: {
                            valor: generalStats.totalUsuarios,
                            cambio: 'Usuarios activos en BD',
                            tendencia: 'real'
                        },
                        roles: {
                            valor: generalStats.totalRoles,
                            cambio: 'Roles configurados',
                            tendencia: 'real'
                        },
                        permisos: {
                            valor: generalStats.totalPermisos,
                            cambio: 'Permisos disponibles',
                            tendencia: 'real'
                        },
                        alertas: {
                            valor: generalStats.alertasPendientes,
                            cambio: 'Sin alertas',
                            tendencia: 'positiva'
                        }
                    },
                    actividadReciente: recentActivities,
                    condicionesClimaticas: condicionesActuales,
                    permisos: {
                        nivel: isAdvanced ? 'avanzado' : 'basico',
                        total: userPermissions.length
                    },
                    timestamp: new Date().toISOString()
                }
            };

            console.log('✅ Dashboard general - Respuesta preparada exitosamente');
            console.log('📊 Datos estadísticas:', generalStats);
            console.log('🎯 Nivel de permisos:', isAdvanced ? 'avanzado' : 'basico');
            console.log('🚀 Enviando respuesta al cliente...');

            res.json(responseData);

        } catch (error) {
            console.log('💥 ===== ERROR EN DASHBOARD GENERAL =====');
            console.error('❌ Error obteniendo datos del dashboard:', error);
            console.error('🔍 Stack trace:', error instanceof Error ? error.stack : 'No disponible');
            console.error('👤 Usuario en error:', req.user?.auth0_id);
            console.log('=======================================');
            // Si detectamos un error de Prisma P2022 (columna inexistente), devolver datos por defecto en vez de 500
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2022') {
                console.warn('Prisma P2022 detectado en dashboard.general, devolviendo datos por defecto');
                return res.json({
                    success: true,
                    message: 'Datos del dashboard (modo degradado)',
                    data: {
                        estadisticas: {
                            trabajadores: { valor: 0, cambio: 'modo degradado', tendencia: 'n/a' },
                            usuarios: { valor: 0, cambio: 'modo degradado', tendencia: 'n/a' },
                            roles: { valor: 0, cambio: 'modo degradado', tendencia: 'n/a' },
                            permisos: { valor: 0, cambio: 'modo degradado', tendencia: 'n/a' },
                            alertas: { valor: 0, cambio: 'modo degradado', tendencia: 'n/a' }
                        },
                        actividadReciente: [],
                        condicionesClimaticas: {},
                        permisos: { nivel: 'basico', total: 0 },
                        timestamp: new Date().toISOString()
                    }
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * @route GET /api/dashboard/stats/tiempo-real
 * @desc Obtener estadísticas en tiempo real
 * @access Requiere permiso: dashboard:view:basic
 */
/**
 * @swagger
 * /api/dashboard/stats/tiempo-real:
 *   get:
 *     summary: Obtener estadísticas en tiempo real del dashboard
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Estadísticas en tiempo real
 */
router.get('/stats/tiempo-real', 
    checkJwt,
    hybridAuthMiddleware,
    requirePermission('dashboard:view:basic'),
    async (req, res) => {
        try {
            // Datos que se actualizarían en tiempo real
            const estadisticasTiempoReal = {
                trabajadoresPresentes: 118,
                maquinariaActiva: 15,
                sistemasRiego: {
                    activos: 8,
                    programados: 3
                },
                alertasNuevas: 2,
                ultimaActualizacion: new Date().toISOString()
            };

            res.json({
                success: true,
                message: 'Estadísticas en tiempo real',
                data: estadisticasTiempoReal
            });

        } catch (error) {
            console.error('Error obteniendo stats en tiempo real:', error);
            res.status(500).json({
                success: false,
                message: 'Error obteniendo estadísticas en tiempo real'
            });
        }
    }
);

/**
 * @route GET /api/dashboard/clima
 * @desc Obtener condiciones climáticas actuales
 * @access Requiere permiso: dashboard:view:basic
 */
/**
 * @swagger
 * /api/dashboard/clima:
 *   get:
 *     summary: Obtener condiciones climáticas actuales
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Condiciones climáticas obtenidas
 */
router.get('/clima', 
    checkJwt,
    hybridAuthMiddleware,
    requirePermission('dashboard:view:basic'),
    async (req, res) => {
        try {
            // En producción, esto vendría de una API meteorológica real
            const datosClimaticos = {
                temperatura: Math.floor(Math.random() * (30 - 20) + 20) + '°C',
                humedad: Math.floor(Math.random() * (80 - 60) + 60) + '%',
                precipitacion: Math.floor(Math.random() * 10) + 'mm',
                velocidadViento: Math.floor(Math.random() * (20 - 5) + 5) + 'km/h',
                presion: '1013 hPa',
                visibilidad: '10 km',
                indiceUV: '7 Alto',
                estacion: 'Estación Meteorológica AgroMano',
                coordenadas: {
                    latitud: -12.046374,
                    longitud: -77.042793
                },
                pronostico: [
                    { dia: 'Hoy', temp_max: 28, temp_min: 18, condicion: 'Soleado' },
                    { dia: 'Mañana', temp_max: 26, temp_min: 16, condicion: 'Parcialmente nublado' },
                    { dia: 'Pasado', temp_max: 29, temp_min: 19, condicion: 'Soleado' }
                ],
                ultimaActualizacion: new Date().toISOString()
            };

            res.json({
                success: true,
                message: 'Condiciones climáticas obtenidas',
                data: datosClimaticos
            });

        } catch (error) {
            console.error('Error obteniendo datos climáticos:', error);
            res.status(500).json({
                success: false,
                message: 'Error obteniendo datos climáticos'
            });
        }
    }
);

export default router;
