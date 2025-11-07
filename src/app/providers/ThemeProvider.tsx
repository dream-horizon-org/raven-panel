"use client";

import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { useThemeMode } from "./ThemeModeProvider";
import { getTheme } from "@/theme/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
