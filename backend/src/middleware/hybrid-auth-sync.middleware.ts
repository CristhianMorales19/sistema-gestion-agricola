import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware híbrido: usa Auth0 como fuente principal y la BD como respaldo.
 * Sincroniza usuarios y roles entre Auth0 y la base de datos.
 * Si la API/Auth0 falla, consulta la BD local.
 */
export const hybridAuthSyncMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Intentar autenticación por Auth0/API
        const auth0User = (req as any).auth || (req as any).user;
        let usuario = null;
        let email = null;
        let auth0Id = null;
        let permissions: string[] = [];

        if (auth0User) {
            auth0Id = auth0User.sub;
            email = auth0User.email || auth0User.sub;
            permissions = auth0User.permissions || [];
        }

        // 2. Buscar usuario en BD por Auth0 ID o email
        if (auth0Id || email) {
            usuario = await prisma.mom_usuario.findFirst({
                where: {
                    OR: [
                        auth0Id ? { auth0_user_id: auth0Id } : {},
                        email ? { email: email } : {}
                    ]
                },
                include: {
                    mom_rol: {
                        include: {
                            mom_rol_permisos: {
                                include: {
                                    mom_permiso: true
                                }
                            }
                        }
                    }
                }
            });
        }

        // 3. Si usuario no existe y hay datos de Auth0, crearlo en BD
        if (!usuario && auth0User && email) {
            let rolId = await determineRoleFromPermissions(permissions);
            if (!rolId) {
                return res.status(403).json({
                    success: false,
                    message: 'No se puede determinar el rol para este usuario',
                    permissions
                });
            }
            usuario = await prisma.mom_usuario.create({
                data: {
                    auth0_user_id: auth0Id,
                    email: email,
                    username: email.split('@')[0],
                    activo: true,
                    rol_id: rolId,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                include: {
                    mom_rol: {
                        include: {
                            mom_rol_permisos: {
                                include: {
                                    mom_permiso: true
                                }
                            }
                        }
                    }
                }
            });
        } else if (usuario && auth0Id && !usuario.auth0_user_id) {
            // Si existe pero no tiene auth0_user_id, actualizarlo
            usuario = await prisma.mom_usuario.update({
                where: { usuario_id: usuario.usuario_id },
                data: {
                    auth0_user_id: auth0Id,
                    updated_at: new Date()
                },
                include: {
                    mom_rol: {
                        include: {
                            mom_rol_permisos: {
                                include: {
                                    mom_permiso: true
                                }
                            }
                        }
                    }
                }
            });
        }

        // 4. Fallback: Si no hay token Auth0, buscar usuario en BD por email/username
        if (!auth0User && req.body && (req.body.email || req.body.username)) {
            usuario = await prisma.mom_usuario.findFirst({
                where: {
                    OR: [
                        req.body.email ? { email: req.body.email } : {},
                        req.body.username ? { username: req.body.username } : {}
                    ]
                },
                include: {
                    mom_rol: {
                        include: {
                            mom_rol_permisos: {
                                include: {
                                    mom_permiso: true
                                }
                            }
                        }
                    }
                }
            });
        }

        // 5. Si usuario existe y está activo, agregar info al request
        if (usuario && usuario.activo) {
            (req as any).dbUser = usuario;
            (req as any).userPermissions = usuario.mom_rol.mom_rol_permisos.map(
                rp => rp.mom_permiso.codigo
            );
            return next();
        }

        // 6. Si no se pudo autenticar, rechazar
        return res.status(401).json({
            success: false,
            message: 'No se pudo autenticar el usuario por Auth0 ni por BD',
        });
    } catch (error) {
        console.error('❌ Error en middleware híbrido:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor en autenticación híbrida',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

/**
 * Determina el rol basado en los permisos de Auth0
 */
async function determineRoleFromPermissions(permissions: string[]): Promise<number | null> {
    try {
        const roleMapping = {
            'admin:access': 1,
            'trabajadores:delete': 3,
            'nomina:process': 3,
            'tareas:assign': 2,
            'productividad:register:others': 2,
            'trabajadores:export': 4
        };
        for (const [permission, rolId] of Object.entries(roleMapping)) {
            if (permissions.includes(permission)) {
                return rolId;
            }
        }
        if (permissions.length > 20) {
            return 1;
        }
        return null;
    } catch (error) {
        console.error('Error determinando rol:', error);
        return null;
    }
}

export default hybridAuthSyncMiddleware;
