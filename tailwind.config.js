/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8e8f6',
          100: '#c5c6ea',
          200: '#9e9fdc',
          300: '#7778ce',
          400: '#5a5bc3',
          500: '#3d3eb8',
          600: '#050978',
          700: '#040772',
          800: '#030560',
          900: '#02044d',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [],
  important: false,
  corePlugins: {
    preflight: false,
  },
}
