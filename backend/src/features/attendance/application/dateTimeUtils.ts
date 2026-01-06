/**
 * Utilidades para manejo de fechas y zonas horarias en el módulo de asistencia
 * 
 * Problema: Prisma/MySQL convierte automáticamente las fechas a UTC al guardar.
 * Esto causa que una hora local (ej: 15:13 en Costa Rica UTC-6) se guarde como UTC (21:13).
 * 
 * Solución: Crear fechas "UTC falsas" que representan la hora local como si fuera UTC.
 * Al guardar: convertimos hora local -> hora UTC que represente la misma hora numérica
 * Al leer: la fecha ya tiene la hora correcta porque la guardamos como queremos
 */

/**
 * Convierte una hora string (HH:mm) y fecha opcional a un Date que se guardará
 * correctamente en MySQL sin conversión de zona horaria.
 * 
 * @param timeString - Hora en formato HH:mm (ej: "15:13")
 * @param dateString - Fecha en formato YYYY-MM-DD (opcional, default: hoy)
 * @returns Date que al guardarse en MySQL tendrá la hora correcta
 */
export function createLocalDateTime(timeString: string, dateString?: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  let year: number, month: number, day: number;
  
  if (dateString) {
    [year, month, day] = dateString.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
  }
  
  // Crear fecha usando Date.UTC para evitar conversiones de zona horaria
  // Esto crea una fecha que "parece" UTC pero en realidad representa nuestra hora local
  const fakeUtcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  
  return fakeUtcDate;
}

/**
 * Crea una fecha solo (sin hora) que se guardará correctamente en MySQL
 * 
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Date que representa solo la fecha
 */
export function createLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Usar Date.UTC para evitar conversiones de zona horaria
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Crea una fecha/hora para "ahora" que se guardará correctamente en MySQL
 * 
 * @returns Date que representa la hora actual local
 */
export function createLocalDateTimeNow(): Date {
  const now = new Date();
  
  // Crear fecha usando Date.UTC con los componentes locales
  return new Date(Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    0
  ));
}

/**
 * Extrae la hora de un Date en formato HH:mm
 * Asume que el Date ya contiene la hora correcta (no necesita conversión)
 * 
 * @param date - Fecha de la cual extraer la hora
 * @returns String en formato HH:mm
 */
export function extractTimeFromDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  
  // Usar getUTC* porque guardamos como "fake UTC"
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * Extrae la fecha de un Date en formato YYYY-MM-DD
 * Asume que el Date ya contiene la fecha correcta (no necesita conversión)
 * 
 * @param date - Fecha de la cual extraer
 * @returns String en formato YYYY-MM-DD
 */
export function extractDateFromDate(date: Date | null | undefined): string | null {
  if (!date) return null;
  
  // Usar getUTC* porque guardamos como "fake UTC"
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene la fecha de hoy en formato YYYY-MM-DD
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Valida que una fecha no sea futura
 */
export function isDateInFuture(dateString: string): boolean {
  return dateString > getTodayString();
}
