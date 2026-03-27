/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F172A',
          accent: '#2563EB',
        },
      },
    },
  },
  plugins: [],
};
