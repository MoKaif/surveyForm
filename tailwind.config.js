import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["NoxForm", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: ".5rem 1rem",
          fontSize: theme("fontSize.sm"),
          fontWeight: theme("fontWeight.medium"),
          borderRadius: theme("borderRadius.lg"),
          transition: "all .2s",
          "&:focus": {
            outline: "none",
            boxShadow: `0 0 0 2px ${theme("colors.primary.500")}`,
          },
          "&:disabled": {
            opacity: ".5",
            cursor: "not-allowed",
          },
        },
        ".btn-primary": {
          backgroundColor: theme("colors.primary.600"),
          color: theme("colors.white"),
          boxShadow: theme("boxShadow.lg"),
          "&:hover": {
            backgroundColor: theme("colors.primary.700"),
            boxShadow: theme("boxShadow.xl"),
            transform: "translateY(-.125rem)",
          },
        },
        ".btn-secondary": {
          backgroundColor: theme("colors.white"),
          color: theme("colors.slate.700"),
          border: `1px solid ${theme("colors.slate.300")}`,
          boxShadow: theme("boxShadow.sm"),
          "&:hover": {
            backgroundColor: theme("colors.slate.50"),
            boxShadow: theme("boxShadow.md"),
          },
        },
        ".card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.xl"),
          boxShadow: theme("boxShadow.sm"),
          border: `1px solid ${theme("colors.slate.200")}`,
          overflow: "hidden",
        },
        ".input": {
          width: "100%",
          padding: ".75rem 1rem",
          color: theme("colors.slate.900"),
          backgroundColor: theme("colors.white"),
          border: `1px solid ${theme("colors.slate.300")}`,
          borderRadius: theme("borderRadius.lg"),
          transition: "colors .2s",
          "&:focus": {
            boxShadow: `0 0 0 2px ${theme("colors.primary.500")}`,
            borderColor: theme("colors.primary.500"),
          },
        },
      });
    }),
  ],
};
