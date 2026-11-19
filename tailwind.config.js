/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./404.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F2F7F4",
          100: "#E3EDE7",
          200: "#C4D9CF",
          300: "#9DBDB0",
          400: "#6E9384",
          500: "#497264",
          600: "#2F6B5E",
          700: "#1A4F4C",
          800: "#113D40",
          900: "#0C2B2D",
          950: "#071D1F",
        },
        gold: {
          50: "#FCF8EF",
          100: "#F7EEDA",
          200: "#EFDDB5",
          300: "#E7C681",
          400: "#DDB45E",
          500: "#D5AD67",
          600: "#B8913F",
          700: "#8F6E2E",
        },
        cream: "#FBF9EC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
        arabic: ["Amiri", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -14px rgba(17,61,64,.28)",
        card: "0 20px 45px -28px rgba(17,61,64,.45)",
      },
    },
  },
  plugins: [],
};
