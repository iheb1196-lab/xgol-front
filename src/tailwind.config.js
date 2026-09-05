/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          main: "#9f42e4",
          light: "#e6c7fd",
        },
        secondary: {
          main: "#af49fa",
        },
        palette: {
          outlineBorder: "#B8BED5",
          containedIcon: "#292D32",
        },
      },
    },
  },
  plugins: [],
};
