/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#060A14', // app background (deep midnight)
          800: '#0B1120',
          700: '#0E1526',
          600: '#141D33',
          500: '#1B2540',
        },
        emerald2: {
          DEFAULT: '#22D3A6', // primary accent (teal-emerald / noor)
          soft: '#5CE7C2',
          deep: '#0E8A6C',
        },
        gold2: {
          DEFAULT: '#F7C873', // light / noor
          soft: '#FFE0A6',
        },
        violet2: {
          DEFAULT: '#8B7CFF', // AI accent
          soft: '#B5ABFF',
        },
        cloud: {
          DEFAULT: '#EEF2FB',
          muted: '#94A0B8',
          dim: '#5C6781',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      backgroundImage: {
        noor: 'linear-gradient(135deg, #22D3A6 0%, #7AE0BF 40%, #F7C873 100%)',
        ai: 'linear-gradient(135deg, #8B7CFF 0%, #22D3A6 100%)',
        emeraldfade: 'linear-gradient(160deg, #22D3A6 0%, #0E8A6C 100%)',
        goldfade: 'linear-gradient(160deg, #F7C873 0%, #E0A24C 100%)',
      },
      boxShadow: {
        glow: '0 10px 40px -12px rgba(34,211,166,0.45)',
        glowgold: '0 10px 40px -12px rgba(247,200,115,0.45)',
        glowai: '0 10px 40px -12px rgba(139,124,255,0.5)',
        soft: '0 18px 50px -20px rgba(0,0,0,0.7)',
        device: '0 40px 120px -30px rgba(0,0,0,0.8)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        aurora: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(6%,-4%) scale(1.1)' },
          '66%': { transform: 'translate(-4%,4%) scale(0.95)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        typing: {
          '0%,60%,100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-5px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(.2,.7,.2,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        'slide-in': 'slide-in 0.4s cubic-bezier(.2,.7,.2,1) both',
        'scale-in': 'scale-in 0.35s cubic-bezier(.2,.7,.2,1) both',
        aurora: 'aurora 18s ease-in-out infinite',
        bob: 'bob 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
