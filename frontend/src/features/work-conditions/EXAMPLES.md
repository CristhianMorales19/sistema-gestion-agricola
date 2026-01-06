/**
 * Ejemplo de integración del módulo Work Conditions
 * en un dashboard o página
 */

import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  WorkConditionsView,
  useWorkConditions,
  WorkConditionsService,
} from '@features/work-conditions';

/**
 * Ejemplo 1: Uso básico con hook
 */
export const BasicExample: React.FC = () => {
  const { conditions, addCondition, error } = useWorkConditions([]);

  const handleSubmit = (data: any) => {
    const success = addCondition(data);
    if (success) {
      console.log('✔️ Condición registrada:', data);
    } else {
      console.error('❌ Error:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#0f172a', p: 4, minHeight: '100vh' }}>
      <WorkConditionsView
        onSubmit={handleSubmit}
        conditions={conditions}
      />
    </Box>
  );
};

/**
 * Ejemplo 2: Uso con análisis de datos
 */
export const AnalyticsExample: React.FC = () => {
  const { conditions, addCondition, getStats } = useWorkConditions([
    {
      fecha: '2025-12-20',
      condicionGeneral: 'despejado',
      nivelDificultad: 'normal',
    },
    {
      fecha: '2025-12-21',
      condicionGeneral: 'lluvioso',
      nivelDificultad: 'dificil',
    },
    {
      fecha: '2025-12-22',
      condicionGeneral: 'muy_caluroso',
      nivelDificultad: 'muy_dificil',
    },
  ]);

  const stats = getStats();

  const handleSubmit = (data: any) => {
    addCondition(data);
  };

  return (
    <Box sx={{ backgroundColor: '#0f172a', p: 4, minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Main form and calendar */}
        <Grid item xs={12} md={8}>
          <WorkConditionsView
            onSubmit={handleSubmit}
            conditions={conditions}
          />
        </Grid>

        {/* Statistics panel */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}
            >
              Estadísticas
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Total de registros:
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: '#10b981', fontWeight: 'bold' }}
              >
                {stats.totalRegistros}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Dificultad promedio:
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color:
                    stats.dificultadPromedio === 'Normal'
                      ? '#10b981'
                      : stats.dificultadPromedio === 'Difícil'
                      ? '#f97316'
                      : '#ef4444',
                  fontWeight: 'bold',
                }}
              >
                {stats.dificultadPromedio}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Condiciones registradas:
              </Typography>
              {Object.entries(stats.condicionesPorTipo).map(([tipo, count]) => (
                <Box
                  key={tipo}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 0.5,
                    color: '#e2e8f0',
                  }}
                >
                  <Typography variant="caption">
                    {WorkConditionsService.getConditionIcon(tipo)} {tipo}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

/**
 * Ejemplo 3: Uso con validación personalizada
 */
export const ValidatedExample: React.FC = () => {
  const [conditions, setConditions] = React.useState([]);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  const handleSubmit = (data: any) => {
    const validation = WorkConditionsService.validateWorkCondition(data);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setConditions((prev) => {
      const existing = prev.findIndex((c) => c.fecha === data.fecha);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = data;
        return updated;
      }
      return [...prev, data];
    });

    setValidationErrors([]);
  };

  return (
    <Box sx={{ backgroundColor: '#0f172a', p: 4, minHeight: '100vh' }}>
      {validationErrors.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: '#7f1d1d',
            borderRadius: 1,
            border: '1px solid #dc2626',
          }}
        >
          {validationErrors.map((error, idx) => (
            <Typography
              key={idx}
              variant="body2"
              sx={{ color: '#fca5a5', mb: idx < validationErrors.length - 1 ? 1 : 0 }}
            >
              • {error}
            </Typography>
          ))}
        </Box>
      )}

      <WorkConditionsView
        onSubmit={handleSubmit}
        conditions={conditions}
      />
    </Box>
  );
};

/**
 * Ejemplo 4: Integración con datos de API (futuro)
 */
export const APIExample: React.FC = () => {
  const [conditions, setConditions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Simulación de llamada a API
  const loadConditionsFromAPI = async () => {
    setLoading(true);
    try {
      // En producción:
      // const repo = new WorkConditionsRepository();
      // const data = await repo.getAll();
      // setConditions(data);

      // Por ahora, simulamos datos
      setTimeout(() => {
        setConditions([
          {
            fecha: '2025-12-20',
            condicionGeneral: 'despejado',
            nivelDificultad: 'normal',
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading conditions:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadConditionsFromAPI();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      // En producción:
      // const repo = new WorkConditionsRepository();
      // await repo.create(data);

      setConditions((prev) => [
        ...prev,
        { ...data, id: Date.now() },
      ]);
    } catch (error) {
      console.error('Error saving condition:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: '#0f172a',
          p: 4,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#e2e8f0' }}>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#0f172a', p: 4, minHeight: '100vh' }}>
      <WorkConditionsView
        onSubmit={handleSubmit}
        conditions={conditions}
      />
    </Box>
  );
};
