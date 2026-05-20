/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#09090b',
        surface: '#18181b',
        'surface-2': '#27272a',
        border: '#3f3f46',
        text: '#fafafa',
        muted: '#a1a1aa',
        accent: '#818cf8',
        success: '#4ade80',
        warning: '#fbbf24',
        danger: '#f87171',
      },
      animation: {
        'pulse-dot': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
