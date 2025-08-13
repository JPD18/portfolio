/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          purple: '#7C3AED',
          purpleDark: '#5B21B6',
          orange: '#FB923C',
          orangeDark: '#EA580C',
          midnight: '#0B1026',
          nebula: '#151A37',
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at center, rgba(124,58,237,0.35), transparent 60%)',
        'conic-aurora': 'conic-gradient(from 180deg at 50% 50%, rgba(251,146,60,0.25), rgba(124,58,237,0.2), rgba(251,146,60,0.25))',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


