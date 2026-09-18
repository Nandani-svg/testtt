/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--text)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        raised: "var(--raised)",
        card: "var(--surface)",
        "card-border": "var(--border)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-light": "var(--primary-light)",
        "primary-subtle": "var(--primary-subtle)",
        danger: "var(--danger)",
        "danger-hover": "var(--danger-hover)",
        success: "var(--success)",
        warning: "var(--warning)",
      },
    },
  },
  plugins: [],
};
