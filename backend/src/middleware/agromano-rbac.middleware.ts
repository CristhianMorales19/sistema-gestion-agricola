import { Request, Response, NextFunction } from 'express';

// Permisos específicos de AgroMano basados en la matriz
export type AgroManoPermission = 
    // Personal/Trabajadores
    | 'trabajadores:create'
    | 'trabajadores:read:all'
    | 'trabajadores:read:own'
    | 'trabajadores:update:all'
    | 'trabajadores:update:own'
    | 'trabajadores:delete'
    | 'trabajadores:import'
    | 'trabajadores:export'
    
    // Asistencia
    | 'asistencia:register'
    | 'asistencia:read:all'
    | 'asistencia:read:own'
    | 'asistencia:update'
    | 'asistencia:approve'
    | 'asistencia:reports'
    | 'asistencia:dashboard'
    | 'permisos:create'
    | 'permisos:read'
    | 'permisos:approve'
    | 'horarios:manage'
    
    // Nómina
    | 'nomina:process'
    | 'nomina:read:all'
    | 'nomina:approve'
    | 'nomina:calculate'
    | 'nomina:reports'
    | 'nomina:export'
    | 'salarios:update'
    | 'bonificaciones:manage'
    | 'deducciones:manage'
    
    // Productividad
    | 'productividad:register'
    | 'productividad:read:all'
    | 'productividad:read:own'
    | 'productividad:register:others'
    | 'productividad:reports'
    | 'tareas:create'
    | 'tareas:read'
    | 'tareas:assign'
    | 'tareas:update'
    | 'tareas:complete'
    | 'metas:set'
    | 'metas:track'
    
    // Cultivos/Parcelas
    | 'parcelas:read'
    | 'parcelas:update'
    | 'cultivos:read'
    | 'cultivos:update'
    | 'cultivos:track'
    | 'cosechas:register'
    | 'cosechas:read'
    
    // Reportes y Dashboard
    | 'reportes:read'
    | 'reportes:read:advanced'
    | 'reportes:export'
    | 'dashboard:view:basic'
    | 'dashboard:view:advanced'
    | 'kpis:view'
    
    // Móvil
    | 'mobile:access'
    | 'mobile:sync'
    | 'gps:track'
    | 'photos:upload';

// Roles del sistema según la matriz
export const AGROMANO_ROLES = {
    ADMIN_AGROMANO: 'ADMIN_AGROMANO',
    SUPERVISOR_CAMPO: 'SUPERVISOR_CAMPO', 
    GERENTE_RRHH: 'GERENTE_RRHH',
    SUPERVISOR_RRHH: 'SUPERVISOR_RRHH',
    EMPLEADO_CAMPO: 'EMPLEADO_CAMPO',
    VISUAL_SOLO_LECTURA: 'VISUAL_SOLO_LECTURA'
} as const;

// Matriz de permisos por rol
export const ROLE_PERMISSIONS: Record<string, AgroManoPermission[]> = {
    [AGROMANO_ROLES.ADMIN_AGROMANO]: [
        // Admin tiene TODOS los permisos
        'trabajadores:create', 'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:delete',
        'trabajadores:import', 'trabajadores:export', 'asistencia:register', 'asistencia:read:all',
        'asistencia:update', 'asistencia:approve', 'asistencia:reports', 'asistencia:dashboard',
        'permisos:create', 'permisos:read', 'permisos:approve', 'horarios:manage',
        'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:calculate',
        'nomina:reports', 'nomina:export', 'salarios:update', 'bonificaciones:manage', 'deducciones:manage',
        'productividad:register', 'productividad:read:all', 'productividad:register:others', 'productividad:reports',
        'tareas:create', 'tareas:read', 'tareas:assign', 'tareas:update', 'tareas:complete',
        'metas:set', 'metas:track', 'parcelas:read', 'parcelas:update',
        'cultivos:read', 'cultivos:update', 'cultivos:track', 'cosechas:register', 'cosechas:read',
        'reportes:read', 'reportes:read:advanced', 'reportes:export',
        'dashboard:view:basic', 'dashboard:view:advanced', 'kpis:view',
        'mobile:access', 'mobile:sync', 'gps:track', 'photos:upload'
    ],

    [AGROMANO_ROLES.SUPERVISOR_CAMPO]: [
        // Personal
        'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:export',
        // Asistencia
        'asistencia:read:all', 'asistencia:update', 'asistencia:approve', 'asistencia:reports',
        'asistencia:dashboard', 'permisos:approve',
        // Productividad
        'productividad:read:all', 'productividad:register:others', 'productividad:reports',
        'tareas:create', 'tareas:assign', 'metas:set', 'metas:track',
        // Cultivos
        'parcelas:read', 'parcelas:update', 'cultivos:read', 'cultivos:update',
        'cultivos:track', 'cosechas:register', 'cosechas:read',
        // Reportes
        'reportes:read:advanced', 'reportes:export', 'dashboard:view:advanced', 'kpis:view'
    ],

    [AGROMANO_ROLES.GERENTE_RRHH]: [
        // Personal
        'trabajadores:create', 'trabajadores:read:all', 'trabajadores:update:all',
        'trabajadores:delete', 'trabajadores:import', 'trabajadores:export',
        // Asistencia
        'asistencia:read:all', 'asistencia:update', 'asistencia:reports',
        'permisos:approve', 'horarios:manage',
        // Nómina
        'nomina:process', 'nomina:read:all', 'nomina:approve', 'nomina:calculate',
        'nomina:reports', 'nomina:export', 'salarios:update', 'bonificaciones:manage', 'deducciones:manage',
        // Reportes
        'reportes:read:advanced', 'reportes:export', 'dashboard:view:advanced'
    ],

    [AGROMANO_ROLES.SUPERVISOR_RRHH]: [
        // Personal
        'trabajadores:read:all', 'trabajadores:update:all', 'trabajadores:export',
        // Asistencia
        'asistencia:read:all', 'asistencia:reports', 'permisos:read',
        // Nómina
        'nomina:read:all', 'nomina:reports',
        // Reportes
        'reportes:read', 'dashboard:view:basic'
    ],

    [AGROMANO_ROLES.EMPLEADO_CAMPO]: [
        // Personal
        'trabajadores:read:own', 'trabajadores:update:own',
        // Asistencia
        'asistencia:register', 'asistencia:read:own', 'permisos:create',
        // Productividad
        'productividad:register', 'productividad:read:own', 'tareas:read',
        'tareas:update', 'tareas:complete',
        // Cultivos
        'cultivos:read', 'cosechas:register',
        // Reportes
        'dashboard:view:basic',
        // Móvil
        'mobile:access', 'mobile:sync', 'gps:track', 'photos:upload'
    ],

    [AGROMANO_ROLES.VISUAL_SOLO_LECTURA]: [
        // Reportes
        'reportes:read', 'dashboard:view:basic', 'kpis:view',
        // Básicos
        'trabajadores:read:all', 'asistencia:read:all', 'productividad:read:all',
        'cultivos:read', 'parcelas:read'
    ]
};

// Extender el tipo Request para incluir información del usuario Auth0
declare global {
    namespace Express {
        interface Request {
            auth?: {
                sub: string;
                permissions?: string[];
                'https://agromano.com/roles'?: string[];
                'https://agromano.com/user_metadata'?: any;
            };
        }
    }
}

/**
 * Middleware para verificar un permiso específico
 */
export const requirePermission = (permission: AgroManoPermission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermissions = req.auth?.permissions || [];
        
        if (!userPermissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                message: `Permiso requerido: ${permission}`,
                userPermissions,
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }
        
        next();
    };
};

/**
 * Middleware para verificar múltiples permisos (AND logic)
 */
export const requirePermissions = (permissions: AgroManoPermission[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermissions = req.auth?.permissions || [];
        
        const hasAllPermissions = permissions.every(
            permission => userPermissions.includes(permission)
        );
        
        if (!hasAllPermissions) {
            const missingPermissions = permissions.filter(
                permission => !userPermissions.includes(permission)
            );
            
            return res.status(403).json({
                success: false,
                message: `Permisos requeridos: ${permissions.join(', ')}`,
                missingPermissions,
                userPermissions,
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }
        
        next();
    };
};

/**
 * Middleware para verificar al menos uno de varios permisos (OR logic)
 */
export const requireAnyPermission = (permissions: AgroManoPermission[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userPermissions = req.auth?.permissions || [];
        
        const hasAnyPermission = permissions.some(
            permission => userPermissions.includes(permission)
        );
        
        if (!hasAnyPermission) {
            return res.status(403).json({
                success: false,
                message: `Se requiere al menos uno de: ${permissions.join(', ')}`,
                requiredPermissions: permissions,
                userPermissions,
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }
        
        next();
    };
};

/**
 * Middleware para verificar rol específico
 */
export const requireRole = (role: keyof typeof AGROMANO_ROLES) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles = req.auth?.['https://agromano.com/roles'] || [];
        const requiredRole = AGROMANO_ROLES[role];
        
        if (!userRoles.includes(requiredRole)) {
            return res.status(403).json({
                success: false,
                message: `Rol requerido: ${requiredRole}`,
                userRoles,
                code: 'INSUFFICIENT_ROLE'
            });
        }
        
        next();
    };
};

/**
 * Función helper para verificar si un usuario tiene un permiso específico
 */
export const userHasPermission = (user: Express.Request['auth'], permission: AgroManoPermission): boolean => {
    return user?.permissions?.includes(permission) || false;
};

/**
 * Función helper para verificar si un usuario tiene un rol específico
 */
export const userHasRole = (user: Express.Request['auth'], role: keyof typeof AGROMANO_ROLES): boolean => {
    const userRoles = user?.['https://agromano.com/roles'] || [];
    const requiredRole = AGROMANO_ROLES[role];
    return userRoles.includes(requiredRole);
};

/**
 * Función helper para obtener todos los permisos de un rol
 */
export const getPermissionsForRole = (role: keyof typeof AGROMANO_ROLES): AgroManoPermission[] => {
    return ROLE_PERMISSIONS[AGROMANO_ROLES[role]] || [];
};
