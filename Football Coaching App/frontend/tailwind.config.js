/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enable dark mode toggle
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A", // Electric Blue for primary elements
          foreground: "#FFFFFF", // White text on primary elements
        },
        secondary: {
          DEFAULT: "#FFFFFF", // White background for secondary elements
          foreground: "#000000", // Black text on secondary elements
        },
        background: "#FFFFFF", // White background for the body
        card: {
          DEFAULT: "#FFFFFF", // White card backgrounds
          foreground: "#000000", // Black text inside cards
        },
        accent: {
          DEFAULT: "#FF0000", // Red accent for buttons and highlights
        },
        input: "#E2E8F0", // Light gray for input borders
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

