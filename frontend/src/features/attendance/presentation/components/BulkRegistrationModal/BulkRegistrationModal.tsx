import React, { useState } from "react";
import { toast } from "sonner";
import {
  LocationParcelSelector,
  LocationValue,
  getLocationString,
  isLocationValid,
} from "../LocationParcelSelector";
import { useParcelsForAttendance } from "../../../application/hooks/useParcelsForAttendance";
import { getCurrentTimeHHMM } from "../../../application/utils/dateUtils";

import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";
import { BackButtonGeneric } from "../../../../../shared/presentation/styles/BackButton.styles";
import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";

import {
  FormContainer,
  GridItem,
  StyledArrowBackIcon,
} from "../../../../../shared/presentation/styles/Form.styles";

import {
  GlassDialog,
  SlideTransition,
} from "../../../../../shared/presentation/styles/Dialog.styles";
import {
  Alert,
  Box,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";

interface BulkRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    type: "entrada" | "salida",
    time: string,
    location?: string,
  ) => Promise<void>;
  totalWorkers: number;
  workersWithEntry?: number;
  workersWithoutEntry?: number;
  workersWithExit?: number;
}

export const BulkRegistrationModal: React.FC<BulkRegistrationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalWorkers,
  workersWithEntry = 0,
  workersWithoutEntry = 0,
  workersWithExit = 0,
}) => {
  const [type, setType] = useState<"entrada" | "salida">("entrada");
  const [time, setTime] = useState(getCurrentTimeHHMM());
  const [locationValue, setLocationValue] = useState<LocationValue>({
    type: "parcel",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook para obtener parcelas
  const { parcels, loading: loadingParcels } = useParcelsForAttendance();

  const handleConfirm = async () => {
    try {
      setError(null);

      if (!time) {
        setError("Por favor ingresa la hora");
        return;
      }

      // Validar ubicación solo para entrada
      if (type === "entrada" && !isLocationValid(locationValue, true)) {
        setError("Por favor selecciona o ingresa la ubicación/parcela");
        return;
      }

      const locationFinal =
        type === "entrada" ? getLocationString(locationValue) : undefined;

      setLoading(true);
      await Promise.resolve(onConfirm(type, time, locationFinal));

      // Reset
      setTime(getCurrentTimeHHMM());
      setLocationValue({ type: "parcel" });
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const hasWarning =
    type === "entrada" ? workersWithEntry > 0 : workersWithExit > 0;
  const noEntryWarning = type === "salida" ? workersWithoutEntry > 0 : false;

  const warningMessage =
    type === "entrada"
      ? `${workersWithEntry} ya ${workersWithEntry === 1 ? "tiene" : "tienen"} entrada registrada`
      : `${workersWithExit} ya ${workersWithExit === 1 ? "tiene" : "tienen"} salida registrada`;

  const noEntryMessage = `${workersWithoutEntry} ${workersWithoutEntry === 1 ? "no tiene" : "no tienen"} entrada registrada (no se registrará salida)`;

  const workersToProcess =
    type === "entrada"
      ? totalWorkers - workersWithEntry
      : totalWorkers - workersWithExit;

  // Validar si el botón de confirmar debe estar habilitado
  const isConfirmDisabled =
    loading ||
    !time ||
    (type === "entrada" && !isLocationValid(locationValue, true));

  return (
    <GlassDialog
      open={isOpen}
      TransitionComponent={SlideTransition}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <FormContainer>
          <TextGeneric variant="h6">Registro Masivo</TextGeneric>

          {/* Total Count */}
          <Box>
            <Box
              p={2}
              borderRadius={2}
              border={1}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.dark + "22",
                borderColor: theme.palette.primary.dark + "55",
              })}
            >
              <Typography variant="body2" color="primary.light">
                <strong>
                  {totalWorkers} trabajador
                  {totalWorkers !== 1 ? "es" : ""} total
                </strong>
              </Typography>

              {hasWarning && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {warningMessage}
                </Alert>
              )}

              {noEntryWarning && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {noEntryMessage}
                </Alert>
              )}
            </Box>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Tipo de Registro
          </Typography>

          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              <ButtonGeneric
                fullWidth
                onClick={() => {
                  setType("entrada");
                  setError(null);
                }}
                disabled={type === "entrada"}
              >
                Entrada
              </ButtonGeneric>
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <ButtonGeneric
                fullWidth
                onClick={() => {
                  setType("salida");
                  setError(null);
                }}
                disabled={type === "salida"}
              >
                Salida
              </ButtonGeneric>
            </GridItem>

            <GridItem item xs={12}>
              <TextFieldGeneric
                fullWidth
                label="Hora"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={loading}
                required
              />
            </GridItem>

            {type === "entrada" && (
              <GridItem item xs={12}>
                <LocationParcelSelector
                  parcels={parcels}
                  loadingParcels={loadingParcels}
                  value={locationValue}
                  onChange={setLocationValue}
                  disabled={loading}
                  required
                />
              </GridItem>
            )}
          </Grid>
        </FormContainer>
      </DialogContent>

      <DialogActions>
        <BackButtonGeneric
          onClick={onClose}
          disabled={loading}
          startIcon={<StyledArrowBackIcon />}
        >
          Cancelar
        </BackButtonGeneric>

        <ButtonGeneric onClick={handleConfirm} disabled={isConfirmDisabled}>
          {loading ? "Cargando..." : "Guardar"}
        </ButtonGeneric>
      </DialogActions>
    </GlassDialog>
  );
};
