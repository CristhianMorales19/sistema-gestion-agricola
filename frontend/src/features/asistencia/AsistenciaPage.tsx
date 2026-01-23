// src/features/asistencia/AsistenciaPage.tsx
import React, { useMemo, useEffect } from "react";
import { RegistrarEntradaForm } from "./components/RegistrarEntradaForm";
import { useAuth0 } from "@auth0/auth0-react";
import { createAsistenciaService } from "./core/AsistenciaConfig";
import { DirectFetchWorkerSearchService } from "./core/WorkerSearchService";
import { useEntradasHoy } from "./hooks/useEntradasHoy";
import ActionLogEntradas from "./components/ActionLogEntradas";
import RegistrarSalidaForm from "./components/RegistrarSalidaForm";

import { HeaderGeneric } from "../../shared/presentation/styles/Header.styles";
import { TextGeneric } from "../../shared/presentation/styles/Text.styles";
import { Grid } from "@mui/material";

const AsistenciaPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    console.log("[AsistenciaPage] mounted");
  }, []);

  // NOTA: El backend corre típicamente en puerto 3000 mientras el frontend en 3001.
  // Antes se usaba baseUrl relativa '/api/asistencia' que apuntaba al mismo origen (3001) => 404.
  // Forzamos baseUrl inicial al backend real y dejamos fallback relative por si se configura un proxy en el futuro.
  const servicio = useMemo(
    () =>
      createAsistenciaService(() => getAccessTokenSilently().catch(() => null)),
    [getAccessTokenSilently],
  );

  const {
    items: entradasHoy,
    agregarLocal,
    actualizarSalida,
  } = useEntradasHoy(servicio);

  const workerService = useMemo(() => {
    return new DirectFetchWorkerSearchService(
      () => getAccessTokenSilently().catch(() => null),
      window.location.origin.replace(":3001", ":3000"), // heurística: frontend 3001 -> backend 3000
    );
  }, [getAccessTokenSilently]);

  return (
    <>
      <HeaderGeneric>
        <TextGeneric variant="h4">Registro de Asistencia</TextGeneric>
      </HeaderGeneric>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RegistrarEntradaForm
            service={servicio}
            workerService={workerService}
            useStaticWorkerList
            onAddEntradaLocal={(ctx) => agregarLocal(ctx)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RegistrarSalidaForm
            service={servicio}
            onSalidaRegistrada={({
              trabajadorId,
              horaSalida,
              horasTrabajadas,
            }) => {
              actualizarSalida(trabajadorId, horaSalida, horasTrabajadas);
            }}
          />
        </Grid>
      </Grid>

      <ActionLogEntradas items={entradasHoy} />
    </>
  );
};

export default AsistenciaPage;
export {};
