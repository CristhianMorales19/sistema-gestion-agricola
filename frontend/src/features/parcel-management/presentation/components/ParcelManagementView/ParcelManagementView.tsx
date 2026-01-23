// src/features/parcel-management/presentation/components/ParcelManagementView/ParcelManagementView.tsx
import React, { useState, useCallback, useEffect } from "react";
import { Box, InputAdornment, Grid, TableBody, TableHead } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { NewParcelForm } from "../ParcelForm/NewParcelForm";
import { EditParcelDialog } from "../ParcelForm/EditParcelDialog";
import { useParcelManagement } from "../../../application/hooks/useParcelManagement";
import {
  CreateParcelDTO,
  UpdateParcelDTO,
  Parcel,
} from "../../../domain/entities/Parcel";
import { ParcelService } from "../../../application/ParcelService";

import {
  StyledTableContainer,
  StyledTable,
  TableHeadRow,
  HeaderCell,
  StyledTableRow,
  BodyCell,
  StatusChip,
  ActionsContainer,
  EditButton,
  DeleteButton,
  StyledEditIcon,
  StyledDeleteIcon,
  EmptyRow,
  EmptyTableMessage,
} from "../../../../../shared/presentation/styles/Table.styles";
import {
  SearchContainerGeneric,
  SearchInputContainer,
  StyledSearchIcon,
} from "../../../../../shared/presentation/styles/SearchContainer.styles";
import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../../shared/presentation/styles/LoadingSpinner.styles";

import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import { ConfirmDeleteDialog } from "../../../../../shared/presentation/components/ui/confirmDialog/ConfirmDeleteDialog";
import { ParcelStats } from "./ParcelStats";
import { TerrainDistribution } from "./TerrainDistribution";

type ParcelView = "list";

interface SelectedParcel {
  id: number;
  nombre: string;
}

// Componente de fila de parcela mejorado
const ParcelRow: React.FC<{
  parcel: Parcel;
  isSelected: boolean;
  onEdit: (parcel: Parcel) => void;
  onDelete: (parcel: SelectedParcel) => void;
  onSelect: (parcel: Parcel) => void;
}> = React.memo(({ parcel, isSelected, onEdit, onDelete, onSelect }) => {
  const handleRowClick = useCallback(
    () => onSelect(parcel),
    [parcel, onSelect],
  );
  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(parcel);
    },
    [parcel, onEdit],
  );
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (parcel.id) onDelete({ id: parcel.id, nombre: parcel.nombre });
    },
    [parcel.id, onDelete, parcel.nombre],
  );

  const color = ParcelService.getEstadoLabel(parcel.estado);
  const status =
    color === "Disponible"
      ? true
      : color === "En Mantenimiento"
        ? undefined
        : false;

  return (
    <StyledTableRow onClick={handleRowClick}>
      <BodyCell>{parcel.nombre}</BodyCell>
      <BodyCell>{parcel.ubicacionDescripcion}</BodyCell>
      <BodyCell> {parcel.areaHectareas?.toFixed(2)}</BodyCell>

      <BodyCell>
        {ParcelService.getTipoTerrenoLabel(
          parcel.tipoTerreno,
          parcel.tipoTerrenoOtro,
        )}
      </BodyCell>

      <BodyCell>
        <StatusChip
          label={ParcelService.getEstadoLabel(parcel.estado)}
          status={status}
          size="small"
        />
      </BodyCell>
      <ActionsContainer>
        <EditButton size="small" onClick={handleEditClick} title="Editar">
          <StyledEditIcon />
        </EditButton>
        <DeleteButton size="small" onClick={handleDeleteClick} title="Eliminar">
          <StyledDeleteIcon />
        </DeleteButton>
      </ActionsContainer>
    </StyledTableRow>
  );
});

ParcelRow.displayName = "ParcelRow";

export const ParcelManagementView = () => {
  const {
    parcels,
    loading,
    deleteParcel,
    searchParcels,
    refreshParcels,
    createParcel,
    updateParcel,
  } = useParcelManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<ParcelView>("list");
  const [selectedParcel, setSelectedParcel] = useState<SelectedParcel | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    refreshParcels();
  }, [refreshParcels]);

  // Búsqueda dinámica
  useEffect(() => {
    if (currentView !== "list") return;
    const handle = window.setTimeout(() => {
      searchParcels(searchQuery);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchQuery, searchParcels, currentView]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    await searchParcels(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAddParcelClick = useCallback(() => {
    setShowCreateDialog(true);
    setSelectedParcel(null);
  }, []);

  const handleBackToList = () => {
    if (showCreateDialog) setShowCreateDialog(false);
    setCurrentView("list");
    setSelectedParcel(null);
    refreshParcels();
  };

  const handleCreateParcel = async (data: CreateParcelDTO) => {
    return await createParcel(data);
  };

  const handleEdit = useCallback((parcel: Parcel) => {
    if (parcel.id) {
      setEditingParcel(parcel);
      setEditDialogOpen(true);
    }
  }, []);

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingParcel(null);
  };

  const handleUpdateParcel = async (id: number, data: UpdateParcelDTO) => {
    const success = await updateParcel(id, data);
    if (success) {
      await refreshParcels();
    }
    return success;
  };

  const handleDelete = useCallback(async (parcel: SelectedParcel) => {
    setSelectedParcel(parcel);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedParcel) {
      await deleteParcel(selectedParcel.id);
      await refreshParcels();
      setDeleteDialogOpen(false);
      setSelectedParcel(null);
    }
  }, [deleteParcel, selectedParcel, refreshParcels]);

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedParcel(null);
  };

  const handleParcelSelect = useCallback((parcel: Parcel) => {
    if (parcel.id) {
      setSelectedParcel({ id: parcel.id, nombre: parcel.nombre });
    }
  }, []);

  // Renderizar contenido
  const renderContent = () => {
    switch (currentView) {
      case "list":
      default:
        return (
          <>
            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }} alignItems="stretch">
              <Grid item xs={12} sm={6}>
                <TerrainDistribution parcels={parcels} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ParcelStats parcels={parcels} />
              </Grid>
            </Grid>

            <SearchContainerGeneric>
              <SearchInputContainer>
                <TextFieldGeneric
                  fullWidth
                  placeholder="Buscar por nombre, ubicación o tipo de terreno"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StyledSearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </SearchInputContainer>
            </SearchContainerGeneric>

            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : (
              <StyledTableContainer>
                <StyledTable>
                  <TableHead>
                    <TableHeadRow>
                      <HeaderCell>Parcela</HeaderCell>
                      <HeaderCell>Ubicación</HeaderCell>
                      <HeaderCell>Área (ha)</HeaderCell>
                      <HeaderCell>Tipo de Terreno</HeaderCell>
                      <HeaderCell>Estado</HeaderCell>
                      <HeaderCell>Acciones</HeaderCell>
                    </TableHeadRow>
                  </TableHead>
                  <TableBody>
                    {parcels.length === 0 ? (
                      <EmptyRow>
                        <BodyCell colSpan={6}>
                          <EmptyTableMessage>
                            No hay parcelas registradas
                          </EmptyTableMessage>
                        </BodyCell>
                      </EmptyRow>
                    ) : (
                      parcels.map((parcel) => (
                        <ParcelRow
                          key={parcel.id}
                          parcel={parcel}
                          isSelected={selectedParcel?.id === parcel.id}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onSelect={handleParcelSelect}
                        />
                      ))
                    )}
                  </TableBody>
                </StyledTable>
              </StyledTableContainer>
            )}
          </>
        );
    }
  };

  return (
    <>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Eliminar parcela"
        message="Esta acción eliminará permanentemente la parcela. ¿Deseas continuar?"
        itemLabel={`${selectedParcel?.nombre}`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />

      <NewParcelForm
        open={showCreateDialog}
        onSubmit={handleCreateParcel}
        onCancel={handleBackToList}
      />

      <HeaderGeneric>
        <TextGeneric variant="h4">Gestión de Parcelas</TextGeneric>
        {currentView === "list" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <ButtonGeneric
              startIcon={<AddIcon />}
              onClick={handleAddParcelClick}
            >
              Crear Parcela
            </ButtonGeneric>
          </Box>
        )}
      </HeaderGeneric>

      {renderContent()}

      {/* Modal de edición de parcela */}
      <EditParcelDialog
        open={editDialogOpen}
        parcel={editingParcel}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateParcel}
      />
    </>
  );
};
