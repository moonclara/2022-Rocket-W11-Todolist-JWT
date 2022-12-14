/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    // 放 extend 裡面 : 自訂顏色
    // 放 extend 外面 : 覆蓋全部顏色
    extend: {
      colors: {
        primary: '#ffd370',
        secondary: '#333333',
        secondaryLight: '#9F9A91',
        warning: '#ff0000',
      },
    },
    screens: {
      'md': '768px',
      // => @media (min-width: 768px) { ... }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '2rem',
      },
    },
  },
  plugins: [],
}
