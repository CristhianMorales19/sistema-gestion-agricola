import React, { useCallback, useState } from "react";
import { Alert, MenuItem, Grid, Box } from "@mui/material";
import { AsistenciaService } from "../services/AsistenciaService";
import { useRegistroSalida } from "../hooks/useRegistroSalida";

import {
  FormContainer,
  GridItem,
  ButtonContainer,
  InputSection,
} from "../../../shared/presentation/styles/Form.styles";
import { ButtonGeneric } from "../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../shared/presentation/styles/TextField.styles";
import { TextGeneric } from "../../../shared/presentation/styles/Text.styles";

interface RegistrarSalidaFormProps {
  service: AsistenciaService;
  onSalidaRegistrada?: (payload: {
    trabajadorId: number;
    horaSalida: string;
    horasTrabajadas: number | null;
  }) => void;
}

export const RegistrarSalidaForm: React.FC<RegistrarSalidaFormProps> = ({
  service,
  onSalidaRegistrada,
}) => {
  const { pendientes, registrarSalida, loading, error, mensaje } =
    useRegistroSalida(service);
  // Se restringe a tipos soportados por badgeSx; 'warning' se normaliza a 'error' o 'info'
  type HistTipo = "success" | "error" | "info";
  const [historial, setHistorial] = useState<
    Array<{ tipo: HistTipo; msg: string; ts: number }>
  >([]);
  const [trabajadorId, setTrabajadorId] = useState<number | "">("");
  const [horaSalida, setHoraSalida] = useState("");
  const [observacion, setObservacion] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!trabajadorId) return;
      try {
        const resultado = await registrarSalida({
          trabajadorId: Number(trabajadorId),
          horaSalida: horaSalida || undefined,
          observacion: observacion || undefined,
        });
        setHistorial((h) =>
          [
            {
              tipo: "success" as HistTipo,
              msg: `Salida registrada (${resultado.horaSalida})`,
              ts: Date.now(),
            },
            ...h,
          ].slice(0, 30),
        );
        if (resultado && onSalidaRegistrada) {
          onSalidaRegistrada({
            trabajadorId: resultado.trabajadorId,
            horaSalida: resultado.horaSalida,
            horasTrabajadas: resultado.horasTrabajadas,
          });
        }
        setTrabajadorId("");
        setHoraSalida("");
        setObservacion("");
      } catch (e: any) {
        setHistorial((h) =>
          [
            {
              tipo: "error" as HistTipo,
              msg: e.message || "Error",
              ts: Date.now(),
            },
            ...h,
          ].slice(0, 30),
        );
      }
    },
    [
      trabajadorId,
      horaSalida,
      observacion,
      registrarSalida,
      onSalidaRegistrada,
    ],
  );

  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing(1.5),
        boxShadow: `
              5px 5px 5px ${theme.palette.primary.main}30,
              inset 0 1px 0 ${theme.palette.surface.light}
            `,
        borderRadius: theme.shape.borderRadius * 0.5,
        border: `1px solid ${theme.palette.surface.light}80`,
      })}
    >
      <FormContainer component="form" onSubmit={handleSubmit}>
        <TextGeneric variant="h6">Registro de Salida</TextGeneric>

        <InputSection>
          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                select
                fullWidth
                label="Trabajador (con entrada)"
                size="small"
                value={trabajadorId}
                onChange={(e) =>
                  setTrabajadorId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              >
                <MenuItem value="">
                  <em>Seleccione</em>
                </MenuItem>
                {pendientes.map((p) => (
                  <MenuItem key={p.trabajadorId} value={p.trabajadorId}>
                    {p.documento_identidad} - {p.nombre_completo} (In:{" "}
                    {p.horaEntrada})
                  </MenuItem>
                ))}
              </TextFieldGeneric>
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                fullWidth
                label="Hora Salida (opcional)"
                type="time"
                size="small"
                value={horaSalida}
                onChange={(e) => setHoraSalida(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </GridItem>

            <GridItem item xs={12} sm={12}>
              <TextFieldGeneric
                fullWidth
                label="Observación (opcional)"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                size="small"
              />
            </GridItem>
          </Grid>
        </InputSection>

        <ButtonContainer>
          <ButtonGeneric
            type="submit"
            variant="contained"
            disabled={loading || !trabajadorId}
          >
            {loading ? "Cargando..." : "Registrar Salida"}
          </ButtonGeneric>
        </ButtonContainer>
      </FormContainer>

      {mensaje && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}
      {error && (
        <Alert
          severity={error.startsWith("⚠️") ? "warning" : "error"}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default RegistrarSalidaForm;
