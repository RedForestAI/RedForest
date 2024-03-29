import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: [
      {
        "light": {
           "primary": "#d45628",
           "primary-content": "#ffffff",
           "secondary": "#6ea545",
           "accent": "#941914",
           "neutral": "#c9c9c9",
           "base-100": "#f5f5f4",
           "base-200": "#f0f0ee",
           "base-300": "#f2f2f1",
           "info": "#1e40af",
           "success": "#22c55e",
           "warning": "#facc15",
           "error": "#ef4444",
        },
        "dark": {
           "primary": "#d45628",
           "secondary": "#6ea545",
           "accent": "#941914",
           "neutral": "#575656",
           "base-100": "#202124",
           "info": "#1e40af",
           "success": "#22c55e",
           "warning": "#facc15",
           "error": "#ef4444",
        }
      }
    ]
  }
} satisfies Config;
