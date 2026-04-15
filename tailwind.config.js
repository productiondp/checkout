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
        primary: "#E31D07", /* Precise Logo Highlight */
        background: "#F2F5F9",
        surface: "#FFFFFF",
        "text-main": "#202124",
        "text-muted": "#5F6368",
        border: "#E8EAED",
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
