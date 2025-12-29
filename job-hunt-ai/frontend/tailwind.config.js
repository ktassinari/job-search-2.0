/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C7CFF',
          50: '#f5f5ff',
          100: '#ebebff',
          200: '#d6d6ff',
          300: '#b8b9ff',
          400: '#9a9cff',
          500: '#7C7CFF',
          600: '#6464e6',
          700: '#5050cc',
          800: '#3c3ca3',
          900: '#2d2d75',
        },
        dark: {
          bg: '#0B0E13',
          surface: '#1A1F2E',
          card: '#1E2433',
          border: '#2A3142',
          text: '#E5E7EB',
          'text-secondary': '#9CA3AF',
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
