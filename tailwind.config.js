/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f7',
          100: '#d8e1ee',
          200: '#b3c3dd',
          300: '#8398c4',
          400: '#5470aa',
          500: '#38548d',
          600: '#2b4274',
          700: '#22365e',
          800: '#1a2a48',
          900: '#0f1c32',
          950: '#0a1424',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf6ec',
          200: '#f4ecd2',
          300: '#ecdcb0',
        },
        demand: {
          400: '#5b8def',
          500: '#3b6fd6',
          600: '#2a54b0',
        },
        supply: {
          400: '#e88b4e',
          500: '#d97026',
          600: '#b3561b',
        },
        success: {
          400: '#5bbf7a',
          500: '#3da561',
          600: '#2e884e',
        },
        warning: {
          400: '#e8b54e',
          500: '#d99a26',
        },
        error: {
          400: '#e8714e',
          500: '#d9523a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 28, 50, 0.06), 0 8px 24px rgba(15, 28, 50, 0.06)',
        'card-hover': '0 4px 12px rgba(15, 28, 50, 0.08), 0 16px 40px rgba(15, 28, 50, 0.10)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
