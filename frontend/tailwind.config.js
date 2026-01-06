/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para Asistencia
        "dark-bg": "#1a1d29",
        "dark-card": "#252837",
        "dark-header": "#1a1d29",
        "dark-border": "#4a5568",
      },
      backgroundColor: {
        "dark-main": "#1a1d29",
        "dark-secondary": "#252837",
      },
    },
  },
  plugins: [],
};
