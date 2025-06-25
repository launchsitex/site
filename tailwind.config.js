/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#c1ff00',
        'primary-dark': '#a9e600',
        secondary: '#141414',
        'secondary-light': '#1e1e1e',
        accent: '#6D28D9',
      },
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};