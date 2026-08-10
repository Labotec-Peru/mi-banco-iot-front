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
              DEFAULT: "#0f1bca",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#00e5b3",
              foreground: "#000000", 
            },
            background: "#fdfdfd", 
            foreground: "#11181C",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#2a3cff", 
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#4bf5cc", 
              foreground: "#000000",
            },
            background: "#0a0a12", 
            foreground: "#eceef2",
            divider: "#22223b",
            focus: "#0f1bca",
            content1: "#18181b",
            content2: "#27272a",
          },
        },
      },
    }),
  ],
};