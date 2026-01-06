import express from 'express';
import { UserRoleController } from '../controllers/user-role.controller';
// import { UserSyncController } from '../controllers/user-sync.controller';
import { checkJwt } from '../shared/infrastructure/config/auth0.config';
import { loadLocalUserData } from '../features/authentication/infrastructure/middleware/auth0-hybrid.middleware';

const router = express.Router();

/**
 * @route GET /api/admin/users
 * @desc Obtener lista de usuarios con sus roles
 * @access Admin (Auth0 + BD Local)
 */
router.get('/users',
  checkJwt,              // 1. Valida token Auth0
  loadLocalUserData,     // 2. Carga datos de BD local
  UserRoleController.getUsers
);

/**
 * @route GET /api/admin/users/without-roles
 * @desc Obtener usuarios sin roles asignados
 * @access Admin
 */
router.get('/users/without-roles',
  checkJwt,
  loadLocalUserData,
  UserRoleController.getUsersWithoutRoles
);

/**
 * @route GET /api/admin/users/:userId
 * @desc Obtener un usuario específico con sus roles
 * @access Admin
 */
router.get('/users/:userId',
  checkJwt,
  loadLocalUserData,
  UserRoleController.getUserById
);

/**
 * @route GET /api/admin/roles
 * @desc Obtener lista de roles disponibles
 * @access Admin
 */
router.get('/roles',
  checkJwt,
  loadLocalUserData,
  UserRoleController.getRoles
);

/**
 * @route PUT /api/admin/users/:userId/roles
 * @desc Asignar/actualizar roles de un usuario
 * @access Admin
 */
router.put('/users/:userId/roles',
  checkJwt,
  loadLocalUserData,
  UserRoleController.assignRoles
);

/**
 * @route DELETE /api/admin/users/:userId/roles
 * @desc Remover roles de un usuario
 * @access Admin
 */
router.delete('/users/:userId/roles',
  checkJwt,
  loadLocalUserData,
  UserRoleController.removeRoles
);

/**
 * @route GET /api/admin/users/:userId/role-history
 * @desc Obtener historial de asignaciones de roles
 * @access Admin
 */
router.get('/users/:userId/role-history',
  checkJwt,
  loadLocalUserData,
  UserRoleController.getRoleAssignmentHistory
);

/**
 * @route GET /api/admin/role-history
 * @desc Obtener historial completo de asignaciones de roles
 * @access Admin
 */
router.get('/role-history',
  checkJwt,
  loadLocalUserData,
  UserRoleController.getRoleAssignmentHistory
);

// ========== RUTAS DE SINCRONIZACIÓN (TEMPORALMENTE DESHABILITADAS) ==========
// TODO: Implementar UserSyncService y UserSyncController

/*
router.post('/sync/users/:userId',
  checkJwt,
  authenticateToken,
  UserSyncController.syncUser
);

router.post('/sync/users',
  checkJwt,
  authenticateToken,
  UserSyncController.syncAllUsers
);

router.get('/sync/integrity',
  checkJwt,
  authenticateToken,
  UserSyncController.verifyIntegrity
);

router.delete('/sync/orphaned-users',
  checkJwt,
  authenticateToken,
  UserSyncController.cleanupOrphanedUsers
);

router.get('/sync/stats',
  checkJwt,
  authenticateToken,
  UserSyncController.getSyncStats
);
*/

export default router;