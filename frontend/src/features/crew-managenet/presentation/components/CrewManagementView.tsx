import React, { useState, useCallback, useEffect } from "react";
import { InputAdornment } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CrewTable } from "./CrewTable/CrewTable";
import { NewEditCrewForm } from "./CrewForm/NewEditCrewForm";
import { useCrewManagement } from "../../application/hooks/use-crew-management";
import { CreateCrewData, Crew } from "../../domain/entities/crew";
import { useEmployeeManagement } from "../../../personnel-management/application/hooks/use-employee-management";
import { ConfirmDeleteDialog } from "../../../../shared/presentation/components/ui/confirmDialog/ConfirmDeleteDialog";
import { ButtonGeneric } from "../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../shared/presentation/styles/Text.styles";
import {
  SearchContainerGeneric,
  SearchInputContainer,
  StyledSearchIcon,
} from "../../../../shared/presentation/styles/SearchContainer.styles";
import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../shared/presentation/styles/LoadingSpinner.styles";

type CrewView = "list" | "new-crew" | "edit-crew";

export const CrewManagementView = () => {
  const {
    crews,
    loading,
    fetchCrews,
    searchCrews,
    createCrew,
    updateCrew,
    deleteCrew,
  } = useCrewManagement();
  const { employees, getAllEmployeesWithoutCrew } = useEmployeeManagement();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentView, setCurrentView] = useState<CrewView>("list");
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  // Para el diálogo de eliminar
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [crewToDelete, setCrewToDelete] = useState<{
    id: number;
    label?: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch crews on component mount
  useEffect(() => {
    fetchCrews();
    getAllEmployeesWithoutCrew();
  }, [fetchCrews, getAllEmployeesWithoutCrew]);

  // Funciones para el diálogo
  const handleOpenDeleteDialog = useCallback((id: number, label?: string) => {
    setCrewToDelete({ id, label });
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setCrewToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!crewToDelete) return;
    setDeleting(true);
    await deleteCrew(crewToDelete.id);
    // si la cuadrilla seleccionada es la borrada, limpiar selección
    if (selectedCrew && selectedCrew.id === crewToDelete.id)
      setSelectedCrew(null);
    setDeleting(false);
    handleCloseDeleteDialog();
  }, [crewToDelete, deleteCrew, selectedCrew, handleCloseDeleteDialog]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      await searchCrews(searchQuery.trim());
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    setIsSearching(false);
    setSelectedCrew(null);
    await fetchCrews();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAddCrewClick = useCallback(() => {
    setCurrentView("new-crew");
    setSelectedCrew(null);
  }, []);

  const handleEditCrew = useCallback((crew: Crew) => {
    setSelectedCrew(crew);
    setCurrentView("edit-crew");
  }, []);

  const handleBackToList = () => {
    getAllEmployeesWithoutCrew();
    setCurrentView("list");
    setSelectedCrew(null);
  };

  const handleCreateCrew = async (data: CreateCrewData) => {
    const result = await createCrew(data);
    if (result) {
      await getAllEmployeesWithoutCrew();
      return true;
    }
    return false;
  };

  const handleUpdateCrew = async (data: CreateCrewData) => {
    const result = await updateCrew(selectedCrew!.id, data);
    if (result) handleBackToList();
    return result;
  };

  const handleDeleteCrew = useCallback(
    (id: number, label?: string) => {
      handleOpenDeleteDialog(id, label);
    },
    [handleOpenDeleteDialog],
  );

  const renderContent = () => {
    switch (currentView) {
      case "new-crew":
        return (
          <NewEditCrewForm
            onSubmit={handleCreateCrew}
            onCancel={handleBackToList}
            employees={employees}
          />
        );

      case "edit-crew":
        return (
          <NewEditCrewForm
            onSubmit={handleUpdateCrew}
            onCancel={handleBackToList}
            employees={employees}
            initialData={
              selectedCrew
                ? {
                    id: selectedCrew.id,
                    active: selectedCrew.active,
                    code: selectedCrew.code,
                    description: selectedCrew.description,
                    workArea: selectedCrew.workArea,
                    workers: selectedCrew.workers,
                  }
                : undefined
            }
          />
        );

      case "list":
      default:
        return (
          <>
            {/* Barra de búsqueda */}
            <SearchContainerGeneric>
              <SearchInputContainer>
                <TextFieldGeneric
                  fullWidth
                  placeholder="Buscar por codigo o area de trabajo"
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
                <ButtonGeneric
                  onClick={handleSearch}
                  disabled={searchQuery.trim().length === 0}
                >
                  Buscar
                </ButtonGeneric>
                {isSearching && (
                  <ButtonGeneric onClick={handleClearSearch}>
                    Limpiar
                  </ButtonGeneric>
                )}
              </SearchInputContainer>
            </SearchContainerGeneric>

            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : (
              <CrewTable
                crews={crews}
                onEdit={handleEditCrew}
                onDelete={handleDeleteCrew}
              />
            )}
          </>
        );
    }
  };

  return (
    <>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Eliminar cuadrilla"
        message="Esta acción eliminará permanentemente la cuadrilla. ¿Deseas continuar?"
        itemLabel={crewToDelete?.label}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />

      <HeaderGeneric>
        <TextGeneric variant="h4">Gestión de Cuadrillas</TextGeneric>
        {currentView === "list" && (
          <ButtonGeneric startIcon={<AddIcon />} onClick={handleAddCrewClick}>
            Crear Cuadrilla
          </ButtonGeneric>
        )}
      </HeaderGeneric>

      {renderContent()}
    </>
  );
};
