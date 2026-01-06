/**
 * Calcula las horas trabajadas entre hora de entrada y salida
 * @param horaEntrada - Hora de entrada en formato HH:MM
 * @param horaSalida - Hora de salida en formato HH:MM
 * @returns Horas trabajadas en formato "HH:MM" o 0 si falta alguna hora
 */
export const calculateHours = (horaEntrada: string | null | undefined, horaSalida: string | null | undefined): string => {
  if (!horaEntrada || !horaSalida) {
    return '—';
  }

  try {
    // Parse las horas
    const [entradaHours, entradaMinutes] = horaEntrada.split(':').map(Number);
    const [salidaHours, salidaMinutes] = horaSalida.split(':').map(Number);

    // Convertir a minutos totales
    const entradaTotalMinutes = entradaHours * 60 + entradaMinutes;
    const salidaTotalMinutes = salidaHours * 60 + salidaMinutes;

    // Calcular diferencia
    let diffMinutes = salidaTotalMinutes - entradaTotalMinutes;

    // Si es negativo, asumir que la salida fue al día siguiente
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }

    // Convertir de vuelta a horas y minutos
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch {
    return '—';
  }
};

/**
 * Extrae la hora en formato HH:MM de diferentes formatos posibles
 * @param timeInput - Puede ser ISO "2025-12-23T22:22:00", HH:MM "22:22", o HH:MM:SS "22:22:00"
 * @returns Hora en formato HH:MM o null si no se puede extraer
 */
export const extractTimeHHMM = (timeInput: string): string | null => {
  if (!timeInput) return null;
  
  try {
    // Si contiene 'T', es ISO format: extrae después de la T
    if (timeInput.includes('T')) {
      // "2025-12-23T22:22:00" -> "22:22"
      const timePart = timeInput.split('T')[1]; // "22:22:00"
      return timePart.substring(0, 5); // "22:22"
    }
    
    // Si contiene ':', es formato HH:MM o HH:MM:SS
    if (timeInput.includes(':')) {
      // Tomar solo los primeros 5 caracteres (HH:MM)
      return timeInput.substring(0, 5);
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Valida que la hora de salida sea mayor o igual a la hora de entrada
 * @param horaEntrada - Hora de entrada en cualquier formato (ISO, HH:MM, HH:MM:SS)
 * @param horaSalida - Hora de salida en cualquier formato (ISO, HH:MM, HH:MM:SS)
 * @returns true si es válida, false si no
 */
export const validateExitTime = (horaEntrada: string, horaSalida: string): boolean => {
  try {
    // Normalizar ambas horas al formato HH:MM
    const entryTimeHHMM = extractTimeHHMM(horaEntrada);
    const exitTimeHHMM = extractTimeHHMM(horaSalida);
    
    if (!entryTimeHHMM || !exitTimeHHMM) {
      console.warn(`validateExitTime: Failed to extract times - entrada: "${horaEntrada}" -> "${entryTimeHHMM}", salida: "${horaSalida}" -> "${exitTimeHHMM}"`);
      return false;
    }
    
    const [entradaHours, entradaMinutes] = entryTimeHHMM.split(':').map(Number);
    const [salidaHours, salidaMinutes] = exitTimeHHMM.split(':').map(Number);

    // Validar que los números sean válidos
    if (isNaN(entradaHours) || isNaN(entradaMinutes) || isNaN(salidaHours) || isNaN(salidaMinutes)) {
      console.warn(`validateExitTime: Invalid time numbers - entrada: ${entradaHours}:${entradaMinutes}, salida: ${salidaHours}:${salidaMinutes}`);
      return false;
    }

    const entradaTotalMinutes = entradaHours * 60 + entradaMinutes;
    const salidaTotalMinutes = salidaHours * 60 + salidaMinutes;

    const isValid = salidaTotalMinutes > entradaTotalMinutes;
    console.log(`validateExitTime: entrada=${entryTimeHHMM} (${entradaTotalMinutes}min), salida=${exitTimeHHMM} (${salidaTotalMinutes}min), válida=${isValid}`);
    
    return isValid;
  } catch (error) {
    console.error('validateExitTime error:', error);
    return false;
  }
};
