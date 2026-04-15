/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E53935",
          light: "#FEEBEE",
          dark: "#B71C1C",
        },
        accent: "#F9AB00",
        background: "#F2F5F7",
        surface: "#FFFFFF",
        text: {
          DEFAULT: "#202124",
          secondary: "#5F6368",
          muted: "#9AA0A6",
        },
        border: "#F2F5F7",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        "soft": "0 2px 4px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.02)",
        "premium": "0 12px 32px -8px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
};
