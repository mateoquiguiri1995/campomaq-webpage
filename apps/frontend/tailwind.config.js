/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fondoGradual: {
          '0%': { backgroundColor: '#000000' },     // negro
          '50%': { backgroundColor: '#facc15' },     // amarillo tailwind (yellow-400)
          '100%': { backgroundColor: '#000000' },
        },
      },
      animation: {
        fondoGradual: 'fondoGradual 8s ease-in-out infinite',
      },
      fontFamily: {
        eurostile: ['"Eurostile Unicase", sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
