import express from 'express';
import { UserRoleController } from '../controllers/user-role.controller';
import { UserSyncController } from '../controllers/user-sync.controller';
import { checkJwt } from '../config/auth0.config';
import { authenticateToken } from '../middleware/rbac.middleware';
import {
  requireUserManagementPermission,
  requireRolePermission,
  requireUserRoleManagementPermission,
  auditRoleManagement
} from '../middleware/user-role-permissions.middleware';
import {
  validateRoleAssignment,
  validateRoleRemoval,
  validateUserSearch,
  validateUserId,
  validateResourceAccess
} from '../middleware/role-validation.middleware';

const router = express.Router();

/**
 * @route GET /api/admin/users
 * @desc Obtener lista de usuarios con sus roles
 * @access Admin (Auth0 + Local)
 */
router.get('/users',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  validateUserSearch,
  UserRoleController.getUsers
);

/**
 * @route GET /api/admin/users/without-roles
 * @desc Obtener usuarios sin roles asignados
 * @access Admin
 */
router.get('/users/without-roles',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  validateUserSearch,
  UserRoleController.getUsersWithoutRoles
);

/**
 * @route GET /api/admin/users/:userId
 * @desc Obtener un usuario específico con sus roles
 * @access Admin
 */
router.get('/users/:userId',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  validateUserId,
  validateResourceAccess,
  UserRoleController.getUserById
);

/**
 * @route GET /api/admin/roles
 * @desc Obtener lista de roles disponibles
 * @access Admin
 */
router.get('/roles',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  UserRoleController.getRoles
);

/**
 * @route PUT /api/admin/users/:userId/roles
 * @desc Asignar/actualizar roles de un usuario
 * @access Admin
 */
router.put('/users/:userId/roles',
  checkJwt,
  authenticateToken,
  validateUserId,
  validateRoleAssignment,
  requireUserRoleManagementPermission,
  auditRoleManagement('assign_roles'),
  UserRoleController.assignRoles
);

/**
 * @route DELETE /api/admin/users/:userId/roles
 * @desc Remover roles de un usuario
 * @access Admin
 */
router.delete('/users/:userId/roles',
  checkJwt,
  authenticateToken,
  validateUserId,
  validateRoleRemoval,
  requireUserRoleManagementPermission,
  auditRoleManagement('remove_roles'),
  UserRoleController.removeRoles
);

/**
 * @route GET /api/admin/users/:userId/role-history
 * @desc Obtener historial de asignaciones de roles
 * @access Admin
 */
router.get('/users/:userId/role-history',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  validateUserId,
  UserRoleController.getRoleAssignmentHistory
);

/**
 * @route GET /api/admin/role-history
 * @desc Obtener historial completo de asignaciones de roles
 * @access Admin
 */
router.get('/role-history',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  UserRoleController.getRoleAssignmentHistory
);

// ========== RUTAS DE SINCRONIZACIÓN ==========

/**
 * @route POST /api/admin/sync/users/:userId
 * @desc Sincronizar un usuario específico desde Auth0
 * @access Admin
 */
router.post('/sync/users/:userId',
  checkJwt,
  authenticateToken,
  requireUserManagementPermission,
  auditRoleManagement('sync_user'),
  UserSyncController.syncUser
);

/**
 * @route POST /api/admin/sync/users
 * @desc Sincronizar todos los usuarios desde Auth0
 * @access Admin
 */
router.post('/sync/users',
  checkJwt,
  authenticateToken,
  requireUserManagementPermission,
  auditRoleManagement('sync_all_users'),
  UserSyncController.syncAllUsers
);

/**
 * @route GET /api/admin/sync/integrity
 * @desc Verificar integridad entre usuarios Auth0 y locales
 * @access Admin
 */
router.get('/sync/integrity',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  UserSyncController.verifyIntegrity
);

/**
 * @route DELETE /api/admin/sync/orphaned-users
 * @desc Limpiar usuarios locales huérfanos
 * @access Admin
 */
router.delete('/sync/orphaned-users',
  checkJwt,
  authenticateToken,
  requireUserManagementPermission,
  auditRoleManagement('cleanup_orphaned_users'),
  UserSyncController.cleanupOrphanedUsers
);

/**
 * @route GET /api/admin/sync/stats
 * @desc Obtener estadísticas de sincronización
 * @access Admin
 */
router.get('/sync/stats',
  checkJwt,
  authenticateToken,
  requireRolePermission('read'),
  UserSyncController.getSyncStats
);

export default router;