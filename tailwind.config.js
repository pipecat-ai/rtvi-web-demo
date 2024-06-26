/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          ...colors.gray,
          DEFAULT: colors.gray[900],
          foreground: colors.white,
          hairline: colors.gray[100],
        },
        ring: colors.gray[500],
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "12px",
          md: "1rem",
        },
      },
      backgroundImage: {
        colorWash: "url('/color-wash-bg.png')",
        cardBorder: `linear-gradient(90deg, white, white), linear-gradient(0deg, ${colors.gray[300]}, ${colors.gray[200]})`,
        selectArrow:
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzY0NzQ4QiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')",
      },
      backgroundPosition: {
        selectArrow: "right 1rem center",
      },
      boxShadow: {
        short:
          "0px 7px 2px 0px rgba(0, 0, 0, 0), 0px 5px 2px 0px rgba(0, 0, 0, 0.01), 0px 3px 2px 0px rgba(0, 0, 0, 0.03), 0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.05)",
        mid: "0px 100px 28px 0px rgba(0, 0, 0, 0), 0px 64px 26px 0px rgba(0, 0, 0, 0.01), 0px 36px 22px 0px rgba(0, 0, 0, 0.03), 0px 16px 16px 0px rgba(0, 0, 0, 0.04), 0px 4px 9px 0px rgba(0, 0, 0, 0.05)",
        long: "0px 360px 101px 0px rgba(0, 0, 0, 0), 0px 231px 92px 0px rgba(0, 0, 0, 0), 0px 130px 78px 0px rgba(0, 0, 0, 0.02),0px 58px 58px 0px rgba(0, 0, 0, 0.03), 0px 14px 32px 0px rgba(0, 0, 0, 0.03)",
        stats: "0px -2px 15px 0px rgba(0, 0, 0, 0.07)",
      },
      animation: {
        wiggle: "wiggle 0.2s 1",
        appear: "appear 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
