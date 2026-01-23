import React, { useState, useCallback, useEffect } from "react";
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { EmployeeTable } from "./EmployeeTable/EmployeeTable";
import { NewEmployeeForm } from "./EmployeeForm/NewEmployeeForm";
import { LaborInfoView } from "./EmployeeLaborInfoForm/LaborInfoView";
import { useEmployeeManagement } from "../../application/hooks/use-employee-management";
import {
  CreateEmployeeData,
  Employee,
  EditEmployeeData,
} from "../../domain/entities/employee";
import {
  HeaderButtonContainer,
  SearchMessage,
  SelectedEmployeeMessage,
} from "./EmployeeManagementView.styles";
import { InputAdornment } from "@mui/material";
import { ButtonGeneric } from "../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../shared/presentation/styles/Text.styles";
import { ConfirmDeleteDialog } from "../../../../shared/presentation/components/ui/confirmDialog/ConfirmDeleteDialog";
import {
  SearchContainerGeneric,
  SearchInputContainer,
  StyledSearchIcon,
} from "../../../../shared/presentation/styles/SearchContainer.styles";

import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../shared/presentation/styles/LoadingSpinner.styles";
import { LaborInfoData } from "@features/personnel-management/domain/entities/labor-info-employee";
import { EditEmployeeForm } from "./EmployeeEdit/EditEmployeeForm";

type EmployeeView = "list" | "labor-info" | "edit";

const DEFAULT_EMPLOYEE = {
  id: 0,
  identification: "",
  name: "",
};

interface SelectedEmployee {
  id: number;
  identification: string;
  name: string;
}

interface EmployeeToDelete extends SelectedEmployee {}

export const EmployeeManagementView = () => {
  const {
    employees,
    loading,
    deleteEmployee,
    searchEmployees,
    refreshEmployees,
    createEmployee,
    createLaborInfo,
    updateEmployee,
  } = useEmployeeManagement();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentView, setCurrentView] = useState<EmployeeView>("list");
  const [selectedEmployee, setSelectedEmployee] =
    useState<SelectedEmployee>(DEFAULT_EMPLOYEE);
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeToDelete>(DEFAULT_EMPLOYEE);

  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length > 0) {
      setSelectedEmployee(DEFAULT_EMPLOYEE);
      setIsSearching(true);
      await searchEmployees(searchQuery.trim());
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    setIsSearching(false);
    setSelectedEmployee(DEFAULT_EMPLOYEE);
    await refreshEmployees();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddLaborInfo = useCallback(() => {
    if (selectedEmployee) {
      setCurrentView("labor-info");
    }
  }, [selectedEmployee]);

  const handleAddEmployeeClick = useCallback(() => {
    setShowCreateDialog(true);
    setSelectedEmployee(DEFAULT_EMPLOYEE);
  }, []);

  const handleBackToList = useCallback(() => {
    if (showCreateDialog) setShowCreateDialog(false);
    setCurrentView("list");
    setSelectedEmployee(DEFAULT_EMPLOYEE);
  }, [showCreateDialog]);

  const handleCreateEmployee = async (data: CreateEmployeeData) => {
    return await createEmployee(data);
  };

  const handleEdit = useCallback((employee: Employee) => {
    setSelectedEmployee({
      id: employee.id,
      identification: employee.identification,
      name: employee.name,
    });
    setCurrentView("edit");
  }, []);

  const handleEmployeeSelect = useCallback((employee: Employee) => {
    setSelectedEmployee({
      id: employee.id,
      identification: employee.identification,
      name: employee.name,
    });
  }, []);

  const handleSaveLaborInfo = async (laborData: LaborInfoData) => {
    const result = await createLaborInfo(selectedEmployee.id, laborData);
    if (result) handleBackToList();
  };

  const handleUpdateEmployee = useCallback(
    async (id: number, data: EditEmployeeData): Promise<void> => {
      const result = await updateEmployee(id, data);
      if (result) handleBackToList();
    },
    [updateEmployee, handleBackToList],
  );

  const handleConfirmDelete = useCallback(async () => {
    const result = await deleteEmployee(selectedEmployee.id);
    if (result) {
      setEmployeeToDelete(DEFAULT_EMPLOYEE);
      setDeleteDialogOpen(false);
    }
  }, [deleteEmployee, selectedEmployee]);

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(DEFAULT_EMPLOYEE);
  };

  const handleDelete = useCallback((employee: Employee) => {
    setEmployeeToDelete({
      id: employee.id,
      identification: employee.identification,
      name: employee.name,
    });
    setDeleteDialogOpen(true);
  }, []);

  // Renderizar contenido basado en la vista actual
  const renderContent = () => {
    switch (currentView) {
      case "labor-info":
        return (
          <LaborInfoView
            employee={selectedEmployee}
            onCancel={handleBackToList}
            onSave={handleSaveLaborInfo}
          />
        );

      case "edit":
        return (
          <EditEmployeeForm
            employeeId={selectedEmployee.id}
            onSave={handleUpdateEmployee}
            onCancel={handleBackToList}
          />
        );

      case "list":
      default:
        return (
          <>
            <SearchContainerGeneric>
              <SearchInputContainer>
                <TextFieldGeneric
                  fullWidth
                  placeholder="Buscar por cédula, nombre o cargo"
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

              {isSearching && (
                <SearchMessage variant="body2">
                  Mostrando resultados para: "{searchQuery}"
                </SearchMessage>
              )}

              {selectedEmployee.id !== 0 && (
                <SelectedEmployeeMessage variant="body2">
                  Empleado seleccionado: {selectedEmployee.name}
                </SelectedEmployeeMessage>
              )}
            </SearchContainerGeneric>

            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : (
              <EmployeeTable
                employees={employees}
                selectedEmployeeId={selectedEmployee.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSelect={handleEmployeeSelect}
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
        title="Eliminar empleado"
        message="Esta acción eliminará permanentemente al empleado. ¿Deseas continuar?"
        itemLabel={`${employeeToDelete.name} - ${employeeToDelete.identification}`}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />

      <NewEmployeeForm
        open={showCreateDialog}
        onSubmit={handleCreateEmployee}
        onCancel={handleBackToList}
      />

      <HeaderGeneric>
        <TextGeneric variant="h4">Gestión de Personal</TextGeneric>

        {currentView === "list" && (
          <HeaderButtonContainer>
            {/* <ButtonGeneric
              startIcon={<PersonAddIcon />}
              onClick={handleAddLaborInfo}
              disabled={selectedEmployee.id === 0}
            >
              Agregar Info Laboral
            </ButtonGeneric> */}
            <ButtonGeneric
              startIcon={<AddIcon />}
              onClick={handleAddEmployeeClick}
            >
              Crear Empleado
            </ButtonGeneric>
          </HeaderButtonContainer>
        )}
      </HeaderGeneric>

      {/* Contenido dinámico */}
      {renderContent()}
    </>
  );
};
