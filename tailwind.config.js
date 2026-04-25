/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E30613",
        secondary: "#000000",
        background: "#FFFFFF",
        surface: "#F9FAFB",
        "red-accent": "#E30613",
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
