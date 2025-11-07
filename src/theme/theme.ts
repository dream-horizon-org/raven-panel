import { createTheme, PaletteOptions } from "@mui/material/styles";
import { THEME_COLORS } from "@/config/colors";

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: { main: THEME_COLORS.PRIMARY.light },
  secondary: { main: THEME_COLORS.SECONDARY.light },
  background: {
    default: THEME_COLORS.BACKGROUND.light.default,
    paper: THEME_COLORS.BACKGROUND.light.paper,
  },
  text: {
    primary: THEME_COLORS.TEXT.light.primary,
    secondary: THEME_COLORS.TEXT.light.secondary,
  },
  divider: THEME_COLORS.DIVIDER.light,
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: THEME_COLORS.PRIMARY.dark,
    light: THEME_COLORS.PRIMARY.lightVariant,
    dark: THEME_COLORS.PRIMARY.darkVariant,
  },
  secondary: {
    main: THEME_COLORS.SECONDARY.dark,
    light: THEME_COLORS.SECONDARY.lightVariant,
    dark: THEME_COLORS.SECONDARY.darkVariant,
  },
  background: {
    default: THEME_COLORS.BACKGROUND.dark.default,
    paper: THEME_COLORS.BACKGROUND.dark.paper,
  },
  text: {
    primary: THEME_COLORS.TEXT.dark.primary,
    secondary: THEME_COLORS.TEXT.dark.secondary,
  },
  error: { main: THEME_COLORS.ERROR.main },
  divider: THEME_COLORS.DIVIDER.dark,
  grey: {
    "900": THEME_COLORS.GRAY["900"],
    "800": THEME_COLORS.GRAY["800"],
    "700": THEME_COLORS.GRAY["700"],
    "600": THEME_COLORS.GRAY["600"],
    "500": THEME_COLORS.GRAY["500"],
    "400": THEME_COLORS.GRAY["400"],
  },
};

export const getTheme = (mode: "light" | "dark") => {
  const palette = mode === "light" ? lightPalette : darkPalette;

  return createTheme({
    palette,
    typography: {
      fontFamily: "Arial, Helvetica, sans-serif",
      h1: { fontSize: "1.875rem", fontWeight: 700 },
      h2: { fontSize: "1.875rem", fontWeight: 700 },
      body1: { fontSize: "0.875rem" },
      body2: { fontSize: "0.75rem" },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "0.5rem",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "0.5rem",
            border: "1px solid",
            borderColor: theme.palette.divider,
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.5rem",
              "& fieldset": { borderColor: theme.palette.divider },
            },
          }),
        },
      },
      MuiTable: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiTableCell-root": { borderColor: theme.palette.divider },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: "9999px", fontWeight: 500 },
        },
      },
    },
  });
};
