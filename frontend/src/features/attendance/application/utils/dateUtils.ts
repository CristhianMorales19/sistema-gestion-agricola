/**
 * Date utility functions for consistent date handling across the attendance module
 */

/**
 * Convert a date string to YYYY-MM-DD format
 * @param date ISO date string or Date object
 * @returns YYYY-MM-DD string
 */
export const getDateString = (date: string | Date | null | undefined): string => {
  if (!date) {
    return getTodayString();
  }
  
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  
  // Use local timezone instead of UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if two dates are the same day
 * @param date1 ISO date string or Date object
 * @param date2 ISO date string or Date object
 * @returns boolean
 */
export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  return getDateString(date1) === getDateString(date2);
};

/**
 * Get today's date in YYYY-MM-DD format using local timezone
 * @returns YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get yesterday's date in YYYY-MM-DD format using local timezone
 * @returns YYYY-MM-DD string
 */
export const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date string to Spanish locale format
 * @param dateString YYYY-MM-DD format
 * @returns e.g., "lunes, 22 de diciembre de 2025"
 */
export const formatDateToSpanish = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} de ${month} de ${year}`;
};

/**
 * Get current local time in HH:mm format
 * This function ensures we always get the local time correctly
 * @returns HH:mm string (e.g., "14:30")
 */
export const getCurrentTimeHHMM = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
