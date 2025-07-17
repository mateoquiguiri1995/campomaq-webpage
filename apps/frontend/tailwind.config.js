/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradientX 8s ease infinite',
      },
      keyframes: {
        gradientX: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      fontFamily: {
        eurostile: ['"Eurostile Unicase", sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
