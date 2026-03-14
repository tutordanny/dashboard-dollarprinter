/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: { 900: '#0b0e17', 800: '#111827', 700: '#1a2235', 600: '#1e2d45', 500: '#243352' },
        cyan: { 400: '#22d3ee', 500: '#06b6d4' },
        green: { 400: '#4ade80', 500: '#22c55e' },
        red: { 400: '#f87171', 500: '#ef4444' },
      },
    },
  },
  plugins: [],
};
