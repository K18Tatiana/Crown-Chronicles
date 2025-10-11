/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'got-red': '#8B0000',
        'got-gold': '#DAA520',
        'got-dark': '#1a1a1a',
        'got-gray': '#2d2d2d',
      },
      fontFamily: {
        'got': ['Cinzel', 'serif'],
      }
    },
  },
  plugins: [],
}
