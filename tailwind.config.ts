import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Makon TV
        primary: {
          DEFAULT: "#4EEADB",
          50: "#E8FCFA",
          100: "#D1F9F5",
          200: "#A3F3EB",
          300: "#75EDE1",
          400: "#4EEADB",
          500: "#2CCFC0",
          600: "#23A99C",
          700: "#1A8278",
          800: "#125C54",
          900: "#093530",
        },
        // Dark theme backgrounds
        dark: {
          DEFAULT: "#0D0D0D",
          50: "#2A2A2A",
          100: "#242424",
          200: "#1E1E1E",
          300: "#1A1A1A",
          400: "#141414",
          500: "#0D0D0D",
          600: "#0A0A0A",
          700: "#070707",
          800: "#050505",
          900: "#000000",
        },
        // Text colors
        muted: "#888888",
        error: "#FF4D4D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(180deg, transparent 0%, rgba(13,13,13,0.8) 70%, #0D0D0D 100%)",
        "card-gradient":
          "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
