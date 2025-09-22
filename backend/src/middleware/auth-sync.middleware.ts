import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware para sincronizar usuarios de Auth0 con la Base de Datos
 * Crea automáticamente usuarios admin en BD si no existen
 */
export const syncAuth0User = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Obtener información del usuario desde el token Auth0
        const auth0User = (req as any).auth;
        
        if (!auth0User) {
            return next(); // Si no hay auth, continuar (otros middlewares manejarán el error)
        }

        const { sub: auth0Id, email } = auth0User;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requerido en el token Auth0'
            });
        }

        // Verificar si el usuario ya existe en la BD
        let usuario = await prisma.mot_usuario.findFirst({
            where: {
                OR: [
                    { auth0_user_id: auth0Id },
                    { username: email }
                ]
            },
            include: {
                mom_rol: {
                    include: {
                        rel_mom_rol__mom_permiso: {
                            include: {
                                mom_permiso: true
                            }
                        }
                    }
                }
            }
        });

        // Si no existe, crear el usuario en la BD
        if (!usuario) {
            console.log(`🔄 Sincronizando usuario Auth0: ${email}`);
            
            // Determinar el rol basado en los permisos de Auth0
            const auth0Permissions = auth0User.permissions || [];
            let rolId = await determineRoleFromPermissions(auth0Permissions);
            
            // Si no se puede determinar el rol, usar un rol por defecto o fallar
            if (!rolId) {
                return res.status(403).json({
                    success: false,
                    message: 'No se puede determinar el rol para este usuario',
                    auth0Permissions
                });
            }

            // Crear el usuario en la BD
            usuario = await prisma.mot_usuario.create({
                data: {
                    auth0_user_id: auth0Id,
                    // email: email,
                    username: email.split('@')[0], // Usar parte del email como username
                    password_hash: '',             // Valor temporal o manejar según tu lógica
                    created_by: 0,                 // ID del usuario que crea (0 para sistema)
                    estado: "activo",
                    rol_id: rolId,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                include: {
                    mom_rol: {
                        include: {
                            rel_mom_rol__mom_permiso: {
                                include: {
                                    mom_permiso: true
                                }
                            }
                        }
                    }
                }
            });

            console.log(`✅ Usuario sincronizado: ${email} con rol ID: ${rolId}`);
        } else if (!usuario.auth0_user_id) {
            // Si existe pero no tiene auth0_user_id, actualizarlo
            usuario = await prisma.mot_usuario.update({
                where: { usuario_id: usuario.usuario_id },
                data: {
                    auth0_user_id: auth0Id,
                    updated_at: new Date()
                },
                include: {
                    mom_rol: {
                        include: {
                            rel_mom_rol__mom_permiso: {
                                include: {
                                    mom_permiso: true
                                }
                            }
                        }
                    }
                }
            });
        }

        // Agregar información del usuario de BD al request
        (req as any).dbUser = usuario;
        (req as any).userPermissions = usuario.mom_rol.rel_mom_rol__mom_permiso.map(
            rp => rp.mom_permiso.codigo
        );

        next();

    } catch (error) {
        console.error('❌ Error en sincronización Auth0:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor durante la sincronización',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

/**
 * Determina el rol basado en los permisos de Auth0
 */
async function determineRoleFromPermissions(permissions: string[]): Promise<number | null> {
    try {
        // Mapeo de permisos a roles (basado en tu matriz)
        const roleMapping = {
            'admin:access': 1, // ADMIN_AGROMANO
            'trabajadores:delete': 3, // GERENTE_RRHH (tiene permisos de eliminación)
            'nomina:process': 3, // GERENTE_RRHH
            'tareas:assign': 2, // SUPERVISOR_CAMPO
            'productividad:register:others': 2, // SUPERVISOR_CAMPO
            'trabajadores:export': 4 // SUPERVISOR_RRHH (tiene menos permisos que GERENTE)
        };

        // Buscar el rol con mayor jerarquía basado en permisos
        for (const [permission, rolId] of Object.entries(roleMapping)) {
            if (permissions.includes(permission)) {
                return rolId;
            }
        }

        // Si tiene muchos permisos, probablemente es admin
        if (permissions.length > 20) {
            return 1; // ADMIN_AGROMANO
        }

        // Si no se puede determinar, retornar null
        return null;

    } catch (error) {
        console.error('Error determinando rol:', error);
        return null;
    }
}

export default syncAuth0User;