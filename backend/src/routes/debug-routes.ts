import { Router } from 'express';
import { checkJwt } from '../config/auth0-simple.config';
import { hybridAuthMiddleware } from '../middleware/hybrid-auth-final.middleware';

const router = Router();

/**
 * @route GET /api/debug/user-check
 * @desc Debug para verificar middleware híbrido paso a paso
 */
router.get('/user-check', 
    (req, res, next) => {
        console.log('🚀 PASO 1: Iniciando debug user-check');
        next();
    },
    checkJwt,
    (req, res, next) => {
        console.log('🔐 PASO 2: checkJwt pasado - Usuario Auth0:', (req as any).user?.sub);
        next();
    },
    hybridAuthMiddleware,
    (req, res, next) => {
        console.log('🎯 PASO 3: hybridAuthMiddleware pasado - Usuario BD encontrado');
        console.log('👤 Usuario completo:', {
            auth0_sub: (req as any).user?.sub,
            email: (req as any).user?.email,
            role: (req as any).user?.role,
            permissions: (req as any).user?.permissions?.length || 0
        });
        next();
    },
    (req, res) => {
        res.json({
            success: true,
            message: 'Middleware híbrido funciona correctamente',
            data: {
                auth0_user: (req as any).user?.sub,
                bd_user: (req as any).user?.email,
                role: (req as any).user?.role,
                permissions_count: (req as any).user?.permissions?.length || 0,
                timestamp: new Date().toISOString()
            }
        });
    }
);

/**
 * @route GET /api/debug/simple
 * @desc Debug más simple - solo Auth0
 */
router.get('/simple', 
    checkJwt,
    (req, res) => {
        console.log('✅ Debug simple - Usuario Auth0:', (req as any).user?.sub);
        res.json({
            success: true,
            message: 'Auth0 funciona correctamente',
            user: (req as any).user?.sub,
            timestamp: new Date().toISOString()
        });
    }
);

export default router;
