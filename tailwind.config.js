/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1c2430",
          muted: "#4d5a6a",
        },
        paper: {
          DEFAULT: "#f6f3ee",
          card: "#fffcf8",
        },
        sage: {
          DEFAULT: "#2f6f6a",
          soft: "#d7e8e6",
          deep: "#1f4f4b",
        },
        apricot: {
          DEFAULT: "#e4a06a",
          soft: "#f8e4d2",
        },
      },
      fontFamily: {
        sans: [
          "Figtree",
          "Noto Sans JP",
          "Hiragino Sans",
          "Yu Gothic",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px rgba(28, 36, 48, 0.06)",
      },
    },
  },
  plugins: [],
};
