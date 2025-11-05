/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'palatino': ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'serif'],
      },
      colors: {
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        chocolate: {
          50: '#fdf8f3',
          100: '#f7e8d9',
          200: '#efd0b3',
          300: '#e4b283',
          400: '#d68c55',
          500: '#cd773c',
          600: '#bf6132',
          700: '#9f4c2c',
          800: '#803e2b',
          900: '#683426',
        },
        sage: {
          50: '#f8f9f8',
          100: '#e9eeea',
          200: '#d3ddd6',
          300: '#afc2b5',
          400: '#8FBC8F',
          500: '#6A8A6A',
          600: '#556B2F',
          700: '#465a2a',
          800: '#3a4924',
          900: '#323d21',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}