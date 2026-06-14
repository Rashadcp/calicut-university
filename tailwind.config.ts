import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8faf9",
        surface: "#ffffff",
        "surface-container": "#f0f4f2",
        "surface-variant": "#e2e8e5",
        primary: "#1b4332",
        "on-primary": "#ffffff",
        "primary-container": "#e8f5e9",
        secondary: "#2d6a4f",
        "secondary-container": "#f0f7f4",
        "on-secondary": "#ffffff",
        "on-surface": "#111827",
        "on-surface-variant": "#4b5563",
        error: "#dc2626",
        "error-container": "#fef2f2",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
        "3xl": "24px",
      },
      spacing: {
        "container-padding": "24px",
        "stack-md": "24px",
        "section-gap": "80px",
        "stack-sm": "12px",
        "base": "8px",
        "gutter": "24px"
      },
      fontFamily: {
        "label-sm": ["var(--font-hanken)"],
        "headline-md": ["var(--font-eb-garamond)"],
        "display-lg": ["var(--font-eb-garamond)"],
        "display-lg-mobile": ["var(--font-eb-garamond)"],
        "body-md": ["var(--font-hanken)"],
        "body-lg": ["var(--font-hanken)"]
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["40px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }]
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 15s ease infinite",
        float: "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ],
};

export default config;
