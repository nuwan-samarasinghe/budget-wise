/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  important: '#root',
  corePlugins: { preflight: false },
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e3edf8',
          100: '#c0d1f0',
          200: '#9bb3e8',
          300: '#7796e0',
          400: '#5578d8',
          500: '#3c5ebf',
          600: '#325099',
          700: '#284073',
          800: '#1f3050',
          900: '#16222f',
        },
      },
    },
  },
  plugins: [],
};
