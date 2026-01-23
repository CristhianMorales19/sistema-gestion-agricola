// src/absence-management/presentation/components/AbsenceManagementView/AbsenceManagementView.tsx
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { RegistrarAusencia } from "../RegistrarAusencia";
import { AbsenceTable } from "../AbsenceTable";
import { DocumentViewer } from "../DocumentViewer";
import { useAbsenceManagement } from "../../../application/hooks/useAbsenceManagement";
import { CreateAbsenceData, Absence } from "../../../domain/entities/Absence";

import { ButtonGeneric } from "../../../../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../../../../shared/presentation/styles/TextField.styles";
import { HeaderGeneric } from "../../../../../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../../../../../shared/presentation/styles/Text.styles";
import { ConfirmDeleteDialog } from "../../../../../../shared/presentation/components/ui/confirmDialog/ConfirmDeleteDialog";
import {
  SearchContainerGeneric,
  SearchInputContainer,
  StyledSearchIcon,
} from "../../../../../../shared/presentation/styles/SearchContainer.styles";

import {
  LoadingSpinner,
  LoadingContainer,
} from "../../../../../../shared/presentation/styles/LoadingSpinner.styles";

import {
  GlassDialog,
  SlideTransition,
} from "../../../../../../shared/presentation/styles/Dialog.styles";
import { AbsenceStats } from "../Stats/AbsenceStats";

type ViewMode = "list" | "register";

export const AbsenceManagementView: React.FC = () => {
  const {
    absences,
    loading,
    error,
    successMessage,
    stats,
    registerAbsence,
    deleteAbsence,
    approveAbsence,
    rejectAbsence,
    uploadDocument,
    refreshAbsences,
    clearMessages,
  } = useAbsenceManagement();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  /**
   * Manejar registro de nueva ausencia
   */
  const handleRegisterAbsence = useCallback(
    async (data: CreateAbsenceData, documento?: File) => {
      try {
        const newAbsence = await registerAbsence(data);

        // Si hay documento, subirlo (verificación estricta)
        if (documento && documento instanceof File && newAbsence.id) {
          console.log("📎 Subiendo documento:", documento.name, documento.size);
          await uploadDocument(newAbsence.id, documento);
        } else {
          console.log("📝 No hay documento para subir o ausencia sin ID");
        }

        setViewMode("list");
      } catch (error) {
        console.error("Error al registrar ausencia:", error);
      }
    },
    [registerAbsence, uploadDocument],
  );

  /**
   * Manejar búsqueda
   */
  const handleSearch = useCallback(async () => {
    // Por ahora, simplemente refresca los datos
    // TODO: Implementar filtros más específicos
    await refreshAbsences();
  }, [refreshAbsences]);

  /**
   * Manejar aprobación
   */
  const handleApprove = useCallback(
    async (id: string) => {
      try {
        // TODO: Obtener supervisor_id del contexto de autenticación
        const supervisorId = 1; // Temporal
        await approveAbsence(id, supervisorId, "Aprobado");
      } catch (error) {
        console.error("Error al aprobar ausencia:", error);
      }
    },
    [approveAbsence],
  );

  /**
   * Manejar rechazo
   */
  const handleReject = useCallback(
    async (id: string) => {
      try {
        // TODO: Obtener supervisor_id del contexto de autenticación
        const supervisorId = 1; // Temporal
        await rejectAbsence(id, supervisorId, "Rechazado");
      } catch (error) {
        console.error("Error al rechazar ausencia:", error);
      }
    },
    [rejectAbsence],
  );

  /**
   * Manejar eliminación
   */
  const handleDeleteClick = useCallback((id: string) => {
    setAbsenceToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (absenceToDelete) {
      try {
        await deleteAbsence(absenceToDelete);
        setShowDeleteConfirm(false);
        setAbsenceToDelete(null);
      } catch (error) {
        console.error("Error al eliminar ausencia:", error);
      }
    }
  }, [absenceToDelete, deleteAbsence]);

  /**
   * Manejar vista de detalles
   */
  const handleViewDetails = useCallback((absence: Absence) => {
    setSelectedAbsence(absence);
    setShowDetailsDialog(true);
  }, []);

  /**
   * Manejar vista de documento
   */
  const handleViewDocument = useCallback((absence: Absence) => {
    // Ya no se usa - el documento se ve en detalles
  }, []);

  return (
    <>
      <ConfirmDeleteDialog
        open={showDeleteConfirm}
        title="Eliminar ausencia"
        message="Esta acción eliminará permanentemente la ausencia. ¿Deseas continuar?"
        itemLabel={`${absenceToDelete}`}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        loading={loading}
      />

      <RegistrarAusencia
        open={showCreateDialog}
        onSubmit={handleRegisterAbsence}
        onCancel={() => setShowCreateDialog(false)}
        loading={loading}
      />

      <HeaderGeneric>
        <TextGeneric variant="h4">
          Gestión de Ausencias Justificadas
        </TextGeneric>

        <Box sx={{ display: "flex", gap: 2 }}>
          <ButtonGeneric
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
          >
            Nueva Ausencia
          </ButtonGeneric>
          <ButtonGeneric startIcon={<RefreshIcon />} onClick={refreshAbsences}>
            Actualizar
          </ButtonGeneric>
        </Box>
      </HeaderGeneric>

      {stats && <AbsenceStats stats={stats} />}

      <SearchContainerGeneric>
        <SearchInputContainer>
          <TextFieldGeneric
            fullWidth
            placeholder="Buscar ausencias"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
            //disabled={searchQuery.trim().length === 0}
          >
            Buscar
          </ButtonGeneric>
        </SearchInputContainer>
      </SearchContainerGeneric>

      {/* Tabla de Ausencias */}
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <AbsenceTable
          absences={absences}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDeleteClick}
          onView={handleViewDetails}
          showActions
        />
      )}

      <GlassDialog
        open={showDetailsDialog}
        TransitionComponent={SlideTransition}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <TextGeneric variant="h6">Detalles de la Ausencia</TextGeneric>

        <DialogContent>
          {selectedAbsence && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                  Trabajador:
                </Typography>
                <Typography>{selectedAbsence.trabajador_nombre}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                  Documento:
                </Typography>
                <Typography>{selectedAbsence.trabajador_documento}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                  Fecha de Ausencia:
                </Typography>
                <Typography>
                  {new Date(
                    selectedAbsence.fecha_ausencia,
                  ).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                  Motivo:
                </Typography>
                <Typography>
                  {selectedAbsence.motivo_personalizado ||
                    selectedAbsence.motivo}
                </Typography>
              </Box>
              {selectedAbsence.comentarios && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                    Comentarios:
                  </Typography>
                  <Typography>{selectedAbsence.comentarios}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
                  Estado:
                </Typography>
                <Typography>{selectedAbsence.estado}</Typography>
              </Box>

              {/* Documentación de Respaldo */}
              {selectedAbsence.documentacion_respaldo && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#94a3b8", mb: 2 }}
                  >
                    Documentación de Respaldo:
                  </Typography>
                  <DocumentViewer
                    absenceId={selectedAbsence.id}
                    documentPath={selectedAbsence.documentacion_respaldo}
                    onError={(error) => {
                      console.error("Error loading document:", error);
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <ButtonGeneric onClick={() => setShowDetailsDialog(false)}>
            Cerrar
          </ButtonGeneric>
        </DialogActions>
      </GlassDialog>
    </>
  );
};
