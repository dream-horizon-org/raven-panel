export const THEME_COLORS = {
  PRIMARY: {
    light: "#A51AFD",
    dark: "#9333ea",
    lightVariant: "#a855f7",
    darkVariant: "#7e22ce",
  },

  SECONDARY: {
    light: "#10b981",
    dark: "#22c55e",
    lightVariant: "#4ade80",
    darkVariant: "#16a34a",
  },

  BACKGROUND: {
    light: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    dark: {
      default: "#0a0a0a",
      paper: "#1a1a1a",
    },
  },

  TEXT: {
    light: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    dark: {
      primary: "#ffffff",
      secondary: "#9ca3af",
    },
  },

  DIVIDER: {
    light: "#e5e7eb",
    dark: "#374151",
  },

  ERROR: {
    main: "#ef4444",
  },

  GRAY: {
    "900": "#111827",
    "800": "#1f2937",
    "700": "#374151",
    "600": "#4b5563",
    "500": "#6b7280",
    "400": "#9ca3af",
    "300": "#d1d5db",
    "200": "#e5e7eb",
    "100": "#f3f4f6",
  },

  COMPONENTS: {
    tableContainerDark: "#1F201D",
  },

  SHADOWS: {
    light: {
      sm: "0px 1px 3px rgba(0, 0, 0, 0.05)",
      md: "0px 2px 8px rgba(0, 0, 0, 0.08)",
      lg: "0px 2px 8px rgba(0, 0, 0, 0.15)",
      xl: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
    dark: {
      sm: "0px 1px 3px rgba(0, 0, 0, 0.3)",
      md: "0px 2px 8px rgba(0, 0, 0, 0.4)",
      lg: "0px 2px 8px rgba(0, 0, 0, 0.5)",
      xl: "0px 4px 12px rgba(0, 0, 0, 0.6)",
    },
  },

  LABEL: {
    light: {
      bg: "rgba(173, 216, 230, 0.3)", // Light blue background for labels
    },
    dark: {
      bg: "rgba(173, 216, 230, 0.2)", // Slightly darker for dark mode
    },
  },

  CSS: {
    background: {
      light: "#ffffff",
      dark: "#0a0a0a",
    },
    foreground: {
      light: "#171717",
      dark: "#ededed",
    },
  },

  OVERLAY: {
    light: "rgba(255, 255, 255, 0.9)",
    dark: "rgba(26, 26, 26, 0.9)",
  },
} as const;

// Status color constants
export const STATUS_COLORS = {
  LIVE: {
    light: { bg: "#dcfce7", text: "#166534" }, // green-100, green-800
    dark: { bg: "#166534", text: "#86efac" }, // green-800, green-400
  },
  DRAFT: {
    light: { bg: "#f3f4f6", text: "#1f2937" }, // gray-100, gray-800
    dark: { bg: "#374151", text: "#d1d5db" }, // gray-700, gray-300
  },
  PAUSED: {
    light: { bg: "#fef9c3", text: "#854d0e" }, // yellow-100, yellow-800
    dark: { bg: "#854d0e", text: "#fde047" }, // yellow-800, yellow-400
  },
  SCHEDULED: {
    light: { bg: "#dbeafe", text: "#1e3a8a" }, // blue-100, blue-800
    dark: { bg: "#1e3a8a", text: "#93c5fd" }, // blue-800, blue-300
  },
  CONCLUDED: {
    light: { bg: "#f3e8ff", text: "#6b21a8" }, // purple-100, purple-800
    dark: { bg: "#6b21a8", text: "#c084fc" }, // purple-800, purple-400
  },
  TERMINATED: {
    light: { bg: "#fee2e2", text: "#991b1b" }, // red-100, red-800
    dark: { bg: "#991b1b", text: "#fca5a5" }, // red-800, red-300
  },
} as const;
