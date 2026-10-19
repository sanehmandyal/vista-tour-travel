/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '420px',
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        },
        accent: {
          amber: '#f59e0b',
          orange: '#ea580c',
          gold: '#d97706'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(12, 74, 110, 0.08)',
        'card': '0 10px 30px -5px rgba(2, 132, 199, 0.08)',
        'float': '0 20px 40px -15px rgba(2, 132, 199, 0.15)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08), 0 1px 2px 0 rgba(255, 255, 255, 0.6) inset',
        'glass-hover': '0 20px 45px -10px rgba(2, 132, 199, 0.18), 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset',
        'glass-dark': '0 20px 50px rgba(0, 0, 0, 0.4), 0 1px 1px 0 rgba(255, 255, 255, 0.12) inset',
        'glass-glow': '0 0 30px rgba(14, 165, 233, 0.25)',
      }
    },
  },
  plugins: [],
}
