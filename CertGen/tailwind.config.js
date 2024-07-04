/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors:{
        background: "#222831",
        softgray: "#31363F",
        secondary: "#76ABAE",
        primary: "#EEEEEE",
      }
    },
  },
  plugins: [],
}

