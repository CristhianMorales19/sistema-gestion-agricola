import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarDay {
  date: number;
  condition?: 'despejado' | 'lluvioso' | 'muy_caluroso' | 'nublado';
  difficulty?: 'normal' | 'dificil' | 'muy_dificil';
  observaciones?: string;
  isCurrentMonth: boolean;
}

interface WorkConditionsCalendarProps {
  month?: number;
  year?: number;
  conditions?: Array<{
    fecha: string;
    condicionGeneral: string;
    nivelDificultad: string;
    observaciones?: string;
  }>;
  onDayClick?: (fecha: string) => void;
  selectedDate?: string | null;
}

const CONDITION_COLORS = {
  despejado: { bg: '#fbbf24', icon: '☀️', label: 'Despejado' },
  lluvioso: { bg: '#3b82f6', icon: '🌧️', label: 'Lluvioso' },
  muy_caluroso: { bg: '#ef4444', icon: '🔥', label: 'Muy Caluroso' },
  nublado: { bg: '#6b7280', icon: '☁️', label: 'Nublado' },
};

const DIFFICULTY_COLORS = {
  normal: '#10b981',
  dificil: '#f97316',
  muy_dificil: '#ef4444',
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const WorkConditionsCalendar: React.FC<WorkConditionsCalendarProps> = ({
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  conditions = [],
  onDayClick,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [currentYear, setCurrentYear] = useState(year);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);

    const days: CalendarDay[] = [];

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const conditionData = conditions.find((c) => c.fecha === dateStr);

      days.push({
        date: i,
        isCurrentMonth: true,
        condition: conditionData?.condicionGeneral as any,
        difficulty: conditionData?.nivelDificultad as any,
        observaciones: conditionData?.observaciones,
      });
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days = getCalendarDays();

  return (
    <Card
      sx={{
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}
            >
              Calendario de Trabajo
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Vista de condiciones legendarias
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Mes anterior">
              <IconButton
                onClick={handlePrevMonth}
                sx={{
                  color: '#e2e8f0',
                  border: '1px solid #334155',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#1e293b' },
                }}
              >
                <ChevronLeft size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Próximo mes">
              <IconButton
                onClick={handleNextMonth}
                sx={{
                  color: '#e2e8f0',
                  border: '1px solid #334155',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#1e293b' },
                }}
              >
                <ChevronRight size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Month and Year */}
        <Typography
          variant="h6"
          sx={{
            color: '#ffffff',
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          {MONTH_NAMES[currentMonth]} De {currentYear}
        </Typography>

        {/* Day names */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {DAY_NAMES.map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  display: 'block',
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {days.map((day, index) => {
            const conditionColor = day.condition
              ? CONDITION_COLORS[day.condition as keyof typeof CONDITION_COLORS]
              : null;
            const difficultyColor = day.difficulty
              ? DIFFICULTY_COLORS[day.difficulty as keyof typeof DIFFICULTY_COLORS]
              : null;
            
            // Solo construir dateStr para días del mes actual
            let dateStr = '';
            if (day.isCurrentMonth) {
              dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
            }
            const isSelected = day.isCurrentMonth && selectedDate === dateStr;

            return (
              <Grid item xs={12 / 7} key={index}>
                <Tooltip
                  title={
                    day.condition ? (
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {conditionColor?.label}
                        </Typography>
                        <Typography variant="caption">
                          Dificultad: {day.difficulty}
                        </Typography>
                        {day.observaciones && (
                          <>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                              💬 {day.observaciones}
                            </Typography>
                          </>
                        )}
                      </Box>
                    ) : (
                      'Sin registro'
                    )
                  }
                  arrow
                  enterDelay={200}
                >
                  <Box
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        onDayClick?.(dateStr);
                      }
                    }}
                    sx={{
                      aspect: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      backgroundColor: isSelected ? '#1e3a2a' : (day.isCurrentMonth ? '#1e293b' : 'transparent'),
                      border: isSelected 
                        ? '2px solid #10b981'
                        : (day.isCurrentMonth
                          ? '1px solid #334155'
                          : '1px solid transparent'),
                      cursor: day.isCurrentMonth ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': day.isCurrentMonth
                        ? {
                            backgroundColor: '#0f172a',
                            borderColor: '#475569',
                          }
                        : {},
                    }}
                  >
                    {/* Background color for condition */}
                    {day.condition && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: conditionColor?.bg,
                          opacity: 0.15,
                        }}
                      />
                    )}

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {/* Date number */}
                      <Typography
                        sx={{
                          color: day.isCurrentMonth ? '#e2e8f0' : '#64748b',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}
                      >
                        {day.date}
                      </Typography>

                      {/* Condition icon */}
                      {day.condition && (
                        <Typography
                          sx={{
                            fontSize: 14,
                            lineHeight: 1,
                          }}
                        >
                          {conditionColor?.icon}
                        </Typography>
                      )}

                      {/* Difficulty indicator */}
                      {day.difficulty && (
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: difficultyColor,
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>

        {/* Legend */}
        <Box sx={{ borderTop: '1px solid #334155', pt: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: '#e2e8f0', fontWeight: 'bold', mb: 1 }}
          >
            Nivel de Dificultad:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Normal
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#f97316',
                }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Difícil
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                }}
              />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Muy Difícil
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
