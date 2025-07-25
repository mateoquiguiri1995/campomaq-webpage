/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // includes all pages/components/templates
    "./public/**/*.html",              // in case you have static HTML
  ],
  theme: {
    extend: {
      keyframes: {
        fondoGradual: {
          '0%': { backgroundColor: '#000000' },
          '50%': { backgroundColor: '#facc15' },
          '100%': { backgroundColor: '#000000' },
        },
        wave1: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave2: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        wave3: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        fondoGradual: 'fondoGradual 8s ease-in-out infinite',
        wave1: 'wave1 12s ease-in-out infinite',
        wave2: 'wave2 12s ease-in-out infinite',
        wave3: 'wave3 12s ease-in-out infinite',
      },
      fontFamily: {
        eurostile: ['"Eurostile Unicase", sans-serif'],
        orbitron: ['"Orbitron", sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
