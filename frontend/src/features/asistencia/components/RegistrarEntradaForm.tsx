import React, { useCallback, useState } from "react";
import { Box, Alert, Grid, InputAdornment } from "@mui/material";
import { useAsistencia } from "../hooks/useAsistencia";
import { AsistenciaService } from "../services/AsistenciaService";
import { WorkerSelect } from "./WorkerSelect";
import { WorkerSelectStatic } from "./WorkerSelectStatic";
import GeolocationButton from "./GeolocationButton";
import ActionLog from "./ActionLog";
import { WorkerSearchService, Trabajador } from "../core/WorkerSearchService";

import {
  FormContainer,
  GridItem,
  ButtonContainer,
  InputSection,
} from "../../../shared/presentation/styles/Form.styles";
import { ButtonGeneric } from "../../../shared/presentation/styles/Button.styles";
import { TextFieldGeneric } from "../../../shared/presentation/styles/TextField.styles";
import { TextGeneric } from "../../../shared/presentation/styles/Text.styles";

interface RegistrarEntradaFormProps {
  service: AsistenciaService; // inyectar para cumplir Demeter
  workerService: WorkerSearchService; // principio de inversión de dependencias (legacy autocomplete)
  useStaticWorkerList?: boolean; // nuevo modo lista estática desde módulo asistencia
  onAddEntradaLocal?: (ctx: {
    trabajador: Trabajador;
    dto: any;
    offline: boolean;
    resultado?: any;
  }) => void; // para log persistente
}

export const RegistrarEntradaForm: React.FC<RegistrarEntradaFormProps> = ({
  service,
  workerService,
  useStaticWorkerList = true,
  onAddEntradaLocal,
}) => {
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] =
    useState<Trabajador | null>(null);
  const { registrarEntrada, loading, error, mensaje, historial } =
    useAsistencia({
      service,
      onAfterRegistro: ({ data }) => {
        if (trabajadorSeleccionado) {
          // Integración con log persistente
          if (onAddEntradaLocal) {
            onAddEntradaLocal({
              trabajador: trabajadorSeleccionado,
              dto: data,
              offline: false,
            });
          }
          const etiqueta = `${
            trabajadorSeleccionado.documento_identidad ||
            trabajadorSeleccionado.trabajador_id
          } - ${trabajadorSeleccionado.nombre_completo}`;
          return [
            { tipo: "info" as const, mensaje: `Trabajador: ${etiqueta}` },
          ];
        }
      },
    });
  const [trabajadorId, setTrabajadorId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(
    () => new Date().toISOString().split("T")[0],
  );
  const [horaEntrada, setHoraEntrada] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [geoPreview, setGeoPreview] = useState<string>("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!trabajadorId) return;
      await registrarEntrada({
        trabajadorId: Number(trabajadorId),
        fecha: fecha || undefined,
        horaEntrada: horaEntrada || undefined,
        ubicacion: ubicacion || undefined,
      });
      // Si se guardó offline no lo sabemos aquí porque hook maneja; idealmente hook pase flag.
      // Como mejora futura: extender callback para incluir offline flag real.
    },
    [trabajadorId, fecha, horaEntrada, ubicacion, registrarEntrada],
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
        <TextGeneric variant="h6">Registro de Entrada</TextGeneric>

        <InputSection>
          <Grid container spacing={3}>
            <GridItem item xs={12} sm={6}>
              {useStaticWorkerList ? (
                <WorkerSelectStatic
                  service={service}
                  value={trabajadorId}
                  onChange={(id, meta) => {
                    setTrabajadorId(id);
                    setTrabajadorSeleccionado(
                      meta
                        ? ({
                            trabajador_id: meta.trabajador_id,
                            documento_identidad: meta.documento_identidad,
                            nombre_completo: meta.nombre_completo,
                            // campos dummy para compatibilidad mínima
                            fecha_nacimiento: "",
                            estado: "activo",
                            created_at: new Date(),
                          } as any)
                        : null,
                    );
                  }}
                />
              ) : (
                <WorkerSelect
                  value={trabajadorId}
                  onChange={(id, trabajador) => {
                    setTrabajadorId(id);
                    setTrabajadorSeleccionado(trabajador || null);
                  }}
                  label="Trabajador"
                  service={workerService}
                />
              )}
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                label="Fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                label="Hora Entrada (opcional)"
                type="time"
                value={horaEntrada}
                onChange={(e) => setHoraEntrada(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </GridItem>

            <GridItem item xs={12} sm={6}>
              <TextFieldGeneric
                label="Ubicación (opcional)"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <GeolocationButton
                        onLocation={(_lat, _lng, formatted) => {
                          setGeoPreview(formatted);
                          setUbicacion((prev) =>
                            prev ? `${prev} | ${formatted}` : formatted,
                          );
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              {/* {geoPreview && (
              <Typography variant="caption" color="text.secondary">
                {geoPreview}
              </Typography>
            )} */}
            </GridItem>
          </Grid>
        </InputSection>

        <ButtonContainer>
          <ButtonGeneric
            type="submit"
            variant="contained"
            disabled={loading || !trabajadorId}
          >
            {loading ? "Cargando..." : "Registrar Entrada"}
          </ButtonGeneric>
        </ButtonContainer>
      </FormContainer>
      {mensaje && (
        <Alert
          severity={mensaje.startsWith("✔️") ? "success" : "info"}
          sx={{ mb: 2 }}
        >
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
      <ActionLog items={historial} />
    </Box>
  );
};
