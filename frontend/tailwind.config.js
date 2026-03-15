/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff7f1',
          100: '#ffe9d6',
          200: '#ffd0a8',
          300: '#ffb170',
          400: '#ff9750',
          500: '#f9863f',
          600: '#e36e2f',
          700: '#bd5225',
          800: '#953f21',
          900: '#78351f'
        },
        gold: {
          100: '#fbf4df',
          200: '#f6e6b3',
          300: '#f0d47a',
          400: '#e9c651',
          500: '#d7b13b',
          600: '#b28f2f'
        },
        navy: {
          50: '#f2f6fb',
          100: '#dbe6f6',
          200: '#b1c7ec',
          300: '#85a6df',
          400: '#567ecb',
          500: '#2f57a8',
          600: '#24427f',
          700: '#1b335f',
          800: '#152849',
          900: '#0e1b31'
        },
        offwhite: '#faf7f2'
      }
    },
  },
  plugins: [],
};

