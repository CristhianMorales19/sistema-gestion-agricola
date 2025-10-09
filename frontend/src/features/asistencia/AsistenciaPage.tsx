// src/features/asistencia/AsistenciaPage.tsx
import React, { useMemo, useEffect } from 'react';
import { RegistrarEntradaForm } from './components/RegistrarEntradaForm';
import { AsistenciaService } from './services/AsistenciaService';
import { useAuth0 } from '@auth0/auth0-react';
import { createAsistenciaService } from './core/AsistenciaConfig';
import { DirectFetchWorkerSearchService } from './core/WorkerSearchService';
import { useEntradasHoy } from './hooks/useEntradasHoy';
import ActionLogEntradas from './components/ActionLogEntradas';
import RegistrarSalidaForm from './components/RegistrarSalidaForm';
import { colors } from './theme/asistenciaStyles';

const AsistenciaPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    console.log('[AsistenciaPage] mounted');
  }, []);

  // NOTA: El backend corre típicamente en puerto 3000 mientras el frontend en 3001.
  // Antes se usaba baseUrl relativa '/api/asistencia' que apuntaba al mismo origen (3001) => 404.
  // Forzamos baseUrl inicial al backend real y dejamos fallback relative por si se configura un proxy en el futuro.
  const servicio = useMemo(
    () => createAsistenciaService(() => getAccessTokenSilently().catch(() => null)),
    [getAccessTokenSilently]
  );

  const { items: entradasHoy, agregarLocal, actualizarSalida } = useEntradasHoy(servicio);

  const workerService = useMemo(() => {
    return new DirectFetchWorkerSearchService(
      () => getAccessTokenSilently().catch(() => null),
      window.location.origin.replace(':3001', ':3000') // heurística: frontend 3001 -> backend 3000
    );
  }, [getAccessTokenSilently]);

  return (
    <div style={{ backgroundColor: colors.bgPage, minHeight: '100vh', padding: '32px 32px 48px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 8, color: colors.textPrimary }}>Registro de Asistencia</h1>
        <p style={{ margin: '0 0 24px', color: colors.textSecondary, fontSize: 14 }}>
          Registra entradas. Si no hay conexión, se guardará offline y se sincronizará más tarde.
        </p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <RegistrarEntradaForm
            service={servicio}
            workerService={workerService}
            useStaticWorkerList
            onAddEntradaLocal={(ctx) => agregarLocal(ctx)}
          />
          <RegistrarSalidaForm
            service={servicio}
            onSalidaRegistrada={({ trabajadorId, horaSalida, horasTrabajadas }) => {
              actualizarSalida(trabajadorId, horaSalida, horasTrabajadas);
            }}
          />
        </div>
        <ActionLogEntradas items={entradasHoy} />
      </div>
    </div>
  );
};

export default AsistenciaPage;
export {};