import express from 'express';
import { UserRoleController } from '../controllers/user-role.controller';
import { checkJwt } from '../config/auth0.config';

const router = express.Router();

/**
 * RUTAS TEMPORALES PARA TESTING - SIN AUTENTICACIÓN
 * TODO: Eliminar estas rutas una vez que se configuren los permisos apropiados
 */

/**
 * @route GET /api/test/users
 * @desc Obtener lista de usuarios con sus roles (SIN AUTENTICACIÓN - SOLO TESTING)
 * @access Public (TEMPORAL)
 */
router.get('/users', UserRoleController.getUsers);

/**
 * @route GET /api/test/users/:id
 * @desc Obtener usuario por ID con sus roles (SIN AUTENTICACIÓN - SOLO TESTING)
 * @access Public (TEMPORAL)
 */
router.get('/users/:id', UserRoleController.getUserById);

/**
 * @route PUT /api/test/users/:id/roles
 * @desc Asignar roles a usuario (SIN AUTENTICACIÓN - SOLO TESTING)
 * @access Public (TEMPORAL)
 */
router.put('/users/:id/roles', UserRoleController.assignRoles);

/**
 * @route DELETE /api/test/users/:id/roles/:roleId
 * @desc Remover rol específico de usuario (SIN AUTENTICACIÓN - SOLO TESTING)
 * @access Public (TEMPORAL)
 */
router.delete('/users/:id/roles/:roleId', UserRoleController.removeRoles);

/**
 * @route POST /api/test/users/sync
 * @desc Sincronizar usuarios con Auth0 (SIN AUTENTICACIÓN - SOLO TESTING)
 * @access Public (TEMPORAL)
 */
router.post('/users/sync', async (req, res) => {
  // Implementación temporal de sincronización
  res.json({ message: 'Sincronización no implementada en modo test' });
});

/**
 * @route GET /api/test/roles
 * @desc Obtener lista de roles disponibles (SIN AUTENTICACIÓN - SOLO TESTING)
 * @access Public (TEMPORAL)
 */
router.get('/roles', UserRoleController.getRoles);

export default router;