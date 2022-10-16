/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#86A2EC',
        'secondary': '#47deff',
        'dblue': '#243562',
        'lblue': '#50fc42'
      },
      screens: {
        'xs': '420px'
      }
    },
  },
  plugins: [],
}