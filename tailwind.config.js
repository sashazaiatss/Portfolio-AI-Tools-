/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF8",
        ink: "#1C1C1A",
        teal: "#2F6F5E",
        high: "#C4432B",
        medium: "#B8860B",
        muted: "#6B6A64",
        border: "#E3E1DB",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
