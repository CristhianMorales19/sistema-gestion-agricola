import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, FormControl, MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { ProductivityTable } from "../ProductivityTable/ProductivityTable";
import { ProductivityForm } from "../ProductivityForm/NewProductivityForm";
import { UseProductivityManagement } from "../../../application/hooks/UseProductivityManagement";
import { ProductivityRecord } from "../../../domain/entities/Productivity";

import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";
import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../../shared/presentation/styles/LoadingSpinner.styles";

type ProductivityView = "list" | "new-record" | "edit-record";

export const ProductivityManagementView: React.FC = () => {
  const { productivityRecords, loading, error, fetchProductivity } =
    UseProductivityManagement();

  const [currentView, setCurrentView] = useState<ProductivityView>("list");
  const [selectedRecord, setSelectedRecord] =
    useState<ProductivityRecord | null>(null);
  const [taskFilter, setTaskFilter] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchProductivity();
  }, [fetchProductivity]);

  const handleTaskFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTaskFilter(e.target.value);
    },
    [],
  );

  const handleAddRecordClick = () => {
    setShowCreateDialog(true);
    setSelectedRecord(null);
  };

  const handleEditRecord = (record: ProductivityRecord) => {
    setSelectedRecord(record);
    setCurrentView("edit-record");
  };

  const handleBackToList = () => {
    if (showCreateDialog) setShowCreateDialog(false);
    setCurrentView("list");
    setSelectedRecord(null);
    fetchProductivity();
  };

  const handleCreateRecord = async (data: any) => {
    await fetchProductivity();
    setCurrentView("list");
  };

  const handleUpdateRecord = async (data: any) => {
    if (!selectedRecord) return;
    await fetchProductivity();
    setCurrentView("list");
    setSelectedRecord(null);
  };

  const filteredRecords = taskFilter
    ? productivityRecords.filter((r) => r.task.id === taskFilter)
    : productivityRecords;

  const renderContent = () => {
    switch (currentView) {
      case "edit-record":
        return (
          <ProductivityForm
            open={showCreateDialog}
            records={productivityRecords}
            onSubmit={handleUpdateRecord}
            onCancel={handleBackToList}
            initialData={
              selectedRecord
                ? {
                    workerId: selectedRecord.worker.id,
                    taskId: selectedRecord.task.id,
                    producedQuantity: selectedRecord.producedQuantity,
                    date: selectedRecord.date,
                  }
                : undefined
            }
          />
        );

      case "list":
      default:
        return (
          <>
            {/* Filtros */}
            <Box sx={{ maxWidth: 500, pb: 5, margin: "0 auto" }}>
              <FormControl fullWidth size="small">
                <TextFieldGeneric
                  select
                  value={taskFilter}
                  onChange={handleTaskFilterChange}
                  label="Filtrar por tareas"
                >
                  <MenuItem value="">Todas las tareas</MenuItem>
                  {Array.from(
                    new Map(
                      productivityRecords.map((r) => [r.task.id, r.task]),
                    ).values(),
                  ).map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name}
                    </MenuItem>
                  ))}
                </TextFieldGeneric>
              </FormControl>
            </Box>

            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            ) : (
              <ProductivityTable
                records={filteredRecords}
                onEdit={handleEditRecord}
              />
            )}
          </>
        );
    }
  };

  if (error && currentView === "list") {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <ProductivityForm
        open={showCreateDialog}
        records={productivityRecords}
        onSubmit={handleCreateRecord}
        onCancel={handleBackToList}
      />

      <HeaderGeneric>
        <TextGeneric variant="h4">Gestión de Productividad</TextGeneric>

        <Box sx={{ display: "flex", g: 2 }}>
          <ButtonGeneric
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRecordClick}
          >
            Nuevo Registro
          </ButtonGeneric>
        </Box>
      </HeaderGeneric>

      {renderContent()}
    </>
  );
};
