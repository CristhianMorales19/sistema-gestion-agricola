import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import { WorkConditionsForm } from './WorkConditionsForm';
import { WorkConditionsCalendar } from './WorkConditionsCalendar';

interface WorkCondition {
  fecha: string;
  condicionGeneral: 'despejado' | 'lluvioso' | 'muy_caluroso' | 'nublado';
  nivelDificultad: 'normal' | 'dificil' | 'muy_dificil';
  observaciones?: string;
}

interface WorkConditionsViewProps {
  onSubmit?: (data: WorkCondition) => Promise<boolean> | boolean;
  conditions?: WorkCondition[];
  loading?: boolean;
  error?: string | null;
  onErrorClose?: () => void;
}

export const WorkConditionsView: React.FC<WorkConditionsViewProps> = ({
  onSubmit,
  conditions = [],
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<WorkCondition | null>(null);

  const handleDayClick = (fecha: string) => {
    const found = conditions.find(c => c.fecha === fecha);
    setSelectedDate(fecha);
    setSelectedCondition(found || null);
  };

  return (
    <Box sx={{ flex: 1, p: 4, backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Form */}
        <Grid item xs={12} md={6}>
          <WorkConditionsForm 
            onSubmit={onSubmit}
            selectedCondition={selectedCondition}
            selectedDate={selectedDate}
            onDateSelected={handleDayClick}
          />
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={6}>
          <WorkConditionsCalendar 
            conditions={conditions}
            onDayClick={handleDayClick}
            selectedDate={selectedDate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
