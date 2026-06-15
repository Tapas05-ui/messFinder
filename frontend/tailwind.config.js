/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#bce3bc',
          300: '#8fcd8f',
          400: '#5cb35c',
          500: '#3a9a3a',
          600: '#2d7d2d',
          700: '#256325',
          800: '#1f4f1f',
          900: '#1a401a',
        },
        accent: {
          400: '#f59e0b',
          500: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
