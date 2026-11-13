/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF681B',
          'orange-hover': '#e6560e',
          'orange-light': '#FFF0E8',
          yellow: '#FFD43B',
          'yellow-hover': '#e6bd35',
          'yellow-light': '#FFF9E5',
          black: '#171717',
          gray: '#F5F5F5',
          'gray-dark': '#333333',
          'gray-muted': '#737373',
          'gray-border': '#E5E5E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(255, 104, 27, 0.25)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 30px rgba(255, 104, 27, 0.15)',
      }
    },
  },
  plugins: [],
}
