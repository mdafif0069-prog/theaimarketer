/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noor: {
          bg: '#0B1020',
          surface: '#121A2E',
          surface2: '#1A2440',
          gold: '#F5C451',
          goldSoft: '#FFE3A3',
          emerald: '#1FB58F',
          emeraldDeep: '#0E7C63',
          indigo: '#5B6CFF',
          text: '#F4F6FB',
          muted: '#9AA4BF',
          danger: '#FF6B6B',
        },
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'noor-glow': 'linear-gradient(135deg, #F5C451 0%, #FFE3A3 45%, #1FB58F 100%)',
        'ai-accent': 'linear-gradient(135deg, #5B6CFF 0%, #1FB58F 100%)',
        'emerald-fade': 'linear-gradient(135deg, #1FB58F 0%, #0E7C63 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245,196,81,0.5), 0 10px 40px -10px rgba(245,196,81,0.35)',
        card: '0 12px 30px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-in': 'fade-in 0.4s ease-out both',
        'float-slow': 'float-slow 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
