import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Sincroniza el estado currentView con la ruta /asistencia únicamente.
 * - Si el usuario navega directamente a /asistencia, forza setCurrentView('asistencia')
 * - Si setCurrentView('asistencia') ocurre estando en otra ruta, navega a /asistencia
 * - No toca otras vistas para evitar efectos colaterales
 */
export function useSyncAsistenciaView(currentView: string, setCurrentView: (v: string) => void) {
  const location = useLocation();
  const navigate = useNavigate();

  // Cuando cambia la URL directamente
  useEffect(() => {
    if (location.pathname === '/asistencia' && currentView !== 'asistencia') {
      setCurrentView('asistencia');
    }
  }, [location.pathname, currentView, setCurrentView]);

  // Cuando el estado cambia a asistencia por interacción interna
  useEffect(() => {
    if (currentView === 'asistencia' && location.pathname !== '/asistencia') {
      navigate('/asistencia', { replace: false });
    }
  }, [currentView, location.pathname, navigate]);
}
