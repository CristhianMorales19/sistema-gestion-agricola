import React from 'react';
import {
  TableRow,
  TableCell,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { UserWithRoles, Role } from '../../../features/user-management/types';

interface UserRowProps {
  userWithRoles: UserWithRoles;
  getRoleColor: (roleName: string | undefined) => 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onRemoveRole: (userId: string, roleId: string) => void;
  onOpenRoleDialog: (user: UserWithRoles) => void;
}

export const UserRow: React.FC<UserRowProps> = React.memo(({
  userWithRoles,
  getRoleColor,
  onRemoveRole,
  onOpenRoleDialog
}) => {
  const handleRemoveRole = React.useCallback((roleId: string) => {
    if (userWithRoles.user.user_id) {
      onRemoveRole(userWithRoles.user.user_id, roleId);
    }
  }, [userWithRoles.user.user_id, onRemoveRole]);

  const handleOpenDialog = React.useCallback(() => {
    onOpenRoleDialog(userWithRoles);
  }, [userWithRoles, onOpenRoleDialog]);

  return (
    <TableRow 
      sx={{ 
        '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
        backgroundColor: '#1e293b'
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3b82f6' }}>
            {(userWithRoles.user.name || userWithRoles.user.email || userWithRoles.localUserData?.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ color: '#ffffff', fontWeight: 'medium' }}>
              {userWithRoles.user.name || userWithRoles.localUserData?.username || 'Usuario sin nombre'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {userWithRoles.localUserData?.username ? `@${userWithRoles.localUserData.username}` : userWithRoles.user.user_id}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography sx={{ color: '#94a3b8' }}>
          {userWithRoles.user.email || 'No especificado'}
        </Typography>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {userWithRoles.roles.length > 0 ? (
            userWithRoles.roles.map((role: Role) => (
              role.id && (
                <RoleChip
                  key={role.id}
                  role={role}
                  userId={userWithRoles.user.user_id}
                  getRoleColor={getRoleColor}
                  onRemove={handleRemoveRole}
                />
              )
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
              Sin roles asignados
            </Typography>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={userWithRoles.localUserData?.estado === 'activo' ? 'Activo' : 'Inactivo'}
          size="small"
          color={userWithRoles.localUserData?.estado === 'activo' ? 'success' : 'error'}
        />
      </TableCell>
      <TableCell>
        <IconButton
          onClick={handleOpenDialog}
          sx={{ color: '#3b82f6', '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' } }}
        >
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

UserRow.displayName = 'UserRow';

// Componente separado para el Chip de rol
interface RoleChipProps {
  role: Role;
  userId: string | undefined;
  getRoleColor: (roleName: string | undefined) => 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onRemove: (roleId: string) => void;
}

const RoleChip: React.FC<RoleChipProps> = React.memo(({ role, userId, getRoleColor, onRemove }) => {
  const handleDelete = React.useCallback(() => {
    if (role.id) {
      onRemove(role.id);
    }
  }, [role.id, onRemove]);

  return (
    <Chip
      label={role.name}
      size="small"
      color={getRoleColor(role.name)}
      onDelete={userId && role.id ? handleDelete : undefined}
      sx={{ 
        '& .MuiChip-deleteIcon': { 
          color: 'inherit',
          '&:hover': { color: '#ef4444' }
        }
      }}
    />
  );
});

RoleChip.displayName = 'RoleChip';
