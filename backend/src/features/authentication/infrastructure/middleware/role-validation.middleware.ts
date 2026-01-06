import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Esquemas de validación para las requests de gestión de roles
 */
const roleAssignmentSchema = Joi.object({
  roleIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'roleIds debe ser un array',
      'array.min': 'Debe especificar al menos un rol',
      'any.required': 'roleIds es requerido'
    }),
  reason: Joi.string()
    .optional()
    .max(255)
    .messages({
      'string.max': 'La razón no puede exceder 255 caracteres'
    })
});

const roleRemovalSchema = Joi.object({
  roleIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'roleIds debe ser un array',
      'array.min': 'Debe especificar al menos un rol para remover',
      'any.required': 'roleIds es requerido'
    }),
  reason: Joi.string()
    .optional()
    .max(255)
    .messages({
      'string.max': 'La razón no puede exceder 255 caracteres'
    })
});

const userSearchSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0),
  perPage: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(25),
  email: Joi.string()
    .email()
    .optional(),
  name: Joi.string()
    .min(1)
    .max(100)
    .optional(),
  role: Joi.string()
    .min(1)
    .max(50)
    .optional(),
  hasRole: Joi.boolean()
    .optional()
});

const userIdSchema = Joi.object({
  userId: Joi.string()
    .required()
    .pattern(/^auth0\|[a-zA-Z0-9]+$/)
    .messages({
      'string.pattern.base': 'ID de usuario Auth0 inválido',
      'any.required': 'userId es requerido'
    })
});

/**
 * Middleware de validación para asignación de roles
 */
export const validateRoleAssignment = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = roleAssignmentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware de validación para remoción de roles
 */
export const validateRoleRemoval = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = roleRemovalSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.body = value;
  next();
};

/**
 * Middleware de validación para búsqueda de usuarios
 */
export const validateUserSearch = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = userSearchSchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Parámetros de búsqueda inválidos',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.query = value;
  next();
};

/**
 * Middleware de validación para ID de usuario
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = userIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'ID de usuario inválido',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.params = value;
  next();
};

/**
 * Middleware de validación genérica
 */
export const validateRequest = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = source === 'body' ? req.body : 
                           source === 'query' ? req.query : req.params;

    const { error, value } = schema.validate(dataToValidate);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    if (source === 'body') req.body = value;
    else if (source === 'query') req.query = value;
    else req.params = value;

    next();
  };
};

/**
 * Middleware para validar que el usuario tenga permisos sobre el recurso solicitado
 */
export const validateResourceAccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const currentUser = (req as any).localUser;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Los administradores pueden acceder a cualquier recurso
    const adminPermissions = ['admin:full', 'users:manage', 'roles:assign'];
    const hasAdminPermission = currentUser.permisos?.some((permiso: string) => 
      adminPermissions.includes(permiso)
    );

    if (hasAdminPermission) {
      return next();
    }

    // Los usuarios solo pueden acceder a sus propios recursos para consultas
    if (req.method === 'GET' && userId === currentUser.auth0_user_id) {
      return next();
    }

    // Para operaciones de modificación, se requieren permisos de administrador
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para acceder a este recurso'
    });

  } catch (error) {
    console.error('Error validando acceso a recurso:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};