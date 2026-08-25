import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#00A64F", 
              foreground: "#ffffff", 
            },
            secondary: {
              DEFAULT: "#FFD100", 
              foreground: "#000000", 
            },
            background: "#f9fafb", 
            foreground: "#11181C",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#25B04D",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#FFD700",
              foreground: "#000000",
            },
            background: "#0d1117", 
            foreground: "#eceef2",
            divider: "#21262d",
            focus: "#00A64F",
            content1: "#161b22",
            content2: "#21262d",
          },
        },
      },
    }),
  ],
};