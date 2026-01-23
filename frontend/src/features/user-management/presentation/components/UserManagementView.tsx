import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  TableBody,
  TableHead,
} from "@mui/material";

import { InputAdornment } from "@mui/material";
import { ButtonGeneric } from "../../../../shared/presentation/styles/Button.styles";
import { BackButtonGeneric } from "../../../../shared/presentation/styles/BackButton.styles";
import { TextFieldGeneric } from "../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../shared/presentation/styles/Text.styles";
import { StyledSearchIcon } from "../../../../shared/presentation/styles/SearchContainer.styles";

import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../shared/presentation/styles/LoadingSpinner.styles";

import {
  ButtonContainer,
  FormContainer,
  GridItem,
  InputSection,
  StyledArrowBackIcon,
} from "../../../../shared/presentation/styles/Form.styles";

import {
  StyledTableContainer,
  StyledTable,
  TableHeadRow,
  HeaderCell,
  BodyCell,
  EmptyRow,
  EmptyTableMessage,
} from "../../../../shared/presentation/styles/Table.styles";

import {
  GlassDialog,
  SlideTransition,
} from "../../../../shared/presentation/styles/Dialog.styles";

import { Refresh, PersonAdd } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { UserManagementService } from "../../services/UserManagementService";
import { UsuariosSistemaService } from "../../../../services/usuarios-sistema.service";
import { UserWithRoles, Role, UserFilters } from "../../types";
import { UserRow } from "./UserRow";
import { useMessage } from "../../../../app/providers/MessageProvider";

export const UserManagementView: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [databaseRoles, setDatabaseRoles] = useState<any[]>([]); // Roles de BD para crear usuarios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showMessage } = useMessage();

  // Estados para filtros
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    limit: 10,
  });

  // Estados para diálogos
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Estados para modal crear usuario
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    nombre: "",
    password: "",
    rol_id: "",
  });

  // Inicializar servicio
  const userService = useMemo(
    () => new UserManagementService(getAccessTokenSilently),
    [getAccessTokenSilently],
  );
  const usuariosService = useMemo(
    () => new UsuariosSistemaService(getAccessTokenSilently),
    [getAccessTokenSilently],
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, rolesData, dbRolesResponse] = await Promise.all([
        userService.getUsers(filters),
        userService.getRoles(),
        usuariosService.getRolesDisponibles(), // Cargar roles de BD
      ]);

      setUsers(usersResponse.users);
      setRoles(rolesData);
      setDatabaseRoles(dbRolesResponse.data || []); // Guardar roles de BD
    } catch (err) {
      setError("Error cargando datos de usuarios");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, userService, usuariosService]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const handleSyncUsers = useCallback(async () => {
    try {
      setLoading(true);
      await userService.syncUsers();
      setSuccess("Usuarios sincronizados con Auth0 exitosamente");
      await loadData();
    } catch (err) {
      setError("Error sincronizando usuarios");
      console.error("Error syncing users:", err);
    } finally {
      setLoading(false);
    }
  }, [userService, loadData]);

  const handleCrearUsuario = useCallback(() => {
    setNewUserData({
      email: "",
      nombre: "",
      password: "",
      rol_id: "",
    });
    setCreateUserModalOpen(true);
  }, []);

  const handleCloseCreateUserModal = useCallback(() => {
    setCreateUserModalOpen(false);
    setNewUserData({
      email: "",
      nombre: "",
      password: "",
      rol_id: "",
    });
  }, []);

  const handleSubmitCreateUser = useCallback(async () => {
    try {
      if (
        !newUserData.email ||
        !newUserData.nombre ||
        !newUserData.password ||
        !newUserData.rol_id
      ) {
        setError("Todos los campos son requeridos");
        return;
      }

      if (newUserData.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres");
        return;
      }

      // Sugerir dominio @agromano.com si no lo tiene
      if (!newUserData.email.includes("@agromano.com")) {
        const confirmDomain = window.confirm(
          `¿Estás seguro de usar "${newUserData.email}"?\n\n` +
            `Se recomienda usar el dominio @agromano.com para consistencia con otros usuarios del sistema.\n\n` +
            `¿Continuar con este email?`,
        );
        if (!confirmDomain) return;
      }

      setLoading(true);
      await usuariosService.crearUsuarioHibrido({
        email: newUserData.email,
        nombre: newUserData.nombre,
        password: newUserData.password,
        rol_id: Number(newUserData.rol_id),
      });

      setSuccess("Usuario híbrido creado exitosamente");
      handleCloseCreateUserModal();
      await loadData();
    } catch (err: any) {
      setError(err.message || "Error creando usuario");
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  }, [newUserData, usuariosService, handleCloseCreateUserModal, loadData]);

  const handleOpenRoleDialog = useCallback((user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRoles(
      user.roles
        .map((role: Role) => role.id)
        .filter((id: string | undefined): id is string => id !== undefined),
    );
    setRoleDialogOpen(true);
  }, []);

  const handleCloseRoleDialog = useCallback(() => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  }, []);

  const handleAssignRoles = useCallback(async () => {
    if (!selectedUser || !selectedUser.user.user_id) return;

    try {
      await userService.assignRoles(selectedUser.user.user_id, selectedRoles);
      setSuccess("Roles asignados exitosamente");
      handleCloseRoleDialog();
      await loadData();
    } catch (err) {
      setError("Error asignando roles");
      console.error("Error assigning roles:", err);
    }
  }, [
    selectedUser,
    selectedRoles,
    userService,
    handleCloseRoleDialog,
    loadData,
  ]);

  const handleRemoveRole = useCallback(
    async (userId: string, roleId: string) => {
      try {
        await userService.removeRole(userId, roleId);
        setSuccess("Rol removido exitosamente");
        await loadData();
      } catch (err) {
        setError("Error removiendo rol");
        console.error("Error removing role:", err);
      }
    },
    [userService, loadData],
  );

  const handleRoleToggle = useCallback((roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  }, []);

  const createRoleToggleHandler = useCallback(
    (roleId: string) => {
      return () => handleRoleToggle(roleId);
    },
    [handleRoleToggle],
  );

  const getRoleColor = useCallback(
    (
      roleName: string | undefined,
    ):
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error" => {
      if (!roleName) return "default";

      const colors: {
        [key: string]:
          | "primary"
          | "secondary"
          | "success"
          | "warning"
          | "error";
      } = {
        admin: "error",
        administrador: "error",
        admin_agromano: "error",
        supervisor_campo: "warning",
        gerente_rrhh: "warning",
        supervisor_rrhh: "secondary",
        empleado_campo: "success",
        visual_solo_lectura: "primary",
        manager: "warning",
        gerente: "warning",
        worker: "success",
        trabajador: "success",
        viewer: "primary",
        visualizador: "primary",
      };
      return colors[roleName.toLowerCase()] || "primary";
    },
    [],
  );

  const handleNameFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev: UserFilters) => ({
        ...prev,
        name: e.target.value,
        page: 0,
      }));
    },
    [],
  );

  const handleRoleFilterChange = useCallback((e: any) => {
    setFilters((prev: UserFilters) => ({
      ...prev,
      role: e.target.value,
      page: 0,
    }));
  }, []);

  const handleHasRoleFilterChange = useCallback((e: any) => {
    setFilters((prev: UserFilters) => ({
      ...prev,
      hasRole: e.target.value === "" ? undefined : e.target.value === "true",
      page: 0,
    }));
  }, []);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUserData((prev) => ({ ...prev, email: e.target.value }));
    },
    [],
  );

  const handleNombreChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUserData((prev) => ({ ...prev, nombre: e.target.value }));
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUserData((prev) => ({ ...prev, password: e.target.value }));
    },
    [],
  );

  const handleRolIdChange = useCallback((e: any) => {
    setNewUserData((prev) => ({ ...prev, rol_id: e.target.value }));
  }, []);

  return (
    <>
      <HeaderGeneric>
        <TextGeneric variant="h4">Gestión de Usuarios</TextGeneric>
        <Box sx={{ display: "flex", gap: 2 }}>
          <ButtonGeneric startIcon={<Refresh />} onClick={loadData}>
            Actualizar
          </ButtonGeneric>
          <ButtonGeneric startIcon={<PersonAdd />} onClick={handleCrearUsuario}>
            Crear Usuario
          </ButtonGeneric>

          <ButtonGeneric startIcon={<PersonAdd />} onClick={handleSyncUsers}>
            Sincronizar Auth0
          </ButtonGeneric>
        </Box>
      </HeaderGeneric>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <Grid container spacing={2} justifyContent="center">
          <GridItem item xs={12} sm={6} md={3}>
            <TextFieldGeneric
              fullWidth
              placeholder="Buscar por nombre o email"
              variant="outlined"
              size="small"
              value={filters.name || ""}
              onChange={handleNameFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledSearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </GridItem>
          <GridItem item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <TextFieldGeneric
                select
                value={filters.role || ""}
                label="Filtrar por rol"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="">Todos los roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextFieldGeneric>
            </FormControl>
          </GridItem>
          <GridItem item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <TextFieldGeneric
                select
                value={
                  filters.hasRole === undefined
                    ? ""
                    : filters.hasRole.toString()
                }
                label="Estado de roles"
                onChange={handleHasRoleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Con roles</MenuItem>
                <MenuItem value="false">Sin roles</MenuItem>
              </TextFieldGeneric>
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <StyledTableContainer>
          <StyledTable>
            <TableHead>
              <TableHeadRow>
                <HeaderCell>Usuario</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Roles</HeaderCell>
                <HeaderCell>Estado</HeaderCell>
                <HeaderCell>Acciones</HeaderCell>
              </TableHeadRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <EmptyRow>
                  <BodyCell colSpan={6}>
                    <EmptyTableMessage>
                      No hay usuarios registrados
                    </EmptyTableMessage>
                  </BodyCell>
                </EmptyRow>
              ) : (
                users.map((userWithRoles) => (
                  <UserRow
                    key={userWithRoles.user.user_id}
                    userWithRoles={userWithRoles}
                    getRoleColor={getRoleColor}
                    onRemoveRole={handleRemoveRole}
                    onOpenRoleDialog={handleOpenRoleDialog}
                  />
                ))
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      )}

      <GlassDialog
        open={roleDialogOpen}
        onClose={handleCloseRoleDialog}
        TransitionComponent={SlideTransition}
        maxWidth="sm"
        fullWidth
      >
        <FormContainer>
          <TextGeneric variant="h5">Gestionar Roles </TextGeneric>
          <TextGeneric variant="subtitle2">
            Selecciona los roles que deseas asignar a este usuario
          </TextGeneric>

          <Grid container spacing={3}>
            {roles.map(
              (role) =>
                role.id && (
                  <GridItem item xs={12} key={role.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRoles.includes(role.id)}
                          onChange={createRoleToggleHandler(role.id)}
                          sx={{
                            color: (theme) => theme.palette.primary.dark,
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.text.primary,
                            }}
                          >
                            {role.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: (theme) => theme.palette.text.secondary,
                            }}
                          >
                            {role.description}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    />
                  </GridItem>
                ),
            )}
          </Grid>

          <ButtonContainer>
            <BackButtonGeneric
              onClick={handleCloseRoleDialog}
              startIcon={<StyledArrowBackIcon />}
            >
              Cancelar
            </BackButtonGeneric>
            <ButtonGeneric onClick={handleAssignRoles} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </ButtonGeneric>
          </ButtonContainer>
        </FormContainer>
      </GlassDialog>
      {/* Modal para crear usuario */}
      <GlassDialog
        open={createUserModalOpen}
        TransitionComponent={SlideTransition}
        onClose={handleCloseCreateUserModal}
        maxWidth="sm"
        fullWidth
      >
        <FormContainer>
          <TextGeneric variant="h5">Crear Usuario</TextGeneric>
          <InputSection>
            <Grid container spacing={3}>
              <GridItem item xs={12} sm={6}>
                <TextFieldGeneric
                  fullWidth
                  label="Email"
                  type="email"
                  value={newUserData.email}
                  onChange={handleEmailChange}
                  placeholder="usuario@agromano.com"
                  helperText="Usar dominio @agromano.com para consistencia"
                />
              </GridItem>
              <GridItem item xs={12} sm={6}>
                <TextFieldGeneric
                  fullWidth
                  label="Nombre Completo"
                  value={newUserData.nombre}
                  onChange={handleNombreChange}
                />
              </GridItem>
              <GridItem item xs={12} sm={6}>
                <TextFieldGeneric
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={newUserData.password}
                  onChange={handlePasswordChange}
                  helperText="Mínimo 8 caracteres"
                />
              </GridItem>
              <GridItem item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextFieldGeneric
                    select
                    value={newUserData.rol_id}
                    label="Rol"
                    onChange={handleRolIdChange}
                  >
                    {databaseRoles.map((role) => (
                      <MenuItem key={role.rol_id} value={role.rol_id}>
                        <Box>
                          <Typography>{role.nombre}</Typography>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {role.descripcion || role.codigo}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextFieldGeneric>
                </FormControl>
              </GridItem>
            </Grid>
          </InputSection>
        </FormContainer>

        <ButtonContainer>
          <BackButtonGeneric
            onClick={handleCloseCreateUserModal}
            startIcon={<StyledArrowBackIcon />}
          >
            Cancelar
          </BackButtonGeneric>

          <ButtonGeneric
            onClick={handleSubmitCreateUser}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear"}
          </ButtonGeneric>
        </ButtonContainer>
      </GlassDialog>
      {/* Snackbars para mensajes */}
      {error !== null && showMessage("error", error)}
    </>
  );
};
