import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

/**
 * @route GET /api/debug/prisma-connection
 * @desc Verificar conexión de Prisma en detalle
 * @access Público (solo para debug)
 */
router.get('/prisma-connection', async (req, res) => {
    try {
        console.log('🔍 ===== DEBUG PRISMA CONNECTION =====');
        console.log('⏰ Timestamp:', new Date().toISOString());
        
        // Verificar variables de entorno
        console.log('🔍 Variables de entorno:');
        console.log('DATABASE_URL:', process.env.DATABASE_URL || 'UNDEFINED');
        console.log('DB_HOST:', process.env.DB_HOST || 'UNDEFINED');
        console.log('DB_PORT:', process.env.DB_PORT || 'UNDEFINED');
        console.log('DB_USER:', process.env.DB_USER || 'UNDEFINED');
        console.log('DB_NAME:', process.env.DB_NAME || 'UNDEFINED');
        
        // Crear cliente Prisma nuevo
        const prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
        
        console.log('🔄 Intentando conectar con Prisma...');
        
        // Test de conexión simple
        await prisma.$connect();
        console.log('✅ Prisma conectado exitosamente');
        
        // Test básico de consulta
        const userCount = await prisma.mot_usuario.count();
        console.log(`📊 Total usuarios en BD: ${userCount}`);
        
        // Test de usuario específico
        const testUser = await prisma.mot_usuario.findFirst({
            where: {
                username: {
                    contains: 'auth0'
                }
            }
        });
        console.log('👤 Usuario Auth0:', testUser ? 'Encontrado' : 'No encontrado');
        
        // Desconectar
        await prisma.$disconnect();
        console.log('🔌 Prisma desconectado');
        
        res.json({
            success: true,
            message: 'Conexión Prisma exitosa',
            data: {
                userCount,
                auth0User: Boolean(testUser),
                envVars: {
                    DATABASE_URL: Boolean(process.env.DATABASE_URL),
                    DB_HOST: process.env.DB_HOST || 'UNDEFINED',
                    DB_PORT: process.env.DB_PORT || 'UNDEFINED',
                    DB_USER: process.env.DB_USER || 'UNDEFINED',
                    DB_NAME: process.env.DB_NAME || 'UNDEFINED'
                }
            }
        });
        
    } catch (error) {
        console.error('❌ Error en debug Prisma:', error);
        
        res.status(500).json({
            success: false,
            message: 'Error en conexión Prisma',
            error: {
                message: (error as Error).message,
                stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
                envVars: {
                    DATABASE_URL: Boolean(process.env.DATABASE_URL),
                    DB_HOST: process.env.DB_HOST || 'UNDEFINED',
                    DB_PORT: process.env.DB_PORT || 'UNDEFINED',
                    DB_USER: process.env.DB_USER || 'UNDEFINED',
                    DB_NAME: process.env.DB_NAME || 'UNDEFINED'
                }
            }
        });
    }
});

/**
 * @route GET /api/debug/auth0-user-search
 * @desc Buscar usuario Auth0 en la BD de diferentes formas
 * @access Público (solo para debug)
 */
router.get('/auth0-user-search', async (req, res) => {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 ===== DEBUG AUTH0 USER SEARCH =====');
        
        const auth0Id = 'auth0|68b8a6d1bf1669b349577af6';
        
        // Búsqueda 1: Por username exacto
        const userByUsername = await prisma.mot_usuario.findFirst({
            where: {
                username: auth0Id
            }
        });
        
        // Búsqueda 2: Por username que contenga auth0
        const userByPartial = await prisma.mot_usuario.findFirst({
            where: {
                username: {
                    contains: 'auth0'
                }
            }
        });
        
        // Búsqueda 3: Todos los usuarios activos
        const allActiveUsers = await prisma.mot_usuario.findMany({
            where: {
                estado: 'ACTIVO'
            },
            select: {
                usuario_id: true,
                username: true,
                estado: true,
                rol_id: true
            }
        });
        
        res.json({
            success: true,
            searches: {
                byExactUsername: Boolean(userByUsername),
                byPartialUsername: Boolean(userByPartial),
                allActiveUsersCount: allActiveUsers.length
            },
            data: {
                userByUsername: userByUsername ? {
                    id: userByUsername.usuario_id,
                    username: userByUsername.username,
                    estado: userByUsername.estado,
                    rol_id: userByUsername.rol_id
                } : null,
                userByPartial: userByPartial ? {
                    id: userByPartial.usuario_id,
                    username: userByPartial.username,
                    estado: userByPartial.estado,
                    rol_id: userByPartial.rol_id
                } : null,
                allActiveUsers
            }
        });
        
    } catch (error) {
        console.error('❌ Error buscando usuario Auth0:', error);
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    } finally {
        await prisma.$disconnect();
    }
});

export default router;
