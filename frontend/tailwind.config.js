/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Color palette optimized for accessibility and MGNREGA branding
      colors: {
        // Primary brand colors (Government of India inspired)
        primary: {
          50: "#f0f9f3",
          100: "#dcf2e3",
          200: "#bce5cb",
          300: "#8dd1a8",
          400: "#57b87f",
          500: "#34a05f", // Main primary color - accessible contrast
          600: "#278249",
          700: "#22683d",
          800: "#1f5434",
          900: "#1c452c",
          950: "#0d261a",
        },
        // Secondary colors (Saffron/Orange inspired)
        secondary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Main secondary color
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        // Success colors (Green palette)
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
          950: "#052e16",
        },
        // Warning colors (Amber palette)
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
          950: "#451a03",
        },
        // Error colors (Red palette)
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
          950: "#450a0a",
        },
        // Info colors (Blue palette)
        info: {
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
          950: "#172554",
        },
        // Neutral grays with better accessibility
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },

      // Typography with better readability
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },

      // Enhanced spacing scale for better mobile-first design
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      // Typography scale optimized for accessibility
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },

      // Box shadows with better depth
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "elevation-1":
          "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        "elevation-2":
          "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
        "elevation-3":
          "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
        focus: "0 0 0 3px rgba(52, 160, 95, 0.5)",
      },

      // Border radius for consistent rounded corners
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
      },

      // Animation and transitions
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounce 1s ease-in-out 2",
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
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },

      // Screen sizes optimized for mobile-first
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      // Accessibility-focused utilities
      minHeight: {
        touch: "44px", // Minimum touch target size
      },
      minWidth: {
        touch: "44px", // Minimum touch target size
      },

      // Container max widths
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },

      // Z-index scale
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
        toast: "1080",
      },

      // Backdrop blur
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    // Forms plugin for better form styling
    require("@tailwindcss/forms")({
      strategy: "class",
    }),

    // Typography plugin for better text styles
    require("@tailwindcss/typography"),

    // Aspect ratio plugin
    require("@tailwindcss/aspect-ratio"),

    // Container queries plugin
    require("@tailwindcss/container-queries"),

    // Custom plugin for accessibility utilities
    function ({ addUtilities, addComponents, theme }) {
      // Accessibility utilities
      addUtilities({
        ".sr-only-focusable": {
          "&:not(:focus):not(:focus-within)": {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: "0",
          },
        },
        ".focus-visible-only": {
          "&:focus:not(:focus-visible)": {
            outline: "none",
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: theme("colors.primary.500"),
            outlineOffset: "2px",
          },
        },
        ".skip-link": {
          position: "absolute",
          top: "-40px",
          left: "6px",
          backgroundColor: theme("colors.primary.600"),
          color: theme("colors.white"),
          padding: "8px",
          textDecoration: "none",
          transition: "top 0.3s",
          zIndex: theme("zIndex.tooltip"),
          "&:focus": {
            top: "6px",
          },
        },
      });

      // Component utilities
      addComponents({
        ".btn-base": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme("borderRadius.button"),
          fontSize: theme("fontSize.sm")[0],
          fontWeight: theme("fontWeight.medium"),
          lineHeight: theme("fontSize.sm")[1].lineHeight,
          textAlign: "center",
          textDecoration: "none",
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          userSelect: "none",
          minHeight: theme("minHeight.touch"),
          minWidth: theme("minWidth.touch"),
          "&:focus": {
            outline: "none",
            boxShadow: theme("boxShadow.focus"),
          },
          "&:disabled": {
            opacity: "0.6",
            cursor: "not-allowed",
          },
        },
        ".btn-primary": {
          backgroundColor: theme("colors.primary.600"),
          color: theme("colors.white"),
          "&:hover:not(:disabled)": {
            backgroundColor: theme("colors.primary.700"),
          },
          "&:active": {
            backgroundColor: theme("colors.primary.800"),
          },
        },
        ".btn-secondary": {
          backgroundColor: theme("colors.secondary.600"),
          color: theme("colors.white"),
          "&:hover:not(:disabled)": {
            backgroundColor: theme("colors.secondary.700"),
          },
          "&:active": {
            backgroundColor: theme("colors.secondary.800"),
          },
        },
        ".btn-outline": {
          backgroundColor: "transparent",
          borderWidth: "2px",
          borderColor: theme("colors.primary.600"),
          color: theme("colors.primary.600"),
          "&:hover:not(:disabled)": {
            backgroundColor: theme("colors.primary.600"),
            color: theme("colors.white"),
          },
        },
        ".btn-ghost": {
          backgroundColor: "transparent",
          color: theme("colors.gray.700"),
          "&:hover:not(:disabled)": {
            backgroundColor: theme("colors.gray.100"),
          },
        },
        ".card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          "&:hover": {
            boxShadow: theme("boxShadow.card-hover"),
          },
        },
        ".metric-card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.card"),
          padding: theme("spacing.6"),
          boxShadow: theme("boxShadow.card"),
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme("boxShadow.card-hover"),
            transform: "translateY(-1px)",
          },
        },
        ".form-input": {
          borderRadius: theme("borderRadius.button"),
          borderWidth: "1px",
          borderColor: theme("colors.gray.300"),
          fontSize: theme("fontSize.base")[0],
          lineHeight: theme("fontSize.base")[1].lineHeight,
          padding: `${theme("spacing.3")} ${theme("spacing.4")}`,
          minHeight: theme("minHeight.touch"),
          "&:focus": {
            outline: "none",
            borderColor: theme("colors.primary.500"),
            boxShadow: theme("boxShadow.focus"),
          },
        },
        ".loading-skeleton": {
          backgroundColor: theme("colors.gray.200"),
          borderRadius: theme("borderRadius.DEFAULT"),
          animation: "pulse 1.5s ease-in-out infinite",
        },
      });
    },
  ],
};
