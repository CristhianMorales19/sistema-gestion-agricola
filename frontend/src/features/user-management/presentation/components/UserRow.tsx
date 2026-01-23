import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";

import {
  StyledTableRow,
  BodyCell,
  StatusChip,
  ActionsContainer,
  EditButton,
  StyledEditIcon,
} from "../../../../shared/presentation/styles/Table.styles";

import { UserWithRoles, Role } from "../../types";

interface UserRowProps {
  userWithRoles: UserWithRoles;
  getRoleColor: (
    roleName: string | undefined,
  ) => "default" | "primary" | "secondary" | "success" | "warning" | "error";
  onRemoveRole: (userId: string, roleId: string) => void;
  onOpenRoleDialog: (user: UserWithRoles) => void;
}

export const UserRow: React.FC<UserRowProps> = React.memo(
  ({ userWithRoles, getRoleColor, onRemoveRole, onOpenRoleDialog }) => {
    const handleRemoveRole = React.useCallback(
      (roleId: string) => {
        if (userWithRoles.user.user_id) {
          onRemoveRole(userWithRoles.user.user_id, roleId);
        }
      },
      [userWithRoles.user.user_id, onRemoveRole],
    );

    const handleOpenDialog = React.useCallback(() => {
      onOpenRoleDialog(userWithRoles);
    }, [userWithRoles, onOpenRoleDialog]);

    return (
      <StyledTableRow hover>
        <BodyCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#3b82f6" }}>
              {(
                userWithRoles.user.name ||
                userWithRoles.user.email ||
                userWithRoles.localUserData?.username ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </Avatar>
            <Box>
              {userWithRoles.user.name ||
                userWithRoles.localUserData?.username ||
                "Usuario sin nombre"}
            </Box>
          </Box>
        </BodyCell>

        <BodyCell>{userWithRoles.user.email || "No especificado"}</BodyCell>
        <BodyCell>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {userWithRoles.roles.length > 0 ? (
              userWithRoles.roles.map(
                (role: Role) =>
                  role.id && (
                    <RoleChip
                      key={role.id}
                      role={role}
                      userId={userWithRoles.user.user_id}
                      getRoleColor={getRoleColor}
                      onRemove={handleRemoveRole}
                    />
                  ),
              )
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontStyle: "italic" }}
              >
                Sin roles asignados
              </Typography>
            )}
          </Box>
        </BodyCell>

        <BodyCell>
          <StatusChip
            label={
              userWithRoles.localUserData?.estado === "activo"
                ? "Activo"
                : "Inactivo"
            }
            size="small"
            status={
              userWithRoles.localUserData?.estado === "activo" ? true : false
            }
          />
        </BodyCell>
        <BodyCell>
          <ActionsContainer>
            <EditButton
              size="small"
              onClick={handleOpenDialog}
              title="Editar empleado"
            >
              <StyledEditIcon />
            </EditButton>
          </ActionsContainer>
        </BodyCell>
      </StyledTableRow>
    );
  },
);

UserRow.displayName = "UserRow";

// Componente separado para el Chip de rol
interface RoleChipProps {
  role: Role;
  userId: string | undefined;
  getRoleColor: (
    roleName: string | undefined,
  ) => "default" | "primary" | "secondary" | "success" | "warning" | "error";
  onRemove: (roleId: string) => void;
}

const RoleChip: React.FC<RoleChipProps> = React.memo(
  ({ role, userId, getRoleColor, onRemove }) => {
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
          "& .MuiChip-deleteIcon": {
            color: "inherit",
            "&:hover": { color: "#ef4444" },
          },
        }}
      />
    );
  },
);

RoleChip.displayName = "RoleChip";
