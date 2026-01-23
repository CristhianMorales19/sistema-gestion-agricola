import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { AttendanceRecord, Worker } from "../../../domain/entities/Attendance";
import { getDateString } from "../../../application/utils/dateUtils";
import { ButtonGeneric } from "../../../../../shared/presentation/styles/Button.styles";

type DayStatus = "empty" | "partial" | "incomplete" | "complete";

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  maxDate?: string; // YYYY-MM-DD, por defecto hoy
  attendances?: AttendanceRecord[];
  workers?: Worker[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  maxDate,
  attendances = [],
  workers = [],
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate || new Date()),
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const max = (() => {
    if (!maxDate) return today;
    const [year, month, day] = maxDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  })();

  // Cerrar calendario cuando haces clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCalendar]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("es-ES", options).format(date);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate + "T00:00:00");
    date.setDate(date.getDate() - 1);
    const newDate = formatDate(date);

    if (new Date(newDate + "T00:00:00") <= max) {
      onDateChange(newDate);
    }
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate + "T00:00:00");
    date.setDate(date.getDate() + 1);
    const newDate = formatDate(date);

    if (new Date(newDate + "T00:00:00") <= max) {
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    onDateChange(formatDate(today));
    setShowCalendar(false);
  };

  const handleYesterday = () => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    onDateChange(formatDate(yesterday));
    setShowCalendar(false);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const formattedDate = formatDate(newDate);

    if (newDate <= max) {
      onDateChange(formattedDate);
      setShowCalendar(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
    );
    if (nextMonth <= max) {
      setCurrentMonth(nextMonth);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Días vacíos del mes anterior
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const canGoNext = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
    );
    return nextMonth <= max;
  };

  const isDateDisabled = (day: number) => {
    if (!day) return true;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    date.setHours(0, 0, 0, 0);
    return date > max;
  };

  const isDateSelected = (day: number) => {
    if (!day) return false;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return formatDate(date) === selectedDate;
  };

  const isPreviousDayDisabled = () => {
    const date = new Date(selectedDate + "T00:00:00");
    date.setDate(date.getDate() - 1);
    return new Date(formatDate(date) + "T00:00:00") > max;
  };

  const isNextDayDisabled = () => {
    const date = new Date(selectedDate + "T00:00:00");
    date.setDate(date.getDate() + 1);
    // Permitir navegar hasta hoy (max), no más allá
    return new Date(formatDate(date) + "T00:00:00") > max;
  };

  const isYesterdayDisabled = () => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday > max;
  };

  // Calcular el estado de un día específico
  const getDayStatus = (day: number): DayStatus => {
    if (!day || workers.length === 0) return "empty";

    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const dateStr = formatDate(date);

    // Filtrar todas las asistencias del día (incluyendo eliminadas/ausentes)
    const allDayAttendances = attendances.filter(
      (a) => getDateString(a.fecha_at) === dateStr,
    );
    const activeAttendances = allDayAttendances.filter((a) => !a.deleted_at);
    const absentAttendances = allDayAttendances.filter((a) => a.deleted_at);

    // IDs de trabajadores por estado
    const workersWithComplete = new Set(
      activeAttendances
        .filter((a) => a.hora_entrada_at && a.hora_salida_at)
        .map((a) => a.trabajador_id),
    );

    const workersIncomplete = new Set(
      activeAttendances
        .filter((a) => a.hora_entrada_at && !a.hora_salida_at)
        .map((a) => a.trabajador_id),
    );

    const workersMarkedAbsent = new Set(
      absentAttendances.map((a) => a.trabajador_id),
    );

    // Trabajadores con algún estado (completo, incompleto o ausente)
    const workersWithStatus = new Set([
      ...workersWithComplete,
      ...workersIncomplete,
      ...workersMarkedAbsent,
    ]);

    const workersWithoutStatus = workers.length - workersWithStatus.size;

    // ⚪ BLANCO (SIN ACTIVIDAD)
    // Caso 1.2: Todos están ausentes (solo deleted_at, sin registros activos)
    // VERIFICAR PRIMERO antes que cualquier otra cosa
    if (
      workersMarkedAbsent.size === workers.length &&
      activeAttendances.length === 0
    ) {
      return "empty";
    }

    // Caso 1.1: Nadie tiene ningún estado
    if (workersWithStatus.size === 0) return "empty";

    // 🟨 AMARILLO (INCOMPLETO)
    // Caso 2.1: Al menos un trabajador con entrada sin salida (activo, no deleted)
    if (workersIncomplete.size > 0) return "incomplete";

    // 🟩 VERDE (COMPLETO)
    // Caso 4.1: Todos con entrada y salida
    // Caso 4.2: Algunos con entrada y salida, resto ausentes (nadie sin estado, nadie incompleto)
    if (workersWithoutStatus === 0 && workersIncomplete.size === 0) {
      return "complete";
    }

    // 🟦 AZUL (PARCIAL/MIXTO)
    // Caso 3.1: Algunos completos, otros sin estado
    // Caso 3.2: Algunos ausentes, otros completos (pero no todos)
    return "partial";
  };

  // Obtener color del indicador según el estado
  const getDayIndicatorColor = (status: DayStatus): string => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "incomplete":
        return "bg-yellow-500";
      case "partial":
        return "bg-blue-500";
      case "empty":
      default:
        return "bg-transparent";
    }
  };

  return (
    <div className="border-slate-800 p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        {/* Controles principales */}
        <div className="flex items-center gap-3 mb-4">
          {/* Navegación de días */}
          <button
            onClick={handlePreviousDay}
            disabled={isPreviousDayDisabled()}
            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Día anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>

          {/* Selector de fecha */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors text-white"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedDate}</span>
            </button>

            {/* Calendario */}
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg p-4 w-80 shadow-lg">
                {/* Header del calendario */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-1 hover:bg-slate-800 rounded transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>

                  <div className="flex-1 text-center">
                    <p className="text-white text-sm font-semibold">
                      {currentMonth.toLocaleDateString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={handleNextMonth}
                    disabled={!canGoNext()}
                    className="p-1 hover:bg-slate-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-gray-500 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    const dayStatus = day ? getDayStatus(day) : "empty";
                    const indicatorColor = getDayIndicatorColor(dayStatus);

                    return (
                      <button
                        key={index}
                        onClick={() => day && handleDateSelect(day)}
                        disabled={isDateDisabled(day as number)}
                        className={`relative p-2 text-xs rounded font-medium transition-colors ${
                          isDateSelected(day as number)
                            ? "bg-blue-600 text-white"
                            : isDateDisabled(day as number)
                              ? "text-gray-600 cursor-not-allowed opacity-50"
                              : "text-gray-300 hover:bg-slate-800"
                        } ${!day ? "invisible" : ""}`}
                      >
                        {day}
                        {/* Indicador de estado */}
                        {day && dayStatus !== "empty" && (
                          <span
                            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${indicatorColor}`}
                            title={
                              dayStatus === "complete"
                                ? "Día completo (todos con entrada/salida o ausentes)"
                                : dayStatus === "incomplete"
                                  ? "Día incompleto (hay entradas sin salida)"
                                  : "Día mixto (algunos sin registros)"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Leyenda de indicadores */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-gray-500 mb-2">
                    Estado de registros:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-gray-400">Completo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span className="text-gray-400">Incompleto</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-gray-400">Mixto</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full border border-gray-600"></span>
                      <span className="text-gray-400">Pendiente</span>
                    </div>
                  </div>
                </div>

                {/* Botones rápidos */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                  <ButtonGeneric
                    onClick={handleYesterday}
                    disabled={isYesterdayDisabled()}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      selectedDate ===
                      formatDate(
                        new Date(today.getTime() - 24 * 60 * 60 * 1000),
                      )
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Ayer
                  </ButtonGeneric>
                  <ButtonGeneric
                    onClick={handleToday}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      selectedDate === formatDate(today)
                        ? "bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    }`}
                  >
                    Hoy
                  </ButtonGeneric>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleNextDay}
            disabled={isNextDayDisabled()}
            className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Día siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Botones rápidos */}
          <div className="flex gap-2 ml-auto">
            <ButtonGeneric
              onClick={handleYesterday}
              disabled={isYesterdayDisabled()}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedDate ===
                formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000))
                  ? "bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  : "bg-slate-800 hover:bg-slate-700 text-gray-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Ayer
            </ButtonGeneric>
            <ButtonGeneric
              onClick={handleToday}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                selectedDate === formatDate(today)
                  ? "bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  : "bg-slate-800 hover:bg-slate-700 text-gray-300"
              }`}
            >
              Hoy
            </ButtonGeneric>
          </div>

          {/* Fecha legible */}
          <div className="ml-auto text-right">
            <p className="text-gray-400 text-xs">
              {formatDisplayDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
