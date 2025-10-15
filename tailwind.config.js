const { lightColors, darkColors } = require("./theme/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: lightColors.background, // 👈 white
          dark: darkColors.background, // 👈 black/dark
        },
        text: {
          DEFAULT: lightColors.text,
          dark: darkColors.text,
        },
        primary: {
          DEFAULT: lightColors.primary,
          dark: darkColors.primary,
        },

        surface: {
          DEFAULT: lightColors.surface,
          dark: darkColors.surface,
        },
        secondary: {
          DEFAULT: lightColors.secondary,
          dark: darkColors.secondary,
        },
        muted: {
          DEFAULT: lightColors.muted,
          dark: darkColors.muted,
        },
      },
      fontFamily: {
        sans: ["Poppins_400Regular"],
        medium: ["Poppins_500Medium"],
        semibold: ["Poppins_600SemiBold"],
        bold: ["Poppins_700Bold"],
      },
    },
  },
};
