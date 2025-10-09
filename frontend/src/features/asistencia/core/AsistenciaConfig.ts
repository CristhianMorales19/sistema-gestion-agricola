import { AsistenciaService } from '../services/AsistenciaService';

// Punto único de construcción para favorecer Open/Closed y aislar lógica de resolución de URLs.
function resolveBackendOrigin(): string {
  const env = (process.env.REACT_APP_BACKEND_ORIGIN || '').trim();
  const candidates = [env, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);
  return candidates[0];
}

export function createAsistenciaService(getToken: () => Promise<string | null>) {
  const origin = resolveBackendOrigin();
  return new AsistenciaService({
    baseUrl: `${origin}/api/asistencia`,
    fallbackBaseUrls: [
      '/api/asistencia' // permite proxy futuro sin editar código existente
    ],
    getToken
  });
}

export const asistenciaConfig = {
  resolveBackendOrigin
};
