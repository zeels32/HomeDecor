import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivory: {
          DEFAULT: "#F8F6F0",
          50: "#FAF9F5",
          100: "#F8F6F0",
          200: "#F0ECE1",
          300: "#E8DFD2",
        },
        sand: {
          DEFAULT: "#E8DFD2",
          50: "#F6F3EE",
          100: "#EFEAE2",
          200: "#E8DFD2",
          300: "#D8CBB7",
        },
        sage: {
          DEFAULT: "#A8B29A",
          50: "#F3F5F1",
          100: "#E3E7DE",
          200: "#CCD4C4",
          300: "#A8B29A",
          400: "#8D9A7C",
          500: "#6F7C5E",
        },
        forest: {
          DEFAULT: "#34483A",
          50: "#F0F3F1",
          100: "#DCE3DE",
          200: "#B8C7BD",
          300: "#879F90",
          400: "#5A7764",
          500: "#34483A",
          600: "#2B3C30",
          700: "#223026",
          800: "#1A241D",
          900: "#111813",
        },
        charcoal: {
          DEFAULT: "#292A26",
          light: "#3E3F3A",
          dark: "#1A1A17",
        },
        "muted-gray": "#77766F",
        "subtle-border": "#E6E2D9",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      aspectRatio: {
        "4/5": "4 / 5",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(41, 42, 38, 0.05)",
        card: "0 10px 30px -4px rgba(41, 42, 38, 0.07)",
        elevated: "0 20px 40px -15px rgba(41, 42, 38, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
