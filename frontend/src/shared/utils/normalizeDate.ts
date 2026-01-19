export const normalizeDate = (date?: string): string => {
  if (!date) return "";
  return date.split("T")[0];
};
