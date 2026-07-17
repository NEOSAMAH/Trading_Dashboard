import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#0b0e14",
          raised: "#12161f",
          overlay: "#1a1f2b",
          border: "#242b3a",
        },
        bull: {
          DEFAULT: "#22c55e",
          soft: "#16311f",
        },
        bear: {
          DEFAULT: "#ef4444",
          soft: "#341518",
        },
        accent: {
          DEFAULT: "#3b82f6",
          soft: "#152238",
        },
      },
      keyframes: {
        "flash-bull": {
          "0%": { backgroundColor: "rgba(34,197,94,0.25)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-bear": {
          "0%": { backgroundColor: "rgba(239,68,68,0.25)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "flash-bull": "flash-bull 900ms ease-out",
        "flash-bear": "flash-bear 900ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
