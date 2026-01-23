import React, { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  GlassCard,
  CardContentStyled,
  CalendarHeader,
  CalendarTitle,
  NavigationButtons,
  NavButton,
  MonthYearTitle,
  DaysGrid,
  CalendarGrid,
  DayItem,
  DayBox,
  DayContent,
  DayNumber,
  ConditionIcon,
  DifficultyIndicator,
  LegendContainer,
  LegendTitle,
  LegendItems,
  LegendItem,
  LegendDot,
  LegendText,
} from "./WorkConditionsCalendar.styles";
import { TextGeneric } from "../../../../shared/presentation/styles/Text.styles";

interface CalendarDay {
  date: number;
  condition?: "despejado" | "lluvioso" | "muy_caluroso" | "nublado";
  difficulty?: "normal" | "dificil" | "muy_dificil";
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
  despejado: { bg: "#fbbf24", icon: "☀️", label: "Despejado" },
  lluvioso: { bg: "#3b82f6", icon: "🌧️", label: "Lluvioso" },
  muy_caluroso: { bg: "#ef4444", icon: "🔥", label: "Muy Caluroso" },
  nublado: { bg: "#6b7280", icon: "☁️", label: "Nublado" },
};

const DIFFICULTY_COLORS = {
  normal: "#10b981",
  dificil: "#f97316",
  muy_dificil: "#ef4444",
};

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

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
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
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
    <GlassCard>
      <CardContentStyled>
        <CalendarHeader>
          <CalendarTitle>
            <TextGeneric variant="h6">Calendario de Trabajo</TextGeneric>
          </CalendarTitle>
          <NavigationButtons sx={{ marginLeft: "auto" }}>
            <Tooltip title="Mes anterior">
              <NavButton onClick={handlePrevMonth}>
                <ChevronLeft size={20} />
              </NavButton>
            </Tooltip>
            <Tooltip title="Próximo mes">
              <NavButton onClick={handleNextMonth}>
                <ChevronRight size={20} />
              </NavButton>
            </Tooltip>
          </NavigationButtons>
        </CalendarHeader>

        {/* Month and Year */}
        <MonthYearTitle>
          {MONTH_NAMES[currentMonth]} De {currentYear}
        </MonthYearTitle>

        {/* Day names */}
        <DaysGrid container spacing={1}>
          {DAY_NAMES.map((day) => (
            <DayItem item xs={12 / 7} key={day}>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textAlign: "center",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                {day}
              </Typography>
            </DayItem>
          ))}
        </DaysGrid>

        {/* Calendar days */}
        <CalendarGrid container spacing={1}>
          {days.map((day, index) => {
            const conditionColor = day.condition
              ? CONDITION_COLORS[day.condition as keyof typeof CONDITION_COLORS]
              : null;
            const difficultyColor = day.difficulty
              ? DIFFICULTY_COLORS[
                  day.difficulty as keyof typeof DIFFICULTY_COLORS
                ]
              : "";

            let dateStr = "";
            if (day.isCurrentMonth) {
              dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day.date).padStart(2, "0")}`;
            }
            const isSelected = day.isCurrentMonth && selectedDate === dateStr;

            return (
              <DayItem item xs={12 / 7} key={index}>
                <Tooltip
                  title={
                    day.condition ? (
                      <Box sx={{ textAlign: "left" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", mb: 0.5 }}
                        >
                          {conditionColor?.label}
                        </Typography>
                        <Typography variant="caption">
                          Dificultad: {day.difficulty}
                        </Typography>
                        {day.observaciones && (
                          <>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 0.5,
                                fontStyle: "italic",
                              }}
                            >
                              💬 {day.observaciones}
                            </Typography>
                          </>
                        )}
                      </Box>
                    ) : (
                      "Sin registro"
                    )
                  }
                  arrow
                  enterDelay={200}
                >
                  <DayBox
                    onClick={() => {
                      if (day.isCurrentMonth) {
                        onDayClick?.(dateStr);
                      }
                    }}
                    isCurrentMonth={day.isCurrentMonth}
                    isSelected={isSelected}
                    hasCondition={!!day.condition}
                    conditionColor={conditionColor?.bg}
                  >
                    <DayContent>
                      {/* Date number */}
                      <DayNumber isCurrentMonth={day.isCurrentMonth}>
                        {day.date}
                      </DayNumber>

                      {/* Condition icon */}
                      {day.condition && (
                        <ConditionIcon>{conditionColor?.icon}</ConditionIcon>
                      )}

                      {/* Difficulty indicator */}
                      {day.difficulty && (
                        <DifficultyIndicator color={difficultyColor} />
                      )}
                    </DayContent>
                  </DayBox>
                </Tooltip>
              </DayItem>
            );
          })}
        </CalendarGrid>

        {/* Legend */}
        <LegendContainer>
          <LegendTitle>Nivel de Dificultad:</LegendTitle>
          <LegendItems>
            <LegendItem>
              <LegendDot color="#10b981" />
              <LegendText>Normal</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendDot color="#f97316" />
              <LegendText>Difícil</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendDot color="#ef4444" />
              <LegendText>Muy Difícil</LegendText>
            </LegendItem>
          </LegendItems>
        </LegendContainer>
      </CardContentStyled>
    </GlassCard>
  );
};
